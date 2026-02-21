'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Errors Happen!",
    content: "When Python hits an error, it crashes with a traceback:\n\nprint(10 / 0)\n→ ZeroDivisionError: division by zero\n\nint(\"hello\")\n→ ValueError: invalid literal for int()\n\nCommon errors:\n• ValueError — wrong type of value\n• TypeError — wrong type for an operation\n• NameError — variable doesn't exist\n• KeyError — dict key doesn't exist\n• IndexError — list index out of range\n• FileNotFoundError — file doesn't exist",
  },
  {
    title: "try / except",
    content: "Catch errors instead of crashing:\n\ntry:\n    num = int(input(\"Enter a number: \"))\n    print(f\"Double: {num * 2}\")\nexcept ValueError:\n    print(\"That's not a number!\")\n\nYou can catch specific errors:\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Can't divide by zero!\")\nexcept TypeError:\n    print(\"Wrong type!\")\nexcept Exception as e:\n    print(f\"Something went wrong: {e}\")",
  },
  {
    title: "finally & raise",
    content: "finally always runs, error or not:\n\ntry:\n    f = open(\"data.txt\")\n    data = f.read()\nexcept FileNotFoundError:\n    print(\"File not found!\")\nfinally:\n    print(\"Cleanup done\")  # always runs\n\nraise creates your own errors:\n\ndef set_age(age):\n    if age < 0:\n        raise ValueError(\"Age can't be negative!\")\n    return age\n\nThis is how you make your code robust and professional!",
  },
];

const buggyCode = [
  { code: 'int("hello")', fix: 'Wrap in try/except ValueError', hint: 'This crashes — how would you catch it?' },
  { code: 'nums = [1,2,3]\nnums[10]', fix: 'Check length or use try/except IndexError', hint: 'Index 10 doesn\'t exist in a 3-item list' },
  { code: 'x = 10 / 0', fix: 'Check for zero before dividing', hint: 'You can\'t divide by zero!' },
];

const quizQuestions = [
  { q: "What does try/except do?", options: ['Tries to run code, catches errors if they happen', 'Runs code twice', 'Skips the code entirely', 'Only runs in debug mode'], correct: 0 },
  { q: "When does the `finally` block run?", options: ['Only when there\'s an error', 'Only when there\'s no error', 'Always, regardless of errors', 'Never'], correct: 2 },
  { q: "What does `raise ValueError(\"bad\")` do?", options: ['Catches a ValueError', 'Creates and throws a ValueError', 'Prints \"bad\"', 'Prevents errors'], correct: 1 },
];

export default function ErrorHandling() {
  const [step, setStep] = useState(0);
  const [bugStep, setBugStep] = useState(0);
  const [bugsDone, setBugsDone] = useState(false);
  const [tryCatchUsed, setTryCatchUsed] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('try') || cmd.includes('except')) {
      setTryCatchUsed(true);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-4-3', 70);
        addAchievement('bug-squasher');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="Bug squasher! 🐛" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Error Handling" pathId="python" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Fix Some Bugs! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !bugsDone && (
          <motion.div key="bugs" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🐛 Bug #{bugStep + 1}: What&apos;s wrong?</h2>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-red-300 mb-2">{buggyCode[bugStep].code}</div>
              <p className="text-xs text-gray-400">{buggyCode[bugStep].hint}</p>
              <p className="text-xs text-gray-500 mt-1">✅ Fix: {buggyCode[bugStep].fix}</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="180px" />
            <button onClick={() => {
              if (bugStep + 1 >= buggyCode.length) {
                setBugsDone(true);
                setStep(4);
              } else {
                setBugStep(bugStep + 1);
              }
            }} className="btn-primary w-full">
              {bugStep + 1 >= buggyCode.length ? 'Take the Quiz →' : 'Next Bug →'}
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
