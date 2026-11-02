'use client';
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import type { Era } from '@/lib/eras';

/** Shows real asset-loading progress (GLB, textures) with a minimum display time. */
export default function LoadingScreen({ era }: { era: Era }) {
  const { progress, active } = useProgress();
  const [minDone, setMinDone] = useState(false);
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = setTimeout(() => setMinDone(true), 1500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const target = active ? progress : 100;
    const id = setInterval(() => setShown((v) => (v >= target ? v : Math.min(target, v + 4))), 30);
    return () => clearInterval(id);
  }, [progress, active]);
  const done = minDone && !active && shown >= 100;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#06070b]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="w-64 text-center">
            <p className="eyebrow text-[var(--accent)]">Materialising</p>
            <p className="mt-3 font-display text-2xl font-bold tracking-wider">{era.name}</p>
            <div className="mt-6 h-px w-full bg-white/10">
              <div className="h-px bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] transition-all" style={{ width: `${shown}%` }} />
            </div>
            <p className="mt-3 font-mono text-xs text-white/50">{Math.round(shown)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
