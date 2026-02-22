'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const commandsToLearn = [
  { cmd: 'docker run hello-world', desc: 'Run a container from an image' },
  { cmd: 'docker ps', desc: 'List running containers' },
  { cmd: 'docker images', desc: 'List downloaded images' },
  { cmd: 'docker pull nginx', desc: 'Download an image from Docker Hub' },
  { cmd: 'docker stop <id>', desc: 'Stop a running container' },
  { cmd: 'docker rm <id>', desc: 'Remove a stopped container' },
  { cmd: 'docker exec <id> ls', desc: 'Run a command inside a container' },
  { cmd: 'docker logs <name>', desc: 'View container output logs' },
];

export default function DockerCommands() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "Which command runs a new container?", options: ['docker start', 'docker run', 'docker exec', 'docker create'], correct: 1 },
    { q: "What does 'docker ps -a' show?", options: ['Only running containers', 'All containers including stopped ones', 'All images', 'Docker version'], correct: 1 },
    { q: "How do you run a command inside a running container?", options: ['docker run', 'docker ssh', 'docker exec', 'docker attach'], correct: 2 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'docker') return;
    const sub = parts[1];
    const newCompleted = new Set(completedCmds);
    if (sub === 'run') newCompleted.add('run');
    if (sub === 'ps') newCompleted.add('ps');
    if (sub === 'images') newCompleted.add('images');
    if (sub === 'pull') newCompleted.add('pull');
    if (sub === 'stop') newCompleted.add('stop');
    if (sub === 'rm') newCompleted.add('rm');
    if (sub === 'exec') newCompleted.add('exec');
    if (sub === 'logs') newCompleted.add('logs');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 5) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-2-2', 60);
        addAchievement('container-captain');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can manage Docker containers!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Docker Commands" pathId="devops" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-3">🐳 Essential Docker Commands</h2>
              <p className="text-sm text-gray-400 mb-3">These commands are your Docker toolkit. Memorize them!</p>
              <div className="space-y-3">
                {commandsToLearn.map(c => (
                  <div key={c.cmd} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="font-mono text-sm" style={{ color: '#39ff14' }}>{c.cmd}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try Them Out →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Docker Challenge</h2>
              <p className="text-sm text-gray-400">Use at least 5 docker commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['run', 'ps', 'images', 'pull', 'stop', 'rm', 'exec', 'logs'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{completedCmds.size}/5 commands used</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
          </motion.div>
        )}

        {step === 2 && (
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
