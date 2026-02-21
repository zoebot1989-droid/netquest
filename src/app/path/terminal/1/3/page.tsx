'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const lessons = [
  {
    title: "The File System Tree",
    content: "Linux organizes everything in a tree starting from / (root). Key directories:\n\n/home/user — Your personal files\n/etc — System configuration\n/var — Logs, websites, variable data\n/tmp — Temporary files\n/usr/bin — Programs\n/bin — Essential commands",
  },
  {
    title: "Absolute vs Relative Paths",
    content: "Absolute path: starts from root (/)\n  /home/user/Desktop/file.txt\n\nRelative path: starts from where you ARE\n  Desktop/file.txt  (if you're in /home/user)\n\nSpecial shortcuts:\n  .  = current directory\n  .. = parent directory (go up)\n  ~  = home directory (/home/user)",
  },
];

export default function NavigatingFS() {
  const [step, setStep] = useState(0);
  const [dirsVisited, setDirsVisited] = useState<Set<string>>(new Set(['/home/user']));
  const [reachedTarget, setReachedTarget] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const target = '/var/log';

  const quizQuestions = [
    { q: "What does '..' mean in a path?", options: ['Current directory', 'Home directory', 'Parent directory (one level up)', 'Root directory'], correct: 2 },
    { q: "What is the absolute path to the user's Desktop?", options: ['Desktop', '~/Desktop', '/home/user/Desktop', './Desktop'], correct: 2 },
    { q: "If you're in /home/user and type 'cd ..', where do you end up?", options: ['/home', '/home/user', '/', '/root'], correct: 0 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const newDirs = new Set(dirsVisited);
    newDirs.add(state.cwd);
    setDirsVisited(newDirs);

    if (newDirs.size >= 5) {
      addAchievement('navigator');
    }

    if (state.cwd === target) {
      setReachedTarget(true);
      setTimeout(() => setStep(3), 1000);
    }
  }, [dirsVisited]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-1-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="You can navigate like a pro!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Navigating the File System" pathId="terminal" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">📁 File System Tree:</p>
                <pre className="font-mono text-xs text-gray-300">{`/
├── home/
│   └── user/
│       ├── Desktop/
│       ├── Documents/
│       └── Downloads/
├── etc/
├── var/
│   └── log/
├── tmp/
└── usr/
    └── bin/`}</pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Navigate to {target}</h2>
              <p className="text-sm text-gray-400">Use <code className="text-[#39ff14]">cd</code> to navigate from your home directory to <code className="text-[#00f0ff]">{target}</code></p>
              <p className="text-xs text-gray-500 mt-2">Hint: Use <code>cd /var/log</code> (absolute) or <code>cd ../../var/log</code> (relative)</p>
              <p className="text-xs text-gray-500 mt-1">Use <code>ls</code> to see what&apos;s in each directory and <code>pwd</code> to check where you are.</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-sm ${reachedTarget ? 'text-green-400' : 'text-gray-500'}`}>
                  {reachedTarget ? '✅ Reached target!' : `📍 Directories visited: ${dirsVisited.size}`}
                </span>
              </div>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-green-800/30">
              <p className="text-sm" style={{ color: '#39ff14' }}>✅ You navigated to {target}!</p>
            </div>
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
