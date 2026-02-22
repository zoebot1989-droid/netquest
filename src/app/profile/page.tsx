'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadState, saveState, getLevelInfo, type GameState } from '@/lib/gameState';
import { loadSubscription, saveSubscription, startFreeTrial, setFree, type SubscriptionState } from '@/lib/subscription';
import { paths } from '@/lib/chapters';
import ProBadge from '@/components/ProBadge';
import UpgradePrompt from '@/components/UpgradePrompt';

const APP_VERSION = '1.0.0';

export default function ProfilePage() {
  const [state, setState] = useState<GameState | null>(null);
  const [sub, setSub] = useState<SubscriptionState | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [devTaps, setDevTaps] = useState(0);

  useEffect(() => {
    setState(loadState());
    setSub(loadSubscription());
  }, []);

  const reload = () => {
    setState(loadState());
    setSub(loadSubscription());
  };

  if (!state || !sub) return <div className="min-h-screen" />;

  const { current } = getLevelInfo(state.xp);
  const totalMissions = paths.reduce((sum, p) => sum + p.chapters.reduce((s, c) => s + c.missions.length, 0), 0);
  const completedCount = state.completedMissions.length;

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('netquest-state');
      localStorage.removeItem('netquest-subscription');
      reload();
      setShowReset(false);
    }
  };

  const handleVersionTap = () => {
    const taps = devTaps + 1;
    setDevTaps(taps);
    if (taps >= 7) {
      setDevMode(true);
      setDevTaps(0);
    }
  };

  const toggleDevTier = () => {
    if (sub.tier === 'free') {
      startFreeTrial();
    } else {
      setFree();
    }
    reload();
  };

  return (
    <div className="space-y-4 pb-8">
      <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} onUpgraded={reload} />

      <div className="flex items-center gap-3 mb-2">
        <Link href="/" className="text-gray-500 hover:text-white text-xl">←</Link>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      {/* User Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #00f0ff33, #39ff1433)' }}>
            👤
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              Lvl {state.level}: {current.name}
              {sub.tier === 'pro' && <ProBadge />}
            </div>
            <div className="text-xs text-gray-500">{state.xp} XP total</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold" style={{ color: '#00f0ff' }}>{completedCount}</div>
            <div className="text-xs text-gray-500">Missions</div>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: '#ff9500' }}>{state.streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: '#39ff14' }}>{state.achievements.length}</div>
            <div className="text-xs text-gray-500">Badges</div>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.round((completedCount / totalMissions) * 100)}%`, background: 'linear-gradient(90deg, #00f0ff, #39ff14)' }} />
        </div>
        <p className="text-xs text-gray-500 text-center">{completedCount}/{totalMissions} missions completed</p>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card space-y-3">
        <h3 className="font-semibold text-sm">Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium flex items-center gap-2">
              {sub.tier === 'pro' ? (
                <>⭐ PRO</>
              ) : (
                <>Free Tier</>
              )}
            </div>
            {sub.expiresAt && (
              <div className="text-xs text-gray-500">
                Expires: {new Date(sub.expiresAt).toLocaleDateString()}
              </div>
            )}
          </div>
          {sub.tier === 'free' ? (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-xs font-bold px-4 py-2 rounded-lg"
              style={{ background: 'linear-gradient(90deg, #00f0ff, #39ff14)', color: '#000' }}
            >
              Upgrade to PRO
            </button>
          ) : (
            <span className="text-xs text-gray-500">Active</span>
          )}
        </div>
      </motion.div>

      {/* Dev Mode Toggle */}
      {devMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-3 border-yellow-500/30">
          <h3 className="font-semibold text-sm text-yellow-400">🛠 Developer Mode</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Current tier: {sub.tier}</span>
            <button
              onClick={toggleDevTier}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            >
              Switch to {sub.tier === 'free' ? 'PRO' : 'FREE'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Reset */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card space-y-3">
        {showReset ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400">Are you sure? This will erase all progress.</p>
            <div className="flex gap-2">
              <button onClick={handleReset} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-bold border border-red-500/30">
                Yes, Reset
              </button>
              <button onClick={() => setShowReset(false)} className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowReset(true)} className="w-full text-sm text-red-400 hover:text-red-300">
            Reset Progress
          </button>
        )}
      </motion.div>

      {/* App Version */}
      <div className="text-center" onClick={handleVersionTap}>
        <p className="text-xs text-gray-600">NetQuest v{APP_VERSION}</p>
      </div>
    </div>
  );
}
