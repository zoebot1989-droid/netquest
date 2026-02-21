'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Flexbox",
    content: "Flexbox is the modern way to lay out elements in a row or column.\n\ndisplay: flex; — Makes children flex items\nflex-direction: row | column\njustify-content: center | space-between | space-around\nalign-items: center | flex-start | flex-end\ngap: 10px — Space between items\nflex-wrap: wrap — Allow wrapping\n\nFlexbox is ONE-dimensional — it handles either rows OR columns.",
  },
  {
    title: "CSS Grid",
    content: "Grid is for TWO-dimensional layouts (rows AND columns).\n\ndisplay: grid;\ngrid-template-columns: 1fr 1fr 1fr; — 3 equal columns\ngrid-template-columns: 200px 1fr; — Sidebar + content\ngrid-template-rows: auto 1fr auto;\ngap: 20px;\n\nfr = fraction of remaining space\nauto = size to content\n\nUse Flexbox for navbars, cards. Use Grid for page layouts.",
  },
  {
    title: "Layout Challenge",
    content: "Time to use Flexbox and Grid! Match the target layout by writing CSS. Make boxes arrange in rows and columns. 👇",
  },
];

const layoutCode = `<style>
  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .box {
    background: #3b82f6;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: white;
    font-weight: bold;
  }
  /* TODO: Create a 3-column grid layout */
  .grid-layout {
    /* Add: display: grid; */
    /* Add: grid-template-columns: 1fr 1fr 1fr; */
    /* Add: gap: 10px; */
  }
  /* TODO: Center the footer with flexbox */
  .footer {
    /* Add: display: flex; */
    /* Add: justify-content: center; */
    /* Add: padding: 20px; */
  }
</style>

<h2>Flexbox Row:</h2>
<div class="flex-row">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>

<h2>Grid Layout:</h2>
<div class="grid-layout">
  <div class="box">A</div>
  <div class="box">B</div>
  <div class="box">C</div>
  <div class="box">D</div>
  <div class="box">E</div>
  <div class="box">F</div>
</div>

<div class="footer">
  <p>Centered Footer ✨</p>
</div>`;

export default function FlexboxGrid() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasGrid = /display\s*:\s*grid/.test(code);
    const hasColumns = /grid-template-columns/.test(code);
    const hasFlex = (code.match(/display\s*:\s*flex/g) || []).length >= 2;
    const hasCenter = /justify-content\s*:\s*center/.test(code);
    setCodeValid(hasGrid && hasColumns && hasFlex && hasCenter);
  };

  const handleFinish = () => {
    completeMission('web-2-3', 70);
    addAchievement('flex-lord');
    addAchievement('style-master');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={70} message="Flexbox & Grid master! 📐" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Flexbox & Grid" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Layout Challenge! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Complete the Layout!</h2>
              <p className="text-sm text-gray-400">Fill in the CSS for <code>.grid-layout</code> (use Grid) and <code>.footer</code> (use Flexbox to center it).</p>
            </div>

            <CodePreview initialCode={layoutCode} height="450px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Perfect layout! You&apos;ve mastered Flexbox AND Grid!</p>
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
