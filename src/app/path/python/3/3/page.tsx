'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Tuples — Immutable Lists",
    content: "Tuples are like lists, but they CAN'T be changed after creation:\n\ncoords = (10, 20)\nrgb = (255, 128, 0)\npoint = (3.5, 7.2)\n\ncoords[0]     →  10\nlen(coords)   →  2\ncoords[0] = 5  →  ERROR! Can't modify\n\nWhen to use tuples:\n• Data that shouldn't change (coordinates, RGB colors)\n• Dictionary keys (lists can't be keys, tuples can)\n• Returning multiple values from functions\n• Slightly faster than lists",
  },
  {
    title: "Sets — Unique Collections",
    content: "Sets store unique items with no duplicates and no order:\n\ncolors = {\"red\", \"blue\", \"green\"}\nnums = {1, 2, 3, 2, 1}  →  {1, 2, 3}\n\nSets auto-remove duplicates!\n\nUseful methods:\ncolors.add(\"yellow\")    # add item\ncolors.remove(\"red\")    # remove item\nlen(colors)             # count unique items\n\"blue\" in colors        # check membership (very fast!)",
  },
  {
    title: "Set Operations",
    content: "Sets support mathematical operations:\n\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\na | b   →  {1, 2, 3, 4, 5, 6}  (union — all items)\na & b   →  {3, 4}              (intersection — shared)\na - b   →  {1, 2}              (difference — in a not b)\na ^ b   →  {1, 2, 5, 6}        (symmetric difference)\n\nReal use: finding common friends, removing duplicates from a list, checking overlaps.",
  },
];

const quizQuestions = [
  { q: "What's the main difference between a tuple and a list?", options: ['Tuples are faster', 'Tuples can\'t be modified', 'Tuples can only hold numbers', 'There is no difference'], correct: 1 },
  { q: "What does {1, 2, 2, 3, 3} become as a set?", options: ['{1, 2, 2, 3, 3}', '{1, 2, 3}', '[1, 2, 3]', 'An error'], correct: 1 },
  { q: "What does {1,2,3} & {2,3,4} return?", options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', '{1}'], correct: 1 },
];

export default function TuplesSets() {
  const [step, setStep] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('(') || cmd.includes('{') || cmd.includes('set')) {
      setInteractions(prev => prev + 1);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-3-3', 60);
        addAchievement('data-wrangler');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Data Wrangler unlocked! 📊" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Tuples & Sets" pathId="python" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Tuples vs Sets</h2>
              <p className="text-sm text-gray-400">Create tuples and sets and compare them!</p>
              <p className="text-xs text-gray-500 mt-1">Try creating a set with duplicates: <code className="text-[#39ff14]">set([1,2,2,3,3,3])</code></p>
              <p className="text-xs text-gray-500">Progress: {Math.min(interactions, 3)}/3</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {interactions >= 3 && (
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
