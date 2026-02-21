'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "How Websites Go Live",
    content: "You've built a website on your computer. But how does the WORLD see it?\n\nThe journey:\n1. 💻 Write code locally\n2. 📤 Push code to a hosting service\n3. 🌐 Get a domain name\n4. 🔗 Connect domain to hosting (DNS)\n5. 🔒 Enable HTTPS/SSL\n6. 🎉 Your site is LIVE!\n\nThis used to be complex and expensive. Now it's FREE and takes minutes!",
  },
  {
    title: "Hosting Options",
    content: "Free hosting for static sites:\n\n🟣 GitHub Pages — Free, directly from your repo\n• Push to GitHub → Settings → Pages → Deploy\n• URL: username.github.io/repo-name\n\n🟢 Netlify — Drag & drop deploy\n• Drop your folder → instant URL\n• Auto-deploys from Git\n\n▲ Vercel — Best for React/Next.js\n• Connect GitHub → auto-deploy\n• Preview deployments for PRs\n\nAll three are:\n✅ Free for personal projects\n✅ HTTPS included\n✅ Custom domains supported\n✅ CDN for fast global delivery",
  },
  {
    title: "Domains & DNS",
    content: "Domain names (google.com) are the human-friendly version of IP addresses.\n\nDNS (Domain Name System) translates:\ngoogle.com → 142.250.80.46\n\nTo use a custom domain:\n1. Buy a domain (~$10/year) from Namecheap, Google Domains, etc.\n2. Point it to your host with DNS records:\n   • A Record: domain → IP address\n   • CNAME: subdomain → another domain\n3. Wait for propagation (minutes to 48 hours)\n\nHTTPS/SSL encrypts traffic:\n• 🔒 Shows padlock in browser\n• Required by most browsers now\n• Free via Let's Encrypt (auto on Netlify/Vercel)\n\nQuiz time! 👇",
  },
];

const quizQuestions = [
  {
    q: "Which is NOT a free hosting platform for static websites?",
    options: ["GitHub Pages", "Netlify", "AWS EC2", "Vercel"],
    correct: 2,
  },
  {
    q: "What does DNS do?",
    options: [
      "Encrypts your website",
      "Translates domain names to IP addresses",
      "Hosts your files",
      "Compresses images",
    ],
    correct: 1,
  },
  {
    q: "What does HTTPS/SSL provide?",
    options: [
      "Faster loading",
      "Better SEO only",
      "Encrypted connection between browser and server",
      "Free hosting",
    ],
    correct: 2,
  },
  {
    q: "Which DNS record points a domain to an IP address?",
    options: ["CNAME", "MX", "A Record", "TXT"],
    correct: 2,
  },
];

export default function Deployment() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === quizQuestions[qIdx].correct) setScore(s => s + 1);
  };

  const nextQ = () => { setQIdx(qIdx + 1); setAnswered(null); };

  const handleFinish = () => {
    completeMission('web-5-2', 70);
    addAchievement('deployed');
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={70} message="Ready to go live! 🚀" backHref="/path/webdev" />;

  const q = quizQuestions[qIdx];
  const isLast = qIdx === quizQuestions.length - 1;
  const quizDone = isLast && answered !== null;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Deployment" pathId="webdev" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🚀 The deployment pipeline:</p>
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                  <span className="bg-purple-900/30 px-2 py-1 rounded text-purple-300">Code</span>
                  <span className="text-gray-600">→</span>
                  <span className="bg-blue-900/30 px-2 py-1 rounded text-blue-300">Git Push</span>
                  <span className="text-gray-600">→</span>
                  <span className="bg-green-900/30 px-2 py-1 rounded text-green-300">Build</span>
                  <span className="text-gray-600">→</span>
                  <span className="bg-orange-900/30 px-2 py-1 rounded text-orange-300">Deploy</span>
                  <span className="text-gray-600">→</span>
                  <span className="bg-cyan-900/30 px-2 py-1 rounded" style={{ color: '#00f0ff' }}>🌐 Live!</span>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Quiz Time! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{qIdx + 1}/{quizQuestions.length}</span>
                <span className="text-xs" style={{ color: '#39ff14' }}>Score: {score}</span>
              </div>
              <h3 className="font-semibold mb-3">{q.q}</h3>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${
                    answered === i
                      ? i === q.correct ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                      : answered !== null && i === q.correct ? 'bg-green-900/20 border border-green-800'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {answered !== null && !isLast && (
              <button onClick={nextQ} className="btn-primary w-full">Next Question →</button>
            )}

            {quizDone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={handleFinish} className="btn-primary w-full">Complete Mission →</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
