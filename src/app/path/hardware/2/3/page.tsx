'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "The Motherboard",
    content: "The motherboard is the backbone — every component connects to it.\n\n📐 Form Factors (sizes):\n• ATX (305×244mm) — Full-size, most expansion slots, most common for desktops\n• Micro-ATX (244×244mm) — Smaller, fewer slots, good for compact builds\n• Mini-ITX (170×170mm) — Tiny! One PCIe slot. For small form factor PCs\n\nBigger board = more expansion slots, more USB headers, more M.2 slots, better VRM (power delivery for CPU).",
  },
  {
    title: "Sockets & Chipsets",
    content: "The CPU socket determines which CPUs fit:\n\n🔵 Intel:\n• LGA 1700 — 12th/13th/14th Gen Core\n• LGA 1851 — Arrow Lake (newest)\n\n🔴 AMD:\n• AM4 — Ryzen 1000-5000 (huge ecosystem)\n• AM5 — Ryzen 7000+ (DDR5 only)\n\nThe chipset determines features:\n• Budget (B-series) — B760, B650 — Great for most users\n• High-end (Z/X-series) — Z790, X670 — Overclocking, more USB/PCIe lanes\n\n⚠️ CPU + motherboard must match socket AND chipset generation!",
  },
  {
    title: "Expansion & I/O",
    content: "Key motherboard connections:\n\n🔌 PCIe Slots — For GPUs, network cards, sound cards\n• x16 — Full-size, for GPUs\n• x4/x1 — Smaller cards\n\n📏 M.2 Slots — For NVMe SSDs\n• Most boards have 1-3 M.2 slots\n\n🔗 SATA Ports — For HDDs and SATA SSDs (4-8 ports typical)\n\n🖥️ Rear I/O — USB ports, audio, Ethernet, sometimes WiFi\n• USB 3.2 Gen 2 = 10 Gbps\n• USB-C = newer connector, often faster\n\n⚡ Headers — Internal connectors for front panel USB, audio, fans, RGB",
  },
];

const moboComponents = [
  { id: 'socket', name: 'CPU Socket', desc: 'Where the CPU sits — LGA 1700, AM5, etc.' },
  { id: 'pcie', name: 'PCIe x16 Slot', desc: 'Full-size slot for your GPU' },
  { id: 'ram', name: 'DIMM Slots', desc: 'Where RAM sticks go — usually 2 or 4 slots' },
  { id: 'm2', name: 'M.2 Slot', desc: 'Tiny slot for NVMe SSD drives' },
  { id: 'sata', name: 'SATA Ports', desc: 'Connectors for HDDs and SATA SSDs' },
  { id: 'vrm', name: 'VRM', desc: 'Voltage Regulator Module — powers the CPU' },
  { id: '24pin', name: '24-pin ATX', desc: 'Main power connector from PSU' },
  { id: 'io', name: 'Rear I/O', desc: 'USB, audio, Ethernet, display outputs' },
];

const identifyQuiz = [
  { desc: 'Delivers clean power to the CPU', answer: 'vrm' },
  { desc: 'Your GPU plugs into this long slot', answer: 'pcie' },
  { desc: 'NVMe SSDs connect here — looks like a tiny slot', answer: 'm2' },
  { desc: 'Has 2 or 4 long slots for memory sticks', answer: 'ram' },
  { desc: 'The big square area where the CPU drops in', answer: 'socket' },
  { desc: 'Where you plug in SATA cables for HDDs', answer: 'sata' },
];

const quizQuestions = [
  { q: "Which form factor is the smallest?", options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'Extended ATX'], correct: 2 },
  { q: "What must match between CPU and motherboard?", options: ['Brand and color', 'Socket type and chipset generation', 'Size and weight', 'Clock speed and cache'], correct: 1 },
  { q: "What is PCIe x16 primarily used for?", options: ['RAM', 'GPU (graphics card)', 'CPU power', 'Storage'], correct: 1 },
];

export default function Motherboard() {
  const [step, setStep] = useState(0);
  const [idStep, setIdStep] = useState(0);
  const [idScore, setIdScore] = useState(0);
  const [idDone, setIdDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleId = (answer: string) => {
    setSelected(answer);
    if (answer === identifyQuiz[idStep].answer) setIdScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (idStep + 1 >= identifyQuiz.length) setIdDone(true);
      else setIdStep(idStep + 1);
    }, 700);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-2-3', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="You know the motherboard inside out! 🔲" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="The Motherboard" pathId="hardware" />
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
                <p className="text-xs font-semibold mb-2" style={{ color: '#00f0ff' }}>Size Comparison:</p>
                <div className="space-y-2">
                  {[{ name: 'ATX', w: '100%', color: '#39ff14' }, { name: 'mATX', w: '80%', color: '#00f0ff' }, { name: 'Mini-ITX', w: '55%', color: '#ff9500' }].map(f => (
                    <div key={f.name}>
                      <div className="flex justify-between text-xs mb-1"><span>{f.name}</span></div>
                      <div className="h-6 rounded" style={{ width: f.w, backgroundColor: f.color + '30', border: `1px solid ${f.color}50` }}>
                        <span className="text-xs px-2 leading-6" style={{ color: f.color }}>{f.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Identify Components →'}</button>
          </motion.div>
        )}

        {step === 3 && !idDone && (
          <motion.div key="identify" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Identify the Component</h2>
              <p className="text-sm text-gray-400 mb-3">{idStep + 1}/{identifyQuiz.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm">{identifyQuiz[idStep].desc}</p></div>
              <div className="grid grid-cols-2 gap-2">
                {moboComponents.slice(0, 6).map(c => (
                  <button key={c.id} onClick={() => selected === null && handleId(c.id)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors ${selected === c.id ? (c.id === identifyQuiz[idStep].answer ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && c.id === identifyQuiz[idStep].answer ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && idDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">Score: {idScore}/{identifyQuiz.length} correct!</h3></div>
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
