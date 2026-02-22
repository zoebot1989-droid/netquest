'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadState, type GameState } from '@/lib/gameState';
import { paths, isMissionUnlocked } from '@/lib/chapters';
import { loadSubscription, isChapterLocked, type SubscriptionState } from '@/lib/subscription';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function PathClient({ pathId }: { pathId: string }) {
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

  const path = paths.find(p => p.id === pathId);

  if (!path) return (
    <div className="text-center pt-20">
      <p className="text-gray-500">Path not found</p>
      <Link href="/" className="text-[#00f0ff] text-sm mt-2 inline-block">← Back Home</Link>
    </div>
  );

  if (!state || !sub) return <div className="min-h-screen" />;

  return (
    <div className="space-y-4 pb-8">
      <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} onUpgraded={reload} />

      <div className="flex items-center gap-3 mb-2">
        <Link href="/" className="text-gray-500 hover:text-white text-xl">←</Link>
        <div>
          <h1 className="text-xl font-bold">{path.icon} {path.title}</h1>
          <p className="text-xs text-gray-500">{path.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {path.chapters.map((ch, i) => {
          const locked = isChapterLocked(i, sub.tier);
          const completed = ch.missions.filter(m => state.completedMissions.includes(m.id)).length;
          const total = ch.missions.length;

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className={`card ${locked ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3" onClick={locked ? () => setShowUpgrade(true) : undefined}>
                  <span className="text-2xl">{ch.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      Chapter {ch.id}: {ch.title}
                      {locked && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">🔒 PRO</span>}
                    </h3>
                    <p className="text-xs text-gray-500">{completed}/{total} missions complete</p>
                  </div>
                  <span className="text-xs text-gray-600">{completed === total && total > 0 ? '✅' : `${Math.round((completed / total) * 100)}%`}</span>
                </div>

                {locked ? (
                  <div
                    className="mt-3 text-center py-3 cursor-pointer rounded-lg border border-dashed border-yellow-500/30 hover:border-yellow-500/50 transition-colors"
                    onClick={() => setShowUpgrade(true)}
                  >
                    <p className="text-xs text-yellow-400">🔒 Unlock with PRO</p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {ch.missions.map(m => {
                      const done = state.completedMissions.includes(m.id);
                      const unlocked = isMissionUnlocked(m.id, state.completedMissions, pathId);
                      const canPlay = m.playable && unlocked;
                      const showLocked = !unlocked;
                      const showComingSoon = unlocked && !m.playable;

                      let href = '#';
                      if (canPlay) {
                        if (pathId === 'networking') {
                          const missionIndex = m.id.split('-')[2];
                          href = `/learn/${ch.id}/${missionIndex}`;
                        } else {
                          href = `/path/${pathId}/${ch.id}/${m.id.split('-')[2]}`;
                        }
                      }

                      return (
                        <Link
                          key={m.id}
                          href={href}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${canPlay ? 'hover:bg-white/5 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                        >
                          <span className="text-sm">{done ? '✅' : showLocked ? '🔒' : showComingSoon ? '🔜' : '▶️'}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{m.title}</div>
                            <div className="text-xs text-gray-500">{m.subtitle}</div>
                          </div>
                          <span className="text-xs font-mono" style={{ color: '#00f0ff' }}>+{m.xp}xp</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
