// scripts/provision-coding-subjects.js
import { db, auth } from "../src/services/firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";

const SUBJECTS_DATA = [
  {
    id: "html",
    name: "HTML",
    code: "HTML",
    description: "HyperText Markup Language, HTML5 semantics, web accessibility, forms, and DOM structure.",
    color: "amber",
    icon: "Code",
    status: "active",
    order: 1
  },
  {
    id: "css",
    name: "CSS",
    code: "CSS",
    description: "Cascading Style Sheets, modern CSS3, Flexbox, Grid, animations, and responsive UI architecture.",
    color: "blue",
    icon: "Palette",
    status: "active",
    order: 2
  },
  {
    id: "javascript",
    name: "JavaScript",
    code: "JS",
    description: "ECMAScript fundamentals, asynchronous programming, closures, event loop, and modern browser APIs.",
    color: "yellow",
    icon: "FileCode2",
    status: "active",
    order: 3
  },
  {
    id: "operating-systems",
    name: "Operating Systems",
    code: "OS",
    description: "Process management, CPU scheduling, thread synchronization, deadlocks, paging, and virtual memory.",
    color: "purple",
    icon: "Cpu",
    status: "active",
    order: 4
  },
  {
    id: "dbms",
    name: "DBMS",
    code: "DBMS",
    description: "Database Management Systems, relational model, normalization, SQL, indexing, and ACID transactions.",
    color: "indigo",
    icon: "Database",
    status: "active",
    order: 5
  },
  {
    id: "coa",
    name: "COA",
    code: "COA",
    description: "Computer Organization & Architecture, memory hierarchy, cache mapping, instruction pipelining, and RISC/CISC.",
    color: "emerald",
    icon: "Binary",
    status: "active",
    order: 6
  },
  {
    id: "dsa",
    name: "DSA",
    code: "DSA",
    description: "Data Structures & Algorithms, trees, graphs, sorting, dynamic programming, and asymptotic complexity analysis.",
    color: "rose",
    icon: "GitBranch",
    status: "active",
    order: 7
  }
];

const NEW_QUESTIONS = {
  "operating-systems": [
    {
      id: "os-q-01",
      question: "Which of the following is NOT one of Coffman's four necessary conditions for a deadlock to occur?",
      options: [
        "Mutual Exclusion",
        "Hold and Wait",
        "Preemption Allowed",
        "Circular Wait"
      ],
      answer: 2,
      correctAnswer: "C",
      difficulty: "Easy",
      explanation: "The condition for deadlock is 'No Preemption'. If preemption is allowed, deadlock cannot occur because resources can be preempted from processes."
    },
    {
      id: "os-q-02",
      question: "What is thrashing in an operating system?",
      options: [
        "A CPU scheduling algorithm prioritizing background jobs",
        "A state where the system spends more time paging than executing processes",
        "A hardware crash caused by overheating of the CPU",
        "A deadlocked state between input and output devices"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "Thrashing occurs when the total working set exceeds available physical memory, causing continuous page faults and excessive I/O activity that degrades CPU utilization."
    },
    {
      id: "os-q-03",
      question: "In the Round-Robin CPU scheduling algorithm, what happens if the time quantum is chosen to be extremely large?",
      options: [
        "It degenerates into First-Come First-Served (FCFS)",
        "It degenerates into Shortest Job First (SJF)",
        "It causes an infinite loop in the kernel dispatcher",
        "Context switching overhead increases exponentially"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "When the time quantum is larger than the longest process burst time, processes run to completion before quantum expiry, making it behave identically to FCFS."
    },
    {
      id: "os-q-04",
      question: "Which system call creates a new process in Unix/Linux operating systems by duplicating the calling process?",
      options: [
        "exec()",
        "fork()",
        "clone()",
        "spawn()"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "fork() creates an exact duplicate child process. It returns 0 in the child process and the child PID in the parent process."
    },
    {
      id: "os-q-05",
      question: "What is the primary function of the Translation Lookaside Buffer (TLB)?",
      options: [
        "Cache frequently used disk sectors",
        "Cache virtual-to-physical address translations to accelerate memory access",
        "Store interrupt vectors for kernel exceptions",
        "Buffer keyboard and mouse inputs before processing"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "The TLB is an associative hardware cache in the MMU that stores recent virtual-to-physical page translations, avoiding extra RAM lookups for page tables."
    },
    {
      id: "os-q-06",
      question: "What happens during a context switch?",
      options: [
        "The CPU reboots the kernel to clear system caches",
        "The state of the currently executing process is saved in its PCB and another process's state is loaded",
        "All memory pages belonging to the active process are flushed to disk",
        "The system switches from 64-bit mode to 32-bit legacy mode"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "Context switching stores CPU registers, program counter, and stack pointers of the outgoing process in its Process Control Block (PCB) and restores the state of the next scheduled process."
    },
    {
      id: "os-q-07",
      question: "Which page replacement algorithm suffers from Belady's Anomaly (where increasing page frames can increase page faults)?",
      options: [
        "Least Recently Used (LRU)",
        "Optimal Page Replacement (OPT)",
        "First-In, First-Out (FIFO)",
        "Least Frequently Used (LFU)"
      ],
      answer: 2,
      correctAnswer: "C",
      difficulty: "Medium",
      explanation: "Belady's Anomaly occurs in FIFO replacement because FIFO is not a stack algorithm (the set of pages in an n-frame allocation is not necessarily a subset of pages in an (n+1)-frame allocation)."
    },
    {
      id: "os-q-08",
      question: "What is a counting semaphore with an initial value of 1 practically equivalent to?",
      options: [
        "A spinlock with infinite timeout",
        "A binary semaphore (Mutex)",
        "A message queue channel",
        "A barrier synchronization primitive"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "A counting semaphore initialized to 1 can take values of only 0 and 1, making it function as a binary semaphore or mutex lock to enforce mutual exclusion."
    },
    {
      id: "os-q-09",
      question: "In Banker's Algorithm for deadlock avoidance, a state is considered 'safe' if:",
      options: [
        "No processes are currently waiting for resources",
        "There exists at least one sequence of process allocations that allows all processes to finish",
        "All resource instances have been allocated to the highest priority process",
        "Deadlock detection runs once every second"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Hard",
      explanation: "A state is safe if there exists a safe sequence <P1, P2, ... Pn> such that for each Pi, the resources that Pi can still request can be satisfied by currently available resources plus resources held by all Pj with j < i."
    },
    {
      id: "os-q-10",
      question: "Which of the following IPC (Inter-Process Communication) mechanisms provides the fastest data exchange between processes on the same host?",
      options: [
        "Unix Domain Sockets",
        "Named Pipes (FIFOs)",
        "Shared Memory",
        "Message Queues"
      ],
      answer: 2,
      correctAnswer: "C",
      difficulty: "Medium",
      explanation: "Shared Memory is the fastest IPC mechanism because once the memory region is mapped into both process address spaces, data transfers do not require kernel mediation or copying."
    }
  ],

  "dbms": [
    {
      id: "dbms-q-01",
      question: "Which ACID property guarantees that a transaction either completes in its entirety or none of its effects are reflected in the database?",
      options: [
        "Atomicity",
        "Consistency",
        "Isolation",
        "Durability"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "Atomicity ('all-or-nothing') ensures that if any statement inside a transaction fails, all previously executed statements within that transaction are rolled back."
    },
    {
      id: "dbms-q-02",
      question: "A relation is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
      options: [
        "Y is a prime attribute",
        "X is a superkey",
        "X contains only atomic values",
        "Y is functionally dependent on the candidate key"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "BCNF is a stricter version of 3NF where for every non-trivial FD X -> Y, X must be a superkey of the relation without exception."
    },
    {
      id: "dbms-q-03",
      question: "Why are B+ Trees preferred over B Trees for indexing relational databases on disk storage?",
      options: [
        "B+ Trees consume zero disk space",
        "Leaf nodes in a B+ Tree are linked sequentially, enabling highly efficient range queries",
        "B+ Trees store data records only in non-leaf root nodes",
        "B+ Trees have an O(1) worst-case search complexity"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "In B+ Trees, all actual data pointers reside at the leaf level, and leaf nodes are linked via a doubly linked list. This allows sequential disk reads for range queries (BETWEEN x AND y) without traversing parent nodes."
    },
    {
      id: "dbms-q-04",
      question: "Which SQL clause is used to filter aggregated group records produced by a GROUP BY statement?",
      options: [
        "WHERE",
        "HAVING",
        "FILTER",
        "ORDER BY"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "The HAVING clause filters groups created by GROUP BY based on aggregate conditions (e.g. HAVING COUNT(*) > 5), whereas WHERE filters individual rows before grouping."
    },
    {
      id: "dbms-q-05",
      question: "What is the highest and strictest transaction isolation level defined by the ANSI SQL standard?",
      options: [
        "Read Uncommitted",
        "Read Committed",
        "Repeatable Read",
        "Serializable"
      ],
      answer: 3,
      correctAnswer: "D",
      difficulty: "Medium",
      explanation: "Serializable isolation prevents dirty reads, non-repeatable reads, and phantom reads by ensuring concurrent transactions produce the same results as if executed serially."
    },
    {
      id: "dbms-q-06",
      question: "What type of JOIN returns all records from the left table and matched records from the right table, filling missing right values with NULL?",
      options: [
        "INNER JOIN",
        "LEFT OUTER JOIN",
        "FULL OUTER JOIN",
        "CROSS JOIN"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "A LEFT OUTER JOIN preserves all rows from the left table regardless of whether there is a match in the right table."
    },
    {
      id: "dbms-q-07",
      question: "In the Two-Phase Locking (2PL) protocol, what characterizes the 'shrinking phase'?",
      options: [
        "Locks may be acquired but none can be released",
        "Locks may be released but no new locks can be acquired",
        "Transactions are forcefully aborted if deadlocks occur",
        "The buffer pool shrinks in physical RAM size"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Hard",
      explanation: "Under 2PL, a transaction consists of a growing phase (acquiring locks without releasing any) and a shrinking phase (releasing locks without acquiring any new ones). This guarantees conflict serializability."
    },
    {
      id: "dbms-q-08",
      question: "What is a Foreign Key constraint in relational databases?",
      options: [
        "A key that uniquely identifies a record on an external remote server",
        "An attribute in a table that references the primary key of another table, enforcing referential integrity",
        "A secondary index configured on encrypted columns",
        "A key that allows duplicate values only during weekends"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "A Foreign Key establishes a relationship between two tables by matching the primary key in the referenced table, ensuring referential integrity."
    },
    {
      id: "dbms-q-09",
      question: "What is the purpose of the Write-Ahead Logging (WAL) protocol in DBMS recovery systems?",
      options: [
        "To write logs to disk only after the database restarts",
        "To ensure log records of transaction modifications are flushed to non-volatile disk before the corresponding dirty data pages are written",
        "To compress SQL query text before execution",
        "To prevent multiple users from connecting concurrently"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "WAL ensures that log records describing a change are persisted to disk before data changes reach the database files, allowing the ARIES algorithm to perform REDO and UNDO after a crash."
    },
    {
      id: "dbms-q-10",
      question: "Which normal form removes partial dependency (where a non-prime attribute depends on only part of a composite candidate key)?",
      options: [
        "First Normal Form (1NF)",
        "Second Normal Form (2NF)",
        "Third Normal Form (3NF)",
        "Fourth Normal Form (4NF)"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "2NF requires 1NF and that every non-prime attribute is fully functionally dependent on every candidate key (no partial dependency)."
    }
  ],

  "coa": [
    {
      id: "coa-q-01",
      question: "What is the primary difference between Von Neumann and Harvard computer architectures?",
      options: [
        "Harvard architecture uses separate buses and memory spaces for instructions and data, whereas Von Neumann shares them",
        "Von Neumann architecture supports 64-bit computation while Harvard supports only 8-bit",
        "Harvard architecture does not require a clock signal",
        "Von Neumann architecture has no CPU registers"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "Von Neumann architecture shares memory and bus bandwidth for both instructions and data (leading to the 'Von Neumann bottleneck'), while Harvard architecture features dedicated memories and buses."
    },
    {
      id: "coa-q-02",
      question: "In computer memory hierarchy, which storage component provides the lowest access latency?",
      options: [
        "L1 Cache",
        "CPU General-Purpose Registers",
        "L3 Cache",
        "Synchronous DRAM (Main Memory)"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "CPU registers reside directly inside the processor data path and operate within a fraction of a clock cycle (< 1 ns)."
    },
    {
      id: "coa-q-03",
      question: "What is a 'Data Hazard' (such as RAW - Read After Write) in a pipelined CPU?",
      options: [
        "A condition where hardware resources like the ALU cannot support simultaneous instructions",
        "A hazard occurring when an instruction depends on the result of a prior instruction still in the pipeline",
        "A branch instruction causing wrong path execution",
        "A parity check failure in the L2 cache"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "A RAW hazard happens when instruction j tries to read a source register before prior instruction i has written to it. It can be resolved using data forwarding/bypassing or pipeline stalling."
    },
    {
      id: "coa-q-04",
      question: "In a Direct-Mapped Cache with 256 cache lines, how many cache lines can a specific main memory block map to?",
      options: [
        "Any of the 256 lines",
        "Exactly 1 specific line determined by (Block Address % 256)",
        "Exactly 2 lines",
        "Any empty line currently available"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "In direct mapping, each memory block maps to exactly one cache line: line = (memory block address) mod (number of lines in cache)."
    },
    {
      id: "coa-q-05",
      question: "What is the function of the Program Counter (PC) register?",
      options: [
        "Counts the total number of lines in the compiled source code",
        "Holds the memory address of the next instruction to be fetched and executed",
        "Stores the result of the most recent ALU arithmetic comparison",
        "Stores the return address of interrupt subroutines exclusively"
      ],
      answer: 1,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "The Program Counter holds the memory address of the next instruction to be fetched from code memory during the instruction cycle."
    },
    {
      id: "coa-q-06",
      question: "What is Direct Memory Access (DMA)?",
      options: [
        "A CPU instruction that bypasses the cache",
        "A hardware feature allowing I/O devices to transfer data directly to/from main memory without CPU intervention",
        "A software driver technique for memory defragmentation",
        "Direct access to memory through Ethernet cables"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "DMA offloads high-speed bulk data transfers between peripheral devices (e.g. disk controllers, network cards) and RAM, freeing the CPU to execute instructions."
    },
    {
      id: "coa-q-07",
      question: "Which addressing mode specifies the operand value directly within the instruction word itself?",
      options: [
        "Direct Addressing Mode",
        "Indirect Addressing Mode",
        "Immediate Addressing Mode",
        "Register Indirect Addressing Mode"
      ],
      answer: 2,
      correctAnswer: "C",
      difficulty: "Easy",
      explanation: "In Immediate Addressing (e.g. MOV R1, #45), the operand value is part of the instruction itself, requiring no memory read cycle."
    },
    {
      id: "coa-q-08",
      question: "What distinguishes RISC (Reduced Instruction Set Computer) from CISC (Complex Instruction Set Computer)?",
      options: [
        "RISC emphasizes single-cycle execution of simple instructions and load/store memory access",
        "RISC machines do not have registers",
        "CISC processors cannot execute assembly language",
        "RISC instructions take variable length encoding from 1 to 15 bytes"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "RISC architectures use fixed-length instructions, single-cycle execution, pipelining, and load/store design where arithmetic operands must be in registers."
    },
    {
      id: "coa-q-09",
      question: "According to Amdahl's Law, what limits the speedup of a program when using multiple processors?",
      options: [
        "The clock speed of the memory bus",
        "The sequential (non-parallelizable) portion of the program",
        "The size of the hard drive",
        "The number of threads created in the operating system"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Hard",
      explanation: "Amdahl's law states that maximum speedup S <= 1 / (s + (1-s)/N), where s is the fraction of execution that is strictly serial. Even with infinite processors, speedup cannot exceed 1/s."
    },
    {
      id: "coa-q-10",
      question: "In IEEE 754 32-bit single-precision floating-point format, how many bits are allocated for sign, exponent, and mantissa (fraction)?",
      options: [
        "1 bit sign, 8 bits exponent, 23 bits fraction",
        "1 bit sign, 11 bits exponent, 20 bits fraction",
        "2 bits sign, 6 bits exponent, 24 bits fraction",
        "1 bit sign, 15 bits exponent, 16 bits fraction"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Medium",
      explanation: "IEEE 754 32-bit float uses: 1 sign bit (bit 31), 8 exponent bits with bias 127 (bits 30-23), and 23 normalized fraction bits (bits 22-0)."
    }
  ],

  "dsa": [
    {
      id: "dsa-q-01",
      question: "What is the worst-case time complexity of QuickSort when a naive first-element pivot selection is used on an already sorted array?",
      options: [
        "O(n log n)",
        "O(n)",
        "O(n²)",
        "O(log n)"
      ],
      answer: 2,
      correctAnswer: "C",
      difficulty: "Easy",
      explanation: "When picking the first element on a sorted array, partitions are unbalanced (1 element and n-1 elements), resulting in n levels of recursion and O(n²) total comparisons."
    },
    {
      id: "dsa-q-02",
      question: "Which data structure is fundamentally utilized to implement Breadth-First Search (BFS) traversal on graphs?",
      options: [
        "Stack",
        "Queue (FIFO)",
        "Priority Queue",
        "Disjoint Set (Union-Find)"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "BFS explores vertices level by level, requiring a FIFO Queue to enqueue neighbors and visit them in order of discovery."
    },
    {
      id: "dsa-q-03",
      question: "What algorithm is used to detect a cycle in a Singly Linked List in O(n) time and O(1) auxiliary space?",
      options: [
        "Dijkstra's Algorithm",
        "Floyd's Tortoise and Hare (Slow & Fast Pointers)",
        "Kruskal's Algorithm",
        "Kadane's Algorithm"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "Floyd's Cycle-Finding Algorithm uses two pointers moving at speeds 1 and 2. If a cycle exists, the fast pointer will eventually meet the slow pointer."
    },
    {
      id: "dsa-q-04",
      question: "What are the two key properties required for a problem to be solvable via Dynamic Programming?",
      options: [
        "Greedy choice property and divide-and-conquer",
        "Optimal substructure and overlapping subproblems",
        "Binary searchability and topological ordering",
        "Depth recursion and balanced partitions"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "Dynamic programming applies when subproblems overlap (so solutions can be memoized/table-stored) and an optimal solution to the problem contains optimal solutions to its subproblems."
    },
    {
      id: "dsa-q-05",
      question: "In a Min-Heap with N elements, what is the time complexity of extracting the minimum element (extractMin)?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "Accessing the root is O(1), but restoring the heap invariant by moving the last element to root and bubbling down (heapify-down) takes O(log N) time."
    },
    {
      id: "dsa-q-06",
      question: "Which shortest-path algorithm is capable of handling graphs with negative edge weights (and detects negative weight cycles)?",
      options: [
        "Dijkstra's Algorithm",
        "Bellman-Ford Algorithm",
        "Prim's Algorithm",
        "A* Search Algorithm"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Medium",
      explanation: "Bellman-Ford relaxes all |E| edges |V|-1 times, correctly handling negative edges and reporting negative cycles if a further relaxation reduces distance."
    },
    {
      id: "dsa-q-07",
      question: "What is the average time complexity of searching for a key in a Hash Table with a well-distributed hash function?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "Under uniform hashing, average chain length is constant (alpha = n/m), yielding O(1) expected time for search, insert, and delete."
    },
    {
      id: "dsa-q-08",
      question: "What is the height of a balanced Binary Search Tree (such as an AVL Tree) containing N elements?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      answer: 1,
      correctAnswer: "B",
      difficulty: "Easy",
      explanation: "Self-balancing binary search trees maintain balance factors such that the tree height remains bounded strictly by O(log N)."
    },
    {
      id: "dsa-q-09",
      question: "What is Kadane's Algorithm used for?",
      options: [
        "Finding the Maximum Subarray Sum in O(n) time",
        "Finding Strongly Connected Components in a directed graph",
        "Computing string edit distance (Levenshtein)",
        "Determining if a graph is bipartite"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Medium",
      explanation: "Kadane's algorithm scans the array in a single pass O(n), keeping track of the maximum sum ending at the current index and the global maximum sum."
    },
    {
      id: "dsa-q-10",
      question: "Which of the following sorting algorithms is guaranteed to be stable and has a worst-case time complexity of O(n log n)?",
      options: [
        "Merge Sort",
        "Heap Sort",
        "Quick Sort",
        "Selection Sort"
      ],
      answer: 0,
      correctAnswer: "A",
      difficulty: "Easy",
      explanation: "Merge Sort divides arrays into halves and merges sorted sub-arrays, maintaining relative order of equal elements (stable) with O(n log n) comparisons in all cases."
    }
  ]
};

async function main() {
  console.log("Authenticating as Super Admin...");
  await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", "Anupriya@123");
  console.log("Signed in successfully!");

  // 1. Provision / Update all Coding Subjects
  console.log("Upserting Coding Subjects...");
  for (const subj of SUBJECTS_DATA) {
    const docRef = doc(db, "subjects", subj.id);
    await setDoc(docRef, {
      ...subj,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`✓ Subject upserted: ${subj.name} (${subj.id})`);
  }

  // 2. Provision Question Sets and Questions for new CS subjects
  for (const [subjId, qList] of Object.entries(NEW_QUESTIONS)) {
    const subjMeta = SUBJECTS_DATA.find((s) => s.id === subjId);
    const setId = `${subjId}-set-1`;
    console.log(`\nProvisioning Set: ${setId} for ${subjMeta.name}...`);

    const questionIds = [];
    const batch = writeBatch(db);

    for (const q of qList) {
      const qDocRef = doc(db, "questions", q.id);
      const questionPayload = {
        question: q.question,
        questionText: q.question,
        questionType: "single_choice",
        options: q.options.map((opt, i) => ({
          id: String.fromCharCode(65 + i),
          text: opt
        })),
        answer: q.answer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        marks: 4,
        positiveMarks: 4,
        negativeMarks: 1,
        unansweredMarks: 0,
        subject: subjMeta.name,
        subjectId: subjId,
        setId: setId,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      batch.set(qDocRef, questionPayload, { merge: true });
      questionIds.push(q.id);
    }

    await batch.commit();
    console.log(`✓ ${qList.length} questions written for ${subjMeta.name}`);

    // Create / Update QuestionSet Document
    const setRef = doc(db, "questionSets", setId);
    const setPayload = {
      id: setId,
      title: `${subjMeta.name} — Set 1`,
      name: `${subjMeta.name} — Set 1`,
      setNumber: 1,
      subject: subjMeta.name,
      subjectId: subjId,
      description: `Comprehensive core assessment covering ${subjMeta.name} fundamental principles, definitions, and problem-solving patterns.`,
      instructions: "1. Total duration: 30 minutes.\n2. +4 marks for correct choice, -1 for incorrect answer.\n3. Automatic submission on timer expiration.",
      questionIds: questionIds,
      questionCount: questionIds.length,
      totalQuestions: questionIds.length,
      totalMarks: questionIds.length * 4,
      duration: "30",
      durationMinutes: 30,
      difficulty: "Medium",
      publicationStatus: "published",
      status: "published",
      markingScheme: {
        positiveMarks: 4,
        negativeMarks: 1,
        unansweredMarks: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(setRef, setPayload, { merge: true });
    console.log(`✓ Question Set created: ${setId}`);

    // Create / Update Published Test Document in 'tests' collection
    const testRef = doc(db, "tests", setId);
    const testPayload = {
      id: setId,
      title: `${subjMeta.name} Core Certification Exam`,
      subject: subjMeta.name,
      subjectId: subjId,
      description: `Standardized university and interview practice exam covering ${subjMeta.name} core topics.`,
      durationMinutes: 30,
      totalMarks: questionIds.length * 4,
      maximumMarks: questionIds.length * 4,
      questionCount: questionIds.length,
      questionIds: questionIds,
      difficulty: "Medium",
      publicationStatus: "published",
      markingScheme: {
        positiveMarks: 4,
        negativeMarks: 1,
        unansweredMarks: 0
      },
      navigationSettings: {
        allowRevisit: true,
        reviewAllowed: true
      },
      resultSettings: {
        showResultImmediately: true,
        showLeaderboard: true,
        showExplanations: true
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(testRef, testPayload, { merge: true });
    console.log(`✓ Published Test created: ${testPayload.title}`);

    // Update subject questionCount and setCount
    const subjDocRef = doc(db, "subjects", subjId);
    await setDoc(subjDocRef, {
      questionCount: questionIds.length,
      setCount: 1
    }, { merge: true });
  }

  // Update HTML, CSS, JS subject question counts
  const allQuestionsSnap = await getDocs(collection(db, "questions"));
  const countsBySubject = {};
  allQuestionsSnap.docs.forEach((d) => {
    const s = d.data().subjectId || (d.data().subject ? d.data().subject.toLowerCase() : "");
    countsBySubject[s] = (countsBySubject[s] || 0) + 1;
  });

  for (const [sId, count] of Object.entries(countsBySubject)) {
    if (["html", "css", "javascript"].includes(sId)) {
      await setDoc(doc(db, "subjects", sId), { questionCount: count, setCount: 5 }, { merge: true });
    }
  }

  console.log("\n==========================================");
  console.log("ALL CODING SUBJECTS & QUESTIONS PROVISIONED SUCCESSFULLY!");
  console.log("==========================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("Provisioning failed:", err);
  process.exit(1);
});
