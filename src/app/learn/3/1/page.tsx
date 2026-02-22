'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What is DNS?",
    content: "DNS (Domain Name System) translates human-readable domain names into IP addresses. You type google.com, DNS turns it into 142.250.80.46.\n\nWithout DNS, you'd have to memorize IP addresses for every website. That's why it's called \"The Phone Book of the Internet\" — you look up a name, it gives you the number.",
  },
  {
    title: "How DNS Resolution Works",
    content: "When you type example.com in your browser, here's what happens:\n\n1️⃣ Browser Cache — Already know it? Use cached IP\n2️⃣ OS Cache — Check the computer's DNS cache\n3️⃣ Recursive Resolver — Your ISP's DNS server does the heavy lifting\n4️⃣ Root Server — Points to the right TLD server (.com, .org, etc.)\n5️⃣ TLD Server — Points to the domain's authoritative server\n6️⃣ Authoritative Server — Has the actual IP address!\n\nThe answer flows back through the chain, gets cached, and your browser connects.",
  },
  {
    title: "DNS Record Types",
    content: "DNS doesn't just store IP addresses. Common record types:\n\n• A Record — Maps domain → IPv4 address\n• AAAA Record — Maps domain → IPv6 address\n• CNAME — Alias: www.example.com → example.com\n• MX — Mail server for the domain\n• NS — Which nameservers are authoritative\n• TXT — Text data (used for verification, SPF, etc.)\n\nYou can query these with: nslookup or dig",
  },
];

const dnsSteps = [
  { label: 'Browser', emoji: '🌐', desc: 'You type example.com — browser checks its cache' },
  { label: 'Resolver', emoji: '🔍', desc: 'ISP\'s recursive resolver takes over the lookup' },
  { label: 'Root Server', emoji: '🌳', desc: 'Root says: ".com? Ask the .com TLD server"' },
  { label: 'TLD Server', emoji: '📂', desc: '.com TLD says: "example.com? Ask ns1.example.com"' },
  { label: 'Authoritative', emoji: '✅', desc: 'Authoritative server returns: 93.184.216.34' },
  { label: 'Connected!', emoji: '🎉', desc: 'Browser connects to 93.184.216.34 — page loads!' },
];

const quizQuestions = [
  { q: "What does DNS stand for?", options: ['Domain Name System', 'Data Network Service', 'Digital Name Server', 'Dynamic Network Schema'], correct: 0 },
  { q: "What does a Root DNS server do?", options: ['Stores all IPs', 'Points to the correct TLD server', 'Hosts websites', 'Blocks malicious domains'], correct: 1 },
  { q: "What type of DNS record maps a domain to an IPv4 address?", options: ['CNAME', 'MX', 'A', 'NS'], correct: 2 },
  { q: "What command can you use to look up DNS records?", options: ['ping', 'traceroute', 'nslookup', 'netstat'], correct: 2 },
];

export default function PhoneBookOfInternet() {
  const [step, setStep] = useState(0);
  const [dnsStep, setDnsStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-3-1', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="You understand DNS resolution!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="The Phone Book of the Internet" pathId="networking" />
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
              {step < 2 ? 'Next →' : 'Trace a DNS Lookup →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="dns" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">🔍 Trace the DNS Lookup</h3>
              <p className="text-xs text-gray-400 mb-4">Follow the journey of resolving <span className="font-mono" style={{ color: '#00f0ff' }}>example.com</span></p>
              <div className="space-y-3">
                {dnsSteps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= dnsStep ? 1 : 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${i <= dnsStep ? 'bg-gray-800/50' : 'bg-gray-900/30'} ${i === dnsStep ? 'ring-1 ring-cyan-700' : ''}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-gray-400">{i <= dnsStep ? s.desc : '???'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (dnsStep + 1 >= dnsSteps.length) {
                    setStep(4);
                  } else {
                    setDnsStep(dnsStep + 1);
                  }
                }}
                className="btn-primary w-full mt-4"
              >
                {dnsStep + 1 >= dnsSteps.length ? 'Take the Quiz →' : 'Next Step →'}
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
