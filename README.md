# CPU-Bound vs I/O-Bound Laboratory

A small Node.js project that shows, with real measurements, the difference between I/O-bound work (waiting) and CPU-bound work (computing), and how long synchronous calculations can delay other work on the main JavaScript thread.

This project is the practical foundation for learning about Worker Threads.

## Prerequisites

- [Node.js](https://nodejs.org/) version 22 or later
- A terminal (for example, the terminal in Visual Studio Code)

Check your Node.js version:

```
node -v
```

## Setup

1. Download or clone this repository.
2. Open a terminal in the project folder (`cpu-io-laboratory`).

No packages need to be installed. The project uses only built-in Node.js modules (`node:fs/promises` and `node:perf_hooks`).

## Project structure

```
cpu-io-laboratory/
├── data/
│   └── sample.txt              # Small text file used by the I/O experiments
├── docs/
│   └── cpu-vs-io.md            # Explanation of CPU-bound and I/O-bound work
├── experiments/
│   ├── 01-async-file-read.js
│   ├── 02-cpu-calculation.js
│   ├── 03-event-loop-delay.js
│   └── 04-compare-workloads.js
├── results/
│   └── observations.md         # Measured results and observations
├── package.json
└── README.md
```

## How to run the experiments

Run each command from the project folder. Each experiment runs on its own.

| Experiment | Command | Expected behavior |
|---|---|---|
| 1. Asynchronous file reading | `node experiments/01-async-file-read.js` | Prints messages 1, 2, and 3 in order, then the number of characters read and the time taken. Message 2 appears before the file arrives. |
| 2. CPU-intensive calculation | `node experiments/02-cpu-calculation.js` | Adds numbers from 1 to 100,000,000, compares the result with a formula, prints `Correct? true`, and shows the time taken. |
| 3. Event loop delay | `node experiments/03-event-loop-delay.js` | Sets a 10 ms timer, runs a long calculation, then shows that the timer ran much later than 10 ms. |
| 4. Workload comparison | `node experiments/04-compare-workloads.js` | Runs the file read and the calculation one after the other, and prints both times in a table. |

> On Windows, `experiments\<file-name>.js` (backslash) also works.

## Results summary

Measured on a Windows 11 laptop (Intel Core i5-8265U, 16 GB RAM, Node.js v22.18.0):

| Experiment | Result |
|---|---|
| File read (I/O) | 1.45 ms to 1.92 ms |
| Calculation (CPU) | 108.53 ms to 161.00 ms |
| 10 ms timer without calculation | 9.74 ms to 14.40 ms |
| 10 ms timer during calculation | 224.19 ms to 392.50 ms |

**Key finding:** Reading a small file did not block the main thread. A long synchronous calculation did, and a 10 ms timer had to wait until the calculation finished.

Full results: [results/observations.md](results/observations.md)
Concepts explained: [docs/cpu-vs-io.md](docs/cpu-vs-io.md)

## Known limitations

- Timing varies between runs, because other programs share the computer.
- Each experiment was run only 3 to 5 times, on one computer.
- The workloads are small and simple compared with real applications.
- Your results will differ on a different computer.

See [Limitations](results/observations.md#limitations) for details.

