// this object is to keep track of narrative beats and unlocks

// each "beat" has a test function, a function which unlocks elements, and a report function

const narrativeManager = class {
  constructor(parentObject) {
  this.data = parentObject;
    console.log(parentObject, this.data)
    
    this.beats = [
      {
        triggered: false,
        test: function(data){return data.resource1 >= 5},
        unlock:function(){document.getElementById("resource2Row").style.display = ''},
        report: function(){
          io.appendIntoElement("You unlocked Bronze usage", "reports");
          io.writeIntoElement ("Bronze Age", "era");
          }
      },
      {
        triggered: false,
        test: function(data){return data.resource2 >= 5},
        unlock:function(){document.getElementById("resource3Row").style.display = ''},
        report: function(){
          io.appendIntoElement("You unlocked silver usage", "reports");
          io.writeIntoElement ("Silver", "era");
        }
      },
      {
        triggered: false,
        test: function(data){return data.resource3 >= 5},
        unlock:function(){document.getElementById("resource4Row").style.display = ''},
        report: function(){
          io.appendIntoElement("You have progressed far enough to discover Resource 3", "reports");
          io.writeIntoElement ("Gold Age", "era");
          }
      },
      {
        triggered: false,
        test: function(data){return data.resource4 >= 5},
        unlock:function(){document.getElementById("resource5Row").style.display = ''},
        report: function(){
          io.appendIntoElement("You unlocked Platinum usage", "reports");
          io.writeIntoElement ("Platnium Age", "era");
        }
      },
      {
        triggered: false,
        test: function(data){return data.resource5 >= 5},
        unlock:function(){ /* Here should be the code to unlock the next panel, similar to the above examples */ },
        report: function(){
          io.appendIntoElement("You unlocked Diamond usage", "reports");
          io.writeIntoElement ("Upgrade Age", "era");
        }
      }
      ]
  }
  
  setup() {
    for (let key in this.resources) {
      io.writeIntoElement(this.resources[key].name, key + "Name");
      io.writeIntoElement(this.resources[key].collectButton, key + "Button");
      
      if (key !== 'resource1') {
        document.getElementById(key + 'Row').style.display = 'none';
      }
    }
  }


// goes through all narrative events, checks if they activate, runs activation code, and runs code that delivers a message about the story event
  assess(){
    for (let b = 0; b < this.beats.length; b++){
      let beat = this.beats[b]
      if (!beat.triggered){
        console.log("Testing beat: " + b); // Add this line to track beat testing
        if (beat.test(this.data)){
          beat.triggered = true;
          beat.unlock();
          beat.report();
        }
      }
    }
  }

}