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
    title: "Reading Files",
    content: "cat — Print entire file contents\n  cat file.txt\n\nhead — Show first N lines (default 10)\n  head -n 5 file.txt\n\ntail — Show last N lines (default 10)\n  tail -n 3 file.txt\n\nless — Scrollable viewer (press q to quit)\n  less bigfile.txt",
  },
  {
    title: "Counting with wc",
    content: "wc — Word Count (counts lines, words, characters)\n  wc file.txt        → lines  words  chars\n  wc -l file.txt     → just line count\n  wc -w file.txt     → just word count\n\nSuper useful with pipes:\n  cat log.txt | wc -l  → count lines in a log",
  },
];

export default function ReadingFiles() {
  const [step, setStep] = useState(0);
  const [tasks, setTasks] = useState({ cat: false, head: false, wc: false });
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [foundAnswer, setFoundAnswer] = useState(false);

  const quizQuestions = [
    { q: "Which command shows the LAST 5 lines of a file?", options: ['head -n 5 file', 'tail -n 5 file', 'cat -5 file', 'bottom 5 file'], correct: 1 },
    { q: "What does 'wc -l file.txt' count?", options: ['Words', 'Characters', 'Lines', 'Files'], correct: 2 },
    { q: "How do you view a long file with scrolling?", options: ['cat file', 'more file', 'less file', 'scroll file'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string, output: string[], state: TerminalState) => {
    const base = cmd.trim().split(/\s+/)[0];
    const newTasks = { ...tasks };
    if (base === 'cat') newTasks.cat = true;
    if (base === 'head' || base === 'tail') newTasks.head = true;
    if (base === 'wc') newTasks.wc = true;

    // Check if they found the server uptime in report.txt
    if (output.some(l => l.includes('99.9%'))) {
      setFoundAnswer(true);
    }

    setTasks(newTasks);
    if (Object.values(newTasks).filter(Boolean).length >= 2 && foundAnswer) {
      setTimeout(() => setStep(3), 800);
    }
  }, [tasks, foundAnswer]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-2-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="You can read any file!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Reading Files" pathId="terminal" />
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Find the Server Uptime</h2>
              <p className="text-sm text-gray-400">There&apos;s a file at <code className="text-[#00f0ff]">~/Documents/report.txt</code> — read it to find the server uptime percentage.</p>
              <p className="text-xs text-gray-500 mt-2">Use cat, head, tail, or wc. Complete 2+ reading commands and find the uptime.</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${tasks.cat ? 'text-green-400' : 'text-gray-500'}`}>{tasks.cat ? '✅' : '⬜'} Use cat to read a file</div>
                <div className={`text-xs ${tasks.head ? 'text-green-400' : 'text-gray-500'}`}>{tasks.head ? '✅' : '⬜'} Use head or tail</div>
                <div className={`text-xs ${tasks.wc ? 'text-green-400' : 'text-gray-500'}`}>{tasks.wc ? '✅' : '⬜'} Use wc to count</div>
                <div className={`text-xs ${foundAnswer ? 'text-green-400' : 'text-gray-500'}`}>{foundAnswer ? '✅' : '⬜'} Find the uptime percentage</div>
              </div>
            </div>

            <InlineTerminal onCommand={handleCommand} height="220px" />

            {Object.values(tasks).filter(Boolean).length >= 2 && foundAnswer && (
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
