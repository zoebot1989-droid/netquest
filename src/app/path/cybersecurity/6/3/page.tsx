'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Building Your Hacking Lab",
    content: "To practice safely, you need a home lab:\n\n🖥️ VirtualBox or VMware — Run virtual machines\n🐉 Kali Linux — THE hacking OS. Pre-installed with 600+ security tools.\n\nVulnerable Targets:\n• DVWA (Damn Vulnerable Web App) — Practice web attacks\n• Metasploitable — Intentionally vulnerable Linux VM\n• HackTheBox — Online vulnerable machines\n• VulnHub — Download vulnerable VMs\n• OWASP WebGoat — Learn web security hands-on\n\n⚠️ NEVER practice on systems you don't own or have authorization to test!",
  },
  {
    title: "Lab Setup Guide",
    content: "Your starter lab:\n\n1. Install VirtualBox (free)\n2. Download Kali Linux ISO\n3. Create VM: 2+ CPU cores, 4GB RAM, 40GB disk\n4. Install Kali and update: apt update && apt upgrade\n5. Download DVWA or Metasploitable VM\n6. Create an isolated network (Host-Only adapter)\n\n🔒 Network Isolation is CRITICAL:\n• Use 'Host-Only' or 'Internal Network' in VirtualBox\n• This prevents your attacks from reaching the real network\n• Your lab machines can only talk to each other\n\nKey Kali tools: nmap, burp suite, metasploit, wireshark, john, hashcat, sqlmap, nikto, aircrack-ng, hydra",
  },
];

const labComponents = [
  { name: 'Hypervisor', options: ['VirtualBox (Free)', 'VMware Workstation', 'Proxmox'], recommended: 0, why: 'Free, cross-platform, great for beginners' },
  { name: 'Attack Machine', options: ['Kali Linux', 'Parrot Security', 'BlackArch'], recommended: 0, why: '600+ tools pre-installed, most popular for pentesting' },
  { name: 'Target Machine', options: ['DVWA', 'Metasploitable 2', 'HackTheBox'], recommended: 0, why: 'Perfect for practicing web attacks safely' },
  { name: 'Network Type', options: ['Host-Only (Isolated)', 'NAT', 'Bridged'], recommended: 0, why: 'Isolates your lab from the real network — essential for safety!' },
  { name: 'RAM Allocation', options: ['2 GB per VM', '4 GB per VM', '8 GB per VM'], recommended: 1, why: 'Good balance of performance. Kali needs at least 2GB, 4GB is comfortable' },
];

export default function HackingLab() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [labDesigned, setLabDesigned] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleSelect = (compIdx: number, optIdx: number) => {
    const newSel = { ...selections, [compIdx]: optIdx };
    setSelections(newSel);
    if (Object.keys(newSel).length >= labComponents.length) setLabDesigned(true);
  };

  const quizQuestions = [
    { q: "Why is network isolation important in a hacking lab?", options: ['It makes hacking faster', 'It prevents your attacks from reaching real networks', 'It\'s required by law', 'It saves bandwidth'], correct: 1 },
    { q: "Kali Linux is...", options: ['A vulnerable target to practice on', 'A penetration testing OS with 600+ security tools', 'An antivirus software', 'A web browser'], correct: 1 },
    { q: "DVWA stands for...", options: ['Digital Virtual Web Architecture', 'Damn Vulnerable Web Application', 'Dynamic Verified Web Access', 'Direct Virtual Web Attack'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-6-3', 100);
        addAchievement('cyber-complete');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={100} message="🔐 CYBERSECURITY PATH COMPLETE! You're ready to start your hacking journey for real!" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={6} title="Building Your Hacking Lab" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Design Your Lab →'}</button>
          </motion.div>
        )}

        {step === 2 && !labDesigned && (
          <motion.div key="lab" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-3 text-red-400">🖥️ Design Your Hacking Lab</h2>
              <p className="text-xs text-gray-400 mb-4">Choose components for each category:</p>
              <div className="space-y-4">
                {labComponents.map((comp, ci) => (
                  <div key={ci}>
                    <p className="text-sm font-semibold text-gray-300 mb-2">{comp.name}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {comp.options.map((opt, oi) => (
                        <button key={oi} onClick={() => handleSelect(ci, oi)}
                          className={`p-2 rounded-lg text-xs text-center transition-colors ${selections[ci] === oi ? 'bg-red-900/40 border border-red-700/50 text-red-300' : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {selections[ci] !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selections[ci] === comp.recommended ? '✅ ' : '💡 Recommended: ' + comp.options[comp.recommended] + ' — '}{comp.why}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && labDesigned && (
          <motion.div key="designed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <div className="text-5xl mb-3">🖥️</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>LAB DESIGNED!</h3>
              <div className="text-left bg-black/50 rounded-lg p-3 mb-3">
                {labComponents.map((comp, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-800/30">
                    <span className="text-gray-400">{comp.name}:</span>
                    <span style={{ color: '#39ff14' }}>{comp.options[selections[i] ?? 0]}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">You&apos;re ready to build this lab and start hacking for real!</p>
            </div>
            <button onClick={() => setStep(3)} className="btn-primary w-full">Final Quiz →</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Final Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
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
