'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "The Hacker Mindset",
    content: "A hacker is someone who finds creative, unexpected ways to interact with systems. But not all hackers are the same:\n\n🎩 White Hat — Ethical hackers hired to find vulnerabilities BEFORE criminals do. They have permission.\n\n🖤 Black Hat — Criminals who hack for money, data theft, or destruction. Illegal.\n\n🔘 Grey Hat — Hack without permission but report vulnerabilities instead of exploiting them. Legal grey area.\n\nYou're here to become a White Hat — the good guys who get PAID to hack.",
  },
  {
    title: "The CIA Triad",
    content: "Every security decision revolves around three principles:\n\n🔒 Confidentiality — Only authorized people can access data. Encryption, access controls, authentication.\n\n✅ Integrity — Data hasn't been tampered with. Hashes, checksums, digital signatures.\n\n⚡ Availability — Systems are up and accessible when needed. Redundancy, DDoS protection, backups.\n\nEvery attack targets at least one of these. Every defense protects at least one.",
  },
  {
    title: "Why Companies Hire Hackers",
    content: "Bug bounties, penetration testing, and security audits are a massive industry:\n\n• Google pays up to $250,000 for critical bugs\n• Apple's bug bounty goes up to $2,000,000\n• HackerOne has paid out over $300 million to hackers\n• Average penetration tester salary: $85,000-$130,000\n• Responsible disclosure = finding bugs ethically and reporting them\n\nCompanies would rather PAY you to find holes than let criminals exploit them.",
  },
];

const scenarios: { scenario: string; ethical: boolean; explanation: string }[] = [
  { scenario: "A company hires you to test their website for vulnerabilities", ethical: true, explanation: "This is authorized penetration testing — classic white hat work." },
  { scenario: "You find a bug in a website and sell user data on the dark web", ethical: false, explanation: "Selling stolen data is illegal. This is black hat criminal activity." },
  { scenario: "You discover a vulnerability and report it to the company through their bug bounty program", ethical: true, explanation: "Responsible disclosure through official channels is ethical hacking." },
  { scenario: "You hack your school's grading system to change your grades", ethical: false, explanation: "Unauthorized access to systems is illegal, regardless of intent." },
  { scenario: "You scan your OWN home network to find security weaknesses", ethical: true, explanation: "Testing systems you own or have permission to test is perfectly legal." },
  { scenario: "You use a friend's WiFi password to sniff their network traffic", ethical: false, explanation: "Having WiFi access doesn't authorize you to intercept others' data." },
];

const quizQuestions = [
  { q: "What does the 'C' in CIA triad stand for?", options: ['Cybersecurity', 'Confidentiality', 'Cryptography', 'Compliance'], correct: 1 },
  { q: "A white hat hacker...", options: ['Hacks without permission', 'Is hired to find vulnerabilities legally', 'Sells exploits on the dark web', 'Only hacks for fun'], correct: 1 },
  { q: "What is responsible disclosure?", options: ['Telling everyone about a bug immediately', 'Keeping bugs secret forever', 'Reporting vulnerabilities to the affected company', 'Selling bugs to the highest bidder'], correct: 2 },
];

export default function HackerMindset() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);
  const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);
  const [scenarioDone, setScenarioDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (answer: boolean) => {
    const correct = answer === scenarios[scenarioIdx].ethical;
    if (correct) setScenarioScore(s => s + 1);
    setScenarioFeedback(scenarios[scenarioIdx].explanation);
    setTimeout(() => {
      setScenarioFeedback(null);
      if (scenarioIdx + 1 >= scenarios.length) {
        setScenarioDone(true);
      } else {
        setScenarioIdx(scenarioIdx + 1);
      }
    }, 2500);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-1-1', 50);
        addAchievement('white-hat');
        addAchievement('first-mission');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={50} message="Welcome to the world of ethical hacking! 🎩" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="The Hacker Mindset" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Ethical Hacking Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !scenarioDone && (
          <motion.div key="scenarios" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🎯 Ethical or Unethical?</h2>
              <p className="text-sm text-gray-400 mb-4">Classify each scenario</p>
              <p className="text-xs text-gray-500 mb-2">{scenarioIdx + 1}/{scenarios.length}</p>
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-200">{scenarios[scenarioIdx].scenario}</p>
              </div>
              {scenarioFeedback ? (
                <div className="p-3 rounded-lg bg-gray-800/50 text-sm text-gray-300">{scenarioFeedback}</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleScenario(true)} className="p-3 rounded-lg bg-green-900/30 hover:bg-green-800/40 transition-colors text-sm font-semibold text-green-400">✅ Ethical</button>
                  <button onClick={() => handleScenario(false)} className="p-3 rounded-lg bg-red-900/30 hover:bg-red-800/40 transition-colors text-sm font-semibold text-red-400">❌ Unethical</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && scenarioDone && (
          <motion.div key="results" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Results: {scenarioScore}/{scenarios.length} correct!</h3>
              <p className="text-sm text-gray-400">{scenarioScore >= 5 ? 'You have strong ethical instincts!' : 'Ethics are crucial — always get permission!'}</p>
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
