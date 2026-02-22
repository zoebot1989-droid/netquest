'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What's an Attack Surface?",
    content: "Your attack surface is everything that could potentially be exploited:\n\n• Open ports and running services\n• Web applications and APIs\n• User accounts and credentials\n• Physical access points\n• Third-party software and dependencies\n• Employee emails (phishing targets)\n\nThe bigger the attack surface, the more opportunities for attackers. Security = reducing your attack surface.",
  },
  {
    title: "Threat Actors",
    content: "Not all attackers are the same:\n\n👶 Script Kiddies — Use pre-built tools without understanding them. Low skill, high volume.\n\n✊ Hacktivists — Hack for political/social causes. Anonymous, WikiLeaks.\n\n🏢 Insiders — Employees or contractors with legitimate access who go rogue.\n\n💰 Cybercriminals — Organized groups motivated by money. Ransomware, data theft.\n\n🏛️ Nation States — Government-sponsored. APTs (Advanced Persistent Threats). Most sophisticated.",
  },
  {
    title: "The STRIDE Model",
    content: "STRIDE is a framework to categorize threats:\n\n🎭 Spoofing — Pretending to be someone else\n🔧 Tampering — Modifying data or code\n🙈 Repudiation — Denying you did something\n📢 Information Disclosure — Leaking sensitive data\n🚫 Denial of Service — Making systems unavailable\n⬆️ Elevation of Privilege — Getting higher access than allowed\n\nWhen you analyze a system, check for each STRIDE category.",
  },
];

const threatScenarios: { scenario: string; threat: string; options: string[]; correct: number }[] = [
  { scenario: "An attacker floods a web server with millions of requests, crashing it", threat: "DoS", options: ['Spoofing', 'Denial of Service', 'Tampering', 'Info Disclosure'], correct: 1 },
  { scenario: "A hacker intercepts and modifies data being sent between a user and server", threat: "Tampering", options: ['Tampering', 'Spoofing', 'Repudiation', 'Elevation of Privilege'], correct: 0 },
  { scenario: "An attacker crafts an email that appears to come from the CEO", threat: "Spoofing", options: ['Denial of Service', 'Info Disclosure', 'Spoofing', 'Repudiation'], correct: 2 },
  { scenario: "A database dump is posted on a hacking forum with user passwords", threat: "Info Disclosure", options: ['Tampering', 'Elevation of Privilege', 'Repudiation', 'Information Disclosure'], correct: 3 },
  { scenario: "A regular user exploits a bug to gain admin privileges", threat: "EoP", options: ['Spoofing', 'Denial of Service', 'Elevation of Privilege', 'Tampering'], correct: 2 },
];

const quizQuestions = [
  { q: "Which threat actor is MOST sophisticated?", options: ['Script kiddies', 'Hacktivists', 'Nation states', 'Insiders'], correct: 2 },
  { q: "What does the 'S' in STRIDE stand for?", options: ['Security', 'Spoofing', 'Scanning', 'Sniffing'], correct: 1 },
  { q: "Reducing your attack surface means...", options: ['Adding more features', 'Closing unnecessary ports and services', 'Making your code more complex', 'Hiring more developers'], correct: 1 },
];

export default function AttackSurface() {
  const [step, setStep] = useState(0);
  const [threatIdx, setThreatIdx] = useState(0);
  const [threatScore, setThreatScore] = useState(0);
  const [threatDone, setThreatDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleThreat = (answer: number) => {
    if (answer === threatScenarios[threatIdx].correct) setThreatScore(s => s + 1);
    if (threatIdx + 1 >= threatScenarios.length) setThreatDone(true);
    else setThreatIdx(threatIdx + 1);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-1-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You can now identify threats like a pro!" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Attack Surface & Threat Modeling" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'STRIDE Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !threatDone && (
          <motion.div key="threat" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🎯 Identify the STRIDE Threat</h2>
              <p className="text-xs text-gray-500 mb-2">{threatIdx + 1}/{threatScenarios.length}</p>
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-200">{threatScenarios[threatIdx].scenario}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {threatScenarios[threatIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => handleThreat(i)} className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-sm">{opt}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && threatDone && (
          <motion.div key="results" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">STRIDE Score: {threatScore}/{threatScenarios.length}</h3></div>
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
