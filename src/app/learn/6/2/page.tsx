'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const lessons = [
  {
    title: "Server Security Basics",
    content: "A fresh VPS is like an unlocked house. You need to secure it ASAP:\n\n1️⃣ SSH Keys — Disable password login, use key-based auth\n2️⃣ Firewall — Only open ports you actually need\n3️⃣ fail2ban — Auto-ban IPs that try to brute-force your login\n4️⃣ Updates — Keep packages patched\n5️⃣ Non-root user — Don't run everything as root\n\nA server without these protections will be found and attacked within hours of going online.",
  },
  {
    title: "Hardening Steps",
    content: "SSH hardening (/etc/ssh/sshd_config):\n• PasswordAuthentication no\n• PermitRootLogin no\n• Change default port (optional, obscurity)\n\nFirewall (iptables or ufw):\n• ufw allow 22/tcp\n• ufw allow 80/tcp\n• ufw allow 443/tcp\n• ufw enable\n\nfail2ban:\n• Monitors log files for failed login attempts\n• After X failures, bans the IP for a set duration\n• apt install fail2ban → systemctl start fail2ban",
  },
];

const securitySteps = [
  { label: 'Generate SSH key', check: (c: string) => c.includes('ssh-keygen') },
  { label: 'Set up firewall', check: (c: string) => (c.includes('ufw') || c.includes('iptables')) && (c.includes('allow') || c.includes('enable') || c.includes('accept')) },
  { label: 'Install fail2ban', check: (c: string) => c.includes('apt') && c.includes('fail2ban') },
  { label: 'Start fail2ban', check: (c: string) => c.includes('systemctl') && c.includes('start') && c.includes('fail2ban') },
  { label: 'Update packages', check: (c: string) => c.includes('apt') && (c.includes('update') || c.includes('upgrade')) },
];

const quizQuestions = [
  { q: "Why should you disable password authentication for SSH?", options: ['Passwords are slow', 'SSH keys are much harder to brute-force', 'Passwords use more bandwidth', 'It\'s required by law'], correct: 1 },
  { q: "What does fail2ban do?", options: ['Blocks all traffic', 'Bans IPs after too many failed login attempts', 'Encrypts your hard drive', 'Disables USB ports'], correct: 1 },
  { q: "Which of these is NOT a good server hardening step?", options: ['Disable root SSH login', 'Keep packages updated', 'Open all ports for convenience', 'Use SSH key authentication'], correct: 2 },
  { q: "What does 'ufw enable' do?", options: ['Uninstalls the firewall', 'Activates the firewall with configured rules', 'Opens all ports', 'Disables IPv6'], correct: 1 },
];

export default function SecureServer() {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, _output: string[], _state: TerminalState) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedSteps);
    securitySteps.forEach((ss, i) => {
      if (ss.check(trimmed)) newCompleted.add(i);
    });
    setCompletedSteps(newCompleted);
    if (newCompleted.size >= securitySteps.length) {
      setTimeout(() => setStep(3), 1000);
    }
  }, [completedSteps]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-6-2', 100);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={100} message="Server secured! 🔒" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={6} title="Secure Your Server" pathId="networking" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Secure the Server →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="secure" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🔒 Harden Your Server</h3>
              <p className="text-sm text-gray-400 mb-3">Complete each security step:</p>
              <div className="space-y-2 mb-3">
                {securitySteps.map((ss, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${completedSteps.has(i) ? 'text-green-400' : 'text-gray-500'}`}>
                    {completedSteps.has(i) ? '✅' : '⬜'} {ss.label}
                  </div>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="280px" />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
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
