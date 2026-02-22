'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Network Debugging Mindset",
    content: "When something breaks on a network, you need a systematic approach:\n\n1️⃣ Is the machine on? (ping localhost / check interface)\n2️⃣ Can you reach the local network? (ping gateway)\n3️⃣ Can you reach the internet? (ping 8.8.8.8)\n4️⃣ Does DNS work? (ping google.com vs ping 8.8.8.8)\n5️⃣ Is the service running? (systemctl status, port check)\n6️⃣ Is the firewall blocking? (iptables -L)\n\nStart from the bottom (physical/local) and work your way up.",
  },
  {
    title: "Essential Debug Tools",
    content: "Your networking toolkit:\n\n• ping — Is the host reachable?\n• traceroute — Where is traffic getting stuck?\n• nslookup / dig — Is DNS resolving correctly?\n• netstat / ss — What ports are listening?\n• curl — Can I reach the web service?\n• iptables -L — What firewall rules are active?\n• ifconfig / ip addr — What's my IP and interface status?\n\nEach tool answers a different question. Use them in order to isolate the problem layer by layer.",
  },
];

interface DebugScenario {
  title: string;
  symptoms: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const scenarios: DebugScenario[] = [
  {
    title: 'Scenario 1: Website Down',
    symptoms: '• Users report mysite.com is unreachable\n• ping mysite.com fails\n• ping 93.184.216.34 (the server IP) works fine',
    question: 'What is most likely the problem?',
    options: ['Server is down', 'DNS is not resolving mysite.com', 'The internet is broken', 'Firewall is blocking port 80'],
    correct: 1,
    explanation: 'If the IP works but the domain doesn\'t, DNS is the issue. Check A records.',
  },
  {
    title: 'Scenario 2: Can\'t SSH',
    symptoms: '• ssh user@server times out\n• ping server IP works\n• Website on port 80 loads fine',
    question: 'What should you check first?',
    options: ['DNS settings', 'If port 22 is open in the firewall', 'If the server has enough RAM', 'Your SSH key format'],
    correct: 1,
    explanation: 'Ping works and HTTP works, so the server is up. Port 22 is likely blocked by a firewall.',
  },
  {
    title: 'Scenario 3: Slow Website',
    symptoms: '• Website loads but takes 15 seconds\n• traceroute shows a hop at 500ms\n• Server CPU is fine',
    question: 'Where is the bottleneck?',
    options: ['Server is overloaded', 'A network hop is causing high latency', 'The HTML is too large', 'DNS is slow'],
    correct: 1,
    explanation: 'The traceroute reveals a high-latency hop — a network routing issue.',
  },
  {
    title: 'Scenario 4: Partial Outage',
    symptoms: '• Some users can reach the site, others can\'t\n• ping 8.8.8.8 works for affected users\n• nslookup returns different IPs for different users',
    question: 'What\'s happening?',
    options: ['The server is crashing intermittently', 'DNS propagation — old records still cached', 'Load balancer is broken', 'Users have bad internet'],
    correct: 1,
    explanation: 'Different DNS results = propagation. DNS changes take time to spread globally.',
  },
  {
    title: 'Scenario 5: Connection Refused',
    symptoms: '• curl http://server:80 returns "Connection refused"\n• ping works\n• iptables shows port 80 is ACCEPT',
    question: 'What\'s the issue?',
    options: ['Firewall is blocking', 'The web server (nginx) isn\'t running', 'DNS is wrong', 'The server has no public IP'],
    correct: 1,
    explanation: '"Connection refused" means the port is reachable but nothing is listening — the web server is stopped.',
  },
];

const quizQuestions = [
  { q: "What's the first thing to check when a server is unreachable?", options: ['Check the code', 'Can you ping it?', 'Restart nginx', 'Check DNS'], correct: 1 },
  { q: "'Connection refused' vs 'Connection timed out' — what's the difference?", options: ['They mean the same thing', 'Refused = port reachable but no service; Timed out = port unreachable/blocked', 'Refused = bad password; Timed out = slow server', 'Refused = DNS error; Timed out = routing error'], correct: 1 },
  { q: "ping works but curl doesn't. What layer is the problem?", options: ['Physical layer', 'Network layer', 'Application/service layer', 'DNS layer'], correct: 2 },
];

export default function DebugNetwork() {
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
        setStep(3);
      } else {
        setScenarioIdx(scenarioIdx + 1);
      }
    }, 2500);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-6-3', 100);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={100} message="Network debugger extraordinaire! 🔧" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={6} title="Debug the Network" pathId="networking" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Debugging →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="debug" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">{scenarios[scenarioIdx].title}</h3>
              <div className="bg-black/40 rounded-lg p-3 font-mono text-xs mb-3">
                <p className="text-red-400 mb-1">⚠️ Symptoms:</p>
                <p className="text-gray-300 whitespace-pre-line">{scenarios[scenarioIdx].symptoms}</p>
              </div>
              <p className="text-sm mb-3" style={{ color: '#00f0ff' }}>{scenarios[scenarioIdx].question}</p>
              <div className="space-y-2">
                {scenarios[scenarioIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => handleScenario(i)} className="w-full text-left p-3 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && <p className="text-xs mt-3">{feedback}</p>}
              <p className="text-xs text-gray-500 mt-2">Scenario {scenarioIdx + 1}/{scenarios.length} | Score: {score}</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
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
