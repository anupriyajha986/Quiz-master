const fs = require('fs');

const raw = fs.readFileSync('scripts/extracted-question-bank-prompt.txt', 'utf8');

// The file has something like:
// const questionBank = { "HTML": { "1": [ ... ], "2": [ ... ] }, "CSS": ... }
// Let's extract the JSON-like object or parse by regex/evaluation

let jsonStr = raw.trim();
// Find start of questionBank object
const startIdx = jsonStr.indexOf('{');
if (startIdx !== -1) {
  jsonStr = jsonStr.substring(startIdx);
}

// Check how many questions can be parsed with regex
const questionBlocks = [];
const qRegex = /\{\s*"id":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"set":\s*(\d+),\s*"difficulty":\s*"([^"]+)",\s*"question":\s*"([^"]+)",\s*"options":\s*\[([^\]]+)\],\s*"answer":\s*(\d+),\s*"explanation":\s*"([^"]+)"\s*\}/gs;

let match;
let count = 0;
const subjects = {};

while ((match = qRegex.exec(raw)) !== null) {
  count++;
  const [full, id, category, setNum, difficulty, question, optionsRaw, answerStr, explanation] = match;
  
  // parse options
  const options = optionsRaw
    .split(',')
    .map(opt => opt.trim().replace(/^"/, '').replace(/"$/, '').replace(/\\"/g, '"'))
    .filter(Boolean);

  const answerIdx = parseInt(answerStr, 10);

  if (!subjects[category]) {
    subjects[category] = {};
  }
  if (!subjects[category][setNum]) {
    subjects[category][setNum] = [];
  }

  subjects[category][setNum].push({
    id,
    category,
    set: parseInt(setNum, 10),
    difficulty,
    question,
    options,
    answer: answerIdx,
    explanation
  });
}

console.log('Regex extracted total valid questions:', count);
for (const [subj, sets] of Object.entries(subjects)) {
  console.log(`\nSubject: ${subj}`);
  for (const [setNum, qList] of Object.entries(sets)) {
    console.log(`  Set ${setNum}: ${qList.length} questions`);
    // Check option counts and answer indices
    for (const q of qList) {
      if (q.options.length < 2) {
        console.warn(`    ! Warning: ${q.id} has only ${q.options.length} options`);
      }
      if (q.answer < 0 || q.answer >= q.options.length) {
        console.warn(`    ! Warning: ${q.id} has invalid answer index ${q.answer} (options: ${q.options.length})`);
      }
    }
  }
}
