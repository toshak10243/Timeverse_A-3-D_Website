import type { Object3D } from 'three';

/** Maps an interactive object's id to its 3D group so the camera can fly to it. */
export const objectRegistry = new Map<string, Object3D>();

/** Deterministic random so scenes look the same on every load. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
