'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ERAS } from '@/lib/eras';

const TimeMachineCanvas = dynamic(() => import('@/components/three/TimeMachineCanvas'), { ssr: false });

export default function Landing() {
  const travel = useStore((s) => s.travel);
  const setSoundOn = useStore((s) => s.setSoundOn);
  const setTrack = useStore((s) => s.setTrack);
  const [video, setVideo] = useState(true);

  useEffect(() => { setTrack('portal'); }, [setTrack]);

  const enter = () => {
    setSoundOn(true); // user gesture → browsers allow audio now
    travel('/timeline', 'Initialising Time Machine', 'Calibrating temporal coordinates…');
  };

  return (
    <main className="relative h-[100svh] w-full overflow-hidden" style={{ ['--accent' as any]: '#5ee7ff' }}>
      {/* Cinematic background video — drop your Kling AI clip at /public/videos/portal.mp4 */}
      {video && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src="/videos/portal.mp4"
          autoPlay muted loop playsInline
          onError={() => setVideo(false)}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,60,90,0.35),transparent_60%),linear-gradient(to_bottom,#06070b_0%,transparent_30%,transparent_70%,#06070b_100%)]" />
      <TimeMachineCanvas className="!absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-4 pb-14 text-center sm:pb-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="eyebrow text-[var(--accent)]">
          A journey through time
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.22em' }}
          transition={{ delay: 0.2, duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-4 font-display text-5xl font-black sm:text-7xl md:text-8xl"
          style={{ textShadow: '0 0 40px rgba(94,231,255,0.35)' }}
        >
          TIMEVERSE
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }} className="mt-4 max-w-md text-sm text-white/65 sm:text-base">
          One Portal. Infinite Eras. Endless Possibilities.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
          onClick={enter}
          className="btn-primary pointer-events-auto mt-9"
        >
          Enter the Experience <span aria-hidden>→</span>
        </motion.button>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          {ERAS.map((e) => <span key={e.id}>{e.year} · {e.name}</span>)}
        </motion.div>
      </div>
    </main>
  );
}
