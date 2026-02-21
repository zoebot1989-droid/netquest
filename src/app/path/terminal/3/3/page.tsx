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
    title: "File Permissions",
    content: "Every file has permissions controlling WHO can do WHAT:\n\n  rwxr-xr-x\n  ├── rwx = Owner (read, write, execute)\n  ├── r-x = Group (read, execute)\n  └── r-x = Everyone else\n\nr = read (4)\nw = write (2)\nx = execute (1)\n- = no permission (0)",
  },
  {
    title: "chmod & chown",
    content: "chmod — Change permissions\n  chmod +x script.sh      → make executable\n  chmod 755 script.sh     → rwxr-xr-x\n  chmod 644 file.txt      → rw-r--r--\n\nNumeric: add r(4) + w(2) + x(1)\n  7 = rwx, 6 = rw-, 5 = r-x, 4 = r--\n\nchown — Change owner\n  chown user:group file.txt",
  },
  {
    title: "Reading ls -la Output",
    content: "-rw-r--r-- 1 user user  1024 Feb 21 notes.txt\n│├─┤├─┤├─┤\n│ │   │  └─ Others: read only\n│ │   └──── Group: read only\n│ └──────── Owner: read + write\n└────────── Type: - = file, d = directory\n\nTo run a script, it MUST have x (execute) permission.\nIf you see 'Permission denied', check permissions!",
  },
];

export default function Permissions() {
  const [step, setStep] = useState(0);
  const [usedChmod, setUsedChmod] = useState(false);
  const [madeExecutable, setMadeExecutable] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What does 'chmod 755 file' give?", options: ['rwx------', 'rw-r--r--', 'rwxr-xr-x', 'r-xr-xr-x'], correct: 2 },
    { q: "What permission number means 'read + write' (no execute)?", options: ['7', '6', '5', '4'], correct: 1 },
    { q: "If a script gives 'Permission denied', what command fixes it?", options: ['chown script.sh', 'chmod +x script.sh', 'rm script.sh', 'mv script.sh'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    if (cmd.includes('chmod')) {
      setUsedChmod(true);
      addAchievement('root-access');
      // Check if they made script.sh executable
      if (cmd.includes('+x') || cmd.includes('7')) {
        setMadeExecutable(true);
      }
    }
  }, []);

  const canAdvance = usedChmod && madeExecutable;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-3-3', 70);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="You understand permissions!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Permissions" pathId="terminal" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Fix Permissions to Run a Script</h2>
              <p className="text-sm text-gray-400">There&apos;s a script at <code className="text-[#00f0ff]">~/Downloads/script.sh</code> that can&apos;t be executed. Fix its permissions!</p>
              <p className="text-xs text-gray-500 mt-2">1. Check permissions: <code className="text-[#39ff14]">ls -la ~/Downloads/script.sh</code></p>
              <p className="text-xs text-gray-500">2. Make it executable: <code className="text-[#39ff14]">chmod +x ~/Downloads/script.sh</code></p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${usedChmod ? 'text-green-400' : 'text-gray-500'}`}>{usedChmod ? '✅' : '⬜'} Use chmod</div>
                <div className={`text-xs ${madeExecutable ? 'text-green-400' : 'text-gray-500'}`}>{madeExecutable ? '✅' : '⬜'} Make script executable</div>
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
