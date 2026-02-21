'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Everything is a File",
    content: "This is Linux's #1 philosophy. In Linux, EVERYTHING is represented as a file:\n\n📄 Regular files — text, images, binaries\n📁 Directories — folders (yes, folders are files too!)\n🔗 Symbolic links — shortcuts to other files\n💾 Device files — your hard drive, USB, keyboard\n🔌 Pipes & sockets — for communication between programs\n\nThis makes Linux incredibly consistent — the same tools (read, write, permissions) work on everything.",
  },
  {
    title: "File Types in ls -la",
    content: "When you run ls -la, the first character tells you the file type:\n\n- = regular file\nd = directory\nl = symbolic link\nb = block device (hard drive)\nc = character device (keyboard, terminal)\np = pipe\ns = socket\n\nExamples:\n-rw-r--r-- 1 user user   100 notes.txt\ndrwxr-xr-x 2 user user  4096 Desktop/\nlrwxrwxrwx 1 user user    11 link -> target",
  },
];

const fileTypes: { line: string; type: string; options: string[] }[] = [
  { line: '-rw-r--r-- 1 user user 1024 report.txt', type: 'Regular file', options: ['Regular file', 'Directory', 'Symbolic link'] },
  { line: 'drwxr-xr-x 2 user user 4096 Documents/', type: 'Directory', options: ['Regular file', 'Directory', 'Block device'] },
  { line: 'lrwxrwxrwx 1 root root   11 python -> python3', type: 'Symbolic link', options: ['Symbolic link', 'Pipe', 'Regular file'] },
  { line: 'brw-rw---- 1 root disk  8,0 /dev/sda', type: 'Block device', options: ['Regular file', 'Block device', 'Character device'] },
  { line: 'crw-rw-rw- 1 root root  1,3 /dev/null', type: 'Character device', options: ['Character device', 'Block device', 'Socket'] },
];

const quizQuestions = [
  { q: "What does 'd' at the start of a permission string mean?", options: ['Deleted file', 'Disk file', 'Directory', 'Device'], correct: 2 },
  { q: "Which character represents a symbolic link?", options: ['s', 'l', '-', 'p'], correct: 1 },
  { q: "In Linux, your keyboard is represented as a:", options: ['Regular file', 'Directory', 'Character device file', 'Pipe'], correct: 2 },
];

export default function EverythingIsAFile() {
  const [step, setStep] = useState(0);
  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeDone, setChallengeDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleChallenge = (answer: string) => {
    if (answer === fileTypes[challengeStep].type) setChallengeScore(s => s + 1);
    if (challengeStep + 1 >= fileTypes.length) setChallengeDone(true);
    else setChallengeStep(challengeStep + 1);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-3-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="Everything IS a file! 🗂️" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Everything is a File" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Identify File Types →</button>
          </motion.div>
        )}

        {step === 1 && !challengeDone && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 What Type of File?</h2>
              <p className="text-xs text-gray-400 mb-3">{challengeStep + 1}/{fileTypes.length}</p>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs mb-4">
                <span className="text-gray-300">{fileTypes[challengeStep].line}</span>
              </div>
              <div className="space-y-2">
                {fileTypes[challengeStep].options.map(opt => (
                  <button key={opt} onClick={() => handleChallenge(opt)} className="w-full text-left p-3 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
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
              <h3 className="font-semibold mb-2">Results: {challengeScore}/{fileTypes.length} correct!</h3>
              <p className="text-sm text-gray-400">Hint: always look at the first character!</p>
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
