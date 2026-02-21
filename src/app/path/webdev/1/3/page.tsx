'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "HTML Forms",
    content: "Forms let users INTERACT with websites. Every login page, signup form, search bar, and checkout page uses HTML forms.\n\nThe <form> tag wraps all form elements:\n<form>\n  <input type=\"text\">\n  <button type=\"submit\">Submit</button>\n</form>",
  },
  {
    title: "Input Types",
    content: "HTML has TONS of input types:\n\n• text — Regular text field\n• email — Email with validation\n• password — Hidden characters\n• number — Numeric input\n• checkbox — Yes/no toggle\n• radio — Pick one from a group\n• submit — Submit button\n• date — Date picker\n• color — Color picker\n• range — Slider\n\nPlus: <textarea> for long text, <select> for dropdowns",
  },
  {
    title: "Labels & Accessibility",
    content: "ALWAYS pair inputs with <label>:\n\n<label for=\"email\">Email:</label>\n<input type=\"email\" id=\"email\" name=\"email\">\n\nWhy labels matter:\n• Clicking the label focuses the input\n• Screen readers announce what each field is\n• It's required for accessibility compliance\n\nThe 'for' attribute must match the input's 'id'.\n\nLet's build a form! 👇",
  },
];

const formCode = `<h2>✨ Sign Up</h2>
<form>
  <label for="name">Full Name:</label><br>
  <input type="text" id="name" placeholder="John Doe"><br><br>

  <label for="email">Email:</label><br>
  <input type="email" id="email" placeholder="john@example.com"><br><br>

  <label for="pass">Password:</label><br>
  <input type="password" id="pass" placeholder="••••••••"><br><br>

  <!-- Add more fields below! Try: -->
  <!-- number, checkbox, radio, select, textarea -->



  <button type="submit">Create Account</button>
</form>`;

export default function FormsInputs() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const types = ['text', 'email', 'password'];
    const hasBasics = types.every(t => code.includes(`type="${t}"`));
    const hasExtra = /<(textarea|select|input type="(number|checkbox|radio|date|color|range)")/.test(code) ||
      code.includes('type="number"') || code.includes('type="checkbox"') || code.includes('type="radio"') ||
      code.includes('<textarea') || code.includes('<select');
    setCodeValid(hasBasics && hasExtra);
  };

  const handleFinish = () => {
    completeMission('web-1-3', 60);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={60} message="Form builder extraordinaire! 📝" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={1} title="Forms & Inputs" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Build a Form! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Build a Signup Form!</h2>
              <p className="text-sm text-gray-400">The form has name, email, password. Add at least one more field type (number, checkbox, radio, textarea, or select)!</p>
            </div>

            <CodePreview initialCode={formCode} height="400px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ Great form! You've mastered HTML inputs!</p>
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
