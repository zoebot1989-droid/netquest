import { paths } from '@/lib/chapters';
import PathClient from './PathClient';

export function generateStaticParams() {
  return paths.filter(p => !p.comingSoon).map(p => ({ pathId: p.id }));
}

export default async function PathPage({ params }: { params: Promise<{ pathId: string }> }) {
  const { pathId } = await params;
  return <PathClient pathId={pathId} />;
}
