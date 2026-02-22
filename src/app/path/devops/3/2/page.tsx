'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "GitHub Actions",
    content: "GitHub Actions is GitHub's built-in CI/CD platform. You define workflows in YAML files stored in your repo.\n\nWorkflows live in: .github/workflows/\n\nKey concepts:\n• Workflow — the entire automation file\n• Trigger — what starts it (push, PR, schedule)\n• Job — a set of steps that run on a runner\n• Step — individual task (run command, use action)\n• Runner — the machine that executes the job",
  },
  {
    title: "Workflow YAML Structure",
    content: "A basic workflow file:",
  },
  {
    title: "Common Triggers & Actions",
    content: "Triggers (on:):\n• push — when code is pushed\n• pull_request — when a PR is opened/updated\n• schedule — cron-based (e.g., nightly)\n• workflow_dispatch — manual trigger\n\nPopular Actions:\n• actions/checkout — clone your repo\n• actions/setup-node — install Node.js\n• actions/setup-python — install Python\n• docker/build-push-action — build & push Docker",
  },
];

export default function GitHubActions() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "Where do GitHub Actions workflows live?", options: ['package.json', '.github/workflows/', 'src/ci/', '.actions/'], correct: 1 },
    { q: "What language are workflow files written in?", options: ['JSON', 'JavaScript', 'YAML', 'TOML'], correct: 2 },
    { q: "What does 'actions/checkout' do?", options: ['Checks out a library book', 'Clones your repo into the runner', 'Deploys your app', 'Runs tests'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-3-2', 60);
        addAchievement('pipeline-pro');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can write GitHub Actions workflows!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="GitHub Actions" pathId="devops" />
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
                <p className="text-xs text-gray-400 mb-2">📄 .github/workflows/ci.yml:</p>
                <pre className="font-mono text-xs bg-black/50 rounded-lg p-3 text-gray-300 overflow-x-auto">{`name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
      - run: npm run build`}</pre>
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
