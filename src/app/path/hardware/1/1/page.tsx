'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What's Inside a Computer?",
    content: "Every computer — from a $200 laptop to a $10,000 server — has the same core components:\n\n• CPU (Central Processing Unit) — The \"brain.\" Executes instructions.\n• RAM (Random Access Memory) — Short-term memory. Fast but temporary.\n• Storage (SSD/HDD) — Long-term memory. Keeps your files when powered off.\n• Motherboard — The backbone. Connects everything together.\n• PSU (Power Supply Unit) — Converts wall power to what components need.\n• GPU (Graphics Processing Unit) — Handles visuals (and AI/mining).",
  },
  {
    title: "The Fetch-Decode-Execute Cycle",
    content: "The CPU runs a never-ending loop:\n\n1️⃣ FETCH — Get the next instruction from RAM\n2️⃣ DECODE — Figure out what the instruction means\n3️⃣ EXECUTE — Do the thing (add numbers, move data, etc.)\n\nThis happens BILLIONS of times per second. A 4 GHz CPU does this cycle 4,000,000,000 times per second.\n\nEvery program you run — games, browsers, apps — is just a series of these tiny instructions being fetched, decoded, and executed.",
  },
  {
    title: "Binary — How Computers Think",
    content: "Computers only understand two things: 0 and 1. That's it.\n\n• 1 bit = one 0 or 1\n• 8 bits = 1 byte (enough for one character like 'A')\n• 1 KB = 1,024 bytes\n• 1 MB = 1,024 KB (a photo)\n• 1 GB = 1,024 MB (a movie)\n• 1 TB = 1,024 GB (a hard drive)\n\nExamples:\n• The letter 'A' = 01000001\n• The number 42 = 00101010\n• The color white = 11111111 11111111 11111111",
  },
];

const componentLabels = [
  { name: 'CPU', emoji: '🧠', desc: 'Processes instructions — the brain', correct: 'cpu' },
  { name: 'RAM', emoji: '⚡', desc: 'Fast temporary memory — loses data on power off', correct: 'ram' },
  { name: 'SSD', emoji: '💾', desc: 'Permanent storage — keeps files when off', correct: 'storage' },
  { name: 'Motherboard', emoji: '🔲', desc: 'Connects all components together', correct: 'mobo' },
  { name: 'PSU', emoji: '🔌', desc: 'Converts AC power for components', correct: 'psu' },
  { name: 'GPU', emoji: '🎮', desc: 'Renders graphics and visual output', correct: 'gpu' },
];

const matchItems = [
  { desc: 'Executes billions of instructions per second', answer: 'cpu' },
  { desc: 'Stores your files permanently, even when powered off', answer: 'storage' },
  { desc: 'Temporary workspace that clears when you shut down', answer: 'ram' },
  { desc: 'The circuit board everything plugs into', answer: 'mobo' },
  { desc: 'Converts wall electricity to usable power', answer: 'psu' },
  { desc: 'Renders 3D graphics for games and videos', answer: 'gpu' },
];

const quizQuestions = [
  { q: "What does CPU stand for?", options: ['Central Processing Unit', 'Computer Power Utility', 'Core Performance Unit', 'Central Program Utility'], correct: 0 },
  { q: "What happens to RAM when you turn off your computer?", options: ['Nothing, it stays', 'It saves to the hard drive', 'All data is lost', 'It gets compressed'], correct: 2 },
  { q: "How many times per second does a 4 GHz CPU cycle?", options: ['4 million', '4 billion', '400 million', '40 billion'], correct: 1 },
];

export default function HowComputersWork() {
  const [step, setStep] = useState(0);
  const [matchStep, setMatchStep] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleMatch = (answer: string) => {
    setSelected(answer);
    const correct = answer === matchItems[matchStep].answer;
    if (correct) setMatchScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (matchStep + 1 >= matchItems.length) {
        setMatchDone(true);
      } else {
        setMatchStep(matchStep + 1);
      }
    }, 600);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-1-1', 50);
        addAchievement('pc-builder');
        addAchievement('first-mission');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You know what's inside a computer! 🖥️" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="How Computers Work" pathId="hardware" />
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
            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-3">🖥️ The 6 Core Components:</p>
                <div className="grid grid-cols-2 gap-2">
                  {componentLabels.map(c => (
                    <div key={c.name} className="bg-gray-800/50 rounded-lg p-2 text-center">
                      <div className="text-2xl mb-1">{c.emoji}</div>
                      <div className="text-xs font-semibold" style={{ color: '#00f0ff' }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Interactive Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !matchDone && (
          <motion.div key="match" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Match the Component</h2>
              <p className="text-sm text-gray-400 mb-4">Which component matches this description?</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-center">
                <p className="text-sm">{matchItems[matchStep].desc}</p>
                <p className="text-xs text-gray-500 mt-1">{matchStep + 1}/{matchItems.length}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {componentLabels.map(c => (
                  <button key={c.correct} onClick={() => handleMatch(c.correct)}
                    className={`p-2 rounded-lg text-sm font-semibold transition-colors ${selected === c.correct ? (c.correct === matchItems[matchStep].answer ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'}`}>
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && matchDone && (
          <motion.div key="match-result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {matchScore}/{matchItems.length} correct!</h3>
              <p className="text-sm text-gray-400">{matchScore >= 5 ? 'Excellent! You know your components!' : 'Keep learning — you\'ll get there!'}</p>
            </div>
            <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
