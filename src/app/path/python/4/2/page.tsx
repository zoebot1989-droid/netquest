'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What are Modules?",
    content: "Modules are files containing Python code you can reuse. Python has thousands of built-in modules!\n\nimport math\nprint(math.sqrt(16))   →  4.0\nprint(math.pi)         →  3.14159...\n\nimport random\nprint(random.randint(1, 10))  →  random number 1-10\n\nModules save you from reinventing the wheel!",
  },
  {
    title: "Import Styles",
    content: "Multiple ways to import:\n\n# Import the whole module\nimport math\nmath.sqrt(25)          # need math. prefix\n\n# Import specific things\nfrom math import sqrt, pi\nsqrt(25)               # no prefix needed!\n\n# Import with an alias\nimport datetime as dt\ndt.datetime.now()\n\n# Import everything (not recommended)\nfrom math import *\nsqrt(25)               # works but pollutes namespace",
  },
  {
    title: "Useful Standard Library Modules",
    content: "Python's standard library is HUGE. Key modules:\n\n📐 math — sqrt, pi, sin, cos, floor, ceil\n🎲 random — randint, choice, shuffle\n📅 datetime — dates, times, formatting\n📂 os — file system, paths, environment\n💻 sys — system info, command line args\n📋 json — parse/create JSON data\n⏱️ time — sleep, timing\n📝 re — regular expressions\n🌐 urllib — HTTP requests\n📊 csv — read/write CSV files\n\nTo explore: import module, then help(module)",
  },
];

const quizQuestions = [
  { q: "What does `import math` do?", options: ['Downloads math from the internet', 'Makes math functions available', 'Creates a math file', 'Installs a math package'], correct: 1 },
  { q: "What's the difference between `import X` and `from X import Y`?", options: ['No difference', 'The first imports everything, the second imports specific items', 'The first is faster', 'The second downloads from the internet'], correct: 1 },
  { q: "Which module would you use for random numbers?", options: ['math', 'random', 'numbers', 'randint'], correct: 1 },
];

export default function ModulesImports() {
  const [step, setStep] = useState(0);
  const [imported, setImported] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.startsWith('import ') || cmd.startsWith('from ')) setImported(true);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-4-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Module explorer! 📦" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Modules & Imports" pathId="python" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Try Importing! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Use Modules</h2>
              <p className="text-sm text-gray-400">Import a module and use it!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">import random</code> (imports are simulated, but the syntax practice matters!)</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="200px" />
            {imported && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Import successful!</p>
                </div>
                <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
              </motion.div>
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
