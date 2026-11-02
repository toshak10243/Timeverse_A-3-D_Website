'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';

/** Keeps the playing ambience in sync with the current page + sound toggle. */
export default function AudioController() {
  const on = useStore((s) => s.soundOn);
  const track = useStore((s) => s.track);
  useEffect(() => {
    if (on) audio.play(track);
    else audio.stop();
  }, [on, track]);
  useEffect(() => () => audio.stop(), []);
  return null;
}
