'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getEra } from '@/lib/eras';
import { useStore } from '@/lib/store';
import EraHUD from './EraHUD';
import LoadingScreen from './LoadingScreen';

const EraCanvas = dynamic(() => import('@/components/three/EraCanvas'), { ssr: false });

export default function EraExperience({ id }: { id: string }) {
  const era = getEra(id)!;
  useEffect(() => {
    useStore.getState().select(null);
    useStore.getState().setTrack(era.id);
    return () => useStore.getState().select(null);
  }, [era.id]);

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ ['--accent' as any]: era.accent }}>
      <EraCanvas era={era} />
      <EraHUD era={era} />
      <LoadingScreen era={era} />
    </main>
  );
}
