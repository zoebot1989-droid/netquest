'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "The Power Supply (PSU)",
    content: "The PSU converts AC power from the wall (120V/240V) into the DC voltages your components need:\n\n• +12V — CPU and GPU (the heavy hitters)\n• +5V — USB ports, SATA drives, fans\n• +3.3V — RAM, chipset, some I/O\n\nWattage is the total power it can deliver. More powerful components = bigger PSU needed.\n\nNEVER cheap out on the PSU! A bad PSU can fry every component in your system. Buy from reputable brands: Corsair, EVGA, Seasonic, be quiet!",
  },
  {
    title: "80+ Efficiency Ratings",
    content: "The 80+ certification tells you how efficiently the PSU converts AC to DC:\n\n⬜ 80+ (White) — 80% efficient → 20% wasted as heat\n🟫 80+ Bronze — 82-85% efficient\n🥈 80+ Silver — 85-88% efficient\n🥇 80+ Gold — 87-90% efficient ← Best value!\n🏆 80+ Platinum — 90-92% efficient\n💎 80+ Titanium — 92-94% efficient\n\nExample: A system drawing 400W from a Gold PSU actually uses ~445W from the wall. A basic 80+ uses ~500W.\n\nHigher efficiency = less heat, less noise, lower electric bill.",
  },
  {
    title: "Modular vs Non-Modular",
    content: "PSUs come in three cable styles:\n\n🔧 Non-Modular — All cables permanently attached\n• Cheapest option\n• Unused cables clutter your case\n• Harder to build, worse airflow\n\n🔧 Semi-Modular — Main cables attached, extras detachable\n• Good compromise\n• Motherboard + CPU cable always there\n• Add only what you need\n\n🔧 Fully Modular — ALL cables detachable\n• Cleanest builds\n• Only plug in what you use\n• Easier cable management\n• Most expensive\n\n⚠️ NEVER mix cables between PSU brands! They look the same but pin layouts differ. This can destroy components!",
  },
];

const buildComponents = [
  { name: 'Intel i5-14600K', watts: 125 },
  { name: 'RTX 4070', watts: 200 },
  { name: '2x16 GB DDR5', watts: 10 },
  { name: 'NVMe SSD', watts: 7 },
  { name: '3x Case Fans', watts: 9 },
  { name: 'Motherboard', watts: 50 },
];

const psuOptions = [
  { name: '450W Bronze', watts: 450, correct: false, reason: 'Too close to the limit! No headroom for spikes.' },
  { name: '550W Gold', watts: 550, correct: false, reason: 'GPU power spikes could exceed this. Risky.' },
  { name: '650W Gold', watts: 650, correct: true, reason: 'Perfect! ~400W draw with 60% headroom for efficiency and spikes.' },
  { name: '1000W Platinum', watts: 1000, correct: false, reason: 'Works but massive overkill. Wasted money.' },
];

const quizQuestions = [
  { q: "Why should you never cheap out on a PSU?", options: ['It affects gaming FPS', 'A bad PSU can destroy all your components', 'Cheap PSUs are too loud', 'It makes the computer slower'], correct: 1 },
  { q: "What does 80+ Gold mean?", options: ['The PSU is gold colored', '87-90% power conversion efficiency', 'It lasts for a long time', 'It has gold-plated connectors'], correct: 1 },
  { q: "Why should you NEVER mix PSU cables between brands?", options: ['They\'re different colors', 'Different pin layouts can destroy components', 'They won\'t physically fit', 'It voids the warranty'], correct: 1 },
];

export default function PowerSupply() {
  const [step, setStep] = useState(0);
  const [calcDone, setCalcDone] = useState(false);
  const [psuSelected, setPsuSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const totalWatts = buildComponents.reduce((s, c) => s + c.watts, 0);

  const handlePsu = (idx: number) => {
    setPsuSelected(idx);
    setTimeout(() => setCalcDone(true), 1000);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-2-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can pick the right PSU! 🔌" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="The Power Supply (PSU)" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'PSU Calculator →'}</button>
          </motion.div>
        )}

        {step === 3 && !calcDone && (
          <motion.div key="calc" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>⚡ PSU Wattage Calculator</h2>
              <p className="text-sm text-gray-400 mb-4">Calculate the total power draw, then pick the right PSU.</p>
              <div className="space-y-2 mb-4">
                {buildComponents.map(c => (
                  <div key={c.name} className="flex justify-between text-sm bg-gray-800/50 rounded-lg px-3 py-2">
                    <span>{c.name}</span>
                    <span style={{ color: '#ff9500' }}>{c.watts}W</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold bg-cyan-900/20 rounded-lg px-3 py-2 border border-cyan-800/30">
                  <span>Total Draw</span>
                  <span style={{ color: '#00f0ff' }}>{totalWatts}W</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3">💡 Rule of thumb: PSU should be 50-80% loaded for best efficiency. Pick one with headroom!</p>
              <div className="space-y-2">
                {psuOptions.map((opt, i) => (
                  <button key={i} onClick={() => psuSelected === null && handlePsu(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${psuSelected === i ? (opt.correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : psuSelected !== null && opt.correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="font-semibold">{opt.name}</div>
                    {psuSelected !== null && <p className="text-xs mt-1 text-gray-400">{opt.reason}</p>}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && calcDone && psuSelected !== null && !complete && (
          <motion.div key="quiz-transition" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">{psuOptions[psuSelected].correct ? '✅ Great choice!' : '📝 Good lesson learned!'}</h3>
              <p className="text-sm text-gray-400">{psuOptions[psuSelected].reason}</p>
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
