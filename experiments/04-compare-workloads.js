const { readFile } = require("node:fs/promises");
const { performance } = require("node:perf_hooks");

function addNumbers(upTo) {
  let sum = 0;
  for (let i = 1; i <= upTo; i++) {
    sum += i;
  }
  return sum;
}

function measureCalculation() {
  const start = performance.now();
  addNumbers(100_000_000);
  const end = performance.now();
  return end - start;
}

async function measureFileRead() {
  const start = performance.now();
  await readFile("data\\sample.txt", "utf-8");
  const end = performance.now();
  return end - start;
}
 
async function main() {
  try {
    const ioTime = await measureFileRead();
    const cpuTime = measureCalculation();

    console.table([
      { Job: "Read a file", Type: "Waiting (I/O)", "Time (ms)": ioTime.toFixed(2) },
      { Job: "Add 10 crore numbers", Type: "Thinking (CPU)", "Time (ms)": cpuTime.toFixed(2) },
    ]);
  } catch (error) {
    console.log("Sorry, the comparison could not be completed.");
    console.log("Reason:", error.message);
  }
}



main()
