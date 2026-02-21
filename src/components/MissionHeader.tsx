'use client';
import Link from 'next/link';

export default function MissionHeader({ chapter, title, pathId }: { chapter: number; title: string; pathId?: string }) {
  const backHref = pathId ? `/path/${pathId}` : '/';
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link href={backHref} className="text-gray-500 hover:text-white text-xl">←</Link>
      <div>
        <p className="text-xs text-gray-500">Chapter {chapter}</p>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  );
}
