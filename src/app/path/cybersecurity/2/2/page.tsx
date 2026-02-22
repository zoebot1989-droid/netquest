'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Active Reconnaissance",
    content: "Active recon means DIRECTLY interacting with the target. The target might detect you.\n\n⚡ Port Scanning — Find open ports and running services\n⚡ Service Detection — Identify what software is running\n⚡ OS Fingerprinting — Determine the target's operating system\n⚡ Banner Grabbing — Read version info from services\n\n⚠️ Unlike passive recon, active scanning can be detected by IDS/IPS systems and may be illegal without authorization!",
  },
  {
    title: "Nmap — The Network Mapper",
    content: "Nmap is the KING of port scanning:\n\n🔍 nmap -sS target — SYN scan (stealth, half-open)\n🔍 nmap -sV target — Version detection (identify services)\n🔍 nmap -O target — OS fingerprinting\n🔍 nmap -A target — Aggressive (OS + version + scripts + traceroute)\n🔍 nmap -p 1-1000 target — Scan specific port range\n🔍 nmap -p 22,80,443 target — Scan specific ports\n\nPort States:\n• open — Service is accepting connections\n• closed — Port is accessible but no service\n• filtered — Firewall blocking access",
  },
];

export default function ActiveRecon() {
  const [step, setStep] = useState(0);
  const [completedScans, setCompletedScans] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does nmap -sS do?", options: ['Service version scan', 'SYN stealth scan', 'Full TCP connect scan', 'OS detection'], correct: 1 },
    { q: "A port showing 'filtered' means...", options: ['The service crashed', 'A firewall is blocking it', 'The port is open', 'Nobody is listening'], correct: 1 },
    { q: "Why is active recon riskier than passive?", options: ['It costs more', 'It directly touches the target and can be detected', 'It requires special hardware', 'It only works on Linux'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const newCompleted = new Set(completedScans);
    if (cmd.includes('nmap') && cmd.includes('-sS')) newCompleted.add('syn');
    if (cmd.includes('nmap') && cmd.includes('-sV')) newCompleted.add('version');
    if (cmd.includes('nmap') && (cmd.includes('-O') || cmd.includes('-A'))) newCompleted.add('os');
    if (cmd.includes('nmap') && cmd.includes('-p')) newCompleted.add('ports');
    if (cmd.includes('nmap') && !cmd.includes('-')) newCompleted.add('basic');
    setCompletedScans(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(3), 500);
  }, [completedScans]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-2-2', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Nmap mastery unlocked! 🔍" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Active Recon" pathId="cybersecurity" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-red-900/30 text-red-400">{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Start Scanning →'}</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="scan" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🎯 Scan the Target: 192.168.1.50</h2>
              <p className="text-sm text-gray-400">Use at least 3 different nmap scan types:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['syn', '-sS'], ['version', '-sV'], ['os', '-O/-A'], ['ports', '-p']].map(([key, label]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedScans.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedScans.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: nmap -sS 192.168.1.50, nmap -sV -p 22,80,443 target</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="240px" />
          </motion.div>
        )}

        {step === 3 && (
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
