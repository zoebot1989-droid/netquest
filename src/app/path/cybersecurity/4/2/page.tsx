'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Network Attacks",
    content: "🔴 Man-in-the-Middle (MITM) — Attacker sits between two parties, intercepting and potentially modifying traffic.\n  You ↔ Attacker ↔ Server\n\n🔴 ARP Spoofing — Poison the ARP cache to redirect traffic through your machine.\n  'Hey router, I'm the gateway!' → all traffic flows through attacker\n\n🔴 DNS Poisoning — Corrupt DNS cache to redirect domains to malicious IPs.\n  google.com → 10.0.0.99 (attacker's server)\n\n🔴 Session Hijacking — Steal a valid session token to impersonate a user.",
  },
  {
    title: "Packet Sniffing",
    content: "Tools like Wireshark and tcpdump capture network packets:\n\n📡 Wireshark — GUI packet analyzer. See every packet in detail.\n📡 tcpdump — CLI packet capture. Lightweight, fast.\n\nWhat you can find in unencrypted traffic:\n• HTTP form submissions (usernames, passwords!)\n• Cookie values (session hijacking)\n• Email content\n• DNS queries (sites being visited)\n\n🛡️ Defenses:\n• HTTPS everywhere (encrypts traffic)\n• VPN for untrusted networks\n• HSTS (force HTTPS)\n• Network segmentation",
  },
];

const packets = [
  { no: 1, time: '0.000000', src: '192.168.1.10', dst: '93.184.216.34', proto: 'TCP', info: 'SYN → Port 80' },
  { no: 2, time: '0.034521', src: '93.184.216.34', dst: '192.168.1.10', proto: 'TCP', info: 'SYN-ACK ← Port 80' },
  { no: 3, time: '0.034890', src: '192.168.1.10', dst: '93.184.216.34', proto: 'TCP', info: 'ACK → (connection established)' },
  { no: 4, time: '0.035100', src: '192.168.1.10', dst: '93.184.216.34', proto: 'HTTP', info: 'GET /login HTTP/1.1' },
  { no: 5, time: '0.078234', src: '93.184.216.34', dst: '192.168.1.10', proto: 'HTTP', info: '200 OK (text/html)' },
  { no: 6, time: '2.341000', src: '192.168.1.10', dst: '93.184.216.34', proto: 'HTTP', info: 'POST /login username=admin&password=Sup3rS3cret!' },
  { no: 7, time: '2.389000', src: '93.184.216.34', dst: '192.168.1.10', proto: 'HTTP', info: '302 Found Set-Cookie: session=eyJhbGciOi...' },
  { no: 8, time: '2.390000', src: '192.168.1.10', dst: '93.184.216.34', proto: 'HTTP', info: 'GET /dashboard Cookie: session=eyJhbGciOi...' },
  { no: 9, time: '3.100000', src: '192.168.1.10', dst: '8.8.8.8', proto: 'DNS', info: 'Query: secret-project.internal.corp' },
  { no: 10, time: '4.200000', src: '192.168.1.105', dst: '192.168.1.1', proto: 'ARP', info: 'Who has 192.168.1.1? Tell 192.168.1.105 (SUSPICIOUS)' },
];

export default function NetworkAttacks() {
  const [step, setStep] = useState(0);
  const [selectedPacket, setSelectedPacket] = useState<number | null>(null);
  const [foundCreds, setFoundCreds] = useState(false);
  const [foundCookie, setFoundCookie] = useState(false);
  const [foundSuspicious, setFoundSuspicious] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handlePacketClick = (idx: number) => {
    setSelectedPacket(idx);
    if (idx === 5) setFoundCreds(true);
    if (idx === 6) setFoundCookie(true);
    if (idx === 9) setFoundSuspicious(true);
  };

  const allFound = foundCreds && foundCookie && foundSuspicious;

  const quizQuestions = [
    { q: "In a MITM attack, the attacker...", options: ['Breaks the encryption', 'Sits between two parties intercepting traffic', 'Physically cuts network cables', 'Installs malware on the server'], correct: 1 },
    { q: "Why is HTTP dangerous on public WiFi?", options: ['It\'s slower', 'Traffic is unencrypted — anyone can read it', 'It doesn\'t support images', 'It requires a password'], correct: 1 },
    { q: "ARP spoofing allows an attacker to...", options: ['Speed up the network', 'Redirect traffic through their machine', 'Change DNS records', 'Create new users'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-4-2', 80);
        addAchievement('packet-sniffer');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={80} message="Network attack analysis complete! 📡" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Network Attacks" pathId="cybersecurity" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-red-900/30 text-red-400">{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Analyze Packets →'}</button>
          </motion.div>
        )}

        {step === 2 && !allFound && (
          <motion.div key="packets" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-2 text-red-400">📡 Packet Analyzer</h2>
              <p className="text-xs text-gray-400 mb-1">Find the credentials, session cookie, and suspicious ARP packet!</p>
              <div className="flex gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded ${foundCreds ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>{foundCreds ? '✅' : '⬜'} Credentials</span>
                <span className={`text-xs px-2 py-1 rounded ${foundCookie ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>{foundCookie ? '✅' : '⬜'} Session Cookie</span>
                <span className={`text-xs px-2 py-1 rounded ${foundSuspicious ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>{foundSuspicious ? '✅' : '⬜'} Suspicious</span>
              </div>

              {/* Packet table */}
              <div className="bg-black/80 rounded-lg overflow-hidden border border-gray-800">
                <div className="grid grid-cols-6 gap-0 text-[10px] font-mono">
                  <div className="p-1.5 bg-gray-800/80 text-gray-400">No</div>
                  <div className="p-1.5 bg-gray-800/80 text-gray-400">Time</div>
                  <div className="p-1.5 bg-gray-800/80 text-gray-400">Source</div>
                  <div className="p-1.5 bg-gray-800/80 text-gray-400">Dest</div>
                  <div className="p-1.5 bg-gray-800/80 text-gray-400">Proto</div>
                  <div className="p-1.5 bg-gray-800/80 text-gray-400">Info</div>
                  {packets.map((p, i) => (
                    <div key={i} className="contents cursor-pointer" onClick={() => handlePacketClick(i)}>
                      <div className={`p-1.5 border-t border-gray-800/50 ${selectedPacket === i ? 'bg-blue-900/30' : i === 5 && foundCreds ? 'bg-red-900/20' : i === 6 && foundCookie ? 'bg-orange-900/20' : i === 9 && foundSuspicious ? 'bg-yellow-900/20' : 'hover:bg-gray-800/30'}`}>{p.no}</div>
                      <div className={`p-1.5 border-t border-gray-800/50 ${selectedPacket === i ? 'bg-blue-900/30' : ''}`}>{p.time}</div>
                      <div className={`p-1.5 border-t border-gray-800/50 text-[9px] ${selectedPacket === i ? 'bg-blue-900/30' : ''}`}>{p.src}</div>
                      <div className={`p-1.5 border-t border-gray-800/50 text-[9px] ${selectedPacket === i ? 'bg-blue-900/30' : ''}`}>{p.dst}</div>
                      <div className={`p-1.5 border-t border-gray-800/50 ${p.proto === 'HTTP' ? 'text-green-400' : p.proto === 'DNS' ? 'text-cyan-400' : p.proto === 'ARP' ? 'text-yellow-400' : 'text-gray-400'} ${selectedPacket === i ? 'bg-blue-900/30' : ''}`}>{p.proto}</div>
                      <div className={`p-1.5 border-t border-gray-800/50 text-[9px] ${selectedPacket === i ? 'bg-blue-900/30' : ''} ${p.info.includes('password') ? 'text-red-400 font-bold' : p.info.includes('SUSPICIOUS') ? 'text-yellow-400' : ''}`}>{p.info}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPacket !== null && (
                <div className="mt-3 bg-black/50 rounded p-2 text-xs font-mono text-gray-300">
                  <span className="text-gray-500">Packet #{packets[selectedPacket].no}:</span> {packets[selectedPacket].info}
                  {selectedPacket === 5 && <div className="text-red-400 mt-1">🚨 CREDENTIALS IN PLAINTEXT! password=Sup3rS3cret!</div>}
                  {selectedPacket === 6 && <div className="text-orange-400 mt-1">🍪 Session cookie exposed — could be used for session hijacking!</div>}
                  {selectedPacket === 9 && <div className="text-yellow-400 mt-1">⚠️ Suspicious ARP request — possible ARP spoofing attempt!</div>}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && allFound && (
          <motion.div key="found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <div className="text-5xl mb-3">📡</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>ALL THREATS IDENTIFIED!</h3>
              <p className="text-sm text-gray-400">You found plaintext credentials, session cookies, and a suspicious ARP request. This is why HTTPS matters!</p>
            </div>
            <button onClick={() => setStep(3)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 3 && (
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
