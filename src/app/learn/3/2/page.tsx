'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "DNS Records Deep Dive",
    content: "When you own a domain, you configure DNS records to tell the internet where to find your stuff:\n\n• A Record — Points your domain to an IPv4 address\n• AAAA Record — Points to an IPv6 address\n• CNAME — Creates an alias (www → @)\n• MX — Tells email where to go\n• TXT — Stores text (verification, SPF, DKIM)\n• NS — Delegates to nameservers",
  },
  {
    title: "Example: Setting Up mysite.com",
    content: "Say you bought mysite.com and your server IP is 203.0.113.50:\n\nA Record: mysite.com → 203.0.113.50\nCNAME: www.mysite.com → mysite.com\nMX: mysite.com → mail.mysite.com (priority 10)\nTXT: mysite.com → \"v=spf1 include:_spf.google.com ~all\"\n\nThese records live on your domain registrar's DNS management page (Cloudflare, Namecheap, GoDaddy, etc.).",
  },
];

interface DnsRecord { type: string; name: string; value: string; }

interface DnsChallenge {
  scenario: string;
  correctType: string;
  correctName: string;
  correctValue: string;
  options: { type: string; name: string; value: string }[];
}

const challenges: DnsChallenge[] = [
  {
    scenario: 'Point coolsite.com to server IP 45.33.32.156',
    correctType: 'A',
    correctName: 'coolsite.com',
    correctValue: '45.33.32.156',
    options: [
      { type: 'A', name: 'coolsite.com', value: '45.33.32.156' },
      { type: 'CNAME', name: 'coolsite.com', value: '45.33.32.156' },
      { type: 'MX', name: 'coolsite.com', value: '45.33.32.156' },
      { type: 'A', name: 'www.coolsite.com', value: '45.33.32.156' },
    ],
  },
  {
    scenario: 'Make www.coolsite.com an alias for coolsite.com',
    correctType: 'CNAME',
    correctName: 'www.coolsite.com',
    correctValue: 'coolsite.com',
    options: [
      { type: 'A', name: 'www.coolsite.com', value: 'coolsite.com' },
      { type: 'CNAME', name: 'www.coolsite.com', value: 'coolsite.com' },
      { type: 'CNAME', name: 'coolsite.com', value: 'www.coolsite.com' },
      { type: 'NS', name: 'www.coolsite.com', value: 'coolsite.com' },
    ],
  },
  {
    scenario: 'Route email for coolsite.com to mail.coolsite.com',
    correctType: 'MX',
    correctName: 'coolsite.com',
    correctValue: 'mail.coolsite.com',
    options: [
      { type: 'A', name: 'mail.coolsite.com', value: 'coolsite.com' },
      { type: 'MX', name: 'coolsite.com', value: 'mail.coolsite.com' },
      { type: 'CNAME', name: 'coolsite.com', value: 'mail.coolsite.com' },
      { type: 'MX', name: 'mail.coolsite.com', value: 'coolsite.com' },
    ],
  },
  {
    scenario: 'Add a TXT record for domain verification: "google-site-verification=abc123"',
    correctType: 'TXT',
    correctName: 'coolsite.com',
    correctValue: 'google-site-verification=abc123',
    options: [
      { type: 'TXT', name: 'coolsite.com', value: 'google-site-verification=abc123' },
      { type: 'A', name: 'coolsite.com', value: 'google-site-verification=abc123' },
      { type: 'TXT', name: 'verify.coolsite.com', value: 'abc123' },
      { type: 'CNAME', name: 'coolsite.com', value: 'google-site-verification=abc123' },
    ],
  },
];

const quizQuestions = [
  { q: "Which DNS record type creates an alias for another domain?", options: ['A', 'MX', 'CNAME', 'TXT'], correct: 2 },
  { q: "Which record type handles email routing?", options: ['A', 'MX', 'NS', 'CNAME'], correct: 1 },
  { q: "What does an A record map a domain to?", options: ['Another domain name', 'An IPv4 address', 'A mail server', 'A text string'], correct: 1 },
  { q: "Where do you configure DNS records?", options: ['In your browser settings', 'At your domain registrar / DNS provider', 'In your server\'s /etc/hosts', 'In the router admin panel'], correct: 1 },
];

export default function SetUpDNS() {
  const [step, setStep] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [configuredRecords, setConfiguredRecords] = useState<DnsRecord[]>([]);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleOption = (opt: { type: string; name: string; value: string }) => {
    const c = challenges[challengeIdx];
    if (opt.type === c.correctType && opt.name === c.correctName && opt.value === c.correctValue) {
      setFeedback('✅ Correct!');
      setConfiguredRecords([...configuredRecords, opt]);
      setTimeout(() => {
        setFeedback('');
        if (challengeIdx + 1 >= challenges.length) {
          setStep(3);
        } else {
          setChallengeIdx(challengeIdx + 1);
        }
      }, 800);
    } else {
      setFeedback('❌ Wrong record — think about the record type and target.');
      loseLife();
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-3-2', 75);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={75} message="DNS records configured!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Set Up DNS" pathId="networking" />
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
              {step < 1 ? 'Next →' : 'Configure DNS →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">⚙️ Configure DNS for coolsite.com</h3>
              <p className="text-sm text-gray-400 mb-3">Task {challengeIdx + 1}/{challenges.length}: {challenges[challengeIdx].scenario}</p>
              {configuredRecords.length > 0 && (
                <div className="bg-black/40 rounded-lg p-2 mb-3 text-xs font-mono space-y-1">
                  {configuredRecords.map((r, i) => (
                    <div key={i} className="text-green-400">{r.type} {r.name} → {r.value}</div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mb-2">Pick the correct DNS record:</p>
              <div className="space-y-2">
                {challenges[challengeIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => handleOption(opt)} className="w-full text-left p-3 rounded-lg text-xs font-mono bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    <span style={{ color: '#ff9500' }}>{opt.type}</span> {opt.name} → {opt.value}
                  </button>
                ))}
              </div>
              {feedback && <p className="text-sm mt-2">{feedback}</p>}
            </div>
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
