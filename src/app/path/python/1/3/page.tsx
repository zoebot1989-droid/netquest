'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "print() — Output",
    content: "print() displays text to the screen. You can print anything:\n\nprint(\"Hello!\")          # string\nprint(42)                # number\nprint(3.14)              # float\nprint(True)              # boolean\nprint(\"Age:\", 14)        # multiple values (separated by space)\n\nYou can print multiple things separated by commas — Python adds spaces automatically.",
  },
  {
    title: "input() — Getting User Input",
    content: "input() asks the user to type something:\n\nname = input(\"What's your name? \")\nprint(\"Hello,\", name)\n\n⚠️ input() ALWAYS returns a string!\nSo if you need a number:\n\nage = int(input(\"Your age: \"))\n\nint() converts a string to an integer.\nfloat() converts to a decimal number.",
  },
  {
    title: "f-strings — String Formatting",
    content: "f-strings let you put variables INSIDE strings. Just add f before the quote and use {curly braces}:\n\nname = \"John\"\nage = 14\nprint(f\"My name is {name} and I'm {age}\")\n→ My name is John and I'm 14\n\nYou can even do math inside:\nprint(f\"Next year I'll be {age + 1}\")\n→ Next year I'll be 15\n\nf-strings are the modern, clean way to format text in Python!",
  },
];

const quizQuestions = [
  { q: "What does input() always return?", options: ['An integer', 'A boolean', 'A string', 'Whatever type you entered'], correct: 2 },
  { q: "What does f\"Hello {name}\" do?", options: ['Prints literally {name}', 'Inserts the value of the variable name', 'Creates a file', 'Throws an error'], correct: 1 },
  { q: 'What does print("A", "B") output?', options: ['AB', 'A B', 'A, B', '"A" "B"'], correct: 1 },
];

export default function InputOutput() {
  const [step, setStep] = useState(0);
  const [usedFstring, setUsedFstring] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('f"') || cmd.includes("f'")) setUsedFstring(true);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-1-3', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="Master of input and output! 📢" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Input & Output" pathId="python" />
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

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Build a Greeting</h2>
              <p className="text-sm text-gray-400">Create a variable and use an f-string to greet yourself!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">name = &quot;John&quot;</code> then <code className="text-[#39ff14]">print(f&quot;Hello, {'{name}'}!&quot;)</code></p>
            </div>
            <PythonRepl onCommand={handleCommand} height="200px" />
            {usedFstring && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Great use of f-strings!</p>
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
