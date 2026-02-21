'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

interface Device {
  id: string;
  name: string;
  icon: string;
  assignedIP: string;
  correctType: 'private' | 'public';
}

const devices: Device[] = [
  { id: 'laptop', name: 'Your Laptop', icon: '💻', assignedIP: '', correctType: 'private' },
  { id: 'printer', name: 'Office Printer', icon: '🖨️', assignedIP: '', correctType: 'private' },
  { id: 'webserver', name: 'Web Server', icon: '🌐', assignedIP: '', correctType: 'public' },
  { id: 'phone', name: 'Smart Phone', icon: '📱', assignedIP: '', correctType: 'private' },
];

const ipOptions = [
  { ip: '192.168.1.10', type: 'private' as const, label: '192.168.1.10 (Private)' },
  { ip: '10.0.0.5', type: 'private' as const, label: '10.0.0.5 (Private)' },
  { ip: '8.8.8.8', type: 'public' as const, label: '8.8.8.8 (Public)' },
  { ip: '172.16.0.1', type: 'private' as const, label: '172.16.0.1 (Private)' },
];

const lessons = [
  {
    title: "What's an IP Address?",
    content: "An IP address is like a home address for your device on a network. Every device that connects to the internet or a local network needs one so data knows where to go.",
  },
  {
    title: "Public vs Private IPs",
    content: "**Private IPs** are used inside your local network (home/office). They start with 192.168.x.x, 10.x.x.x, or 172.16-31.x.x. **Public IPs** are unique across the entire internet — they're how the world finds your network.",
  },
  {
    title: "How It Works Together",
    content: "Your router has one PUBLIC IP facing the internet. All devices in your home share it. Internally, each device gets a PRIVATE IP from the router (via DHCP). When you visit google.com, your router translates between your private IP and its public IP — this is called NAT.",
  },
];

export default function IPBasics() {
  const [step, setStep] = useState(0); // 0-2 = lessons, 3 = challenge, 4 = quiz
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAssign = (ip: string) => {
    if (!selectedDevice) return;
    setAssignments({ ...assignments, [selectedDevice]: ip });
    setSelectedDevice(null);
  };

  const checkAssignments = () => {
    // Check that web server got a public IP and others got private
    let correct = true;
    for (const d of devices) {
      const assigned = assignments[d.id];
      if (!assigned) { setFeedback('Assign an IP to every device first!'); return; }
      const opt = ipOptions.find((o) => o.ip === assigned);
      if (!opt || opt.type !== d.correctType) correct = false;
    }
    if (correct) {
      setFeedback('');
      setStep(4);
    } else {
      loseLife();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback('Not quite! Remember: local devices need private IPs, and the web server needs a public IP.');
    }
  };

  const handleQuiz = (answer: number) => {
    setQuizAnswer(answer);
    if (answer === 2) {
      completeMission('net-1-1', 50);
      setTimeout(() => setComplete(true), 500);
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You now understand IP addresses!" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="What's an IP?" />

      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`lesson-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>
                  {step + 1}/3
                </span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">💡 Example</p>
                <div className="font-mono text-sm space-y-1">
                  <div><span style={{ color: '#39ff14' }}>Your Phone</span> → <span style={{ color: '#00f0ff' }}>192.168.1.5</span></div>
                  <div><span style={{ color: '#39ff14' }}>Your Laptop</span> → <span style={{ color: '#00f0ff' }}>192.168.1.10</span></div>
                  <div><span style={{ color: '#39ff14' }}>Google Server</span> → <span style={{ color: '#00f0ff' }}>142.250.80.46</span></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="card border-green-800/30">
                <p className="text-xs text-gray-400 mb-2">📋 Private IP Ranges</p>
                <div className="font-mono text-xs space-y-1">
                  <div><span style={{ color: '#39ff14' }}>10.0.0.0</span> – <span style={{ color: '#39ff14' }}>10.255.255.255</span></div>
                  <div><span style={{ color: '#39ff14' }}>172.16.0.0</span> – <span style={{ color: '#39ff14' }}>172.31.255.255</span></div>
                  <div><span style={{ color: '#39ff14' }}>192.168.0.0</span> – <span style={{ color: '#39ff14' }}>192.168.255.255</span></div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge</h2>
              <p className="text-sm text-gray-400">Assign the correct type of IP to each device. Local devices need private IPs. The web server needs a public IP.</p>
            </div>

            <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="space-y-2">
              {devices.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDevice(d.id)}
                  className={`card cursor-pointer flex items-center gap-3 ${selectedDevice === d.id ? 'border-[#00f0ff]/50' : ''}`}
                >
                  <span className="text-2xl">{d.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-gray-500">Needs: {d.correctType} IP</div>
                  </div>
                  <div className="font-mono text-sm" style={{ color: assignments[d.id] ? '#39ff14' : '#64748b' }}>
                    {assignments[d.id] || 'Not set'}
                  </div>
                </div>
              ))}
            </motion.div>

            {selectedDevice && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <p className="text-xs text-gray-400 mb-2">Select an IP for {devices.find((d) => d.id === selectedDevice)?.name}:</p>
                <div className="grid grid-cols-2 gap-2">
                  {ipOptions.map((opt) => (
                    <button
                      key={opt.ip}
                      onClick={() => handleAssign(opt.ip)}
                      className="p-2 rounded-lg text-sm font-mono text-left bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                      style={{ color: opt.type === 'private' ? '#39ff14' : '#00f0ff' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {feedback && <p className="text-sm" style={{ color: '#ff3b30' }}>{feedback}</p>}

            <button onClick={checkAssignments} className="btn-primary w-full">Check Assignments</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-3">📝 Quick Quiz</h2>
              <p className="text-sm mb-4">Which of these is a PRIVATE IP address range?</p>
              {[
                '8.8.0.0 – 8.8.255.255',
                '142.250.0.0 – 142.250.255.255',
                '192.168.0.0 – 192.168.255.255',
                '1.1.0.0 – 1.1.255.255',
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuiz(i)}
                  disabled={quizAnswer !== null}
                  className={`w-full text-left p-3 rounded-lg mb-2 text-sm font-mono transition-colors ${
                    quizAnswer === null
                      ? 'bg-gray-800/50 hover:bg-gray-700/50'
                      : i === 2
                      ? 'bg-green-900/30 border border-green-500/30'
                      : quizAnswer === i
                      ? 'bg-red-900/30 border border-red-500/30'
                      : 'bg-gray-800/30 opacity-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
              {quizAnswer !== null && quizAnswer !== 2 && (
                <p className="text-sm mt-2" style={{ color: '#ff3b30' }}>
                  Not quite — 192.168.x.x is the private range. Try to remember: 10.x, 172.16-31.x, and 192.168.x are all private!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
