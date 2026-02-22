'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Types of Web Hosting",
    content: "When you deploy a website, you need a server. Here are the main options:\n\n🏠 Shared Hosting — Your site shares a server with hundreds of others. Cheapest ($3-10/mo) but slowest.\n\n🖥️ VPS — Virtual Private Server. Your own virtual machine on shared hardware. Good balance ($5-40/mo).\n\n🏗️ Dedicated Server — Entire physical server just for you. Expensive ($80-500/mo) but maximum performance.\n\n☁️ Cloud Hosting — Scalable servers (AWS, GCP, Azure). Pay for what you use. Can scale up instantly.",
  },
  {
    title: "Comparing Options",
    content: "Shared: ✅ Cheapest ✅ Easy setup ❌ Slow ❌ No root access ❌ Noisy neighbors\n\nVPS: ✅ Root access ✅ Affordable ✅ Good performance ❌ You manage it ❌ Fixed resources\n\nDedicated: ✅ Full power ✅ No sharing ❌ Expensive ❌ You manage hardware ❌ Overkill for most\n\nCloud: ✅ Scalable ✅ Pay-as-you-go ✅ Global ❌ Complex ❌ Costs can spike ❌ Learning curve",
  },
];

interface Scenario {
  desc: string;
  answer: string;
  options: string[];
  explanation: string;
}

const scenarios: Scenario[] = [
  { desc: 'A personal blog with 100 visitors/month', answer: 'Shared Hosting', options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Cloud (AWS)'], explanation: 'Low traffic, simple site — shared hosting is perfect and cheapest.' },
  { desc: 'A startup SaaS app expecting rapid growth', answer: 'Cloud (AWS)', options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Cloud (AWS)'], explanation: 'Cloud hosting scales automatically with demand — perfect for unpredictable growth.' },
  { desc: 'A game server for you and 20 friends', answer: 'VPS', options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Cloud (AWS)'], explanation: 'Need root access and decent performance but not enterprise scale — VPS is the sweet spot.' },
  { desc: 'A bank processing millions of transactions daily', answer: 'Dedicated Server', options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Cloud (AWS)'], explanation: 'Maximum security, performance, and control needed — dedicated hardware.' },
  { desc: 'A portfolio site you want live in 5 minutes', answer: 'Shared Hosting', options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Cloud (AWS)'], explanation: 'Quick and simple deployment, minimal cost — shared hosting or even a free tier.' },
];

const quizQuestions = [
  { q: "Which hosting type shares a server with many other websites?", options: ['VPS', 'Shared Hosting', 'Dedicated Server', 'Cloud'], correct: 1 },
  { q: "Which option lets you scale resources up/down on demand?", options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Cloud Hosting'], correct: 3 },
  { q: "For a small project needing root access on a budget, which is best?", options: ['Shared Hosting', 'VPS', 'Dedicated Server', 'Kubernetes'], correct: 1 },
];

export default function HostingComparison() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (answer: string) => {
    const s = scenarios[scenarioIdx];
    if (answer === s.answer) {
      setScore(sc => sc + 1);
      setFeedback(`✅ ${s.explanation}`);
    } else {
      setFeedback(`❌ Better choice: ${s.answer}. ${s.explanation}`);
      loseLife();
    }
    setTimeout(() => {
      setFeedback('');
      if (scenarioIdx + 1 >= scenarios.length) {
        setStep(3);
      } else {
        setScenarioIdx(scenarioIdx + 1);
      }
    }, 2000);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-4-4', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="Hosting options — mastered!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Hosting Comparison" pathId="networking" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Pick the Right Hosting →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="scenarios" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🏗️ Pick the Right Hosting ({scenarioIdx + 1}/{scenarios.length})</h3>
              <p className="text-sm mb-4" style={{ color: '#00f0ff' }}>{scenarios[scenarioIdx].desc}</p>
              <div className="grid grid-cols-2 gap-2">
                {scenarios[scenarioIdx].options.map((opt) => (
                  <button key={opt} onClick={() => handleScenario(opt)} className="p-3 rounded-lg text-xs bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-center">
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && <p className="text-xs mt-3">{feedback}</p>}
              <p className="text-xs text-gray-500 mt-2 text-center">Score: {score}/{scenarioIdx + (feedback ? 1 : 0)}</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
