'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Why IPv6?",
    content: "IPv4 uses 32-bit addresses: about 4.3 billion possible IPs. Sounds like a lot? There are 8+ billion people and 30+ billion internet-connected devices. We literally ran out of IPv4 addresses.\n\nIPv6 uses 128-bit addresses: 340 undecillion (3.4 × 10³⁸) possible IPs. That's enough to give every atom on Earth its own IP address... several times over.",
  },
  {
    title: "Format Differences",
    content: "IPv4: 192.168.1.1 → Four decimal octets separated by dots (0-255 each)\n\nIPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 → Eight groups of 4 hex digits separated by colons\n\nIPv6 shortcuts:\n• Leading zeros can be dropped: 0db8 → db8\n• Consecutive zero groups → :: (once only)\n• 2001:0db8:0000:0000:0000:0000:0000:0001 → 2001:db8::1",
  },
  {
    title: "Dual Stack & Transition",
    content: "We can't switch overnight — both protocols coexist:\n\n• Dual Stack: Device runs BOTH IPv4 and IPv6 simultaneously\n• Tunneling: IPv6 packets wrapped inside IPv4 for transport\n• NAT64: Translates between IPv4 and IPv6\n\nMost modern devices and networks already support IPv6. Google reports ~45% of traffic uses IPv6. The transition is happening — slowly but surely.",
  },
];

interface CompareItem {
  feature: string;
  answer: 'ipv4' | 'ipv6';
}

const compareItems: CompareItem[] = [
  { feature: '32-bit addresses', answer: 'ipv4' },
  { feature: '128-bit addresses', answer: 'ipv6' },
  { feature: 'Dotted decimal notation (192.168.1.1)', answer: 'ipv4' },
  { feature: 'Hexadecimal colon notation (2001:db8::1)', answer: 'ipv6' },
  { feature: 'About 4.3 billion addresses', answer: 'ipv4' },
  { feature: 'Built-in IPsec support', answer: 'ipv6' },
  { feature: 'Requires NAT for address conservation', answer: 'ipv4' },
  { feature: 'No need for NAT — enough addresses for everyone', answer: 'ipv6' },
];

const quizQuestions = [
  { q: "Why was IPv6 created?", options: ['IPv4 was too slow', 'IPv4 ran out of addresses', 'IPv4 was insecure', 'IPv4 was too expensive'], correct: 1 },
  { q: "How many bits in an IPv6 address?", options: ['32', '64', '128', '256'], correct: 2 },
  { q: "What does :: mean in an IPv6 address?", options: ['End of address', 'One or more groups of all zeros', 'Loopback address', 'Broadcast'], correct: 1 },
  { q: "What is dual stack?", options: ['Two network cards', 'Running IPv4 and IPv6 simultaneously', 'Two firewalls', 'Double encryption'], correct: 1 },
];

export default function IPv4vsIPv6() {
  const [step, setStep] = useState(0);
  const [compareIdx, setCompareIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCompare = (answer: 'ipv4' | 'ipv6') => {
    const correct = answer === compareItems[compareIdx].answer;
    if (correct) {
      setScore(s => s + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ That's ${compareItems[compareIdx].answer === 'ipv4' ? 'IPv4' : 'IPv6'}!`);
      loseLife();
    }
    setTimeout(() => {
      setFeedback('');
      if (compareIdx + 1 >= compareItems.length) {
        setStep(4);
      } else {
        setCompareIdx(compareIdx + 1);
      }
    }, 800);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-1-3', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="IPv4 vs IPv6 — mastered!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="IPv4 vs IPv6" pathId="networking" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="compare" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">⚡ IPv4 or IPv6? ({compareIdx + 1}/{compareItems.length})</h3>
              <p className="text-sm mb-4 text-center font-mono" style={{ color: '#00f0ff' }}>{compareItems[compareIdx].feature}</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleCompare('ipv4')} className="p-4 rounded-lg bg-gray-800/50 hover:bg-orange-900/30 transition-colors text-center">
                  <span className="text-2xl block mb-1">4️⃣</span>
                  <span className="text-sm font-semibold">IPv4</span>
                </button>
                <button onClick={() => handleCompare('ipv6')} className="p-4 rounded-lg bg-gray-800/50 hover:bg-cyan-900/30 transition-colors text-center">
                  <span className="text-2xl block mb-1">6️⃣</span>
                  <span className="text-sm font-semibold">IPv6</span>
                </button>
              </div>
              {feedback && <p className="text-sm mt-3 text-center">{feedback}</p>}
              <p className="text-xs text-gray-500 mt-2 text-center">Score: {score}/{compareIdx + (feedback ? 1 : 0)}</p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
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
