'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Passive Reconnaissance",
    content: "Passive recon means gathering info WITHOUT touching the target. The target doesn't know you're looking.\n\n🔍 Techniques:\n• Google Dorking — Advanced search operators to find sensitive info\n  site:target.com filetype:pdf\n  inurl:admin intext:password\n• WHOIS — Domain registration info\n• DNS lookups — Find IPs, mail servers, nameservers\n• Shodan — Search engine for internet-connected devices\n• Wayback Machine — View old versions of websites\n• Social media OSINT — Employees, tech stack clues",
  },
  {
    title: "OSINT Tools",
    content: "Open Source Intelligence (OSINT) tools:\n\n🌐 whois — Who registered a domain, when, contact info\n🌐 nslookup / dig — DNS records (A, MX, NS, TXT)\n🌐 Shodan.io — Find exposed servers, cameras, databases\n🌐 theHarvester — Collect emails, hosts, subdomains\n🌐 Google Dorks — Find exposed files, admin panels\n\nExample Google Dorks:\n  site:company.com filetype:sql\n  intitle:\"index of\" password\n  inurl:wp-admin site:target.com\n\nAll of this is PUBLIC information — you're not hacking anything!",
  },
];

export default function PassiveRecon() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What makes passive recon 'passive'?", options: ['You use passive voice', 'You don\'t directly interact with the target', 'You only look at old data', 'You use a VPN'], correct: 1 },
    { q: "What does a WHOIS lookup tell you?", options: ['Website vulnerabilities', 'Domain registration info', 'Server passwords', 'Employee names'], correct: 1 },
    { q: "Google Dorking is...", options: ['Illegal hacking', 'Using advanced search operators to find info', 'A type of DDoS attack', 'Social engineering'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const newCompleted = new Set(completedCmds);
    if (cmd.startsWith('whois')) newCompleted.add('whois');
    if (cmd.startsWith('nslookup')) newCompleted.add('nslookup');
    if (cmd.startsWith('dig')) newCompleted.add('dig');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(3), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-2-1', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="OSINT skills acquired! 🕵️" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Passive Recon" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Start Recon →'}</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-1 text-red-400">🎯 Recon Mission: Gather Intel</h2>
              <p className="text-sm text-gray-400">Use these recon tools on any target:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['whois', 'nslookup', 'dig'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: whois google.com, dig github.com MX, nslookup example.com</p>
            </div>
            <InlineTerminal onCommand={handleCommand} height="220px" />
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
