'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Resolution",
    content: "Resolution = how many pixels on screen.\n\n📺 1080p (1920×1080) — \"Full HD\"\n• 2 million pixels. Standard for gaming.\n• Easier to run — higher FPS possible\n\n📺 1440p (2560×1440) — \"2K\" / \"QHD\"\n• 3.7 million pixels. The sweet spot!\n• Noticeably sharper than 1080p\n• Best balance of quality and performance\n\n📺 4K (3840×2160) — \"Ultra HD\"\n• 8.3 million pixels. Stunning clarity.\n• Needs a powerful GPU (RTX 4080+)\n• Great for large monitors (27\"+)\n\n💡 Higher resolution = more pixels to render = more GPU power needed.",
  },
  {
    title: "Refresh Rate & Response Time",
    content: "🔄 Refresh Rate (Hz) — How many times the screen updates per second\n• 60 Hz — Standard. Fine for office work.\n• 144 Hz — Smooth! Great for gaming. You WILL notice the difference.\n• 240 Hz — Ultra smooth. Competitive gaming.\n• 360 Hz — Diminishing returns. Pro esports only.\n\n⚡ Response Time (ms) — How fast a pixel changes color\n• 1ms — Best for competitive FPS games\n• 4ms — Good for most gaming\n• 8ms+ — Fine for general use, possible ghosting in fast games\n\n💡 Your GPU must push enough FPS to match your refresh rate. A 144 Hz monitor is wasted if your GPU only outputs 60 FPS.",
  },
  {
    title: "Panel Types & Adaptive Sync",
    content: "Three main panel technologies:\n\n🎨 IPS (In-Plane Switching)\n• Best color accuracy and viewing angles\n• Good for creative work and general use\n• Slightly slower response time\n\n🖤 VA (Vertical Alignment)\n• Best contrast ratio (deep blacks)\n• Good for movies and dark games\n• Slower response than IPS\n\n⚡ TN (Twisted Nematic)\n• Fastest response time (1ms)\n• Poor colors and viewing angles\n• Cheapest — competitive gaming only\n\n🔄 Adaptive Sync — Matches monitor refresh to GPU output\n• G-Sync (NVIDIA) / FreeSync (AMD)\n• Eliminates screen tearing and stuttering\n• Most modern monitors support FreeSync (it's free!)",
  },
];

const monitorScenarios = [
  { scenario: 'Competitive Valorant player — wants maximum smoothness', best: '1080p 240Hz TN/IPS 1ms', options: ['4K 60Hz IPS', '1080p 240Hz IPS 1ms', '1440p 144Hz VA'], correct: 1 },
  { scenario: 'Photo/video editor — color accuracy is everything', best: '4K 60Hz IPS', options: ['1080p 240Hz TN', '4K 60Hz IPS with 100% sRGB', '1440p 144Hz VA'], correct: 1 },
  { scenario: 'General gaming + movies — best all-rounder', best: '1440p 144Hz IPS', options: ['1080p 60Hz TN', '4K 240Hz IPS (if you can afford it)', '1440p 144Hz IPS with FreeSync'], correct: 2 },
  { scenario: 'Dark room movie watching — deepest blacks', best: '4K VA or OLED', options: ['1080p TN 360Hz', '4K IPS 60Hz', '4K VA with high contrast ratio'], correct: 2 },
];

const quizQuestions = [
  { q: "What resolution is 2560×1440?", options: ['1080p', '1440p / QHD', '4K', '720p'], correct: 1 },
  { q: "Which panel type has the best color accuracy?", options: ['TN', 'VA', 'IPS', 'OLED'], correct: 2 },
  { q: "What does FreeSync/G-Sync do?", options: ['Increases resolution', 'Matches monitor refresh to GPU framerate', 'Makes the monitor brighter', 'Adds more colors'], correct: 1 },
];

export default function MonitorsDisplay() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);
  const [scenarioDone, setScenarioDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (idx: number) => {
    setSelected(idx);
    if (idx === monitorScenarios[scenarioIdx].correct) setScenarioScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (scenarioIdx + 1 >= monitorScenarios.length) setScenarioDone(true);
      else setScenarioIdx(scenarioIdx + 1);
    }, 800);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-3-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="Display expert! 🖥️" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Monitors & Display" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Monitor Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !scenarioDone && (
          <motion.div key="scenario" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Pick the Best Monitor</h2>
              <p className="text-sm text-gray-400 mb-3">{scenarioIdx + 1}/{monitorScenarios.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm font-semibold">{monitorScenarios[scenarioIdx].scenario}</p></div>
              <div className="space-y-2">
                {monitorScenarios[scenarioIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleScenario(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors ${selected === i ? (i === monitorScenarios[scenarioIdx].correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && i === monitorScenarios[scenarioIdx].correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && scenarioDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">Score: {scenarioScore}/{monitorScenarios.length} correct!</h3></div>
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
