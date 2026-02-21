'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What Are Package Managers?",
    content: "Package managers install, update, and remove software — like an app store for the terminal.\n\nLinux:\n  apt (Ubuntu/Debian)\n  yum/dnf (Red Hat/Fedora)\n  pacman (Arch)\n\nmacOS:\n  brew (Homebrew)\n\nThey handle dependencies automatically — install one thing, and it grabs everything it needs.",
  },
  {
    title: "Common Commands",
    content: "Update package list (check for new versions):\n  apt update\n\nInstall a package:\n  apt install nginx\n  apt install python3\n\nRemove a package:\n  apt remove nginx\n\nUpgrade all packages:\n  apt upgrade\n\n🔑 Most apt commands need 'sudo' (admin permissions) on a real system.",
  },
];

export default function PackageManagers() {
  const [step, setStep] = useState(0);
  const [installed, setInstalled] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What does 'apt update' do?", options: ['Installs updates', 'Refreshes the list of available packages', 'Removes old packages', 'Restarts the system'], correct: 1 },
    { q: "Which package manager is used on macOS?", options: ['apt', 'yum', 'brew', 'pacman'], correct: 2 },
    { q: "How do you install nginx on Ubuntu?", options: ['download nginx', 'apt install nginx', 'brew install nginx', 'install nginx'], correct: 1 },
  ];

  const handleCommand = (cmd: string) => {
    if (cmd.includes('apt install')) setInstalled(true);
    if (cmd.includes('apt update')) setUpdated(true);
  };

  const canAdvance = installed && updated;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-4-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You can install anything!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Package Managers" pathId="terminal" />
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
                <p className="text-xs text-gray-400 mb-2">📦 Package Manager Comparison</p>
                <div className="font-mono text-xs space-y-1">
                  <div className="flex justify-between"><span>Ubuntu/Debian</span><span style={{ color: '#39ff14' }}>apt</span></div>
                  <div className="flex justify-between"><span>Red Hat/Fedora</span><span style={{ color: '#39ff14' }}>yum / dnf</span></div>
                  <div className="flex justify-between"><span>Arch Linux</span><span style={{ color: '#39ff14' }}>pacman</span></div>
                  <div className="flex justify-between"><span>macOS</span><span style={{ color: '#39ff14' }}>brew</span></div>
                  <div className="flex justify-between"><span>Alpine</span><span style={{ color: '#39ff14' }}>apk</span></div>
                </div>
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Install a Package</h2>
              <p className="text-sm text-gray-400">Update the package list, then install something!</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${updated ? 'text-green-400' : 'text-gray-500'}`}>{updated ? '✅' : '⬜'} Run apt update</div>
                <div className={`text-xs ${installed ? 'text-green-400' : 'text-gray-500'}`}>{installed ? '✅' : '⬜'} Install a package (e.g. apt install htop)</div>
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
