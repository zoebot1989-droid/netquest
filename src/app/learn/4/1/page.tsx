'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const steps = [
  {
    title: "What is Localhost?",
    content: "Localhost (127.0.0.1) is your own computer talking to itself. When you type 'localhost' in your browser, you're saying 'hey, connect to ME.' No internet needed — it's a loopback address.",
    visual: 'loopback',
  },
  {
    title: "Running a Local Server",
    content: "When you run 'npm start' or 'python -m http.server', your machine starts listening on a port (usually 3000 or 8000). Your browser can reach it at http://localhost:3000. But NOBODY else can — it's only on YOUR machine.",
    visual: 'local-server',
  },
  {
    title: "Why Only You Can See It",
    content: "Your computer's firewall and your router both block outside connections by default. localhost:3000 only exists inside your machine. To let others see your site, you need to either: deploy to a server, use port forwarding, or use a tunnel service.",
    visual: 'firewall',
  },
];

export default function LocalhostMission() {
  const [step, setStep] = useState(0);
  const [simState, setSimState] = useState<'idle' | 'running' | 'browser' | 'outside'>('idle');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    {
      q: "What IP address is 'localhost'?",
      options: ['192.168.1.1', '127.0.0.1', '0.0.0.0', '10.0.0.1'],
      correct: 1,
    },
    {
      q: "If you run a server on port 3000, can your friend access it from their phone?",
      options: ['Yes, just give them your IP', 'No — localhost is only reachable from your own machine', 'Only if they\'re on the same WiFi'],
      correct: 1,
    },
    {
      q: "What does 'listening on port 3000' mean?",
      options: ['Your computer is playing music', 'A program is waiting for connections on that port', 'Port 3000 is open to the internet'],
      correct: 1,
    },
  ];

  const handleQuiz = (answer: number) => {
    const q = quizQuestions[quizStep];
    if (answer === q.correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-4-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You understand localhost!" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Localhost" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{steps[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{steps[step].content}</p>
            </div>

            {/* Visual diagrams */}
            {steps[step].visual === 'loopback' && (
              <div className="card border-cyan-800/30">
                <div className="text-center font-mono text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">💻</span>
                    <span className="text-gray-500">Your Machine</span>
                  </div>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="text-xs" style={{ color: '#00f0ff' }}>
                    ↻ 127.0.0.1 (loops back to itself)
                  </motion.div>
                  <div className="text-xs text-gray-500 mt-2">
                    browser → localhost:3000 → your computer → your app → response → browser
                  </div>
                </div>
              </div>
            )}

            {steps[step].visual === 'local-server' && (
              <div className="card border-green-800/30">
                <p className="text-xs text-gray-400 mb-2">💻 Simulated Terminal</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span style={{ color: '#39ff14' }}>$</span> npm start</div>
                  <div className="text-gray-400">Starting development server...</div>
                  <div>✓ Ready on <span style={{ color: '#00f0ff' }}>http://localhost:3000</span></div>
                  <div className="text-gray-500">// Only YOUR browser can reach this!</div>
                </div>
              </div>
            )}

            {steps[step].visual === 'firewall' && (
              <div className="card border-red-800/30">
                <div className="text-center font-mono text-xs space-y-1">
                  <div className="flex items-center justify-center gap-4">
                    <div>💻<br/>localhost:3000<br/><span style={{ color: '#39ff14' }}>✓ works</span></div>
                    <div className="text-2xl">🧱</div>
                    <div>🌐<br/>Internet<br/><span style={{ color: '#ff3b30' }}>✗ blocked</span></div>
                  </div>
                  <p className="text-gray-500 mt-2">Firewall + Router = No outside access</p>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Simulation →'}
            </button>
          </motion.div>
        )}

        {step === 3 && !complete && quizStep < quizQuestions.length && (
          <motion.div key="sim" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Interactive simulation */}
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-2" style={{ color: '#ff9500' }}>🎮 Try It Yourself</h2>
              <p className="text-sm text-gray-400 mb-3">Simulate running a local server:</p>

              <div className="space-y-2">
                {simState === 'idle' && (
                  <button onClick={() => setSimState('running')} className="w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 font-mono text-sm text-left">
                    <span style={{ color: '#39ff14' }}>$</span> npm start
                  </button>
                )}

                {simState !== 'idle' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                    <div><span style={{ color: '#39ff14' }}>$</span> npm start</div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      <div className="text-gray-400">Compiling...</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                      <div>✓ Server running on <span style={{ color: '#00f0ff' }}>http://localhost:3000</span></div>
                    </motion.div>
                  </motion.div>
                )}

                {simState === 'running' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="space-y-2">
                    <button onClick={() => setSimState('browser')} className="w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-sm text-left">
                      🌐 Open localhost:3000 in browser
                    </button>
                    <button onClick={() => setSimState('outside')} className="w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-sm text-left">
                      📱 Friend tries to access your IP:3000
                    </button>
                  </motion.div>
                )}

                {simState === 'browser' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card border-green-800/30">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">Browser: localhost:3000</p>
                      <p className="text-lg" style={{ color: '#39ff14' }}>✅ Hello World!</p>
                      <p className="text-xs text-gray-500 mt-1">It works! You can see your own server.</p>
                    </div>
                    <button onClick={() => setSimState('running')} className="mt-2 text-xs text-gray-500 underline">← Back</button>
                  </motion.div>
                )}

                {simState === 'outside' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card border-red-800/30">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">Friend&apos;s Browser: 73.42.15.88:3000</p>
                      <p className="text-lg" style={{ color: '#ff3b30' }}>❌ Connection Refused</p>
                      <p className="text-xs text-gray-500 mt-1">Your firewall/router blocks outside connections!</p>
                    </div>
                    <button onClick={() => setSimState('running')} className="mt-2 text-xs text-gray-500 underline">← Back</button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quiz */}
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
