'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "Mobile-First Design",
    content: "Over 60% of web traffic is mobile! Responsive design means your site looks great on ANY screen size.\n\nMobile-first approach:\n1. Design for small screens first\n2. Add complexity for larger screens\n3. Use media queries to adjust layout\n\nThe viewport meta tag is ESSENTIAL:\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\nWithout it, mobile browsers zoom out and your site looks tiny!",
  },
  {
    title: "Media Queries",
    content: "@media (min-width: 768px) {\n  /* Styles for tablets and up */\n}\n@media (min-width: 1024px) {\n  /* Styles for desktop */\n}\n\nCommon breakpoints:\n• 640px — Small phones → larger phones\n• 768px — Tablets\n• 1024px — Small laptops\n• 1280px — Desktops\n\nRelative units:\n• % — Relative to parent\n• em — Relative to font-size\n• rem — Relative to root font-size\n• vw/vh — % of viewport width/height",
  },
  {
    title: "Make It Responsive!",
    content: "Time to make a page responsive! Add media queries so the layout adapts from mobile to desktop. 👇",
  },
];

const responsiveCode = `<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { padding: 16px; }
  
  .navbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding: 12px;
    background: #1e293b;
    border-radius: 8px;
  }
  .navbar a { color: #38bdf8; text-decoration: none; }
  
  .cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .card {
    background: #1e293b;
    padding: 20px;
    border-radius: 8px;
    border-left: 3px solid #3b82f6;
  }
  
  /* TODO: Add media queries! */
  /* At 768px: navbar should be flex-direction: row */
  /* At 768px: cards should be 2 columns */
  /* At 1024px: cards should be 3 columns */
  
  /* @media (min-width: 768px) { ... } */
  /* @media (min-width: 1024px) { ... } */
  
</style>

<div class="navbar">
  <a href="#"><strong>MySite</strong></a>
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Contact</a>
</div>

<div class="cards">
  <div class="card"><h3>Card 1</h3><p>Responsive design rocks!</p></div>
  <div class="card"><h3>Card 2</h3><p>Mobile-first FTW</p></div>
  <div class="card"><h3>Card 3</h3><p>Media queries are powerful</p></div>
  <div class="card"><h3>Card 4</h3><p>Breakpoints matter</p></div>
  <div class="card"><h3>Card 5</h3><p>Relative units rule</p></div>
  <div class="card"><h3>Card 6</h3><p>Viewport meta is essential</p></div>
</div>`;

export default function ResponsiveDesign() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasMediaQuery = /@media/.test(code);
    const has768 = /min-width\s*:\s*768px/.test(code);
    const hasColumns = /grid-template-columns/.test(code) && (code.match(/grid-template-columns/g) || []).length >= 2;
    setCodeValid(hasMediaQuery && has768 && hasColumns);
  };

  const handleFinish = () => {
    completeMission('web-4-1', 60);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="Responsive design pro! 📱💻" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Responsive Design" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Go Responsive! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Add Media Queries!</h2>
              <p className="text-sm text-gray-400">Make the layout responsive: at 768px, make the navbar horizontal and cards 2-column. At 1024px, make cards 3-column.</p>
            </div>

            <CodePreview initialCode={responsiveCode} height="450px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Responsive! Try resizing the preview to see it adapt!</p>
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
