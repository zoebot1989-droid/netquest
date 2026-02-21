'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "The CSS Box Model",
    content: "EVERY element in CSS is a box. Understanding the box model is THE most important CSS concept.\n\nFrom inside out:\n1️⃣ Content — Your text/images\n2️⃣ Padding — Space between content and border\n3️⃣ Border — The edge of the element\n4️⃣ Margin — Space between this element and others\n\nThink of it like a picture in a frame:\n• Content = the picture\n• Padding = the matting\n• Border = the frame\n• Margin = wall space between frames",
  },
  {
    title: "box-sizing",
    content: "By default, width/height only set the CONTENT size. Padding and border are ADDED on top.\n\nA 200px wide box with 20px padding = 240px total! 😤\n\nFix it with:\nbox-sizing: border-box;\n\nThis makes width/height include padding and border. ALWAYS use it:\n\n* { box-sizing: border-box; }\n\nEvery professional CSS file starts with this.",
  },
  {
    title: "Interactive Box Model",
    content: "Play with the box model below! Drag the sliders to see how padding, border, and margin affect the layout in real-time. 👇",
  },
];

export default function BoxModel() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(3);
  const [margin, setMargin] = useState(20);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const quizCorrect = quizAnswer === 2;

  const handleFinish = () => {
    completeMission('web-2-2', 60);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="Box model master! 📦" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="The Box Model" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Try it! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="interactive" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Interactive box model */}
            <div className="card">
              <h2 className="font-semibold mb-4">🎮 Interactive Box Model</h2>
              
              <div className="flex justify-center mb-6">
                <div
                  className="transition-all duration-300 relative"
                  style={{
                    margin: `${margin}px`,
                    padding: `${padding}px`,
                    border: `${border}px solid #00f0ff`,
                    background: 'rgba(0,240,255,0.05)',
                  }}
                >
                  {/* Margin label */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-orange-400 font-mono">margin: {margin}px</div>
                  {/* Border label */}
                  <div className="absolute top-0 -right-2 translate-x-full text-[10px] font-mono" style={{ color: '#00f0ff' }}>border: {border}px</div>
                  {/* Padding label */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-purple-400 font-mono">padding: {padding}px</div>
                  
                  <div className="bg-[#39ff14]/20 border border-[#39ff14]/30 rounded px-6 py-4 text-center">
                    <p className="text-sm font-semibold" style={{ color: '#39ff14' }}>Content</p>
                    <p className="text-[10px] text-gray-400">150 × 60</p>
                  </div>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-orange-400 font-mono">Margin: {margin}px</label>
                  <input type="range" min="0" max="50" value={margin} onChange={e => setMargin(+e.target.value)} className="w-full accent-orange-400" />
                </div>
                <div>
                  <label className="text-xs font-mono" style={{ color: '#00f0ff' }}>Border: {border}px</label>
                  <input type="range" min="0" max="20" value={border} onChange={e => setBorder(+e.target.value)} className="w-full accent-cyan-400" />
                </div>
                <div>
                  <label className="text-xs text-purple-400 font-mono">Padding: {padding}px</label>
                  <input type="range" min="0" max="50" value={padding} onChange={e => setPadding(+e.target.value)} className="w-full accent-purple-400" />
                </div>
              </div>

              <div className="mt-4 bg-black/50 rounded-lg p-3 font-mono text-xs">
                <div className="text-gray-500">/* Total width (border-box): */</div>
                <div>
                  <span style={{ color: '#39ff14' }}>150</span>
                  <span className="text-gray-500"> + </span>
                  <span className="text-purple-400">{padding * 2}</span>
                  <span className="text-gray-500"> + </span>
                  <span style={{ color: '#00f0ff' }}>{border * 2}</span>
                  <span className="text-gray-500"> = </span>
                  <span className="text-white font-bold">{150 + padding * 2 + border * 2}px</span>
                  <span className="text-gray-500"> (+ {margin * 2}px margin)</span>
                </div>
              </div>
            </div>

            {/* Quiz */}
            <div className="card border-orange-800/30">
              <h3 className="font-semibold mb-2" style={{ color: '#ff9500' }}>📝 Quiz</h3>
              <p className="text-sm text-gray-400 mb-3">A box has width: 200px, padding: 10px, border: 2px, and NO box-sizing: border-box. What&apos;s the total rendered width?</p>
              {[
                { id: 0, text: '200px' },
                { id: 1, text: '220px' },
                { id: 2, text: '224px' },
                { id: 3, text: '244px' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setQuizAnswer(opt.id)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${
                    quizAnswer === opt.id
                      ? opt.id === 2 ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
              {quizAnswer !== null && quizAnswer !== 2 && (
                <p className="text-xs text-red-400 mt-2">Not quite — remember: padding and border are added on BOTH sides!</p>
              )}
              {quizCorrect && (
                <p className="text-xs mt-2" style={{ color: '#39ff14' }}>✅ Correct! 200 + (10×2) + (2×2) = 224px</p>
              )}
            </div>

            {quizCorrect && (
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
