'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What are Dictionaries?",
    content: "Dictionaries store key-value pairs — like a real dictionary maps words to definitions:\n\nperson = {\n    \"name\": \"John\",\n    \"age\": 14,\n    \"cool\": True\n}\n\nAccess values by key:\nperson[\"name\"]   →  \"John\"\nperson[\"age\"]    →  14\n\nKeys are usually strings. Values can be anything!",
  },
  {
    title: "Modifying Dictionaries",
    content: "Add or change values:\nperson[\"email\"] = \"john@example.com\"  # add new\nperson[\"age\"] = 15                    # update\n\nRemove:\ndel person[\"cool\"]\nperson.pop(\"email\")\n\nUseful methods:\nperson.keys()    →  all keys\nperson.values()  →  all values\nperson.items()   →  key-value pairs\nperson.get(\"name\", \"Unknown\")  # safe access with default",
  },
  {
    title: "Nested Dictionaries",
    content: "Dictionaries can contain other dictionaries:\n\nstudents = {\n    \"john\": {\"age\": 14, \"grade\": \"A\"},\n    \"jane\": {\"age\": 15, \"grade\": \"B\"}\n}\n\nstudents[\"john\"][\"grade\"]  →  \"A\"\n\nThis is how real-world data is structured — APIs return data just like this (JSON is basically Python dicts!).",
  },
];

const quizQuestions = [
  { q: "How do you access a value in a dictionary?", options: ['dict.value', 'dict[key]', 'dict(key)', 'dict->key'], correct: 1 },
  { q: "What does .keys() return?", options: ['All values', 'All key-value pairs', 'All keys', 'The first key'], correct: 2 },
  { q: "What happens if you access a key that doesn't exist with dict[key]?", options: ['Returns None', 'Returns 0', 'Raises a KeyError', 'Returns an empty string'], correct: 2 },
];

export default function Dictionaries() {
  const [step, setStep] = useState(0);
  const [dictOps, setDictOps] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('{') || cmd.includes('.keys') || cmd.includes('.values') || cmd.includes('.items') || cmd.match(/\w+\[/)) {
      setDictOps(prev => prev + 1);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-3-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="Dictionary master! 📖" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Dictionaries" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Build a Contact Book! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Contact Book</h2>
              <p className="text-sm text-gray-400">Build a contact dictionary and explore it!</p>
              <p className="text-xs text-gray-500 mt-1">Try: <code className="text-[#39ff14]">{`contact = {"name": "John", "age": 14}`}</code></p>
              <p className="text-xs text-gray-500">Then: <code className="text-[#39ff14]">contact.keys()</code> or <code className="text-[#39ff14]">contact[&quot;name&quot;]</code></p>
              <p className="text-xs text-gray-500">Progress: {Math.min(dictOps, 3)}/3 operations</p>
            </div>
            <PythonRepl onCommand={handleCommand} height="220px" />
            {dictOps >= 3 && (
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
