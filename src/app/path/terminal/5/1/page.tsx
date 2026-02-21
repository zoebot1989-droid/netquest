'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is SSH?",
    content: "SSH (Secure Shell) lets you control a remote computer over the internet.\n\nIt's like a portal — you type commands on YOUR keyboard, but they run on a SERVER miles away.\n\n  ssh user@hostname\n  ssh root@167.172.5.42\n  ssh john@myserver.com\n\nEverything is encrypted — nobody can see what you type.",
  },
  {
    title: "Keys vs Passwords",
    content: "Two ways to authenticate:\n\n🔑 SSH Keys (recommended):\n  - Generate a key pair (public + private)\n  - Put public key on server\n  - Private key stays on your computer\n  - No password needed!\n\n🔐 Password:\n  - Type password every time\n  - Less secure (can be brute-forced)\n  - OK for learning, bad for production",
  },
  {
    title: "SCP — Secure Copy",
    content: "scp copies files between your computer and a server:\n\nUpload to server:\n  scp file.txt user@server:/path/\n\nDownload from server:\n  scp user@server:/path/file.txt ./\n\nIt uses SSH under the hood — same security, same keys.",
  },
];

export default function SSHMission() {
  const [step, setStep] = useState(0);
  const [sshDone, setSSHDone] = useState(false);
  const [scpDone, setSCPDone] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What does SSH stand for?", options: ['Super Secure Host', 'Secure Shell', 'Server Shell Helper', 'System Shell Handler'], correct: 1 },
    { q: "Which is more secure for SSH authentication?", options: ['Password', 'SSH Keys', 'No difference', 'Username only'], correct: 1 },
    { q: "How do you copy a file TO a remote server?", options: ['cp file server:', 'upload file server', 'scp file user@server:/path/', 'ssh cp file server'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    if (cmd.includes('ssh ')) {
      setSSHDone(true);
      addAchievement('ssh-agent');
      addAchievement('first-ssh');
    }
    if (cmd.includes('scp ')) setSCPDone(true);
  }, []);

  const canAdvance = sshDone;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-5-1', 70);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="SSH agent activated!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="SSH Into a Server" pathId="terminal" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <div className="text-center font-mono text-xs space-y-1">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div>💻<br/>Your PC</div>
                    <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🔒→</motion.span>
                    <div>🌐<br/>Internet</div>
                    <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>→🔒</motion.span>
                    <div>🖥️<br/>Server</div>
                  </div>
                  <p className="text-gray-500 mt-2">Encrypted tunnel — nobody can snoop</p>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Connect to a Server</h2>
              <p className="text-sm text-gray-400">SSH into a simulated server and optionally copy a file!</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${sshDone ? 'text-green-400' : 'text-gray-500'}`}>{sshDone ? '✅' : '⬜'} SSH into a server (ssh root@167.172.5.42)</div>
                <div className={`text-xs ${scpDone ? 'text-green-400' : 'text-gray-500'}`}>{scpDone ? '✅' : '⬜'} Transfer a file with scp (bonus)</div>
              </div>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />

            {canAdvance && (
              <button onClick={() => setStep(4)} className="btn-primary w-full">Continue to Quiz →</button>
            )}
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
