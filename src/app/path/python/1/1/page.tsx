'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is Python?",
    content: "Python is one of the most popular programming languages in the world. Created by Guido van Rossum in 1991, it's known for being easy to read and write — almost like English.\n\nPython is used EVERYWHERE:\n• 🤖 AI & Machine Learning (ChatGPT, TensorFlow)\n• 🌐 Web development (Instagram, Spotify)\n• 🔬 Data science & research\n• 🎮 Game development\n• 🤖 Automation & scripting\n• 🔐 Cybersecurity tools",
  },
  {
    title: "Why Python?",
    content: "Python is the #1 language for beginners because:\n\n• Clean, readable syntax — no curly braces or semicolons\n• Huge community — millions of developers, tons of help online\n• Massive library ecosystem — there's a library for EVERYTHING\n• High demand — Python devs are some of the highest paid\n• Versatile — web, AI, data, automation, games\n\nIf you could only learn ONE language, Python is the best choice.",
  },
  {
    title: "Your First Python Code",
    content: "In Python, you display text with the print() function:\n\nprint(\"Hello, World!\")\n\nThat's it. One line. No boilerplate, no setup.\n\nCompare that to Java:\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}\n\nPython keeps it simple. Let's try it! 👇",
  },
];

export default function HelloPython() {
  const [step, setStep] = useState(0);
  const [printedHello, setPrintedHello] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string, output: string) => {
    if (cmd.includes('print') && (output.toLowerCase().includes('hello') || cmd.toLowerCase().includes('hello'))) {
      setPrintedHello(true);
      addAchievement('hello-world');
    }
  };

  const handleFinish = () => {
    completeMission('py-1-1', 40);
    addAchievement('pythonista');
    addAchievement('first-mission');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={40} message="Welcome to Python! 🐍" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Hello Python!" pathId="python" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🐍 Python code looks like this:</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span className="text-purple-400">name</span> <span className="text-gray-500">=</span> <span className="text-yellow-300">&quot;John&quot;</span></div>
                  <div><span className="text-blue-400">print</span>(<span className="text-yellow-300">f&quot;Hello, </span><span className="text-orange-300">{'{name}'}</span><span className="text-yellow-300">!&quot;</span>)</div>
                  <div className="text-gray-300 mt-1">Hello, John!</div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Try it Yourself! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Say Hello!</h2>
              <p className="text-sm text-gray-400">Type <code className="text-[#39ff14]">print(&quot;Hello, World!&quot;)</code> in the Python REPL below.</p>
              <p className="text-xs text-gray-500 mt-1">Try other things too! Math like <code>2 + 2</code>, or <code>print(&quot;your name&quot;)</code></p>
            </div>

            <PythonRepl onCommand={handleCommand} height="200px" />

            {printedHello && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Nice! You printed your first message!</p>
                </div>
                <button onClick={handleFinish} className="btn-primary w-full">Complete Mission →</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
