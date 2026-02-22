'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "POST & First Boot",
    content: "You press the power button for the first time. What happens?\n\n⚡ POST (Power-On Self-Test)\nThe motherboard checks that all hardware works:\n1. CPU detected? ✅\n2. RAM detected? ✅\n3. GPU detected? ✅\n4. Storage detected? ✅\n\nIf something fails, you get beep codes or debug LEDs:\n• No display → Check GPU power & seating\n• Memory error → Reseat RAM\n• CPU error → Check CPU power (8-pin EPS)\n• Boot error → No OS found (normal on new build!)\n\nMany modern motherboards have debug LEDs: CPU, DRAM, VGA, BOOT that light up to show where the problem is.",
  },
  {
    title: "BIOS / UEFI Setup",
    content: "BIOS (Basic Input/Output System) or UEFI (the modern version) is the firmware that runs BEFORE your operating system.\n\nAccess it by pressing DEL or F2 during boot.\n\nKey settings you should configure:\n\n🔧 Boot Order — Which device boots first\n• Set USB first when installing Windows/Linux\n• Set SSD first for normal use\n\n🔧 XMP / DOCP — Enable your RAM's full speed!\n• RAM defaults to base speed (e.g., 2133 MHz)\n• XMP (Intel) / DOCP (AMD) enables rated speed (e.g., 3600 MHz)\n• This is FREE performance — always enable it!\n\n🔧 Fan Curves — Set fan speed vs temperature\n• Silent at idle, ramping up under load",
  },
  {
    title: "Essential BIOS Settings",
    content: "After first boot, check these:\n\n📊 Hardware Monitor\n• CPU temperature — should be 30-45°C at idle\n• Fan RPMs — all fans spinning?\n• Voltages — should be close to spec (12V, 5V, 3.3V)\n\n🔧 Storage Configuration\n• AHCI mode for SATA (not IDE/RAID unless needed)\n• Verify all drives are detected\n\n🔧 Security\n• Set an admin password if needed\n• Enable Secure Boot for Windows 11\n• Enable TPM 2.0 for Windows 11\n\n💡 After configuring BIOS, install your OS:\n1. Download Windows/Linux ISO\n2. Create bootable USB (Rufus or Ventoy)\n3. Boot from USB\n4. Follow the installer\n5. Install drivers (GPU first!)",
  },
];

const biosSettings = [
  { setting: 'XMP/DOCP Profile', options: ['Disabled', 'Profile 1 (3600 MHz)'], correct: 1, explanation: 'Enables RAM to run at its rated speed instead of default 2133 MHz' },
  { setting: 'Boot Order #1', options: ['Hard Drive', 'USB Drive'], correct: 1, explanation: 'USB first for installing the OS, then switch to SSD after' },
  { setting: 'CPU Fan Header', options: ['DC Mode', 'PWM Mode'], correct: 1, explanation: 'PWM gives more precise fan speed control' },
  { setting: 'SATA Mode', options: ['IDE', 'AHCI'], correct: 1, explanation: 'AHCI enables modern features like NCQ and hot-swapping' },
  { setting: 'Secure Boot', options: ['Disabled', 'Enabled'], correct: 1, explanation: 'Required for Windows 11 — prevents unauthorized boot code' },
];

const quizQuestions = [
  { q: "What does POST stand for?", options: ['Power Output System Test', 'Power-On Self-Test', 'Primary Operating System Tool', 'Pre-boot OS Startup'], correct: 1 },
  { q: "What does XMP/DOCP do?", options: ['Overclocks the CPU', 'Enables RAM to run at its rated speed', 'Enables Secure Boot', 'Controls fan curves'], correct: 1 },
  { q: "If your new PC has no display output, what should you check first?", options: ['Install Windows', 'Update BIOS', 'Check GPU seating and power cables', 'Replace the motherboard'], correct: 2 },
];

export default function BIOSFirstBoot() {
  const [step, setStep] = useState(0);
  const [biosStep, setBiosStep] = useState(0);
  const [biosScore, setBiosScore] = useState(0);
  const [biosDone, setBiosDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleBios = (answer: number) => {
    setSelected(answer);
    if (answer === biosSettings[biosStep].correct) setBiosScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (biosStep + 1 >= biosSettings.length) setBiosDone(true);
      else setBiosStep(biosStep + 1);
    }, 1200);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-4-3', 70);
        addAchievement('first-boot');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="BIOS configured — system ready! ⚡" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="BIOS & First Boot" pathId="hardware" />
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
                <p className="text-xs font-semibold mb-2" style={{ color: '#00f0ff' }}>Debug LED Guide:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ led: '🔴 CPU', fix: 'Check 8-pin power, reseat CPU' }, { led: '🟡 DRAM', fix: 'Reseat RAM sticks' }, { led: '⚪ VGA', fix: 'Check GPU power & PCIe slot' }, { led: '🟢 BOOT', fix: 'No bootable OS found' }].map(d => (
                    <div key={d.led} className="bg-gray-800/50 rounded-lg p-2 text-xs">
                      <div className="font-semibold">{d.led}</div>
                      <div className="text-gray-500">{d.fix}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'BIOS Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !biosDone && (
          <motion.div key="bios" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-gray-900" style={{ color: '#00f0ff' }}>BIOS Setup</span>
              </div>
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>⚙️ Configure: {biosSettings[biosStep].setting}</h2>
              <p className="text-sm text-gray-400 mb-4">{biosStep + 1}/{biosSettings.length} — Pick the correct setting</p>
              <div className="space-y-2">
                {biosSettings[biosStep].options.map((opt, i) => (
                  <button key={i} onClick={() => selected === null && handleBios(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-mono transition-colors ${selected === i ? (i === biosSettings[biosStep].correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : selected !== null && i === biosSettings[biosStep].correct ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {selected !== null && <p className="text-xs text-gray-400 mt-3">💡 {biosSettings[biosStep].explanation}</p>}
            </div>
          </motion.div>
        )}

        {step === 3 && biosDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">BIOS Config: {biosScore}/{biosSettings.length} correct!</h3></div>
            <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
          </motion.div>
        )}

        {step === 4 && (
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
