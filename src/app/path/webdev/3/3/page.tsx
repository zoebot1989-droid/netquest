'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "Events",
    content: "Events are things that HAPPEN on a page:\n\n• click — User clicks something\n• submit — Form is submitted\n• keydown — Key is pressed\n• input — Text field changes\n• mouseover — Mouse hovers\n• scroll — Page scrolls\n• load — Page finishes loading\n\nJavaScript can LISTEN for events and run code when they happen!",
  },
  {
    title: "addEventListener",
    content: "Attach event handlers with addEventListener:\n\nconst btn = document.querySelector(\"#btn\");\nbtn.addEventListener(\"click\", function() {\n  alert(\"Clicked!\");\n});\n\nOr with arrow functions:\nbtn.addEventListener(\"click\", () => {\n  console.log(\"Clicked!\");\n});\n\nYou can also use event.preventDefault() to stop default behavior (like form submission refreshing the page).",
  },
  {
    title: "Wire It Up!",
    content: "Let's make a page interactive! Add JavaScript event listeners to make buttons work, forms respond, and elements change. 👇",
  },
];

const eventsCode = `<h2>🎮 Interactive Page</h2>

<button id="colorBtn">Change My Color</button>
<p id="output">Click the button above!</p>

<br><br>
<input type="text" id="nameInput" placeholder="Type your name...">
<p id="greeting"></p>

<br>
<div id="counter">Count: 0</div>
<button id="addBtn">+1</button>
<button id="resetBtn">Reset</button>

<script>
  // 1. Color button — changes paragraph color
  let colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7"];
  let colorIdx = 0;
  document.querySelector("#colorBtn").addEventListener("click", () => {
    document.querySelector("#output").style.color = colors[colorIdx % colors.length];
    document.querySelector("#output").textContent = "Color changed! 🎨";
    colorIdx++;
  });

  // 2. Name input — live greeting
  document.querySelector("#nameInput").addEventListener("input", (e) => {
    const name = e.target.value;
    document.querySelector("#greeting").textContent = name ? "Hello, " + name + "! 👋" : "";
  });

  // 3. Counter — add your event listeners below!
  // HINT: querySelector("#addBtn").addEventListener("click", ...)
  let count = 0;
  // YOUR CODE HERE — make the +1 button increment count
  // YOUR CODE HERE — make the Reset button reset count to 0

</script>`;

export default function EventsListeners() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasAddBtn = /addBtn.*addEventListener|addEventListener.*addBtn/.test(code);
    const hasResetBtn = /resetBtn.*addEventListener|addEventListener.*resetBtn/.test(code);
    const hasClick = (code.match(/addEventListener\s*\(\s*["']click["']/g) || []).length >= 4;
    setCodeValid((hasAddBtn || hasClick) && (hasResetBtn || hasClick));
  };

  const handleFinish = () => {
    completeMission('web-3-3', 70);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={70} message="Event-driven developer! 🖱️⚡" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Events & Listeners" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Wire It Up! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Complete the Counter!</h2>
              <p className="text-sm text-gray-400">The color button and name input already work. Add event listeners for the <strong>+1</strong> and <strong>Reset</strong> buttons!</p>
              <p className="text-xs text-gray-500 mt-1">Click Run to test — try clicking the buttons in the preview!</p>
            </div>

            <CodePreview initialCode={eventsCode} height="450px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ All event listeners wired up! Test them in the preview!</p>
                </div>
                <button onClick={handleFinish} className="btn-primary w-full">Complete Mission →</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
