import * as THREE from 'three';

// Small procedural textures drawn on a <canvas>.
// No image files needed — they're generated once and cached.

const cache = new Map<string, THREE.CanvasTexture>();

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function finish(canvas: HTMLCanvasElement, repeat: [number, number]) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function brickTexture(opts: {
  base: string;
  mortar: string;
  rows?: number;
  cols?: number;
  variance?: number;
  repeat?: [number, number];
  seed?: number;
}) {
  const { base, mortar, rows = 24, cols = 12, variance = 22, repeat = [1, 1], seed = 7 } = opts;
  const key = `brick-${base}-${mortar}-${rows}-${cols}-${variance}-${repeat}-${seed}`;
  if (cache.has(key)) return cache.get(key)!;

  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const rnd = seeded(seed);
  ctx.fillStyle = mortar;
  ctx.fillRect(0, 0, size, size);
  const [r, g, b] = hexToRgb(base);
  const h = size / rows;
  const w = size / cols;
  for (let row = 0; row < rows; row++) {
    const off = row % 2 ? w / 2 : 0;
    for (let col = -1; col <= cols; col++) {
      const v = (rnd() - 0.5) * variance * 2;
      ctx.fillStyle = `rgb(${r + v},${g + v * 0.9},${b + v * 0.8})`;
      ctx.fillRect(col * w + off + 1.5, row * h + 1.5, w - 3, h - 3);
    }
  }
  // speckle / weathering
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${rnd() * 0.12})`;
    ctx.fillRect(rnd() * size, rnd() * size, 2, 2);
  }
  const tex = finish(c, repeat);
  cache.set(key, tex);
  return tex;
}

/** Hieroglyph-like carved marks for the obelisk */
export function glyphTexture() {
  const key = 'glyph';
  if (cache.has(key)) return cache.get(key)!;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  const rnd = seeded(42);
  ctx.fillStyle = '#b98e5c';
  ctx.fillRect(0, 0, 128, 1024);
  ctx.strokeStyle = 'rgba(70,40,20,0.7)';
  ctx.fillStyle = 'rgba(70,40,20,0.7)';
  ctx.lineWidth = 4;
  for (let y = 40; y < 1000; y += 46) {
    const t = Math.floor(rnd() * 5);
    const cx = 64;
    ctx.beginPath();
    if (t === 0) ctx.arc(cx, y, 14, 0, Math.PI * 2);
    if (t === 1) { ctx.moveTo(cx - 16, y + 12); ctx.lineTo(cx, y - 14); ctx.lineTo(cx + 16, y + 12); }
    if (t === 2) { ctx.moveTo(cx - 18, y); ctx.lineTo(cx + 18, y); ctx.moveTo(cx, y - 14); ctx.lineTo(cx, y + 14); }
    if (t === 3) { ctx.ellipse(cx, y, 18, 8, 0, 0, Math.PI * 2); ctx.moveTo(cx + 6, y); ctx.arc(cx, y, 5, 0, Math.PI * 2); }
    if (t === 4) { ctx.moveTo(cx - 16, y - 12); ctx.quadraticCurveTo(cx + 22, y, cx - 16, y + 12); }
    ctx.stroke();
  }
  const tex = finish(c, [1, 1]);
  cache.set(key, tex);
  return tex;
}

/** Random lit windows for future skyscrapers (used as emissiveMap) */
export function windowTexture(seed = 3, tint = '#7fe8ff') {
  const key = `win-${seed}-${tint}`;
  if (cache.has(key)) return cache.get(key)!;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext('2d')!;
  const rnd = seeded(seed);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 128, 512);
  for (let y = 4; y < 512; y += 10) {
    for (let x = 4; x < 128; x += 12) {
      if (rnd() > 0.55) {
        ctx.globalAlpha = 0.4 + rnd() * 0.6;
        ctx.fillStyle = rnd() > 0.85 ? '#ffb86b' : tint;
        ctx.fillRect(x, y, 7, 5);
      }
    }
  }
  ctx.globalAlpha = 1;
  const tex = finish(c, [1, 1]);
  cache.set(key, tex);
  return tex;
}
