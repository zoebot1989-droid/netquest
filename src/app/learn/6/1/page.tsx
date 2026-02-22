'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const lessons = [
  {
    title: "The Full Deployment Flow",
    content: "Deploying a website involves connecting several networking concepts:\n\n1️⃣ Buy a domain (e.g., mysite.com)\n2️⃣ Set up DNS records (A record → server IP)\n3️⃣ Provision a VPS (DigitalOcean, Linode, AWS)\n4️⃣ SSH into the server\n5️⃣ Install a web server (nginx)\n6️⃣ Configure nginx to serve your site\n7️⃣ Set up HTTPS with Let's Encrypt\n\nYou've learned each piece — now let's put them all together!",
  },
  {
    title: "Nginx Basics",
    content: "Nginx (pronounced \"engine-x\") is a web server that handles incoming HTTP requests and serves your website files.\n\nBasic nginx config:\nserver {\n    listen 80;\n    server_name mysite.com;\n    root /var/www/mysite;\n    index index.html;\n}\n\nKey commands:\n• systemctl start nginx — Start the server\n• systemctl status nginx — Check if it's running\n• nginx -t — Test config for errors",
  },
];

const deploySteps = [
  { cmd: 'ssh', label: 'SSH into server', check: (c: string) => c.startsWith('ssh') },
  { cmd: 'apt install nginx', label: 'Install nginx', check: (c: string) => c.includes('apt') && c.includes('nginx') },
  { cmd: 'systemctl start nginx', label: 'Start nginx', check: (c: string) => c.includes('systemctl') && c.includes('start') && c.includes('nginx') },
  { cmd: 'systemctl status nginx', label: 'Check status', check: (c: string) => c.includes('systemctl') && c.includes('status') && c.includes('nginx') },
];

const quizQuestions = [
  { q: "What is the correct order for deploying a website?", options: ['Install nginx → Buy domain → Set DNS → SSH in', 'Buy domain → Set DNS → SSH into VPS → Install nginx', 'SSH in → Buy domain → Install nginx → Set DNS', 'Set DNS → Buy domain → SSH in → Install nginx'], correct: 1 },
  { q: "What does nginx do?", options: ['Manages DNS records', 'Serves web pages to visitors', 'Provides SSH access', 'Manages domain registration'], correct: 1 },
  { q: "Which command tests nginx configuration for errors?", options: ['nginx --check', 'nginx -t', 'systemctl test nginx', 'nginx verify'], correct: 1 },
  { q: "What DNS record points your domain to a server IP?", options: ['MX', 'CNAME', 'A', 'TXT'], correct: 2 },
];

export default function DeployWebsite() {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, _output: string[], _state: TerminalState) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedSteps);
    deploySteps.forEach((ds, i) => {
      if (ds.check(trimmed)) newCompleted.add(i);
    });
    setCompletedSteps(newCompleted);
    if (newCompleted.size >= deploySteps.length) {
      setTimeout(() => setStep(3), 1000);
    }
  }, [completedSteps]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-6-1', 150);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={150} message="Website deployed! 🚀" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={6} title="Deploy a Website" pathId="networking" />
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
              {step < 1 ? 'Next →' : 'Deploy It! →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="deploy" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🚀 Deploy Your Website</h3>
              <p className="text-sm text-gray-400 mb-3">Complete each step in the terminal:</p>
              <div className="space-y-2 mb-3">
                {deploySteps.map((ds, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs font-mono ${completedSteps.has(i) ? 'text-green-400' : 'text-gray-500'}`}>
                    {completedSteps.has(i) ? '✅' : '⬜'} {ds.label} — <code className="text-cyan-400">{ds.cmd}</code>
                  </div>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="280px" />
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
