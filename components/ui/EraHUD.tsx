'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ERAS, type Era } from '@/lib/eras';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';
import VideoModal from './VideoModal';

export default function EraHUD({ era }: { era: Era }) {
  const selectedId = useStore((s) => s.selected);
  const select = useStore((s) => s.select);
  const discovered = useStore((s) => s.discovered);
  const markDiscovered = useStore((s) => s.markDiscovered);
  const travel = useStore((s) => s.travel);
  const soundOn = useStore((s) => s.soundOn);
  const [history, setHistory] = useState(false);
  const [video, setVideo] = useState(false);
  const [caption, setCaption] = useState('');

  const selected = era.objects.find((o) => o.id === selectedId) || null;
  const foundCount = era.objects.filter((o) => discovered[`${era.id}:${o.id}`]).length;
  const prev = ERAS[era.index - 1];
  const next = ERAS[era.index + 1];

  // discovery
  useEffect(() => {
    if (!selectedId) return;
    const key = `${era.id}:${selectedId}`;
    if (!useStore.getState().discovered[key] && soundOn) audio.chime();
    markDiscovered(key);
    setHistory(false);
  }, [selectedId, era.id, markDiscovered, soundOn]);

  // narrator caption (typewriter) + optional voiceover file
  useEffect(() => {
    let i = 0;
    let hide: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      if (useStore.getState().soundOn) audio.voice(era.id);
      const id = setInterval(() => {
        i++;
        setCaption(era.narration.slice(0, i));
        if (i >= era.narration.length) { clearInterval(id); hide = setTimeout(() => setCaption(''), 5000); }
      }, 28);
    }, 2600);
    return () => { clearTimeout(start); clearTimeout(hide); setCaption(''); };
  }, [era]);

  // Esc closes panels
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { select(null); setHistory(false); setVideo(false); } };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [select]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/50 to-transparent" />
      {/* era title */}
      <div className="absolute left-4 top-20 max-w-[70%] sm:left-8 sm:top-24">
        <p className="eyebrow text-[var(--accent)]">Destination · {era.year}</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-wider sm:text-4xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>{era.name}</h1>
        <p className="mt-1 hidden text-sm text-white/70 sm:block" style={{ textShadow: '0 1px 10px rgba(0,0,0,.8)' }}>{era.tagline}</p>
      </div>

      {/* narrator caption */}
      <AnimatePresence>
        {caption && !selected && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute inset-x-4 top-[42%] mx-auto max-w-xl text-center"
          >
            <p className="font-display text-base leading-relaxed text-white/90 sm:text-lg" style={{ textShadow: '0 2px 16px rgba(0,0,0,.9)' }}>
              “{caption}”
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* artifacts list */}
      <div className="absolute bottom-24 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto">
        <p className="eyebrow mb-3 text-white/60">Artifacts discovered · <span className="text-[var(--accent)]">{foundCount}/{era.objects.length}</span></p>
        <div className="scrollbar-none pointer-events-auto flex gap-2 overflow-x-auto">
          {era.objects.map((o) => {
            const found = discovered[`${era.id}:${o.id}`];
            const active = o.id === selectedId;
            return (
              <button
                key={o.id}
                onClick={() => select(active ? null : o.id)}
                className={`glass shrink-0 rounded-xl px-4 py-2.5 text-left transition hover:border-white/30 ${active ? '!border-[var(--accent)]' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${found ? 'bg-[var(--accent)]' : 'bg-white/25'}`} />
                  <span className="text-sm font-semibold">{found ? o.name : 'Unknown artifact'}</span>
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">{found ? o.short : 'Click to locate'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* action bar */}
      <div className="pointer-events-auto absolute bottom-6 right-4 flex flex-wrap justify-end gap-2 sm:bottom-8 sm:right-8">
        <button onClick={() => setHistory((v) => !v)} className="btn-ghost glass">History</button>
        <button onClick={() => setVideo(true)} className="btn-ghost glass">▶ Cinematic</button>
        {prev && <button onClick={() => travel(`/era/${prev.id}`, `Destination: ${prev.year}`, prev.name)} className="btn-ghost glass" aria-label="Previous era">← {prev.year}</button>}
        {next && <button onClick={() => travel(`/era/${next.id}`, `Destination: ${next.year}`, next.name)} className="btn-ghost glass" aria-label="Next era">{next.year} →</button>}
        {!next && <button onClick={() => travel('/timeline', 'Returning to the Time Machine')} className="btn-ghost glass">Timeline ↺</button>}
      </div>

      {/* controls hint */}
      <p className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 lg:block">
        Drag to rotate · Scroll to zoom · Click glowing markers
      </p>

      {/* object info card */}
      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass pointer-events-auto absolute inset-x-3 bottom-3 max-h-[58svh] overflow-y-auto rounded-2xl p-6 sm:inset-x-auto sm:bottom-auto sm:right-8 sm:top-24 sm:w-[380px] sm:max-h-[calc(100svh-200px)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--accent)]">Artifact discovered</p>
                <h2 className="mt-2 font-display text-2xl font-bold">{selected.name}</h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">{selected.short}</p>
              </div>
              <button onClick={() => select(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 hover:text-white" aria-label="Close">✕</button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{selected.description}</p>
            <div className="mt-5 space-y-3">
              {selected.facts.map((f, k) => (
                <div key={k} className="flex gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
                  <span className="font-mono text-xs text-[var(--accent)]">{String(k + 1).padStart(2, '0')}</span>
                  <p className="text-sm leading-relaxed text-white/75">{f}</p>
                </div>
              ))}
            </div>
            {era.note && <p className="mt-4 text-xs italic text-white/40">{era.note}</p>}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* history drawer */}
      <AnimatePresence>
        {history && (
          <motion.aside
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass pointer-events-auto absolute inset-x-3 bottom-3 top-20 overflow-y-auto rounded-2xl p-6 sm:inset-x-auto sm:left-8 sm:top-24 sm:bottom-44 sm:w-[400px]"
          >
            <div className="flex items-center justify-between">
              <p className="eyebrow text-[var(--accent)]">Discover history</p>
              <button onClick={() => setHistory(false)} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 hover:text-white" aria-label="Close">✕</button>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold">{era.name}</h2>
            <ol className="relative mt-6 space-y-5 border-l border-white/15 pl-5">
              {era.timeline.map((t) => (
                <li key={t.year} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  <p className="font-mono text-xs text-[var(--accent)]">{t.year}</p>
                  <p className="mt-1 text-sm text-white/80">{t.event}</p>
                </li>
              ))}
            </ol>
            <p className="eyebrow mt-8 text-white/50">Learn more</p>
            <ul className="mt-3 space-y-2">
              {era.learnMore.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white/80 transition hover:border-[var(--accent)] hover:text-white">
                    {l.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {video && <div key="video" className="pointer-events-auto"><VideoModal era={era} onClose={() => setVideo(false)} /></div>}
      </AnimatePresence>
    </div>
  );
}
