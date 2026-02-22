'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What Are Branches?",
    content: "Branches let you work on different features simultaneously without affecting the main codebase.\n\nThink of it like a tree:\n• 'main' is the trunk — stable, production code\n• Branches split off to develop new features\n• When ready, branches merge back into main\n\nThis means multiple developers can work independently!",
  },
  {
    title: "Branch Commands",
    content: "Key commands:\n\n• git branch — list all branches\n• git branch feature-name — create a new branch\n• git checkout feature-name — switch to a branch\n• git checkout -b new-branch — create AND switch\n• git merge feature-name — merge branch into current\n\nAlways commit your changes before switching branches!",
  },
  {
    title: "Merge Conflicts",
    content: "When two branches change the same lines, Git can't decide which version to keep. This is a merge conflict.\n\nGit marks the conflict in the file:\n<<<<<<< HEAD\nyour changes\n=======\ntheir changes\n>>>>>>> feature-branch\n\nYou manually choose the right code, remove the markers, and commit. Don't panic — it's normal!",
  },
];

export default function BranchingMerging() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does 'git branch feature-login' do?", options: ['Switches to feature-login', 'Creates a new branch called feature-login', 'Deletes the feature-login branch', 'Merges feature-login into main'], correct: 1 },
    { q: "How do you create AND switch to a new branch in one command?", options: ['git branch -s new', 'git merge new', 'git checkout -b new', 'git switch --create-only new'], correct: 2 },
    { q: "When does a merge conflict occur?", options: ['When you create a branch', 'When you delete a branch', 'When two branches change the same lines', 'When you push to remote'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'git') return;
    const newCompleted = new Set(completedCmds);
    if (parts[1] === 'branch') newCompleted.add('branch');
    if (parts[1] === 'checkout' || parts[1] === 'switch') newCompleted.add('checkout');
    if (parts[1] === 'merge') newCompleted.add('merge');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(4), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-1-2', 60);
        addAchievement('branch-manager');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can branch and merge like a pro!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Branching & Merging" pathId="devops" />
      <AnimatePresence mode="wait">
        {step < lessons.length && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/{lessons.length}</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🌿 Branch visualization:</p>
                <pre className="font-mono text-xs text-gray-300">{`main:     ●───●───●───●───●───●
                    \\       /
feature:             ●───●─●`}</pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Try It Out →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Branch Challenge</h2>
              <p className="text-sm text-gray-400">Use these git branching commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['branch', 'checkout', 'merge'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} git {c}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
