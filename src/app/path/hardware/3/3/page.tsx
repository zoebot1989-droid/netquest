'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Why Cooling Matters",
    content: "CPUs and GPUs generate a LOT of heat. Without cooling, they'd hit 100°C+ and throttle (slow down) or shut off to prevent damage.\n\nTarget temperatures:\n• CPU idle: 30-40°C\n• CPU load: 60-80°C (under 85°C is good)\n• GPU load: 65-85°C\n• 90°C+ = throttling zone ⚠️\n• 100°C+ = danger zone! 🔥\n\nThermal paste fills microscopic gaps between the CPU and cooler, improving heat transfer by up to 20°C. Always apply thermal paste!",
  },
  {
    title: "Air vs Liquid Cooling",
    content: "🌀 Air Cooling\n• Heat pipes + aluminum fins + fan\n• Simple, reliable, cheap ($20-80)\n• No risk of leaks\n• Good enough for most builds\n• Gets bulky for high-performance\n• Examples: Noctua NH-D15, be quiet! Dark Rock 4\n\n💧 AIO Liquid Cooling (All-In-One)\n• Pump + radiator + fans\n• Better cooling for hot CPUs\n• Cleaner look, less CPU area blocked\n• $80-200 for 240mm-360mm radiators\n• Very small leak risk\n• Examples: Corsair H100i, NZXT Kraken\n\n💧 Custom Loop — DIY liquid cooling. Maximum performance, maximum price ($300+), maximum risk.",
  },
  {
    title: "Case Airflow",
    content: "Airflow design is CRITICAL. Components need fresh cool air in and hot air out.\n\nThe golden rule: FRONT = INTAKE, REAR/TOP = EXHAUST\n\n📥 Front fans pull cool air in\n📤 Rear fan pushes hot air out\n📤 Top fans exhaust rising hot air\n\nIdeal setup:\n• 2-3 intake fans (front)\n• 1 rear exhaust fan\n• 1-2 top exhaust fans (optional)\n\n💡 Positive pressure (more intake than exhaust) reduces dust buildup.\n\nFan curves: Most BIOS and software let you set fan speeds based on temperature. Quieter at idle, louder under load.",
  },
];

const airflowPositions = [
  { position: 'Front (3 fans)', role: 'intake', emoji: '📥' },
  { position: 'Rear (1 fan)', role: 'exhaust', emoji: '📤' },
  { position: 'Top (2 fans)', role: 'exhaust', emoji: '📤' },
  { position: 'Bottom (1 fan)', role: 'intake', emoji: '📥' },
];

const airflowQuiz = [
  { position: 'Front of case', correct: 'intake' },
  { position: 'Rear of case', correct: 'exhaust' },
  { position: 'Top of case', correct: 'exhaust' },
  { position: 'Bottom (under GPU)', correct: 'intake' },
  { position: 'Side panel (if mesh)', correct: 'intake' },
];

const quizQuestions = [
  { q: "What temperature should a CPU stay under during load?", options: ['50°C', '65°C', '85°C', '100°C'], correct: 2 },
  { q: "What does thermal paste do?", options: ['Cools the CPU directly', 'Fills gaps between CPU and cooler for better heat transfer', 'Generates electricity', 'Prevents static discharge'], correct: 1 },
  { q: "Why is positive pressure (more intake) preferred?", options: ['It cools better', 'It reduces dust buildup', 'It\'s quieter', 'It uses less power'], correct: 1 },
];

export default function CoolingSolutions() {
  const [step, setStep] = useState(0);
  const [airflowStep, setAirflowStep] = useState(0);
  const [airflowScore, setAirflowScore] = useState(0);
  const [airflowDone, setAirflowDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleAirflow = (answer: string) => {
    setSelected(answer);
    if (answer === airflowQuiz[airflowStep].correct) setAirflowScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (airflowStep + 1 >= airflowQuiz.length) setAirflowDone(true);
      else setAirflowStep(airflowStep + 1);
    }, 700);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-3-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="Cool as ice! ❄️" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Cooling Solutions" pathId="hardware" />
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
            {step === 2 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs font-semibold mb-2" style={{ color: '#00f0ff' }}>Airflow Diagram:</p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-center">
                  <div className="text-gray-500 mb-1">📤 TOP (exhaust) 📤</div>
                  <div className="flex justify-between items-center">
                    <div className="text-green-400">📥<br/>FRONT<br/>(intake)<br/>📥📥</div>
                    <div className="text-gray-600 text-[10px]">┌─────────┐<br/>│ CPU GPU │<br/>│ &nbsp;&nbsp; ↗ ↗ &nbsp; │<br/>│ cool→hot│<br/>└─────────┘</div>
                    <div className="text-red-400">📤<br/>REAR<br/>(exhaust)</div>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Airflow Challenge →'}</button>
          </motion.div>
        )}

        {step === 3 && !airflowDone && (
          <motion.div key="airflow" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Intake or Exhaust?</h2>
              <p className="text-sm text-gray-400 mb-3">{airflowStep + 1}/{airflowQuiz.length}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-center">
                <p className="text-lg font-semibold">{airflowQuiz[airflowStep].position}</p>
                <p className="text-xs text-gray-500 mt-1">Should fans here intake or exhaust?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => selected === null && handleAirflow('intake')}
                  className={`p-3 rounded-lg text-sm font-semibold transition-colors ${selected === 'intake' ? (airflowQuiz[airflowStep].correct === 'intake' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                  📥 Intake
                </button>
                <button onClick={() => selected === null && handleAirflow('exhaust')}
                  className={`p-3 rounded-lg text-sm font-semibold transition-colors ${selected === 'exhaust' ? (airflowQuiz[airflowStep].correct === 'exhaust' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                  📤 Exhaust
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && airflowDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">Airflow: {airflowScore}/{airflowQuiz.length} correct!</h3></div>
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
