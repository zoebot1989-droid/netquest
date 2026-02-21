'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "The Problem",
    content: "Your app runs on localhost:3000 — great for development. But what if you want your friend to test it? Or show a client? You need to make your local server accessible from the internet. This is called port forwarding.",
  },
  {
    title: "How Port Forwarding Works",
    content: "Your router has a PUBLIC IP (like 73.42.15.88). Port forwarding tells the router: 'When traffic comes in on port 3000, send it to my computer (192.168.1.10) on port 3000.' It's like telling the mailroom which apartment to deliver to.",
  },
  {
    title: "The Easier Way: Tunnels",
    content: "Modern devs often skip port forwarding and use tunnel services like ngrok, Cloudflare Tunnel, or localtunnel. You run one command and get a public URL (like https://abc123.ngrok.io) that forwards to your localhost. No router config needed!",
  },
];

interface RouterRule {
  externalPort: string;
  internalIP: string;
  internalPort: string;
  protocol: string;
}

export default function PortForwardingMission() {
  const [step, setStep] = useState(0);
  const [rule, setRule] = useState<RouterRule>({ externalPort: '', internalIP: '', internalPort: '', protocol: 'TCP' });
  const [tunnelStep, setTunnelStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [feedback, setFeedback] = useState('');

  const checkRule = () => {
    if (rule.externalPort === '3000' && rule.internalIP === '192.168.1.10' && rule.internalPort === '3000') {
      setStep(4);
    } else {
      loseLife();
      setFeedback('Check your settings! External port 3000 should forward to your computer (192.168.1.10) port 3000.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleTunnel = () => {
    if (tunnelStep < 2) {
      setTunnelStep(tunnelStep + 1);
    } else {
      completeMission('net-4-2', 75);
      setTimeout(() => setComplete(true), 500);
    }
  };

  if (complete) return <MissionComplete xp={75} message="You can expose local servers to the internet!" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Port Forwarding" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{lessons[step].content}</p>
            </div>

            {step === 1 && (
              <div className="card border-cyan-800/30">
                <div className="text-center font-mono text-xs space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div>🌐<br/>Internet<br/><span style={{ color: '#00f0ff' }}>73.42.15.88:3000</span></div>
                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.div>
                    <div>📡<br/>Router<br/><span style={{ color: '#ff9500' }}>NAT/Forward</span></div>
                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>→</motion.div>
                    <div>💻<br/>Your PC<br/><span style={{ color: '#39ff14' }}>192.168.1.10:3000</span></div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card border-green-800/30">
                <p className="text-xs text-gray-400 mb-2">💻 Using ngrok</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span style={{ color: '#39ff14' }}>$</span> ngrok http 3000</div>
                  <div className="text-gray-400">Forwarding:</div>
                  <div><span style={{ color: '#00f0ff' }}>https://abc123.ngrok.io</span> → localhost:3000</div>
                  <div className="text-gray-500">// Share this URL with anyone!</div>
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
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Configure Port Forwarding</h2>
              <p className="text-sm text-gray-400">Your app runs on localhost:3000. Your computer&apos;s local IP is 192.168.1.10. Set up the router rule:</p>
            </div>

            <div className="card space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3 text-xs font-mono mb-2" style={{ color: '#00f0ff' }}>
                📡 Router Admin Panel — Port Forwarding
              </div>
              <div>
                <label className="text-xs text-gray-400">External Port</label>
                <input
                  type="text"
                  value={rule.externalPort}
                  onChange={(e) => setRule({ ...rule, externalPort: e.target.value })}
                  placeholder="e.g. 3000"
                  className="w-full bg-gray-800/50 rounded-lg p-3 text-sm font-mono mt-1 border border-gray-700 focus:border-[#00f0ff]/50 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Internal IP Address</label>
                <input
                  type="text"
                  value={rule.internalIP}
                  onChange={(e) => setRule({ ...rule, internalIP: e.target.value })}
                  placeholder="e.g. 192.168.1.10"
                  className="w-full bg-gray-800/50 rounded-lg p-3 text-sm font-mono mt-1 border border-gray-700 focus:border-[#00f0ff]/50 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Internal Port</label>
                <input
                  type="text"
                  value={rule.internalPort}
                  onChange={(e) => setRule({ ...rule, internalPort: e.target.value })}
                  placeholder="e.g. 3000"
                  className="w-full bg-gray-800/50 rounded-lg p-3 text-sm font-mono mt-1 border border-gray-700 focus:border-[#00f0ff]/50 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Protocol</label>
                <select value={rule.protocol} onChange={(e) => setRule({ ...rule, protocol: e.target.value })} className="w-full bg-gray-800/50 rounded-lg p-3 text-sm font-mono mt-1 border border-gray-700 outline-none">
                  <option>TCP</option>
                  <option>UDP</option>
                  <option>Both</option>
                </select>
              </div>
            </div>

            {feedback && <p className="text-sm" style={{ color: '#ff3b30' }}>{feedback}</p>}
            <button onClick={checkRule} className="btn-primary w-full">Save Rule</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="tunnel" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-green-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#39ff14' }}>✅ Port forwarding configured!</h2>
              <p className="text-sm text-gray-400">Now let&apos;s try the modern approach — tunneling:</p>
            </div>

            <div className="card">
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                {tunnelStep >= 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div><span style={{ color: '#39ff14' }}>$</span> npx ngrok http 3000</div>
                  </motion.div>
                )}
                {tunnelStep >= 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-gray-400">Session Status: online</div>
                    <div>Forwarding: <span style={{ color: '#00f0ff' }}>https://a1b2c3.ngrok.io</span> → <span style={{ color: '#39ff14' }}>localhost:3000</span></div>
                  </motion.div>
                )}
                {tunnelStep >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-gray-400 mt-2">// Your friend opens https://a1b2c3.ngrok.io</div>
                    <div style={{ color: '#39ff14' }}>✅ Connection successful — they see your app!</div>
                  </motion.div>
                )}
              </div>
            </div>

            <button onClick={handleTunnel} className="btn-primary w-full">
              {tunnelStep === 0 ? 'Run Command' : tunnelStep === 1 ? 'Share with Friend' : 'Complete Mission →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
