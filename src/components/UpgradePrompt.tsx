'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { startFreeTrial } from '@/lib/subscription';

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  onUpgraded?: () => void;
}

export default function UpgradePrompt({ open, onClose, onUpgraded }: UpgradePromptProps) {
  const handleTrial = () => {
    startFreeTrial();
    onUpgraded?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-sm rounded-2xl border border-yellow-500/30 p-6 space-y-5"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <h2 className="text-xl font-bold text-white">Unlock Everything</h2>
              <p className="text-sm text-gray-400 mt-1">Go PRO and master all 126 missions</p>
            </div>

            <div className="space-y-2 text-sm">
              {[
                '✅ All 8 learning paths fully unlocked',
                '✅ 126 interactive missions',
                '✅ 10 lives with 15-min regen',
                '✅ ⭐ PRO badge',
                '✅ Access to future content',
              ].map(item => (
                <div key={item} className="text-gray-300">{item}</div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="card text-center py-3 border-yellow-500/30">
                <div className="text-lg font-bold text-white">$4.99</div>
                <div className="text-xs text-gray-400">per month</div>
              </div>
              <div className="card text-center py-3 border-yellow-500/50 relative">
                <div className="absolute -top-2 right-2 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-bold">SAVE 50%</div>
                <div className="text-lg font-bold text-white">$29.99</div>
                <div className="text-xs text-gray-400">per year</div>
              </div>
            </div>

            <button
              onClick={handleTrial}
              className="w-full py-3 rounded-xl font-bold text-black text-sm"
              style={{ background: 'linear-gradient(90deg, #00f0ff, #39ff14)' }}
            >
              Start 7-Day Free Trial
            </button>

            <button onClick={onClose} className="w-full text-center text-xs text-gray-500 hover:text-gray-300">
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
