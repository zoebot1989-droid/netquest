'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is HTML?",
    content: "HTML (HyperText Markup Language) is the skeleton of every website. It tells the browser WHAT to display.\n\nEvery website you've ever visited — Google, YouTube, Reddit — is built on HTML. It's the foundation of the web.\n\nHTML uses **tags** to create elements:\n• <h1> — Heading\n• <p> — Paragraph\n• <a> — Link\n• <img> — Image\n• <div> — Container",
  },
  {
    title: "Tags, Elements & Attributes",
    content: "HTML tags come in pairs (usually):\n\n<h1>Hello World</h1>\n  ↑ opening tag    ↑ closing tag\n\nThe whole thing is an **element**.\n\nTags can have **attributes** — extra info:\n<a href=\"https://google.com\">Click me</a>\n<img src=\"photo.jpg\" alt=\"A photo\">\n\n• href — where a link goes\n• src — where an image comes from\n• alt — description for accessibility\n• class — for CSS styling\n• id — unique identifier",
  },
  {
    title: "Building a Page",
    content: "Every HTML page has this structure:\n\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <!-- Content goes here -->\n  </body>\n</html>\n\n• <head> — metadata (title, links, etc.)\n• <body> — what users see\n• <!-- --> — comments (invisible to users)\n\nLet's build one! 👇",
  },
];

export default function SkeletonOfTheWeb() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const initialCode = `<h1>My First Website</h1>
<p>Welcome to my page!</p>

<!-- Try adding: -->
<!-- An image: <img src="https://picsum.photos/200" alt="random"> -->
<!-- A link: <a href="https://example.com">Click here</a> -->
<!-- A list: <ul><li>Item 1</li><li>Item 2</li></ul> -->`;

  const handleCodeChange = (code: string) => {
    const hasH1 = /<h1[^>]*>/.test(code);
    const hasP = /<p[^>]*>/.test(code);
    const hasExtra = /<(a|img|ul|ol|li|div|span|strong|em)\b/.test(code);
    setCodeValid(hasH1 && hasP && hasExtra);
  };

  const handleFinish = () => {
    completeMission('web-1-1', 50);
    addAchievement('web-weaver');
    addAchievement('first-mission');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={50} message="You built your first web page! 🌐" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="The Skeleton of the Web" pathId="webdev" />
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
                <p className="text-xs text-gray-400 mb-2">🌐 HTML creates structure:</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span className="text-purple-400">&lt;h1&gt;</span><span className="text-white">Hello World!</span><span className="text-purple-400">&lt;/h1&gt;</span></div>
                  <div><span className="text-purple-400">&lt;p&gt;</span><span className="text-white">This is a paragraph.</span><span className="text-purple-400">&lt;/p&gt;</span></div>
                  <div><span className="text-purple-400">&lt;a </span><span className="text-yellow-300">href=&quot;#&quot;</span><span className="text-purple-400">&gt;</span><span className="text-white">A link</span><span className="text-purple-400">&lt;/a&gt;</span></div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Try it Yourself! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Build a Web Page!</h2>
              <p className="text-sm text-gray-400">Edit the HTML and click <strong>Run</strong> to see it render live. Add at least one link, image, or list!</p>
            </div>

            <CodePreview initialCode={initialCode} height="350px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Awesome! Your page has a heading, paragraph, AND extra elements!</p>
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
