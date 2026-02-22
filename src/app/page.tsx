'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadState, getLevelInfo, type GameState } from '@/lib/gameState';
import { paths, getPathMissionCount, getPathCompletedCount } from '@/lib/chapters';
import { loadSubscription, type SubscriptionState } from '@/lib/subscription';
import ProBadge from '@/components/ProBadge';
import UpgradeBanner from '@/components/UpgradeBanner';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);
  const [sub, setSub] = useState<SubscriptionState | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    setState(loadState());
    setSub(loadSubscription());
  }, []);

  const reload = () => {
    setState(loadState());
    setSub(loadSubscription());
  };

  if (!state || !sub) return <div className="min-h-screen" />;

  const { current, next } = getLevelInfo(state.xp);
  const xpProgress = next ? ((state.xp - current.minXP) / (next.minXP - current.minXP)) * 100 : 100;

  return (
    <div className="space-y-6 pb-8">
      <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} onUpgraded={reload} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
        <h1 className="text-3xl font-bold glow-cyan" style={{ color: '#00f0ff' }}>
          ⚡ NetQuest
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Learn tech by doing
          {sub.tier === 'pro' && <ProBadge className="ml-2" />}
        </p>
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

      {/* Learning Paths */}
      <div>
        <h2 className="text-lg font-semibold mb-3">🎯 Choose Your Path</h2>
        <div className="grid grid-cols-2 gap-3">
          {paths.map((path, i) => {
            const total = getPathMissionCount(path.id);
            const completed = getPathCompletedCount(path.id, state.completedMissions);
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
              >
                {path.comingSoon ? (
                  <div className="card text-center py-5 opacity-40 cursor-not-allowed">
                    <div className="text-3xl mb-2">{path.icon}</div>
                    <h3 className="font-semibold text-sm">{path.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                  </div>
                ) : (
                  <Link href={`/path/${path.id}`}>
                    <div className="card text-center py-5 hover:border-[#00f0ff]/40 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">{path.icon}</div>
                      <h3 className="font-semibold text-sm">{path.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{path.description}</p>
                      {total > 0 && (
                        <div className="mt-3">
                          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00f0ff, #39ff14)' }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{completed}/{total} missions</p>
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Banner for free users */}
      {sub.tier === 'free' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <UpgradeBanner onUpgradeClick={() => setShowUpgrade(true)} />
        </motion.div>
      )}
    </div>
  );
}
