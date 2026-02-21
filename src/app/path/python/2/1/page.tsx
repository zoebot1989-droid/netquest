'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "If Statements",
    content: "if statements let your code make decisions:\n\nage = 18\nif age >= 18:\n    print(\"You can vote!\")\n\nThe code inside only runs if the condition is True.\n\nComparison operators:\n==  equal to          !=  not equal\n>   greater than      <   less than\n>=  greater or equal   <=  less or equal",
  },
  {
    title: "Elif and Else",
    content: "elif (else if) adds more conditions. else is the fallback:\n\nscore = 85\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")\n\nPython checks each condition top to bottom and runs the FIRST one that's True.",
  },
  {
    title: "Boolean Operators",
    content: "Combine conditions with and, or, not:\n\nage = 15\nhas_id = True\n\nif age >= 13 and has_id:\n    print(\"Welcome!\")  # Both must be True\n\nif age < 13 or not has_id:\n    print(\"Sorry!\")     # Either can be True\n\nnot flips True ↔ False:\nnot True   →  False\nnot False  →  True",
  },
];

const quizQuestions = [
  { q: "What does elif mean?", options: ['Else if — another condition to check', 'A type of loop', 'End of the if block', 'A Python error'], correct: 0 },
  { q: "When does the else block run?", options: ['Always', 'When the if condition is True', 'When ALL previous conditions are False', 'Never'], correct: 2 },
  { q: "What does `not True` evaluate to?", options: ['True', 'False', 'None', 'Error'], correct: 1 },
];

export default function IfElifElse() {
  const [step, setStep] = useState(0);
  const [solvedPuzzle, setSolvedPuzzle] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string, output: string) => {
    if (cmd.includes('if ') && (output.includes('True') || output.length > 0)) {
      setSolvedPuzzle(true);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-2-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="Logic master! 🧠" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="If / Elif / Else" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Practice! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Logic Puzzle</h2>
              <p className="text-sm text-gray-400">Create a variable <code className="text-[#39ff14]">score</code> and use an if statement to check if it passes!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">score = 85</code> then <code className="text-[#39ff14]">if score &gt;= 70: print(&quot;Pass!&quot;)</code></p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {solvedPuzzle && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ You used conditional logic!</p>
                </div>
                <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
              </motion.div>
            )}
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
