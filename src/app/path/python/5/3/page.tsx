'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Putting It All Together",
    content: "You've learned variables, control flow, data structures, functions, file I/O, and APIs. Now let's build a real tool!\n\nA good CLI tool:\n1. Gets input from the user\n2. Processes the data\n3. Outputs useful results\n4. Handles errors gracefully\n\nWe'll build a Contact Book — a program that stores, searches, and manages contacts using everything you've learned.",
  },
  {
    title: "Planning the Tool",
    content: "Our Contact Book needs:\n\n• A dictionary to store contacts\n  contacts = {}\n\n• Functions for each action:\n  def add_contact(name, phone, email):\n      contacts[name] = {\"phone\": phone, \"email\": email}\n\n  def find_contact(name):\n      if name in contacts:\n          return contacts[name]\n      return None\n\n  def list_contacts():\n      for name, info in contacts.items():\n          print(f\"{name}: {info['phone']}\")\n\n• A main loop with a menu\n• Error handling with try/except",
  },
  {
    title: "The Main Loop",
    content: "Every CLI tool has a main loop:\n\ndef main():\n    while True:\n        print(\"\\n=== Contact Book ===\")\n        print(\"1. Add contact\")\n        print(\"2. Find contact\")\n        print(\"3. List all\")\n        print(\"4. Quit\")\n        choice = input(\"Choose: \")\n\n        if choice == \"1\":\n            name = input(\"Name: \")\n            phone = input(\"Phone: \")\n            add_contact(name, phone, \"\")\n            print(f\"Added {name}!\")\n        elif choice == \"4\":\n            print(\"Goodbye!\")\n            break\n        else:\n            print(\"Invalid choice\")\n\nmain()\n\nThis uses EVERYTHING: variables, loops, conditionals, dicts, functions, input/output, and f-strings!",
  },
];

const quizQuestions = [
  { q: "What data structure is best for storing contacts by name?", options: ['List', 'Dictionary', 'Tuple', 'Set'], correct: 1 },
  { q: "What keyword exits a while True loop?", options: ['exit', 'stop', 'break', 'return'], correct: 2 },
  { q: "What should you wrap user input processing in?", options: ['for loop', 'try/except', 'while loop', 'if/else only'], correct: 1 },
  { q: "Which Python concepts did we use in this tool?", options: ['Only variables and print', 'Only functions', 'Only loops', 'Variables, functions, dicts, loops, conditionals, f-strings'], correct: 3 },
];

export default function BuildATool() {
  const [step, setStep] = useState(0);
  const [toolBuilt, setToolBuilt] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (
      (cmd.includes('def ') && cmd.includes('contact')) ||
      (cmd.includes('contacts') && cmd.includes('{')) ||
      (cmd.includes('while') && cmd.includes('True'))
    ) {
      setToolBuilt(true);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-5-3', 100);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={100} message="You built a real Python tool! 🐍🎉 Python path complete!" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Build a Tool" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Build It! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Build Your Contact Book</h2>
              <p className="text-sm text-gray-400">Try building parts of the contact book! Define a contacts dict, write a function, or create the main loop.</p>
              <p className="text-xs text-gray-500 mt-2">Try: <code className="text-[#39ff14]">contacts = {'{}'}</code> then <code className="text-[#39ff14]">def add_contact(name, phone):</code></p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {toolBuilt ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Nice work building your tool!</p>
                </div>
                <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Final Quiz →</button>
              </motion.div>
            ) : (
              <button onClick={() => setStep(4)} className="text-gray-500 text-xs text-center w-full py-2">Skip to quiz →</button>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Final Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
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
