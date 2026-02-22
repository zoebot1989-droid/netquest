'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/sandbox', label: 'Sandbox', icon: '🔧' },
  { href: '/terminal', label: 'Terminal', icon: '💻' },
  { href: '/reference', label: 'Ref', icon: '📚' },
  { href: '/achievements', label: 'Badges', icon: '🏆' },
  { href: '/profile', label: 'Profile', icon: '⚙️' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1117] border-t border-cyan-900/30 flex justify-around items-center h-16 z-50 safe-area-pb">
      {tabs.map((t) => {
        const active = t.href === '/' ? path === '/' : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${active ? 'text-[#00f0ff]' : 'text-gray-500'}`}>
            <span className="text-xl">{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
