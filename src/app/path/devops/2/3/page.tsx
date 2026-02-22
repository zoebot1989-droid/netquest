'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is a Dockerfile?",
    content: "A Dockerfile is a text file with instructions to build a Docker image. Think of it as a recipe for your container.\n\nEach instruction creates a LAYER in the image. Docker caches layers, so unchanged steps are fast on rebuild.\n\nDockerfile → docker build → Image → docker run → Container",
  },
  {
    title: "Dockerfile Instructions",
    content: "Key instructions:\n\n• FROM — base image (every Dockerfile starts here)\n• WORKDIR — set the working directory\n• COPY — copy files from host into image\n• RUN — execute commands during build\n• EXPOSE — document which port the app uses\n• CMD — default command when container starts\n\nOrder matters! Put things that change least first (better caching).",
  },
  {
    title: "Example Dockerfile",
    content: "Here's a Dockerfile for a Node.js app:",
  },
];

export default function Dockerfiles() {
  const [step, setStep] = useState(0);
  const [buildDone, setBuildDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does the FROM instruction do?", options: ['Copies files into the image', 'Specifies the base image to build from', 'Runs a command', 'Sets the working directory'], correct: 1 },
    { q: "What's the difference between RUN and CMD?", options: ['No difference', 'RUN executes during build, CMD runs when the container starts', 'CMD executes during build, RUN runs at start', 'RUN is for Linux, CMD for Windows'], correct: 1 },
    { q: "Why should you COPY package.json before COPY . ?", options: ['It looks nicer', 'Docker requires this order', 'Better layer caching — dependencies change less often', 'It makes the image smaller'], correct: 2 },
  ];

  const handleCommand = (cmd: string) => {
    if (cmd.trim().startsWith('docker build')) {
      setBuildDone(true);
      setTimeout(() => setStep(4), 1000);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-2-3', 70);
        addAchievement('dockerfile-author');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="You can write Dockerfiles!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Dockerfiles" pathId="devops" />
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

            {step === 2 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">📄 Dockerfile:</p>
                <pre className="font-mono text-xs bg-black/50 rounded-lg p-3">
                  <span style={{ color: '#00f0ff' }}>FROM</span>{' node:20\n'}
                  <span style={{ color: '#00f0ff' }}>WORKDIR</span>{' /app\n'}
                  <span style={{ color: '#00f0ff' }}>COPY</span>{' package*.json ./\n'}
                  <span style={{ color: '#00f0ff' }}>RUN</span>{' npm install\n'}
                  <span style={{ color: '#00f0ff' }}>COPY</span>{' . .\n'}
                  <span style={{ color: '#00f0ff' }}>EXPOSE</span>{' 3000\n'}
                  <span style={{ color: '#00f0ff' }}>CMD</span>{' ["npm", "start"]'}
                </pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Try Building →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Build an Image</h2>
              <p className="text-sm text-gray-400">Run <code className="font-mono text-green-400">docker build -t myapp .</code> to build an image from a Dockerfile:</p>
              {buildDone && <p className="text-green-400 text-sm mt-2">✅ Image built successfully!</p>}
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
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
