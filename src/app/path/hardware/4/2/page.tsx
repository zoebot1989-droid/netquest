'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "The Build Order",
    content: "Building a PC follows a specific order. Getting it wrong means taking things apart and redoing work.\n\nThe standard build process:\n1. Install CPU into motherboard\n2. Install CPU cooler\n3. Install RAM into DIMM slots\n4. Install M.2 SSD(s)\n5. Install motherboard into case\n6. Install PSU into case\n7. Install storage drives (SATA)\n8. Install GPU\n9. Connect all cables\n10. Cable management\n11. Close case, first boot!\n\n💡 Steps 1-4 are done OUTSIDE the case on the motherboard box. Much easier with room to work!",
  },
  {
    title: "Cable Types You'll Connect",
    content: "Every builder needs to know these cables:\n\n⚡ 24-pin ATX — Main motherboard power (biggest connector)\n⚡ 8-pin CPU (EPS) — Powers the CPU (top of motherboard)\n⚡ 6+2 pin PCIe — GPU power (one or two connectors)\n⚡ SATA Power — Powers SSDs and HDDs (flat, L-shaped)\n⚡ SATA Data — Connects storage to motherboard (small, L-shaped)\n⚡ Front Panel Headers — Tiny pins for power button, USB, audio\n\n⚠️ The front panel headers are the most annoying part of any build. The pins are tiny and the labels are hard to read. Check your motherboard manual!",
  },
  {
    title: "Pro Tips",
    content: "🔧 Before you build:\n• Ground yourself! Touch the case or wear an anti-static wrist strap\n• Work on a clean, well-lit surface\n• Keep screws organized (each type in a separate pile)\n• Read the motherboard manual for header positions\n\n🔧 During the build:\n• Don't force anything! If it doesn't fit, you're doing it wrong\n• CPU goes in ONE direction — match the triangle/arrow\n• RAM clicks into place — push firmly until both clips snap\n• Thermal paste: pea-sized dot in the center of CPU\n\n🔧 After building:\n• Don't panic if it doesn't POST first try\n• Reseat RAM — it's the #1 cause of no-POST\n• Check all power cables are fully plugged in\n• Make sure the monitor is plugged into the GPU, not motherboard",
  },
];

const correctOrder = [
  'Install CPU into motherboard',
  'Apply thermal paste',
  'Install CPU cooler',
  'Install RAM sticks',
  'Install M.2 NVMe SSD',
  'Mount motherboard in case',
  'Install PSU',
  'Connect 24-pin ATX power',
  'Connect 8-pin CPU power',
  'Install GPU in PCIe slot',
  'Connect GPU power cable(s)',
  'Connect front panel headers',
];

const orderQuiz = [
  { q: 'What should you install FIRST?', options: ['GPU', 'CPU into motherboard', 'PSU', 'RAM'], correct: 1 },
  { q: 'When should you install the GPU?', options: ['First, before anything', 'Before the motherboard goes in the case', 'After motherboard is in the case and PSU connected', 'Last, after OS is installed'], correct: 2 },
  { q: 'Steps 1-4 should be done:', options: ['Inside the case', 'Outside the case on the motherboard box', 'On carpet for comfort', 'In the order you remember'], correct: 1 },
];

const cableMatch = [
  { cable: '24-pin ATX', purpose: 'Main motherboard power' },
  { cable: '8-pin EPS', purpose: 'CPU power' },
  { cable: '6+2 pin PCIe', purpose: 'GPU power' },
  { cable: 'SATA Power', purpose: 'SSD/HDD power' },
  { cable: 'SATA Data', purpose: 'Storage data to motherboard' },
  { cable: 'Front Panel', purpose: 'Power button, reset, LEDs' },
];

const cablePurposes = cableMatch.map(c => c.purpose).sort(() => Math.random() - 0.5);

const quizQuestions = [
  { q: "What's the #1 cause of a PC not POSTing after building?", options: ['Dead CPU', 'Bad PSU', 'RAM not fully seated', 'Missing thermal paste'], correct: 2 },
  { q: "Where should you plug your monitor cable?", options: ['Motherboard I/O', 'GPU outputs', 'Either one works', 'USB port'], correct: 1 },
  { q: "How much thermal paste should you use?", options: ['Cover the entire CPU', 'Pea-sized dot in the center', 'A thin line across', 'None — the cooler has it built in always'], correct: 1 },
];

export default function AssemblyStepByStep() {
  const [step, setStep] = useState(0);
  const [orderStep, setOrderStep] = useState(0);
  const [orderScore, setOrderScore] = useState(0);
  const [orderDone, setOrderDone] = useState(false);
  const [cableStep, setCableStep] = useState(0);
  const [cableScore, setCableScore] = useState(0);
  const [cableDone, setCableDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleOrder = (answer: number) => {
    setSelected(answer);
    if (answer === orderQuiz[orderStep].correct) setOrderScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (orderStep + 1 >= orderQuiz.length) setOrderDone(true);
      else setOrderStep(orderStep + 1);
    }, 800);
  };

  const handleCable = (purposeIdx: number) => {
    setSelected(purposeIdx);
    if (cablePurposes[purposeIdx] === cableMatch[cableStep].purpose) setCableScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (cableStep + 1 >= cableMatch.length) setCableDone(true);
      else setCableStep(cableStep + 1);
    }, 700);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-4-2', 80);
        addAchievement('cable-manager');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={80} message="You can build a PC! 🔧" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Assembly Step-by-Step" pathId="hardware" />
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
                <p className="text-xs font-semibold mb-2" style={{ color: '#00f0ff' }}>Build Order:</p>
                <div className="space-y-1">
                  {correctOrder.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-cyan-900/30 flex items-center justify-center text-[10px]" style={{ color: '#00f0ff' }}>{i + 1}</span>
                      <span className="text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Build Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !orderDone && (
          <motion.div key="order" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🔧 Build Order Challenge</h2>
              <p className="text-sm text-gray-400 mb-3">{orderStep + 1}/{orderQuiz.length}</p>
              <p className="text-sm mb-4">{orderQuiz[orderStep].q}</p>
              <div className="space-y-2">
                {orderQuiz[orderStep].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleOrder(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selected === i ? (i === orderQuiz[orderStep].correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && i === orderQuiz[orderStep].correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && orderDone && !cableDone && (
          <motion.div key="cables" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-cyan-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#00f0ff' }}>🔌 Cable Matching</h2>
              <p className="text-sm text-gray-400 mb-3">What does the <span className="font-semibold text-white">{cableMatch[cableStep].cable}</span> cable do?</p>
              <p className="text-xs text-gray-500 mb-3">{cableStep + 1}/{cableMatch.length}</p>
              <div className="space-y-2">
                {cablePurposes.map((p, i) => (
                  <button key={i} onClick={() => selected === null && handleCable(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selected === i ? (p === cableMatch[cableStep].purpose ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && cableDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Build Order: {orderScore}/{orderQuiz.length} | Cables: {cableScore}/{cableMatch.length}</h3>
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
