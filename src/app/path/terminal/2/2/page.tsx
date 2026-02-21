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
    title: "Copy Files",
    content: "cp — Copy a file or directory\n  cp file.txt backup.txt        → copy file\n  cp file.txt Documents/         → copy into folder\n  cp -r folder/ backup_folder/   → copy entire directory",
  },
  {
    title: "Move & Rename",
    content: "mv — Move or Rename (same command!)\n  mv file.txt Documents/     → move to folder\n  mv old.txt new.txt         → rename file\n  mv folder/ new_name/       → rename folder\n\nThe trick: 'renaming' is just 'moving' to a new name in the same location!",
  },
];

export default function CopyMoveRename() {
  const [step, setStep] = useState(0);
  const [tasks, setTasks] = useState({ cp: false, mv: false, rename: false });
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "How do you copy file.txt to a folder called backup/?", options: ['mv file.txt backup/', 'cp file.txt backup/', 'copy file.txt backup/', 'dup file.txt backup/'], correct: 1 },
    { q: "How do you rename old.txt to new.txt?", options: ['rename old.txt new.txt', 'cp old.txt new.txt', 'mv old.txt new.txt', 'rn old.txt new.txt'], correct: 2 },
    { q: "What flag lets you copy an entire directory?", options: ['cp -f', 'cp -a', 'cp -r', 'cp -d'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const base = cmd.trim().split(/\s+/)[0];
    const newTasks = { ...tasks };
    if (base === 'cp') newTasks.cp = true;
    if (base === 'mv') {
      // Check if it looks like a rename (same directory)
      const parts = cmd.trim().split(/\s+/);
      if (parts.length >= 3 && !parts[2].includes('/')) {
        newTasks.rename = true;
      }
      newTasks.mv = true;
    }
    setTasks(newTasks);

    if (Object.values(newTasks).filter(Boolean).length >= 2) {
      addAchievement('file-master');
      setTimeout(() => setStep(3), 800);
    }
  }, [tasks]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-2-2', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="File organization master!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Copy, Move, Rename" pathId="terminal" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Organize Your Files</h2>
              <p className="text-sm text-gray-400">Practice copying and moving files. Complete 2 tasks:</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${tasks.cp ? 'text-green-400' : 'text-gray-500'}`}>{tasks.cp ? '✅' : '⬜'} Copy a file with cp</div>
                <div className={`text-xs ${tasks.mv ? 'text-green-400' : 'text-gray-500'}`}>{tasks.mv ? '✅' : '⬜'} Move a file with mv</div>
                <div className={`text-xs ${tasks.rename ? 'text-green-400' : 'text-gray-500'}`}>{tasks.rename ? '✅' : '⬜'} Rename a file with mv (bonus)</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: <code className="text-[#39ff14]">cd Desktop</code> → <code className="text-[#39ff14]">cp notes.txt notes_backup.txt</code> → <code className="text-[#39ff14]">mv notes_backup.txt Documents/</code></p>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />
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
