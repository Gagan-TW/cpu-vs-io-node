const {performance} = require("node:perf_hooks");
function addNumbers(upTo) {
  let sum = 0;
  for (let i = 1; i <= upTo; i++) {
    sum += i;
  }
  return sum;
}

const requestDelay = 10;
const start = performance.now();

setTimeout(() => {
  const end = performance.now();
  console.log("Delay requested:", requestDelay, "ms");
  console.log("Delay measured: ", (end - start).toFixed(2), "ms");
}, requestDelay);

console.log("Alarm is set. Waiting...");
const workStart = performance.now();
addNumbers(100_000_000);
const workEnd = performance.now();
console.log("Big work finished in:", (workEnd - workStart).toFixed(2), "ms");