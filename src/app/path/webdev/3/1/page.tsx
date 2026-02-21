'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import JSConsole from '@/components/JSConsole';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "What is JavaScript?",
    content: "JavaScript (JS) makes websites INTERACTIVE. HTML is the skeleton, CSS is the skin, and JS is the brain.\n\nJS can:\n• 🖱️ Respond to clicks, typing, scrolling\n• 🔄 Change page content dynamically\n• 📡 Fetch data from servers\n• 🎮 Run games and animations\n• 💾 Store data locally\n\nJS runs in EVERY browser — no installation needed!",
  },
  {
    title: "Variables & Data Types",
    content: "Store data in variables:\n\nlet name = \"John\";      // can be reassigned\nconst age = 15;          // cannot be reassigned\n\nData types:\n• String: \"hello\" or 'hello'\n• Number: 42, 3.14\n• Boolean: true, false\n• null: intentionally empty\n• undefined: not yet assigned\n• Array: [1, 2, 3]\n• Object: { name: \"John\", age: 15 }",
  },
  {
    title: "Console & Output",
    content: "console.log() prints to the browser console:\n\nconsole.log(\"Hello!\");\nconsole.log(42);\nconsole.log(2 + 2);\n\nThe console is your best friend for debugging! Every developer uses it constantly.\n\nMath works like you'd expect:\n2 + 3    → 5\n10 - 4   → 6\n3 * 7    → 21\n10 / 3   → 3.333...\n10 % 3   → 1 (remainder)\n\nLet's try it! 👇",
  },
];

export default function MakingPagesInteractive() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [logged, setLogged] = useState(false);
  const [usedVar, setUsedVar] = useState(false);

  const handleCommand = (cmd: string, output: string) => {
    if (cmd.includes('console.log')) setLogged(true);
    if (cmd.includes('let ') || cmd.includes('const ') || cmd.includes('var ')) setUsedVar(true);
  };

  const handleFinish = () => {
    completeMission('web-3-1', 50);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={50} message="JavaScript activated! ⚡" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Making Pages Interactive" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Open the Console! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="console" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Use the Console!</h2>
              <p className="text-sm text-gray-400">1. Type <code className="text-yellow-300">console.log(&quot;Hello!&quot;)</code></p>
              <p className="text-sm text-gray-400">2. Create a variable: <code className="text-yellow-300">let x = 42</code></p>
              <p className="text-xs text-gray-500 mt-1">Try math too! <code>2 + 2</code>, <code>10 * 5</code>, <code>&quot;hello&quot; + &quot; world&quot;</code></p>
            </div>

            <JSConsole onCommand={handleCommand} height="220px" />

            <div className="card">
              <p className="text-xs text-gray-400">Progress:</p>
              <div className="flex gap-4 mt-1">
                <span className={`text-xs ${logged ? 'text-[#39ff14]' : 'text-gray-600'}`}>{logged ? '✅' : '○'} console.log()</span>
                <span className={`text-xs ${usedVar ? 'text-[#39ff14]' : 'text-gray-600'}`}>{usedVar ? '✅' : '○'} Create a variable</span>
              </div>
            </div>

            {logged && usedVar && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={handleFinish} className="btn-primary w-full">Complete Mission →</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
