'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What Are Services?",
    content: "A service (or daemon) is a program that runs in the background. No window, no user interaction — just quietly doing its job.\n\nExamples:\n• nginx — serves web pages\n• sshd — handles SSH connections\n• cron — runs scheduled tasks\n• mysql — database server\n\nServices start at boot and keep running until you stop them.",
  },
  {
    title: "systemctl — Your Service Remote Control",
    content: "systemd is the system manager on most modern Linux distros. You control it with systemctl:\n\n• systemctl status nginx — is it running?\n• systemctl start nginx — start it\n• systemctl stop nginx — stop it\n• systemctl restart nginx — restart it\n• systemctl enable nginx — start at boot\n• systemctl disable nginx — don't start at boot\n• systemctl list-units — see all services\n\nThink of systemctl as the on/off switch for everything running on your server.",
  },
];

const quizQuestions = [
  { q: "What does 'systemctl enable nginx' do?", options: ['Starts nginx now', 'Makes nginx start automatically at boot', 'Enables nginx\'s firewall', 'Updates nginx'], correct: 1 },
  { q: "What is a daemon?", options: ['A virus', 'A background service/process', 'A type of Linux distro', 'A root user'], correct: 1 },
  { q: "How do you check if sshd is running?", options: ['ssh status', 'systemctl status sshd', 'service-check sshd', 'ps sshd'], correct: 1 },
  { q: "What does systemctl restart do?", options: ['Reboots the computer', 'Stops then starts the service', 'Resets the config', 'Reinstalls the service'], correct: 1 },
];

export default function ServicesSystemd() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed.includes('systemctl status')) newCompleted.add('status');
    if (trimmed.includes('systemctl start')) newCompleted.add('start');
    if (trimmed.includes('systemctl stop')) newCompleted.add('stop');
    if (trimmed.includes('systemctl restart')) newCompleted.add('restart');
    if (trimmed.includes('systemctl list-units')) newCompleted.add('list');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 4) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-4-2', 60);
        addAchievement('system-admin');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="You can manage services! ⚙️" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Services & systemd" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Manage Services →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Service Management</h2>
              <p className="text-sm text-gray-400">Use systemctl to manage services. Try at least 4:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['status', 'status'], ['start', 'start'], ['stop', 'stop'], ['restart', 'restart'], ['list-units', 'list']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} systemctl {label}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: systemctl status nginx, systemctl start mysql, etc.</p>
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
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm font-mono bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
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
