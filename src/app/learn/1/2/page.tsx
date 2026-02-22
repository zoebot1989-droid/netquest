'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What is Subnetting?",
    content: "Subnetting divides a large network into smaller sub-networks (subnets). Think of it like splitting a huge apartment building into separate floors — each floor is its own group, but they're all in the same building.\n\nWhy? Organization, security, and efficiency. Instead of one massive network with thousands of devices, you get manageable chunks.",
  },
  {
    title: "Subnet Masks",
    content: "A subnet mask tells you which part of an IP is the NETWORK and which part is the HOST.\n\n255.255.255.0 → first 3 octets = network, last octet = hosts\n255.255.0.0 → first 2 octets = network, last 2 = hosts\n255.0.0.0 → first octet = network, last 3 = hosts\n\nExample: IP 192.168.1.50 with mask 255.255.255.0\n• Network: 192.168.1.0\n• Host part: .50\n• Usable hosts: .1 to .254 (256 - 2 = 254)",
  },
  {
    title: "CIDR Notation",
    content: "CIDR (Classless Inter-Domain Routing) is shorthand for subnet masks:\n\n/24 = 255.255.255.0 → 256 IPs, 254 usable hosts\n/16 = 255.255.0.0 → 65,536 IPs, 65,534 hosts\n/8 = 255.0.0.0 → 16.7 million IPs\n/32 = single host\n/0 = the entire internet\n\nThe number after / is how many bits are for the network. 32 total bits minus the CIDR = host bits.\n\n192.168.1.0/24 means \"network 192.168.1, hosts 0-255\"",
  },
];

interface SubnetChallenge {
  ip: string;
  cidr: number;
  question: string;
  answer: string;
  hint: string;
}

const challenges: SubnetChallenge[] = [
  { ip: '192.168.1.50', cidr: 24, question: 'What is the network address?', answer: '192.168.1.0', hint: 'With /24, the last octet becomes 0' },
  { ip: '192.168.1.50', cidr: 24, question: 'What is the broadcast address?', answer: '192.168.1.255', hint: 'With /24, the last octet becomes 255' },
  { ip: '10.0.5.100', cidr: 16, question: 'What is the network address?', answer: '10.0.0.0', hint: 'With /16, the last two octets become 0' },
  { ip: '10.0.5.100', cidr: 16, question: 'How many usable hosts?', answer: '65534', hint: '2^16 - 2 = 65534' },
  { ip: '172.16.0.1', cidr: 24, question: 'What is the broadcast address?', answer: '172.16.0.255', hint: 'With /24, the last octet becomes 255' },
];

const quizQuestions = [
  { q: "What does a subnet mask of /24 mean?", options: ['24 devices allowed', '24 bits for the network portion', '24 subnets available', '24 routers needed'], correct: 1 },
  { q: "How many usable hosts does a /24 network have?", options: ['256', '255', '254', '252'], correct: 2 },
  { q: "What is CIDR short for?", options: ['Computer Internet Data Routing', 'Classless Inter-Domain Routing', 'Central IP Distribution Registry', 'Common Internet Domain Rules'], correct: 1 },
  { q: "Given IP 10.0.0.50/8, what is the network address?", options: ['10.0.0.0', '10.0.0.50', '10.255.255.255', '0.0.0.50'], correct: 0 },
];

export default function Subnetting101() {
  const [step, setStep] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleChallenge = () => {
    const c = challenges[challengeIdx];
    if (input.trim() === c.answer) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        setFeedback('');
        setInput('');
        if (challengeIdx + 1 >= challenges.length) {
          setStep(4);
        } else {
          setChallengeIdx(challengeIdx + 1);
        }
      }, 800);
    } else {
      setFeedback(`❌ Not quite. Hint: ${c.hint}`);
      loseLife();
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-1-2', 75);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={75} message="You can subnet like a pro!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Subnetting 101" pathId="networking" />
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
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">🧮 Subnet Calculator Challenge ({challengeIdx + 1}/{challenges.length})</h3>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-sm mb-3">
                <span style={{ color: '#39ff14' }}>IP:</span> {challenges[challengeIdx].ip}/{challenges[challengeIdx].cidr}
              </div>
              <p className="text-sm mb-3">{challenges[challengeIdx].question}</p>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChallenge()}
                placeholder="Type your answer..."
                className="w-full bg-gray-800/50 rounded-lg p-3 text-sm font-mono outline-none border border-gray-700 focus:border-cyan-500"
              />
              <button onClick={handleChallenge} className="btn-primary w-full mt-3">Submit</button>
              {feedback && <p className="text-sm mt-2">{feedback}</p>}
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
