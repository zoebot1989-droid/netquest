'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import JSConsole from '@/components/JSConsole';
import { completeMission, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "The DOM",
    content: "The DOM (Document Object Model) is how JavaScript sees your HTML page. Every HTML element becomes a JS object you can manipulate.\n\nThe browser builds a tree:\n\ndocument\n└── html\n    ├── head\n    │   └── title\n    └── body\n        ├── h1\n        ├── p\n        └── div\n\nJavaScript can read, change, add, or remove ANY element!",
  },
  {
    title: "Selecting Elements",
    content: "Find elements with:\n\ndocument.querySelector(\".class\")\ndocument.querySelector(\"#id\")\ndocument.querySelector(\"tag\")\ndocument.getElementById(\"id\")\n\nquerySelector returns the FIRST match.\nquerySelectorAll returns ALL matches.\n\nThink of it like CSS selectors — same syntax!",
  },
  {
    title: "Changing Elements",
    content: "Once you have an element, change it:\n\nel.textContent = \"New text\";\nel.innerHTML = \"<b>Bold</b> text\";\nel.style.color = \"red\";\nel.style.fontSize = \"24px\";\nel.classList.add(\"active\");\nel.classList.remove(\"hidden\");\nel.classList.toggle(\"dark\");\n\nYou can also create and remove elements:\ndocument.createElement(\"div\")\nel.remove()\n\nLet's manipulate the DOM! 👇",
  },
];

const simulatedDOM = {
  '#title': { textContent: 'Hello World', innerHTML: 'Hello World' },
  '.message': { textContent: 'Click to change me', innerHTML: 'Click to change me' },
  '#btn': { textContent: 'Click Me', innerHTML: 'Click Me' },
  'h1': { textContent: 'Hello World', innerHTML: 'Hello World' },
  'p': { textContent: 'Click to change me', innerHTML: 'Click to change me' },
};

export default function DOMManipulation() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [selected, setSelected] = useState(false);
  const [changed, setChanged] = useState(false);
  const [styled, setStyled] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('querySelector') || cmd.includes('getElementById')) setSelected(true);
    if (cmd.includes('textContent') || cmd.includes('innerHTML')) setChanged(true);
    if (cmd.includes('.style.') || cmd.includes('classList')) setStyled(true);
  };

  const handleFinish = () => {
    completeMission('web-3-2', 60);
    addAchievement('dom-wizard');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="DOM Wizard! 🧙" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="DOM Manipulation" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Manipulate the DOM! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="console" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-cyan-800/30">
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#00f0ff' }}>📄 Simulated Page</h3>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                <div><span className="text-purple-400">&lt;h1 id=&quot;title&quot;&gt;</span>Hello World<span className="text-purple-400">&lt;/h1&gt;</span></div>
                <div><span className="text-purple-400">&lt;p class=&quot;message&quot;&gt;</span>Click to change me<span className="text-purple-400">&lt;/p&gt;</span></div>
                <div><span className="text-purple-400">&lt;button id=&quot;btn&quot;&gt;</span>Click Me<span className="text-purple-400">&lt;/button&gt;</span></div>
              </div>
            </div>

            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge</h2>
              <p className="text-sm text-gray-400">1. Select an element: <code className="text-yellow-300">document.querySelector(&quot;#title&quot;)</code></p>
              <p className="text-sm text-gray-400">2. Change text: <code className="text-yellow-300">el.textContent = &quot;New&quot;</code></p>
              <p className="text-sm text-gray-400">3. Change style: <code className="text-yellow-300">el.style.color = &quot;red&quot;</code></p>
            </div>

            <JSConsole onCommand={handleCommand} height="200px" simulatedDOM={simulatedDOM} />

            <div className="card">
              <p className="text-xs text-gray-400">Progress:</p>
              <div className="flex flex-wrap gap-3 mt-1">
                <span className={`text-xs ${selected ? 'text-[#39ff14]' : 'text-gray-600'}`}>{selected ? '✅' : '○'} Select element</span>
                <span className={`text-xs ${changed ? 'text-[#39ff14]' : 'text-gray-600'}`}>{changed ? '✅' : '○'} Change content</span>
                <span className={`text-xs ${styled ? 'text-[#39ff14]' : 'text-gray-600'}`}>{styled ? '✅' : '○'} Change style</span>
              </div>
            </div>

            {selected && changed && styled && (
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
