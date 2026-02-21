'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is a Shell Script?",
    content: "A shell script is a file containing terminal commands that run automatically. Instead of typing 10 commands manually, write them once and run the script!\n\nEvery script starts with a 'shebang':\n  #!/bin/bash\n\nThis tells the system 'use bash to run this file.'",
  },
  {
    title: "Variables & Input",
    content: "Variables:\n  NAME=\"John\"\n  echo \"Hello, $NAME\"\n\nCommand output in variable:\n  TODAY=$(date)\n  echo \"Today is $TODAY\"\n\nUser input:\n  read -p \"Enter name: \" NAME\n  echo \"Hi $NAME!\"",
  },
  {
    title: "If/Else & Loops",
    content: "If/Else:\n  if [ -f \"file.txt\" ]; then\n    echo \"File exists!\"\n  else\n    echo \"File not found\"\n  fi\n\nFor loop:\n  for i in 1 2 3 4 5; do\n    echo \"Number: $i\"\n  done\n\nWhile loop:\n  COUNT=0\n  while [ $COUNT -lt 5 ]; do\n    echo $COUNT\n    COUNT=$((COUNT + 1))\n  done",
  },
];

const scriptChallenge = `#!/bin/bash
# Backup Script
# Creates a backup of a directory

BACKUP_DIR="/home/user/backups"
SOURCE_DIR="/home/user/Documents"
DATE=$(date +%Y-%m-%d)

echo "Starting backup..."
mkdir -p $BACKUP_DIR
cp -r $SOURCE_DIR $BACKUP_DIR/docs-$DATE
echo "Backup complete: $BACKUP_DIR/docs-$DATE"`;

export default function ShellScripting() {
  const [step, setStep] = useState(0);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [challengeDone, setChallengerDone] = useState(false);

  const scriptLines = scriptChallenge.split('\n');

  // Challenge: identify what each line does
  const lineQuestions = [
    { line: 0, q: "What does #!/bin/bash do?", options: ['Comments the line', 'Tells the system to use bash', 'Imports bash', 'Defines a variable'], correct: 1 },
    { line: 5, q: "What does DATE=$(date +%Y-%m-%d) do?", options: ['Sets the date to today', 'Stores today\'s date in a variable', 'Prints the date', 'Changes the system date'], correct: 1 },
    { line: 8, q: "What does mkdir -p do?", options: ['Makes a directory (creates parents if needed)', 'Moves a directory', 'Deletes a directory', 'Renames a directory'], correct: 0 },
  ];

  const [challengeStep, setChallengeStep] = useState(0);

  const quizQuestions = [
    { q: "What must be the first line of a bash script?", options: ['#!/bin/bash', '#bash', 'import bash', 'use bash'], correct: 0 },
    { q: "How do you make a script executable?", options: ['run script.sh', 'chmod +x script.sh', 'exec script.sh', 'bash enable script.sh'], correct: 1 },
    { q: "How do you store command output in a variable?", options: ['VAR = $(command)', 'VAR=$(command)', 'set VAR command', '$VAR = command'], correct: 1 },
  ];

  const handleChallengeAnswer = (answer: number) => {
    if (answer === lineQuestions[challengeStep].correct) {
      if (challengeStep + 1 >= lineQuestions.length) {
        setChallengerDone(true);
        addAchievement('script-kiddie');
        setStep(4);
      } else {
        setChallengeStep(challengeStep + 1);
      }
    } else {
      loseLife();
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('term-5-2', 80);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={80} message="You wrote your first script!" backHref="/path/terminal" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Shell Scripting Basics" pathId="terminal" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">{lessons[step].content}</p>
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Read the Script</h2>
              <p className="text-sm text-gray-400">Here&apos;s a real backup script. Can you explain what each highlighted line does?</p>
            </div>

            <div className="card bg-black/50 p-0 overflow-hidden">
              <div className="p-3 font-mono text-xs space-y-0.5">
                {scriptLines.map((line, i) => (
                  <div
                    key={i}
                    className={`px-2 py-0.5 rounded ${i === lineQuestions[challengeStep]?.line ? 'bg-cyan-900/30 border-l-2 border-[#00f0ff]' : ''}`}
                  >
                    <span className="text-gray-600 mr-2">{String(i + 1).padStart(2)}</span>
                    <span className={line.startsWith('#') ? 'text-gray-500' : 'text-gray-300'}>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <p className="text-sm mb-3">{lineQuestions[challengeStep].q}</p>
              {lineQuestions[challengeStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleChallengeAnswer(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  {opt}
                </button>
              ))}
              <p className="text-xs text-gray-500">Question {challengeStep + 1}/{lineQuestions.length}</p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-green-800/30">
              <p className="text-sm" style={{ color: '#39ff14' }}>✅ You understand bash scripts!</p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Final Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm font-mono bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
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
