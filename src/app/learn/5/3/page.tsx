'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What is NAT?",
    content: "NAT (Network Address Translation) lets multiple devices share a single public IP address. Your home router does this!\n\nYour devices have private IPs (192.168.1.x), but the internet sees only your router's public IP (e.g., 73.45.123.89).\n\nWhen your laptop sends a request, the router:\n1. Replaces your private IP with its public IP\n2. Keeps a translation table to remember which device sent what\n3. When the response comes back, routes it to the correct device\n\nThis is why NAT was invented — to conserve IPv4 addresses.",
  },
  {
    title: "Port Forwarding",
    content: "NAT hides your devices from the internet — great for security, but what if you WANT to expose a service?\n\nPort forwarding tells the router: \"Any traffic on port X, send it to device Y.\"\n\nExamples:\n• Port 80 → 192.168.1.50 (web server)\n• Port 25565 → 192.168.1.100 (Minecraft server)\n• Port 22 → 192.168.1.10 (SSH access)\n\nWithout port forwarding, incoming connections hit the router and get dropped — nobody inside knows about them.",
  },
  {
    title: "Types of NAT",
    content: "• SNAT (Source NAT) — Changes the source IP of outgoing packets. This is what your home router does.\n\n• DNAT (Destination NAT) — Changes the destination IP. Used for port forwarding and load balancing.\n\n• PAT (Port Address Translation) — Maps multiple private IPs to ONE public IP using different port numbers. Most common form.\n\nYour router running PAT might look like:\n192.168.1.10:54321 → 73.45.123.89:54321\n192.168.1.20:54322 → 73.45.123.89:54322\nSame public IP, different ports!",
  },
];

interface NatScenario {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const scenarios: NatScenario[] = [
  { question: 'Your laptop (192.168.1.5) visits google.com. What IP does Google see?', options: ['192.168.1.5', 'Your router\'s public IP', '127.0.0.1', 'Google\'s own IP'], correct: 1, explanation: 'NAT replaces your private IP with the router\'s public IP.' },
  { question: 'You want to run a web server at 192.168.1.50. What do you need?', options: ['A second router', 'Port forwarding rule: port 80 → 192.168.1.50', 'A new public IP for the server', 'Nothing, it just works'], correct: 1, explanation: 'Port forwarding directs incoming traffic to the right internal device.' },
  { question: 'How can 50 devices share one public IP?', options: ['They take turns', 'PAT — each gets a unique port number', 'They all use port 80', 'They can\'t'], correct: 1, explanation: 'PAT (Port Address Translation) assigns unique source ports per device.' },
  { question: 'An external user tries to reach 192.168.1.50 directly. What happens?', options: ['Connection succeeds', 'The request is NATed automatically', 'Nothing — private IPs are not routable on the internet', 'The ISP blocks it'], correct: 2, explanation: 'Private IP ranges are not routed on the public internet.' },
];

const quizQuestions = [
  { q: "What does NAT stand for?", options: ['Network Allocation Table', 'Network Address Translation', 'Node Assignment Tool', 'Network Access Terminal'], correct: 1 },
  { q: "Why was NAT invented?", options: ['To speed up the internet', 'To conserve IPv4 addresses', 'To encrypt traffic', 'To replace DNS'], correct: 1 },
  { q: "What does port forwarding do?", options: ['Opens all ports', 'Directs incoming traffic on a port to a specific internal device', 'Blocks all incoming traffic', 'Changes your public IP'], correct: 1 },
];

export default function NATMission() {
  const [step, setStep] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleScenario = (answer: number) => {
    const s = scenarios[scenarioIdx];
    if (answer === s.correct) {
      setScore(sc => sc + 1);
      setFeedback(`✅ ${s.explanation}`);
    } else {
      setFeedback(`❌ ${s.explanation}`);
      loseLife();
    }
    setTimeout(() => {
      setFeedback('');
      if (scenarioIdx + 1 >= scenarios.length) {
        setStep(4);
      } else {
        setScenarioIdx(scenarioIdx + 1);
      }
    }, 2000);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-5-3', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="NAT and port forwarding — understood!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="NAT" pathId="networking" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🏠 NAT in Action:</p>
                <div className="text-xs font-mono space-y-1">
                  <div className="text-gray-400">Internal Network → Router → Internet</div>
                  <div><span className="text-orange-400">192.168.1.5</span> → <span className="text-cyan-400">73.45.123.89</span> → google.com</div>
                  <div><span className="text-orange-400">192.168.1.10</span> → <span className="text-cyan-400">73.45.123.89</span> → youtube.com</div>
                  <div className="text-gray-500 mt-1">Same public IP, different source ports!</div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Test Your Knowledge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="scenarios" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🧠 NAT Scenarios ({scenarioIdx + 1}/{scenarios.length})</h3>
              <p className="text-sm mb-4" style={{ color: '#00f0ff' }}>{scenarios[scenarioIdx].question}</p>
              <div className="space-y-2">
                {scenarios[scenarioIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => handleScenario(i)} className="w-full text-left p-3 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && <p className="text-xs mt-3">{feedback}</p>}
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
