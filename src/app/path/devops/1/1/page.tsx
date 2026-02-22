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
    title: "What is Version Control?",
    content: "Version control is a system that tracks changes to files over time. It lets you:\n\n• See the full history of every change\n• Undo mistakes by going back to previous versions\n• Work with others without overwriting each other's work\n• Keep a backup of your entire project\n\nThink of it like Google Docs revision history — but for your entire project.",
  },
  {
    title: "Why Git?",
    content: "Git is the most popular version control system in the world. Created by Linus Torvalds (the creator of Linux) in 2005.\n\n• Used by 95%+ of developers worldwide\n• Powers GitHub, GitLab, Bitbucket\n• Works offline — your full history is on your machine\n• Fast, reliable, and free\n\nIf you're a developer, you NEED to know Git.",
  },
  {
    title: "The Git Workflow",
    content: "Git has 3 main areas:\n\n📁 Working Directory — your actual files\n📋 Staging Area — files marked for next commit\n📦 Repository — saved history of commits\n\nThe basic flow:\n1. Edit files (working directory)\n2. git add — stage your changes\n3. git commit — save a snapshot\n4. git log — view history",
  },
];

export default function GitBasics() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does 'git init' do?", options: ['Deletes a repository', 'Creates a new Git repository', 'Pushes code to GitHub', 'Installs Git'], correct: 1 },
    { q: "What goes between editing files and committing?", options: ['git push', 'git pull', 'git add (staging)', 'git log'], correct: 2 },
    { q: "What does 'git log' show you?", options: ['Current file changes', 'List of branches', 'History of commits', 'Remote servers'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'git') return;
    const sub = parts[1];
    const newCompleted = new Set(completedCmds);
    if (sub === 'init') newCompleted.add('init');
    if (sub === 'add') newCompleted.add('add');
    if (sub === 'commit') newCompleted.add('commit');
    if (sub === 'status') newCompleted.add('status');
    if (sub === 'log') newCompleted.add('log');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 4) setTimeout(() => setStep(3), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-1-1', 50);
        addAchievement('git-gud');
        addAchievement('first-mission');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={50} message="You've learned the basics of Git!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Git Basics" pathId="devops" />
      <AnimatePresence mode="wait">
        {step < 3 && step < lessons.length && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/{lessons.length}</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 2 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">💻 The Git workflow:</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span style={{ color: '#39ff14' }}>user@dev:~/project$</span> git init</div>
                  <div className="text-gray-300">Initialized empty Git repository</div>
                  <div><span style={{ color: '#39ff14' }}>user@dev:~/project$</span> git add index.html</div>
                  <div><span style={{ color: '#39ff14' }}>user@dev:~/project$</span> git commit -m &quot;Initial commit&quot;</div>
                  <div className="text-gray-300">[main a1b2c3d] Initial commit</div>
                  <div><span style={{ color: '#39ff14' }}>user@dev:~/project$</span> git log</div>
                  <div className="text-gray-300">commit a1b2c3d - Initial commit</div>
                </div>
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Try Git Commands</h2>
              <p className="text-sm text-gray-400">Use at least 4 of these git commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['init', 'add', 'commit', 'status', 'log'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} git {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{completedCmds.size}/4 commands used</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
          </motion.div>
        )}

        {step === 3 && completedCmds.size >= 4 && (
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
