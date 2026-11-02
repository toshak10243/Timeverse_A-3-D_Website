'use client';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';

export default function SoundToggle() {
  const on = useStore((s) => s.soundOn);
  const set = useStore((s) => s.setSoundOn);
  return (
    <button
      onClick={() => { audio.ensure(); set(!on); }}
      className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-3 transition hover:border-white/40"
      aria-label={on ? 'Mute sound' : 'Play sound'}
    >
      <span className="flex h-3.5 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-[var(--accent)]"
            style={{
              height: on ? undefined : 3,
              animation: on ? `eq 0.${7 + i}s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
            }}
          />
        ))}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{on ? 'Sound' : 'Muted'}</span>
      <style>{`@keyframes eq { from { height: 3px } to { height: 14px } }`}</style>
    </button>
  );
}
