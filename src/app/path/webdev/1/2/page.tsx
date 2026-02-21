'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Why Semantics Matter",
    content: "HTML has TWO types of tags:\n\n❌ Generic: <div> and <span> — meaningless containers\n✅ Semantic: tags that DESCRIBE their content\n\nSemantic HTML helps:\n• 🦮 Screen readers navigate for blind users\n• 🔍 Google understand your page for SEO\n• 👩‍💻 Other developers read your code\n• 📱 Browsers render correctly",
  },
  {
    title: "The Semantic Tags",
    content: "<header> — Top of page/section (logo, nav)\n<nav> — Navigation links\n<main> — Primary content (one per page!)\n<section> — Thematic group of content\n<article> — Self-contained content (blog post, card)\n<aside> — Sidebar, related content\n<footer> — Bottom of page/section\n\n🚫 Don't: <div class=\"header\"><div class=\"nav\">...\n✅ Do: <header><nav>...",
  },
  {
    title: "Restructure a Page",
    content: "Time to fix a badly structured page! The page below uses only <div> tags.\n\nYour job: Replace the divs with the correct semantic tags. Make the web more accessible! 👇",
  },
];

const badCode = `<!-- This page uses only divs — BAD! -->
<!-- Replace divs with semantic tags: -->
<!-- header, nav, main, section, article, footer -->

<div class="header">
  <h1>My Blog</h1>
  <div class="nav">
    <a href="/">Home</a> |
    <a href="/about">About</a> |
    <a href="/contact">Contact</a>
  </div>
</div>

<div class="main">
  <div class="section">
    <h2>Latest Posts</h2>
    <div class="article">
      <h3>Learning HTML</h3>
      <p>HTML is the foundation of the web...</p>
    </div>
    <div class="article">
      <h3>CSS is Fun</h3>
      <p>Styling makes everything beautiful...</p>
    </div>
  </div>
</div>

<div class="footer">
  <p>&copy; 2025 My Blog</p>
</div>`;

export default function StructureSemantics() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasHeader = /<header[\s>]/.test(code);
    const hasNav = /<nav[\s>]/.test(code);
    const hasMain = /<main[\s>]/.test(code);
    const hasSection = /<section[\s>]/.test(code);
    const hasArticle = /<article[\s>]/.test(code);
    const hasFooter = /<footer[\s>]/.test(code);
    setCodeValid(hasHeader && hasNav && hasMain && hasFooter && (hasSection || hasArticle));
  };

  const handleFinish = () => {
    completeMission('web-1-2', 60);
    addAchievement('semantic-scholar');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="Semantic HTML master! ♿🔍" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Structure & Semantics" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Fix the Page! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Fix the Divs!</h2>
              <p className="text-sm text-gray-400">Replace <code className="text-red-400">&lt;div&gt;</code> tags with semantic tags: <code className="text-[#39ff14]">header, nav, main, section, article, footer</code></p>
            </div>

            <CodePreview initialCode={badCode} height="400px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ The page is now semantic and accessible!</p>
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
