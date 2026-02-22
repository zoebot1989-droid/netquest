'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const lessons = [
  {
    title: "What is Traceroute?",
    content: "Traceroute maps the path your data takes from your computer to a destination. It shows every router (hop) along the way, and how long each hop takes.\n\nIt works by sending packets with increasing TTL (Time To Live) values. Each router decrements TTL by 1. When TTL hits 0, the router sends back an error — revealing its identity.\n\nTTL=1 → First router responds\nTTL=2 → Second router responds\nTTL=3 → Third router responds\n...until you reach the destination.",
  },
  {
    title: "Reading Traceroute Output",
    content: "Each line shows:\n• Hop number — Which router in the chain\n• Router IP/hostname — Who is this router?\n• Round-trip times — Usually 3 measurements in ms\n\nExample:\n1  192.168.1.1    1.2 ms   (your home router)\n2  10.0.0.1       5.4 ms   (ISP first hop)\n3  72.14.215.85   12.3 ms  (backbone router)\n4  142.250.80.46  15.7 ms  (destination!)\n\nHigh times = slow link. * * * = router doesn't respond (filtered). Big jump = long physical distance.",
  },
];

const quizQuestions = [
  { q: "How does traceroute discover each hop?", options: ['By scanning ports', 'By sending packets with increasing TTL values', 'By querying DNS servers', 'By pinging all IPs in range'], correct: 1 },
  { q: "What does TTL stand for?", options: ['Total Transfer Length', 'Time To Live', 'Trace Transmission Log', 'Transport Type Layer'], correct: 1 },
  { q: "What does * * * in traceroute output mean?", options: ['The destination was reached', 'The hop didn\'t respond (filtered/timeout)', 'Maximum speed achieved', 'An error occurred'], correct: 1 },
  { q: "A sudden jump from 15ms to 150ms between hops likely means:", options: ['A firewall is blocking', 'A large physical distance (e.g., cross-ocean)', 'The server is down', 'DNS is slow'], correct: 1 },
];

export default function TracerouteMission() {
  const [step, setStep] = useState(0);
  const [traced, setTraced] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string, output: string[], _state: TerminalState) => {
    if (cmd.trim().toLowerCase().startsWith('traceroute')) {
      setTraced(true);
      setTimeout(() => setStep(3), 1500);
    }
  }, []);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-3-3', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You can trace any route!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Traceroute" pathId="networking" />
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
              {step < 1 ? 'Next →' : 'Try Traceroute →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="trace" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🗺️ Trace the Route</h3>
              <p className="text-sm text-gray-400 mb-3">
                Run <code className="text-cyan-400">traceroute google.com</code> to see the path packets take!
              </p>
              {traced && <p className="text-xs text-green-400 mb-2">✅ Route traced! Review the hops above.</p>}
            </div>
            <InlineTerminal onCommand={handleCommand} height="300px" />
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
