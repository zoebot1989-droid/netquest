'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Server Hardening",
    content: "Hardening = reducing attack surface on a server:\n\n🔑 SSH Key Authentication — Disable password login, use key pairs\n🚫 Disable Root Login — Force sudo, disable direct root SSH\n🛡️ fail2ban — Auto-ban IPs after failed login attempts\n📦 Unattended Upgrades — Auto-install security patches\n👤 Principle of Least Privilege — Only give minimum required permissions\n📋 CIS Benchmarks — Industry-standard security checklists",
  },
  {
    title: "Hardening Steps",
    content: "Essential hardening checklist:\n\n1. Update system: apt update && apt upgrade\n2. Configure SSH:\n   • Edit /etc/ssh/sshd_config\n   • PermitRootLogin no\n   • PasswordAuthentication no\n   • Port 2222 (change from default)\n3. Install fail2ban:\n   • apt install fail2ban\n   • fail2ban-client status sshd\n4. Set up firewall (iptables/ufw)\n5. Remove unnecessary services\n6. Set up automatic updates\n7. Configure log monitoring",
  },
];

export default function ServerHardening() {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "Why disable root login via SSH?", options: ['Root is too slow', 'Attackers know root exists, so it\'s a target for brute force', 'Root can\'t use SSH', 'It speeds up the server'], correct: 1 },
    { q: "fail2ban works by...", options: ['Encrypting passwords', 'Banning IPs after too many failed login attempts', 'Blocking all SSH traffic', 'Installing a VPN'], correct: 1 },
    { q: "Principle of Least Privilege means...", options: ['Giving everyone admin access', 'Only giving minimum required permissions', 'Using the least expensive server', 'Having fewer users'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const newCompleted = new Set(completedSteps);
    if (cmd.includes('apt') && cmd.includes('update')) newCompleted.add('update');
    if (cmd.includes('apt') && cmd.includes('install') && cmd.includes('fail2ban')) newCompleted.add('fail2ban');
    if (cmd.includes('fail2ban-client')) newCompleted.add('f2b-status');
    if (cmd.includes('systemctl') && (cmd.includes('sshd') || cmd.includes('ssh'))) newCompleted.add('ssh');
    if (cmd.includes('iptables') || cmd.includes('ufw')) newCompleted.add('firewall');
    setCompletedSteps(newCompleted);
    if (newCompleted.size >= 4) setTimeout(() => setStep(3), 500);
  }, [completedSteps]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-5-2', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Server hardened and secure! 🏰" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Server Hardening" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Harden the Server →'}</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="harden" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🏰 Harden This Server</h2>
              <p className="text-sm text-gray-400">Complete at least 4 hardening steps:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['update', 'apt update'], ['fail2ban', 'Install fail2ban'], ['f2b-status', 'Check f2b status'], ['ssh', 'Check SSH'], ['firewall', 'Firewall']].map(([key, label]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedSteps.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedSteps.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" prompt="root@server:~#" />
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
