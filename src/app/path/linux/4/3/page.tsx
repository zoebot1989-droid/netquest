'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Linux Logs",
    content: "Everything that happens on a Linux system gets logged. Logs are your #1 tool for debugging problems.\n\n📁 /var/log/ — where most log files live\n• syslog — general system messages\n• auth.log — login attempts, sudo usage\n• kern.log — kernel messages\n• dpkg.log — package install/remove history\n• /var/log/nginx/ — nginx-specific logs",
  },
  {
    title: "Log Tools",
    content: "• journalctl — modern log viewer (systemd journal)\n  journalctl -u nginx — logs for nginx only\n  journalctl -p err — only errors\n\n• dmesg — kernel boot and hardware messages\n\n• cat/grep /var/log/syslog — read log files directly\n\n• tail -f /var/log/syslog — watch logs in real-time!\n\nPro tip: When something breaks, ALWAYS check the logs first. The answer is almost always there.",
  },
];

const quizQuestions = [
  { q: "Where do most log files live?", options: ['/etc/log', '/home/logs', '/var/log', '/tmp/log'], correct: 2 },
  { q: "How do you see only error messages in journalctl?", options: ['journalctl -e', 'journalctl -p err', 'journalctl --errors', 'journalctl -f'], correct: 1 },
  { q: "What does dmesg show?", options: ['Disk messages', 'Desktop messages', 'Kernel/hardware messages', 'DNS messages'], correct: 2 },
  { q: "What should you check FIRST when a service isn't working?", options: ['Google it', 'Reinstall Linux', 'Check the logs', 'Reboot'], correct: 2 },
];

export default function LogsMonitoring() {
  const [step, setStep] = useState(0);
  const [foundError, setFoundError] = useState(false);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, output: string[]) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed.includes('journalctl')) newCompleted.add('journalctl');
    if (trimmed.includes('dmesg')) newCompleted.add('dmesg');
    if (trimmed.includes('/var/log')) newCompleted.add('varlog');
    // Check if they found the error
    const outputStr = output.join('\n').toLowerCase();
    if (outputStr.includes('failure') || outputStr.includes('failed') || outputStr.includes('error')) {
      setFoundError(true);
      newCompleted.add('error');
    }
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3 && foundError) setTimeout(() => setStep(2), 500);
  }, [completedCmds, foundError]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-4-3', 70);
        addAchievement('log-detective');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="Log detective! 🔍" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Logs & Monitoring" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Find the Error →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Find the Broken Service</h2>
              <p className="text-sm text-gray-400">Something is broken on this server. Use log commands to find what failed!</p>
              <p className="text-xs text-gray-500 mt-2">Hint: try journalctl, journalctl -p err, cat /var/log/syslog, dmesg</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['journalctl', 'journalctl'], ['dmesg', 'dmesg'], ['/var/log/*', 'varlog'], ['🔍 Found error', 'error']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
            {completedCmds.has('error') && completedCmds.size >= 3 && (
              <div className="card border-green-800/30">
                <p className="text-sm text-green-400">🎉 You found it! mysql.service failed. That&apos;s the broken service!</p>
                <button onClick={() => setStep(2)} className="btn-primary w-full mt-2">Take the Quiz →</button>
              </div>
            )}
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
