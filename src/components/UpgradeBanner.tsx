'use client';
import { useState } from 'react';

interface UpgradeBannerProps {
  onUpgradeClick: () => void;
}

export default function UpgradeBanner({ onUpgradeClick }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative rounded-xl border border-cyan-900/30 p-3 flex items-center gap-3" style={{ background: 'linear-gradient(90deg, #0a0e17 0%, #1a1a2e 100%)' }}>
      <span className="text-xl">⭐</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-300 font-medium">Upgrade to PRO — unlock all 126 missions</p>
      </div>
      <button onClick={onUpgradeClick} className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: 'linear-gradient(90deg, #00f0ff, #39ff14)', color: '#000' }}>
        PRO
      </button>
      <button onClick={() => setDismissed(true)} className="absolute top-1 right-1 text-gray-600 hover:text-gray-400 text-xs leading-none">×</button>
    </div>
  );
}
