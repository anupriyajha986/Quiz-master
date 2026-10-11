const fs = require('fs');

let txt = fs.readFileSync('scripts/extracted-question-bank-prompt.txt', 'utf8');

// Find the start of `const questionBank =`
const startIdx = txt.indexOf('const questionBank =');
if (startIdx === -1) {
  console.error("Could not find start of questionBank");
  process.exit(1);
}

// Slice from start
let jsCode = txt.substring(startIdx);

// Find the cutoff point before `"id": "js-s5-q10"`
const cutoff = jsCode.lastIndexOf('{\r\n            "id": "js-s5-q10"');
const cutoffAlt = jsCode.lastIndexOf('{\n            "id": "js-s5-q10"');
const cutIdx = cutoff !== -1 ? cutoff : cutoffAlt;

if (cutIdx !== -1) {
  // Trim up to cutIdx, then trim trailing comma, and close the brackets:
  // ] (close array for set "5")
  // } (close object for "JavaScript")
  // } (close questionBank)
  let cleanJs = jsCode.substring(0, cutIdx).trim();
  if (cleanJs.endsWith(',')) {
    cleanJs = cleanJs.substring(0, cleanJs.length - 1);
  }
  cleanJs += '\n    ]\n  }\n};\nmodule.exports = questionBank;\n';

  fs.writeFileSync('scripts/master-question-bank.cjs', cleanJs, 'utf8');
  console.log('Saved sanitized master-question-bank.cjs');

  try {
    const qb = require('./master-question-bank.cjs');
    console.log('Successfully loaded questionBank module!');
    let totalQ = 0;
    for (const [subj, sets] of Object.entries(qb)) {
      console.log(`\nSubject: ${subj}`);
      for (const [setNum, qList] of Object.entries(sets)) {
        console.log(`  Set ${setNum}: ${qList.length} questions`);
        totalQ += qList.length;
      }
    }
    console.log(`\nTotal Valid Questions across all subjects: ${totalQ}`);
  } catch (err) {
    console.error('Failed to require master-question-bank.cjs:', err);
  }
} else {
  console.error('Could not find cutoff for js-s5-q10');
}
