game.module(
    'game.main'
)
.body(function() {

    game.addAsset('AirFreedom.png');
    game.addAsset('AlphaWarrior.png');
    game.addAsset('Apache.png');
    game.addAsset('Artillery.png');
    game.addAsset('Bulldozer.png');
    game.addAsset('Captain.png');
    game.addAsset('Cargo.png');
    game.addAsset('Commando.png');
    game.addAsset('Destroyer.png');
    game.addAsset('Eagle.png');
    game.addAsset('Elf.png');
    game.addAsset('Falcon.png');
    game.addAsset('Furtif.png');
    game.addAsset('Grizzly.png');
    game.addAsset('HawkEye.png');
    game.addAsset('Hercule.png');
    game.addAsset('M-31.png');
    game.addAsset('MetalKnight.png');
    game.addAsset('Nuclear.png');
    game.addAsset('Panther.png');
    game.addAsset('Patriot.png');
    game.addAsset('Porcupine.png');
    game.addAsset('Predator.png');
    game.addAsset('Scorpion.png');
    game.addAsset('Scout.png');
    game.addAsset('Scud.png');
    game.addAsset('Shark.png');
    game.addAsset('Shooter.png');
    game.addAsset('Soldier.png');
    game.addAsset('Striker.png');
    game.addAsset('Tiger.png');
    game.addAsset('Transport.png');
    game.addAsset('Truck.png');

    game.addAsset('explosion.png');


    game.createScene('Main', {
        backgroundColor: '#A9A9A9',
        init: function() {
            var f = new game.UnitFactory();
            
            this.unit1 = null; 
            this.unit2 = null; 
            
            this.createScene("Scorpion", "Metal Knight");
            
        },
        fightTest: function(surroundEffect=1,attackingFromCity=0,defendingFromCity=0,attackingIsFortifiedCity=0,defendingIsFortifiedCity=0, attackerExp=0, defenderExp=0) {
            surroundEffect = parseInt(surroundEffect) || 1; //always at least 1 unit
            console.log("Surround Effect " + surroundEffect);
            console.log("attackingFromCity " + attackingFromCity);
            
            attackerExp = parseInt(attackerExp) || 0;
            defenderExp = parseInt(defenderExp) || 0;
            
            this.unit1.setExperience(attackerExp);
            this.unit2.setExperience(defenderExp);
            
            this.fight(this.unit1,this.unit2,surroundEffect,attackingFromCity,defendingFromCity,attackingIsFortifiedCity,defendingIsFortifiedCity);
        },
        
        createAttackingUnit: function(unit) {
            console.log(unit);
            if ( this.unit1 !== null ) {
                this.unit1.delete();
            }
            var f = new game.UnitFactory(); 
           
            this.unit1 = f.create(unit);
            if ( this.unit1 !== null ) {
                this.unit1.setPosition(32,20);
            }
        },
        createDefendingUnit: function(unit) {
            if ( this.unit2 !== null) {
                this.unit2.delete();
            }
            var f = new game.UnitFactory();
            this.unit2 = f.create(unit);
            if ( this.unit2 !== null) {
                this.unit2.setPosition(32,70);
            }
        },
        createScene: function(unit1, unit2) {
            this.createAttackingUnit(unit1);
            this.createDefendingUnit(unit2);
            
        },
        
        /*
Attack Strength =	[number of units] x [Attack or AirAttack power of the unit]
                    x (100% + [experience points] x 5%)
                    x (100% + [units surrounding enemy] x 10%)
                    x [random value between 0.5 and 1.5]
.
Defense Strength =	[number of units] x [defense power of the unit] x 2
                    x (100% + [if unit is in Base, City or Resource] x 25%)
                    x (100% + [if unit is in fortified City] x 25%)

Then the casualties are computed:

Number of units left = ([Your Defense Strength] MINUS [Opponent's Attack Strength]) / [Defense Power of one of your unit x 2]
        */
        fight: function(aUnit, dUnit, surroundEffect=0,attackingFromCity=0,defendingFromCity=0,attackingIsFortifiedCity=0, defendingIsFortifiedCity) {
            
            var aUnit_Damage = (aUnit.calculateDefense(attackingFromCity,attackingIsFortifiedCity) - dUnit.calculateAttack(0, aUnit, true)) / (aUnit.defense*2);
            var dUnit_Damage = (dUnit.calculateDefense(defendingFromCity,defendingIsFortifiedCity) - aUnit.calculateAttack(surroundEffect, dUnit)) / (dUnit.defense*2);
            
            aUnit.unitNumber = Math.min(Math.floor(aUnit_Damage), aUnit.unitNumber);
            dUnit.unitNumber = Math.min(Math.floor(dUnit_Damage),dUnit.unitNumber);
            
            aUnit.draw();
            dUnit.draw();
            console.log("Attack units remaining: " + aUnit_Damage);
            console.log("Defending units remaining: " + dUnit_Damage);
        }
    });


    game.createClass('Unit', {
        init: function(name, groundAttack,airAttack, defense,range,speed,cost, sprite, airUnit=false) {
            this.name = name;
            this.groundAttack = groundAttack;
            this.airAttack = airAttack;
            this.defense = defense;
            this.range = range;
            this.speed = speed;
            this.cost = cost;
            this.sprite = sprite;
            this.airUnit = airUnit;
            
            this.experience = 1;
            this.unitNumber = 8;
            this.origNum = this.unitNumber;
            this.x = 0;
            this.y = 0;
            
            
            //drawing stuff
            this.myContainer = new game.Container();
            this.myContainer.addTo(game.scene.stage);
            
            this.myText = new game.SystemText(" x " + this.unitNumber);
            this.myText.size = 36;
            this.myText.addTo(this.myContainer);
            this.draw();
        },
        setExperience: function(num) {
            this.experience = num;
        },
        delete: function() {
            this.myContainer.removeAll();
            game.scene.stage.remove(this);
        },
        draw: function() {
            this.myContainer.removeAll();
            var scale = 1;
            for ( var i = 0; i < this.origNum; i++ ) {
                if ( i < this.unitNumber) {
                    var spr = new game.Sprite(this.sprite);
                    spr.addTo(this.myContainer);
                    spr.position.set(i*(32*scale),0);
                    spr.scale.set(scale);
                } else {
                    var spr = new game.Sprite('explosion.png');
                    spr.addTo(this.myContainer);
                    spr.position.set(i*(32*scale),0);
                    spr.scale.set(scale);
                    game.Timer.add(1000, function(spr) {
                        spr.remove();
                    }.bind(this, spr));
                }
                
            }
            this.origNum = this.unitNumber;
            this.myText.text = " x " + this.unitNumber;
        },
        setPosition: function(x,y) {
            this.x = x;
            this.y = y;
            this.myContainer.position.set(x,y);
            this.draw();
        },
        setUnitNumber: function(num) {
            this.unitNumber = num;
        },
        calculateAttack: function(surroundEffect, other, defending=false) {
            if ( defending === true ) {
                if ((this.range>1 || other.range>1) && this.name !== "Patriot" ) { //only Patriots can counterattack! 
                    return 0;
                } 
            }
            if ( other.airUnit) {
                return this.calculateAirAttack(surroundEffect);
            } else {
                return this.calculateGroundAttack(surroundEffect);
            }
        },
        calculateGroundAttack: function(surroundEffect) {
            return this.unitNumber * this.groundAttack 
                               * (1.00 + this.calculateExperienceEffect())
                               * (1.00 + (surroundEffect*0.1))
                               * (Math.random()+0.5);
        },
        calculateAirAttack: function(surroundEffect) {
            return this.unitNumber * this.airAttack 
                               * (1.00 + this.calculateExperienceEffect())
                               * (1.00 + (surroundEffect*0.1))
                               * (Math.random()+0.5);
        },
        calculateDefense: function(inCity, fortified) {
            return this.unitNumber * this.defense * 2
                        * (1.00 + (inCity*0.25))
                        * (1.00 +(fortified * 0.25));
        },
        calculateExperienceEffect: function() {
            if ( this.experience === 0 ) {
                return 0;
            }
            else {
                return this.experience * 0.05;
            }
        }
    });
    
    game.createClass('UnitFactory', {
        init: function() {
            
        },
        create: function(name) {
            switch( name ){
                //Ground Force
                case "Soldier":
                    return new game.Unit("Soldier",1,0,2,1,4,18,'Soldier.png');
                    break;
                case "Alpha Warrior":
                    return new game.Unit("Alpha Warrior",3,0,3,1,5,34,'AlphaWarrior.png');
                    break;
                case "Bulldozer":
                    return new game.Unit("Bulldozer",1,0,1,1,5,25,'Bulldozer.png');
                    break;
                case "Truck":
                    return new game.Unit("Truck",1,0,1,1,5,24,'Truck.png');
                    break;
                case "Transport":
                    return new game.Unit("Transport",1,0,3,1,9,33,'Transport.png');
                    break;
                case "Porcupine":
                    return new game.Unit("Porcupine",0,0,10,0,0,20,'Porcupine.png');
                    break;
                case "Panther":
                    return new game.Unit("Panther",3,0,3,1,8,40,'Panther.png');
                    break;
                case "M-31":
                    return new game.Unit("M-31",4,0,4,1,5,43,'M-31.png');
                    break;
                case "Elf":
                    return new game.Unit("Elf",4,0,5,1,10,50,'Elf.png');
                    break;
                case "Commando":
                    return new game.Unit("Commando",2,0,3,1,10,88,'Commando.png');
                    break;
                case "Striker":
                    return new game.Unit("Striker",6,0,6,4,0,57,'Striker.png');
                    break;
                case "Tiger":
                    return new game.Unit("Tiger",8,0,5,2,7,67,'Tiger.png');
                    break;
                case "Grizzli":
                    return new game.Unit("Grizzli",7,2,7,1,8,70,'Grizzly.png');
                    break;
                case "Patriot":
                    return new game.Unit("Patriot",6,0,10,10,0,89,'Patriot.png');
                    break;
                case "Artillery":
                    return new game.Unit("Artillery",11,0,3,5,11,91,'Artillery.png');
                    break;
                case "AirFreedom":
                    return new game.Unit("AirFreedom",0,12,5,6,10,90,'AirFreedom.png');
                    break;
                case "Scorpion":
                    return new game.Unit("Scorpion",13,2,11,1,10,104,'Scorpion.png');
                    break;
                case "Scud":
                    return new game.Unit("Scud",15,0,1,10,4,116,'Scud.png');
                    break;
                case "Metal Knight":
                    return new game.Unit("Metal Knight",18,4,13,1,11,135,'MetalKnight.png');
                    break;
                    
                //Navy    
                case "Scout":
                    return new game.Unit("Scout",4,0,5,1,20,50,'Scout.png');
                    break;
                case "Cargo":
                    return new game.Unit("Scout",0,0,5,1,18,60,'Scout.png');
                    break;  
                case "Destroyer":
                    return new game.Unit("Destroyer",6,0,7,1,19,61,'Destroyer.png');
                    break;
                case "Shark":
                    return new game.Unit("Shark",6,0,8,1,15,99,'Shark.png');
                    break;
                case "Shooter":
                    return new game.Unit("Shooter",8,3,10,7,19,108,'Shooter.png');
                    break;
                case "Captain":
                    return new game.Unit("Captain",15,4,13,1,22,124,'Captain.png');
                    break;
                    
                //AirForce
                case "HawkEye":
                    return new game.Unit("HawkEye",0,10,1,1,6,61,'HawkEye.png');
                    break;
                case "Predator":
                    return new game.Unit("Predator",5,3,3,1,18,132,'Predator.png', true);
                    break;
                case "Hercules":
                    return new game.Unit("Hercules",0,0,5,1,14,103,'Hercules.png', true);
                    break;
                case "Apache":
                    return new game.Unit("Apache",8,5,6,1,12,150,'Apache.png', true);
                    break;
                case "Eagle":
                    return new game.Unit("Eagle",14,1,10,1,12,170,'Eagle.png', true);
                    break;
                case "Falcon":
                    return new game.Unit("Falcon",1,14,8,1,14,155,'Falcon.png', true);
                    break;
                case "Furtif":
                    return new game.Unit("Furtif",9,12,10,1,15,186,'Furtif.png', true);
                    break;
                case "Nuke":
                    return new game.Unit("Nuke",99,0,0,25,0,1000,'Nuclear.png', true);
                    break;
                default:
                    return null;
                    break;
            }
        }
    });


});
