'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is SQL Injection?",
    content: "SQL Injection (SQLi) is when an attacker inserts malicious SQL code into an application's database query.\n\nImagine a login form that runs:\nSELECT * FROM users WHERE username='INPUT' AND password='INPUT'\n\nIf you type: admin' --\nThe query becomes:\nSELECT * FROM users WHERE username='admin' --' AND password=''\n\nThe -- comments out the rest! The password check is SKIPPED.\nYou just logged in as admin without knowing the password. 🎯",
  },
  {
    title: "Types of SQL Injection",
    content: "🔴 Classic SQLi — Inject directly into visible queries\n  ' OR 1=1 --\n  ' UNION SELECT * FROM users --\n\n🔴 Blind SQLi — No visible output, but behavior changes\n  ' AND 1=1 -- (page loads normally = TRUE)\n  ' AND 1=2 -- (page breaks = FALSE)\n\n🔴 Error-based — Force database errors to leak info\n  ' AND EXTRACTVALUE(1,CONCAT(0x7e,version())) --\n\n🛡️ Defense: NEVER build SQL from user input!\n  Use parameterized queries / prepared statements.\n  Bad:  \"SELECT * FROM users WHERE id=\" + userId\n  Good: \"SELECT * FROM users WHERE id=?\" with params",
  },
];

export default function SQLInjection() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState<'none' | 'fail' | 'success' | 'error'>('none');
  const [showQuery, setShowQuery] = useState(true);
  const [exploited, setExploited] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const buildQuery = () => {
    return `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  };

  const handleLogin = () => {
    const u = username.trim();
    const p = password.trim();
    
    // Check for SQL injection patterns
    const injectionPatterns = [
      /'\s*(OR|or)\s+.+=.+/,  // ' OR 1=1
      /'\s*--/,                // ' --
      /'\s*;\s*/,              // '; 
      /'\s*(UNION|union)/,     // ' UNION
      /admin'\s*--/,           // admin'--
    ];

    const isInjection = injectionPatterns.some(p => p.test(u) || p.test(password));
    
    if (isInjection) {
      setLoginResult('success');
      if (!exploited) {
        setExploited(true);
        addAchievement('sql-injector');
      }
    } else if (u === 'admin' && p === 'admin') {
      setLoginResult('success');
    } else if (u.includes("'") || p.includes("'")) {
      setLoginResult('error');
    } else {
      setLoginResult('fail');
    }
  };

  const quizQuestions = [
    { q: "What does ' OR 1=1 -- do in a login form?", options: ['Crashes the database', 'Makes the WHERE clause always true, bypassing auth', 'Creates a new admin user', 'Deletes the users table'], correct: 1 },
    { q: "The BEST defense against SQL injection is...", options: ['Input validation only', 'Using a WAF', 'Parameterized queries / prepared statements', 'Blocking single quotes'], correct: 2 },
    { q: "What does -- do in SQL?", options: ['Subtracts values', 'Comments out the rest of the line', 'Creates a new line', 'Defines a variable'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('sec-3-1', 80);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={80} message="SQL Injection mastered! 💉" backHref="/path/cybersecurity" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={3} title="SQL Injection" pathId="cybersecurity" />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 1 ? 'Next →' : 'Try SQL Injection →'}</button>
          </motion.div>
        )}

        {step === 2 && !exploited && (
          <motion.div key="sqli" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-red-800/30">
              <h2 className="font-semibold mb-3 text-red-400">💉 SQL Injection Simulator</h2>
              <p className="text-xs text-gray-400 mb-4">Exploit this vulnerable login form. The password for admin is unknown. Can you bypass it?</p>

              {/* Login Form */}
              <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700 mb-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">🔐 SecureCorp Login Portal</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/50 rounded p-2 text-sm font-mono text-white border border-gray-700" placeholder="Enter username..." />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/50 rounded p-2 text-sm font-mono text-white border border-gray-700" placeholder="Enter password..." />
                  </div>
                  <button onClick={handleLogin} className="w-full p-2 rounded bg-red-900/50 hover:bg-red-800/60 transition-colors text-sm font-semibold text-red-300">Login</button>
                </div>

                {loginResult === 'fail' && <p className="text-red-400 text-xs mt-2">❌ Invalid credentials. Try again.</p>}
                {loginResult === 'error' && <p className="text-yellow-400 text-xs mt-2">⚠️ SQL Error: You have an error in your SQL syntax... Interesting! 🤔</p>}
                {loginResult === 'success' && !exploited && <p className="text-green-400 text-xs mt-2">Logged in — but try using SQL injection!</p>}
              </div>

              {/* Live SQL Query */}
              {showQuery && (
                <div className="bg-black/80 rounded-lg p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">📊 SQL Query Being Executed:</span>
                    <button onClick={() => setShowQuery(false)} className="text-xs text-gray-600">Hide</button>
                  </div>
                  <pre className="font-mono text-xs overflow-x-auto" style={{ color: '#ff6b6b' }}>{buildQuery()}</pre>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">💡 Hint: What happens if you put a single quote in the username? What about: admin&apos; --</p>
            </div>
          </motion.div>
        )}

        {step === 2 && exploited && (
          <motion.div key="exploited" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="card border-green-800/30 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-5xl mb-3">🔓</motion.div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#39ff14' }}>ACCESS GRANTED</h3>
              <p className="text-sm text-gray-400 mb-2">Welcome, admin. You bypassed authentication!</p>
              <div className="bg-black/50 rounded p-3 font-mono text-xs text-left mb-3">
                <div style={{ color: '#ff6b6b' }}>Query: {buildQuery()}</div>
                <div className="text-gray-500 mt-1">The -- commented out the password check!</div>
              </div>
              <div className="bg-red-900/20 rounded p-3 text-xs text-left">
                <p className="text-red-400 font-semibold mb-1">🛡️ How to prevent this:</p>
                <p className="text-gray-400">Use parameterized queries:</p>
                <pre className="font-mono text-gray-300 mt-1">db.query(&quot;SELECT * FROM users WHERE username=? AND password=?&quot;, [username, password])</pre>
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
