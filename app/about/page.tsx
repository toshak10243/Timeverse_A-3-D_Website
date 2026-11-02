'use client';
import { useEffect } from 'react';
import { ERAS } from '@/lib/eras';
import { useStore } from '@/lib/store';

const TOOLS = [
  ['ChatGPT', 'Concept development, ideation and concept images'],
  ['Google AI Studio (Nano Banana)', 'Visual concept exploration for each era'],
  ['Meshy', 'Image-to-3D generation of the main assets'],
  ['Blender', 'Cleaning, optimising and exporting models as GLB'],
  ['Kling AI', 'Cinematic era videos and the portal clip'],
  ['ElevenLabs', 'Narrator voiceover and sound effects'],
  ['Udio', 'Background music'],
  ['Three.js + React Three Fiber', 'Real-time 3D in the browser'],
];

const STACK = [
  ['Next.js + TypeScript', 'Routing, pages and components'],
  ['Three.js + React Three Fiber', '3D scenes, lights, camera and interaction'],
  ['Drei + Postprocessing', 'Controls, sky, particles, bloom'],
  ['GSAP + Framer Motion', 'Camera flights and UI animation'],
  ['Tailwind CSS', 'Responsive interface'],
  ['Web Audio API', 'Live procedural ambience and effects'],
];

export default function About() {
  const setTrack = useStore((s) => s.setTrack);
  useEffect(() => { setTrack('portal'); }, [setTrack]);
  return (
    <main className="relative min-h-[100svh]" style={{ ['--accent' as any]: '#5ee7ff' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(94,231,255,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
        <p className="eyebrow text-[var(--accent)]">About · Credits</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-wider sm:text-6xl">The making of TIMEVERSE</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          TIMEVERSE is a browser-based 3D experience in which a traveller steps through a mysterious time machine
          and explores four eras — from the pyramids of Giza to an imagined city of 2200 — discovering artifacts,
          stories and sounds along the way.
        </p>

        <section className="mt-16">
          <h2 className="eyebrow text-white/50">01 · The journey</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {ERAS.map((e) => (
              <div key={e.id} className="glass rounded-xl p-5" style={{ ['--accent' as any]: e.accent }}>
                <p className="font-mono text-xs text-[var(--accent)]">{e.year}</p>
                <p className="mt-1 font-display text-lg font-bold">{e.name}</p>
                <p className="mt-1 text-sm text-white/60">{e.objects.map((o) => o.name).join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="eyebrow text-white/50">02 · AI tools used</h2>
          <div className="mt-5 divide-y divide-white/10 rounded-xl border border-white/10">
            {TOOLS.map(([t, d]) => (
              <div key={t} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{t}</span>
                <span className="text-sm text-white/60">{d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="eyebrow text-white/50">03 · Creative process</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Concept & sketches', 'Story, four eras and hand-drawn layouts of the portal and timeline.'],
              ['AI image experiments', 'Concept images for every era; prompts and iterations saved.'],
              ['3D generation', 'Image-to-3D in Meshy, then cleaned and optimised in Blender.'],
              ['Video & audio', 'Cinematic clips, narration and ambience generated and compared.'],
              ['Web prototype', 'Scenes built in React Three Fiber and tested in the browser.'],
              ['Feedback & polish', 'Changes made after review, then tested on desktop and mobile.'],
            ].map(([t, d], i) => (
              <li key={t} className="glass rounded-xl p-5">
                <span className="font-mono text-xs text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-white/60">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="eyebrow text-white/50">04 · Technology</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {STACK.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/10 p-4">
                <p className="text-sm font-semibold">{t}</p>
                <p className="mt-1 text-xs text-white/55">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="eyebrow text-white/50">05 · Asset credits & sources</h2>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/65">
            <p>Built-in 3D environments are procedurally modelled in code for this project.</p>
            <p>
              {/* ✏️ Replace with your real credits. Meshy free-tier assets require CC BY 4.0 attribution. */}
              AI-generated models: <em>[list each model, tool and licence, e.g. “Pyramid — generated with Meshy, CC BY 4.0”]</em>
            </p>
            <p>Videos: <em>[Kling AI clips]</em> · Music: <em>[Udio track]</em> · Voice: <em>[ElevenLabs]</em></p>
            <p>Historical facts: Wikipedia and Encyclopaedia Britannica (linked inside each era).</p>
            <p className="italic text-white/45">The year 2200 is an imagined future for this creative experience, not a historical prediction.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
