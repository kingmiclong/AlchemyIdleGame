const GameInstance = class {
  constructor() {
    this.narrativeManager = new narrativeManager(this)
    
    this.stages = ["stage1", "stage2", "stage3"];
    this.currentStage = "stage1"; 
    this.panels = {
      "stage1": ["panel1", "panel2", "panel3"],
      "stage2": ["panel2-1"],
      "stage3": ["panel3-1"]
    }
    this.currentPanel = "panel1";

    this.resource1 = 0;
    this.resource2 = 0;
    this.resource3 = 0;
    this.resource4 = 0;
    this.resource5 = 0;
     
    this.resource1Speed = 1;
    this.resource2Speed = 1;
    this.resource3Speed = 1;
    this.resource4Speed = 1;
    this.resource5Speed = 1;

    this.resourceIntervals = {
      resource2: null,
      resource3: null,
      resource4: null,
      resource5: null
    };
    
    this.trophies = 0;
    this.firstFight = true;
    this.monstersDefeated = 0;

    this.health = 1;
    this.attack = 1;
    this.defense = 1;
    this.stamina = 1;
    this.luck = 1;

    this.collectorsProtected = 0;
    this.findersProtected = 0;
    this.gardenCollectors = 0;
      
    this.resources = {
      "resource1": { name: "Bronze", collectButton: "Collect Bronze" },
      "resource2": { name: "Silver", collectButton: "Mine Silver" },
      "resource3": { name: "Gold", collectButton: "Collect Gold" },
      "resource4": { name: "Platinum", collectButton: "Mine Platinum" },
      "resource5": { name: "Diamond", collectButton: "Collect Diamond" }
    }
  }

  setup() {
    for (let key in this.resources) {
      io.writeIntoElement(this.resources[key].name, key + "Name");
      io.writeIntoElement(this.resources[key].collectButton, key + "Button");
      
      if (key !== 'resource1') {
        document.getElementById(key + 'Row').style.display = 'none';
      }
    }

    // Display initial diamond count and stats
    io.writeIntoElement(this.health, "healthStat");
    io.writeIntoElement(this.attack, "attackStat");
    io.writeIntoElement(this.defense, "defenseStat");
    io.writeIntoElement(this.stamina, "staminaStat");
    io.writeIntoElement(this.luck, "luckStat");
  }
  
  generateMonster() {
    this.currentMonster = new Monster(this.monstersDefeated * 5);

    let monsterStats = `Monster stats: <br/>
    Health: ${this.currentMonster.health} <br/>
    Attack: ${this.currentMonster.attack} <br/>
    Defense: ${this.currentMonster.defense} <br/>
    Stamina: ${this.currentMonster.stamina} <br/>
    Luck: ${this.currentMonster.luck}`;
  
    io.writeIntoElement(monsterStats, "monsterStats");
    document.getElementById("fightMonster").style.display = '';
    document.getElementById("monsterImage").style.display = '';
  }
  
  fightMonster() {
     // The character with higher stamina attacks first
     let isPlayerTurn = this.stamina >= this.currentMonster.stamina;
    
    if (this.firstFight) {
      this.reportAction('You decide to fight the monster. Remember, you need to defeat 5 monsters to collect 5 trophies and get away from this world!!');
      this.firstFight = false;
    } else {
      this.reportAction('You decide to fight the monster.');
    }  
  
    while (this.health > 0 && this.currentMonster.health > 0) {
      if (isPlayerTurn) {
          this.attackMonster();
          if (this.currentMonster.health > 0) {
              isPlayerTurn = false;
          }
      } else {
          this.defendMonsterAttack();
          if (this.health > 0) {
              isPlayerTurn = true;
          }
      }
  }

    // After the fight, report the result:
    let result = '';
    if (this.health <= 0) {
        result = 'You lost the fight.';
    } else {
        result = 'You won the fight!!! Receive one trophy';
        this.trophies++;
        this.monstersDefeated++;
        if (this.trophies >= 5) {
            // Win condition
            result += " You have collected 5 trophies inserted the 5 alchemy elements and teleport to a new world!!";
        }
    }
    this.reportAction(result);

    document.getElementById('fightResult').innerHTML = result;
    document.getElementById('fightMonster').style.display = 'none';
  }

  attackMonster() {
    // Array of possible attack sentences
  const attackSentences = [
    'You strike with all your might!',
    'You swiftly attack the monster!',
    'You perform a powerful strike!',
    'With great skill, you land a hit on the monster!'
  ];

  // Choose a random sentence
  const attackSentence = attackSentences[Math.floor(Math.random() * attackSentences.length)];

  // Calculate damage, taking into account the player's luck for a critical hit
  const damage = this.attack * (Math.random() < this.luck / 10 ? 2 : 1);
  this.currentMonster.health -= Math.max(0, damage - this.currentMonster.defense);

  // Report the action with the chosen sentence
  this.reportAction(attackSentence);
  }

  defendMonsterAttack() {
    // Array of possible defense sentences
  const defendSentences = [
    'The monster strikes back fiercely!',
    'The monster launches a counterattack!',
    'With a growl, the monster hits back!',
    'The monster doesn not give up and attacks!'
  ];

  // Choose a random sentence
  const defendSentence = defendSentences[Math.floor(Math.random() * defendSentences.length)];

  // Calculate damage, taking into account the monster's luck for a critical hit
  const damage = this.currentMonster.attack * (Math.random() < this.currentMonster.luck / 10 ? 2 : 1);
  this.health -= Math.max(0, damage - this.defense);

  // Report the action with the chosen sentence
  this.reportAction(defendSentence);
  }

  gainResource1() {
    this.resource1 += this.resource1Speed; 
    this.updateDisplay();
  }

  gainResource2() {
    if (this.resource1 >= 5) {
        this.resource2 += this.resource2Speed;
        this.resource1 -= 5;
        console.log("Resource 2 (Silver) is now: " + this.resource2); 
        this.updateDisplay();

        // Start auto generating resource3 if it's not already doing so
        if (this.resourceIntervals.resource2 === null) {
            this.resourceIntervals.resource2 = setInterval(() => {
                if (this.resource1 >= 5) {
                    this.resource2 += this.resource2Speed;
                    this.resource1 -= 5;
                }
                this.updateDisplay();
            }, 5000);
        }
    }
  }

  gainResource3() {
    if (this.resource2 >= 5) {
        this.resource3 += this.resource3Speed;
        this.resource2 -= 5;
        console.log("Resource 3 (Gold) is now: " + this.resource3); 
        this.updateDisplay();

        // Start auto generating resource3 if it's not already doing so
        if (this.resourceIntervals.resource3 === null) {
            this.resourceIntervals.resource3 = setInterval(() => {
                if (this.resource2 >= 5) {
                    this.resource3 += this.resource3Speed;
                    this.resource2 -= 5;
                }
                this.updateDisplay();
            }, 15000);
        }
    }
  }

  gainResource4() {
      if (this.resource3 >= 5) {
          this.resource4 += this.resource4Speed;
          this.resource3 -= 5;
          console.log("Resource 4 (Platinum) is now: " + this.resource4); 
          this.updateDisplay();

          // Start auto generating resource4 if it's not already doing so
          if (this.resourceIntervals.resource4 === null) {
              this.resourceIntervals.resource4 = setInterval(() => {
                  if (this.resource3 >= 5) {
                      this.resource4 += this.resource4Speed;
                      this.resource3 -= 5;
                  }
                  this.updateDisplay();
              }, 180000);
          }
      }
  }

  gainResource5() {
      if (this.resource4 >= 5) {
          this.resource5 += this.resource5Speed;
          this.resource4 -= 5;
          console.log("Resource 5 (Diamond) is now: " + this.resource5); 
          this.updateDisplay();

          // Start auto generating resource5 if it's not already doing so
          if (this.resourceIntervals.resource5 === null) {
              this.resourceIntervals.resource5 = setInterval(() => {
                  if (this.resource4 >= 5) {
                      this.resource5 += this.resource5Speed;
                      this.resource4 -= 5;
                  }
                  this.updateDisplay();
              }, 380000);
          }
      }
  }

  upgradeResource1() {
    if (this.resource2 >= 10) {  // use resource5 to upgrade
      this.resource1Speed++;
      this.resource2 -= 10;
      this.updateDisplay();
    } else {
      this.reportAction("Not enough Silver to upgrade Bronze");
    }
  }
  
  upgradeResource2() {
    if (this.resource3 >= 20) {  // use resource5 to upgrade
        this.resource2Speed++;
        this.resource3 -= 20;
        this.reportAction('You decide to upgrade your Silver production speed. Your new speed is ' + this.resource2Speed + '.');

        // Start auto generating resource2 if it's not already doing so
        if (this.resourceIntervals.resource2 === null) {
            this.resourceIntervals.resource2 = setInterval(() => {
                if (this.resource1 >= 5) {
                    this.resource2 += this.resource2Speed;
                    this.resource1 -= 5;
                }
                this.updateDisplay();
            }, 1000);
        }

        this.updateDisplay();
    } else {
      this.reportAction("Not enough Golds to upgrade Silver");
    }
}
  
  upgradeResource3() {
    if (this.resource4 >= 30) {  // use resource5 to upgrade
      this.resource3Speed++;
      this.resource4 -= 30;
      this.reportAction('You decide to upgrade your Gold production speed. Your new speed is ' + this.resource3Speed + '.');

      // Start auto generating resource3 if it's not already doing so
      if (this.resourceIntervals.resource3 === null) {
          this.resourceIntervals.resource3 = setInterval(() => {
              if (this.resource2 >= 5) {
                  this.resource3 += this.resource3Speed;
                  this.resource2 -= 5;
              }
              this.updateDisplay();
          }, 1000);
      }

      this.updateDisplay();
  } else {
    this.reportAction("Not enough Platinum to upgrade Gold");
  }
}
  
  upgradeResource4() {
    if (this.resource5 >= 30) {  // use resource5 to upgrade
      this.resource4Speed++;
      this.resource5 -= 30;
      this.reportAction('You decide to upgrade your Silver production speed. Your new speed is ' + this.resource4Speed + '.');

      // Start auto generating resource4 if it's not already doing so
      if (this.resourceIntervals.resource4 === null) {
          this.resourceIntervals.resource4 = setInterval(() => {
              if (this.resource3 >= 5) {
                  this.resource4 += this.resource4Speed;
                  this.resource3 -= 5;
              }
              this.updateDisplay();
          }, 5000);
      }

      this.updateDisplay();
  } else {
    this.reportAction("Not enough diamonds to upgrade Platinum");
  }
}
  
  upgradeResource5() {
    if (this.resource5 >= 100) {  // use resource5 to upgrade
      this.resource5Speed++;
      this.resource5 -= 100;
      this.reportAction('You decide to upgrade your Diamond production speed. Your new speed is ' + this.resource5Speed + '.');

      // Start auto generating resource5 if it's not already doing so
      if (this.resourceIntervals.resource5 === null) {
          this.resourceIntervals.resource5 = setInterval(() => {
              if (this.resource4 >= 5) {
                  this.resource5 += this.resource5Speed;
                  this.resource4 -= 5;
              }
              this.updateDisplay();
          }, 10000);
      }

      this.updateDisplay();
  } else {
      console.log("Not enough diamonds to upgrade Diamond");
  }
}

  exchangeResource1ToResource2() {
    if (this.resource1 >= 50) {
      this.resource1 -= 50;
      this.resource2 += 10;
      this.updateDisplay();
    }
  }

  exchangeResource2ToResource3() {
    if (this.resource2 >= 50) {
      this.resource2 -= 50;
      this.resource3 += 10;
      this.updateDisplay();
    }
  }

  exchangeResource3ToResource4() {
    if (this.resource3 >= 50) {
      this.resource3 -= 50;
      this.resource4 += 10;
      this.updateDisplay();
    }
  }

  exchangeResource4ToResource5() {
    if (this.resource4 >= 50) {
      this.resource4 -= 50;
      this.resource5 += 10;
      this.updateDisplay();
    }
  }

  exchangeResource1ToResource2Bulk() {
    if (this.resource1 >= 100) {
      this.resource1 -= 100;
      this.resource2 += 20;
      this.updateDisplay();
    }
  }

  exchangeResource2ToResource3Bulk() {
    if (this.resource2 >= 100) {
      this.resource2 -= 100;
      this.resource3 += 20;
      this.updateDisplay();
    }
  }

  exchangeResource3ToResource4Bulk() {
    if (this.resource3 >= 100) {
      this.resource3 -= 100;
      this.resource4 += 20;
      this.updateDisplay();
    }
  }

  exchangeResource4ToResource5Bulk() {
    if (this.resource4 >= 100) {
      this.resource4 -= 100;
      this.resource5 += 20;
      this.updateDisplay();
    }
  }

  upgrade(trait) {
    if (this.resource5 >= 5) {  // use resource5 instead of diamond
      if (this[trait] !== undefined) {
        this[trait]++;
        this.resource5 -= 5;  // use resource5 instead of diamond
        io.writeIntoElement(this[trait], trait + "Stat");
        io.writeIntoElement(this.resource5, "resource5Number");  // use resource5 instead of diamond
        this.reportAction('You decide to upgrade your ' + trait + '. Your new ' + trait + ' is ' + this[trait] + '.');
      }
    } else {
      console.log("Not enough diamonds to upgrade " + trait);
    }
  }
  runResource2Work() {
    this.resource1 += this.resource2;
  }
  runResource1Work() {
    this.resource1 += this.resource1Speed;
  }
  
  swichPanels(panel) {
    game.currentPanel = panel;
    io.showPanel(game);    
  }

  updateDisplay() {
    for (let key in this.resources) {
      io.writeValueIntoClass(this[key], key + "Number");
  
      if ((key === 'resource2' && this.resource1 >= 5) || 
          (key === 'resource3' && this.resource2 >= 5) || 
          (key === 'resource4' && this.resource3 >= 5) || 
          (key === 'resource5' && this.resource4 >= 5)) {
        document.getElementById(key + 'Row').style.display = '';
      }
  
      if (document.getElementById(key + 'Speed')) {  // check if the HTML element exists
        document.getElementById(key + 'Speed').innerHTML = this[key + 'Speed'];
      }
    }
  
    // Run narrative manager assess function to unlock new resources based on conditions
    this.narrativeManager.assess();
  }

  reportAction(text) {
    let reportsElement = document.getElementById('reports');
    reportsElement.innerHTML += '<p>' + text + '</p>';
  }
  
};

class Monster {
  constructor(statIncrease = 0) {
    this.health = Math.floor(Math.random() * 10) + 1 + statIncrease;
    this.attack = Math.floor(Math.random() * 10) + 1 + statIncrease;
    this.defense = Math.floor(Math.random() * 10) + 1 + statIncrease;
    this.stamina = Math.floor(Math.random() * 10) + 1 + statIncrease;
    this.luck = Math.floor(Math.random() * 10) + 1 + statIncrease;
  }
}

function resetGame() {
  localStorage.clear();
  // Stop all intervals
  for (let key in game.resourceIntervals) {
      if (game.resourceIntervals[key]) {
          clearInterval(game.resourceIntervals[key]);
          game.resourceIntervals[key] = null;
      }
  }
  location.reload();  // This will refresh the page
}
// this function forom JQuery waits until the web page is fully loaded before triggering the start of the game
$(document).ready(function() {
  game = new GameInstance();
  game.setup();
  game.narrativeManager.setup();

  io.showStage(game); 
  game.updateDisplay();

  StatAnalysis.startRecording(game);

  gameTimer = setInterval(function(){
    game.runResource1Work();
    game.runResource2Work();
    game.narrativeManager.assess();
    game.updateDisplay();
  }, 500);
  // Add event listener to generateMonsterButton
  document.getElementById("generateMonsterButton").addEventListener("click", function() {
    game.generateMonster();
  });

  // Event listeners for the new bulk exchange buttons
  document.getElementById("exchangeResource2ToResource3Bulk").addEventListener("click", function() {
    game.exchangeResource2ToResource3Bulk();
  });

  document.getElementById("exchangeResource3ToResource4Bulk").addEventListener("click", function() {
    game.exchangeResource3ToResource4Bulk();
  });

  document.getElementById("exchangeResource4ToResource5Bulk").addEventListener("click", function() {
    game.exchangeResource4ToResource5Bulk();
  });

  // Event listeners for reset game button
  document.getElementById("resetButton").addEventListener("click", function() {
    localStorage.clear();
    resetGame();
  });
});
