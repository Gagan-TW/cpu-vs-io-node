const {readFile} = require("node:fs/promises");
const {performance} = require("node:perf_hooks");
async function main() {
  console.log("1. Asking for file");
  const start = performance.now();
  const readPromise = readFile("data\\sample.txt", "utf-8");
  console.log("2. Doing other work while the file is on its way...");
  try {
    const fileContent = await readPromise;
    const end = performance.now();
    console.log("3. File arrived! Characters read:", fileContent.length);
    console.log("4. Time taken:", (end - start).toFixed(2),"ms");
  } catch (error) {
    console.log("Sorry, could not read the file.");
    console.log("Reason:", error.message);
  }
}
main();