'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Planning Your Build",
    content: "Before buying anything, you need a plan:\n\n1️⃣ Define your use case\n• Gaming? Content creation? Office work? Server?\n• This determines your priorities\n\n2️⃣ Set a budget\n• $500 — Budget gaming/productivity\n• $800 — Solid 1080p gaming\n• $1200 — Great 1440p gaming\n• $2000+ — High-end 4K / workstation\n\n3️⃣ Use PCPartPicker.com\n• Checks compatibility automatically\n• Compares prices across retailers\n• Shows power consumption\n• Community build guides for reference",
  },
  {
    title: "Avoiding Bottlenecks",
    content: "A bottleneck is when one component limits another.\n\n🔴 CPU Bottleneck — Weak CPU can't keep up with GPU\n• Symptoms: Low GPU usage, CPU at 100%\n• Example: i3 paired with RTX 4090\n\n🔴 GPU Bottleneck — Weak GPU can't match CPU\n• Most common and easiest to fix\n• Symptoms: GPU at 100%, CPU idle\n• Solution: Upgrade GPU or lower resolution\n\n🔴 RAM Bottleneck — Not enough RAM\n• Symptoms: Stuttering, disk thrashing\n• Solution: Add more RAM\n\n💡 Balance is key! Spend ~40% of budget on GPU for gaming builds, ~25% on CPU, ~10% on RAM.",
  },
  {
    title: "Compatibility Checklist",
    content: "Before buying, verify:\n\n✅ CPU socket matches motherboard socket\n   (e.g., LGA 1700 CPU needs LGA 1700 board)\n\n✅ RAM type matches motherboard\n   (DDR4 board needs DDR4 RAM, DDR5 needs DDR5)\n\n✅ GPU fits in case (check length in mm)\n\n✅ PSU has enough wattage (add up all TDP + 20%)\n\n✅ CPU cooler fits in case (check height clearance)\n\n✅ Motherboard form factor fits case\n   (ATX board needs ATX or larger case)\n\n✅ M.2 slots available for NVMe SSDs\n\n✅ Front panel USB headers match case connectors",
  },
];

interface Component { name: string; price: number; category: string; compatible: boolean; notes?: string }
const components: Component[] = [
  { name: 'AMD Ryzen 5 5600', price: 130, category: 'CPU', compatible: true },
  { name: 'Intel i5-14600K', price: 300, category: 'CPU', compatible: true },
  { name: 'B550 Motherboard', price: 100, category: 'Motherboard', compatible: true },
  { name: 'B760 Motherboard', price: 130, category: 'Motherboard', compatible: true },
  { name: '2x8GB DDR4-3200', price: 40, category: 'RAM', compatible: true },
  { name: '2x16GB DDR5-5600', price: 90, category: 'RAM', compatible: true },
  { name: 'RTX 4060 8GB', price: 300, category: 'GPU', compatible: true },
  { name: 'RX 7600 8GB', price: 250, category: 'GPU', compatible: true },
  { name: '1TB NVMe Gen4 SSD', price: 70, category: 'Storage', compatible: true },
  { name: '650W 80+ Gold PSU', price: 80, category: 'PSU', compatible: true },
  { name: 'Mid-Tower ATX Case', price: 70, category: 'Case', compatible: true },
];

const budget = 800;

const quizQuestions = [
  { q: "What's the BIGGEST bottleneck risk?", options: ['Cheap case', 'Pairing a weak CPU with a powerful GPU', 'Using an HDD instead of SSD', 'Not having WiFi'], correct: 1 },
  { q: "What should you check FIRST for compatibility?", options: ['Case color', 'CPU socket matches motherboard', 'Monitor resolution', 'Number of USB ports'], correct: 1 },
  { q: "For a gaming build, what % of budget should go to GPU?", options: ['About 10%', 'About 25%', 'About 40%', 'About 60%'], correct: 2 },
];

export default function PlanningBuild() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<string, Component>>({});
  const [buildDone, setBuildDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const totalPrice = Object.values(picked).reduce((s, c) => s + c.price, 0);
  const categories = ['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'PSU', 'Case'];
  const allPicked = categories.every(cat => picked[cat]);

  const pickComponent = (comp: Component) => {
    setPicked(prev => ({ ...prev, [comp.category]: comp }));
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-4-1', 70);
        addAchievement('budget-builder');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="You planned a PC build! 💰" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Planning Your Build" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Budget Builder →'}</button>
          </motion.div>
        )}

        {step === 3 && !buildDone && (
          <motion.div key="builder" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🔧 Budget PC Builder</h2>
              <p className="text-sm text-gray-400 mb-2">Build a gaming PC under ${budget}!</p>
              <div className="flex justify-between text-sm font-bold mb-4 bg-gray-800/50 rounded-lg px-3 py-2">
                <span>Total: <span style={{ color: totalPrice > budget ? '#ff4444' : '#39ff14' }}>${totalPrice}</span></span>
                <span>Budget: <span style={{ color: '#00f0ff' }}>${budget}</span></span>
              </div>

              {categories.map(cat => (
                <div key={cat} className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">{cat} {picked[cat] && <span style={{ color: '#39ff14' }}>✓ {picked[cat].name}</span>}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {components.filter(c => c.category === cat).map(comp => (
                      <button key={comp.name} onClick={() => pickComponent(comp)}
                        className={`shrink-0 px-3 py-2 rounded-lg text-xs transition-colors ${picked[cat]?.name === comp.name ? 'bg-cyan-900/40 border border-cyan-700/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                        <div className="font-semibold">{comp.name}</div>
                        <div style={{ color: '#ff9500' }}>${comp.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {allPicked && (
                <button onClick={() => setBuildDone(true)}
                  className={`w-full mt-2 p-3 rounded-lg font-semibold text-sm ${totalPrice <= budget ? 'bg-green-900/30 text-green-400 hover:bg-green-800/40' : 'bg-red-900/30 text-red-400'}`}>
                  {totalPrice <= budget ? '✅ Submit Build' : `❌ Over budget by $${totalPrice - budget}`}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && buildDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">{totalPrice <= budget ? '✅ Build Complete!' : '📝 Over budget, but you learned!'}</h3>
              <p className="text-sm text-gray-400">Total: ${totalPrice} / ${budget}</p>
              <div className="mt-2 space-y-1">
                {Object.values(picked).map(c => (
                  <div key={c.name} className="flex justify-between text-xs"><span>{c.name}</span><span style={{ color: '#00f0ff' }}>${c.price}</span></div>
                ))}
              </div>
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
