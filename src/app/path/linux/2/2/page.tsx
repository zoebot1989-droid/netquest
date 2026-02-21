'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';
import type { TerminalState } from '@/lib/terminalEngine';

const lessons = [
  {
    title: "What Are Groups?",
    content: "Groups let you give the same permissions to multiple users at once. Instead of setting permissions for each person individually, you add them to a group.\n\nExample: A 'developers' group can all access /var/www/html. Add a new dev to the group → instant access.",
  },
  {
    title: "Group Commands",
    content: "• groups — show which groups you belong to\n• cat /etc/group — the group database\n• groupadd <name> — create a new group (needs sudo)\n• usermod -aG <group> <user> — add user to a group\n\nImportant: The -a flag means APPEND. Without it, usermod REPLACES all groups!\n\nCommon groups:\n• sudo — can use sudo\n• www-data — web server access\n• docker — can run Docker",
  },
];

const quizQuestions = [
  { q: "What does the -a flag do in 'usermod -aG'?", options: ['Adds all users', 'Appends (doesn\'t replace existing groups)', 'Makes the user an admin', 'Activates the group'], correct: 1 },
  { q: "Which group lets a user run sudo?", options: ['admin', 'root', 'sudo', 'wheel'], correct: 2 },
  { q: "Where is group information stored?", options: ['/etc/groups', '/etc/group', '/var/groups', '/home/groups'], correct: 1 },
];

export default function LinuxGroups() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newCompleted = new Set(completedCmds);
    if (trimmed === 'groups') newCompleted.add('groups');
    if (trimmed.includes('cat') && trimmed.includes('/etc/group')) newCompleted.add('group');
    if (trimmed.includes('groupadd')) newCompleted.add('groupadd');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(2), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('linux-2-2', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="Groups mastered!" backHref="/path/linux" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="Groups" pathId="linux" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="card">
                <h2 className="font-semibold mb-2">{l.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{l.content}</p>
              </div>
            ))}
            <button onClick={() => setStep(1)} className="btn-primary w-full">Try It Out →</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Explore Groups</h2>
              <p className="text-sm text-gray-400">Try these commands:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[['groups', 'groups'], ['cat /etc/group', 'group'], ['groupadd devs', 'groupadd']].map(([label, key]) => (
                  <span key={key} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(key) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(key) ? '✅' : '⬜'} {label}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
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
