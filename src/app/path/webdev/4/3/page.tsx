'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import CodePreview from '@/components/CodePreview';
import { completeMission } from '@/lib/gameState';

const lessons = [
  {
    title: "Fetch & APIs",
    content: "APIs (Application Programming Interfaces) let your website talk to servers and get data.\n\nExamples:\n• Weather data from OpenWeatherMap\n• Movies from TMDB\n• Pokémon data from PokéAPI\n• Your own backend server\n\nData is sent as JSON (JavaScript Object Notation):\n{\n  \"name\": \"Pikachu\",\n  \"type\": \"electric\",\n  \"hp\": 35\n}",
  },
  {
    title: "The fetch() API",
    content: "fetch() makes HTTP requests:\n\nfetch(\"https://api.example.com/data\")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));\n\nOr with async/await (cleaner):\n\nasync function getData() {\n  const response = await fetch(url);\n  const data = await response.json();\n  console.log(data);\n}\n\n.then() chains promises.\nawait pauses until the promise resolves.\ntry/catch handles errors.",
  },
  {
    title: "Fetch & Display!",
    content: "Let's fetch data from a simulated API and display it on a page! 👇",
  },
];

const fetchCode = `<h2>🌐 API Data Viewer</h2>
<button id="loadBtn">Load Users</button>
<div id="users"></div>

<script>
  // Simulated API data (in real life, this comes from a server)
  const fakeAPI = [
    { name: "Alice", email: "alice@example.com", role: "Admin" },
    { name: "Bob", email: "bob@example.com", role: "User" },
    { name: "Charlie", email: "charlie@example.com", role: "Moderator" },
    { name: "Diana", email: "diana@example.com", role: "User" },
  ];

  document.querySelector("#loadBtn").addEventListener("click", () => {
    // Simulate fetch with setTimeout (network delay)
    document.querySelector("#loadBtn").textContent = "Loading...";
    
    setTimeout(() => {
      const container = document.querySelector("#users");
      container.innerHTML = "";
      
      // TODO: Loop through fakeAPI and create cards
      // HINT: use forEach, createElement, or innerHTML
      // Each card should show name, email, and role
      
      fakeAPI.forEach(user => {
        container.innerHTML += \`
          <div style="background:#1e293b; padding:12px; margin:8px 0; border-radius:8px; border-left:3px solid #3b82f6;">
            <strong>\${user.name}</strong>
            <!-- Add email and role here! -->
          </div>
        \`;
      });
      
      document.querySelector("#loadBtn").textContent = "Reload";
    }, 800);
  });
</script>`;

export default function FetchAPIs() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const handleCodeChange = (code: string) => {
    const hasForEach = /forEach/.test(code);
    const hasEmail = /user\.email|email/.test(code) && (code.match(/\$\{user\./g) || []).length >= 2;
    const hasRole = /user\.role|role/.test(code);
    setCodeValid(hasForEach && (hasEmail || hasRole));
  };

  const handleFinish = () => {
    completeMission('web-4-3', 70);
    setComplete(true);
  };

  if (complete) return <MissionComplete xp={70} message="API master! You can fetch anything! 🌐" backHref="/path/webdev" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Fetch & APIs" pathId="webdev" />
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
              {step < 2 ? 'Next →' : 'Fetch Data! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="editor" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Display API Data!</h2>
              <p className="text-sm text-gray-400">Add the user&apos;s <strong>email</strong> and <strong>role</strong> to each card. Click &quot;Load Users&quot; in the preview to test!</p>
            </div>

            <CodePreview initialCode={fetchCode} height="450px" onCodeChange={handleCodeChange} />

            {codeValid && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ API data displayed! Click &quot;Load Users&quot; in the preview!</p>
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
