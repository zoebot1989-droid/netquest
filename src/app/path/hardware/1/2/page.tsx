'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "CPU — The Brain",
    content: "The CPU (Central Processing Unit) is the single most important component. It executes every instruction your computer runs.\n\nKey specs:\n• Cores — Independent processors. More cores = more tasks at once\n• Threads — Virtual cores (hyperthreading). A 6-core/12-thread CPU can handle 12 tasks simultaneously\n• Clock Speed — Measured in GHz. Higher = faster per core\n• Cache — Ultra-fast memory ON the CPU chip (L1 > L2 > L3)",
  },
  {
    title: "Cache Levels",
    content: "CPUs have 3 levels of built-in memory, each slower but larger:\n\n⚡ L1 Cache — Fastest. ~1 nanosecond. 32-64 KB per core.\n⚡ L2 Cache — Fast. ~4 nanoseconds. 256 KB - 1 MB per core.\n⚡ L3 Cache — Shared. ~10 nanoseconds. 8-64 MB total.\n\nFor comparison, RAM takes ~100 nanoseconds. Cache is 10-100x faster than RAM!\n\nMore cache = better performance, especially in gaming and video editing.",
  },
  {
    title: "Intel vs AMD",
    content: "The two CPU giants:\n\n🔵 Intel (Core i3/i5/i7/i9)\n• i3 — Budget, 4 cores\n• i5 — Mid-range, 6-10 cores (best value)\n• i7 — High-end, 8-16 cores\n• i9 — Enthusiast, 16-24 cores\n\n🔴 AMD (Ryzen 3/5/7/9)\n• Ryzen 3 — Budget, 4 cores\n• Ryzen 5 — Mid-range, 6 cores (incredible value)\n• Ryzen 7 — High-end, 8 cores\n• Ryzen 9 — Enthusiast, 12-16 cores\n\nBoth are excellent. AMD often wins on value, Intel often wins on single-thread speed.",
  },
];

const cpuScenarios = [
  { scenario: 'Gaming at 1080p — needs fast single-core speed', options: [
    { name: 'Intel i5-14600K', specs: '6P+8E cores, 5.3 GHz, $300', correct: true },
    { name: 'Intel i3-14100', specs: '4 cores, 4.7 GHz, $110', correct: false },
    { name: 'AMD Ryzen 9 7950X', specs: '16 cores, 5.7 GHz, $550', correct: false },
  ]},
  { scenario: 'Video editing & streaming — needs lots of cores', options: [
    { name: 'Intel i3-12100', specs: '4 cores, 4.3 GHz, $100', correct: false },
    { name: 'AMD Ryzen 7 7700X', specs: '8 cores, 5.4 GHz, $300', correct: true },
    { name: 'Intel i5-14400', specs: '6P+4E cores, 4.7 GHz, $200', correct: false },
  ]},
  { scenario: 'Budget office PC — basic tasks, email, browsing', options: [
    { name: 'AMD Ryzen 9 7900X', specs: '12 cores, 5.6 GHz, $400', correct: false },
    { name: 'Intel i9-14900K', specs: '24 cores, 6.0 GHz, $550', correct: false },
    { name: 'AMD Ryzen 5 5600G', specs: '6 cores, integrated GPU, $130', correct: true },
  ]},
];

const quizQuestions = [
  { q: "What does 'clock speed' measure?", options: ['Number of cores', 'How many cycles per second', 'Amount of cache', 'Power consumption'], correct: 1 },
  { q: "Which cache level is the fastest?", options: ['L3', 'L2', 'L1', 'RAM'], correct: 2 },
  { q: "A CPU with 8 cores and 16 threads means:", options: ['It has 16 physical cores', 'Each core can handle 2 threads via hyperthreading', 'It runs at 16 GHz', 'It has 16 MB of cache'], correct: 1 },
];

export default function TheCPU() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);
  const [scenarioDone, setScenarioDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (idx: number) => {
    setSelected(idx);
    if (cpuScenarios[scenarioIdx].options[idx].correct) setScenarioScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (scenarioIdx + 1 >= cpuScenarios.length) setScenarioDone(true);
      else setScenarioIdx(scenarioIdx + 1);
    }, 800);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-1-2', 60);
        addAchievement('spec-reader');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can read CPU specs like a pro! 📋" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="The CPU" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'CPU Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !scenarioDone && (
          <motion.div key="scenario" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Pick the Best CPU</h2>
              <p className="text-sm text-gray-400 mb-3">{scenarioIdx + 1}/{cpuScenarios.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm font-semibold">{cpuScenarios[scenarioIdx].scenario}</p></div>
              <div className="space-y-2">
                {cpuScenarios[scenarioIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleScenario(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selected === i ? (opt.correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && opt.correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="font-semibold">{opt.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{opt.specs}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && scenarioDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">CPU Challenge: {scenarioScore}/{cpuScenarios.length} correct!</h3>
              <p className="text-sm text-gray-400">{scenarioScore === 3 ? 'Perfect! You know your CPUs!' : 'Keep learning about CPU specs!'}</p>
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
