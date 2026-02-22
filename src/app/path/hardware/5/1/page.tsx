'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Server vs Desktop",
    content: "A server is just a computer designed to run 24/7 and serve requests. But server hardware is built differently:\n\n🖥️ Desktop\n• Runs 8-12 hours/day\n• Single user\n• Consumer-grade parts\n• Optimized for speed & gaming\n\n🏗️ Server\n• Runs 24/7/365 — uptime is everything\n• Serves many users simultaneously\n• Enterprise-grade parts (built for reliability)\n• Optimized for throughput & stability\n\nServer form factors:\n• Tower — Looks like a big desktop. Small offices.\n• Rack — Fits in 19\" server racks. 1U, 2U, 4U height.\n• Blade — Ultra-thin, slides into a chassis. Data centers.",
  },
  {
    title: "Redundancy — Keeping It Running",
    content: "Servers use redundancy to survive hardware failures:\n\n💾 RAID (Redundant Array of Independent Disks)\n• RAID 0 — Stripes data across drives. Fast but NO redundancy.\n• RAID 1 — Mirrors data. 2 drives, one is a copy.\n• RAID 5 — Stripes + parity. Survives 1 drive failure. Minimum 3 drives.\n• RAID 6 — Like RAID 5 but survives 2 drive failures.\n• RAID 10 — Mirror + stripe. Fast AND redundant. Needs 4+ drives.\n\n⚡ ECC RAM — Error-Correcting Code memory\n• Detects and fixes single-bit errors automatically\n• Critical for servers that run 24/7\n• Prevents data corruption and crashes\n\n🔌 Dual PSU — Two power supplies. If one dies, the other takes over.",
  },
  {
    title: "Server CPUs & Hardware",
    content: "Server CPUs are different beasts:\n\n🔵 Intel Xeon — Server/workstation CPUs\n• Up to 56 cores, 112 threads\n• Support ECC RAM\n• Multi-socket (2-4 CPUs on one motherboard!)\n\n🔴 AMD EPYC — Server CPUs\n• Up to 128 cores, 256 threads!\n• Massive memory bandwidth\n• Great for virtualization\n\n🏗️ Server-specific hardware:\n• Hot-swap drive bays — Replace drives without shutting down\n• IPMI/iDRAC — Remote management (access BIOS over network)\n• 10 GbE+ networking — 10x faster than desktop Ethernet\n• Redundant everything — fans, PSUs, network cards",
  },
];

const serverComponents = [
  { desc: 'Memory that auto-corrects single-bit errors', answer: 'ECC RAM', options: ['DDR5 Gaming RAM', 'ECC RAM', 'VRAM', 'L3 Cache'] },
  { desc: 'Survives 1 drive failure using parity', answer: 'RAID 5', options: ['RAID 0', 'RAID 1', 'RAID 5', 'JBOD'] },
  { desc: 'Two of these ensure power if one fails', answer: 'Dual PSU', options: ['Dual GPU', 'Dual PSU', 'Dual CPU', 'Dual NIC'] },
  { desc: 'Manages the server remotely, even when it\'s off', answer: 'IPMI/iDRAC', options: ['SSH', 'IPMI/iDRAC', 'VNC', 'TeamViewer'] },
  { desc: 'Replace a hard drive without shutting down', answer: 'Hot-swap bay', options: ['SATA port', 'Hot-swap bay', 'M.2 slot', 'USB drive'] },
];

const quizQuestions = [
  { q: "What RAID level mirrors data between two drives?", options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 10'], correct: 1 },
  { q: "Why do servers use ECC RAM?", options: ['It\'s faster', 'It\'s cheaper', 'It auto-corrects memory errors to prevent crashes', 'It uses less power'], correct: 2 },
  { q: "What does 2U mean for a rack server?", options: ['2 USB ports', '2 units high in a server rack', '2 users max', '2nd generation'], correct: 1 },
];

export default function WhatIsAServer() {
  const [step, setStep] = useState(0);
  const [compStep, setCompStep] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [compDone, setCompDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleComp = (idx: number) => {
    setSelected(idx);
    if (serverComponents[compStep].options[idx] === serverComponents[compStep].answer) setCompScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (compStep + 1 >= serverComponents.length) setCompDone(true);
      else setCompStep(compStep + 1);
    }, 800);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-5-1', 70);
        addAchievement('server-admin');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Server hardware mastered! 🏗️" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="What is a Server?" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Server Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !compDone && (
          <motion.div key="comp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Identify Server Components</h2>
              <p className="text-sm text-gray-400 mb-3">{compStep + 1}/{serverComponents.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm">{serverComponents[compStep].desc}</p></div>
              <div className="space-y-2">
                {serverComponents[compStep].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleComp(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors ${selected === i ? (opt === serverComponents[compStep].answer ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && opt === serverComponents[compStep].answer ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && compDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">Score: {compScore}/{serverComponents.length} correct!</h3></div>
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
