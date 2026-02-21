'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is Linux?",
    content: "Linux is an operating system — the software that controls your computer's hardware and lets you run programs. It was created in 1991 by Linus Torvalds, a Finnish student who wanted a free OS.\n\nLinux is open source — anyone can see the code, modify it, and share it. That's why it's FREE and why it powers most of the internet.",
  },
  {
    title: "Linux is EVERYWHERE",
    content: "You might think Linux is rare, but it runs:\n\n• 96% of the world's top 1 million web servers\n• Every Android phone (Android = Linux kernel!)\n• NASA's Mars rovers and ISS computers\n• Smart TVs, routers, IoT devices\n• All of the world's top 500 supercomputers\n• Tesla cars, PlayStation, and more\n\nBasically, if it's not a Windows PC or a Mac, it's probably Linux.",
  },
  {
    title: "Why Learn Linux?",
    content: "• Servers run Linux — if you want to deploy apps, you NEED it\n• DevOps, cloud, cybersecurity ALL require Linux\n• It's free and customizable — your OS, your rules\n• Most developer tools work best on Linux\n• It makes you a better programmer and sysadmin\n• Companies like Google, Amazon, and Meta run on Linux",
  },
];

const deviceQuiz: { device: string; runsLinux: boolean }[] = [
  { device: '🌐 Google\'s servers', runsLinux: true },
  { device: '📱 Android phone', runsLinux: true },
  { device: '🖥️ Windows laptop', runsLinux: false },
  { device: '🚗 Tesla car', runsLinux: true },
  { device: '🍎 MacBook', runsLinux: false },
  { device: '📺 Smart TV', runsLinux: true },
  { device: '🎮 Nintendo Switch', runsLinux: false },
  { device: '🛰️ ISS computers', runsLinux: true },
];

const quizQuestions = [
  { q: "Who created Linux?", options: ['Bill Gates', 'Steve Jobs', 'Linus Torvalds', 'Dennis Ritchie'], correct: 2 },
  { q: "What percentage of top web servers run Linux?", options: ['About 30%', 'About 50%', 'About 75%', 'Over 96%'], correct: 3 },
  { q: "What does 'open source' mean?", options: ['It costs nothing', 'Anyone can view and modify the source code', 'It only runs on open hardware', 'It was made by the Open Source Foundation'], correct: 1 },
];

export default function WhatIsLinux() {
  const [step, setStep] = useState(0);
  const [deviceStep, setDeviceStep] = useState(0);
  const [deviceScore, setDeviceScore] = useState(0);
  const [deviceDone, setDeviceDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleDevice = (answer: boolean) => {
    if (answer === deviceQuiz[deviceStep].runsLinux) {
      setDeviceScore(s => s + 1);
    }
    if (deviceStep + 1 >= deviceQuiz.length) {
      setDeviceDone(true);
    } else {
      setDeviceStep(deviceStep + 1);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-1-1', 40);
        addAchievement('penguin-power');
        addAchievement('first-mission');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={40} message="Welcome to the Linux world! 🐧" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="What is Linux?" pathId="linux" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🐧 The Linux mascot is Tux the penguin!</p>
                <div className="text-center text-5xl">🐧</div>
                <p className="text-xs text-gray-500 mt-2 text-center">Fun fact: Linus named Linux after himself — &quot;Linus&apos;s Unix&quot; → Linux</p>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Interactive Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !deviceDone && (
          <motion.div key="devices" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Does it Run Linux?</h2>
              <p className="text-sm text-gray-400 mb-4">For each device, decide if it runs Linux or not!</p>
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500">{deviceStep + 1}/{deviceQuiz.length}</p>
                <p className="text-2xl mt-2">{deviceQuiz[deviceStep].device}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleDevice(true)} className="p-3 rounded-lg bg-green-900/30 hover:bg-green-800/40 transition-colors text-sm font-semibold text-green-400">
                  ✅ Runs Linux
                </button>
                <button onClick={() => handleDevice(false)} className="p-3 rounded-lg bg-red-900/30 hover:bg-red-800/40 transition-colors text-sm font-semibold text-red-400">
                  ❌ Not Linux
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && deviceDone && (
          <motion.div key="device-result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {deviceScore}/{deviceQuiz.length} correct!</h3>
              <p className="text-sm text-gray-400">{deviceScore >= 6 ? 'Great job! You know where Linux lives!' : 'Linux is more widespread than you might think!'}</p>
            </div>
            <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 4 && (
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
