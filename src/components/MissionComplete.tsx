'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MissionComplete({ xp, message, backHref }: { xp: number; message?: string; backHref?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
    >
      <div className="card text-center max-w-sm w-full p-8 border-[#39ff14]/30">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold glow-green mb-2" style={{ color: '#39ff14' }}>
          Mission Complete!
        </h2>
        {message && <p className="text-gray-400 mb-4">{message}</p>}
        <div className="text-lg font-mono mb-6" style={{ color: '#00f0ff' }}>
          +{xp} XP
        </div>
        <Link href={backHref || '/'} className="btn-primary inline-block">
          Continue
        </Link>
      </div>
    </motion.div>
  );
}
