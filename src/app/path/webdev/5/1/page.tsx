'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "Chrome DevTools",
    content: "DevTools is the most powerful tool in a web developer's arsenal. Press F12 (or Ctrl+Shift+I) to open it.\n\n📋 Elements — See & edit HTML/CSS live\n💻 Console — Run JS, see errors & logs\n🌐 Network — Watch HTTP requests\n📁 Sources — View & debug JS files\n📊 Performance — Find slowdowns\n💾 Application — Storage, cookies, cache\n\nEVERY developer uses DevTools daily. It's how you debug, test, and understand websites.",
  },
  {
    title: "Elements & Console",
    content: "Elements tab:\n• Click any element → see its HTML\n• Edit HTML/CSS live (right-click → Edit)\n• See the box model visually\n• Computed styles → final CSS values\n• Hover elements to highlight them\n\nConsole tab:\n• Red = errors (click for details)\n• Yellow = warnings\n• Type JS to test things\n• console.log() from your code appears here\n• $0 = currently selected element\n\nThe console is your REPL for the browser!",
  },
  {
    title: "Network & Debugging",
    content: "Network tab:\n• Shows every HTTP request\n• Status: 200 ✅, 404 ❌, 500 💥\n• Click a request → see headers, body, response\n• Filter by type: JS, CSS, images, fetch/XHR\n• Throttle to simulate slow connections\n\nDebugging tips:\n• console.log() everything suspicious\n• Breakpoints: pause JS execution\n• debugger; statement = instant breakpoint\n• Right-click → Break on... for DOM changes\n\nLet's find some bugs! 👇",
  },
];

const bugQuestions = [
  {
    title: "Bug #1: Missing Image",
    code: '<img src="photo.jpg" alt="My photo">',
    question: "This image shows a broken icon. What's most likely wrong?",
    options: [
      "The alt text is wrong",
      "The file 'photo.jpg' doesn't exist at that path",
      "img tags need a closing tag",
      "The src attribute should be href",
    ],
    correct: 1,
    explanation: "The Network tab would show a 404 error for 'photo.jpg'. The file path is wrong or the file doesn't exist!",
  },
  {
    title: "Bug #2: Nothing Happens",
    code: 'document.querySelector("#buton").addEventListener("click", handler);',
    question: "Clicking the button does nothing. What's the bug?",
    options: [
      "addEventListener is spelled wrong",
      "handler is not a valid function name",
      "#buton is misspelled (should be #button)",
      "click should be onClick",
    ],
    correct: 2,
    explanation: "Typo! '#buton' doesn't match any element. querySelector returns null, causing an error. The Console tab would show: 'Cannot read property addEventListener of null'",
  },
  {
    title: "Bug #3: Style Not Applied",
    code: '.card {\n  colour: red;\n  font-sise: 20px;\n}',
    question: "The text isn't red and not 20px. Why?",
    options: [
      "CSS doesn't support red",
      "'colour' and 'font-sise' are misspelled",
      "You need !important",
      "The selector is wrong",
    ],
    correct: 1,
    explanation: "Typos! 'colour' should be 'color' and 'font-sise' should be 'font-size'. CSS silently ignores invalid properties — check the Elements tab for strikethrough styles!",
  },
  {
    title: "Bug #4: Infinite Loop",
    code: 'let i = 0;\nwhile (i < 10) {\n  console.log(i);\n  // forgot i++\n}',
    question: "The page freezes. What's wrong?",
    options: [
      "while loops don't work in JS",
      "console.log is too slow",
      "i is never incremented — infinite loop!",
      "let should be var",
    ],
    correct: 2,
    explanation: "Without i++, the condition i < 10 is ALWAYS true. The loop runs forever, freezing the page. Always make sure your loops will eventually end!",
  },
];

export default function DeveloperTools() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [bugIdx, setBugIdx] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === bugQuestions[bugIdx].correct) setScore(s => s + 1);
  };

  const nextBug = () => {
    setBugIdx(bugIdx + 1);
    setAnswered(null);
  };

  const handleFinish = () => {
    completeMission('web-5-1', 60);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="Bug hunter! 🔍🐛" backHref="/path/webdev" />;

  const bug = bugQuestions[bugIdx];
  const isLast = bugIdx === bugQuestions.length - 1;
  const allDone = isLast && answered !== null;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Developer Tools" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Find the Bugs! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key={`bug-${bugIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-red-800/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-400">{bug.title}</h3>
                <span className="text-xs" style={{ color: '#39ff14' }}>{score}/{bugQuestions.length}</span>
              </div>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-gray-300 mb-3 whitespace-pre-wrap">{bug.code}</div>
              <p className="text-sm text-gray-400 mb-3">{bug.question}</p>
              {bug.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${
                    answered === i
                      ? i === bug.correct ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                      : answered !== null && i === bug.correct ? 'bg-green-900/20 border border-green-800'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
              {answered !== null && (
                <p className="text-xs text-gray-400 mt-2 p-2 bg-black/30 rounded">{bug.explanation}</p>
              )}
            </div>

            {answered !== null && !isLast && (
              <button onClick={nextBug} className="btn-primary w-full">Next Bug →</button>
            )}

            {allDone && (
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
