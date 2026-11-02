import { notFound } from 'next/navigation';
import { ERAS, getEra } from '@/lib/eras';
import EraExperience from '@/components/ui/EraExperience';

export function generateStaticParams() {
  return ERAS.map((e) => ({ id: e.id }));
}

export default function EraPage({ params }: { params: { id: string } }) {
  if (!getEra(params.id)) notFound();
  return <EraExperience id={params.id} />;
}
