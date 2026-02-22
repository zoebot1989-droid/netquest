'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Penetration Testing",
    content: "A pentest is a simulated cyberattack to find vulnerabilities:\n\n📋 The Methodology:\n1. Scope & Rules of Engagement — What can you test? What's off-limits?\n2. Reconnaissance — OSINT, passive and active recon\n3. Scanning — Port scanning, vulnerability scanning\n4. Exploitation — Attempt to exploit found vulnerabilities\n5. Post-Exploitation — Pivot, escalate privileges, assess impact\n6. Reporting — Document everything with severity ratings and remediation\n\nThis is a LEGAL, AUTHORIZED attack. You always have a signed contract.",
  },
  {
    title: "Professional Pentesting",
    content: "Types of pentests:\n\n⬛ Black Box — No prior knowledge. Simulates external attacker.\n⬜ White Box — Full access to source code, architecture. Most thorough.\n🔲 Grey Box — Partial knowledge. Simulates insider or compromised account.\n\nCertifications:\n• OSCP (Offensive Security Certified Professional) — Gold standard\n• CEH (Certified Ethical Hacker) — Entry level\n• PNPT (Practical Network Penetration Tester)\n• CompTIA PenTest+\n\nTools: Kali Linux, Burp Suite, Metasploit, Nmap, Wireshark, John the Ripper, SQLMap",
  },
];

const pentestSteps = [
  { step: 'Scope', question: "MegaCorp hired you to pentest their web app. What do you do FIRST?", options: ['Start scanning ports immediately', 'Define scope — what systems, what methods, what\'s off-limits', 'Install Kali Linux', 'Run Metasploit'], correct: 1 },
  { step: 'Recon', question: "Scope is defined. You can test app.megacorp.com and api.megacorp.com. Next?", options: ['Exploit the database', 'Run OSINT: WHOIS, DNS, Google dorking, check for exposed repos', 'Send phishing emails', 'Report findings'], correct: 1 },
  { step: 'Scanning', question: "Recon found the tech stack (Node.js, PostgreSQL, nginx). What's next?", options: ['Report to the client', 'Nmap port scan, Nikto web scan, identify vulnerabilities', 'Shut down their servers', 'Brute force admin password'], correct: 1 },
  { step: 'Exploitation', question: "You found SQLi on the login page and an exposed admin panel with default creds. You should...", options: ['Exploit both to demonstrate impact, document evidence', 'Ignore them and look for more bugs', 'Publish them on Twitter', 'Only report the easy one'], correct: 0 },
  { step: 'Post-Exploitation', question: "You got database access via SQLi. To assess full impact, you should...", options: ['Delete all data to prove impact', 'Document what data is accessible, check for privilege escalation, test lateral movement', 'Install a backdoor', 'Stop here — job done'], correct: 1 },
  { step: 'Reporting', question: "Testing complete. Your report should include...", options: ['Just a list of vulnerabilities', 'Executive summary, detailed findings with evidence, CVSS scores, remediation steps, and prioritization', 'Only the critical bugs', 'A bill for your services'], correct: 1 },
];

export default function PentestMission() {
  const [step, setStep] = useState(0);
  const [pentestIdx, setPentestIdx] = useState(0);
  const [pentestScore, setPentestScore] = useState(0);
  const [pentestDone, setPentestDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handlePentest = (answer: number) => {
    if (answer === pentestSteps[pentestIdx].correct) setPentestScore(s => s + 1);
    if (pentestIdx + 1 >= pentestSteps.length) {
      setPentestDone(true);
      addAchievement('pentester');
    } else setPentestIdx(pentestIdx + 1);
  };

  const quizQuestions = [
    { q: "In a Black Box pentest, the tester...", options: ['Has full source code access', 'Has no prior knowledge of the target', 'Only tests the network', 'Works with the development team'], correct: 1 },
    { q: "The MOST important part of a pentest is...", options: ['Finding the most bugs', 'The report with findings and remediation', 'Using the coolest tools', 'Getting admin access'], correct: 1 },
    { q: "OSCP certification requires...", options: ['A multiple choice exam', 'A 24-hour practical hacking exam', 'A written thesis', 'Only work experience'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-6-2', 100);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={100} message="Pentesting methodology mastered! 🔬" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={6} title="Penetration Testing" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Plan a Pentest →'}</button>
          </motion.div>
        )}

        {step === 2 && !pentestDone && (
          <motion.div key={`pt-${pentestIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-900/30 text-red-400">Phase {pentestIdx + 1}/6</span>
                <h2 className="font-semibold text-red-400">{pentestSteps[pentestIdx].step}</h2>
              </div>
              <p className="text-sm text-gray-300 mb-4">{pentestSteps[pentestIdx].question}</p>
              <div className="space-y-2">
                {pentestSteps[pentestIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => handlePentest(i)} className="w-full text-left p-3 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1">
              {pentestSteps.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded ${i < pentestIdx ? 'bg-green-500' : i === pentestIdx ? 'bg-red-500' : 'bg-gray-700'}`} />
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && pentestDone && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <div className="text-5xl mb-3">🔬</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>PENTEST COMPLETE</h3>
              <p className="text-sm text-gray-400">Score: {pentestScore}/{pentestSteps.length}. You walked through a full penetration test lifecycle.</p>
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
