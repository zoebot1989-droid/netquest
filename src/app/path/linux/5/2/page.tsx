'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Cron Jobs",
    content: "Cron lets you schedule commands to run automatically. Want to back up your database every night at 2 AM? Cron.\n\n• crontab -l — list your cron jobs\n• crontab -e — edit your cron jobs\n• crontab -r — remove all cron jobs (careful!)\n\nCron runs in the background 24/7, checking every minute if it's time to run something.",
  },
  {
    title: "Cron Syntax",
    content: "A cron expression has 5 fields:\n\n┌───────────── minute (0-59)\n│ ┌─────────── hour (0-23)\n│ │ ┌───────── day of month (1-31)\n│ │ │ ┌─────── month (1-12)\n│ │ │ │ ┌───── day of week (0-7, 0 & 7 = Sun)\n│ │ │ │ │\n* * * * * command\n\nExamples:\n0 2 * * *     → Every day at 2:00 AM\n*/15 * * * *  → Every 15 minutes\n0 0 * * 0     → Every Sunday at midnight\n30 9 1 * *    → 1st of every month at 9:30 AM\n0 */6 * * *   → Every 6 hours",
  },
];

const cronChallenges: { desc: string; correct: number; options: string[] }[] = [
  { desc: 'Run a backup every day at 3 AM', correct: 1, options: ['* 3 * * *', '0 3 * * *', '3 0 * * *', '0 0 3 * *'] },
  { desc: 'Run a health check every 30 minutes', correct: 2, options: ['30 * * * *', '0 30 * * *', '*/30 * * * *', '* 30 * * *'] },
  { desc: 'Clean temp files every Sunday at midnight', correct: 0, options: ['0 0 * * 0', '0 0 * * 7', '0 0 0 * *', '* * * * 0'] },
  { desc: 'Send a report on the 1st of every month at 9 AM', correct: 1, options: ['0 9 * 1 *', '0 9 1 * *', '9 0 1 * *', '0 1 9 * *'] },
  { desc: 'Run every 5 minutes', correct: 3, options: ['5 * * * *', '0 5 * * *', '* 5 * * *', '*/5 * * * *'] },
];

const quizQuestions = [
  { q: "What does * mean in a cron field?", options: ['Nothing', 'Every possible value', 'Skip this field', 'Zero'], correct: 1 },
  { q: "What does */15 mean in the minute field?", options: ['At minute 15', 'Every 15 minutes', '15 times', 'At 15 past every hour'], correct: 1 },
  { q: "Which cron expression runs at midnight every day?", options: ['* * * * *', '0 * * * *', '0 0 * * *', '* 0 * * *'], correct: 2 },
];

export default function CronJobs() {
  const [step, setStep] = useState(0);
  const [challengeStep, setChallengeStep] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeDone, setChallengeDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleChallenge = (answer: number) => {
    if (answer === cronChallenges[challengeStep].correct) setScore(s => s + 1);
    if (challengeStep + 1 >= cronChallenges.length) setChallengeDone(true);
    else setChallengeStep(challengeStep + 1);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-5-2', 70);
        addAchievement('cron-master');
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="Cron master! ⏰" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Cron Jobs" pathId="linux" />
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
            {step === 1 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🧠 Quick reference:</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-300">min  hour  day  month  weekday</div>
                  <div style={{ color: '#39ff14' }}> *     *     *    *      *     = every minute</div>
                  <div style={{ color: '#00f0ff' }}> 0     2     *    *      *     = daily at 2 AM</div>
                  <div style={{ color: '#ff9500' }}>*/5    *     *    *      *     = every 5 min</div>
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Write Cron Expressions →'}
            </button>
          </motion.div>
        )}

        {step === 2 && !challengeDone && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Pick the Cron Expression</h2>
              <p className="text-xs text-gray-400 mb-3">{challengeStep + 1}/{cronChallenges.length}</p>
              <p className="text-sm mb-4">{cronChallenges[challengeStep].desc}</p>
              <div className="space-y-2">
                {cronChallenges[challengeStep].options.map((opt, i) => (
                  <button key={i} onClick={() => handleChallenge(i)} className="w-full text-left p-3 rounded-lg text-sm font-mono bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && challengeDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {score}/{cronChallenges.length} correct!</h3>
              <p className="text-sm text-gray-400">{score >= 4 ? 'You can schedule anything! ⏰' : 'Cron syntax takes practice — review the fields!'}</p>
            </div>
            <button onClick={() => setStep(3)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 3 && (
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
