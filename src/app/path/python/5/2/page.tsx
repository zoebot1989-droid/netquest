'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What's an API?",
    content: "API = Application Programming Interface\n\nIt's how programs talk to each other over the internet. When you use a weather app, it calls a weather API to get data.\n\nHow it works:\n1. Your code sends a REQUEST to a URL\n2. The server processes it\n3. The server sends back a RESPONSE (usually JSON)\n\nHTTP Methods:\n• GET — retrieve data (most common)\n• POST — send/create data\n• PUT — update data\n• DELETE — remove data",
  },
  {
    title: "JSON — The Language of APIs",
    content: "JSON (JavaScript Object Notation) looks just like Python dicts!\n\n{\n    \"name\": \"John\",\n    \"age\": 14,\n    \"hobbies\": [\"coding\", \"gaming\"]\n}\n\nPython makes JSON easy:\nimport json\n\n# JSON string → Python dict\ndata = json.loads('{\"name\": \"John\"}')\nprint(data[\"name\"])  →  \"John\"\n\n# Python dict → JSON string\njson_str = json.dumps({\"name\": \"John\"})\nprint(json_str)  →  '{\"name\": \"John\"}'",
  },
  {
    title: "Making API Requests",
    content: "The requests library makes API calls simple:\n\nimport requests\n\n# GET request\nresponse = requests.get(\"https://api.example.com/users\")\ndata = response.json()   # parse JSON response\nprint(data)\n\n# POST request (sending data)\nresponse = requests.post(\n    \"https://api.example.com/users\",\n    json={\"name\": \"John\", \"age\": 14}\n)\n\n# Check status\nprint(response.status_code)  # 200 = OK!\n\nStatus codes: 200=OK, 404=Not Found, 500=Server Error",
  },
];

const apiData = {
  users: [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" },
    { id: 3, name: "Charlie", role: "user" },
  ],
  weather: { city: "New York", temp: 72, condition: "sunny" },
};

const quizQuestions = [
  { q: "What does API stand for?", options: ['Advanced Python Interface', 'Application Programming Interface', 'Automated Protocol Integration', 'Application Process Input'], correct: 1 },
  { q: "What HTTP method is used to retrieve data?", options: ['POST', 'PUT', 'GET', 'DELETE'], correct: 2 },
  { q: "What does status code 404 mean?", options: ['Success', 'Server error', 'Not found', 'Unauthorized'], correct: 2 },
];

export default function APIsRequests() {
  const [step, setStep] = useState(0);
  const [apiQueried, setApiQueried] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('json') || cmd.includes('api') || cmd.includes('request') || cmd.includes('response')) {
      setApiQueried(true);
      addAchievement('api-explorer');
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-5-2', 70);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="API Explorer unlocked! 🌐" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="APIs & Requests" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Query an API! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: Parse API Data</h2>
              <p className="text-sm text-gray-400">Here&apos;s simulated API response data. Parse it with Python!</p>
              <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-gray-300 mt-2 max-h-24 overflow-y-auto">
                <pre>{JSON.stringify(apiData, null, 2)}</pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try creating a dict and accessing values: <code className="text-[#39ff14]">data = {JSON.stringify(apiData.weather)}</code></p>
            </div>
            <PythonRepl onCommand={handleCommand} height="200px" />
            {apiQueried ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card border-green-800/30 mb-3">
                  <p className="text-sm" style={{ color: '#39ff14' }}>✅ You worked with API data!</p>
                </div>
                <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
              </motion.div>
            ) : (
              <button onClick={() => setStep(4)} className="text-gray-500 text-xs text-center w-full py-2">Skip to quiz →</button>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
