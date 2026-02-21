'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';
import { getNode } from '@/lib/terminalFS';

const lessons = [
  {
    title: "Creating Files & Directories",
    content: "mkdir — Make Directory\n  mkdir projects     → creates a folder\n  mkdir -p a/b/c     → creates nested folders\n\ntouch — Create empty file\n  touch readme.txt   → creates empty file\n  touch a.txt b.txt  → creates multiple files",
  },
  {
    title: "Deleting Things",
    content: "rm — Remove file\n  rm file.txt        → delete a file\n  rm -r folder/      → delete a folder and contents\n  rm -rf folder/     → force delete (no confirmation)\n\nrmdir — Remove empty directory\n  rmdir emptyfolder  → only works if empty",
  },
  {
    title: "⚠️ WARNING: rm -rf",
    content: "rm -rf is the most DANGEROUS command in Linux.\n\nrm -rf /  → deletes EVERYTHING on the computer\nrm -rf ~  → deletes all your personal files\n\nThere is NO undo. No recycle bin. No confirmation.\nAlways double-check what you're deleting!\n\n🛡️ Rule: Read the command twice before hitting Enter.",
  },
];

export default function CreatingDeleting() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [tasks, setTasks] = useState({ mkdir: false, touch: false, nested: false, rm: false });
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "How do you create a new empty file called 'notes.txt'?", options: ['mkdir notes.txt', 'touch notes.txt', 'create notes.txt', 'new notes.txt'], correct: 1 },
    { q: "What does rm -rf do?", options: ['Removes a file with confirmation', 'Renames a file', 'Force removes files and directories recursively', 'Creates a backup'], correct: 2 },
    { q: "Why is 'rm -rf /' extremely dangerous?", options: ['It reboots the computer', 'It deletes everything on the entire system with no undo', 'It formats the hard drive', 'It only deletes hidden files'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const base = cmd.trim().split(/\s+/)[0];
    const newTasks = { ...tasks };

    if (base === 'mkdir') newTasks.mkdir = true;
    if (base === 'touch') newTasks.touch = true;
    if (base === 'rm') newTasks.rm = true;
    
    // Check for nested dir creation
    if (cmd.includes('mkdir') && (cmd.includes('-p') || cmd.includes('/'))) {
      newTasks.nested = true;
    }

    // Also count mkdir of specific structure
    const projectDir = getNode(state.fs, '/home/user/myproject');
    if (projectDir && projectDir.type === 'dir') {
      const hasSrc = getNode(state.fs, '/home/user/myproject/src');
      const hasDocs = getNode(state.fs, '/home/user/myproject/docs');
      if (hasSrc && hasDocs) newTasks.nested = true;
    }

    setTasks(newTasks);

    const done = Object.values(newTasks).filter(Boolean).length;
    if (done >= 3) {
      setTimeout(() => setStep(4), 800);
    }
  }, [tasks]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-2-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You can create and destroy!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Creating & Deleting" pathId="terminal" />
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

            {step === 2 && (
              <div className="card border-red-800/30">
                <div className="text-center">
                  <span className="text-4xl">💀</span>
                  <p className="text-sm mt-2" style={{ color: '#ff3b30' }}>rm -rf / = Game Over</p>
                  <p className="text-xs text-gray-500 mt-1">Real sysadmins have nightmares about this</p>
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Build a Project Structure</h2>
              <p className="text-sm text-gray-400">Complete at least 3 of these tasks:</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${tasks.mkdir ? 'text-green-400' : 'text-gray-500'}`}>{tasks.mkdir ? '✅' : '⬜'} Create a directory with mkdir</div>
                <div className={`text-xs ${tasks.touch ? 'text-green-400' : 'text-gray-500'}`}>{tasks.touch ? '✅' : '⬜'} Create a file with touch</div>
                <div className={`text-xs ${tasks.nested ? 'text-green-400' : 'text-gray-500'}`}>{tasks.nested ? '✅' : '⬜'} Create nested directories (mkdir -p or mkdir inside mkdir)</div>
                <div className={`text-xs ${tasks.rm ? 'text-green-400' : 'text-gray-500'}`}>{tasks.rm ? '✅' : '⬜'} Delete something with rm</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: <code className="text-[#39ff14]">mkdir myproject</code> then <code className="text-[#39ff14]">cd myproject</code> then <code className="text-[#39ff14]">mkdir src docs</code></p>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />
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
