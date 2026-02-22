'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Vulnerability Scanning",
    content: "After finding open ports, the next step is finding VULNERABILITIES:\n\n🔍 Nikto — Web server vulnerability scanner\n🔍 Nessus — Industry-standard vuln scanner\n🔍 OpenVAS — Free open-source alternative to Nessus\n\nThese tools check for:\n• Known CVEs (Common Vulnerabilities and Exposures)\n• Misconfigurations (default passwords, exposed panels)\n• Missing patches and outdated software\n• Insecure headers and cookies",
  },
  {
    title: "CVEs and CVSS Scores",
    content: "CVE = Common Vulnerabilities and Exposures — a unique ID for each known vulnerability.\n\nExample: CVE-2021-44228 (Log4Shell) — critical Java vulnerability\n\nCVSS = Common Vulnerability Scoring System (0-10):\n• 0.0 — None\n• 0.1-3.9 — Low\n• 4.0-6.9 — Medium\n• 7.0-8.9 — High\n• 9.0-10.0 — Critical\n\nExploit databases:\n• exploit-db.com — Public exploit archive\n• NVD (National Vulnerability Database) — NIST CVE database\n• CVE.org — Official CVE list",
  },
];

const scanReport = [
  { vuln: 'Apache httpd 2.4.49 — Path Traversal (CVE-2021-41773)', cvss: 9.8, severity: 'Critical', fix: 'Upgrade to Apache 2.4.51+' },
  { vuln: 'MySQL 5.7 exposed on public interface', cvss: 7.5, severity: 'High', fix: 'Bind to 127.0.0.1, use firewall rules' },
  { vuln: 'Missing X-Frame-Options header', cvss: 4.3, severity: 'Medium', fix: 'Add X-Frame-Options: DENY header' },
  { vuln: 'Directory listing enabled on /backup/', cvss: 5.3, severity: 'Medium', fix: 'Disable directory indexing in web server config' },
  { vuln: 'phpinfo() exposed at /phpinfo.php', cvss: 5.0, severity: 'Medium', fix: 'Remove phpinfo.php from production' },
  { vuln: 'SSL certificate expires in 10 days', cvss: 3.1, severity: 'Low', fix: 'Renew SSL certificate' },
  { vuln: '.env file accessible at /.env', cvss: 8.6, severity: 'High', fix: 'Block .env files in web server config' },
];

const priorityOrder = ['Critical', 'High', 'High', 'Medium', 'Medium', 'Medium', 'Low'];

export default function VulnScanning() {
  const [step, setStep] = useState(0);
  const [prioritized, setPrioritized] = useState<number[]>([]);
  const [challengeDone, setChallengeDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handlePrioritize = (idx: number) => {
    if (prioritized.includes(idx)) return;
    const newP = [...prioritized, idx];
    setPrioritized(newP);
    if (newP.length >= 3) setChallengeDone(true);
  };

  const quizQuestions = [
    { q: "A CVSS score of 9.5 is...", options: ['Low severity', 'Medium severity', 'High severity', 'Critical severity'], correct: 3 },
    { q: "What does CVE stand for?", options: ['Common Vulnerability Enumeration', 'Common Vulnerabilities and Exposures', 'Certified Vulnerability Expert', 'Critical Vulnerability Entry'], correct: 1 },
    { q: "When prioritizing vulnerabilities, you should fix ___ first", options: ['The easiest ones', 'The newest ones', 'The highest severity ones', 'The ones with the most CVEs'], correct: 2 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-2-3', 70);
        addAchievement('osint-detective');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Vulnerability assessment complete! 🔍" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Vulnerability Scanning" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Analyze Scan Report →'}</button>
          </motion.div>
        )}

        {step === 2 && !challengeDone && (
          <motion.div key="report" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-2 text-red-400">🎯 Prioritize Vulnerabilities</h2>
              <p className="text-sm text-gray-400 mb-3">Select the top 3 vulnerabilities to fix FIRST (highest priority):</p>
              <div className="space-y-2">
                {scanReport.map((v, i) => (
                  <button key={i} onClick={() => handlePrioritize(i)} className={`w-full text-left p-3 rounded-lg text-xs transition-colors ${prioritized.includes(i) ? 'bg-green-900/30 border border-green-800/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold ${v.severity === 'Critical' ? 'text-red-400' : v.severity === 'High' ? 'text-orange-400' : v.severity === 'Medium' ? 'text-yellow-400' : 'text-gray-400'}`}>{v.severity}</span>
                      <span className="font-mono" style={{ color: '#00f0ff' }}>CVSS: {v.cvss}</span>
                    </div>
                    <p className="text-gray-300">{v.vuln}</p>
                    {prioritized.includes(i) && <p className="text-green-400 mt-1">#{prioritized.indexOf(i) + 1} — Fix: {v.fix}</p>}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && challengeDone && (
          <motion.div key="done" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-green-800/30">
              <h3 className="font-semibold text-green-400 mb-2">✅ Triage Complete!</h3>
              <p className="text-sm text-gray-400">Always fix Critical and High severity vulnerabilities first. A single critical vuln can lead to full system compromise.</p>
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
