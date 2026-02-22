'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Docker Compose",
    content: "Real apps need multiple containers:\n• Web server (Node/Python/Go)\n• Database (PostgreSQL/MySQL)\n• Cache (Redis)\n• Message queue (RabbitMQ)\n\nDocker Compose lets you define and run multi-container apps with a single YAML file: docker-compose.yml",
  },
  {
    title: "docker-compose.yml Structure",
    content: "Key sections:\n\n• services — define each container\n• image / build — which image to use\n• ports — port mapping (host:container)\n• volumes — persistent data storage\n• environment — env variables\n• depends_on — startup order\n• networks — custom networking",
  },
  {
    title: "Compose Commands",
    content: "Essential commands:\n\n• docker-compose up -d — start all services (detached)\n• docker-compose down — stop and remove everything\n• docker-compose ps — list running services\n• docker-compose logs — view all logs\n• docker-compose build — rebuild images\n\nOne command to start your entire stack! 🚀",
  },
];

export default function DockerCompose() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What problem does Docker Compose solve?", options: ['Running a single container', 'Managing multi-container applications', 'Building Docker images', 'Pushing to Docker Hub'], correct: 1 },
    { q: "What does 'docker-compose up -d' do?", options: ['Shows logs', 'Stops all containers', 'Starts all services in background', 'Builds images only'], correct: 2 },
    { q: "What is a 'volume' in Docker Compose?", options: ['A sound setting', 'Persistent storage that survives container restarts', 'A network configuration', 'A container name'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'docker-compose') return;
    const newCompleted = new Set(completedCmds);
    if (parts[1] === 'up') newCompleted.add('up');
    if (parts[1] === 'down') newCompleted.add('down');
    if (parts[1] === 'ps') newCompleted.add('ps');
    if (parts[1] === 'logs') newCompleted.add('logs');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(4), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-5-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can orchestrate multi-container apps!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Docker Compose" pathId="devops" />
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
                <p className="text-xs text-gray-400 mb-2">📄 docker-compose.yml:</p>
                <pre className="font-mono text-xs bg-black/50 rounded-lg p-3 text-gray-300">{`version: "3.8"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data
  redis:
    image: redis:7
    ports:
      - "6379:6379"
volumes:
  db-data:`}</pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Try Compose →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Docker Compose Challenge</h2>
              <p className="text-sm text-gray-400">Run compose commands — up, down, ps, logs:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['up', 'down', 'ps', 'logs'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} {c}
                  </span>
                ))}
              </div>
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
