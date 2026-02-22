'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const stages = [
  {
    title: "1. Write Code & Commit",
    content: "Everything starts with code. You write your feature, then track it with Git.\n\nThe workflow:\n• Create a feature branch\n• Write your code\n• Commit with a clear message\n• Push to remote",
    cmds: ['git'],
  },
  {
    title: "2. CI Pipeline Triggers",
    content: "When you push or open a PR, your CI pipeline automatically:\n\n✅ Runs tests\n✅ Checks code style (linting)\n✅ Builds the project\n✅ Reports results\n\nIf anything fails, you fix it before merging.",
    cmds: [],
  },
  {
    title: "3. Build Docker Image",
    content: "Once CI passes, build a Docker image:\n\n• The Dockerfile defines how to package your app\n• docker build creates the image\n• Tag it with a version number\n• Push to a container registry (Docker Hub, ECR, GCR)",
    cmds: ['docker'],
  },
  {
    title: "4. Deploy",
    content: "Deploy to your infrastructure:\n\n• docker-compose for simple setups\n• Kubernetes for production scale\n• kubectl apply -f deployment.yaml\n• Rolling updates = zero downtime\n\nMonitor with Prometheus + Grafana to make sure everything is healthy.",
    cmds: ['kubectl', 'docker-compose'],
  },
];

export default function FullPipeline() {
  const [step, setStep] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What's the correct order of the DevOps pipeline?", options: ['Deploy → Build → Test → Code', 'Code → Test → Build → Deploy', 'Code → CI (test/lint/build) → Docker Build → Deploy', 'Docker → Git → Test → Ship'], correct: 2 },
    { q: "Why do we use rolling updates?", options: ['To save money', 'Zero-downtime deployments', 'To test in production', 'To skip CI'], correct: 1 },
    { q: "What should you monitor after deploying?", options: ['Nothing — it works if CI passed', 'Only CPU usage', 'Metrics, logs, and traces — the three pillars', 'Just error messages'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const base = cmd.trim().split(/\s+/)[0];
    const newCompleted = new Set(completedStages);
    if (base === 'git') newCompleted.add('git');
    if (base === 'docker') newCompleted.add('docker');
    if (base === 'docker-compose') newCompleted.add('docker-compose');
    if (base === 'kubectl') newCompleted.add('kubectl');
    setCompletedStages(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(stages.length + 1), 500);
  }, [completedStages]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-5-3', 100);
        addAchievement('full-devops');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={100} message="🎉 You've completed the DevOps path! You know the full pipeline from code to deploy!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="The Full Pipeline" pathId="devops" />
      <AnimatePresence mode="wait">
        {step < stages.length && (
          <motion.div key={`s-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/{stages.length}</span>
                <h2 className="font-semibold">{stages[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{stages[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🔄 The full DevOps loop:</p>
                <div className="flex items-center gap-1 text-xs font-mono overflow-x-auto pb-1">
                  {['📝 Code', '🔄 Git', '🧪 CI', '🐳 Docker', '🚀 Deploy', '📊 Monitor'].map((s, i) => (
                    <div key={i} className="flex items-center">
                      <span className="bg-gray-800/50 px-2 py-1 rounded whitespace-nowrap" style={{ color: '#39ff14' }}>{s}</span>
                      {i < 5 && <span className="text-gray-600 mx-1">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">Next →</button>
          </motion.div>
        )}

        {step === stages.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Run the Full Pipeline</h2>
              <p className="text-sm text-gray-400">Use at least 3 different tools from the pipeline:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['git', 'docker', 'docker-compose', 'kubectl'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedStages.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedStages.has(c) ? '✅' : '⬜'} {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Try: git commit, docker build, kubectl get pods, docker-compose up</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
          </motion.div>
        )}

        {step === stages.length + 1 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Final Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
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
