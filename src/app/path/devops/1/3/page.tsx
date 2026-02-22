'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Remote Repositories",
    content: "A remote repo is a copy of your project hosted on a server (like GitHub, GitLab, or Bitbucket).\n\nThis enables:\n• Backup — your code lives in the cloud\n• Collaboration — others can contribute\n• Deployment — servers can pull your latest code\n\nGitHub is the most popular platform with 100M+ developers.",
  },
  {
    title: "Remote Commands",
    content: "Key commands:\n\n• git clone <url> — download a remote repo\n• git remote add origin <url> — connect local to remote\n• git push — upload your commits to remote\n• git pull — download + merge remote changes\n• git remote -v — see your remotes",
  },
  {
    title: "Collaboration Workflow",
    content: "The standard GitHub workflow:\n\n1. Fork — copy someone's repo to your account\n2. Clone — download your fork locally\n3. Branch — create a feature branch\n4. Code — make your changes, commit\n5. Push — upload your branch\n6. Pull Request (PR) — ask to merge into original\n7. Review — others review your code\n8. Merge — PR gets approved and merged 🎉",
  },
];

export default function RemoteRepos() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does 'git clone' do?", options: ['Creates a new branch', 'Downloads a remote repository', 'Uploads changes to remote', 'Creates an empty repo'], correct: 1 },
    { q: "What's the difference between push and pull?", options: ['Push downloads, pull uploads', 'Push uploads, pull downloads', 'They do the same thing', 'Push creates branches, pull merges them'], correct: 1 },
    { q: "What is a Pull Request (PR)?", options: ['A command to pull code', 'A request to merge your branch into another repo', 'A way to delete branches', 'A Git error message'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'git') return;
    const newCompleted = new Set(completedCmds);
    if (parts[1] === 'remote') newCompleted.add('remote');
    if (parts[1] === 'push') newCompleted.add('push');
    if (parts[1] === 'pull') newCompleted.add('pull');
    if (parts[1] === 'clone') newCompleted.add('clone');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(4), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-1-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You're ready to collaborate on GitHub!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Remote Repos" pathId="devops" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Try It Out →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Remote Commands</h2>
              <p className="text-sm text-gray-400">Try at least 3 of these remote commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['remote', 'push', 'pull', 'clone'].map(c => (
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
