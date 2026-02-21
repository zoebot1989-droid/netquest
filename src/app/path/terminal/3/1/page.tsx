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
    title: "grep — Search Inside Files",
    content: "grep searches for text INSIDE files:\n  grep \"error\" log.txt     → find lines with 'error'\n  grep -i \"error\" log.txt  → case-insensitive\n  grep \"404\" *.log         → search multiple files\n\ngrep stands for: Global Regular Expression Print\nIt's one of the most used commands EVER.",
  },
  {
    title: "find — Search for Files",
    content: "find searches for files by name/type:\n  find . -name \"*.txt\"     → find all .txt files\n  find /var -name \"*.log\"  → find log files in /var\n  find . -type d           → find directories only\n  find . -type f           → find files only\n\nwhich — Find where a program lives:\n  which python3            → /usr/bin/python3\n  which node               → /usr/bin/node",
  },
];

export default function FindSearch() {
  const [step, setStep] = useState(0);
  const [foundPassword, setFoundPassword] = useState(false);
  const [usedGrep, setUsedGrep] = useState(false);
  const [usedFind, setUsedFind] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "How do you search for the word 'error' in a file called log.txt?", options: ['find error log.txt', 'search error log.txt', 'grep error log.txt', 'look error log.txt'], correct: 2 },
    { q: "How do you find all .txt files in the current directory tree?", options: ['grep .txt', 'find . -name \"*.txt\"', 'ls *.txt', 'search *.txt'], correct: 1 },
    { q: "What does the 'which' command do?", options: ['Shows which user is logged in', 'Shows where a program is installed', 'Shows which files were recently modified', 'Shows which ports are open'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const base = cmd.trim().split(/\s+/)[0];
    if (base === 'grep') setUsedGrep(true);
    if (base === 'find' || base === 'which') setUsedFind(true);
    
    // Check if they found the password in passwords.txt
    if (output.some(l => l.includes('supersecret') || l.includes('hunter2'))) {
      setFoundPassword(true);
    }
  }, []);

  const canAdvance = usedGrep && foundPassword;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-3-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="You can find anything!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Find & Search" pathId="terminal" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🔍 Find the Hidden Password</h2>
              <p className="text-sm text-gray-400">Somewhere in ~/Documents there&apos;s a file with passwords. Use grep to find the admin password!</p>
              <p className="text-xs text-gray-500 mt-2">Hint: Try <code className="text-[#39ff14]">grep admin ~/Documents/passwords.txt</code> or <code className="text-[#39ff14]">cat ~/Documents/passwords.txt</code></p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${usedGrep ? 'text-green-400' : 'text-gray-500'}`}>{usedGrep ? '✅' : '⬜'} Use grep</div>
                <div className={`text-xs ${usedFind ? 'text-green-400' : 'text-gray-500'}`}>{usedFind ? '✅' : '⬜'} Use find or which (bonus)</div>
                <div className={`text-xs ${foundPassword ? 'text-green-400' : 'text-gray-500'}`}>{foundPassword ? '✅' : '⬜'} Find the admin password</div>
              </div>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />

            {canAdvance && (
              <button onClick={() => setStep(3)} className="btn-primary w-full">Continue to Quiz →</button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-green-800/30">
              <p className="text-sm" style={{ color: '#39ff14' }}>🔓 Password found: supersecret123</p>
            </div>
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
