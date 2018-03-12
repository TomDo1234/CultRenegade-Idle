class Player {
    constructor(Nam,Hea,Str,Spe,Arm,xp,MHea,Mxp) {
        this._name = Nam;
        this._health = Hea;
        this._strength = Str;
        this._speed = Spe;
        this._armor = Arm;
        this._xp = xp;
        this._MHea = MHea;
        this._Mxp = Mxp;
    }
    set name(val) {
        this._name = val;
        $("#Playername")[0].innerText = this._name;
    }
    get name() {
        return this._name;
    }
    set health(val) {
        if (val > this.MHea) {
            val = this.MHea;
        }
        if (val <= 0) {
            val = 0;
        }
        this._health = val;
        let phealthtrack = $("#phealthtrack")[0];
        phealthtrack.innerText = val + "/" + this._MHea;
        phealthtrack.style.width = Math.floor(val / this._MHea * 100).toString() + "%";
        if (val <= 0) {
            let count = 10;
            isdead = true;
            levelenemies[dungeon.val-1].forEach(function(enemy) {
                enemy.health = enemy.MHea;
            });
            let z = this;
            function revival() {
                if (count === 0) {
                    MsgLog("You are alive... again");
                    isdead = false;
                    z.health = 1;
                    return;
                }
                MsgLog("Reviving in " + count + "...");
                count -= 1;
                setTimeout(revival,1000);
            }
            MsgLog("YOU DIED");
            revival();
        }
    }
    get health() {
        return this._health;
    }
    set strength(val) {
        this._strength = val;
    }
    get strength() {
        return this._strength;
    }
    set speed(val) {
        this._speed = val;
    }
    get speed() {
        return this._speed;
    }
    set armor(val) {
        this._armor = val;
    }
    get armor() {
        return this._armor;
    }
    set xp(val) {
        let pxp = $("#pxp")[0];
        if (currentlevel.val < 5) {
            this._xp = val;
            if (val >= this._Mxp) {
                currentlevel.val += 1;
                this._xp = 0;
                this.Mxp = xptolevelup(currentlevel.val + 1);//+1 is there to make function give level requirement for levelling to x
                let statboost = levelup(currentlevel.val);
                this.MHea += statboost[0];
                this._strength += statboost[1];
                this._speed += statboost[2];
            }
            pxp.innerText = this.xp + "/" + this.Mxp;
        }
        else {pxp.innerText = "Max Level!";}
    }
    get xp() {
        return this._xp;
    }
    set MHea(val) {
        this._MHea = val;
        let phealthtrack = $("#phealthtrack")[0];
        phealthtrack.innerText = this._health + "/" + val;
        phealthtrack.style.width = Math.floor(this.health / this._MHea * 100).toString() + "%";
    }
    get MHea() {
        return this._MHea;
    }
    set Mxp(val) {
        let pxp = $("#pxp")[0];
        if (currentlevel.val < 5) {
            this._Mxp = val;
            pxp.innerText = this._xp + "/" + this._Mxp;
        }
        else {pxp.innerText = "Max Level!";}
    }
    get Mxp() {
        return this._Mxp;
    }
}

class Building {
    constructor(Cost,Quantity,Nam,flav = "TBA") {
        this._Cost = Cost;
        this._Quantity = Quantity;
        this.Nam = Nam;
        this.flavor = flav;
    }

    set Cost(val) {
        this._Cost = val;
        showbuildings();

    }

    get Cost() {
        let z = this;
        return z._Cost.map(function(y) {return y * (100**z.Quantity)});
    }

    set Quantity(val) {
        this._Quantity = val;
        showbuildings();
        showMercenaries();
    }
    get Quantity() {
        return this._Quantity;
    }
}

class Item {
    constructor(Nam,Val,UQua,discovered,type,img = "goblin1.png",flavor = "",attack=null,defense=null,speed=null) {
        this._name = Nam;
        this._Value = Val;
        this._UEQuantity = UQua;
        this._EQuantity = 0;
        this.discovered = discovered;
        this.flavor = flavor;
        this._attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.type = type;
        this._img = img;
    }

    set attack(val) {
        this._attack = val;
    }

    get attack() {
        let tempattackmod = this._attack === null ? 0 : attackmod.val;
        return this._attack + tempattackmod;
    }

    get img() {
        return "img/" + this._img;
    }

    get Value() {
        return this._Value;
    }

    set UEQuantity(val) {
        if (this.UEQuantity + this.EQuantity === 0) {
            playerinventory.push(this);
        }
        this._UEQuantity = val;
        if (val + this.EQuantity <= 0) {
            playerinventory.splice(playerinventory.indexOf(this),playerinventory.indexOf(this) + 1);
        }
        inventory();
        if (Market.Quantity > 0) {
            market();
        }
    }
    get UEQuantity() {
        return this._UEQuantity;
    }
    set EQuantity(val) {
        if (this.UEQuantity + this.EQuantity === 0) {
            playerinventory.push(this);
        }
        this._EQuantity = val;
        if (val + this.UEQuantity <= 0) {
            playerinventory.splice(playerinventory.indexOf(this),playerinventory.indexOf(this) + 1);
        }
        inventory();
        if (Market.Quantity > 0) {
            market();
        }
    }

    get EQuantity() {
        return this._EQuantity;
    }
}

class Ally {

    constructor(Nam,Hea,Str,Spe,Arm,Cost,MHea,Qua,Idle,farm,flavor) {
        this._name = Nam;
        this._health = Hea;
        this._strength = Str;
        this._speed = Spe;
        this._armor = Arm;
        this._Cost = Cost;
        this._MHea = MHea;
        this._AQuantity = Qua;
        this._IQuantity = Idle;
        this._farm = farm;
        this.flavor = flavor;
        this._Ibonus = 1;
        this.Healthbar = document.createElement("DIV");this.Healthbar.classList.add("Healthbar");this.Healthbar.classList.add("ally");
        this.Healthbartrack = document.createElement("DIV");this.Healthbartrack.classList.add("Healthtrack");
    }

    set name(val) {
        this._name = val;
    }
    get name() {
        return this._name;
    }
    set health(val) {
        if (val > this.MHea) {
            val = this.MHea;
        }
        this._health = val;
        showidle();
    }
    get health() {
        return this._health;
    }
    set strength(val) {
        this._strength = val;
    }
    get strength() {
        return this._strength;
    }
    set speed(val) {
        this._speed = val;
    }
    get speed() {
        return this._speed;
    }
    set armor(val) {
        this._armor = val;
    }
    get armor() {
        return this._armor;
    }
    set Cost(val) {
        this._Cost = val;
    }
    get Cost() {
        let z = this; // the reason why z is here is because some unknown error with the .map not recognizing "this"
        return z._Cost.map(function(y) {return Math.floor(y * 1.1 ** (z.IQuantity + z.AQuantity))});
    }
    set MHea(val) {
        this._MHea = val;
    }
    get MHea() {
        return this._MHea;
    }
    set IQuantity(val) {
        this._IQuantity = val;
        showidle();
        showMercenaries();
    }
    get IQuantity() {
        return this._IQuantity;
    }
    set AQuantity(val) {
        this._AQuantity = val;
        showidle();
        showMercenaries();
    }
    get AQuantity(){
        return this._AQuantity;
    }
    set farm(val) {
        this._farm = val;
    }
    get farm() {
        let z = this;
        return z._farm.map(function(y) {return y * z._Ibonus});
    }
    set flavor(val) {
        this._flavor = val;
    }
    get flavor() {
        return this._flavor;
    }
    set Ibonus(val) {
        this._Ibonus = val;
    }
    get Ibonus() {
        return this._Ibonus;
    }

}

class Foe {

    constructor(Nam,Hea,Str,Spe,Loo,Arm,xpr,flav = "",img = "Genericgoblin1.png") {
        this._name = Nam;
        this._health = Hea;
        this._strength = Str;
        this._speed = Spe;
        this.loot = Loo;
        this.armor = Arm;
        this.xpr = xpr;
        this.flavor = flav;
        this._img = img;
        this._MHea = this._health;
        this.Healthbar = document.createElement("DIV");this.Healthbar.classList.add("Healthbar");
        this.Healthbartrack = document.createElement("DIV");this.Healthbartrack.classList.add("Healthtrack");
    }

    toJSON() {
        return {name: this._name,health:this._health,strength:this._strength,speed:this._speed,loot:this.loot};
    }

    set health(val) {
        if (val > this.MHea) {
            val = this.MHea;
        }
        if (val <= 0) {
            val = 0;
        }
        this._health = val;
        load(this);
    }

    get health() {
        return this._health;
    }

    set strength(val) {
        this._strength = val;
    }
    get strength() {
        return this._strength;
    }
    set speed(val) {
        this._speed = val;
    }
    get speed() {
        return this._speed;
    }

    set MHea(val) {
        this._MHea = val;
        load(this);
    }
    get MHea() {
        return this._MHea;
    }

    get img() {
        return "img/" + this._img;
    }

    Loot() {
        for (let x = 0;x < this.loot.length;x += 3) {
            if (Math.floor(Math.random() * 1000) <= this.loot[x+2]) {
                if (this.loot[x].constructor.name === "Item") {
                    this.loot[x].UEQuantity += 1;
                }
                else  {
                    this.loot[x].val += this.loot[x+1];
                }
            }
        }
    }

}

class Upgrade {
    constructor(Nam,Cost,iurl,flavor) {
        this.name = Nam;
        this.Cost = Cost;
        this.iurl = iurl;
        this.flavor = flavor;
    }
    toJSON() {
        return {name: this.name};
    }

}

function fight(attack,enemies,index,allies,idle = false) {
    let str = player._strength;
    let Order = [];
    let theallies = [];
    let totalbonusattack = 0;
    let totalbonusdefense = 0;
    playerinventory.forEach(function(x) {
        totalbonusattack += x.attack * x.EQuantity;
        totalbonusdefense += x.defense * x.EQuantity;
    });
    allies.forEach(function(x) {
        if (x.AQuantity > 0) {
            Order.push(x);
            theallies.push(x);
        }
    });
    if (idle === false) {
        Order.push(player);
        enemies.forEach(function(x) {
            Order.push(x);
        });
    }
    Order.sort(function(a, b) {
        return b._speed - a._speed;
    });
    let enemypics = $("#Enemy");
    for (let x = 0; x < Order.length; x++) {
        switch(Order[x].constructor.name) {
            case "Player":
                switch (attack) {
                    case "Stab":
                        enemies[0].health -= (str + totalbonusattack - enemies[0].armor);
                        MsgLog("You stabbed a " + enemies[0]._name + "<br>");
                        wobble(enemypics[0].children[0].children[0],enemies[0].health);
                        break;
                    case "Slash":
                        enemies[0].health -= (str + totalbonusattack - enemies[0].armor);
                        wobble(enemypics[0].children[0].children[0],enemies[0].health);
                        if (enemies.length === 1) {
                            MsgLog("You slashed a " + enemies[0]._name + "<br>");
                        }
                        else if (enemies.length >= 2) {
                            enemies[1].health -= (str + totalbonusattack - enemies[0].armor);
                            MsgLog("<br>You slashed two " + enemies[1]._name + "s" + "<br>");
                            wobble(enemypics[0].children[1].children[0],enemies[1].health);
                        }
                        break;
                }

                break;
            case "Ally":
                let whosattackingnum = (idle === false) ? Order[x].AQuantity : Order[x].IQuantity;
                enemies[0].health -= (Order[x].strength - enemies[0].armor) * whosattackingnum;
                break;
            case "Foe":
                if (theallies.length > 0) {
                    if (!(Order[x].strength  - theallies[0].armor <= 0)) {
                        theallies[0].health -= Order[x].strength  - theallies[0].armor;
                    }
                    if (theallies[0].health <= 0 && idle === false) {
                        if (theallies[0].AQuantity > 0) {
                            theallies[0].AQuantity -= 1;
                        }
                        theallies[0].health = theallies[0].MHea;
                    }
                }
                else {
                    if (!(Order[x].strength  - player.armor - totalbonusdefense <= 0)) {
                        player.health -= Order[x].strength - player.armor - totalbonusdefense;
                        wobble($("#Playerpic")[0],player.health);
                    }
                    if (player.health <= 0 && idle === false) {
                        return;
                    }
                }
                break;
        }
        enemies.forEach(function(e) {
            if (e.health <= 0) {
                e.Loot();
                player.xp += e.xpr;
                MsgLog("1 " + e._name + " died");
                wobble(enemypics[0].children[enemies.indexOf(e)].children[0],e.health);
                enemies.splice(enemies.indexOf(e),enemies.indexOf(e)+1);
                Order.splice(Order.indexOf(e),Order.indexOf(e)+1);
                setTimeout(showfoes,500);
            }
        });
        if (enemies.length === 0) {
            for (let x = 0; x < ogenemies[index].length; x++) {
                let cope = clone(ogenemies[index][x]);
                enemies.push(cope);
            }
            break;
        }
    }
}

function MsgLog(msg) {
    let list = $('#Msg')[0];
    let holder = document.createElement('li');
    holder.innerHTML = msg;
    $(holder).hide();
    list.insertBefore(holder, list.firstChild);
    $(holder).fadeIn(500);
    while (list.children.length > 10) {
        list.removeChild(list.lastChild);
    }
}

function showfoes() {
    let enemypanel = $("#Enemy");
    enemypanel.empty();
    levelenemies[dungeon.val-1].forEach(function(enemy) {
        let image = new Image();
        let holder = document.createElement("DIV");
        let tooltip = $('#Enemytooltip');
        holder.classList.add("Eholder");
        enemypanel[0].appendChild(holder);
        image.src = enemy.img;
        image.classList.add("Entity");
        image.onmouseenter = function() {
            tooltip[0].innerHTML = enemy._name + "<br><br>" + "Attack: " + enemy.strength + "<br>" + "Armor: " + enemy.armor +
                "<br>" + "Speed: " + enemy.speed;
            tooltip.show();
        };
        image.onmouseout = function() { if (!tooltip[0].matches(':hover')) {tooltip.hide()}};
        tooltip[0].onmouseout = function() { if (!tooltip[0].matches(':hover')) {tooltip.hide()}};
        holder.appendChild(image);
        holder.appendChild(enemy.Healthbar);
        load(enemy);
    });
}

function showidle() {
    let list = $('#allies');
    list.empty();
    allies.forEach(function (ally) {
        if (ally.IQuantity + ally.AQuantity > 0) {
            let holder = document.createElement('li');
            let thetext = document.createElement('DIV');
            let a = ally.AQuantity;
            let b = ally.IQuantity;
            thetext.innerText = a.toString() + "\xa0\xa0\xa0" + ally._name + "\xa0\xa0\xa0" + b.toString();
            thetext.style.cssFloat = "right";
            holder.appendChild(ally.Healthbar);holder.appendChild(thetext);
            list[0].insertBefore(holder, list.firstChild);
            let slider = document.createElement('input');
            slider.type = "range";
            slider.min = "0";
            slider.max = (a + b).toString();
            slider.value = b.toString();
            slider.onchange = function () {
                let val = Number(slider.value);
                ally.IQuantity = val;
                ally.AQuantity = Number(slider.max) - val;
                thetext.innerText = ally.AQuantity + "\xa0\xa0\xa0" + ally._name + "\xa0\xa0\xa0" + ally.IQuantity;
            };
            list[0].insertBefore(slider, list.lastChild);
            load(ally);
        }
    });
}

function checkpersec() {
    let bps = 0;
    let sps = 0;
    let gps = 0;
    allies.forEach(function(a) {
        let b = a.IQuantity * a.farm[0] - resources[0].mod;
        let s = a.IQuantity * a.farm[1];
        let g = a.IQuantity * a.farm[2];
        bps += b; sps += s; gps += g;
    });
    $("#bps")[0].innerText = parseFloat(bps.toFixed(4)).toString() + "/s";
    $("#sps")[0].innerText = parseFloat(sps.toFixed(4)).toString() + "/s";
    $("#gps")[0].innerText = parseFloat(gps.toFixed(4)).toString() + "/s";
}

function idlestuff() {
    let bps = 0;
    let sps = 0;
    let gps = 0;
    allies.forEach(function(a) {
        let b = a.IQuantity * a.farm[0] - resources[0].mod;
        let s = a.IQuantity * a.farm[1];
        let g = a.IQuantity * a.farm[2];
        resources[0].val += b;
        resources[1].val += s;
        resources[2].val += g;
        bps += b; sps += s; gps += g;
    });
    setTimeout(idlestuff,1000);
}

function checkforevents() {
    let eventplace = $("#Events");
    for (let x = 0; x < playerinventory.length; x++) {
        if (playerinventory[x].discovered === false) {
            switch (playerinventory[x]) {
                case plainuselesslocket:
                    MsgLog("A stranger inquires about the locket you just recieved");
                    let thebutton = document.createElement("BUTTON");thebutton.classList.add('class2');
                    thebutton.innerText = "Show him the locket";thebutton.id = "event1";
                    thebutton.onclick = function() {
                        MsgLog("Ah! This thing is currently useless, but if you find anything that actually isn't worthless" +
                            " feel free to stop by me, I have a market set up and hidden nearby, it is near my friend's hidden bank too!");
                        build(Market,"d");
                        build(Bank,"d");
                        $("#event1").remove();
                        inventory();
                    };
                    eventplace[0].appendChild(thebutton);
                    break;
            }
            playerinventory[x].discovered = true;
        }
    }
}

function inventory() {
    let fod = $('#inventory');
    fod.empty();
    let mlist = fod[0];
    let tooltip = $('#invtooltip')[0];
    playerinventory.forEach(function(x) {
        let thediv = document.createElement("DIV");thediv.classList.add("inventoryicon");
        let sellbut = document.createElement("BUTTON");sellbut.classList.add("class1");sellbut.classList.add("tooltiputil");
        let equipbut = document.createElement("BUTTON");equipbut.classList.add("class1");equipbut.classList.add("tooltiputil");
        thediv.style.backgroundImage = "url(" + x.img +")";
        thediv.id = x._name;thediv.style.display = "inline-block";
        thediv.onmouseenter = function tooltipappear() {
            tooltip.innerHTML = "";
            tooltip.style.display = "block";
            if (x.attack !== null && x.defense !== null && x.speed !== null) {
                tooltip.innerHTML = x._name + "<br><br>" + "Attack: " + x.attack + "<br>"
                    + "Defense: " + x.defense + "<br>"
                    + "Speed: " + x.speed + "<br>" + "Quantity: " + (x.UEQuantity + x.EQuantity) + "<br><br>";
                if (x.EQuantity === 1) {
                    equipbut.innerHTML = "Unequip";
                    equipbut.onclick = function () {
                        x._UEQuantity += 1;
                        x.EQuantity -= 1;
                        tooltip.style.display = "none";
                        tooltipappear();
                    };
                }
                else {
                    equipbut.innerHTML = "Equip";
                    equipbut.onclick = function () {
                        x._EQuantity += 1;
                        x.UEQuantity -= 1;
                        tooltip.style.display = "none";
                        tooltipappear();
                    };
                }
                tooltip.appendChild(equipbut);
            }
            let flavortext = document.createElement("DIV");flavortext.innerHTML = x.flavor.italics();
            tooltip.appendChild(flavortext);
            if (Market.Quantity > 0) {
                tooltip.appendChild(document.createElement("BR"));tooltip.appendChild(document.createElement("BR"));
                sellbut.innerHTML = "Sell: " + + Math.ceil(x.Value[0] / 4)
                    + "/" + Math.round(x.Value[1] / 4) + "/" + Math.ceil(x.Value[2] / 4);
                sellbut.onclick = function () {
                    sell(x);
                    if (x.EQuantity + x.UEQuantity <= 0) {$(tooltip).hide()}
                };
                tooltip.append(sellbut);
            }
        };
        thediv.onmouseout = function tooltipdisappear() { if (!tooltip.matches(':hover')) {tooltip.style.display = "none"}};
        tooltip.onmouseout = function() { if (!tooltip.matches(':hover')) {tooltip.style.display = "none"}};
        mlist.appendChild(thediv);
    });
}

function refresh() {
    checkforevents();
    checkpersec();
    setTimeout(refresh,200);
}

function regen() {
    if (isdead === false) {
        player.health += 1;
    }
    allies.forEach(function(ally) {
        ally.health += 1;
    });
    setTimeout(regen, 2000);
}

function continueprogress() {
    $('#namegetter2').remove();
    showfoes();
    showbuildings();
    showupgrades();
    idlestuff();
    $("#everything").show();
    refresh();
    regen();
}

function game() {
    let inputfield = $('#namegetter2');
    let name = inputfield.val();
    name = name.replace(/</g, '&lt');
    name = name.replace(/>/g, '&gt');
    if (name === "") {
        name = "Poophead!";
        MsgLog("You didn't enter a name... 'Poophead!' it is!")
    }
    MsgLog("Hello " + name + "!");
    player.name = name;//player.xp=500;player.xp=500;player.xp=500;player.strength=50000;player.speed=123;player.xp=50000;
    inputfield.remove();
    showfoes();
    showbuildings();inventory();
    showupgrades();
    idlestuff();
    $("#pxp")[0].innerText = player._xp + "/" + player._Mxp;
    $('#Bronze')[0].innerText = "Bronze: " + Math.floor(playerbronze._val);
    $('#Silver')[0].innerText = "Silver: " + Math.floor(playersilver._val);
    $('#Gold')[0].innerText = "Gold: " + Math.floor(playergold._val);
    $('#plevel')[0].innerHTML = "Level: " + currentlevel._val;
    $("#everything").show();
    refresh();
    regen();
}

function train(x) {
    let thecost = x.Cost;
    for (let y = 0; y < resources.length; y++) {
        if (resources[y].val - thecost[y] < 0) {
            MsgLog("Not enough resources");
            return;
        }
    }
    for (let y = 0; y < resources.length; y++) {
        resources[y].val -= thecost[y];
    }
    x.IQuantity += 1;
    MsgLog("you have trained 1 " + x._name);
}

function showMercenaries() {
    $('#merc').empty();
    if (MercenaryGuild.Quantity > 0) {
        cantrain.forEach(function (unit) {
            let mlist = $('#merc');
            let thebutton = document.createElement("BUTTON");thebutton.classList.add("Mercs");
            thebutton.innerHTML = unit._name;
            let tooltip = $('#unittooltip')[0];
            thebutton.id = unit._name;thebutton.style.minHeight = "4.5vh";
            thebutton.onmouseenter = function() {
                tooltip.innerHTML = unit._name + "<br><br>" + "Attack: " + unit._strength + "<br>" + "Health: " + unit._MHea +
                    "<br>" + "Armor: " + unit._armor + "<br>" + "Speed: " + unit._speed
                    + "<br><br>" + unit.flavor.italics() + "<br><br>" +
                    "Cost: " + unit.Cost[0] + "/" + unit.Cost[1] + "/" + unit.Cost[2];
                tooltip.style.display = "block"
            };
            thebutton.onmouseout = function() {tooltip.style.display = "none"};
            thebutton.onclick = function () {
                train(unit);
            };
            mlist.append(thebutton);
        });
    }
}

function blacksmith() {
    let u = $('#Blacksmithshop');
    u.empty();
    if (Blacksmith.Quantity > 0) {
        $('#Blacksmithbut').show();
        theblacksmith.forEach(function (x) {
            let thebutton = document.createElement("BUTTON");
            let tooltip = $("#bltooltip")[0];
            thebutton.id = x._name;
            thebutton.classList.add("blacksmith");
            thebutton.style.backgroundImage = "url(" + x.img + ")";
            thebutton.onmouseenter = function () {
                tooltip.innerHTML = x._name + "<br><br>" + "Attack: " + x.attack + "<br>"
                    + "Defense: " + x.defense + "<br>"
                    + "Speed: " + x.speed +
                    x.flavor.italics() + "<br><br>" +
                    "Cost: " + x.Value[0] + "/" + x.Value[1] + "/" + x.Value[2];
                tooltip.style.display = "block";
            };
            thebutton.onmouseout = function () {
                tooltip.style.display = "none"
            };
            thebutton.onclick = function () {
                buyitem(x); // REMEMBER partial from python?
            };
            u[0].appendChild(thebutton);
        });
    }
    else {
        $('#Blacksmithbut').hide();
    }
}

function portal() {
    if (Portal.Quantity > 0) {
        for (let x = 0; x < currentlevel.val && x < 5; x++) {
            let thebutton = document.getElementById("D " + x);
            if (thebutton === null) {
                let button = document.createElement("BUTTON");
                button.id = "D " + x;
                button.innerHTML = "Dungeon " + (x + 1);
                button.classList.add("class1");
                button.classList.add("portal");
                button.onclick = function () {
                    if (isdead === false) {
                        dungeon.val = x + 1;
                        MsgLog("You have travelled to Dungeon " + (x + 1));
                    }
                };
                $("#portal1")[0].appendChild(button);
            }
        }
    }
}

function buyupgrade(x) {
    let thecost = x.Cost;
    for (let x = 0; x < resources.length; x++) {
        if (resources[x].val - thecost[x] < 0) {
            MsgLog("Not enough resources");
            return;
        }
    }
    for (let x = 0; x < resources.length; x++) {
        resources[x].val -= thecost[x];
    }
    switch(x) {
        case up1:
            playerbronze.mod += 1;
            break;
        case up2:
            GenericSpearman.Ibonus *= 2;
            break;
        case up3:
            attackmod.val += 1;
            break;
    }
    canupgrade.splice(canupgrade.indexOf(x),1);
    upgraded.push(x);
    $("#uptooltip").hide();
    showupgrades();
    MsgLog(x.name + " upgrade purchased");
}

function buyitem(x) {
    let thecost = x.Value;
    for (let x = 0; x < resources.length; x++) {
        if (resources[x].val - thecost[x] < 0) {
            MsgLog("Not enough resources");
            return;
        }
    }
    for (let x = 0; x < resources.length; x++) {
        resources[x].val -= thecost[x];
    }
    x.UEQuantity += 1;
    MsgLog(x._name + " was purchased");
}

function bank() {
    let thebank = $("#Bank");
    thebank.empty();
    let loan = document.createElement("BUTTON"); //In progress
    loan.innerText = "Recieve a 1 silver loan";
}

function build(x,y = "b") {
    let thecost = x.Cost;
    for (let x = 0; x < resources.length; x++) {
        if (resources[x].val - thecost[x] < 0) {
            MsgLog("Not enough resources");
            return;
        }
    }
    for (let x = 0; x < resources.length; x++) {
        resources[x].val -= thecost[x];
    }
    x.Quantity += 1;
    switch(x) {
        case MercenaryGuild:
            showMercenaries();
            break;
        case Portal:
            portal();
            break;
        case Market:
            market();
            break;
        case Blacksmith:
            $("#Blacksmithbut").show();
            blacksmith();
            break;
        case Bank:
            bank();
            break;
    }
    if (y === "b") {
        MsgLog("1 " + x.Nam + " built");
    }
    else if (y === "d") {
        MsgLog(x.Nam + " discovered");
    }
}

function sell(x) {
    for (let y = 0; y < 3; y++) {
        resources[y].val += Math.ceil(x.Value[y]/4);
    }
    if (x.EQuantity === 0) {
        x.UEQuantity -= 1;
    }
    else {
        x.EQuantity -= 1;
    }
}

function market() {
    let u = $("#Market");
    u.empty();
    /*
    playerinventory.forEach(function(e) {
        if (e.Quantity > 0) {
            let thebutton = document.createElement("BUTTON");
            thebutton.id = e._name;
            thebutton.innerText = e._name + "\n" + "Sell: " + Math.round(e.Value[0] / 4)
                + "/" + Math.round(e.Value[1] / 4) + "/" + Math.round(e.Value[2] / 4);
            thebutton.onclick = function () {
                sell(e);
            };
            u.append(thebutton);
        }
    });*/
}

function showupgrades() {
    let u = $("#Upgrades");
    u.empty();
    canupgrade.forEach(function(x) {
        let thebutton = document.createElement("BUTTON");
        let tooltip = $("#uptooltip")[0];
        thebutton.id = x.name;thebutton.className += " Upgrade";
        thebutton.style.backgroundImage = "url(" + x.iurl + ")";
        thebutton.onmouseenter = function() {
            tooltip.innerHTML = x.name + "<br><br>" + x.flavor.italics() + "<br><br>" +
                "Cost: " + x.Cost[0] + "/" + x.Cost[1] + "/" + x.Cost[2];
            tooltip.style.display = "block";
        };
        thebutton.onmouseout = function() {tooltip.style.display = "none"};
        thebutton.onclick = function () {
            buyupgrade(x); // REMEMBER partial from python?
        };
        u.append(thebutton);
    });
}



function showbuildings() {
    let buildings1 = $("#buildings1");
    buildings1.empty();
    let tooltip = $("#buildtooltip");
    canbuild.forEach(function(x) {
        let thebutton = document.createElement("BUTTON");thebutton.classList.add("buildings");
        thebutton.id = x.Nam;
        thebutton.innerHTML = x.Nam + ": " + x.Quantity + "<br>" + "Cost: " + x.Cost[0]
            + "/" + x.Cost[1] + "/" + x.Cost[2];
        thebutton.onclick = function () {
            build(x); // REMEMBER partial from python?
        };
        thebutton.onmouseenter = function() {
            tooltip[0].innerText = x.flavor;
            tooltip.show();
        };
        thebutton.onmouseout = function() {
            tooltip.hide();
        };
        buildings1[0].appendChild(thebutton);
    });
}

let reducecheatclick = false;

let plainuselesslocket = new Item("Plain Useless Locket",[0,0,0],0,false,"Amulet","plainuselesslocket.png","A plain useless Locket. Pretty much its namesake");
let ReavingDecapitator = new Item("The Reaving Decapitator",[1920,0,0],0,false,"Sword","reavingdecapitator.png","",12,0,1);
let TheSafe = new Item("The Safe",[1920,0,0],0,false,"Shield","thesafe.png","",0,12,-1);

let attackmod = {
    _val: 0,
    set val(value) {
        this._val = value;
    },
    get val() {
        return this._val;
    }
};

let playerinventory = [];

let MercenaryGuild = new Building([30,0,0],0,"Mercenary Guild","Mercenaries hunt during hunt for you during their spare time and" +
    " help you during battles. Most of them are Generic though... like those unnamed movie grunts");

let Portal = new Building([100,0,0],0,"Portal","Travel to other places. The more you have the more types of places you can go, the " +
    "higher level you are the places of the acquired types you can go. \n\n CAUTION - Don't get 4 of these");

let Bank = new Building([0,0,0],0,"Bank","A safe place to store your money, at a price... (Is this an Oxymoron? Can't tell.)");

let Blacksmith = new Building([300,0,0],0,"Blacksmith", "It is always better to just make your own weapon. But some people are " +
    "just too lazy so they buy it for an increased price (How else does the Blacksmith profit?).");

let Market = new Building([0,0,0],0,"Market","A place to sell your loot for a lower price... Which then gets sold again for the " +
    "actual price.");

let buildings = [MercenaryGuild,Portal,Blacksmith];

let canbuild = [MercenaryGuild];
let theblacksmith = [ReavingDecapitator,TheSafe];


let up1 = new Upgrade("Fundamental Skin Science",[75,0,0],"img/skinscience1.png",
    "the skin of any organism can be transmuted into bronze by soaking it with water and then wringing it in a 41-43 degrees celcius " +
    "enviromnent for 399 seconds. <br><br> +1 Bronze for every kill, even the idle kills");

let up2 = new Upgrade("Blood Spear Fishing",[300,0,0],"img/bloodspearfishing1.png",
    "Out of the approximately 2791741.5 species of fish (Yes... there is are several half-fishes), thousands of them are attracted" +
    " to blood. Blood is good bait but it can be dangerous to have carnivorous animals know where you are." +
    " 'Blood Spear Fishing' is like a fishing-martial-art that makes using Blood safe in fishing. <br><br> Doubles Spearman Idle Revenue");

let up3 = new Upgrade("Whetfish Ichthyology",[2000,0,0],"img/whetfishichthyology1.png",
    "The Whetfish is a very common species, many can find it... few can use it. The magical scales and saliva of the fish can either " +
    "harden solids or empower other magical sources. As you can already tell it is used to make weapons stronger" +
    ", hence its name which is derived from the 'whetstone' (And yes... the picture in the icon is an annotated" +
    " Diagram of the fish). <br><br> +1 Attack for all Weapons");

let canupgrade = [up1];
let upgraded = [];
let upgrades = [up1,up2,up3];

let GenericSpearman = new Ally ("Generic Spearman",1,1,1,1,[20,0,0],1,0,0,[0.2,0,0],"A plain old spearman, payed to aid " +
    "you in direct or combat or hunt for treasure during free time.");

let GenericSwordsman = new Ally ("Generic Swordsman",22,9,3,3,[200,0,0],22,0,0,[2,0,0],"A Swordsman, trained killers... " +
    "it is said in legend that the sword was the first man-made tool designed solely to kill.");

let GenericKnight = new Ally ("Generic Knight",200,18,3,7,[2000,0,0],200,0,0,[22,0,0],"Knights, elite killers among the common men. " +
    "Trained to kill,raised to kill, pretty much born to kill.");

let allies = [GenericSpearman,GenericSwordsman,GenericKnight];

let cantrain = [GenericSpearman,GenericSwordsman,GenericKnight];

let player = new Player("PoopHead!",5,1,1,1,0,5,50);
let isdead = false;
let wobbleon = true;

let title = "RPG IDLE OF DOOM";
let setattack = "Stab";

document.title = title;

let playerbronze = {
        _val : 5000,
        _mod : 0,
        set val(value) {
            this._val = value + this.mod;
            $('#Bronze')[0].innerText = "Bronze: " + Math.floor(this._val);
        },
        get val() {
            return this._val;
        },
        set mod(value) {
            this._mod = value;
        },
        get mod() {
            return this._mod;
        }
    },
    playersilver = {
        _val : 0,
        set val(value) {
            this._val = value;
            $('#Silver')[0].innerText = "Silver: " + Math.floor(this._val);
        },
        get val() {
            return this._val;
        }
    },
    playergold = {
        _val : 0,
        set val(value) {
            this._val = value;
            $('#Gold')[0].innerText = "Gold: " + Math.floor(this._val);
        },
        get val() {
            return this._val;
        }
    },
    currentlevel = {
        _val : 1,
        set val(value) {
            this._val = value;
            $('#plevel')[0].innerHTML = "Level: " + this._val;
            canupgrade = levelupgrades();
            canbuild = levelbuildings();
            portal();
            showbuildings();
            showupgrades();
        },
        get val() {
            return this._val;
        }
    };


let resources = [playerbronze,playersilver,playergold];

let dungeon = {
    _val : 1,
    set val(value) {
        this._val = value;
        showfoes();
    },
    get val() {
        return this._val;
    }
};
let goblin = new Foe("Generic Goblin", 1, 1, 1, [playerbronze,1,1000],0,1,"","Genericgoblin1.png");
let imp = new Foe("Generic Imp", 5, 2, 1, [playerbronze,2,1000],0,2,"","Genericimp1.png");
let snake = new Foe("Generic Snake",30,5,7,[playerbronze,40,1000],3,20,"","Genericsnake1.png");
let goblin1 = new Foe("Killer Goblin Novice",100,10,3,[playerbronze,200,1000],7,120,"","goblin1.png");
let boss1 = new Foe("Frosty Abomination Fourth Class",800,50,12,[plainuselesslocket,1,1000,playerbronze,40000,1000],0,5000
    ,"","boss1.png");

let ogenemies = [[goblin],[imp],[snake,snake,snake,snake],[goblin1,goblin1,goblin1],[boss1]];
let levelenemies = a2clone(ogenemies);


let gamestats = [playerbronze,playersilver,playergold,currentlevel,dungeon,attackmod];

function savegame() {
    let count = 0;
    gamestats.forEach(function(y) {
        let Json = JSON.stringify(y);
        localStorage.setItem("Obj" + count,Json);
        count += 1;
    });
    localStorage.setItem("canupgrade",JSON.stringify(canupgrade));
    localStorage.setItem("upgraded",JSON.stringify(upgraded));
    localStorage.setItem("Saved?","{true}");
    localStorage.setItem("allies",JSON.stringify(allies));
    localStorage.setItem("buildings",JSON.stringify(buildings));
    localStorage.setItem("playerinventory",JSON.stringify(playerinventory));
    localStorage.setItem("player",JSON.stringify(player));
}

function loadgame() {
    if (localStorage.getItem("Saved?") === "{true}") {
        continueprogress();
        let count = 0;
        gamestats.forEach(function (y) {
            let jsontext = localStorage.getItem("Obj" + count);
            let obj = JSON.parse(jsontext);
            if (y.constructor.name === "Object") {
                for (let attr in y) {
                    if (y.hasOwnProperty(attr) && attr[0] !== "_") {
                        y[attr] = obj[attr];
                    }
                }
            }
            count += 1;
        });
        canupgrade = [];playerinventory = [];
        upgraded = [];
        JSON.parse(localStorage.getItem("canupgrade")).forEach(function (y) {
            upgrades.forEach(function (ups) {
                if (ups.name === y.name) {
                    canupgrade.push(ups);
                }
            });
        });
        JSON.parse(localStorage.getItem("upgraded")).forEach(function (y) {
            upgrades.forEach(function (ups) {
                if (ups.name === y.name) {
                    upgraded.push(ups);
                }
            });
        });
        let classobjs = [playerinventory];
        let classobjnames = ["playerinventory"];
        for (let x = 0; x < classobjs.length ; x ++ ) {
            JSON.parse(localStorage.getItem(classobjnames[x])).forEach(function (y) {
                let newobj = new Item();
                for (let attr in y) {
                    if (y.hasOwnProperty(attr)) {
                        newobj[attr] = y[attr];
                    }
                }
                classobjs[x].push(newobj);
            });
        }
        classobjs = [allies,buildings];
        classobjnames = ["allies","buildings"];
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
        player.health = pobj["_health"]; //since MHea is set after Hea, Hea might cap at the unmodified MHea.
        showupgrades();
        blacksmith();
        portal();
        inventory();
    }
}


