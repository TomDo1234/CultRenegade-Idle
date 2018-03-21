function clone(obj) {
    let newobj = new obj.constructor();
    for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            if (obj[attr] instanceof Element) {
                newobj[attr] = obj[attr].cloneNode(true);
            }
            else {
                newobj[attr] = obj[attr];
            }
        }
    }
    return newobj;
}

function flavoradd() {
    $.ajax({
        type: "GET",
        url:'theflavor.xml',
        dataType: "xml" ,
        success: function (xml){
            let theupgrade = $(xml).find("Upgrade");
            theupgrade.each(function(){
                let name = $(this).find('name').text();
                let flavor = $(this).find('flavor').text();
                upgrades.forEach(function(up) {
                    if (up.name === name) {
                        up.flavor = flavor;
                    }
                });
            });
        }
    });
}

function load(x) {
    let healthtrack = x.Healthbartrack;
    x.Healthbar.appendChild(healthtrack);
    healthtrack.innerHTML =  Math.round(x.health) + "/" + Math.round(x.MHea);
    healthtrack.style.width = Math.floor(x.health / x.MHea * 100).toString() + "%";
}

function encodetext(text) {
    let newtext = '';
    for (let index = 0; index < text.length; index ++ ) {
        newtext += String.fromCharCode(text.charCodeAt(index) + 7);
    }
    return newtext;
}

function decodetext(text) {
    let newtext = '';
    for (let index = 0; index < text.length; index ++ ) {
        newtext += String.fromCharCode(text.charCodeAt(index) - 7);
    }
    return newtext;
}

function exportsave() {
    savegame();
    let text = "";
    for (let i = 0; i < gamestats.length; i++){
        text += localStorage.getItem("Obj" + i);
    }
    text += localStorage.getItem("canupgrade") + ";[-]"; // ";[-]" is to separate it and add it to array for iteration.
    text += localStorage.getItem("upgraded") + ";[-]";
    text += localStorage.getItem("Saved?") + ";[-]";
    text += localStorage.getItem("allies") + ";[-]";
    text += localStorage.getItem("building") + ";[-]";
    text += localStorage.getItem("player") + ";[-]";
    text = encodetext(text);
    let thedate = new Date();
    let file = new Blob([text], {type: "application/octet-binary"});
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(file));
    link.setAttribute("download", player.name + "\xa0\xa0" + thedate.getDate() + "-" +
        (thedate.getMonth() + 1)  + "-" + thedate.getFullYear() + ".txt");
    link.click();
}

function localstorageparse(LS) {
    let parsed = [];
    let entry = '';
    let flag = false;
    for (let index = 0; index < LS.length; index ++ ) {
        entry += LS.charAt(index);
        if (flag === false) {
            if (LS.charAt(index) === '}') {
                parsed.push(entry);
                entry = '';
            }
            if (parsed.length === gamestats.length) {
                flag = true;
            }
        }
        else if (flag === true) {
            if (index + 5 <= LS.length) {
                if (LS.substring(index + 1, index + 5) === ";[-]") {
                    parsed.push(entry);
                    entry = '';
                    index += 4;
                }
            }
        }
    }
    return parsed;
}

function checksave(parsed) {
    let classobjs = [allies,buildings,playerinventory];
    let classobjnames = ["allies","buildings","playerinventory"];
    let foo;
    try {
        for (let index = 0; index < gamestats.length; index ++ ){
            foo = JSON.parse(parsed[index]);
        }
        foo = JSON.parse(parsed[gamestats.length]);
        foo += JSON.parse(parsed[gamestats.length + 1]);
        for (let count = 0; count < classobjs.length; count ++ ) {
            for (let index = 0; index < classobjs[count].length; index++) {
                foo += JSON.parse(localStorage.getItem(classobjnames[count]))[index];
            }
        }
        foo += JSON.parse(localStorage.getItem("player"));
    }
    catch (e) {
        return false;
    }
    if (foo === true) {
        // this is to prevent the unused variable warning on IDE, it is redundant otherwise.
    }
    return true;
}

function importsave(text) {
    let newtext = decodetext(text);
    let parsed = localstorageparse(newtext);
    if (!checksave(parsed)) {
        alert("Invalid Save!");
        return;
    }
    for (let index = 0; index < gamestats.length; index ++ ){
        let y = gamestats[index];
        let obj = JSON.parse(parsed[index]);
        if (y.constructor.name === "Object") {
            for (let attr in y) {
                if (y.hasOwnProperty(attr) && attr[0] !== "_") {
                    y[attr] = obj[attr];
                }
            }
        }
        else {
            Object.getOwnPropertyNames(Object.getPrototypeOf(y)).forEach(function (attr) {
                if (attr !== "constructor") {
                    y[attr] = obj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
                }
            });
        }
    }
    canupgrade = []; // gamestats.length + 2 is the {TRUE}
    upgraded = [];
    JSON.parse(parsed[gamestats.length]).forEach(function (y) {
        upgrades.forEach(function (ups) {
            if (ups.name === y.name) {
                canupgrade.push(ups);
            }
        });
    });
    JSON.parse(parsed[gamestats.length + 1]).forEach(function (y) {
        upgrades.forEach(function (ups) {
            if (ups.name === y.name) {
                upgraded.push(ups);
            }
        });
    });
    let classobjs = [allies,buildings];
    let classobjnames = ["allies","buildings"];
    for (let count = 0; count < classobjs.length; count ++ ) {
        for (let index = 0; index < classobjs[count].length; index++) {
            let y = classobjs[count][index];
            let obj = JSON.parse(localStorage.getItem(classobjnames[count]))[index];
            Object.getOwnPropertyNames(Object.getPrototypeOf(y)).forEach(function (attr) {
                if (attr !== "constructor") {
                    y[attr] = obj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
                }
            });
        }
    }
    let pobj = JSON.parse(localStorage.getItem("player"));
    Object.getOwnPropertyNames(Object.getPrototypeOf(player)).forEach(function (attr) {
        if (attr !== "constructor") {
            player[attr] = pobj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
        }
    });
    showupgrades();
    blacksmith();
    portal();
    $('#entersave').val('');
}

function levelbuildings() {
    switch(currentlevel.val){
        case 1:
            return [MercenaryGuild];
        case 2:
            return [MercenaryGuild,Portal];
        case 3:
            return [MercenaryGuild,Portal,Blacksmith];
        case 4:
            return [MercenaryGuild,Portal,Blacksmith,Spellshop];
        default:
            return [MercenaryGuild,Portal,Blacksmith,Spellshop];
    }
}

function levelupgrades() {
    let x;
    switch(currentlevel.val){
        case 1:
            x = [up1];
            break;
        case 2:
            x = [up1,up2];
            break;
        case 3:
            x = [up1,up2,up3];
            break;
        case 4:
            x = [up1,up2,up3,up5,up6,up7,up8];
            break;
        default:
            x = upgrades;
    }
    return x.filter(function(y) {
        return upgraded.indexOf(y) === -1;
    });
}

function a2clone(array) {
    let a  = [];
    for (let x = 0;x < array.length; x++) {
        a.push([]);
        for (let y = 0;y < array[x].length; y++) {
            a[a.length-1].push(clone(array[x][y]));
        }
    }
    return a;
}

function toggleplusminus(x) {
    let y;
    if (x.innerHTML.charAt(x.innerHTML.length - 1) === "+") {
        y = x.innerHTML.slice(0,-1) + "-";
    }
    else if (x.innerHTML.charAt(x.innerHTML.length - 1) === "-") {
        y = x.innerHTML.slice(0,-1) + "+";
    }
    x.innerHTML = y;
}

function toggleonoff(x) {
    let y;
    if (x.innerHTML.slice(x.innerHTML.length - 3,x.innerHTML.length) === " ON") {
        y = x.innerHTML.slice(0,-3) + " OFF";
    }
    else if (x.innerHTML.slice(x.innerHTML.length - 4,x.innerHTML.length) === " OFF") {
        y = x.innerHTML.slice(0,-3) + " ON";
    }
    x.innerHTML = y;
}

function wobble(x,y) {
    if (wobbleon === true) {
        if (y <= 0) {
            x.classList.add("dead");
            setTimeout(function () {
                x.classList.remove("dead");
            }, 600);
        }
        else {
            x.classList.add("wobbling");
            setTimeout(function () {
                x.classList.remove("wobbling");
            }, 600);
        }
    }
}

function levelup(x) {
    switch(x) {
        case 2:
            return [1,1,1];
        case 3:
            return [2,1,0];
        case 4:
            return [2,2,0];
        case 5:
            return [5,3,0,10];
        case 6:
            return [5,1,1,20];
        case 7:
            return [10,6,0,20];
        case 8:
            return [11,4,0,20];
        case 9:
            return [14,9,1,25];
        case 10:
            return [25,10,1,35];
        default:
            return [2,2,0,0];
    }
}

function levelMercs() {
    let array = [];
    switch(MercenaryGuild.Quantity) {
        case 2:
            array = [trainedbear,reanimatedcorpse,giant];
    }
    array.forEach(function(unit) {
       cantrain.push(unit);
    });
}

function xptolevelup(x) {
    switch(x) {
		case 3:
			return 125;
        case 4:
            return 325;
        case 5:
            return 922;
        case 6:
            return 10000;
        case 7:
            return 100001;
        case 8:
            return 500002;
        case 9:
            return 1999999;
        case 10:
            return 4444444;
        default:
            return 42;
    }
}

function debuff(type,x,duration,y) {
    switch(type) {
        case "speed":
            x.speed -= y;
            setTimeout(function(){x.speed += y},duration);
    }
}

function spelltrap(duration,damage,costadd,number,spell) {
    function thedamage() {
        let enemies = levelenemies[number];
        enemies[0].health -= damage * spell.trapnum[number];
        let enemypics = $("#Enemy");
        if (dungeon.val - 1 === number) {wobble(enemypics[0].children[0].children[0],enemies[0].health)}
        enemies.forEach(function(e) {
            if (e.health <= 0) {
                e.Loot();
                player.xp += e.xpr;
                MsgLog("1 " + e._name + " died");
                if (dungeon.val - 1 === number) {wobble(enemypics[0].children[enemies.indexOf(e)].children[0],e.health)}
                enemies.splice(enemies.indexOf(e),enemies.indexOf(e)+1);
                setTimeout(showfoes,500);
            }
        });
        if (enemies.length === 0) {
            for (let x = 0; x < ogenemies[number].length; x++) {
                let cope = clone(ogenemies[number][x]);
                enemies.push(cope);
            }
        }
        if (spell.trapnum[number] > 0) {
            setTimeout(thedamage,1000);
        }
    }
    spell.mcost += costadd;
    spell.trapnum[number] += 1;
    if (spell.trapnum[number] - 1 === 0) {
        thedamage();
    }
    timertrap[number].push(setTimeout(function() {spell._mcost -= costadd;spell.trapnum[number] -= 1},duration));
}

function removetrap(spell,costminus) {
    spell._mcost -= costminus;
    spell.trapnum[dungeon.val - 1] -= 1;
    clearTimeout(timertrap[dungeon.val - 1].pop());
    //line above is interesting... this removes last element of timertrap and clears the timer there at the same time!
}

function poison(thing,dam,dur) {
    let count = 0;
    function poisoning() {
        if (count <= dur/100) {
            count += 1;
            thing.health -= dam;
            if (player.health <= 0) {
                dungeon.val = 1;
            }
            setTimeout(poisoning,100);
        }
    }
    poisoning();
}

function flame(things,dam,dur) {
    let count = 0;
    function flaming() {
        if (count <= dur/500) {
            count += 1;
            things.forEach(function(thing) {
                thing.health -= dam;
                if (player.health <= 0) {
                    dungeon.val = 1;
                }
                if (thing.health <= 0) {
                    things.splice(things.indexOf(thing),1);
                }
            });
            setTimeout(flaming,500);
        }
    }
    flaming();
}
