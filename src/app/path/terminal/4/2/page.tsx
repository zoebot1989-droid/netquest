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
    title: "What Are Processes?",
    content: "Every running program is a PROCESS with a PID (Process ID).\n\nps — List running processes\n  ps           → your processes\n  ps aux       → ALL processes\n\ntop — Live process monitor\n  Shows CPU/memory usage in real-time\n  Press q to exit",
  },
  {
    title: "Managing Processes",
    content: "kill — Stop a process by PID\n  kill 1234           → politely ask to stop\n  kill -9 1234        → force kill NOW\n\nKeyboard shortcuts:\n  Ctrl+C  → stop current command\n  Ctrl+Z  → pause current command\n  &       → run in background\n    sleep 100 &\n  bg/fg   → background/foreground a paused process",
  },
];

export default function Processes() {
  const [step, setStep] = useState(0);
  const [usedPs, setUsedPs] = useState(false);
  const [killedMiner, setKilledMiner] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What command lists all running processes?", options: ['list', 'ps', 'show', 'proc'], correct: 1 },
    { q: "How do you force-kill a process with PID 1337?", options: ['stop 1337', 'kill -9 1337', 'rm 1337', 'end 1337'], correct: 1 },
    { q: "What does Ctrl+C do?", options: ['Copy text', 'Stop the current running command', 'Clear the screen', 'Close the terminal'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    if (cmd.includes('ps') || cmd.includes('top')) setUsedPs(true);
    if (cmd.includes('kill') && cmd.includes('1337')) {
      setKilledMiner(true);
    }
  }, []);

  const canAdvance = usedPs && killedMiner;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-4-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Process manager unlocked!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Processes" pathId="terminal" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff3b30' }}>🚨 Rogue Process Detected!</h2>
              <p className="text-sm text-gray-400">Someone installed a crypto-miner on the server! It&apos;s using 98.5% CPU. Find it and kill it!</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${usedPs ? 'text-green-400' : 'text-gray-500'}`}>{usedPs ? '✅' : '⬜'} Check running processes (ps or top)</div>
                <div className={`text-xs ${killedMiner ? 'text-green-400' : 'text-gray-500'}`}>{killedMiner ? '✅' : '⬜'} Kill the crypto-miner (kill PID)</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Hint: Run <code className="text-[#39ff14]">ps</code> to find the rogue process, then <code className="text-[#39ff14]">kill &lt;PID&gt;</code></p>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />

            {canAdvance && (
              <button onClick={() => setStep(3)} className="btn-primary w-full">
                🎉 Crypto-miner terminated! Continue →
              </button>
            )}
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
