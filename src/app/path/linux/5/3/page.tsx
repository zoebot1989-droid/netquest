'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Disk & Storage Management",
    content: "Running out of disk space is one of the most common server problems. These commands help you find and fix it:\n\n• df -h — show disk usage per partition (how full are your disks?)\n• du -h — show directory sizes (what's eating space?)\n• du -sh * — show size of each item in current directory\n• lsblk — list all block devices (disks and partitions)\n• free -h — show memory (RAM) and swap usage",
  },
  {
    title: "Understanding the Output",
    content: "df -h output:\n  /dev/sda1  50G  12G  35G  26% /\n  ↑ device   ↑size ↑used ↑free ↑%  ↑mount\n\nIf any partition hits 100%, bad things happen! Services crash, logs can't write, databases fail.\n\nlsblk shows:\n  sda — a physical disk\n  ├─sda1 — first partition (probably /)\n  └─sda2 — second partition (maybe swap)\n\nswap = overflow space on disk when RAM is full. Slower than RAM but prevents out-of-memory crashes.",
  },
];

const quizQuestions = [
  { q: "What does 'df -h' show?", options: ['Directory files', 'Disk free space per mount point', 'Downloaded files', 'Device firmware'], correct: 1 },
  { q: "What command shows how much space each directory uses?", options: ['df', 'ls -s', 'du', 'free'], correct: 2 },
  { q: "What is swap space?", options: ['Extra CPU power', 'Disk space used as overflow RAM', 'A type of filesystem', 'Network storage'], correct: 1 },
  { q: "What command lists all block devices?", options: ['lsdev', 'blkid', 'lsblk', 'fdisk -l'], correct: 2 },
];

export default function DiskStorage() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed.startsWith('df')) newCompleted.add('df');
    if (trimmed.startsWith('du')) newCompleted.add('du');
    if (trimmed === 'lsblk') newCompleted.add('lsblk');
    if (trimmed.startsWith('free')) newCompleted.add('free');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-5-3', 70);
        addAchievement('disk-doctor');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="Disk Doctor! 💾" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Disk & Storage" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Analyze Disk Usage →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Disk Investigation</h2>
              <p className="text-sm text-gray-400">Analyze this server&apos;s disk and memory. Use at least 3 commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['df -h', 'df'], ['du -h', 'du'], ['lsblk', 'lsblk'], ['free -h', 'free']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
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
