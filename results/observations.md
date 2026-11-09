# Experimental Observations

## Test environment

All experiments were run on the following setup:

- **Operating system:** Windows 11 (version 10.0.26200.9711), 64-bit
- **Node.js version:** v22.18.0
- **Processor:** Intel Core i5-8265U @ 1.60 GHz
- **Memory (RAM):** 16 GB
- **Other programs running:** Visual Studio Code and OneDrive (background sync)
- **How each experiment was run:** from the VS Code terminal, using `node experiments\<file-name>.js`

Results may differ on other computers, because processor speed, memory, and background programs all affect timing.

## Experiment 1: Asynchronous file reading

**What it does:** Reads a text file without waiting immediately, does other work while the file is being read, and measures how long the read takes.

**File:** `experiments/01-async-file-read.js`

### Results

| Run | Time taken |
|---|---|
| 1 | 1.49 ms |
| 2 | 1.77 ms |
| 3 | 1.69 ms |
| 4 | 1.47 ms |
| 5 | 1.92 ms |

Characters read: 160

### What I observed

- The messages appeared in the order 1 → 2 → 3. Message 2 ("Doing other work") printed before the file arrived.
- This shows the program did not freeze while the file was being read. Node.js moved on to other tasks and came back when the file was ready.
- Reading the file took between 1.47 ms and 1.92 ms.
- The time was different in each run, because other programs (VS Code, OneDrive, Windows) were sharing the computer's resources at the same time.
- When the file was missing, the program first crashed with a long error. After adding try/catch, it showed a short, polite error message instead.

### What this does not prove

- The test file was very small (160 characters). A fast result for a small file does not mean that larger files, slower storage, or a busier computer would give the same speed.

## Experiment 2: CPU-intensive calculation

**What it does:** Adds every whole number from 1 to 100,000,000 using a loop, checks the answer with a formula, and measures how long the loop takes.

**File:** `experiments/02-cpu-calculation.js`

### Results

| Run | Time taken |
|---|---|
| 1 | 121.53 ms |
| 2 | 161.00 ms |
| 3 | 114.48 ms |

Sum from loop: 5000000050000000
Sum from formula: 5000000050000000
Correct? true

### What I observed

- The loop's answer matched the formula n × (n + 1) ÷ 2, so the result is verified.
- The calculation took between 114.48 ms and 161.00 ms, much longer than reading the small file in Experiment 1.
- With 1,000,000,000, the loop gave a wrong answer (500000000067109000 instead of 500000000500000000). The total was bigger than JavaScript's safe limit for whole numbers (`Number.MAX_SAFE_INTEGER`), so it was silently rounded.
- I added a safety check. If the expected answer is too big, the program shows a clear message and stops before running the loop.
- While the loop was running, the main thread was fully busy. The program could not do anything else until the loop finished.

### What this does not prove

- The time depends on how much work the loop does and on the computer. A smaller number, a different calculation, or a faster processor would give different times. CPU work is not always slow; it becomes a problem when there is a lot of it.

## Experiment 3: Event loop delay

**What it does:** Sets a timer for 10 ms, then runs a long CPU calculation (adding 1 to 100,000,000), and measures when the timer is actually handled.

**File:** `experiments/03-event-loop-delay.js`

### Results

**Without the calculation (quiet run):**

| Run | Requested delay | Measured delay |
|---|---|---|
| 1 | 10 ms | 12.52 ms |
| 2 | 10 ms | 14.40 ms |
| 3 | 10 ms | 9.74 ms |

**With the calculation (busy run):**

| Run | Requested delay | Calculation time | Measured delay |
|---|---|---|---|
| 1 | 10 ms | 215.26 ms | 224.19 ms |
| 2 | 10 ms | 343.71 ms | 392.50 ms |
| 3 | 10 ms | 218.23 ms | 230.80 ms |

### What I observed

- Without the calculation, the timer was handled close to the requested 10 ms (between 9.74 ms and 14.40 ms).
- With the calculation, the timer was handled between 224.19 ms and 392.50 ms, more than 20 times later than requested.
- The timer became ready at about 10 ms, but the main thread was busy with the calculation. The timer could only run after the calculation and the rest of the current code had finished.
- In every busy run, the measured delay was slightly longer than the calculation time. This shows the timer was waiting for the calculation to finish.
- Even though the timer code is written above the calculation in the file, its messages printed last. Code inside `setTimeout` is scheduled for later, not run immediately.
- One quiet run measured 9.74 ms, slightly less than 10 ms. Timers are approximate, and the timer's internal clock is not exactly the same as the `performance.now()` stopwatch.

### What this does not prove

- Timers are never perfectly exact, even without blocking, because the operating system and other programs also affect timing.
- The size of the delay depends on how long the calculation takes. A shorter calculation would cause a shorter delay, and a faster computer would finish the calculation sooner.

## Experiment 4: Workload comparison

**What it does:** Runs the file read and the CPU calculation one after the other in the same program, and shows both times in a comparison table.

**File:** `experiments/04-compare-workloads.js`

### Results

| Run | File read (I/O) | Calculation (CPU) |
|---|---|---|
| 1 | 1.58 ms | 114.09 ms |
| 2 | 1.47 ms | 108.53 ms |
| 3 | 1.45 ms | 111.43 ms |

### Comparison

| Measurement | I/O experiment | CPU experiment |
|---|---|---|
| Operation | Read a local file | Add numbers from 1 to 100,000,000 |
| Primary workload | Filesystem I/O | JavaScript computation |
| Main thread behavior | Can continue while asynchronous I/O is pending | Occupied while the synchronous calculation runs |
| Measured time | 1.45 ms to 1.58 ms | 108.53 ms to 114.09 ms |
| Potential performance concern | Slow storage or very large files | Long computation delaying other callbacks |

### What I observed

- In these runs, the calculation took roughly 70 times longer than the file read.
- Running both jobs in one program, one after the other, made the comparison fair: both ran on the same computer at the same moment.
- In an earlier version, the calculation ran before the file read, and the file read once took 9.52 ms. After moving the file read first, it returned to about 1.5 ms. This suggests that heavy work just before a measurement can affect it, but one run is not enough to be sure.
- When the file was missing, the program showed a clear error message and skipped the calculation and the table.

### What this does not prove

- The two jobs are not equal-sized tasks, so "70 times longer" only applies to these specific workloads. A larger file could take longer to read, and a smaller calculation could finish faster.

## Limitations

- **Timing varies between runs.** The same code gave different times each run, because other programs (VS Code, OneDrive, Windows background tasks) share the computer. Results are reported as ranges, not exact values.
- **Small number of runs.** Each experiment was run 3 to 5 times. This shows a clear pattern, but is not enough for detailed statistical conclusions.
- **One computer only.** All results come from a single laptop. A different processor, amount of memory, or storage type would produce different numbers.
- **Simple, small workloads.** The file was tiny (160 characters) and the calculation was a simple loop. Real applications perform larger and more varied work.
- **Timers are approximate.** Even without blocking, a 10 ms timer did not run at exactly 10 ms (one run measured 9.74 ms).
- **Measurements are taken from inside the program.** `performance.now()` measures elapsed time within Node.js. It does not show what the operating system was doing at the same moment.
