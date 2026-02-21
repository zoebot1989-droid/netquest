'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const commandsToLearn = [
  { cmd: 'pwd', desc: 'Print Working Directory — shows where you are', example: '/home/user' },
  { cmd: 'ls', desc: 'List — shows files and folders in current directory', example: 'Desktop  Documents  Downloads' },
  { cmd: 'cd Desktop', desc: 'Change Directory — move into a folder', example: '(moves you into Desktop)' },
  { cmd: 'echo "Hello!"', desc: 'Echo — prints text to the screen', example: 'Hello!' },
  { cmd: 'whoami', desc: 'Who Am I — shows your username', example: 'user' },
  { cmd: 'clear', desc: 'Clear — cleans up the terminal screen', example: '(screen is cleared)' },
];

export default function FirstCommands() {
  const [step, setStep] = useState(0); // 0 = lesson, 1 = challenge, 2 = quiz
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "Which command shows your current directory?", options: ['ls', 'pwd', 'cd', 'whoami'], correct: 1 },
    { q: "Which command lists files in the current folder?", options: ['pwd', 'echo', 'ls', 'clear'], correct: 2 },
    { q: "How do you move into a folder called 'projects'?", options: ['ls projects', 'pwd projects', 'mv projects', 'cd projects'], correct: 3 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const base = cmd.trim().split(/\s+/)[0].toLowerCase();
    const newCompleted = new Set(completedCmds);
    
    if (base === 'pwd') newCompleted.add('pwd');
    if (base === 'ls') newCompleted.add('ls');
    if (base === 'cd') newCompleted.add('cd');
    if (base === 'echo') newCompleted.add('echo');
    if (base === 'whoami') newCompleted.add('whoami');
    if (base === 'clear') newCompleted.add('clear');
    
    setCompletedCmds(newCompleted);

    if (newCompleted.size >= 5) {
      setTimeout(() => setStep(2), 500);
    }
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-1-2', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You know your first commands!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Your First Commands" pathId="terminal" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-3">📖 Essential Commands</h2>
              <p className="text-sm text-gray-400 mb-3">These are the commands you&apos;ll use every single day. Memorize them!</p>
              <div className="space-y-3">
                {commandsToLearn.map(c => (
                  <div key={c.cmd} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="font-mono text-sm" style={{ color: '#39ff14' }}>{c.cmd}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.desc}</div>
                    <div className="text-xs font-mono text-gray-500 mt-1">→ {c.example}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try Them Out →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Try Each Command</h2>
              <p className="text-sm text-gray-400">Type each command to see what it does. Use at least 5 of the 6 commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['pwd', 'ls', 'cd', 'echo', 'whoami', 'clear'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{completedCmds.size}/5 commands used</p>
            </div>

            <InlineTerminal onCommand={handleCommand} height="200px" />
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
