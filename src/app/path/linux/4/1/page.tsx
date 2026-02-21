'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Package Managers",
    content: "A package manager installs, updates, and removes software. Like an app store, but for the command line.\n\nDifferent distro families use different package managers:\n\n🟠 Debian/Ubuntu → apt (and dpkg under the hood)\n🔵 Fedora/RHEL → dnf (formerly yum)\n⚪ Arch → pacman\n\nThey all do the same thing — just different syntax!",
  },
  {
    title: "Common Operations",
    content: "Install:\n  apt install nginx\n  dnf install nginx\n  pacman -S nginx\n\nRemove:\n  apt remove nginx\n  dnf remove nginx\n  pacman -R nginx\n\nUpdate everything:\n  apt update && apt upgrade\n  dnf upgrade\n  pacman -Syu\n\nSearch:\n  apt search nginx\n  dnf search nginx\n  pacman -Ss nginx\n\nRepositories = online servers with thousands of packages. The package manager downloads from these.",
  },
];

const quizQuestions = [
  { q: "Which package manager does Ubuntu use?", options: ['pacman', 'yum', 'apt', 'brew'], correct: 2 },
  { q: "What does 'apt update' do?", options: ['Updates all packages', 'Refreshes the package list from repos', 'Updates the kernel', 'Updates apt itself'], correct: 1 },
  { q: "What does pacman -S nginx do?", options: ['Searches for nginx', 'Syncs repositories', 'Installs nginx', 'Shows nginx status'], correct: 2 },
  { q: "What manages dependencies automatically?", options: ['The user', 'The package manager', 'The kernel', 'systemd'], correct: 1 },
];

export default function PackageManagement() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed.includes('apt update')) newCompleted.add('update');
    if (trimmed.includes('apt install')) newCompleted.add('install');
    if (trimmed.includes('apt remove')) newCompleted.add('remove');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-4-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Package manager pro! 📦" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Package Management" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <div className="card border-cyan-800/30">
              <h3 className="text-sm font-semibold mb-2">Quick Comparison</h3>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                <div className="text-gray-500">Action</div>
                <div style={{ color: '#ff9500' }}>apt</div>
                <div style={{ color: '#00f0ff' }}>dnf</div>
                <div style={{ color: '#39ff14' }}>pacman</div>
                <div className="text-gray-400">Install</div><div>install</div><div>install</div><div>-S</div>
                <div className="text-gray-400">Remove</div><div>remove</div><div>remove</div><div>-R</div>
                <div className="text-gray-400">Update</div><div>upgrade</div><div>upgrade</div><div>-Syu</div>
                <div className="text-gray-400">Search</div><div>search</div><div>search</div><div>-Ss</div>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try It Out →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Package Manager Challenge</h2>
              <p className="text-sm text-gray-400">Install, update, and remove a package:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['apt update', 'update'], ['apt install <pkg>', 'install'], ['apt remove <pkg>', 'remove']].map(([label, key]) => (
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
