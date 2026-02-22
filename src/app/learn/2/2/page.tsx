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
    title: "What is Port Scanning?",
    content: "Port scanning is the process of probing a server to discover which ports are open and what services are running. It's one of the first steps in network reconnaissance.\n\nThink of it like checking which doors in a building are unlocked. Each open port is a potential entry point — or a service you need to reach.",
  },
  {
    title: "Meet Nmap",
    content: "Nmap (Network Mapper) is the most popular port scanning tool. It's free, open-source, and used by security professionals worldwide.\n\nBasic usage:\n• nmap <target> — Scan common ports\n• nmap -p 80,443 <target> — Scan specific ports\n• nmap -p- <target> — Scan ALL 65,535 ports\n\nNmap tells you: port number, state (open/closed/filtered), and the service running on it.",
  },
];

interface Target {
  name: string;
  ip: string;
  requiredFindings: string[];
}

const targets: Target[] = [
  { name: 'Web Server', ip: '10.0.0.5', requiredFindings: ['80', '443', '22'] },
];

const quizQuestions = [
  { q: "What does Nmap stand for?", options: ['Network Manager', 'Network Mapper', 'Net Monitor and Protocol', 'Node Map'], correct: 1 },
  { q: "What does an 'open' port mean?", options: ['The firewall is disabled', 'A service is listening and accepting connections', 'The port is broken', 'No password is required'], correct: 1 },
  { q: "Which nmap flag scans ALL 65,535 ports?", options: ['-a', '-p-', '--all', '-full'], correct: 1 },
  { q: "Port 443 typically runs which service?", options: ['SSH', 'FTP', 'HTTPS', 'DNS'], correct: 2 },
];

export default function PortScanner() {
  const [step, setStep] = useState(0);
  const [scannedPorts, setScannedPorts] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, output: string[], _state: TerminalState) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed.startsWith('nmap')) {
      const newPorts = new Set(scannedPorts);
      const outStr = output.join(' ');
      if (outStr.includes('80/tcp')) newPorts.add('80');
      if (outStr.includes('443/tcp')) newPorts.add('443');
      if (outStr.includes('22/tcp')) newPorts.add('22');
      setScannedPorts(newPorts);
      if (newPorts.size >= 3) {
        setTimeout(() => setStep(3), 1000);
      }
    }
  }, [scannedPorts]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-2-2', 75);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={75} message="You've scanned your first target!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Port Scanner" pathId="networking" />
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
              {step < 1 ? 'Next →' : 'Start Scanning →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="scan" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🎯 Mission: Scan the Web Server</h3>
              <p className="text-sm text-gray-400 mb-1">Target: <span className="font-mono" style={{ color: '#39ff14' }}>10.0.0.5</span></p>
              <p className="text-sm text-gray-400 mb-3">Use <code className="text-cyan-400">nmap</code> to discover open ports. Find all 3 services!</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                {['22 (SSH)', '80 (HTTP)', '443 (HTTPS)'].map((p) => {
                  const port = p.split(' ')[0];
                  return (
                    <span key={port} className={`text-xs px-2 py-1 rounded font-mono ${scannedPorts.has(port) ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                      {scannedPorts.has(port) ? '✅' : '❓'} Port {p}
                    </span>
                  );
                })}
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
