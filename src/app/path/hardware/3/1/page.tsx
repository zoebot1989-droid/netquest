'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What Does a GPU Do?",
    content: "A GPU (Graphics Processing Unit) is designed for parallel processing — doing thousands of simple calculations simultaneously.\n\nThe CPU handles complex sequential tasks. The GPU handles massive parallel tasks:\n• Rendering 3D graphics (millions of pixels per frame)\n• Video encoding/decoding\n• AI/Machine Learning (matrix math)\n• Cryptocurrency mining\n\n🎮 Gaming: The GPU renders every frame. A faster GPU = higher FPS and better graphics.\n🤖 AI: GPUs train neural networks 100x faster than CPUs because of parallel processing.",
  },
  {
    title: "Integrated vs Discrete",
    content: "🔲 Integrated GPU (iGPU)\n• Built INTO the CPU (Intel UHD, AMD Radeon Vega)\n• Shares system RAM — no dedicated VRAM\n• Fine for: office work, YouTube, light gaming\n• Can't handle modern games at high settings\n• Cheaper — no extra card needed\n\n🎮 Discrete GPU (dedicated)\n• Separate card that plugs into PCIe x16 slot\n• Has its own VRAM (video memory)\n• NVIDIA: RTX 4060, 4070, 4080, 4090\n• AMD: RX 7600, 7700 XT, 7800 XT, 7900 XTX\n\n💡 VRAM matters! 8 GB minimum for modern gaming. 12-16 GB for 4K and AI workloads.",
  },
  {
    title: "CUDA, Ray Tracing & DLSS",
    content: "🟢 NVIDIA-specific technologies:\n\n⚡ CUDA Cores — NVIDIA's parallel processors\n• More CUDA cores = faster rendering & AI\n• RTX 4070: 5,888 cores | RTX 4090: 16,384 cores\n\n🌟 Ray Tracing — Realistic lighting simulation\n• Traces individual light rays in real-time\n• Reflections, shadows, global illumination\n• Requires RT cores (dedicated hardware)\n\n🧠 DLSS — AI-powered upscaling\n• Uses AI to upscale lower-res images to look like higher-res\n• Play at 1080p performance with near-4K quality\n• Massive FPS boost with minimal quality loss\n\n🔴 AMD equivalents: RDNA cores, FSR (upscaling), Radeon Rays",
  },
];

const gpuScenarios = [
  { scenario: 'Competitive Fortnite/Valorant — high FPS at 1080p', options: [
    { name: 'RTX 4060 (8GB, $300)', correct: true },
    { name: 'Intel UHD 770 (integrated)', correct: false },
    { name: 'RTX 4090 (24GB, $1600)', correct: false },
  ]},
  { scenario: 'Training AI models and machine learning', options: [
    { name: 'RX 7600 (8GB, $250)', correct: false },
    { name: 'RTX 4090 (24GB VRAM, 16K CUDA cores)', correct: true },
    { name: 'RTX 4060 (8GB, $300)', correct: false },
  ]},
  { scenario: 'Office PC — Excel, email, YouTube only', options: [
    { name: 'RTX 4070 Ti ($700)', correct: false },
    { name: 'AMD Ryzen 5600G (integrated Radeon)', correct: true },
    { name: 'RX 7900 XTX ($900)', correct: false },
  ]},
  { scenario: '4K gaming at max settings', options: [
    { name: 'RTX 4060 Ti (8GB)', correct: false },
    { name: 'Intel UHD integrated', correct: false },
    { name: 'RTX 4080 Super (16GB, $1000)', correct: true },
  ]},
];

const quizQuestions = [
  { q: "What does VRAM stand for?", options: ['Virtual RAM', 'Video RAM', 'Variable RAM', 'Volatile Read-Access Memory'], correct: 1 },
  { q: "What makes GPUs great for AI?", options: ['Higher clock speed', 'More cache', 'Massive parallel processing capability', 'Better power efficiency'], correct: 2 },
  { q: "What does DLSS do?", options: ['Increases VRAM', 'Uses AI to upscale lower-res images', 'Adds more CUDA cores', 'Enables ray tracing'], correct: 1 },
];

export default function GPUsExplained() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);
  const [scenarioDone, setScenarioDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (idx: number) => {
    setSelected(idx);
    if (gpuScenarios[scenarioIdx].options[idx].correct) setScenarioScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (scenarioIdx + 1 >= gpuScenarios.length) setScenarioDone(true);
      else setScenarioIdx(scenarioIdx + 1);
    }, 800);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-3-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You know your GPUs! 🎮" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="GPUs Explained" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'GPU Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !scenarioDone && (
          <motion.div key="scenario" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Pick the Right GPU</h2>
              <p className="text-sm text-gray-400 mb-3">{scenarioIdx + 1}/{gpuScenarios.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm font-semibold">{gpuScenarios[scenarioIdx].scenario}</p></div>
              <div className="space-y-2">
                {gpuScenarios[scenarioIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleScenario(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors ${selected === i ? (opt.correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && opt.correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && scenarioDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">GPU Challenge: {scenarioScore}/{gpuScenarios.length} correct!</h3></div>
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
