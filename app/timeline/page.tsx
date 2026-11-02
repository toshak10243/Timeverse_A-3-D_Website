'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ERAS } from '@/lib/eras';
import { useStore } from '@/lib/store';
import EraArt from '@/components/ui/EraArt';

export default function TimelinePage() {
  const [i, setI] = useState(0);
  const era = ERAS[i];
  const travel = useStore((s) => s.travel);
  const setTrack = useStore((s) => s.setTrack);
  const discovered = useStore((s) => s.discovered);

  useEffect(() => { setTrack('portal'); }, [setTrack]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((v) => Math.min(ERAS.length - 1, v + 1));
      if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1));
      if (e.key === 'Enter') go();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const go = () => travel(`/era/${era.id}`, `Destination: ${era.year}`, era.name);
  const found = (id: string) => ERAS.find((e) => e.id === id)!.objects.filter((o) => discovered[`${id}:${o.id}`]).length;

  return (
    <main className="relative min-h-[100svh] overflow-hidden" style={{ ['--accent' as any]: era.accent }}>
      {/* atmosphere */}
      <AnimatePresence>
        <motion.div
          key={era.id}
          className="absolute inset-0"
          style={{ background: era.gradient }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#06070b_75%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-10 pt-24 sm:px-8 sm:pt-28">
        <div>
          <p className="eyebrow text-[var(--accent)]">Time machine · Select destination</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-wider sm:text-5xl">Choose your era</h1>
        </div>

        {/* preview */}
        <div className="mt-8 grid flex-1 gap-6 md:grid-cols-[1.25fr_1fr] md:gap-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={era.id}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 md:aspect-auto md:min-h-[340px]"
              style={{ backgroundImage: `url(/images/${era.id}.jpg), ${era.gradient}`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <EraArt era={era} className="absolute inset-x-0 bottom-0 h-3/4 w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-5 font-display text-6xl font-black text-white/90 sm:text-8xl">{era.year.replace(' BCE', '').replace(' CE', '')}</span>
              <span className="absolute bottom-6 right-5 eyebrow text-white/70">{era.year.includes('BCE') ? 'BCE' : 'CE'}</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={era.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col justify-center"
            >
              <p className="eyebrow text-white/50">Era {String(era.index + 1).padStart(2, '0')} / 04</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{era.name}</h2>
              <p className="mt-3 text-white/70">{era.tagline}</p>
              <ul className="mt-6 space-y-2.5">
                {era.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {h}
                  </li>
                ))}
              </ul>
              {era.note && <p className="mt-5 text-xs italic text-white/45">{era.note}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button onClick={go} className="btn-primary">Travel Through Time <span aria-hidden>→</span></button>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  {found(era.id)}/{era.objects.length} artifacts found
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* timeline rail */}
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-[11px] h-px bg-white/15" />
          <motion.div
            className="absolute left-0 top-[11px] h-px bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
            animate={{ width: `${(i / (ERAS.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
          <div className="relative h-16">
            {ERAS.map((e, k) => {
              const n = ERAS.length - 1;
              const align = k === 0 ? 'items-start text-left' : k === n ? 'items-end text-right' : 'items-center text-center';
              const shift = k === 0 ? '0' : k === n ? '-100%' : '-50%';
              return (
                <button
                  key={e.id}
                  onClick={() => setI(k)}
                  className={`group absolute top-0 flex flex-col ${align}`}
                  style={{ left: `${(k / n) * 100}%`, transform: `translateX(${shift})` }}
                >
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border transition ${k === i ? 'scale-110 border-[var(--accent)]' : 'border-white/30 group-hover:border-white/60'}`}
                    style={{ background: '#06070b' }}
                  >
                    <span className={`h-2 w-2 rounded-full transition ${k <= i ? 'bg-[var(--accent)]' : 'bg-white/30'}`} />
                  </span>
                  <span className={`mt-3 whitespace-nowrap font-mono text-[11px] tracking-[0.15em] ${k === i ? 'text-white' : 'text-white/45'}`}>{e.year}</span>
                  <span className={`mt-1 hidden whitespace-nowrap text-xs sm:block ${k === i ? 'text-white/80' : 'text-white/35'}`}>{e.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">← → to browse · Enter to travel</p>
      </div>
    </main>
  );
}
