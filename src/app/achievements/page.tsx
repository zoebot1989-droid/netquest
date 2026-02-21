'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { loadState } from '@/lib/gameState';
import { achievements } from '@/lib/achievements';

export default function Achievements() {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    setUnlocked(loadState().achievements);
  }, []);

  return (
    <div className="pb-8">
      <h1 className="text-xl font-bold mb-2">🏆 Achievements</h1>
      <p className="text-sm text-gray-500 mb-4">{unlocked.length}/{achievements.length} unlocked</p>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((a, i) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`card text-center py-4 ${isUnlocked ? 'border-[#39ff14]/20' : 'opacity-40'}`}
            >
              <div className="text-3xl mb-2">{isUnlocked ? a.icon : '🔒'}</div>
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-xs text-gray-500 mt-1">{a.description}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
