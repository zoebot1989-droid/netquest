'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What is Kubernetes?",
    content: "Kubernetes (K8s) is a container ORCHESTRATOR. It manages containers at scale.\n\nDocker Compose = good for 1 machine\nKubernetes = good for many machines (clusters)\n\nK8s handles:\n• 🔄 Auto-scaling — add/remove containers based on load\n• 🏥 Self-healing — restart crashed containers\n• ⚖️ Load balancing — distribute traffic\n• 🔄 Rolling updates — zero-downtime deployments\n• 🌐 Service discovery — containers find each other",
  },
  {
    title: "Key Concepts",
    content: "🏠 Cluster — a set of machines (nodes)\n📦 Pod — smallest unit, usually 1 container\n🚀 Deployment — manages pods (replicas, updates)\n🌐 Service — stable network endpoint for pods\n📋 ConfigMap/Secret — configuration and passwords\n💾 PersistentVolume — storage that outlives pods\n\nYou describe your DESIRED STATE in YAML, and Kubernetes makes it happen.",
  },
  {
    title: "kubectl — The K8s CLI",
    content: "kubectl is the command-line tool for Kubernetes.\n\nEssential commands:\n• kubectl get pods — list running pods\n• kubectl get deployments — list deployments\n• kubectl get services — list services\n• kubectl apply -f config.yaml — apply configuration\n• kubectl describe pod <name> — detailed pod info\n• kubectl logs <pod> — view pod logs\n• kubectl delete pod <name> — delete a pod",
  },
];

export default function KubernetesBasics() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What is Kubernetes used for?", options: ['Writing code', 'Building Docker images', 'Orchestrating containers at scale', 'Version control'], correct: 2 },
    { q: "What is a Pod in Kubernetes?", options: ['A cluster of machines', 'The smallest deployable unit (usually 1 container)', 'A network endpoint', 'A configuration file'], correct: 1 },
    { q: "What does 'kubectl apply -f config.yaml' do?", options: ['Deletes resources', 'Applies desired state from a YAML file', 'Shows resource details', 'Lists all pods'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'kubectl') return;
    const newCompleted = new Set(completedCmds);
    if (parts[1] === 'get') newCompleted.add('get');
    if (parts[1] === 'apply') newCompleted.add('apply');
    if (parts[1] === 'describe') newCompleted.add('describe');
    if (parts[1] === 'logs') newCompleted.add('logs');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(4), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-5-2', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="You understand Kubernetes basics!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Kubernetes Basics" pathId="devops" />
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
                <p className="text-xs text-gray-400 mb-2">📄 deployment.yaml:</p>
                <pre className="font-mono text-xs bg-black/50 rounded-lg p-3 text-gray-300">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: myapp:latest
          ports:
            - containerPort: 3000`}</pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Try kubectl →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 kubectl Challenge</h2>
              <p className="text-sm text-gray-400">Try these kubectl commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['get', 'apply', 'describe', 'logs'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Try: kubectl get pods, kubectl apply -f app.yaml, kubectl describe pod web-app, kubectl logs web-app</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
          </motion.div>
        )}

        {step === 4 && (
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
