'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What is CI/CD?",
    content: "CI/CD stands for three related practices:\n\n🔄 CI — Continuous Integration\nAutomatically build and test code every time someone pushes. Catches bugs early.\n\n📦 CD — Continuous Delivery\nAutomatically prepare code for release. One click to deploy.\n\n🚀 CD — Continuous Deployment\nAutomatically deploy every change to production. No manual steps.",
  },
  {
    title: "Pipeline Stages",
    content: "A CI/CD pipeline has stages that run in order:\n\n1. 📥 Source — Code pushed to Git\n2. 🔨 Build — Compile/bundle the app\n3. 🧪 Test — Run automated tests\n4. 📋 Lint — Check code quality\n5. 📦 Package — Build Docker image\n6. 🚀 Deploy — Push to staging/production\n\nIf any stage fails, the pipeline stops and alerts you.",
  },
  {
    title: "Popular CI/CD Tools",
    content: "• GitHub Actions — built into GitHub, YAML config\n• GitLab CI — built into GitLab\n• Jenkins — self-hosted, very customizable\n• CircleCI — cloud-based, fast\n• Travis CI — simple config\n• AWS CodePipeline — AWS native\n\nWe'll focus on GitHub Actions — it's free, popular, and easy to learn.",
  },
];

export default function WhatIsCICD() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does CI stand for?", options: ['Code Inspection', 'Continuous Integration', 'Container Instance', 'Cloud Infrastructure'], correct: 1 },
    { q: "What happens when a pipeline stage fails?", options: ['It skips to the next stage', 'The pipeline stops and alerts you', 'It retries automatically 10 times', 'Nothing — failures are ignored'], correct: 1 },
    { q: "What's the difference between Continuous Delivery and Continuous Deployment?", options: ['No difference', 'Delivery deploys automatically, Deployment needs a click', 'Delivery needs manual approval, Deployment is fully automatic', 'Delivery is for staging, Deployment is for testing'], correct: 2 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-3-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={50} message="You understand CI/CD!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="What is CI/CD?" pathId="devops" />
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
                <p className="text-xs text-gray-400 mb-2">🔄 Pipeline visualization:</p>
                <div className="flex items-center gap-1 text-xs font-mono overflow-x-auto pb-1">
                  {['📥 Source', '🔨 Build', '🧪 Test', '📋 Lint', '📦 Package', '🚀 Deploy'].map((s, i) => (
                    <div key={i} className="flex items-center">
                      <span className="bg-gray-800/50 px-2 py-1 rounded whitespace-nowrap" style={{ color: '#39ff14' }}>{s}</span>
                      {i < 5 && <span className="text-gray-600 mx-1">→</span>}
                    </div>
                  ))}
                </div>
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
