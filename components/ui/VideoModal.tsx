'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Era } from '@/lib/eras';

/** Plays /public/videos/<era>.mp4 (e.g. a Kling AI clip). */
export default function VideoModal({ era, onClose }: { era: Era; onClose: () => void }) {
  const [missing, setMissing] = useState(false);
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {!missing ? (
          <video
            src={`/videos/${era.id}.mp4`}
            controls autoPlay playsInline
            className="aspect-video w-full bg-black"
            onError={() => setMissing(true)}
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center p-8 text-center" style={{ background: era.gradient }}>
            <div className="glass rounded-xl p-6">
              <p className="eyebrow text-[var(--accent)]">Cinematic not added yet</p>
              <p className="mt-3 text-sm text-white/80">
                Add your AI-generated clip at <code className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-xs">public/videos/{era.id}.mp4</code>
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-5 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">{era.name} · {era.year}</p>
          <button onClick={onClose} className="btn-ghost">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
