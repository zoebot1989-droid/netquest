'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Aliases — Command Shortcuts",
    content: "Tired of typing long commands? Create aliases!\n\nalias ll='ls -la'\nalias gs='git status'\nalias ..='cd ..'\nalias update='apt update && apt upgrade'\n\nNow typing 'll' runs 'ls -la'. Magic!",
  },
  {
    title: ".bashrc — Your Config File",
    content: "~/.bashrc runs every time you open a terminal.\nPut your aliases and settings here:\n\n  cat ~/.bashrc\n\nCommon things in .bashrc:\n  - Aliases\n  - PATH modifications\n  - Custom prompt (PS1)\n  - Environment variables",
  },
  {
    title: "Custom Prompt (PS1)",
    content: "PS1 controls what your terminal prompt looks like.\n\nDefault:\n  user@hostname:~/path$\n\nCustom examples:\n  export PS1='\\u@\\h:\\w$ '    → user@host:~/path$\n  export PS1='🚀 \\w > '       → 🚀 ~/Desktop >\n  export PS1='[\\t] \\w$ '      → [14:30:00] ~/path$\n\n\\u = username, \\h = hostname, \\w = directory, \\t = time\n\nOh My Zsh = popular framework with themes & plugins!",
  },
];

export default function TerminalCustomization() {
  const [step, setStep] = useState(0);
  const [viewedBashrc, setViewedBashrc] = useState(false);
  const [exportedSomething, setExportedSomething] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What does 'alias ll=ls -la' do?", options: ['Creates a file called ll', 'Makes typing ll run ls -la', 'Deletes the ls command', 'Renames ls to ll'], correct: 1 },
    { q: "Which file stores your terminal configuration?", options: ['~/.terminal', '~/.config', '~/.bashrc', '~/.prompt'], correct: 2 },
    { q: "What does PS1 control?", options: ['The terminal colors', 'Which shell you use', 'The terminal prompt appearance', 'The font size'], correct: 2 },
    { q: "What is Oh My Zsh?", options: ['A Linux distribution', 'A terminal emulator', 'A framework for Zsh with themes and plugins', 'A text editor'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    if (cmd.includes('cat') && cmd.includes('.bashrc')) setViewedBashrc(true);
    if (cmd.includes('export')) setExportedSomething(true);
  }, []);

  const canAdvance = viewedBashrc && exportedSomething;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-5-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Terminal fully customized! 🎨" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Terminal Customization" pathId="terminal" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Customize Your Terminal</h2>
              <p className="text-sm text-gray-400">View your .bashrc and set a custom variable!</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${viewedBashrc ? 'text-green-400' : 'text-gray-500'}`}>{viewedBashrc ? '✅' : '⬜'} View ~/.bashrc (cat ~/.bashrc)</div>
                <div className={`text-xs ${exportedSomething ? 'text-green-400' : 'text-gray-500'}`}>{exportedSomething ? '✅' : '⬜'} Export a custom variable</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: <code className="text-[#39ff14]">cat ~/.bashrc</code> then <code className="text-[#39ff14]">export EDITOR=vim</code></p>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />

            {canAdvance && (
              <button onClick={() => setStep(4)} className="btn-primary w-full">Continue to Final Quiz →</button>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Final Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
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
