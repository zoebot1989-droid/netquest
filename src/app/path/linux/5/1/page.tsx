'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Networking on Linux",
    content: "Linux has powerful built-in networking tools. Every server admin needs these:\n\n• ip addr — show network interfaces and IP addresses\n• ss — show open ports and connections (replaces netstat)\n• ping — test connectivity\n• cat /etc/hosts — local hostname → IP mappings\n• cat /etc/resolv.conf — DNS server configuration",
  },
  {
    title: "Key Config Files",
    content: "/etc/hosts — Manual DNS overrides. Add entries like:\n  192.168.1.50  myserver\nThen you can do: ssh myserver (instead of the IP!)\n\n/etc/resolv.conf — Which DNS servers to use:\n  nameserver 8.8.8.8\n  nameserver 8.8.4.4\n\nip addr shows:\n• lo — loopback (127.0.0.1, localhost)\n• eth0 — your main network interface\n\nss shows what's listening:\n• Port 22 = SSH\n• Port 80 = HTTP\n• Port 443 = HTTPS",
  },
];

const quizQuestions = [
  { q: "What command shows your IP addresses on Linux?", options: ['ipconfig', 'ip addr', 'show ip', 'netinfo'], correct: 1 },
  { q: "What file maps hostnames to IPs locally?", options: ['/etc/dns', '/etc/resolv.conf', '/etc/hosts', '/etc/network'], correct: 2 },
  { q: "What does 'ss' show?", options: ['System services', 'Socket statistics (open ports/connections)', 'SSH sessions', 'Swap space'], correct: 1 },
  { q: "What does /etc/resolv.conf configure?", options: ['Network interfaces', 'Firewall rules', 'DNS servers', 'Routing tables'], correct: 2 },
];

export default function NetworkingLinux() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed.includes('ip addr') || trimmed === 'ip a') newCompleted.add('ip');
    if (trimmed === 'ss' || trimmed.startsWith('ss ')) newCompleted.add('ss');
    if (trimmed.includes('/etc/hosts')) newCompleted.add('hosts');
    if (trimmed.includes('resolv.conf')) newCompleted.add('resolv');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-5-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Linux networking mastered! 🌐" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Networking on Linux" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Explore Network →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Network Recon</h2>
              <p className="text-sm text-gray-400">Investigate this server&apos;s network. Try at least 3:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['ip addr', 'ip'], ['ss', 'ss'], ['cat /etc/hosts', 'hosts'], ['cat /etc/resolv.conf', 'resolv']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm font-mono bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
