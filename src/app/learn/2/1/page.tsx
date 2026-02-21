'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

interface PortPair {
  port: number;
  service: string;
  desc: string;
}

const portPairs: PortPair[] = [
  { port: 80, service: 'HTTP', desc: 'Web traffic (unencrypted)' },
  { port: 443, service: 'HTTPS', desc: 'Web traffic (encrypted/SSL)' },
  { port: 22, service: 'SSH', desc: 'Secure shell remote access' },
  { port: 21, service: 'FTP', desc: 'File transfer' },
  { port: 25, service: 'SMTP', desc: 'Sending email' },
  { port: 53, service: 'DNS', desc: 'Domain name resolution' },
  { port: 3306, service: 'MySQL', desc: 'MySQL database' },
  { port: 3389, service: 'RDP', desc: 'Remote desktop (Windows)' },
];

const lessons = [
  {
    title: "What Are Ports?",
    content: "Think of an IP address as a building's street address. Ports are like apartment numbers inside that building. When data arrives at your computer, the PORT tells it which program should handle it. Your web browser uses port 80/443, your SSH client uses port 22, etc.",
  },
  {
    title: "Well-Known Ports",
    content: "Ports 0-1023 are 'well-known' — they're reserved for standard services. Port 80 is ALWAYS HTTP. Port 443 is ALWAYS HTTPS. Port 22 is SSH. These are like universal rules everyone agrees on. Ports 1024-65535 can be used by any application.",
  },
];

export default function PortsMission() {
  const [step, setStep] = useState(0); // 0-1 = lessons, 2 = match game, 3 = speed round
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [speedRound, setSpeedRound] = useState<{ port: number; options: string[]; correct: string } | null>(null);
  const [speedCount, setSpeedCount] = useState(0);
  const [timer, setTimer] = useState(15);
  const [shake, setShake] = useState(false);

  const generateSpeedRound = useCallback(() => {
    const pair = portPairs[Math.floor(Math.random() * portPairs.length)];
    const wrong = portPairs.filter((p) => p.service !== pair.service).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...wrong.map((w) => w.service), pair.service].sort(() => Math.random() - 0.5);
    setSpeedRound({ port: pair.port, options, correct: pair.service });
    setTimer(15);
  }, []);

  useEffect(() => {
    if (step === 3 && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else if (step === 3 && timer === 0) {
      loseLife();
      if (speedCount < 4) generateSpeedRound();
      setTimer(15);
    }
  }, [step, timer, speedCount, generateSpeedRound]);

  const handleMatchService = (service: string) => {
    if (selectedPort === null) return;
    const pair = portPairs.find((p) => p.port === selectedPort);
    if (pair?.service === service) {
      setMatches({ ...matches, [selectedPort]: service });
      setSelectedPort(null);
      const newMatches = { ...matches, [selectedPort]: service };
      if (Object.keys(newMatches).length === portPairs.length) {
        setStep(3);
        generateSpeedRound();
      }
    } else {
      loseLife();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback(`Port ${selectedPort} is not ${service}!`);
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const handleSpeedAnswer = (service: string) => {
    if (!speedRound) return;
    if (service === speedRound.correct) {
      setScore(score + 1);
      setSpeedCount(speedCount + 1);
      if (speedCount + 1 >= 5) {
        completeMission('2-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        generateSpeedRound();
      }
    } else {
      loseLife();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      generateSpeedRound();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You know your ports now!" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Open the Door" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`lesson-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{lessons[step].content}</p>
            </div>

            {step === 1 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">📋 Common Ports</p>
                <div className="font-mono text-xs space-y-1">
                  {portPairs.map((p) => (
                    <div key={p.port} className="flex justify-between">
                      <span style={{ color: '#00f0ff' }}>:{p.port}</span>
                      <span style={{ color: '#39ff14' }}>{p.service}</span>
                      <span className="text-gray-500">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="match" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Match Ports to Services</h2>
              <p className="text-sm text-gray-400">Tap a port, then tap its matching service</p>
            </div>

            <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">Ports</p>
                  {portPairs.map((p) => (
                    <button
                      key={p.port}
                      disabled={!!matches[p.port]}
                      onClick={() => setSelectedPort(p.port)}
                      className={`w-full p-3 rounded-lg font-mono text-sm transition-all ${
                        matches[p.port] ? 'bg-green-900/20 opacity-50' :
                        selectedPort === p.port ? 'bg-cyan-900/30 border border-[#00f0ff]/50' : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      :{p.port}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">Services</p>
                  {[...portPairs].sort(() => 0.5 - Math.random()).map((p) => (
                    <button
                      key={p.service}
                      disabled={Object.values(matches).includes(p.service)}
                      onClick={() => handleMatchService(p.service)}
                      className={`w-full p-3 rounded-lg text-sm transition-all ${
                        Object.values(matches).includes(p.service) ? 'bg-green-900/20 opacity-50' : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      {p.service}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {feedback && <p className="text-sm text-center" style={{ color: '#ff3b30' }}>{feedback}</p>}
          </motion.div>
        )}

        {step === 3 && speedRound && (
          <motion.div key="speed" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold" style={{ color: '#ff9500' }}>⚡ Speed Round</h2>
                <span className="font-mono text-sm">{speedCount + 1}/5</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: timer > 5 ? '#39ff14' : '#ff3b30' }} animate={{ width: `${(timer / 15) * 100}%` }} />
              </div>
            </div>

            <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="card text-center">
              <p className="text-gray-400 text-sm mb-2">What service runs on port:</p>
              <p className="text-4xl font-mono font-bold" style={{ color: '#00f0ff' }}>:{speedRound.port}</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-2">
              {speedRound.options.map((opt) => (
                <button key={opt} onClick={() => handleSpeedAnswer(opt)} className="p-4 rounded-lg text-sm font-semibold bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
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
