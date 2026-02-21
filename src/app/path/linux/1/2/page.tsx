'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const distros = [
  { name: 'Ubuntu', icon: '🟠', desc: 'The most popular. User-friendly, great community, based on Debian. Perfect for beginners and servers.', based: 'Debian', use: 'Beginners, desktops, cloud servers' },
  { name: 'Debian', icon: '🔴', desc: 'The "granddaddy" — ultra stable, powers many other distros. Slower updates but rock-solid.', based: 'Independent', use: 'Servers needing maximum stability' },
  { name: 'Fedora', icon: '🔵', desc: 'Cutting-edge tech from Red Hat. Gets new features first. Great for developers.', based: 'Independent', use: 'Developers wanting latest tech' },
  { name: 'Arch', icon: '⚪', desc: 'DIY Linux — you build it from scratch. Rolling releases, bleeding edge. "I use Arch btw" meme.', based: 'Independent', use: 'Advanced users who want total control' },
  { name: 'CentOS/Rocky', icon: '🟢', desc: 'Enterprise-grade, free clone of Red Hat Enterprise Linux (RHEL). Used in corporate data centers.', based: 'RHEL', use: 'Enterprise servers, data centers' },
  { name: 'Mint', icon: '🟩', desc: 'Based on Ubuntu but with a Windows-like desktop. Extremely beginner-friendly.', based: 'Ubuntu', use: 'Users switching from Windows' },
];

const matchChallenges: { scenario: string; correct: string }[] = [
  { scenario: 'A beginner setting up their first Linux desktop', correct: 'Ubuntu' },
  { scenario: 'An enterprise data center needing 10-year support', correct: 'CentOS/Rocky' },
  { scenario: 'A developer who wants the latest kernel and packages', correct: 'Fedora' },
  { scenario: 'A power user who wants to build their OS from scratch', correct: 'Arch' },
  { scenario: 'A web server that must NEVER crash', correct: 'Debian' },
];

const quizQuestions = [
  { q: "Which distro is based on Debian and is the most popular?", options: ['Fedora', 'Arch', 'Ubuntu', 'CentOS'], correct: 2 },
  { q: "Which distro is known for 'build it from scratch' and rolling releases?", options: ['Ubuntu', 'Debian', 'Fedora', 'Arch'], correct: 3 },
  { q: "What is CentOS/Rocky Linux based on?", options: ['Debian', 'Red Hat Enterprise Linux', 'Ubuntu', 'Arch'], correct: 1 },
  { q: "Which distro prioritizes stability over bleeding-edge features?", options: ['Arch', 'Fedora', 'Debian', 'Mint'], correct: 2 },
];

export default function Distributions() {
  const [step, setStep] = useState(0);
  const [matchStep, setMatchStep] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleMatch = (distro: string) => {
    if (distro === matchChallenges[matchStep].correct) {
      setMatchScore(s => s + 1);
    }
    if (matchStep + 1 >= matchChallenges.length) {
      setMatchDone(true);
    } else {
      setMatchStep(matchStep + 1);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-1-2', 50);
        addAchievement('distro-hopper');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You know your distros! 🏄" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Distributions" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-2">🐧 What&apos;s a Distribution?</h2>
              <p className="text-sm text-gray-300">Linux is just a <strong>kernel</strong> (the core). A distribution (distro) packages the kernel with software, tools, a desktop, and a package manager into a complete OS. Think of it like ice cream flavors — same base, different experience.</p>
            </div>
            {distros.map(d => (
              <div key={d.name} className="card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{d.icon}</span>
                  <h3 className="font-semibold">{d.name}</h3>
                </div>
                <p className="text-sm text-gray-300 mb-2">{d.desc}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500">Based on: <span style={{ color: '#00f0ff' }}>{d.based}</span></span>
                  <span className="text-gray-500">Best for: <span style={{ color: '#39ff14' }}>{d.use}</span></span>
                </div>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Match the Distro →</button>
          </motion.div>
        )}

        {step === 1 && !matchDone && (
          <motion.div key="match" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Match the Distro</h2>
              <p className="text-xs text-gray-400 mb-3">{matchStep + 1}/{matchChallenges.length}</p>
              <p className="text-sm mb-4">&quot;{matchChallenges[matchStep].scenario}&quot;</p>
              <div className="grid grid-cols-2 gap-2">
                {['Ubuntu', 'Debian', 'Fedora', 'Arch', 'CentOS/Rocky'].map(d => (
                  <button key={d} onClick={() => handleMatch(d)} className="p-2 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && matchDone && (
          <motion.div key="match-result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {matchScore}/{matchChallenges.length} correct!</h3>
              <p className="text-sm text-gray-400">{matchScore >= 4 ? 'You really know your distros!' : 'Each distro has its niche — you\'ll learn them over time!'}</p>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 2 && (
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
