'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import PythonRepl from '@/components/PythonRepl';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Opening Files",
    content: "Python can read and write files on your computer:\n\n# Reading a file\nf = open(\"data.txt\", \"r\")  # \"r\" = read mode\ncontent = f.read()\nprint(content)\nf.close()                   # always close!\n\nModes:\n\"r\"  — read (default)\n\"w\"  — write (overwrites!)\n\"a\"  — append (adds to end)\n\"x\"  — create (fails if exists)",
  },
  {
    title: "The `with` Statement",
    content: "The with statement automatically closes the file for you — it's the recommended way:\n\nwith open(\"data.txt\", \"r\") as f:\n    content = f.read()\n    print(content)\n# File is automatically closed here!\n\nReading methods:\nf.read()        — entire file as string\nf.readline()    — one line\nf.readlines()   — all lines as a list\n\nWriting:\nwith open(\"output.txt\", \"w\") as f:\n    f.write(\"Hello!\\n\")\n    f.write(\"World!\")",
  },
  {
    title: "Working with CSV",
    content: "CSV (Comma-Separated Values) is a common data format:\n\nname,age,grade\nJohn,14,A\nJane,15,B\n\nReading CSV:\nimport csv\nwith open(\"students.csv\") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)  # ['name', 'age', 'grade']\n\nWriting CSV:\nwith open(\"output.csv\", \"w\") as f:\n    writer = csv.writer(f)\n    writer.writerow([\"name\", \"age\"])\n    writer.writerow([\"John\", 14])",
  },
];

const quizQuestions = [
  { q: "What does the `with` statement do for files?", options: ['Opens the file faster', 'Automatically closes the file when done', 'Encrypts the file', 'Creates a backup'], correct: 1 },
  { q: "What mode would you use to ADD to a file without overwriting?", options: ['"r"', '"w"', '"a"', '"x"'], correct: 2 },
  { q: "What does f.readlines() return?", options: ['The entire file as one string', 'The first line', 'A list of all lines', 'The file size'], correct: 2 },
];

export default function FileIO() {
  const [step, setStep] = useState(0);
  const [practiced, setPracticed] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = (cmd: string) => {
    if (cmd.includes('open') || cmd.includes('read') || cmd.includes('write') || cmd.includes('csv')) {
      setPracticed(true);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('py-5-1', 70);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={70} message="File I/O master! 📁" backHref="/path/python" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="File I/O" pathId="python" />
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
              {step < 2 ? 'Next →' : 'Practice! →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="repl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Challenge: File Operations</h2>
              <p className="text-sm text-gray-400">Practice file syntax! (Files are simulated in this REPL)</p>
              <p className="text-xs text-gray-500 mt-1">Try writing the code: <code className="text-[#39ff14]">data = &quot;name,age\nJohn,14&quot;</code></p>
              <p className="text-xs text-gray-500">Then: <code className="text-[#39ff14]">print(data)</code></p>
            </div>
            <PythonRepl onCommand={handleCommand} height="200px" />
            {practiced ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
