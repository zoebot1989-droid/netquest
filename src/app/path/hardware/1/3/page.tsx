'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What Does RAM Do?",
    content: "RAM (Random Access Memory) is your computer's short-term memory. When you open a program, it loads from your SSD/HDD into RAM because RAM is WAY faster.\n\n• SSD read speed: ~500-7,000 MB/s\n• RAM speed: ~40,000-60,000 MB/s\n\nRAM is volatile — it loses all data when powered off. That's why you save files to your SSD.\n\nMore RAM = more programs open at once without slowing down.",
  },
  {
    title: "DDR4 vs DDR5",
    content: "DDR = Double Data Rate. The number is the generation.\n\n📊 DDR4 (2017-present)\n• Speed: 2133-3600 MHz typical\n• Capacity: Up to 32 GB per stick\n• Price: Cheaper, very mature\n• Still great for most builds\n\n📊 DDR5 (2021-present)\n• Speed: 4800-8000+ MHz\n• Capacity: Up to 64 GB per stick\n• Price: More expensive\n• Better for new builds\n\n⚠️ DDR4 and DDR5 are NOT interchangeable! Different physical slots.",
  },
  {
    title: "How Much RAM Do You Need?",
    content: "Common configurations:\n\n• 8 GB — Minimum for modern use. Browsing, light work.\n• 16 GB — Sweet spot. Gaming, coding, most tasks.\n• 32 GB — Video editing, heavy multitasking, development.\n• 64 GB+ — Servers, 3D rendering, huge datasets.\n\n💡 Dual Channel: Two sticks > one stick!\n2x8 GB is FASTER than 1x16 GB because data flows through two channels simultaneously.\n\nAlways install RAM in pairs for dual-channel mode.",
  },
];

const ramScenarios = [
  { scenario: 'Budget gaming PC — plays Fortnite and Minecraft', options: [
    { name: '1x8 GB DDR4-2666', price: '$20', correct: false, reason: 'Single channel is slower' },
    { name: '2x8 GB DDR4-3200', price: '$40', correct: true, reason: 'Dual channel, good speed, 16 GB is the gaming sweet spot' },
    { name: '2x32 GB DDR5-6000', price: '$180', correct: false, reason: 'Overkill and too expensive for budget' },
  ]},
  { scenario: 'Video editing workstation — 4K projects in Premiere Pro', options: [
    { name: '2x8 GB DDR5-4800', price: '$50', correct: false, reason: '16 GB is too little for 4K video' },
    { name: '2x16 GB DDR5-5600', price: '$90', correct: true, reason: '32 GB dual channel — perfect for video editing' },
    { name: '1x16 GB DDR4-3200', price: '$35', correct: false, reason: 'Single channel and too little RAM' },
  ]},
  { scenario: 'Home server running multiple VMs', options: [
    { name: '2x8 GB DDR4-3200', price: '$40', correct: false, reason: '16 GB fills up fast with VMs' },
    { name: '4x16 GB DDR5-4800 ECC', price: '$300', correct: true, reason: '64 GB with error correction — ideal for servers' },
    { name: '2x16 GB DDR4-2666', price: '$55', correct: false, reason: '32 GB might work but no ECC for server reliability' },
  ]},
];

const quizQuestions = [
  { q: "Why is RAM faster than an SSD?", options: ['RAM has more storage', 'RAM has no moving parts', 'RAM uses electrical signals with no seek time', 'RAM is newer technology'], correct: 2 },
  { q: "What does 'dual channel' mean?", options: ['Two RAM sticks running in parallel for double bandwidth', 'RAM that works with both DDR4 and DDR5', 'RAM with two speed modes', 'RAM that can store data twice'], correct: 0 },
  { q: "Can you put DDR5 RAM in a DDR4 slot?", options: ['Yes, it\'s backward compatible', 'Yes, but it runs slower', 'No, they have different physical connectors', 'Only with an adapter'], correct: 2 },
];

export default function MemoryRAM() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);
  const [scenarioDone, setScenarioDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (idx: number) => {
    setSelected(idx);
    if (ramScenarios[scenarioIdx].options[idx].correct) setScenarioScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (scenarioIdx + 1 >= ramScenarios.length) setScenarioDone(true);
      else setScenarioIdx(scenarioIdx + 1);
    }, 1000);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-1-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You understand RAM like a pro! ⚡" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Memory (RAM)" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'RAM Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !scenarioDone && (
          <motion.div key="scenario" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Choose the Right RAM</h2>
              <p className="text-sm text-gray-400 mb-3">{scenarioIdx + 1}/{ramScenarios.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm font-semibold">{ramScenarios[scenarioIdx].scenario}</p></div>
              <div className="space-y-2">
                {ramScenarios[scenarioIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleScenario(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selected === i ? (opt.correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && opt.correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="flex justify-between"><span className="font-semibold">{opt.name}</span><span style={{ color: '#00f0ff' }}>{opt.price}</span></div>
                    {selected !== null && <p className="text-xs mt-1 text-gray-400">{opt.reason}</p>}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && scenarioDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">RAM Challenge: {scenarioScore}/{ramScenarios.length} correct!</h3>
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
