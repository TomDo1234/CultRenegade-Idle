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
        this._mana = 10;
        this._Mmana = 10;
    }
    set Mmana(val) {
        this._Mmana = val;
        let pmanatrack = $("#pmanatrack")[0];
        pmanatrack.innerText = Math.round(this._mana) + "/" + Math.round(val);
        pmanatrack.style.width = Math.floor(this._mana / val * 100).toString() + "%";
    }
    get Mmana() {
        return this._Mmana;
    }
    set mana(val) {
        if (val > this._Mmana) {
            val = this._Mmana;
        }
        if (val <= 0) {
            val = 0;
        }
        this._mana = val;
        let pmanatrack = $("#pmanatrack")[0];
        pmanatrack.innerText = Math.round(val) + "/" + Math.round(this._Mmana);
        pmanatrack.style.width = Math.floor(val / this._Mmana * 100).toString() + "%";
    }
    get mana() {
        return this._mana;
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
        phealthtrack.innerText = Math.round(val) + "/" + Math.round(this._MHea);
        phealthtrack.style.width = Math.floor(val / this._MHea * 100).toString() + "%";
        if (val <= 0) {
            let count = 10;
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
            if (isdead === false) {MsgLog("YOU DIED");revival()}
            isdead = true;
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
        if (currentlevel.val < maxlevel) {
            this._xp = val;
            if (val >= this._Mxp) {
                currentlevel.val += 1;
                this._xp = 0;
                this.Mxp = xptolevelup(currentlevel.val + 1);//+1 is there to make function give level requirement for levelling to x
                let statboost = levelup(currentlevel.val);
                this.MHea += statboost[0];
                this._strength += statboost[1];
                this._speed += statboost[2]; if (currentlevel.val > 4) {this.Mmana += statboost[3]}
            }
            pxp.innerText = this.xp + "/" + this.Mxp;
            if (currentlevel.val === maxlevel) { //may need to be more efficient... but for now it is fast enough...
                pxp.innerText = "Max Level!";
            }
        }
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
        if (currentlevel.val < maxlevel) {
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
    constructor(Cost,Quantity,Nam,flav = "TBA",MQuantity = 1) {
        this._Cost = Cost;
        this._Quantity = Quantity;
        this.Nam = Nam;
        this.flavor = flav;
        this.MQuantity = MQuantity;
        this._firstbought = false;
    }
    set firstbought(val) {
        this._firstbought = val;
        if (val === true) {
            switch (this) {
                case MercenaryGuild:
                    $(function() {
                        $('#Alliesbut').show();
                        $('#allyinfobut').show();
                        $('#allies1').show();
                    });
                    break;
                case Spellshop:
                    $(function() {
                        $('#Abilitytab').show();
                    });
                    break;
                case Blacksmith:
                    $(function() {
                        $('#Inventorytab').show();
                    });
                    break;
            }
        }
    }
    get firstbought() {
        return this._firstbought;
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
        buildingselection();
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
            playerinventory.splice(playerinventory.indexOf(this),1);
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
    constructor(Nam,Hea,Str,Spe,Arm,Cost,MHea,Qua,Idle,farm,flavor,regen = 1) {
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
        this._regen = regen;
        this.Healthbar = document.createElement("DIV");this.Healthbar.classList.add("Healthbar");this.Healthbar.classList.add("ally");
        this.Healthbartrack = document.createElement("DIV");this.Healthbartrack.classList.add("Healthtrack");
        Ally.armorbonus = 0; // static variables, implemented perhaps inelegantly (cannot be accessed through instances
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
        if (val <= 0) {
            if (this.AQuantity > 0) {
                this.AQuantity -= 1;
            }
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
        return this._armor + Ally.armorbonus;
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

    constructor(Nam,Hea,Str,Spe,Loo,Arm,xpr,flav = "",img = "Genericgoblin1.png",spec = [],regen = 0) {
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
        this._spec = spec;
        this._regen = regen;this._intan = false;
        this.Healthbar = document.createElement("DIV");this.Healthbar.classList.add("Healthbar");
        this.Healthbartrack = document.createElement("DIV");this.Healthbartrack.classList.add("Healthtrack");
    }

    toJSON() {
        return {name: this._name,health:this._health,strength:this._strength,speed:this._speed,loot:this.loot,spec:this._spec};
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

    activatespecial(damage,target,theallies,time = fighttimer.val) {
        let z = this; // to prevent the undefined thing.
        let thedungeon = levelenemies[dungeon.val - 1];
        this._spec.forEach(function(spec) {
           switch(spec[0]) {
               case "Poison":
                   if (damage > 0) {
                       MsgLog("You have been poisoned by a Poisonous Snake!");
                       poison(target,spec[1],spec[2]);
                   }
                   break;
               case "Lifesteal":
                   if (damage > 0) {
                       z.health += damage;
                   }
                   break;
               case "Flame":
                   if (spec[1] === "all") {
                       flame([player].concat(theallies),spec[2],spec[3]);
                   }
                   break;
               case "Spawn":
                   if (time % spec[4] === 0) {
                       let numofsummons = countindungeon(spec[1].name);
                       let numofsummoners = countindungeon(z.name);
                       for (let x = 0; x < spec[2]; x++) {
                           if (numofsummons * numofsummoners < spec[3] * numofsummoners) {
                               thedungeon.unshift(clone(spec[1]));
                               MsgLog("A" + spec[1].name + "Has been summoned!");
                           }
                       }
                       showfoes();
                   }
                   break;
               case "Intangibility":
                   intangibility(z,spec[1],spec[2]);
                   break;
           }
        });
    }

}

class Upgrade {
    constructor(Nam,Cost,iurl,flavor = "") {
        this.name = Nam;
        this.Cost = Cost;
        this.iurl = iurl;
        this.flavor = flavor;
    }
    toJSON() {
        return {name: this.name};
    }

}

class Ability {
    constructor(Nam,MCost,Cost,dam,flavor = " ",lvl = 4,img = "img/goblin1.png",type = "") {
        this.name = Nam;
        this._mcost = MCost;
        this._cost = Cost;
        this._damage = dam;
        this.flavor = flavor;
        this.img = img;
        this.trapnum = [0,0,0,0,0];
        this.level = lvl;
        this.type = type;
        Ability.trapdamagebonus = 0;
    }
    toJSON() {
        return {name: this.name};
    }
    get mcost() {
        return this._mcost;
    }
    set mcost(val) {
        this._mcost = val;
        abilities();
    }
    get cost() {
        return this._cost;
    }
    set cost(val) {
        abilities();
        this._cost = val;
    }
    get damage() {
        return this._damage;
    }
    set damage(val) {
        abilities();
        this._damage = val;
    }
    activateability() {
        let enemies = levelenemies[dungeon.val - 1];
        let enemypics = $("#Enemy");
        switch(this) {
            case NormalFireball:
                enemies[0].health -= this.damage;
                MsgLog("You threw a Normal Fireball at a" + enemies[0]._name + "<br>");
                wobble(enemypics[0].children[0].children[0],enemies[0].health);
                break;
            case NormalFrost:
                enemies[0].health -= this.damage;
                debuff("speed",enemies[0],3000,this.damage);
                MsgLog("You cast Normal Frost on a" + enemies[0]._name + "<br>");
                wobble(enemypics[0].children[0].children[0],enemies[0].health);
                break;
            case Basicarcanetrap:
                if (this.trapnum[dungeon.val - 1] === 0) {
                    MsgLog("You set a Basic Arcane Trap in this Dungeon (lasts for 1 hour)");
                }
                else {
                    MsgLog("You intensify the Basic Arcane Trap in this dungeon");
                }
                spelltrap(3600000,this.damage,15,dungeon.val - 1,Basicarcanetrap);
                break;
            case Removetrap:
                if (Basicarcanetrap.trapnum[dungeon.val - 1] !== 0) {
                    removetrap(Basicarcanetrap, 15);
                    MsgLog("Trap Removed");
                }
                else {
                    MsgLog("You have set no traps on this location");
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
                setTimeout(showfoes,500);
            }
        });
        if (enemies.length === 0) {
            for (let x = 0; x < ogenemies[dungeon.val - 1].length; x++) {
                let cope = clone(ogenemies[dungeon.val - 1][x]);
                enemies.push(cope);
            }
            fighttimer.val = 0;
        }
    }
}

function fight(attack,enemies,index,allies) {
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
    Order.push(player);
    enemies.forEach(function(x) {
        Order.push(x);
    });
    Order.sort(function(a, b) {
        return b._speed - a._speed;
    });
    let enemypics = $("#Enemy");
    for (let x = 0; x < Order.length; x++) {
        switch(Order[x].constructor.name) {
            case "Player":
                let attackdamage = enemies[0]._intan ? 0 : str + totalbonusattack - enemies[0].armor;
                let msg = enemies[0]._intan ? "Normal stabbing does nothing to the intangible." : "You stabbed a " + enemies[0]._name + "<br>";
                switch (attack) {
                    case "Stab":
                        enemies[0].health -= attackdamage;
                        MsgLog(msg);
                        if (attackdamage > 0) {wobble(enemypics[0].children[0].children[0],enemies[0].health)}
                        break;
                }
                break;
            case "Ally":
                let whosattackingnum = Order[x].AQuantity;
                let attackdamage1 = enemies[0]._intan ? 0 : (Order[x].strength - enemies[0].armor) * whosattackingnum;
                enemies[0].health -= attackdamage1;
                break;
            case "Foe":
                if (theallies.length > 0) {
                    Order[x].activatespecial(Order[x].strength - theallies[0].armor,theallies[0],theallies);
                    if (!(Order[x].strength  - theallies[0].armor <= 0)) {
                        theallies[0].health -= Order[x].strength  - theallies[0].armor;
                    }
                }
                else {
                    Order[x].activatespecial(Order[x].strength - player.armor - totalbonusdefense,player,theallies);
                    if (!(Order[x].strength  - player.armor - totalbonusdefense <= 0)) {
                        player.health -= Order[x].strength - player.armor - totalbonusdefense;

                        wobble($("#Playerpic")[0],player.health);
                    }
                    if (player.health <= 0) {
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
            fighttimer.val = 0;
            break;
        }
    }
    fighttimer.val += 1;
}

function MsgLog(msg) {
    let list = $('#Msg')[0];
    let holder = document.createElement('li');holder.classList.add("Msg");
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
                "<br>" + "Speed: " + enemy.speed + "<br><br>" + enemy.flavor;
            tooltip.show();
        };
        image.onmouseout = function() { if (!tooltip.is(':hover')) {tooltip.hide()}};
        tooltip[0].onmouseout = function() { if (!tooltip.is(':hover')) {tooltip.hide()}};
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
            thetext.innerText = a.toString() + "\xa0\xa0" + ally._name + "\xa0\xa0" + b.toString();
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
                thetext.innerText = ally.AQuantity + "\xa0\xa0" + ally._name + "\xa0\xa0" + ally.IQuantity;
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
        let b = a.IQuantity * a.farm[0];
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
        let b = a.IQuantity * a.farm[0];
        let s = a.IQuantity * a.farm[1];
        let g = a.IQuantity * a.farm[2];
        resources[0].val += b - resources[0].mod;
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
        thediv.id = x._name;
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
        }; // code below needs setTimeout because of f***** mozilla firefox -_-
        thediv.onmouseout = function () {
            setTimeout(function(){
                if ((!$(tooltip).is(':hover') && !fod.is(':hover')) || $('#ihatefirefox').is(':hover')) {tooltip.style.display = "none"}
                },10)
        };
        tooltip.onmouseout = function() {
            setTimeout(function(){
                if ((!$(tooltip).is(':hover') && !fod.is(':hover')) || $('#ihatefirefox').is(':hover')) {tooltip.style.display = "none"}
                },10)
        };
        mlist.appendChild(thediv);
    });
    let fod2 = document.createElement("DIV");fod2.id = "ihatefirefox";
    fod2.classList.add("inventoryicon");fod2.style.width = 100 - playerinventory.length * 16 + "%";
    fod2.style.borderStyle = "none";
    fod.append(fod2);
}

function refresh() {
    checkforevents();
    checkpersec();
    playerstats();
    setTimeout(refresh,200);
}

function abilities() {
    let u = $('#Abilities');
    u.empty();
    let tooltip = document.createElement("DIV");tooltip.classList.add("tooltip");tooltip.classList.add("Abilities");
    $('#abilitiesbut').show();
    playerabilities.forEach(function (x) {
        let thebutton = document.createElement("BUTTON");
        let damagebonus = x.type === "trap" && Ability.trapdamagebonus > 0 ? " (+ " + Ability.trapdamagebonus + ")" : "";
        thebutton.id = x.name;
        thebutton.classList.add("ability");
        thebutton.style.backgroundImage = "url(" + x.img + ")";
        thebutton.onmouseenter = function () {
            tooltip.innerHTML = x.name + "<br><br>" + "Damage: " + x.damage + damagebonus + "<br><br>" +
                "Mana Cost: " + x.mcost + " mana" + "<br><br>" +  x.flavor.italics();
            tooltip.style.display = "block";
        };
        thebutton.onmouseout = function () {
            tooltip.style.display = "none"
        };
        thebutton.onclick = function () {
            if (player.mana < x.mcost) {
                MsgLog("Not enough mana...");
            }
            else {
                player.mana -= x.mcost;
                x.activateability(); // REMEMBER partial from python?
            }
            tooltip.innerHTML = x.name + "<br><br>" + "Damage: " + x.damage + "<br><br>" +
                "Mana Cost: " + x.mcost + " mana" + "<br><br>" +  x.flavor.italics(); //updates mcost for traps
        };
        u.append(thebutton);
        u.append(tooltip);
    });
    let foo = playerabilities.length > 4 ? 4 : playerabilities.length;
    tooltip.style.left = foo * 25 + "%";
}

function spellshop() {
    let u = $('#Spellshopshop');
    let tooltip = document.createElement("DIV");tooltip.classList.add("tooltip");tooltip.classList.add("spellshop");
    u.empty();
    if (canabilities.length > 0) {
        $('#Spellshopbut').show();
        canabilities.forEach(function (x) {
            if (x.level <= currentlevel.val) {
                let thebutton = document.createElement("BUTTON");
                thebutton.id = x.name;
                thebutton.classList.add("spellshop");
                thebutton.style.backgroundImage = "url(" + x.img + ")";
                thebutton.onmouseenter = function () {
                    tooltip.innerHTML = x.name + "<br><br>" + "Damage: " + x.damage + "<br><br>" +
                        "Mana Cost: " + x.mcost + " mana" + "<br><br>" + x.flavor.italics() + "<br><br>" + "Cost: " +
                        x.cost[0] + "/" + x.cost[1] + "/" + x.cost[2];
                    tooltip.style.display = "block";
                };
                thebutton.onmouseout = function () {
                    tooltip.style.display = "none"
                };
                thebutton.onclick = function () {
                    buyability(x); // REMEMBER partial from python?
                    $(thebutton).remove();
                };
                u.append(thebutton);
                u.append(tooltip);
            }
        });
    }
    else {
        $('#Spellshopbut').hide();
        u[0].innerHTML = "Nothing more to sell from the Spell Shop... for now :) <br><br> Select another building to not let this text waste space!";
    }
    let foo = canabilities.length > 5 ? 5 : canabilities.length;
    tooltip.style.right = foo * 20 + "%";
}

function playerstats() {
    let stats = $('#Pstats');
    let theattack = player.strength;
    let thearmor = player.armor;
    let thespeed = player.speed;
    playerinventory.forEach(function(item) {
       theattack += item.attack * item.EQuantity;
       thearmor += item.defense * item.EQuantity;
       thespeed += item.speed * item.EQuantity;
    });
    stats[0].innerHTML = "Attack: \xa0" + theattack + "<br><br>"
        + "Armor: \xa0" + thearmor + "<br><br>" + "Speed: \xa0" + thespeed;
}

function regen() {
    if (isdead === false) {
        player.health += 1;
        player.mana += 1;
    }
    allies.forEach(function(ally) {
       ally.health += ally._regen;
    });
    levelenemies[dungeon.val - 1].forEach(function(enem){
       enem.health += enem._regen;
    });
    setTimeout(regen, 2000);
}

function continueprogress() {
    $('#namegetter2').remove();
    showfoes();
    showbuildings();
    showupgrades();
    idlestuff();
    autofight();
    spellshop();
    $("#everything").show();
    refresh();
    regen();
}

function autofight() {
    if (dungeon.val > 5 && autofightenabled) {
        fight(setattack, levelenemies[dungeon.val - 1], dungeon.val - 1, allies);
        if (isdead === true) {
            dungeon.val = 1;
        }
    }
    setTimeout(autofight,1000);
}

function buyability(x) {
    let thecost = x.cost;
    for (let x = 0; x < resources.length; x++) {
        if (resources[x].val - thecost[x] < 0) {
            MsgLog("Not enough resources");
            return;
        }
    }
    for (let x = 0; x < resources.length; x++) {
        resources[x].val -= thecost[x];
    }
    canabilities.splice(canabilities.indexOf(x),1);
    playerabilities.push(x);
    abilities();
    spellshop();
    MsgLog(x.name + " was purchased");
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
    MsgLog("Hello " + name + "!");MsgLog("Click the 'FIGHT' Button to... (it's self explanatory)");
    player.name = name;//player.xp=500;player.xp=500;player.xp=500;player.strength=50000;player.speed=123;player.xp=50000;
    inputfield.remove();flavoradd(); // showfoes is in flavoradd
    showbuildings();inventory();
    showupgrades();autofight();
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

function buildingselection() {
    $('#buildselection').empty();
    let thebuildings1 = [MercenaryGuild,Blacksmith,Spellshop,Bank];
    thebuildings1.forEach(function(building) {
       if (building.Quantity > 0) {
           let thebutton = document.createElement("BUTTON");
           thebutton.classList.add("class1");thebutton.classList.add("buildselection");
           thebutton.innerHTML = building.Nam;
           $('#buildselection').append(thebutton);
           document.getElementById('buildselection').appendChild(document.createElement("BR"));
           thebutton.onclick = function() {
               $('#' + building.Nam.replace(/\s/g,"")).show();
               $('#buildselection').hide();
               document.getElementById("buildselect").onclick = function() { //getElementbyId is to prevent the multiple instance jquery warning
                   $('#buildselection').toggle();
                   $('#' + building.Nam.replace(/\s/g,"")).hide();
                   buildingselection();
               }
           }
       }
    });
}

function showMercenaries() {
    $('#merc').empty();
    if (MercenaryGuild.Quantity > 0) {
        cantrain.forEach(function (unit) {
            let mlist = $('#merc');
            let thebutton = document.createElement("BUTTON");thebutton.classList.add("Mercs");
            thebutton.innerHTML = unit._name;
            let tooltip = $('#unittooltip')[0];
            thebutton.id = unit._name;
            thebutton.onmouseenter = function() {
                tooltip.innerHTML = unit._name + "<br><br>" + "Attack: " + unit._strength + "<br>" + "Health: " + unit._MHea +
                    "<br>" + "Armor: " + unit.armor + "<br>" + "Speed: " + unit._speed
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
    let tooltip = document.createElement("DIV");tooltip.classList.add("tooltip");tooltip.classList.add("blacksmith");
    if (Blacksmith.Quantity > 0) {
        $('#Blacksmithbut').show();
        theblacksmith.forEach(function (x) {
            let thebutton = document.createElement("BUTTON");
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
            u.append(thebutton);
            u.append(tooltip);
        });
    }
    else {
        $('#Blacksmithbut').hide();
    }
    let foo = theblacksmith.length > 5 ? 5 : theblacksmith.length;
    tooltip.style.right = foo * 20 + "%";
}

function portal() {
    if (Portal.Quantity > 0) {
        for (let x = 0; x < currentlevel.val && x < maxlevel; x++) {
            let thebutton = document.getElementById("D " + x);
            if (thebutton === null) {
                let button = document.createElement("BUTTON");
                button.id = "D " + x;
                button.innerHTML = "Dungeon " + (x + 1);
                button.classList.add("class1");
                button.classList.add("portal");
                button.onclick = function () {
                    if (isdead === false) {
                        levelenemies[dungeon.val - 1] = [];
                        for (let x = 0; x < ogenemies[dungeon.val - 1].length; x++) {
                            let cope = clone(ogenemies[dungeon.val - 1][x]);
                            levelenemies[dungeon.val - 1].push(cope);
                        }
                        dungeon.val = x + 1;fighttimer.val = 0;
                        MsgLog("You have travelled to Dungeon " + (x + 1));
                    }
                };
                $("#portal1")[0].appendChild(button);
            }
        }
    }
}

function buyupgrade(x,type = "normal") {
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
            canupgrade.push(up4);
            break;
        case up3:
            attackmod.val += 1;
            break;
        case up4:
            GenericSpearman.Ibonus *= 2;
            break;
        case up5:
            GenericSwordsman.Ibonus *= 2;
            break;
        case up6:
            GenericKnight.Ibonus *= 2;
            break;
        case up7:
            Ally.armorbonus += 1;
            break;
        case up8:
            Ability.trapdamagebonus += 1;
            break;
        case bup1:
            playersilver.val += 1;
            break;
    }
    switch(type) {
        case "normal":
            canupgrade.splice(canupgrade.indexOf(x),1);
            upgraded.push(x);
            showupgrades();
            break;
        case "bank":
            bankcanupgrade.splice(bankcanupgrade.indexOf(x),1);
            bankupgraded.push(x);
            bank();
    }
    MsgLog(x.name + " upgrade purchased");abilities();//when Ability's static variables change;
    showMercenaries();//when Ally static variables change;
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
    let tooltip = document.createElement("DIV");tooltip.classList.add("tooltip");tooltip.classList.add("upgrades");
    bankcanupgrade.forEach(function(x) {
        let thebutton = document.createElement("BUTTON");
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
        thebank.append(thebutton);
        thebank.append(tooltip);
    });
    let foo = bankcanupgrade.length > 5 ? 5 : bankcanupgrade.length;
    tooltip.style.right = foo * 16 + "%";
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
    x.Quantity += 1; if (x.firstbought === false) {x.firstbought = true}
    switch(x) {
        case MercenaryGuild:
            levelMercs();
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
        case Spellshop:
            spellshop();
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
        resources[y].val += Math.ceil(x.Value[y]/4) - resources[y].mod;
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
    let tooltip = document.createElement("DIV");tooltip.classList.add("tooltip");tooltip.classList.add("upgrades");
    u.empty();
    canupgrade.forEach(function(x) {
        let thebutton = document.createElement("BUTTON");
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
        u.append(tooltip);
    });
    let foo = canupgrade.length > 6 ? 6 : canupgrade.length;
    tooltip.style.right = foo * 16 + "%";
}



function showbuildings() {
    let buildings1 = $("#buildings1");
    buildings1.empty();
    let tooltip = $("#buildtooltip");
    canbuild.forEach(function(x) {
        let thebutton = document.createElement("BUTTON");thebutton.classList.add("buildings");
        if (x.Quantity < x.MQuantity) {
            thebutton.innerHTML = x.Nam + ": " + x.Quantity + "<br>" + "Cost: " + x.Cost[0]
                + "/" + x.Cost[1] + "/" + x.Cost[2];
            thebutton.onclick = function () {
                build(x); // REMEMBER partial from python?
            };
        }
        else {
            thebutton.innerHTML = x.Nam + ": " + x.Quantity + "<br>" + "Max Quantity";
        }
        thebutton.onmouseenter = function () {
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

let NormalFireball = new Ability("Normal Fireball",5,[5000,0,0],20,"A normal fire ball spell that damages a single target",4,"img/normalfireball.png");
let NormalFrost = new Ability("Normal Frost",5,[5000,0,0],10,"A normal frost spell. Slows your enemies down temporarily",4,"img/normalfrost.png");
let Basicarcanetrap = new Ability("Basic Arcane Trap",10,[5000,0,0],4,"A Basic Trap that automatically damages and collects loot from enemies, cast multiple times to intensify it.",
    6,"img/basicarcanetrap.png","trap");
let Removetrap = new Ability("Remove Trap",1,[500,0,0],0,"Removes the most magical trap you set in the current dungeon.",6,"img/removetrap.png");

let theabilities = [NormalFireball,NormalFrost,Basicarcanetrap,Removetrap];
let canabilities = [NormalFireball,NormalFrost,Basicarcanetrap,Removetrap];

let playerinventory = [];
let playerabilities = [];

let MercenaryGuild = new Building([30,0,0],0,"Mercenary Guild","Mercenaries hunt during hunt for you during their spare time and" +
    " help you during battles. Most of them are Generic though... like those unnamed movie grunts",2);

let Portal = new Building([100,0,0],0,"Portal","Travel to other places. The more you have the more types of places you can go, the " +
    "higher level you are the places of the acquired types you can go. \n\n CAUTION - Don't get 4 of these");

let Bank = new Building([0,0,0],0,"Bank","A safe place to store your money, at a price... (Is this an Oxymoron? I am bad at linguistics.)");

let Blacksmith = new Building([300,0,0],0,"Blacksmith", "It is always better to just make your own weapon. But some people are " +
    "just too lazy so they buy it for an increased price (How else does the Blacksmith profit?).");

let Market = new Building([0,0,0],0,"Market","A place to sell your loot for a lower price... Which then gets sold again for the " +
    "actual price.");

let Spellshop = new Building([4000,0,0],0,"Spell Shop","A place to buy spells... but at what cost is it to bridge the gap between the abnormal and the normal? O_O");

let buildings = [MercenaryGuild,Portal,Blacksmith,Spellshop,Market,Bank];

let canbuild = [MercenaryGuild];
let theblacksmith = [ReavingDecapitator,TheSafe];


let up1 = new Upgrade("Fundamental Skin Science",[75,0,0],"img/skinscience1.png");
let up2 = new Upgrade("Blood Spear Fishing",[300,0,0],"img/bloodspearfishing1.png");
let up3 = new Upgrade("Whetfish Ichthyology",[2000,0,0],"img/whetfishichthyology1.png");
let up4 = new Upgrade("Blood Spear Fishing II",[1500,0,0],"img/bloodspearfishing2.png");
let up5 = new Upgrade("Swordsman Tracking",[4000,0,0],"img/swordsmantracking1.png");
let up6 = new Upgrade("Early Desensitization",[12000,0,0],"img/desensitization1.png");
let up7 = new Upgrade("Goblin Metallurgy",[10000,0,0],"img/goblinmetallurgy1.png");
let up8 = new Upgrade("Arcane Static Dampening",[10000,0,0],"img/ArcaneSD1.png");

let bup1 = new Upgrade("A Welcome Bundle",[0,0,0],"img/whetfishichthyology1.png","A One-only gift for first time visitors to the Bank! (Click to " +
    "recieve gift of one silver");

let canupgrade = [up1];
let upgraded = [];
let upgrades = [up1,up2,up3,up4,up5,up6,up7,up8];

let bankcanupgrade = [bup1];
let bankupgraded = [];
let bankupgrades = [up1];

let GenericSpearman = new Ally ("Generic Spearman",1,1,1,1,[20,0,0],1,0,0,[0.2,0,0],"A plain old spearman, payed to aid " +
    "you in direct or combat or hunt for treasure during free time.");

let GenericSwordsman = new Ally ("Generic Swordsman",22,9,3,3,[200,0,0],22,0,0,[2,0,0],"A Swordsman, trained killers... " +
    "it is said in legend that the sword was the first man-made tool designed solely to kill.");

let GenericKnight = new Ally ("Generic Knight",200,18,3,7,[2000,0,0],200,0,0,[22,0,0],"Knights, elite killers among the common men. " +
    "Trained to kill,raised to kill, pretty much born to kill.");

let trainedbear = new Ally ("Trained Bear",1000,30,5,13,[15000,0,0],1000,0,0,[100,0,0],"Regular bears are many times stronger than a regular human." +
    " TRAINED bears are many times stronger than regular bears. When humans aren't enough, you can use bears.");

let reanimatedcorpse = new Ally ("Reanimated Corpse",2000,45,9,0,[90000,0,0],2000,0,0,[800,0,0],"A corpse reanimated by a novice necromancer," +
    "It has high speed regeneration and due to dark magic has increased strength to the point where it can destroy concrete castle walls in one hit.",50);

let giant = new Ally ("Giant",10000,88,1,25,[2000000,0,0],10000,0,0,[7700,0,0],"Knights, elite killers among the common men. " +
    "Trained to kill,raised to kill, pretty much born to kill.");

let allies = [GenericSpearman,GenericSwordsman,GenericKnight,trainedbear,reanimatedcorpse,giant];

let cantrain = [GenericSpearman,GenericSwordsman,GenericKnight];

let player = new Player("PoopHead!",5,1,1,1,0,5,50);
let isdead = false;
let wobbleon = true;
let maxlevel = 15;
let autofightenabled = true;

let title = "RPG IDLE OF DOOM";
let setattack = "Stab";

document.title = title;

let playerbronze = {
        _val : 0,
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
        _mod : 0,
        set val(value) {
            this._val = value;
            $('#Silver')[0].innerText = "Silver: " + Math.floor(this._val);
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
    playergold = {
        _val : 0,
        _mod : 0,
        set val(value) {
            this._val = value;
            $('#Gold')[0].innerText = "Gold: " + Math.floor(this._val);
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
    currentlevel = {
        _milestone : 0,
        _val : 1,
        set milestone(val) {
            this._milestone = val;
        },
        get milestone() {
            return this._milestone;
        },
        set val(value) {
            this._val = value;
            $('#plevel')[0].innerHTML = "Level: " + this._val;
            canupgrade = unionarray(canupgrade,levelupgrades());
            canbuild = levelbuildings();
            portal();
            showbuildings();
            showupgrades();
            spellshop();
            if (this._val === 4 && this.milestone < 1) {
                let pmanatrack = $("#pmanatrack")[0];
                pmanatrack.innerText = Math.round(player._mana) + "/" + Math.round(player._Mmana);
                pmanatrack.style.width = Math.floor(player._mana / player._Mmana * 100).toString() + "%";
                $('#pmana').show();
                MsgLog("Magic seeps into you as you get more powerful... You start to realize the presence of a higher unknown");
                this.milestone += 1;
            }
            else if (this._val === 6 && this.milestone < 2) {
                let infobut = document.createElement("BUTTON");infobut.innerHTML = "WARNING PLEASE CLICK HERE TO READ!!!";infobut.classList.add("class2");
                $('#Events').append(infobut);
                infobut.onclick = function() {
                    $('#eventinfo').toggle();$(infobut).remove();
                    $('#theactualinfo')[0].innerHTML = "You are now above level 5, Enemies in dungeons higher than 5 are no longer passive..."
                        + "They WILL fight you whether you like it or not. DO NOT enter dungeons above 5 without being prepared. However, it is safe"
                        + "To place spell traps in dungeons 5 and higher and then leave to another dungeon. It is unlikely that the magic of a level 6"
                        + "can cause remote harm to enemies with high Magic Resistance (Which is more common the higher the dungeon)." + "<br><br>"
                        + "If you die, don't worry. You will be teleported back to dungeon 1!"
                };
                this.milestone += 1;
            }
            else if (this._val === 15 && this.milestone < 3) {
                $('#Playerpic')[0].src = "player1.png";
                $('#Pdescription')[0].innerHTML = "You have grown more powerful, you are becoming less generic as you become more powerful in the arcane" +
                    ". The blue ring that borders you is abundance of mana you can control.";
                MsgLog("Something is happening to you! You feel a weird sensation as you progress further...");
                this.milestone += 1;
            }
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
let fighttimer = {
    _val : 0,
    set val(value) {
        this._val = value;
    },
    get val() {
        return this._val;
    }
};

let goblin = new Foe("Generic Goblin", 1, 1, 1, [playerbronze,1,1000],0,1,"","Genericgoblin1.png");
let imp = new Foe("Generic Imp", 5, 2, 1, [playerbronze,2,1000],0,2,"","Genericimp1.png");
let snake = new Foe("Generic Snake",30,5,7,[playerbronze,40,1000],3,20,"","Genericsnake1.png");
let goblin1 = new Foe("Killer Goblin Novice",100,10,3,[playerbronze,200,1000],7,120,"","goblin1.png");
let boss1 = new Foe("Frosty Abomination Fourth Class",800,50,12,[plainuselesslocket,1,1000,playerbronze,2000,1000],0,2000
    ,"","boss1.png");
let blueimp = new Foe("Blue Imp",700,21,5,[playerbronze,5000,1000],4,1500,"","blueimp1.png");
let Witch = new Foe("Regular Witch",500,44,4,[playerbronze,14000,1000],0,4700,"","regularwitch.png");
let Poisonoussnake = new Foe("Poisonous Snake",1000,19,10,[playerbronze,50000,1000],6,9000,"","poisonoussnake.png",[["Poison",0.1,10000]]);
let murdererreaver = new Foe("Murderer Reaver",3000,50,12,[playerbronze,1,1000],13,15000,"","murdererreaver1.png",[["Lifesteal"]]);
let treasurechest1 = new Foe("Treasure Chest (Basic)",5000,0,0,[playersilver,1,100,playerbronze,100000,1000],10,0,"","treasurechest1.png");
let Flamewitch1 = new Foe("Flame Witch",2000,100,3,[playerbronze,200000,1000],0,99999,"","flamewitch.png",[["Flame","all",4,50000]]);
let Dreadshroom = new Foe("Dreadshroom",1500,70,7,[playerbronze,20000,1000],10,30000,"","dreadshroom.png",[["Poison",0.2,20000]]);
let Fungalmancer = new Foe("Fungalmancer",3000,50,3,[playerbronze,400000,1000],2,120000,"","fungalmancer.png",[["Poison",0.4,5000],["Spawn",Dreadshroom,1,3,10]]);
let Witch1 = new Foe("Novice Witch",4000,500,3,[playerbronze,500000,1000],4,150000,"","novicewitch.png",[[]]);
let chaoticflesh = new Foe("Chaotic Flesh",9000,100,3,[playerbronze,1000000,1000],25,300000,"","chaoticflesh.png",[[]],100);
let deathspawn = new Foe("Regular Deathspawn",6000,75,10,[playerbronze,10000,1000],15,30000,"","regular deathspawn.png",[],100);
let Deathknight = new Foe("Death Knight",30000,100,3,[playerbronze,1500000,1000],30,500000,"","deathknight.png",[["Lifesteal"],["Spawn",deathspawn,1,2,10]],200);
let boss2 = new Foe("The Petty Essence of Unknown",100000,500,40,[playersilver,2,1000],30,3000000,"","boss2.png",[["Intangibility",20,10]],400);

let ogenemies = [[goblin],[imp],[snake,snake,snake,snake],[goblin1,goblin1,goblin1],[boss1],[blueimp,blueimp],[Witch],
    [Poisonoussnake,Poisonoussnake,Poisonoussnake],[murdererreaver,Witch,Witch,Poisonoussnake,treasurechest1],[Flamewitch1],
    [Dreadshroom,Dreadshroom,Dreadshroom,Fungalmancer],[Witch1,Witch1,Witch1],[chaoticflesh,chaoticflesh],[deathspawn,deathspawn,Deathknight],[boss2]
];
let levelenemies = a2clone(ogenemies);

let theenemies = [goblin,imp,snake,goblin1,boss1,blueimp,Witch,Poisonoussnake,murdererreaver,treasurechest1,Flamewitch1,Dreadshroom,Fungalmancer,
    Witch1,chaoticflesh,deathspawn,Deathknight,boss2
];

let timertrap = new Array(levelenemies.length).fill([]);

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
    localStorage.setItem("bankcanupgrade",JSON.stringify(bankcanupgrade));
    localStorage.setItem("bankupgraded",JSON.stringify(bankupgraded));
    localStorage.setItem("canabilities",JSON.stringify(canabilities));
    localStorage.setItem("playerabilities",JSON.stringify(playerabilities));
    localStorage.setItem("Saved?","{true}");
    localStorage.setItem("cantrain",JSON.stringify(cantrain));
    localStorage.setItem("allies",JSON.stringify(allies));
    localStorage.setItem("buildings",JSON.stringify(buildings));
    localStorage.setItem("playerinventory",JSON.stringify(playerinventory));
    localStorage.setItem("player",JSON.stringify(player));
    console.log("Game Saved! (game autosaves every 20 seconds)");
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
        upgraded = [];playerabilities = [];canabilities = [];
        let thearrays = ["canupgrade",canupgrade,upgrades,"upgraded",upgraded,upgrades,"canabilities",canabilities,theabilities,
            "playerabilities",playerabilities,theabilities,"bankcanupgrade",bankcanupgrade,bankupgrades,"bankupgraded",bankupgraded,bankupgrades];
        for (let index = 0;index < thearrays.length; index += 3) {
            JSON.parse(localStorage.getItem(thearrays[index])).forEach(function (x) {
                thearrays[index + 2].forEach(function (y) {
                    if (y.name === x.name) {
                        thearrays[index + 1].push(y);
                    }
                });
            });
        }
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
        cantrain = [];
        allies.forEach(function(unit){
           JSON.parse(localStorage.getItem("cantrain")).forEach(function(unit2){
                if (unit._name === unit2._name) {
                    cantrain.push(unit);
                }
           });
        });
        let pobj = JSON.parse(localStorage.getItem("player"));
        Object.getOwnPropertyNames(Object.getPrototypeOf(player)).forEach(function (attr) {
            if (attr !== "constructor") {
                player[attr] = pobj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
            }
        });
        player.health = pobj["_health"]; //since MHea is set after Hea, Hea might cap at the unmodified MHea.
        blacksmith();
        portal();
        spellshop();
        $(function() { // when document is ready, $(document).ready() is deprecated now -_-
            inventory();
            abilities();
            showMercenaries();
            showupgrades();
            flavoradd(); //showfoes() is in flavoradd();
            setTimeout(flavoradd,50); //for some reason it has to be used twice \(-_-)/
        });
        if (currentlevel.val >= 4) {
            $('#pmana').show();
        }
    }
}


