'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Password Cracking",
    content: "When databases get breached, passwords are (hopefully) stored as hashes. Attackers crack these hashes:\n\n🔨 Brute Force — Try every possible combination. Slow but guaranteed.\n  a, b, c... aa, ab... aaa, aab...\n\n📖 Dictionary Attack — Try common passwords from a wordlist.\n  rockyou.txt contains 14 million passwords!\n\n🌈 Rainbow Tables — Pre-computed hash → password lookup tables.\n  Instant lookup but requires huge storage.\n\n⚡ Tools: Hashcat (GPU-accelerated), John the Ripper (classic)",
  },
  {
    title: "Why Salting Matters",
    content: "A salt is random data added to each password before hashing:\n\nWithout salt:\n  hash('password123') → 5f4dcc3b...\n  Same password = same hash every time!\n  Rainbow tables work perfectly.\n\nWith salt:\n  hash('password123' + 'x7Kj2') → a1b2c3d4...\n  hash('password123' + 'mN9p1') → e5f6a7b8...\n  Same password, different hashes! 🎯\n\n🛡️ bcrypt — Designed for passwords. Auto-salts, intentionally slow.\n  bcrypt('password123') takes ~100ms vs MD5's ~0.001ms\n  Makes brute force 100,000x slower!",
  },
];

const hashesToCrack = [
  { hash: '5f4dcc3b5aa765d61d8327deb882cf99', password: 'password', algo: 'MD5' },
  { hash: '482c811da5d5b4bc6d497ffa98491e38', password: 'password123', algo: 'MD5' },
  { hash: '0acf4539a14b3aa27deeb4cbdf6e989f', password: 'monkey', algo: 'MD5' },
];

export default function PasswordCracking() {
  const [step, setStep] = useState(0);
  const [selectedHash, setSelectedHash] = useState(0);
  const [cracking, setCracking] = useState(false);
  const [crackProgress, setCrackProgress] = useState(0);
  const [cracked, setCracked] = useState<Set<number>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!cracking) return;
    const interval = setInterval(() => {
      setCrackProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setCracking(false);
          const newCracked = new Set(cracked);
          newCracked.add(selectedHash);
          setCracked(newCracked);
          if (!cracked.size) addAchievement('hash-cracker');
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [cracking, selectedHash, cracked]);

  const startCrack = () => {
    setCracking(true);
    setCrackProgress(0);
  };

  const quizQuestions = [
    { q: "Why are rainbow tables ineffective against salted hashes?", options: ['They only work on MD5', 'Each password has a unique salt, so pre-computed tables don\'t match', 'Salts encrypt the hash', 'Rainbow tables are too slow'], correct: 1 },
    { q: "bcrypt is better for passwords because...", options: ['It uses shorter hashes', 'It\'s intentionally slow, making brute force impractical', 'It doesn\'t use encryption', 'It stores passwords in plain text'], correct: 1 },
    { q: "What is rockyou.txt?", options: ['A hacking tool', 'A famous wordlist of leaked passwords', 'An encryption algorithm', 'A Linux distribution'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-4-1', 80);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={80} message="Hash cracking skills unlocked! 🔓" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Password Cracking" pathId="cybersecurity" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-red-900/30 text-red-400">{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Crack Hashes →'}</button>
          </motion.div>
        )}

        {step === 2 && cracked.size < 3 && (
          <motion.div key="crack" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-3 text-red-400">🔓 Hash Cracker</h2>
              <p className="text-xs text-gray-400 mb-3">Select a hash and crack it with a dictionary attack!</p>

              <div className="space-y-2 mb-4">
                {hashesToCrack.map((h, i) => (
                  <button key={i} onClick={() => !cracking && setSelectedHash(i)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-colors ${selectedHash === i ? 'bg-red-900/30 border border-red-800/50' : cracked.has(i) ? 'bg-green-900/20 border border-green-800/30' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{h.algo}</span>
                      {cracked.has(i) && <span className="text-green-400">✅ CRACKED</span>}
                    </div>
                    <div className="text-gray-300 mt-1 break-all">{h.hash}</div>
                    {cracked.has(i) && <div className="mt-1" style={{ color: '#39ff14' }}>Password: {h.password}</div>}
                  </button>
                ))}
              </div>

              {!cracked.has(selectedHash) && (
                <>
                  {cracking ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Cracking with rockyou.txt...</span>
                        <span>{Math.min(Math.round(crackProgress), 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: '#39ff14', width: `${Math.min(crackProgress, 100)}%` }} />
                      </div>
                      <div className="font-mono text-xs text-gray-500">
                        Trying: {['admin123', 'letmein', 'dragon', 'master', 'qwerty', hashesToCrack[selectedHash].password][Math.floor(crackProgress / 17)] || '...'}
                      </div>
                    </div>
                  ) : (
                    <button onClick={startCrack} className="w-full p-3 rounded-lg bg-red-900/50 hover:bg-red-800/60 transition-colors text-sm font-semibold text-red-300">
                      🔨 Crack Selected Hash (Dictionary Attack)
                    </button>
                  )}
                </>
              )}

              <p className="text-xs text-gray-500 mt-3">Cracked: {cracked.size}/3</p>
            </div>
          </motion.div>
        )}

        {step === 2 && cracked.size >= 3 && (
          <motion.div key="allcracked" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <div className="text-5xl mb-3">🔓</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>ALL HASHES CRACKED!</h3>
              <p className="text-sm text-gray-400">Notice how common passwords are cracked instantly with a dictionary. Use strong, unique passwords + bcrypt!</p>
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
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
