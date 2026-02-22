'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What is a VPN?",
    content: "A VPN (Virtual Private Network) creates an encrypted tunnel between your device and a VPN server. All your internet traffic flows through this tunnel.\n\nWithout VPN: You → ISP → Internet (ISP sees everything)\nWith VPN: You → [Encrypted Tunnel] → VPN Server → Internet\n\nBenefits:\n• Privacy: ISP can't see your traffic\n• Security: Public WiFi is safe\n• Access: Bypass geo-restrictions\n• Anonymity: Websites see VPN server's IP, not yours",
  },
  {
    title: "How VPN Tunneling Works",
    content: "A VPN wraps your original packet inside an encrypted outer packet — like putting a letter inside a locked box, then inside a shipping envelope.\n\nOriginal packet: [Your IP → google.com | data]\nEncrypted packet: [Your IP → VPN Server | 🔒encrypted(original packet)🔒]\n\nThe VPN server decrypts it, sends the original request to google.com, gets the response, encrypts it, and sends it back through the tunnel.",
  },
  {
    title: "VPN Types & Protocols",
    content: "Types:\n• Remote Access VPN — You → VPN Server (what most people use)\n• Site-to-Site VPN — Office A ↔ Office B (connects entire networks)\n\nProtocols:\n• WireGuard — Modern, fast, simple. The new standard.\n• OpenVPN — Battle-tested, open source, works everywhere.\n• IPSec/IKEv2 — Built into most OSes, good for mobile.\n• L2TP — Older, often paired with IPSec.\n• PPTP — Ancient, insecure. Don't use.\n\nWireGuard is typically the best choice for speed and simplicity.",
  },
];

const vpnSteps = [
  { label: 'Your Device', emoji: '💻', desc: 'You want to visit example.com' },
  { label: 'Encrypt', emoji: '🔒', desc: 'VPN client encrypts your request' },
  { label: 'VPN Tunnel', emoji: '🚇', desc: 'Encrypted data travels through the tunnel' },
  { label: 'VPN Server', emoji: '🖥️', desc: 'Server decrypts and forwards to example.com' },
  { label: 'Website', emoji: '🌐', desc: 'example.com sees VPN server\'s IP, not yours' },
  { label: 'Response', emoji: '📨', desc: 'Response encrypted back through tunnel to you' },
];

const quizQuestions = [
  { q: "What does a VPN encrypt?", options: ['Only passwords', 'Only HTTPS traffic', 'All traffic between you and the VPN server', 'Nothing, it just changes your IP'], correct: 2 },
  { q: "Which VPN protocol is considered the modern standard?", options: ['PPTP', 'L2TP', 'WireGuard', 'Telnet'], correct: 2 },
  { q: "What type of VPN connects two office networks?", options: ['Remote Access', 'Site-to-Site', 'Peer-to-Peer', 'Mesh'], correct: 1 },
  { q: "What does a website see when you use a VPN?", options: ['Your real IP', 'The VPN server\'s IP', 'No IP at all', 'Your ISP\'s IP'], correct: 1 },
];

export default function VPNMission() {
  const [step, setStep] = useState(0);
  const [vpnStep, setVpnStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-5-4', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="VPN tunneling — understood!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="VPN" pathId="networking" />
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
              {step < 2 ? 'Next →' : 'Trace a VPN Packet →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="vpn" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">🚇 Trace a Packet Through a VPN</h3>
              <div className="space-y-3">
                {vpnSteps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= vpnStep ? 1 : 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${i <= vpnStep ? 'bg-gray-800/50' : 'bg-gray-900/30'} ${i === vpnStep ? 'ring-1 ring-cyan-700' : ''}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-gray-400">{i <= vpnStep ? s.desc : '???'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (vpnStep + 1 >= vpnSteps.length) setStep(4);
                  else setVpnStep(vpnStep + 1);
                }}
                className="btn-primary w-full mt-4"
              >
                {vpnStep + 1 >= vpnSteps.length ? 'Take the Quiz →' : 'Next Step →'}
              </button>
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
