'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "CSS Frameworks",
    content: "CSS frameworks give you pre-built styles so you don't start from scratch.\n\nWhy use them?\n• ⚡ Build faster — no writing CSS from zero\n• 🎨 Consistent design — everything looks good together\n• 📱 Built-in responsive design\n• 👥 Team-friendly — shared vocabulary\n\nPopular frameworks:\n• Tailwind CSS — Utility-first (most popular)\n• Bootstrap — Component-based (classic)\n• Bulma, Foundation, Materialize",
  },
  {
    title: "Tailwind CSS",
    content: "Tailwind uses utility classes directly in HTML:\n\nRaw CSS:\n.card {\n  background: white;\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0,0,0,.1);\n}\n\nTailwind:\n<div class=\"bg-white p-4 rounded-lg shadow\">\n\nCommon Tailwind classes:\n• p-4, px-2, py-6 — Padding\n• m-4, mx-auto — Margin\n• text-lg, font-bold — Typography\n• bg-blue-500, text-white — Colors\n• flex, grid, gap-4 — Layout\n• rounded-lg, shadow-md — Effects\n• w-full, h-screen — Sizing\n• hover:bg-blue-600 — States",
  },
  {
    title: "Quiz Time!",
    content: "Let's test your knowledge of CSS frameworks! Convert some raw CSS to Tailwind utility classes. 👇",
  },
];

const quizQuestions = [
  {
    q: "What Tailwind class gives padding of 16px (1rem)?",
    options: ["pad-4", "p-4", "padding-4", "space-4"],
    correct: 1,
  },
  {
    q: "How do you center a div horizontally with Tailwind?",
    options: ["center", "align-center", "mx-auto", "text-center"],
    correct: 2,
  },
  {
    q: "What Tailwind class makes text bold?",
    options: ["bold", "text-bold", "font-bold", "fw-bold"],
    correct: 2,
  },
  {
    q: "Which is a Tailwind background color class?",
    options: ["background-blue", "bg-blue-500", "color-blue-bg", "blue-bg"],
    correct: 1,
  },
  {
    q: "How do you make a flex container in Tailwind?",
    options: ["display-flex", "d-flex", "flex", "flexbox"],
    correct: 2,
  },
];

export default function CSSFrameworks() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === quizQuestions[qIdx].correct) setScore(s => s + 1);
  };

  const nextQ = () => {
    if (qIdx < quizQuestions.length - 1) {
      setQIdx(qIdx + 1);
      setAnswered(null);
    }
  };

  const handleFinish = () => {
    completeMission('web-4-2', 60);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="Framework-savvy developer! 🧰" backHref="/path/webdev" />;

  const q = quizQuestions[qIdx];
  const isLast = qIdx === quizQuestions.length - 1;
  const quizDone = isLast && answered !== null;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="CSS Frameworks" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Take the Quiz! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{qIdx + 1}/{quizQuestions.length}</span>
                <span className="text-xs" style={{ color: '#39ff14' }}>Score: {score}/{quizQuestions.length}</span>
              </div>
              <h3 className="font-semibold mb-3">{q.q}</h3>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${
                    answered === i
                      ? i === q.correct ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                      : answered !== null && i === q.correct ? 'bg-green-900/20 border border-green-800'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  <code>{opt}</code>
                </button>
              ))}
            </div>

            {answered !== null && !isLast && (
              <button onClick={nextQ} className="btn-primary w-full">Next Question →</button>
            )}

            {quizDone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>Quiz complete! {score}/{quizQuestions.length} correct! {score >= 3 ? '🎉' : 'Keep learning!'}</p>
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
