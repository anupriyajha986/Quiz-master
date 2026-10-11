function calculateScore({ questions, responses, markingScheme, answerKey }) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalScore = 0;
  let totalMaxMarks = 0;

  for (const q of questions) {
    const qid = q.id;
    const selectedAnswer = responses[qid]?.selectedAnswer;
    const correctAnswer = answerKey[qid]?.correctAnswer;

    const pos = Number(q.positiveMarks) || Number(markingScheme.positiveMarks) || 4;
    const neg = Number(q.negativeMarks) || Number(markingScheme.negativeMarks) || 1;
    const unans = Number(q.unansweredMarks) || Number(markingScheme.unansweredMarks) || 0;

    totalMaxMarks += pos;

    if (selectedAnswer === undefined || selectedAnswer === null || selectedAnswer === "") {
      unansweredCount++;
      totalScore += unans;
    } else if (String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
      correctCount++;
      totalScore += pos;
    } else {
      incorrectCount++;
      totalScore -= neg;
    }
  }

  const percentage = totalMaxMarks > 0 ? Number(((totalScore / totalMaxMarks) * 100).toFixed(2)) : 0;
  const attempted = correctCount + incorrectCount;
  const accuracy = attempted > 0 ? Number(((correctCount / attempted) * 100).toFixed(2)) : 0;

  return { totalScore, totalMaxMarks, percentage, accuracy, correctCount, incorrectCount, unansweredCount };
}

console.log("=== Testing Evaluation Formula Against Master Prompt Example ===");

// 30 questions: 20 correct, 5 incorrect, 5 unanswered with +4 / -1 / 0 scheme
const questions = [];
const responses = {};
const answerKey = {};

for (let i = 1; i <= 30; i++) {
  const id = `q_${i}`;
  questions.push({ id, positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 });
  answerKey[id] = { correctAnswer: "A" };

  if (i <= 20) {
    responses[id] = { selectedAnswer: "A" }; // Correct
  } else if (i <= 25) {
    responses[id] = { selectedAnswer: "B" }; // Incorrect
  } else {
    responses[id] = { selectedAnswer: null }; // Unanswered
  }
}

const result = calculateScore({
  questions,
  responses,
  markingScheme: { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
  answerKey
});

console.log("Result:", result);

if (
  result.totalScore === 75 &&
  result.totalMaxMarks === 120 &&
  result.percentage === 62.5 &&
  result.correctCount === 20 &&
  result.incorrectCount === 5 &&
  result.unansweredCount === 5
) {
  console.log("✓ SUCCESS: Evaluation calculation exactly matches JEE formula in prompt Section 9!");
} else {
  console.error("FAIL: Mismatch in calculation:", result);
  process.exit(1);
}
