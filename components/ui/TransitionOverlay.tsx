'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';

const WarpCanvas = dynamic(() => import('@/components/three/WarpCanvas'), { ssr: false });

/** Time-travel animation: warp tunnel → route change → flash reveal. */
export default function TransitionOverlay() {
  const t = useStore((s) => s.transition);
  const end = useStore((s) => s.endTransition);
  const soundOn = useStore((s) => s.soundOn);
  const router = useRouter();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!t.active) return;
    if (soundOn) audio.whoosh();
    router.prefetch(t.href);
    setFlash(false);
    const f = setTimeout(() => setFlash(true), 1150);
    const a = setTimeout(() => router.push(t.href), 1400);
    const b = setTimeout(() => end(), 2700);
    return () => { clearTimeout(f); clearTimeout(a); clearTimeout(b); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.id]);

  return (
    <AnimatePresence>
      {t.active && (
        <motion.div
          key={t.id}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#02030a]"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
        >
          <WarpCanvas />
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <p className="eyebrow text-[var(--accent)]">Temporal jump in progress</p>
              <p className="mt-4 font-display text-2xl font-bold tracking-[0.2em] sm:text-4xl">{t.label}</p>
              {t.sub && <p className="mt-2 font-mono text-sm text-white/60">{t.sub}</p>}
            </motion.div>
          </div>
          {flash && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.1, times: [0, 0.2, 1], ease: 'easeOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
