'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Capture the Flag (CTF)",
    content: "CTF competitions are hacking challenges where you find hidden 'flags' — usually strings like flag{h4ck_th3_pl4n3t}.\n\n🏴 Types:\n• Jeopardy — Solve individual challenges in categories (web, crypto, forensics, binary, misc)\n• Attack-Defense — Teams attack each other's servers while defending their own\n• King of the Hill — Capture and hold targets\n\n🌐 Platforms:\n• HackTheBox — Hack real machines\n• TryHackMe — Guided learning paths\n• picoCTF — Beginner-friendly by CMU\n• OverTheWire — Classic wargames\n• CTFtime.org — Find live competitions",
  },
];

const ctfChallenges = [
  {
    title: "🔤 Challenge 1: Decode the Message",
    description: "This encoded message was intercepted. Decode it to find the flag!",
    encoded: "ZmxhZ3tiYXNlNjRfZGVjMGQzZH0=",
    hint: "This looks like Base64 encoding...",
    answer: "flag{base64_dec0d3d}",
    explanation: "Base64 is commonly used to encode data. The string ZmxhZ3tiYXNlNjRfZGVjMGQzZH0= decodes to flag{base64_dec0d3d}.",
  },
  {
    title: "🔍 Challenge 2: Hidden in Plain Sight",
    description: "The flag is hidden somewhere in this HTML page source. Inspect carefully!",
    encoded: `<html>\n<head><title>Nothing here</title></head>\n<body>\n  <h1>Welcome!</h1>\n  <p>This is a normal page.</p>\n  <!-- TODO: remove before production -->\n  <!-- flag{html_c0mm3nt_l34k} -->\n  <div style="display:none">Not the flag</div>\n</body>\n</html>`,
    hint: "Check HTML comments (<!-- -->). Developers sometimes leave secrets in comments...",
    answer: "flag{html_c0mm3nt_l34k}",
    explanation: "HTML comments (<!-- -->) are visible in page source! Never put secrets in comments. Always check source code during CTFs.",
  },
  {
    title: "🔓 Challenge 3: Crack the Hash",
    description: "This MD5 hash was found in a database dump. What's the original password?",
    encoded: "Hash: 5f4dcc3b5aa765d61d8327deb882cf99\nAlgorithm: MD5\nHint: It's one of the most common passwords ever.",
    hint: "Try looking up common MD5 hashes. The most obvious password in the world...",
    answer: "flag{password}",
    explanation: "The MD5 hash 5f4dcc3b... is the hash of 'password' — the #1 most common password. Many hashes of common passwords are well-known.",
  },
];

export default function CTFMission() {
  const [step, setStep] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [attempt, setAttempt] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleSubmit = () => {
    const current = ctfChallenges[challengeIdx];
    const input = attempt.trim().toLowerCase();
    if (input === current.answer || input === current.answer.replace('flag{', '').replace('}', '') || 
        (challengeIdx === 2 && input === 'password')) {
      const newSolved = new Set(solved);
      newSolved.add(challengeIdx);
      setSolved(newSolved);
      setFeedback(current.explanation);
      if (newSolved.size >= 3) addAchievement('ctf-champion');
    } else {
      setFeedback("❌ Not quite. Try again!");
      setTimeout(() => setFeedback(null), 1500);
    }
    setAttempt('');
  };

  const nextChallenge = () => {
    setFeedback(null);
    setShowHint(false);
    if (challengeIdx + 1 >= ctfChallenges.length) {
      setStep(2);
    } else {
      setChallengeIdx(challengeIdx + 1);
    }
  };

  const quizQuestions = [
    { q: "In a Jeopardy-style CTF, you...", options: ['Attack other teams', 'Solve individual challenges to find flags', 'Defend a server', 'Write exploits for sale'], correct: 1 },
    { q: "Which platform is best for CTF beginners?", options: ['Metasploit', 'picoCTF', 'Shodan', 'Wireshark'], correct: 1 },
    { q: "A CTF flag typically looks like...", options: ['A QR code', 'flag{some_text_here}', 'An IP address', 'A password hash'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-6-1', 100);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={100} message="CTF Champion! 🏆" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={6} title="Capture the Flag (CTF)" pathId="cybersecurity" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-red-900/30 text-red-400">1/1</span>
                <h2 className="font-semibold">{lessons[0].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[0].content}</p>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Start CTF Challenges →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key={`ctf-${challengeIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-2 text-red-400">{ctfChallenges[challengeIdx].title}</h2>
              <p className="text-xs text-gray-500 mb-3">Challenge {challengeIdx + 1}/{ctfChallenges.length}</p>
              <p className="text-sm text-gray-300 mb-3">{ctfChallenges[challengeIdx].description}</p>
              
              <pre className="bg-black/80 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto mb-4 whitespace-pre-wrap">{ctfChallenges[challengeIdx].encoded}</pre>

              {!solved.has(challengeIdx) ? (
                <>
                  <div className="flex gap-2 mb-2">
                    <input value={attempt} onChange={e => setAttempt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      className="flex-1 bg-black/50 rounded p-2 text-sm font-mono text-white border border-gray-700" placeholder="Enter flag..." />
                    <button onClick={handleSubmit} className="px-4 py-2 rounded bg-red-900/50 hover:bg-red-800/60 text-sm font-semibold text-red-300">Submit</button>
                  </div>
                  <button onClick={() => setShowHint(true)} className="text-xs text-gray-500 hover:text-gray-300">
                    {showHint ? `💡 ${ctfChallenges[challengeIdx].hint}` : '💡 Need a hint?'}
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-800/30">
                    <p className="text-green-400 font-semibold text-sm">🏴 FLAG CAPTURED!</p>
                    <p className="font-mono text-xs text-green-300 mt-1">{ctfChallenges[challengeIdx].answer}</p>
                  </div>
                  {feedback && <p className="text-xs text-gray-400">{feedback}</p>}
                  <button onClick={nextChallenge} className="btn-primary w-full">
                    {challengeIdx + 1 >= ctfChallenges.length ? 'Take the Quiz →' : 'Next Challenge →'}
                  </button>
                </div>
              )}

              {feedback && !solved.has(challengeIdx) && <p className="text-xs text-red-400 mt-2">{feedback}</p>}
            </div>
          </motion.div>
        )}

        {step === 2 && (
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
