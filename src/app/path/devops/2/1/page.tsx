'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What Are Containers?",
    content: "A container is a lightweight, standalone package that includes everything needed to run a piece of software:\n\n📦 Your application code\n📚 Libraries and dependencies\n⚙️ System tools and settings\n\nContainers are like shipping containers for software — standardized, portable, and isolated.",
  },
  {
    title: "Containers vs Virtual Machines",
    content: "VMs virtualize the HARDWARE — each VM runs a full OS.\nContainers virtualize the OS — they share the host kernel.\n\nThis makes containers:\n• 🚀 Faster to start (seconds vs minutes)\n• 💾 Much smaller (MBs vs GBs)\n• 📦 More portable\n• ⚡ Less resource-heavy\n\nVMs are still useful for running different OS types.",
  },
  {
    title: "Images vs Containers",
    content: "An IMAGE is a blueprint — a read-only template with instructions.\nA CONTAINER is a running instance of an image.\n\nAnalogy:\n• Image = Cookie cutter 🍪\n• Container = The actual cookie\n\nYou can run MANY containers from ONE image.\n\nDocker Hub (hub.docker.com) is like an app store for images — nginx, node, python, postgres, and thousands more.",
  },
];

export default function WhatAreContainers() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What's the main advantage of containers over VMs?", options: ['Containers run a full OS', 'Containers are lighter, faster, and more portable', 'Containers are more secure', 'Containers use more resources'], correct: 1 },
    { q: "What's the relationship between an image and a container?", options: ['They are the same thing', 'An image is a running container', 'A container is a running instance of an image', 'Containers create images'], correct: 2 },
    { q: "What is Docker Hub?", options: ['A GitHub alternative', 'A registry/store for Docker images', 'A container orchestrator', 'A cloud provider'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-2-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={50} message="You understand containers!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="What Are Containers?" pathId="devops" />
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
                <div className="grid grid-cols-2 gap-4 text-xs text-center">
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#ff9500' }}>🖥️ Virtual Machine</p>
                    <div className="space-y-1 text-gray-400">
                      <p>App + Guest OS</p>
                      <p>Hypervisor</p>
                      <p>Host OS</p>
                      <p>Hardware</p>
                      <p className="text-red-400">~GBs, minutes to boot</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#39ff14' }}>🐳 Container</p>
                    <div className="space-y-1 text-gray-400">
                      <p>App + Libraries</p>
                      <p>Docker Engine</p>
                      <p>Host OS</p>
                      <p>Hardware</p>
                      <p className="text-green-400">~MBs, seconds to boot</p>
                    </div>
                  </div>
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
