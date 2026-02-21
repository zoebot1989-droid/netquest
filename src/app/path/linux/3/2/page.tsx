'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const dirTree = [
  { dir: '/', desc: 'Root — the top of EVERYTHING. All paths start here.' },
  { dir: '/home', desc: 'User home directories. Your files live in /home/yourusername.' },
  { dir: '/etc', desc: 'System configuration files. Nginx config, SSH config, hostname — all here.' },
  { dir: '/var', desc: 'Variable data — logs (/var/log), websites (/var/www), mail, caches.' },
  { dir: '/tmp', desc: 'Temporary files. Cleared on reboot. Anyone can write here.' },
  { dir: '/bin', desc: 'Essential command binaries — ls, cp, mv, cat. Needed for booting.' },
  { dir: '/usr', desc: 'User programs. /usr/bin has most installed programs.' },
  { dir: '/dev', desc: 'Device files — hard drives, USB, keyboards, /dev/null.' },
  { dir: '/proc', desc: 'Virtual filesystem — running processes & kernel info as files.' },
  { dir: '/root', desc: 'Root user\'s home directory. NOT the same as /.' },
];

const challenges: { question: string; correct: string; options: string[] }[] = [
  { question: 'Where would you find nginx.conf?', correct: '/etc', options: ['/home', '/etc', '/var', '/bin'] },
  { question: 'Where do system logs live?', correct: '/var', options: ['/tmp', '/etc', '/var', '/proc'] },
  { question: 'Where is your personal home directory?', correct: '/home', options: ['/root', '/home', '/usr', '/'] },
  { question: 'Where would you find the ls command binary?', correct: '/bin', options: ['/bin', '/dev', '/tmp', '/home'] },
  { question: 'Where are device files like /dev/sda?', correct: '/dev', options: ['/proc', '/var', '/dev', '/etc'] },
  { question: 'Where do temporary files go?', correct: '/tmp', options: ['/var', '/home', '/dev', '/tmp'] },
];

const quizQuestions = [
  { q: "What is the root of the entire Linux filesystem?", options: ['/root', '/home', '/', '/usr'], correct: 2 },
  { q: "Where does the root USER's home directory live?", options: ['/', '/root', '/home/root', '/etc'], correct: 1 },
  { q: "Where would you find system logs?", options: ['/etc/log', '/var/log', '/tmp/log', '/home/log'], correct: 1 },
  { q: "What does /proc contain?", options: ['Processor drivers', 'Virtual files for process/kernel info', 'Program files', 'Nothing — it\'s reserved'], correct: 1 },
];

export default function DirectoryStructure() {
  const [step, setStep] = useState(0);
  const [challengeStep, setChallengeStep] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeDone, setChallengeDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleChallenge = (answer: string) => {
    if (answer === challenges[challengeStep].correct) setScore(s => s + 1);
    if (challengeStep + 1 >= challenges.length) setChallengeDone(true);
    else setChallengeStep(challengeStep + 1);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-3-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={60} message="You know where everything lives! 📂" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Directory Structure" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-3">📁 The Linux Directory Tree</h2>
              <p className="text-sm text-gray-400 mb-3">Every Linux system has the same basic structure. Learn these and you&apos;ll never be lost:</p>
              <div className="space-y-2">
                {dirTree.map(d => (
                  <div key={d.dir} className="flex gap-3 text-xs">
                    <span className="font-mono font-bold shrink-0 w-16" style={{ color: '#00f0ff' }}>{d.dir}</span>
                    <span className="text-gray-400">{d.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card border-cyan-800/30">
              <pre className="font-mono text-xs text-gray-300">{`/
├── home/user/    ← your stuff
├── etc/          ← config files
├── var/log/      ← logs
├── tmp/          ← temp files
├── bin/          ← commands
├── usr/bin/      ← more commands
├── dev/          ← devices
├── proc/         ← process info
└── root/         ← root's home`}</pre>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Where Would You Find...? →</button>
          </motion.div>
        )}

        {step === 1 && !challengeDone && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Where Would You Find It?</h2>
              <p className="text-xs text-gray-400 mb-3">{challengeStep + 1}/{challenges.length}</p>
              <p className="text-sm mb-4">{challenges[challengeStep].question}</p>
              <div className="grid grid-cols-2 gap-2">
                {challenges[challengeStep].options.map(opt => (
                  <button key={opt} onClick={() => handleChallenge(opt)} className="p-3 rounded-lg text-sm font-mono bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && challengeDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {score}/{challenges.length}!</h3>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full">Take the Quiz →</button>
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
