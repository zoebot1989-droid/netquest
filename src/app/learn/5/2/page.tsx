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
    title: "What is a Firewall?",
    content: "A firewall controls what network traffic is allowed in and out of your system. Think of it as a bouncer at a club — it checks every packet and decides: ALLOW or DENY.\n\nFirewalls work with rules organized in chains:\n• INPUT — Traffic coming INTO your machine\n• OUTPUT — Traffic leaving your machine\n• FORWARD — Traffic passing THROUGH (router mode)\n\nEach rule checks: source IP, destination IP, port, protocol, and then takes an action (ACCEPT, DROP, or REJECT).",
  },
  {
    title: "iptables Basics",
    content: "iptables is the classic Linux firewall tool. Basic syntax:\n\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n↑ Append to INPUT chain, TCP protocol, port 22, ACCEPT it\n\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\n↑ Allow HTTP traffic on port 80\n\niptables -A INPUT -j DROP\n↑ Drop everything else (default deny)\n\nCommon flags:\n-A = Append rule  |  -p = Protocol (tcp/udp)\n--dport = Destination port  |  -j = Jump to action\n-s = Source IP  |  -d = Destination IP",
  },
];

const quizQuestions = [
  { q: "What does a firewall do?", options: ['Speeds up the network', 'Controls which traffic is allowed or blocked', 'Encrypts all data', 'Assigns IP addresses'], correct: 1 },
  { q: "In iptables, what does -j DROP do?", options: ['Logs the packet', 'Silently discards the packet', 'Sends it to another chain', 'Accepts the packet'], correct: 1 },
  { q: "Which chain handles incoming traffic?", options: ['OUTPUT', 'FORWARD', 'INPUT', 'PREROUTING'], correct: 2 },
  { q: "What flag specifies the destination port?", options: ['--sport', '--dport', '-p', '-s'], correct: 1 },
];

export default function FirewallRules() {
  const [step, setStep] = useState(0);
  const [rulesWritten, setRulesWritten] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, output: string[], _state: TerminalState) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed.startsWith('iptables')) {
      const newRules = new Set(rulesWritten);
      if (trimmed.includes('--dport 22') && trimmed.includes('accept')) newRules.add('ssh');
      if (trimmed.includes('--dport 80') && trimmed.includes('accept')) newRules.add('http');
      if (trimmed.includes('--dport 443') && trimmed.includes('accept')) newRules.add('https');
      if (trimmed.includes('-j drop') && !trimmed.includes('--dport')) newRules.add('drop');
      if (trimmed.includes('-l') || trimmed.includes('--list')) newRules.add('list');
      setRulesWritten(newRules);
      if (newRules.has('ssh') && newRules.has('http') && newRules.has('https')) {
        setTimeout(() => setStep(3), 1000);
      }
    }
  }, [rulesWritten]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-5-2', 75);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={75} message="Firewall rules — locked down!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Firewall Rules" pathId="networking" />
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
              {step < 1 ? 'Next →' : 'Write Firewall Rules →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="fw" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🛡️ Secure the Server</h3>
              <p className="text-sm text-gray-400 mb-3">Write iptables rules to allow SSH (22), HTTP (80), and HTTPS (443):</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                {[{ k: 'ssh', l: 'Port 22 (SSH)' }, { k: 'http', l: 'Port 80 (HTTP)' }, { k: 'https', l: 'Port 443 (HTTPS)' }].map(({ k, l }) => (
                  <span key={k} className={`text-xs px-2 py-1 rounded font-mono ${rulesWritten.has(k) ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                    {rulesWritten.has(k) ? '✅' : '❓'} {l}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-2">Hint: <code className="text-cyan-400">iptables -A INPUT -p tcp --dport 22 -j ACCEPT</code></p>
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
