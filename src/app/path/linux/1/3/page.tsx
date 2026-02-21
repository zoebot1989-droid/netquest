'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "The Linux Desktop",
    content: "Linux doesn't have ONE desktop — it has MANY. A Desktop Environment (DE) is the graphical layer that sits on top of the kernel. It provides the windows, taskbar, file manager, and settings you interact with.\n\nThis is different from Windows/Mac, where you're stuck with their one desktop. On Linux, you choose!",
  },
  {
    title: "Popular Desktop Environments",
    content: "🟦 GNOME — Modern, clean, Mac-like. Default on Ubuntu & Fedora. Uses Activities overview.\n\n🟩 KDE Plasma — Feature-rich, Windows-like. Highly customizable. Great for power users.\n\n🟨 XFCE — Lightweight, fast, no bloat. Perfect for older hardware or minimal setups.\n\n🟧 Cinnamon — Traditional desktop by Linux Mint. Familiar for Windows users.\n\n🟪 i3/Sway — Tiling window managers. Keyboard-driven, no mouse needed. For terminal junkies.",
  },
  {
    title: "How It All Fits Together",
    content: "The stack looks like this:\n\n🖥️ Desktop Environment (GNOME, KDE...)\n⬇️ Display Server (X11 or Wayland)\n⬇️ Linux Kernel\n⬇️ Hardware\n\nThe kernel manages hardware. The display server handles drawing to the screen. The DE provides the user experience on top.\n\nYou can even run Linux without ANY desktop — just a terminal! That's how most servers work.",
  },
];

const deFeatures = [
  { feature: 'Best for beginners', de: 'GNOME', options: ['GNOME', 'i3', 'XFCE'] },
  { feature: 'Most customizable', de: 'KDE Plasma', options: ['GNOME', 'KDE Plasma', 'XFCE'] },
  { feature: 'Best for old/slow hardware', de: 'XFCE', options: ['KDE Plasma', 'GNOME', 'XFCE'] },
  { feature: 'Keyboard-only, no mouse', de: 'i3/Sway', options: ['Cinnamon', 'GNOME', 'i3/Sway'] },
  { feature: 'Most like Windows', de: 'KDE Plasma', options: ['GNOME', 'KDE Plasma', 'i3/Sway'] },
];

const quizQuestions = [
  { q: "What sits between the kernel and the desktop environment?", options: ['The shell', 'The display server (X11/Wayland)', 'The bootloader', 'The package manager'], correct: 1 },
  { q: "Which DE is the default on Ubuntu?", options: ['KDE Plasma', 'XFCE', 'GNOME', 'Cinnamon'], correct: 2 },
  { q: "Can Linux run without a desktop environment?", options: ['No, it always needs one', 'Yes — most servers run without one', 'Only with special hardware', 'Only Arch can do that'], correct: 1 },
];

export default function LinuxDesktop() {
  const [step, setStep] = useState(0);
  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeDone, setChallengeDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleChallenge = (answer: string) => {
    if (answer === deFeatures[challengeStep].de) setChallengeScore(s => s + 1);
    if (challengeStep + 1 >= deFeatures.length) setChallengeDone(true);
    else setChallengeStep(challengeStep + 1);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-1-3', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You know your Linux desktops!" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="The Linux Desktop" pathId="linux" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Interactive Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !challengeDone && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Pick the DE</h2>
              <p className="text-xs text-gray-400 mb-3">{challengeStep + 1}/{deFeatures.length}</p>
              <p className="text-sm mb-4">Which desktop environment is: <strong>{deFeatures[challengeStep].feature}</strong>?</p>
              <div className="space-y-2">
                {deFeatures[challengeStep].options.map(opt => (
                  <button key={opt} onClick={() => handleChallenge(opt)} className="w-full text-left p-3 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && challengeDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {challengeScore}/{deFeatures.length} correct!</h3>
            </div>
            <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 4 && (
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
