'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What are Functions?",
    content: "Functions are reusable blocks of code. Instead of writing the same code over and over, put it in a function:\n\ndef greet(name):\n    print(f\"Hello, {name}!\")\n\ngreet(\"John\")   →  Hello, John!\ngreet(\"Alice\")  →  Hello, Alice!\n\nKey parts:\n• def — keyword to define a function\n• greet — function name\n• (name) — parameter (input)\n• The indented code is the function body",
  },
  {
    title: "Return Values",
    content: "Functions can return results with return:\n\ndef add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)  →  8\n\ndef is_even(n):\n    return n % 2 == 0\n\nis_even(4)   →  True\nis_even(7)   →  False\n\nWithout return, a function returns None.",
  },
  {
    title: "Default & Advanced Args",
    content: "Default arguments have fallback values:\n\ndef greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\ngreet(\"John\")           →  \"Hello, John!\"\ngreet(\"John\", \"Hey\")    →  \"Hey, John!\"\n\n*args — accept any number of arguments:\ndef total(*nums):\n    return sum(nums)\ntotal(1, 2, 3)  →  6\n\n**kwargs — accept keyword arguments:\ndef info(**data):\n    for k, v in data.items():\n        print(f\"{k}: {v}\")",
  },
];

const quizQuestions = [
  { q: "What keyword defines a function in Python?", options: ['function', 'func', 'def', 'fn'], correct: 2 },
  { q: "What does a function return if there's no return statement?", options: ['0', 'False', 'None', 'An error'], correct: 2 },
  { q: "What is a parameter?", options: ['The function name', 'An input variable the function receives', 'The return value', 'A type of loop'], correct: 1 },
];

export default function Functions() {
  const [step, setStep] = useState(0);
  const [fnCount, setFnCount] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.startsWith('def ')) {
      const newCount = fnCount + 1;
      setFnCount(newCount);
      if (newCount >= 5) addAchievement('function-factory');
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-4-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Function master! ⚙️" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Functions" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Write Functions! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Write Functions</h2>
              <p className="text-sm text-gray-400">Define and call functions to solve problems!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">def double(x): return x * 2</code> then <code className="text-[#39ff14]">double(21)</code></p>
              <p className="text-xs text-gray-500">Functions written: {fnCount}{fnCount >= 2 ? ' ✅' : ' (write at least 2)'}</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {fnCount >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
