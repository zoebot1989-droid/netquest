'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "While Loops",
    content: "while loops keep running as long as a condition is True:\n\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\nOutput: 0, 1, 2, 3, 4\n\n⚠️ DANGER: If the condition NEVER becomes False, you get an infinite loop!\n\n# This runs FOREVER — don't do this!\nwhile True:\n    print(\"help!\")",
  },
  {
    title: "break and continue",
    content: "break — immediately exits the loop:\n\nfor i in range(10):\n    if i == 5:\n        break      # stops at 5\n    print(i)       # prints 0-4\n\ncontinue — skips to the next iteration:\n\nfor i in range(5):\n    if i == 2:\n        continue   # skips 2\n    print(i)       # prints 0, 1, 3, 4\n\nThese work in both for and while loops!",
  },
  {
    title: "Practical While Loops",
    content: "while is great when you don't know how many times to loop:\n\n# Guessing game\nsecret = 7\nguess = 0\nwhile guess != secret:\n    guess = int(input(\"Guess: \"))\nprint(\"You got it!\")\n\n# Counting down\nn = 10\nwhile n > 0:\n    print(n)\n    n -= 1\nprint(\"Liftoff! 🚀\")\n\nRule of thumb:\n• Know how many times? → for\n• Don't know? → while",
  },
];

const quizQuestions = [
  { q: "When does a while loop stop?", options: ['After 10 iterations', 'When the condition becomes False', 'When it runs out of memory', 'After the function returns'], correct: 1 },
  { q: "What does `break` do in a loop?", options: ['Pauses the loop', 'Skips to the next iteration', 'Immediately exits the loop', 'Throws an error'], correct: 2 },
  { q: "What does `continue` do?", options: ['Stops the loop', 'Skips the rest of this iteration and goes to next', 'Continues after the loop', 'Does nothing'], correct: 1 },
];

export default function WhileLoops() {
  const [step, setStep] = useState(0);
  const [whileUsed, setWhileUsed] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('while ')) setWhileUsed(true);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-2-3', 60);
        addAchievement('loop-master');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Loop master unlocked! 🔄" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Loops — While" pathId="python" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Countdown</h2>
              <p className="text-sm text-gray-400">Write a while loop that counts down!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">n = 5</code> then <code className="text-[#39ff14]">while n &gt; 0: print(n)</code></p>
              <p className="text-xs text-gray-500">(Don&apos;t forget to decrease n or it loops forever!)</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {whileUsed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ While loops mastered!</p>
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
