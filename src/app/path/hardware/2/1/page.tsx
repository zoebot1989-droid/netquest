'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Three Types of Storage",
    content: "💿 HDD (Hard Disk Drive)\n• Spinning magnetic platters with a read/write head\n• Speed: 80-160 MB/s\n• Cheap! Great for bulk storage\n• Fragile — moving parts can fail\n\n⚡ SSD (Solid State Drive - SATA)\n• No moving parts — flash memory chips\n• Speed: 500-560 MB/s (SATA limit)\n• 5x faster than HDD\n• Uses the same SATA cable as HDDs\n\n🚀 NVMe SSD (M.2)\n• Flash memory on a tiny stick\n• Speed: 3,500-14,000 MB/s\n• Up to 25x faster than HDD!\n• Plugs directly into the motherboard (M.2 slot)",
  },
  {
    title: "SATA vs M.2 vs PCIe",
    content: "These are the INTERFACES — how storage connects:\n\n🔌 SATA — The classic cable connection\n• Max speed: 560 MB/s (limited by the SATA standard)\n• Used by: HDDs and 2.5\" SSDs\n• Still the most common\n\n📏 M.2 — A slot on the motherboard\n• Tiny form factor — looks like a stick of gum\n• Can be SATA M.2 (560 MB/s) or NVMe M.2 (7,000+ MB/s)\n• The M.2 slot type determines speed\n\n⚡ PCIe — Direct lanes to the CPU\n• NVMe uses PCIe lanes for maximum speed\n• Gen 3: ~3,500 MB/s | Gen 4: ~7,000 MB/s | Gen 5: ~14,000 MB/s",
  },
  {
    title: "Capacity vs Speed",
    content: "Real-world pricing (approximate):\n\n💿 HDD: 1 TB = $40, 4 TB = $80\n⚡ SATA SSD: 1 TB = $60, 2 TB = $120\n🚀 NVMe Gen 4: 1 TB = $70, 2 TB = $130\n🏎️ NVMe Gen 5: 1 TB = $130, 2 TB = $250\n\nBest strategy for most builds:\n• NVMe SSD (500 GB - 1 TB) for OS + games\n• Large HDD (2-4 TB) for photos, videos, backups\n\nGame load times:\nHDD: 60 seconds → SATA SSD: 15 seconds → NVMe: 8 seconds",
  },
];

const matchItems = [
  { useCase: 'Windows boot drive — fastest possible startup', answer: 'nvme' },
  { useCase: 'Storing 10 TB of family photos and videos', answer: 'hdd' },
  { useCase: 'Budget laptop upgrade from HDD', answer: 'sata-ssd' },
  { useCase: 'Video editing scratch disk — fast read/write', answer: 'nvme' },
  { useCase: 'NAS backup server — lots of cheap storage', answer: 'hdd' },
  { useCase: 'Gaming library — good speed, good value', answer: 'sata-ssd' },
];

const storageTypes = [
  { id: 'hdd', name: '💿 HDD', color: '#ff9500' },
  { id: 'sata-ssd', name: '⚡ SATA SSD', color: '#00f0ff' },
  { id: 'nvme', name: '🚀 NVMe', color: '#39ff14' },
];

const quizQuestions = [
  { q: "What's the maximum speed of a SATA connection?", options: ['160 MB/s', '560 MB/s', '3,500 MB/s', '7,000 MB/s'], correct: 1 },
  { q: "Why are HDDs cheaper per TB than SSDs?", options: ['They\'re older technology', 'Magnetic platters are cheap to manufacture', 'They use less power', 'They\'re faster'], correct: 1 },
  { q: "What does NVMe stand for?", options: ['New Volume Memory Extension', 'Non-Volatile Memory Express', 'Network Virtual Memory Engine', 'Nano Voltage Memory Element'], correct: 1 },
];

export default function StorageTypes() {
  const [step, setStep] = useState(0);
  const [matchStep, setMatchStep] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleMatch = (answer: string) => {
    setSelected(answer);
    if (answer === matchItems[matchStep].answer) setMatchScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (matchStep + 1 >= matchItems.length) setMatchDone(true);
      else setMatchStep(matchStep + 1);
    }, 700);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-2-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You know your storage! 💾" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Storage — HDD vs SSD vs NVMe" pathId="hardware" />
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
                <p className="text-xs font-semibold mb-2" style={{ color: '#00f0ff' }}>Speed Comparison:</p>
                <div className="space-y-2">
                  {[{ name: 'HDD', speed: 160, max: 14000, color: '#ff9500' }, { name: 'SATA SSD', speed: 560, max: 14000, color: '#00f0ff' }, { name: 'NVMe Gen 4', speed: 7000, max: 14000, color: '#39ff14' }].map(s => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1"><span>{s.name}</span><span style={{ color: s.color }}>{s.speed} MB/s</span></div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(s.speed / s.max) * 100}%`, backgroundColor: s.color }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Storage Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !matchDone && (
          <motion.div key="match" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Match Storage to Use Case</h2>
              <p className="text-sm text-gray-400 mb-3">{matchStep + 1}/{matchItems.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm">{matchItems[matchStep].useCase}</p></div>
              <div className="space-y-2">
                {storageTypes.map(t => (
                  <button key={t.id} onClick={() => selected === null && handleMatch(t.id)}
                    className={`w-full p-3 rounded-lg text-sm font-semibold transition-colors ${selected === t.id ? (t.id === matchItems[matchStep].answer ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && t.id === matchItems[matchStep].answer ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && matchDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">Score: {matchScore}/{matchItems.length} correct!</h3></div>
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
