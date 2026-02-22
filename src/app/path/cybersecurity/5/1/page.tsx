'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Firewalls & IDS/IPS",
    content: "🧱 Firewall — Controls incoming/outgoing traffic based on rules.\n\nTypes:\n• Packet Filter — Checks IP, port, protocol. Fast but basic.\n• Stateful — Tracks connection state. Smarter.\n• Application Layer — Inspects packet content. Deep but slower.\n\niptables rule structure:\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n  -A INPUT → append to INPUT chain\n  -p tcp → protocol TCP\n  --dport 22 → destination port 22\n  -j ACCEPT → allow the packet",
  },
  {
    title: "IDS vs IPS",
    content: "🔍 IDS (Intrusion Detection System) — Monitors and ALERTS on suspicious traffic. Passive.\n  Like a security camera — it watches and records.\n\n🛡️ IPS (Intrusion Prevention System) — Monitors and BLOCKS suspicious traffic. Active.\n  Like a security guard — it watches and acts.\n\nPopular tools:\n• Snort — Open-source IDS/IPS. Rule-based detection.\n• Suricata — Multi-threaded, faster than Snort.\n• OSSEC — Host-based IDS (monitors files, logs).\n\nIDS + Firewall = defense in depth. Multiple layers of protection.",
  },
];

export default function FirewallsIDS() {
  const [step, setStep] = useState(0);
  const [completedRules, setCompletedRules] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "The difference between IDS and IPS is...", options: ['IDS is newer', 'IDS detects, IPS also prevents/blocks', 'IPS is only software', 'They are the same thing'], correct: 1 },
    { q: "iptables -A INPUT -p tcp --dport 80 -j DROP does what?", options: ['Allows port 80', 'Blocks all incoming TCP traffic on port 80', 'Drops all outgoing traffic', 'Enables the firewall'], correct: 1 },
    { q: "Defense in depth means...", options: ['Having one very strong firewall', 'Multiple layers of security', 'Encrypting everything', 'Using the deepest encryption'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const newCompleted = new Set(completedRules);
    if (cmd.includes('iptables') && cmd.includes('22') && cmd.includes('ACCEPT')) newCompleted.add('ssh');
    if (cmd.includes('iptables') && cmd.includes('80') && cmd.includes('ACCEPT')) newCompleted.add('http');
    if (cmd.includes('iptables') && cmd.includes('443') && cmd.includes('ACCEPT')) newCompleted.add('https');
    if (cmd.includes('iptables') && cmd.includes('DROP')) newCompleted.add('drop');
    setCompletedRules(newCompleted);
    if (newCompleted.size >= 3) {
      addAchievement('firewall-master');
      setTimeout(() => setStep(3), 500);
    }
  }, [completedRules]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-5-1', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Firewall defense established! 🧱" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Firewalls & IDS/IPS" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Write Firewall Rules →'}</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="firewall" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🧱 Defend the Server!</h2>
              <p className="text-sm text-gray-400">Write iptables rules to: allow SSH (22), HTTP (80), HTTPS (443), and drop everything else.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['ssh', 'Allow SSH (22)'], ['http', 'Allow HTTP (80)'], ['https', 'Allow HTTPS (443)'], ['drop', 'Default DROP']].map(([key, label]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedRules.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedRules.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Example: iptables -A INPUT -p tcp --dport 22 -j ACCEPT</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
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
