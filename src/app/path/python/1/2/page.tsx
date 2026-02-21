'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Variables",
    content: "Variables store data. In Python, you don't need to declare a type — just assign!\n\nname = \"John\"       # string (text)\nage = 14             # integer (whole number)\nheight = 5.8         # float (decimal number)\nis_cool = True       # boolean (True/False)\n\nPython figures out the type automatically. This is called 'dynamic typing'.",
  },
  {
    title: "Data Types",
    content: "Python has several basic data types:\n\n• str — text: \"hello\", 'world'\n• int — whole numbers: 42, -7, 0\n• float — decimals: 3.14, -0.5\n• bool — True or False\n• NoneType — None (nothing/empty)\n\nUse type() to check:\ntype(\"hello\")  →  <class 'str'>\ntype(42)       →  <class 'int'>\ntype(3.14)     →  <class 'float'>\ntype(True)     →  <class 'bool'>",
  },
  {
    title: "Naming Rules",
    content: "Variable names must:\n• Start with a letter or underscore: name, _count\n• Contain only letters, numbers, underscores\n• NOT be a Python keyword (if, for, while, etc.)\n\n✅ Good: my_name, age2, _private, totalScore\n❌ Bad: 2fast, my-name, class, for\n\nConvention: use snake_case (words_with_underscores)\nmy_variable = \"good\"\nmyVariable = \"works but not Pythonic\"",
  },
];

const quizQuestions = [
  { q: "What type is the value 3.14?", options: ['str', 'int', 'float', 'bool'], correct: 2 },
  { q: "What does type(True) return?", options: ["<class 'str'>", "<class 'int'>", "<class 'bool'>", "<class 'true'>"], correct: 2 },
  { q: "Which is a valid Python variable name?", options: ['2cool', 'my-var', 'my_var', 'class'], correct: 2 },
];

export default function VariablesDataTypes() {
  const [step, setStep] = useState(0);
  const [replDone, setReplDone] = useState(false);
  const [typesChecked, setTypesChecked] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('type(') || cmd.match(/^\w+\s*=\s*/)) {
      setTypesChecked(prev => prev + 1);
    }
    if (typesChecked >= 2) setReplDone(true);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-1-2', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You know your types! 🎯" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Variables & Data Types" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Practice! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !replDone && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Create Variables</h2>
              <p className="text-sm text-gray-400">Create some variables and check their types!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">name = &quot;John&quot;</code> then <code className="text-[#39ff14]">type(name)</code></p>
              <p className="text-xs text-gray-500">Progress: {Math.min(typesChecked, 3)}/3 interactions</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {typesChecked >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={() => { setReplDone(true); setStep(4); }} className="btn-primary w-full">Take the Quiz →</button>
              </motion.div>
            )}
          </motion.div>
        )}

        {(step === 4 || replDone) && step !== 3 && (
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
