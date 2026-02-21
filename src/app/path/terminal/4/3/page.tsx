'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Environment Variables",
    content: "Environment variables are KEY=VALUE pairs that configure your shell:\n\n$HOME     → /home/user (your home directory)\n$USER     → user (your username)\n$PATH     → where the system looks for commands\n$SHELL    → /bin/bash (your shell program)\n\nView them:\n  echo $HOME\n  env            → show all variables",
  },
  {
    title: "$PATH — The Most Important Variable",
    content: "$PATH is a list of directories separated by colons.\nWhen you type a command, the system searches these directories IN ORDER.\n\n  echo $PATH\n  /usr/local/bin:/usr/bin:/bin\n\nTo add a directory to PATH:\n  export PATH=\"$HOME/bin:$PATH\"\n\nThis is stored in ~/.bashrc so it persists across sessions.",
  },
];

export default function EnvVars() {
  const [step, setStep] = useState(0);
  const [usedExport, setUsedExport] = useState(false);
  const [usedEnv, setUsedEnv] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What does $PATH do?", options: ['Shows the current directory', 'Lists all files', 'Tells the system where to find commands', 'Shows network routes'], correct: 2 },
    { q: "How do you set a variable called API_KEY to 'abc123'?", options: ['set API_KEY abc123', 'export API_KEY=abc123', 'var API_KEY = abc123', 'API_KEY: abc123'], correct: 1 },
    { q: "Which file stores your shell configuration?", options: ['/etc/config', '~/.bashrc', '/usr/bash', '~/terminal.conf'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    if (cmd.includes('export')) setUsedExport(true);
    if (cmd.includes('env') || cmd.includes('echo $')) setUsedEnv(true);
  }, []);

  const canAdvance = usedExport && usedEnv;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-4-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Environment mastered!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Environment Variables" pathId="terminal" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Configure Your Environment</h2>
              <p className="text-sm text-gray-400">View variables and set a new one!</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${usedEnv ? 'text-green-400' : 'text-gray-500'}`}>{usedEnv ? '✅' : '⬜'} View a variable (env, echo $HOME, etc.)</div>
                <div className={`text-xs ${usedExport ? 'text-green-400' : 'text-gray-500'}`}>{usedExport ? '✅' : '⬜'} Set a variable (export MY_VAR=hello)</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: <code className="text-[#39ff14]">echo $PATH</code> then <code className="text-[#39ff14]">export SECRET=hunter2</code> then <code className="text-[#39ff14]">env</code></p>
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
