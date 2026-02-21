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
    title: "The Power of sudo",
    content: "sudo = \"Super User DO\". It lets a regular user run ONE command as root, without switching accounts.\n\nWhy not just log in as root? Because:\n• One typo as root can destroy your system\n• sudo logs everything — you have an audit trail\n• You only get root power for one command, then back to normal\n\n🍺 \"With great power comes great responsibility.\"",
  },
  {
    title: "sudo in Practice",
    content: "• sudo <command> — run a command as root\n• sudo !! — re-run the LAST command with sudo (super handy!)\n• sudo -i — get a root shell\n\nThe /etc/sudoers file controls WHO can use sudo. Never edit it directly — use 'visudo' instead.\n\nUsers in the 'sudo' group can use sudo. Check with: groups\n\nCommon beginner moment:\n$ apt update\n→ Permission denied!\n$ sudo apt update\n→ Works! 🎉",
  },
];

const quizQuestions = [
  { q: "What does 'sudo !!' do?", options: ['Deletes the last command', 'Runs the last command with sudo', 'Shows sudo history', 'Exits sudo mode'], correct: 1 },
  { q: "Why is sudo better than logging in as root?", options: ['It\'s faster', 'You only get root power for one command + it logs everything', 'Root doesn\'t work on Ubuntu', 'sudo has more commands'], correct: 1 },
  { q: "Which file controls who can use sudo?", options: ['/etc/passwd', '/etc/sudo', '/etc/sudoers', '/root/sudo.conf'], correct: 2 },
  { q: "Which group gives sudo access on Ubuntu?", options: ['admin', 'root', 'wheel', 'sudo'], correct: 3 },
];

export default function SudoPower() {
  const [step, setStep] = useState(0);
  const [usedSudo, setUsedSudo] = useState(false);
  const [usedSudoBang, setUsedSudoBang] = useState(false);
  const [readSudoers, setReadSudoers] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const allDone = usedSudo && usedSudoBang && readSudoers;

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed.startsWith('sudo ') && !trimmed.includes('!!')) setUsedSudo(true);
    if (trimmed === 'sudo !!') setUsedSudoBang(true);
    if (trimmed.includes('cat') && trimmed.includes('sudoers')) setReadSudoers(true);
  }, []);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-2-3', 60);
        addAchievement('root-beer');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="sudo power unlocked! 🍺" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="sudo Power" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try sudo →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 sudo Challenge</h2>
              <p className="text-sm text-gray-400">Try these commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  ['sudo apt update', usedSudo],
                  ['sudo !!', usedSudoBang],
                  ['cat /etc/sudoers', readSudoers],
                ].map(([label, done]) => (
                  <span key={label as string} className={`text-xs font-mono px-2 py-1 rounded ${done ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {done ? '✅' : '⬜'} {label as string}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
            {allDone && (
              <button onClick={() => setStep(2)} className="btn-primary w-full">Take the Quiz →</button>
            )}
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
