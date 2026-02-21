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
    title: "Pipes: Connecting Commands",
    content: "The pipe symbol | sends the OUTPUT of one command as INPUT to another:\n\n  cat file.txt | grep error\n  → reads file, then filters for 'error'\n\n  ls -la | head -n 5\n  → lists files, shows only first 5\n\n  cat log.txt | grep 404 | wc -l\n  → count how many 404 errors in the log",
  },
  {
    title: "Redirection: Saving Output",
    content: ">  — Write output to file (OVERWRITES)\n  echo 'hello' > file.txt\n  ls > filelist.txt\n\n>> — Append output to file (ADDS to end)\n  echo 'line 2' >> file.txt\n\n<  — Read input from file\n  sort < unsorted.txt\n\nPipes CONNECT commands. Redirection SAVES to files.",
  },
];

export default function PipesRedirection() {
  const [step, setStep] = useState(0);
  const [usedPipe, setUsedPipe] = useState(false);
  const [usedRedirect, setUsedRedirect] = useState(false);
  const [chainedThree, setChainedThree] = useState(false);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    { q: "What does the | (pipe) symbol do?", options: ['Saves output to a file', 'Sends output of one command as input to the next', 'Runs two commands at the same time', 'Creates a new file'], correct: 1 },
    { q: "What's the difference between > and >>?", options: ['No difference', '> overwrites the file, >> appends to it', '> is faster', '>> creates a new file, > doesn\'t'], correct: 1 },
    { q: "What does 'cat log.txt | grep error | wc -l' do?", options: ['Counts the total lines in log.txt', 'Finds errors and creates a new file', 'Counts how many lines contain \"error\"', 'Deletes lines with errors'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    if (cmd.includes('|')) {
      setUsedPipe(true);
      const pipes = cmd.split('|').length - 1;
      if (pipes >= 2) {
        setChainedThree(true);
        addAchievement('pipe-dream');
      }
    }
    if (cmd.includes('>')) setUsedRedirect(true);
  }, []);

  const canAdvance = usedPipe && usedRedirect;

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-3-2', 70);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="Pipes and redirects — unlocked!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Pipes & Redirection" pathId="terminal" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🔗 Think of pipes like a factory assembly line:</p>
                <div className="font-mono text-xs text-center">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    <span className="bg-gray-800 px-2 py-1 rounded">cat log.txt</span>
                    <span style={{ color: '#00f0ff' }}>→|→</span>
                    <span className="bg-gray-800 px-2 py-1 rounded">grep 404</span>
                    <span style={{ color: '#00f0ff' }}>→|→</span>
                    <span className="bg-gray-800 px-2 py-1 rounded">wc -l</span>
                    <span style={{ color: '#39ff14' }}>→ 2</span>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Chain Commands Together</h2>
              <p className="text-sm text-gray-400">Use pipes and redirection to complete these tasks:</p>
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${usedPipe ? 'text-green-400' : 'text-gray-500'}`}>{usedPipe ? '✅' : '⬜'} Use a pipe (|) to chain commands</div>
                <div className={`text-xs ${usedRedirect ? 'text-green-400' : 'text-gray-500'}`}>{usedRedirect ? '✅' : '⬜'} Use redirection (&gt; or &gt;&gt;) to save output</div>
                <div className={`text-xs ${chainedThree ? 'text-green-400' : 'text-gray-500'}`}>{chainedThree ? '✅ 🏆 Pipe Dream!' : '⬜'} Chain 3+ commands with pipes (bonus achievement!)</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: <code className="text-[#39ff14]">cat /var/log/syslog | grep nginx | wc -l</code></p>
              <p className="text-xs text-gray-500">Or: <code className="text-[#39ff14]">echo &quot;hello world&quot; &gt; ~/test.txt</code></p>
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
