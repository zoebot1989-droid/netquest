'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "What is CSS?",
    content: "CSS (Cascading Style Sheets) makes HTML look GOOD. Without CSS, every website would be plain black text on a white background.\n\nCSS controls:\n• 🎨 Colors & backgrounds\n• 📏 Size & spacing\n• 🔤 Fonts & text\n• 📐 Layout & positioning\n• ✨ Animations & transitions",
  },
  {
    title: "Selectors",
    content: "CSS uses SELECTORS to target HTML elements:\n\n• Element: h1 { color: red; }\n• Class: .highlight { background: yellow; }\n• ID: #header { font-size: 24px; }\n• Descendant: nav a { color: blue; }\n\nClass (.name) is the most common — use it everywhere!\nID (#name) is unique — only one per page.",
  },
  {
    title: "Key Properties",
    content: "Essential CSS properties:\n\ncolor — Text color\nbackground — Background color/image\nfont-size — Text size (px, em, rem)\nfont-family — Font face\nmargin — Space OUTSIDE element\npadding — Space INSIDE element\nborder — Border around element\nwidth / height — Element dimensions\ntext-align — center, left, right\nborder-radius — Rounded corners\n\nLet's style a page! 👇",
  },
];

const styleCode = `<style>
  /* Style the page! Change colors, fonts, spacing */
  h1 {
    color: #00f0ff;
    text-align: center;
  }
  .card {
    background: #1e293b;
    padding: 20px;
    border-radius: 12px;
    margin: 10px 0;
  }
  /* Try adding styles for: */
  /* .highlight, p, a, .btn */
</style>

<h1>My Styled Page</h1>

<div class="card">
  <h2>Welcome!</h2>
  <p>This page looks <span class="highlight">amazing</span> with CSS.</p>
  <a href="#" class="btn">Click Me</a>
</div>

<div class="card">
  <h2>About</h2>
  <p>CSS makes everything beautiful. Try changing the colors above!</p>
</div>`;

export default function MakingThingsPretty() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasStyle = /<style[\s>]/.test(code);
    const hasColor = /color\s*:/.test(code);
    const hasBg = /background/.test(code);
    const hasPadding = /padding/.test(code);
    const hasMultipleSelectors = (code.match(/\{/g) || []).length >= 4;
    setCodeValid(hasStyle && hasColor && hasBg && hasPadding && hasMultipleSelectors);
  };

  const handleFinish = () => {
    completeMission('web-2-1', 50);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={50} message="CSS wizard! Your page looks great! 🎨" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Making Things Pretty" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Style a Page! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Style the Page!</h2>
              <p className="text-sm text-gray-400">Add more CSS rules — style the <code>.highlight</code>, <code>p</code>, <code>a</code>, and <code>.btn</code> classes. Make it look great!</p>
            </div>

            <CodePreview initialCode={styleCode} height="400px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Beautiful! You&apos;re styling like a pro!</p>
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
