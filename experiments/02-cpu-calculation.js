const { performance } = require("node:perf_hooks");
function addNumbers(upto) {
  let sum = 0;
    for (let i = 1; i <= upto; i++) {   
       sum += i;
    }
    return sum;
}
const upTo = 100_000_000;
const expected = (upTo * (upTo + 1)) / 2;

if (expected > Number.MAX_SAFE_INTEGER) {
  console.log("Sorry, this number is too big.");
  console.log("The answer would not be exact. Please choose a smaller number.");
} else {
  const start = performance.now();
  const result = addNumbers(upTo);
  const end = performance.now();

  console.log("Sum from loop:   ", result);
  console.log("Sum from formula:", expected);
  console.log("Correct?", result === expected);
  console.log("Time taken:", (end - start).toFixed(2), "ms");
}