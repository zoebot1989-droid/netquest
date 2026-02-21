'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const lessons = [
  {
    title: "Users in Linux",
    content: "Linux is a multi-user system. Every person (and many programs) has a user account.\n\n👤 Regular users — like you! Limited permissions, can only mess with their own files.\n\n👑 root — the superuser. Can do ANYTHING. Delete the entire OS? Sure. Root has no limits.\n\nThis separation exists for security — if a hacker gets into a regular account, they can't destroy the whole system.",
  },
  {
    title: "User Commands",
    content: "• whoami — shows your current username\n• id — shows your user ID (UID), group ID (GID), and group memberships\n• cat /etc/passwd — the user database (everyone can read it!)\n\nEach user has:\n• A UID (user ID number) — root is always 0\n• A home directory — usually /home/username\n• A default shell — usually /bin/bash\n\nThe /etc/passwd file format:\nusername:x:UID:GID:description:home:shell",
  },
];

const quizQuestions = [
  { q: "What is the UID of the root user?", options: ['1', '1000', '0', '999'], correct: 2 },
  { q: "Which command shows your username AND group memberships?", options: ['whoami', 'id', 'groups', 'passwd'], correct: 1 },
  { q: "Where is user account information stored?", options: ['/home/users', '/etc/passwd', '/var/users', '/root/users'], correct: 1 },
];

export default function LinuxUsers() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed === 'whoami') newCompleted.add('whoami');
    if (trimmed === 'id') newCompleted.add('id');
    if (trimmed.includes('cat') && trimmed.includes('/etc/passwd')) newCompleted.add('passwd');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-2-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You understand Linux users!" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Users" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <div className="card border-cyan-800/30">
              <p className="text-xs text-gray-400 mb-2">Example /etc/passwd entry:</p>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                <div className="text-gray-300">user:x:<span style={{ color: '#00f0ff' }}>1000</span>:<span style={{ color: '#39ff14' }}>1000</span>:User:<span style={{ color: '#ff9500' }}>/home/user</span>:/bin/bash</div>
                <div className="text-gray-600 mt-1">     ^   UID   GID  desc   home dir    shell</div>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try It Out →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Explore Users</h2>
              <p className="text-sm text-gray-400">Run these commands to learn about users on this system:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['whoami', 'whoami'], ['id', 'id'], ['cat /etc/passwd', 'passwd']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
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
