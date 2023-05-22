let StatAnalysis = {
  trackedValues: ["resource1", "resource2", "resource3", "resource4", "resource5"],
  record: [],
  recordingClock: null,
  time: 0,
  startRecording: function (gameObject, valuesArray=this.trackedValues, seconds=5){ 
    this.record = [];
    this.time = 0;
    let header = "Seconds, ";
    for (let x in valuesArray) {header += valuesArray[x] + ", "};
    this.record.push(header);
    this.recordingClock = setInterval(() => {
      let entry = this.time + ", ";
      this.time++;
      for (let x in valuesArray) {entry += gameObject[valuesArray[x]] + ", "};
      this.record.push(entry);
      console.log(entry);
    }, seconds*1000)
  },
  stopRecording: function(){
    clearInterval(this.recordingClock);
    let output = "";
    for (let x in this.record) {output += this.record[x] + ";\n"} 
    this.download("game_data_" + this.time + ".csv", output);
  },
  download: function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
