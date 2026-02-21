'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Creating Lists",
    content: "Lists store multiple items in order:\n\nfruits = [\"apple\", \"banana\", \"cherry\"]\nnumbers = [1, 2, 3, 4, 5]\nmixed = [\"hello\", 42, True, 3.14]\nempty = []\n\nAccess items by index (starts at 0!):\nfruits[0]   →  \"apple\"\nfruits[1]   →  \"banana\"\nfruits[-1]  →  \"cherry\"  (last item!)\n\nlen(fruits)  →  3",
  },
  {
    title: "Slicing Lists",
    content: "Get a portion of a list with slicing:\n\nnums = [10, 20, 30, 40, 50]\n\nnums[1:3]   →  [20, 30]      (index 1 to 2)\nnums[:3]    →  [10, 20, 30]  (start to 2)\nnums[2:]    →  [30, 40, 50]  (index 2 to end)\nnums[-2:]   →  [40, 50]      (last 2)\n\nSlicing creates a NEW list — the original is unchanged.",
  },
  {
    title: "Modifying Lists",
    content: "Lists are mutable — you can change them:\n\nfruits = [\"apple\", \"banana\"]\n\nfruits.append(\"cherry\")    # add to end\nfruits.insert(0, \"mango\")  # add at position\nfruits.remove(\"banana\")    # remove by value\nfruits.pop()               # remove last\nfruits.pop(0)              # remove at index\nfruits.sort()              # sort alphabetically\nfruits.reverse()           # reverse order\nlen(fruits)                # count items\n\nYou can also change items directly:\nfruits[0] = \"kiwi\"",
  },
];

const quizQuestions = [
  { q: "What index is the FIRST item in a list?", options: ['1', '0', '-1', 'first'], correct: 1 },
  { q: "What does .append() do?", options: ['Adds to the beginning', 'Adds to the end', 'Removes the last item', 'Sorts the list'], correct: 1 },
  { q: "What does nums[-1] return?", options: ['The first item', 'An error', 'The last item', 'Nothing'], correct: 2 },
];

export default function Lists() {
  const [step, setStep] = useState(0);
  const [listOps, setListOps] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('[') || cmd.includes('.append') || cmd.includes('.pop') || cmd.includes('.sort') || cmd.includes('.remove')) {
      setListOps(prev => prev + 1);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-3-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="List warrior! 📋" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Lists" pathId="python" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: List Manipulation</h2>
              <p className="text-sm text-gray-400">Create a list and manipulate it!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">nums = [3, 1, 4, 1, 5]</code> then <code className="text-[#39ff14]">nums.sort()</code> then <code className="text-[#39ff14]">nums</code></p>
              <p className="text-xs text-gray-500">Progress: {Math.min(listOps, 3)}/3 list operations</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {listOps >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
