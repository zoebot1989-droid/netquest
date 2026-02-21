'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Build a Portfolio!",
    content: "Time to put EVERYTHING together! You're going to build a personal portfolio website using HTML, CSS, and JavaScript.\n\nA great portfolio includes:\n• 👤 Your name & intro (hero section)\n• 🛠️ Skills section\n• 📂 Projects showcase\n• 📧 Contact info\n• 🎨 Clean, responsive design\n• ⚡ Interactive elements",
  },
  {
    title: "Planning",
    content: "Structure your portfolio:\n\n<header> — Nav with links\n<main>\n  <section> — Hero (name, tagline)\n  <section> — About me\n  <section> — Skills (grid of skill cards)\n  <section> — Projects (cards with links)\n  <section> — Contact (form or links)\n</main>\n<footer> — Copyright\n\nUse CSS Grid/Flexbox for layout, smooth scrolling, and a color scheme you like!",
  },
  {
    title: "Let's Build!",
    content: "Build your portfolio in the code editor! A starter template is provided — customize it to make it YOURS. Change the name, add your skills, make it look amazing! 👇",
  },
];

const portfolioCode = `<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; color: #e2e8f0; background: #0f172a; }
  
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: #1e293b;
  }
  nav a { color: #38bdf8; text-decoration: none; margin-left: 16px; }
  nav a:hover { color: #7dd3fc; }
  
  .hero {
    text-align: center;
    padding: 80px 24px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
  .hero h1 { font-size: 2.5rem; margin-bottom: 8px; }
  .hero .accent { color: #38bdf8; }
  .hero p { color: #94a3b8; font-size: 1.1rem; }
  
  section { padding: 40px 24px; max-width: 800px; margin: 0 auto; }
  section h2 { color: #38bdf8; margin-bottom: 16px; font-size: 1.5rem; }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .skill {
    background: #1e293b;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
    font-size: 0.9rem;
  }
  .skill .emoji { font-size: 1.5rem; display: block; margin-bottom: 4px; }
  
  .projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .project {
    background: #1e293b;
    padding: 20px;
    border-radius: 8px;
    border-left: 3px solid #3b82f6;
  }
  .project h3 { margin-bottom: 4px; }
  .project p { color: #94a3b8; font-size: 0.85rem; }
  
  footer {
    text-align: center;
    padding: 24px;
    color: #64748b;
    border-top: 1px solid #1e293b;
  }
  
  /* Add a hover effect! */
  .project:hover { border-color: #38bdf8; transform: translateY(-2px); transition: all 0.2s; }
</style>

<nav>
  <strong>John.dev</strong>
  <div>
    <a href="#about">About</a>
    <a href="#skills">Skills</a>
    <a href="#projects">Projects</a>
  </div>
</nav>

<div class="hero">
  <h1>Hi, I'm <span class="accent">John</span> 👋</h1>
  <p>Aspiring developer • Learning web dev • Building cool stuff</p>
</div>

<section id="about">
  <h2>About Me</h2>
  <p>I'm learning web development through NetQuest! I love building things and solving problems with code.</p>
</section>

<section id="skills">
  <h2>Skills</h2>
  <div class="skills-grid">
    <div class="skill"><span class="emoji">🏗️</span>HTML</div>
    <div class="skill"><span class="emoji">🎨</span>CSS</div>
    <div class="skill"><span class="emoji">⚡</span>JavaScript</div>
    <!-- Add more skills! -->
  </div>
</section>

<section id="projects">
  <h2>Projects</h2>
  <div class="projects-grid">
    <div class="project">
      <h3>🌐 Portfolio Website</h3>
      <p>My first website built with HTML, CSS & JS</p>
    </div>
    <div class="project">
      <h3>🎮 NetQuest Progress</h3>
      <p>Completed the Web Dev learning path!</p>
    </div>
    <!-- Add more projects! -->
  </div>
</section>

<footer>
  <p>&copy; 2025 John • Built with ❤️ and code</p>
</footer>`;

export default function BuildAWebsite() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasNav = /<nav[\s>]/.test(code);
    const hasHero = /hero/.test(code);
    const hasSkills = /skills/.test(code);
    const hasProjects = /projects/.test(code);
    const hasFooter = /<footer[\s>]/.test(code);
    const hasStyle = /<style[\s>]/.test(code);
    // Must have at least some customization
    const isCustomized = !code.includes("John.dev") || code.includes("skill") || code.length > portfolioCode.length - 50;
    setCodeValid(hasNav && hasHero && hasSkills && hasProjects && hasFooter && hasStyle && isCustomized);
  };

  const handleFinish = () => {
    completeMission('web-5-3', 100);
    addAchievement('full-stack-starter');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={100} message="🎉 You built a website! Web Dev path COMPLETE!" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Build a Website" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Start Building! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Final Challenge: Your Portfolio!</h2>
              <p className="text-sm text-gray-400">Customize the template — change names, add skills, add projects, tweak the colors. Make it YOURS!</p>
              <p className="text-xs text-gray-500 mt-1">Click Run to see your changes live ✨</p>
            </div>

            <CodePreview initialCode={portfolioCode} height="500px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Your portfolio looks amazing! You&apos;ve completed the entire Web Dev path! 🏆</p>
                </div>
                <button onClick={handleFinish} className="btn-primary w-full">🎉 Complete Web Dev Path! →</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
