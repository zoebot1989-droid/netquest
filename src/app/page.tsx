'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadState, getLevelInfo, LEVELS, type GameState } from '@/lib/gameState';
import { chapters } from '@/lib/chapters';

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) return <div className="min-h-screen" />;

  const { current, next } = getLevelInfo(state.xp);
  const xpProgress = next ? ((state.xp - current.minXP) / (next.minXP - current.minXP)) * 100 : 100;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
        <h1 className="text-3xl font-bold glow-cyan" style={{ color: '#00f0ff' }}>
          ⚡ NetQuest
        </h1>
        <p className="text-gray-500 text-sm mt-1">Learn networking by doing</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <div className="text-2xl">🔥</div>
          <div className="text-lg font-bold" style={{ color: '#ff9500' }}>{state.streak}</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl">⚡</div>
          <div className="text-lg font-bold" style={{ color: '#00f0ff' }}>{state.xp}</div>
          <div className="text-xs text-gray-500">XP</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl">❤️</div>
          <div className="text-lg font-bold" style={{ color: '#ff3b30' }}>{state.lives}/{state.maxLives}</div>
          <div className="text-xs text-gray-500">Lives</div>
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: '#39ff14' }}>Lvl {state.level}: {current.name}</span>
          {next && <span className="text-xs text-gray-500">{state.xp}/{next.minXP} XP</span>}
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00f0ff, #39ff14)' }}
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        {next && <p className="text-xs text-gray-500 mt-1">Next: {next.name}</p>}
      </motion.div>

      {/* Chapters */}
      <div>
        <h2 className="text-lg font-semibold mb-3">📚 Chapters</h2>
        <div className="space-y-3">
          {chapters.map((ch, i) => {
            const completed = ch.missions.filter((m) => state.completedMissions.includes(m.id)).length;
            const total = ch.missions.length;
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="card">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ch.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">Chapter {ch.id}: {ch.title}</h3>
                      <p className="text-xs text-gray-500">{completed}/{total} missions complete</p>
                    </div>
                    <span className="text-xs text-gray-600">{completed === total ? '✅' : `${Math.round((completed / total) * 100)}%`}</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {ch.missions.map((m) => {
                      const done = state.completedMissions.includes(m.id);
                      return (
                        <Link
                          key={m.id}
                          href={m.playable ? `/learn/${ch.id}/${m.id.split('-')[1]}` : '#'}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${m.playable ? 'hover:bg-white/5 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                        >
                          <span className="text-sm">{done ? '✅' : m.playable ? '▶️' : '🔒'}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{m.title}</div>
                            <div className="text-xs text-gray-500">{m.subtitle}</div>
                          </div>
                          <span className="text-xs font-mono" style={{ color: '#00f0ff' }}>+{m.xp}xp</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
