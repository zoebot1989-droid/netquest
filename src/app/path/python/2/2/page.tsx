'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "For Loops",
    content: "for loops repeat code for each item in a sequence:\n\nfor fruit in [\"apple\", \"banana\", \"cherry\"]:\n    print(fruit)\n\nOutput:\napple\nbanana\ncherry\n\nThe variable (fruit) takes on each value, one at a time.",
  },
  {
    title: "range() — Counting",
    content: "range() generates a sequence of numbers:\n\nrange(5)        →  0, 1, 2, 3, 4\nrange(2, 8)     →  2, 3, 4, 5, 6, 7\nrange(0, 10, 2) →  0, 2, 4, 6, 8\n\nUse with for loops:\nfor i in range(5):\n    print(i)       # prints 0 through 4\n\nfor i in range(1, 11):\n    print(i)       # prints 1 through 10",
  },
  {
    title: "Looping Over Strings",
    content: "Strings are sequences too! You can loop over each character:\n\nfor char in \"Python\":\n    print(char)\n\nP\ny\nt\nh\no\nn\n\nYou can also use range(len(string)) to get indexes:\n\nword = \"Hello\"\nfor i in range(len(word)):\n    print(f\"Index {i}: {word[i]}\")",
  },
];

const quizQuestions = [
  { q: "What does range(3) generate?", options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3, 2, 1'], correct: 1 },
  { q: "How many times does `for i in range(5)` loop?", options: ['4 times', '5 times', '6 times', 'Infinite'], correct: 1 },
  { q: "What does `for c in \"Hi\"` iterate over?", options: ['The word \"Hi\"', 'Each character: \"H\", \"i\"', 'Nothing', 'H and i as numbers'], correct: 1 },
];

export default function ForLoops() {
  const [step, setStep] = useState(0);
  const [loopUsed, setLoopUsed] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('for ') && cmd.includes('range')) setLoopUsed(true);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-2-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Looping like a pro! 🔄" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Loops — For" pathId="python" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Print a Pattern</h2>
              <p className="text-sm text-gray-400">Use a for loop to print numbers!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">for i in range(5): print(i)</code></p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {loopUsed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Great looping!</p>
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
