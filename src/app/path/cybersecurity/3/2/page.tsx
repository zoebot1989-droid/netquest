'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Cross-Site Scripting (XSS)",
    content: "XSS lets attackers inject malicious scripts into web pages that other users view.\n\n🔴 Stored XSS — Script is saved in the database (comments, profiles). Affects all users who view it.\n🔴 Reflected XSS — Script is in the URL and reflected back. Requires tricking user into clicking a link.\n🔴 DOM XSS — Script manipulates the page's DOM directly in the browser.\n\nClassic payload:\n<script>alert('XSS')</script>\n\nWhat attackers can do:\n• Steal session cookies → hijack accounts\n• Redirect users to phishing sites\n• Modify page content\n• Keylog everything the user types",
  },
  {
    title: "XSS Defense",
    content: "🛡️ Input Sanitization — Strip or encode HTML special characters\n  < becomes &lt;  > becomes &gt;  ' becomes &#39;\n\n🛡️ Output Encoding — Encode data when displaying it\n  Use textContent instead of innerHTML\n\n🛡️ Content Security Policy (CSP) — HTTP header that blocks inline scripts\n  Content-Security-Policy: script-src 'self'\n\n🛡️ HttpOnly Cookies — Prevents JavaScript from accessing cookies\n  Set-Cookie: session=abc; HttpOnly; Secure\n\nRule: NEVER trust user input. Always sanitize and encode.",
  },
];

export default function XSSMission() {
  const [step, setStep] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>(['Nice website!', 'Great article, thanks!']);
  const [showAlert, setShowAlert] = useState(false);
  const [xssTriggered, setXssTriggered] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handlePost = () => {
    if (!comment.trim()) return;
    const newComments = [...comments, comment];
    setComments(newComments);

    // Check for XSS patterns
    const xssPatterns = [/<script/i, /javascript:/i, /onerror/i, /onload/i, /alert\(/i, /onclick/i, /onmouseover/i];
    if (xssPatterns.some(p => p.test(comment))) {
      setTimeout(() => {
        setShowAlert(true);
        if (!xssTriggered) {
          setXssTriggered(true);
          addAchievement('xss-hunter');
        }
      }, 500);
    }
    setComment('');
  };

  const quizQuestions = [
    { q: "Which type of XSS is saved in the database?", options: ['Reflected XSS', 'DOM XSS', 'Stored XSS', 'Blind XSS'], correct: 2 },
    { q: "HttpOnly cookies prevent...", options: ['All cookie access', 'JavaScript from reading cookies', 'Cookies from being sent over HTTP', 'Users from deleting cookies'], correct: 1 },
    { q: "Content Security Policy (CSP) can...", options: ['Encrypt all data', 'Block inline script execution', 'Prevent SQL injection', 'Speed up the website'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-3-2', 80);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={80} message="XSS exploitation mastered! 🎯" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="Cross-Site Scripting (XSS)" pathId="cybersecurity" />

      {/* Simulated Alert */}
      {showAlert && (
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-gray-200 rounded-lg p-6 max-w-xs w-full text-center shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <span className="text-sm font-semibold text-gray-800">This page says:</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-4">XSS</p>
            <button onClick={() => setShowAlert(false)} className="px-6 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600">OK</button>
          </div>
        </motion.div>
      )}

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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Try XSS Attack →'}</button>
          </motion.div>
        )}

        {step === 2 && !xssTriggered && (
          <motion.div key="xss" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-3 text-red-400">🎯 XSS Simulator — Inject a Script!</h2>
              <p className="text-xs text-gray-400 mb-4">This comment section is vulnerable. Make an alert box appear!</p>

              {/* Simulated webpage */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">📝 Blog Comments</h3>
                <div className="space-y-2 mb-3">
                  {comments.map((c, i) => (
                    <div key={i} className="bg-gray-100 rounded p-2 text-xs text-gray-700">
                      <span className="font-semibold text-gray-500">User{i + 1}:</span>{' '}
                      <span dangerouslySetInnerHTML={{ __html: c.replace(/<script[\s\S]*?<\/script>/gi, '<span class="text-red-600 font-bold">[SCRIPT EXECUTED! 💥]</span>') }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={comment} onChange={e => setComment(e.target.value)} className="flex-1 border rounded p-2 text-xs text-gray-900" placeholder="Add a comment..." />
                  <button onClick={handlePost} className="px-3 py-2 bg-blue-500 text-white rounded text-xs font-semibold">Post</button>
                </div>
              </div>

              <p className="text-xs text-gray-500">💡 Hint: Try typing {`<script>alert('XSS')</script>`} as your comment</p>
            </div>
          </motion.div>
        )}

        {step === 2 && xssTriggered && (
          <motion.div key="exploited" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-5xl mb-3">💥</motion.div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>XSS TRIGGERED!</h3>
              <p className="text-sm text-gray-400 mb-3">Your script executed in the browser. In a real attack, you could steal session cookies!</p>
              <div className="bg-red-900/20 rounded p-3 text-xs text-left">
                <p className="text-red-400 font-semibold mb-1">🛡️ Prevention:</p>
                <p className="text-gray-400 font-mono">• Sanitize all user input<br/>• Use textContent, not innerHTML<br/>• Add CSP headers<br/>• Set HttpOnly on cookies</p>
              </div>
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
