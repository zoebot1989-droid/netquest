'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Wireless Security",
    content: "WiFi protocols have evolved:\n\n❌ WEP (1997) — BROKEN. Cracked in minutes with aircrack-ng. Never use.\n⚠️ WPA (2003) — Improved but has TKIP weakness.\n✅ WPA2 (2004) — AES encryption. Current standard. Vulnerable to KRACK and offline brute force.\n🔒 WPA3 (2018) — Latest. SAE handshake prevents offline attacks. Forward secrecy.\n\nKey fact: WPA2 with a weak password can be cracked by capturing the 4-way handshake and running a dictionary attack offline.",
  },
  {
    title: "Wireless Attacks",
    content: "🔴 Evil Twin — Set up a fake access point with the same name as a legitimate one. Users connect unknowingly.\n  'Starbucks_WiFi' → attacker's hotspot\n\n🔴 Deauthentication Attack — Kick users off WiFi to force them to reconnect (and capture the handshake).\n\n🔴 Wardriving — Driving around scanning for WiFi networks.\n\n🔴 WPS Pin Attack — Brute force the 8-digit WPS PIN (only ~11,000 combos).\n\n🛡️ Defenses:\n• Use WPA3 if available\n• Strong, long passwords (15+ chars)\n• Disable WPS\n• Hidden SSID ≠ security (still detectable!)",
  },
];

const networks = [
  { ssid: 'CoffeeShop_Free', security: 'Open', signal: -30, vuln: 'critical', reason: 'No encryption! All traffic is visible.' },
  { ssid: 'HomeNet-5G', security: 'WEP', signal: -45, vuln: 'critical', reason: 'WEP is broken. Can be cracked in under 5 minutes.' },
  { ssid: 'Office_Network', security: 'WPA2', signal: -55, vuln: 'low', reason: 'WPA2 is solid with a strong password. Current standard.' },
  { ssid: 'TP-Link_A1B2C3', security: 'WPA2 + WPS', signal: -40, vuln: 'high', reason: 'WPS enabled — can be brute forced with ~11,000 attempts.' },
  { ssid: 'SecureNet', security: 'WPA3', signal: -60, vuln: 'none', reason: 'WPA3 with SAE handshake. Most secure available.' },
  { ssid: 'Linksys', security: 'WPA2 (password: password)', signal: -35, vuln: 'high', reason: 'Default/weak password. Dictionary attack would crack it instantly.' },
];

export default function WirelessSecurity() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [identified, setIdentified] = useState<Set<number>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    const newId = new Set(identified);
    newId.add(idx);
    setIdentified(newId);
  };

  const quizQuestions = [
    { q: "Which WiFi protocol is considered BROKEN?", options: ['WPA2', 'WPA3', 'WEP', 'AES'], correct: 2 },
    { q: "An Evil Twin attack involves...", options: ['Two routers in one network', 'A fake access point mimicking a real one', 'Hacking the WiFi password', 'Cutting the ethernet cable'], correct: 1 },
    { q: "Hidden SSIDs are...", options: ['Completely invisible to attackers', 'Still detectable by scanning tools', 'More secure than WPA3', 'Required for WPA2'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-4-3', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Wireless security mastered! 📶" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Wireless Security" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Analyze Networks →'}</button>
          </motion.div>
        )}

        {step === 2 && identified.size < 6 && (
          <motion.div key="networks" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-2 text-red-400">📶 WiFi Network Scanner</h2>
              <p className="text-xs text-gray-400 mb-3">Click each network to assess its security. Identify all vulnerabilities!</p>
              <div className="space-y-2">
                {networks.map((n, i) => (
                  <button key={i} onClick={() => handleSelect(i)} className={`w-full text-left p-3 rounded-lg text-xs transition-colors ${selected === i ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-gray-200">{n.ssid}</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${n.vuln === 'critical' ? 'bg-red-900/30 text-red-400' : n.vuln === 'high' ? 'bg-orange-900/30 text-orange-400' : n.vuln === 'low' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-green-900/30 text-green-400'}`}>
                          {n.security}
                        </span>
                      </div>
                      <span className="text-gray-500 font-mono">{n.signal} dBm</span>
                    </div>
                    {identified.has(i) && <p className={`mt-1 ${n.vuln === 'critical' || n.vuln === 'high' ? 'text-red-400' : n.vuln === 'low' ? 'text-yellow-400' : 'text-green-400'}`}>{n.reason}</p>}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Analyzed: {identified.size}/6</p>
            </div>
          </motion.div>
        )}

        {step === 2 && identified.size >= 6 && (
          <motion.div key="done" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-green-800/30">
              <h3 className="font-semibold text-green-400">✅ All networks analyzed!</h3>
              <p className="text-sm text-gray-400">Key takeaway: WPA3 &gt; WPA2 (strong password) &gt;&gt; WEP/Open. Always disable WPS!</p>
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
