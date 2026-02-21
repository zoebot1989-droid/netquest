'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is the Terminal?",
    content: "The terminal (also called command line, shell, or console) is a text-based interface to your computer. Instead of clicking icons and buttons (GUI), you TYPE commands. It might look scary at first, but it's incredibly powerful — and every developer, sysadmin, and hacker uses it daily.",
  },
  {
    title: "CLI vs GUI",
    content: "GUI (Graphical User Interface) = what you're used to. Click files, drag folders, visual menus.\n\nCLI (Command Line Interface) = type commands, get text output. Faster, scriptable, works on servers with no screen.\n\nThink of GUI as driving automatic, and CLI as driving manual — more control, more power.",
  },
  {
    title: "Why Learn the Terminal?",
    content: "• Servers don't have screens — the terminal is the ONLY way in\n• Automate repetitive tasks with scripts\n• 10x faster than clicking through folders\n• Required for: Git, Docker, SSH, deployment, cloud\n• Makes you look like a hacker (bonus points) 😎",
  },
];

const quizQuestions = [
  {
    q: "What does CLI stand for?",
    options: ['Computer Learning Interface', 'Command Line Interface', 'Central Logic Input', 'Code Language Interpreter'],
    correct: 1,
  },
  {
    q: "Why is the terminal essential for servers?",
    options: ['Servers are too fast for GUIs', 'Servers typically have no screen — CLI is the only way to control them', 'GUIs cost extra money', 'Servers only understand Python'],
    correct: 1,
  },
  {
    q: "Which of these is an advantage of the terminal over a GUI?",
    options: ['Prettier colors', 'You can automate tasks with scripts', 'It uses more RAM', 'It requires a mouse'],
    correct: 1,
  },
];

export default function WhatIsTerminal() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-1-1', 40);
        addAchievement('hello-terminal');
        addAchievement('first-mission');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={40} message="Welcome to the command line!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="What is the Terminal?" pathId="terminal" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">💻 This is a terminal:</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span style={{ color: '#39ff14' }}>user@computer:~$</span> ls</div>
                  <div className="text-gray-300">Desktop  Documents  Downloads  Music</div>
                  <div><span style={{ color: '#39ff14' }}>user@computer:~$</span> cd Desktop</div>
                  <div><span style={{ color: '#39ff14' }}>user@computer:~/Desktop$</span> <span className="cursor-blink">▊</span></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="card border-cyan-800/30">
                <div className="grid grid-cols-2 gap-4 text-xs text-center">
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#ff9500' }}>🖱️ GUI</p>
                    <div className="space-y-1 text-gray-400">
                      <p>Click to open folder</p>
                      <p>Right-click → New File</p>
                      <p>Drag to move files</p>
                      <p>Visual, intuitive</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#39ff14' }}>⌨️ CLI</p>
                    <div className="space-y-1 text-gray-400">
                      <p><code>cd folder/</code></p>
                      <p><code>touch file.txt</code></p>
                      <p><code>mv file.txt other/</code></p>
                      <p>Fast, scriptable</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Take the Quiz →'}
            </button>
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
