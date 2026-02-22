'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Encryption vs Hashing",
    content: "Two different ways to protect data:\n\n🔐 Encryption — Reversible. You can decrypt with the right key.\nUsed for: sending messages, HTTPS, file protection.\n\n#️⃣ Hashing — One-way. Cannot be reversed.\nUsed for: storing passwords, verifying file integrity.\n\nExample:\nEncryption: 'hello' → 'xJ8kQ2' → 'hello' (can get back)\nHashing: 'hello' → '5d41402abc4b2a76b9719d911017c592' (cannot get back)",
  },
  {
    title: "Symmetric vs Asymmetric",
    content: "🔑 Symmetric Encryption — Same key to encrypt and decrypt.\n• AES (Advanced Encryption Standard) — military grade, fast\n• Used for: disk encryption, VPNs, file encryption\n• Problem: how do you securely share the key?\n\n🔑🔑 Asymmetric Encryption — Two keys: public + private.\n• RSA, ECC — slower but solves key sharing\n• Public key encrypts, private key decrypts\n• Used for: HTTPS, SSH, digital signatures, PGP email\n\nHTTPS uses BOTH: asymmetric to exchange keys, then symmetric for speed.",
  },
  {
    title: "Common Algorithms",
    content: "Encryption:\n• AES-256 — Gold standard symmetric encryption (256-bit key)\n• RSA-2048 — Common asymmetric, uses prime number factoring\n• ChaCha20 — Fast symmetric, used in WireGuard VPN\n\nHashing:\n• MD5 — ⚠️ BROKEN. Never use for security.\n• SHA-1 — ⚠️ BROKEN. Deprecated.\n• SHA-256 — Secure. Used in Bitcoin, TLS, password storage.\n• bcrypt — Designed for passwords. Intentionally slow. Includes salt.\n\nRule: Never roll your own crypto. Use established algorithms.",
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function caesarEncrypt(text: string, shift: number): string {
  return text.toUpperCase().split('').map(ch => {
    const idx = ALPHABET.indexOf(ch);
    if (idx === -1) return ch;
    return ALPHABET[(idx + shift) % 26];
  }).join('');
}

function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, 26 - shift);
}

const quizQuestions = [
  { q: "Which is a ONE-WAY function (cannot be reversed)?", options: ['AES encryption', 'RSA encryption', 'SHA-256 hashing', 'Caesar cipher'], correct: 2 },
  { q: "Why is MD5 considered broken?", options: ['It is too slow', 'Collisions can be created (two inputs → same hash)', 'It only works on small files', 'It requires a password'], correct: 1 },
  { q: "HTTPS uses...", options: ['Only symmetric encryption', 'Only asymmetric encryption', 'Both symmetric and asymmetric', 'No encryption'], correct: 2 },
];

export default function CryptoBasics() {
  const [step, setStep] = useState(0);
  const [cipherInput, setCipherInput] = useState('HELLO WORLD');
  const [cipherShift, setCipherShift] = useState(3);
  const [cipherMode, setCipherMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [challengeSolved, setChallengeSolved] = useState(false);
  const [decryptAttempt, setDecryptAttempt] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const secretMessage = caesarEncrypt('HACK THE PLANET', 7);

  const handleDecrypt = () => {
    if (decryptAttempt.toUpperCase().trim() === 'HACK THE PLANET') {
      setChallengeSolved(true);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-1-3', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="You've cracked the code! 🔐" backHref="/path/cybersecurity" />;

  const cipherResult = cipherMode === 'encrypt' ? caesarEncrypt(cipherInput, cipherShift) : caesarDecrypt(cipherInput, cipherShift);

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Cryptography Basics" pathId="cybersecurity" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-red-900/30 text-red-400">{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Cipher Tool →'}</button>
          </motion.div>
        )}

        {step === 3 && !challengeSolved && (
          <motion.div key="cipher" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-3 text-red-400">🔐 Caesar Cipher Tool</h2>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setCipherMode('encrypt')} className={`text-xs px-3 py-1 rounded ${cipherMode === 'encrypt' ? 'bg-red-900/30 text-red-400' : 'bg-gray-800/50 text-gray-500'}`}>Encrypt</button>
                <button onClick={() => setCipherMode('decrypt')} className={`text-xs px-3 py-1 rounded ${cipherMode === 'decrypt' ? 'bg-red-900/30 text-red-400' : 'bg-gray-800/50 text-gray-500'}`}>Decrypt</button>
              </div>
              <input value={cipherInput} onChange={e => setCipherInput(e.target.value)} className="w-full bg-black/50 rounded p-2 text-sm font-mono text-white mb-2" placeholder="Enter text..." />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400">Shift:</span>
                <input type="range" min="1" max="25" value={cipherShift} onChange={e => setCipherShift(parseInt(e.target.value))} className="flex-1" />
                <span className="text-xs font-mono text-red-400 w-6">{cipherShift}</span>
              </div>
              <div className="bg-black/50 rounded p-3 font-mono text-sm" style={{ color: '#39ff14' }}>{cipherResult}</div>
            </div>

            <div className="card border-orange-800/30">
              <h3 className="font-semibold mb-2" style={{ color: '#ff9500' }}>🎯 Decrypt This Message!</h3>
              <p className="text-xs text-gray-400 mb-2">This was encrypted with a Caesar cipher (shift unknown). Use the tool above to crack it!</p>
              <div className="bg-black/50 rounded p-3 font-mono text-sm text-red-400 mb-3">{secretMessage}</div>
              <div className="flex gap-2">
                <input value={decryptAttempt} onChange={e => setDecryptAttempt(e.target.value)} className="flex-1 bg-black/50 rounded p-2 text-sm font-mono text-white" placeholder="Decrypted message..." />
                <button onClick={handleDecrypt} className="btn-primary px-4">Check</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Hint: Try different shift values in the tool above. The shift is between 1-25.</p>
            </div>
          </motion.div>
        )}

        {step === 3 && challengeSolved && (
          <motion.div key="solved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <div className="text-4xl mb-2">🔓</div>
              <h3 className="font-semibold text-green-400 mb-1">MESSAGE DECRYPTED!</h3>
              <p className="font-mono text-sm" style={{ color: '#39ff14' }}>HACK THE PLANET</p>
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
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
