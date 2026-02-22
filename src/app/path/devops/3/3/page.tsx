'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Why Testing Matters",
    content: "Without automated tests, you're deploying and praying. 🙏\n\nTests catch bugs BEFORE they reach users:\n• Save debugging time\n• Give confidence to refactor\n• Document how code should behave\n• Required for CI/CD pipelines\n\nRule of thumb: if it's not tested, it's broken — you just don't know it yet.",
  },
  {
    title: "The Test Pyramid",
    content: "Tests come in layers (bottom = most, top = least):\n\n🔺 E2E Tests — test the whole app (slow, expensive)\n🔳 Integration Tests — test components together\n🟩 Unit Tests — test individual functions (fast, cheap)\n\nYou should have MANY unit tests, some integration tests, and FEW E2E tests.\n\nPopular frameworks:\n• Jest, Vitest — JavaScript\n• pytest — Python\n• JUnit — Java\n• Cypress, Playwright — E2E",
  },
  {
    title: "Linting & Code Quality",
    content: "Linting = automated code style checking\n\nTools:\n• ESLint — JavaScript/TypeScript\n• Prettier — code formatting\n• Black — Python formatting\n• SonarQube — code quality analysis\n\nCode coverage = % of code executed by tests\n• 80%+ is a good target\n• 100% is rarely practical\n• Coverage doesn't mean quality — bad tests can hit 100%",
  },
];

export default function TestingQuality() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "Which type of test should you have the MOST of?", options: ['E2E tests', 'Integration tests', 'Unit tests', 'Manual tests'], correct: 2 },
    { q: "What is code coverage?", options: ['How many developers work on the code', 'Percentage of code executed by tests', 'Number of tests written', 'How much documentation exists'], correct: 1 },
    { q: "What does a linter do?", options: ['Runs tests', 'Deploys code', 'Checks code style and catches errors', 'Compiles code'], correct: 2 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-3-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You understand testing and quality!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Testing & Quality" pathId="devops" />
      <AnimatePresence mode="wait">
        {step < lessons.length && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/{lessons.length}</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 1 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🔺 Test Pyramid:</p>
                <pre className="font-mono text-xs text-center text-gray-300">{`      /  E2E  \\        Few, slow
     /________\\
    / Integra- \\      Some
   /  tion      \\
  /______________\\
 /    Unit Tests  \\   Many, fast
/__________________ \\`}</pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Take the Quiz →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
