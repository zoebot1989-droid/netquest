'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Network Hardware",
    content: "Every network is built from physical hardware:\n\n📡 Router — Connects your network to the internet. Assigns IPs (DHCP), routes traffic, has firewall.\n\n🔀 Switch — Connects devices within a network. Sends data only to the right device (not broadcast). Managed switches let you configure VLANs.\n\n📶 Access Point (AP) — Provides WiFi. Not a router — just wireless connectivity. Enterprise APs handle 50+ clients.\n\n🔌 NIC (Network Interface Card) — The network port on your computer. Built into most motherboards. Server NICs can do 10/25/100 GbE.",
  },
  {
    title: "Cable Types",
    content: "🔌 Ethernet Cables:\n\n• Cat5e — Up to 1 Gbps, 100m max. Budget option.\n• Cat6 — Up to 10 Gbps at 55m, 1 Gbps at 100m. Standard choice.\n• Cat6a — Up to 10 Gbps at 100m. Best copper option.\n• Cat7 — Shielded, 10 Gbps. Overkill for most.\n• Cat8 — 25/40 Gbps. Data center only.\n\n🔵 Fiber Optic:\n• Single-mode — Long distance (km), expensive\n• Multi-mode — Short distance (300m), cheaper\n• Way faster: 10/25/40/100 Gbps+\n• Immune to electromagnetic interference\n\n⚡ PoE (Power over Ethernet)\n• Sends power + data over one cable\n• Powers: security cameras, access points, VoIP phones\n• PoE switch or PoE injector provides the power",
  },
  {
    title: "Building a Network",
    content: "A typical small office network:\n\n🌐 ISP → Modem → Router\n    └→ Switch (24-port)\n        ├→ Desktops (Cat6)\n        ├→ Server (Cat6a)\n        ├→ Access Point (PoE)\n        ├→ IP Cameras (PoE)\n        └→ Network Printer\n\nKey design principles:\n• Use a managed switch for VLANs (separate guest/IoT traffic)\n• Run Cat6a for future-proofing\n• Place APs centrally for best WiFi coverage\n• Use PoE to reduce cable runs (no separate power for APs/cameras)\n• Label every cable! Future you will thank you.\n• Keep network gear in a ventilated closet or rack",
  },
];

interface NetworkItem { name: string; category: string; price: number; poe?: boolean }
const networkItems: NetworkItem[] = [
  { name: 'Ubiquiti ER-X Router', category: 'Router', price: 60 },
  { name: 'TP-Link 8-port Managed Switch', category: 'Switch', price: 50 },
  { name: 'TP-Link 16-port PoE Switch', category: 'Switch', price: 120, poe: true },
  { name: 'Ubiquiti U6 Lite AP', category: 'Access Point', price: 100, poe: true },
  { name: 'Cat6 Cable Box (300m)', category: 'Cables', price: 80 },
  { name: 'PoE IP Camera', category: 'Camera', price: 60, poe: true },
  { name: 'Network Patch Panel', category: 'Infrastructure', price: 30 },
  { name: 'Small Network Rack (6U)', category: 'Infrastructure', price: 70 },
];

const cableQuiz = [
  { scenario: 'Home network, 1 Gbps, budget', answer: 'Cat5e', options: ['Cat5e', 'Cat6a', 'Fiber Multi-mode'] },
  { scenario: 'Office backbone, 10 Gbps, 80m run', answer: 'Cat6a', options: ['Cat5e', 'Cat6', 'Cat6a'] },
  { scenario: 'Between buildings, 500m distance', answer: 'Fiber Single-mode', options: ['Cat6a', 'Fiber Multi-mode', 'Fiber Single-mode'] },
  { scenario: 'Powering a WiFi access point on ceiling', answer: 'Cat6 with PoE', options: ['Cat6 with PoE', 'Fiber', 'Cat5e + separate power'] },
];

const quizQuestions = [
  { q: "What does PoE (Power over Ethernet) do?", options: ['Increases speed', 'Sends power and data over one cable', 'Encrypts traffic', 'Extends cable distance'], correct: 1 },
  { q: "What's the main advantage of fiber over copper?", options: ['Cheaper', 'Easier to install', 'Much faster and longer distance', 'More durable'], correct: 2 },
  { q: "What does a managed switch allow that an unmanaged one doesn't?", options: ['More ports', 'VLANs and traffic control', 'WiFi connectivity', 'Faster speeds'], correct: 1 },
];

export default function NetworkingHardware() {
  const [step, setStep] = useState(0);
  const [cableIdx, setCableIdx] = useState(0);
  const [cableScore, setCableScore] = useState(0);
  const [cableDone, setCableDone] = useState(false);
  const [networkBuild, setNetworkBuild] = useState<NetworkItem[]>([]);
  const [buildDone, setBuildDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCable = (idx: number) => {
    setSelected(idx);
    if (cableQuiz[cableIdx].options[idx] === cableQuiz[cableIdx].answer) setCableScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (cableIdx + 1 >= cableQuiz.length) setCableDone(true);
      else setCableIdx(cableIdx + 1);
    }, 800);
  };

  const toggleNetworkItem = (item: NetworkItem) => {
    setNetworkBuild(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const networkTotal = networkBuild.reduce((s, i) => s + i.price, 0);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-5-2', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Network architect! 🔀" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Networking Hardware" pathId="hardware" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Cable Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !cableDone && (
          <motion.div key="cable" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🔌 Pick the Right Cable</h2>
              <p className="text-sm text-gray-400 mb-3">{cableIdx + 1}/{cableQuiz.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4"><p className="text-sm font-semibold">{cableQuiz[cableIdx].scenario}</p></div>
              <div className="space-y-2">
                {cableQuiz[cableIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleCable(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors ${selected === i ? (opt === cableQuiz[cableIdx].answer ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && opt === cableQuiz[cableIdx].answer ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && cableDone && !buildDone && (
          <motion.div key="network-build" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-cyan-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#00f0ff' }}>🏢 Design a Small Office Network</h2>
              <p className="text-sm text-gray-400 mb-3">Pick hardware for a 10-person office with WiFi and security cameras.</p>
              <div className="flex justify-between text-sm font-bold mb-3 bg-gray-800/50 rounded-lg px-3 py-2">
                <span>Items: {networkBuild.length}</span>
                <span>Total: <span style={{ color: '#00f0ff' }}>${networkTotal}</span></span>
              </div>
              <div className="space-y-2">
                {networkItems.map(item => (
                  <button key={item.name} onClick={() => toggleNetworkItem(item)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${networkBuild.includes(item) ? 'bg-cyan-900/30 border border-cyan-700/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="flex justify-between">
                      <span className="font-semibold">{networkBuild.includes(item) ? '✅ ' : ''}{item.name}</span>
                      <span style={{ color: '#ff9500' }}>${item.price}</span>
                    </div>
                    <div className="text-xs text-gray-500">{item.category}{item.poe ? ' • PoE' : ''}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setBuildDone(true)} className="btn-primary w-full mt-3">Submit Network Design →</button>
            </div>
          </motion.div>
        )}

        {step === 3 && buildDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Network Design Complete!</h3>
              <p className="text-sm text-gray-400">Cables: {cableScore}/{cableQuiz.length} | Budget: ${networkTotal}</p>
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
