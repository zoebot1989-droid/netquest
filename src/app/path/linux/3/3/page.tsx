'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Hard Links vs Symbolic Links",
    content: "A link is a reference to a file. Linux has two types:\n\n🔗 Hard link (ln file link) — Another name for the SAME data on disk. Delete the original? The hard link still works! They share the same inode.\n\n🔗 Symbolic link (ln -s file link) — A shortcut that POINTS to the file path. Delete the original? The symlink breaks! Like a Windows shortcut.\n\nMost of the time you'll use symbolic links (symlinks). They can cross filesystems and link to directories.",
  },
  {
    title: "Mount Points",
    content: "In Linux, you don't have drive letters (C:, D:). Instead, you MOUNT devices to directories.\n\n• mount — see what's mounted where\n• df -h — see disk usage per mount point\n• /etc/fstab — defines automatic mounts at boot\n\nExamples:\n• /dev/sda1 mounted on / (root filesystem)\n• /dev/sdb1 mounted on /home (user data on separate disk)\n• USB drive mounted on /media/usb\n\nThis means your entire system is ONE tree, even with multiple disks!",
  },
];

const quizQuestions = [
  { q: "What happens if you delete the original file of a symbolic link?", options: ['Nothing — the link still works', 'The link breaks (dangling symlink)', 'Both are deleted', 'The link becomes a hard link'], correct: 1 },
  { q: "Which command creates a symbolic link?", options: ['ln file link', 'ln -s target link', 'link -s file', 'symlink file link'], correct: 1 },
  { q: "What does df -h show?", options: ['Directory files', 'Disk free space per mount point', 'Device firmware', 'Downloaded files'], correct: 1 },
  { q: "What file defines automatic mounts at boot?", options: ['/etc/mount', '/etc/fstab', '/etc/disks', '/boot/mounts'], correct: 1 },
];

export default function LinksAndMounts() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed.startsWith('ln -s')) newCompleted.add('symlink');
    if (trimmed.startsWith('ln ') && !trimmed.includes('-s')) newCompleted.add('hardlink');
    if (trimmed === 'df -h' || trimmed === 'df') newCompleted.add('df');
    if (trimmed === 'mount') newCompleted.add('mount');
    if (trimmed.includes('cat') && trimmed.includes('fstab')) newCompleted.add('fstab');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 4) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-3-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Links & mounts conquered! 🔗" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Links & Mounts" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try It Out →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Links & Mounts Challenge</h2>
              <p className="text-sm text-gray-400">Try at least 4 of these:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['ln -s target link', 'symlink'], ['ln file link', 'hardlink'], ['df -h', 'df'], ['mount', 'mount'], ['cat /etc/fstab', 'fstab']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
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
