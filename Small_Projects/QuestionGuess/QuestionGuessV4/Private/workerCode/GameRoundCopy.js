const { parentPort } = require('worker_threads');
console.log("hey there");

function wait(ms){
  var d = new Date();
  var d2 = null;
  do {d2 = new Date(); }
  while(d2 - d < ms);
}

wait(4000);
parentPort.postMessage({value: 34 + 5});
