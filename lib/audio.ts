// ─────────────────────────────────────────────────────────────
// TIMEVERSE audio engine
//
// 1. If /public/audio/<track>.mp3 exists (e.g. your Udio music or
//    ElevenLabs ambience), it is played on loop.
// 2. Otherwise a procedural ambience is synthesised live with the
//    Web Audio API, so the experience is never silent.
// ─────────────────────────────────────────────────────────────

type Stopper = () => void;

const exists = async (src: string) => {
  try {
    const r = await fetch(src, { method: 'HEAD' });
    const type = r.headers.get('content-type') || '';
    return r.ok && !type.includes('text/html');
  } catch {
    return false;
  }
};

class AudioEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  noiseBuf: AudioBuffer | null = null;
  current: { name: string; stop: Stopper } | null = null;
  token = 0;

  ensure() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 2;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private noise() {
    const src = this.ctx!.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    return src;
  }

  private lfo(freq: number, depth: number, target: AudioParam, type: OscillatorType = 'sine') {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = depth;
    o.connect(g).connect(target);
    o.start();
    return o;
  }

  /** Build a synth ambience for a track name. Returns a stop function. */
  private synth(name: string): Stopper {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
    out.connect(this.master!);
    const nodes: (AudioScheduledSourceNode)[] = [];

    const drone = (freqs: number[], type: OscillatorType, gain: number, cutoff: number) => {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = cutoff;
      const g = ctx.createGain();
      g.gain.value = gain;
      lp.connect(g).connect(out);
      freqs.forEach((f, i) => {
        [-4, 4].forEach((det) => {
          const o = ctx.createOscillator();
          o.type = type;
          o.frequency.value = f;
          o.detune.value = det + i;
          o.connect(lp);
          o.start();
          nodes.push(o);
        });
      });
      nodes.push(this.lfo(0.07, cutoff * 0.4, lp.frequency));
    };

    const wind = (gain: number, center: number) => {
      const n = this.noise();
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = center;
      bp.Q.value = 0.9;
      const g = ctx.createGain();
      g.gain.value = gain;
      n.connect(bp).connect(g).connect(out);
      n.start();
      nodes.push(n, this.lfo(0.11, center * 0.6, bp.frequency), this.lfo(0.17, gain * 0.6, g.gain));
    };

    if (name === 'egypt') {
      wind(0.22, 450);
      drone([73.42, 110, 146.83], 'sine', 0.05, 700);
    } else if (name === 'medieval') {
      wind(0.08, 300);
      drone([98, 146.83, 196], 'triangle', 0.035, 900);
    } else if (name === 'industrial') {
      // rhythmic "chuff" of a steam engine
      const n = this.noise();
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      const g = ctx.createGain();
      g.gain.value = 0.12;
      n.connect(lp).connect(g).connect(out);
      n.start();
      nodes.push(n, this.lfo(2.2, 0.11, g.gain, 'square'));
      drone([55, 82.41], 'sawtooth', 0.03, 260);
    } else if (name === 'future') {
      drone([130.81, 196, 261.63, 329.63], 'sawtooth', 0.025, 1200);
      wind(0.03, 2400);
    } else {
      // portal / menus
      drone([65.41, 98, 130.81], 'sine', 0.07, 500);
      wind(0.03, 1800);
    }

    return () => {
      const t = ctx.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + 1);
      setTimeout(() => {
        nodes.forEach((n) => { try { n.stop(); } catch {} });
        out.disconnect();
      }, 1100);
    };
  }

  async play(name: string) {
    if (this.current?.name === name) return;
    this.stop();
    const ctx = this.ensure();
    if (!ctx) return;
    const token = ++this.token;
    const src = `/audio/${name}.mp3`;
    if (await exists(src)) {
      if (token !== this.token) return;
      const el = new Audio(src);
      el.loop = true;
      el.volume = 0;
      el.play().catch(() => {});
      let v = 0;
      const fade = setInterval(() => { v = Math.min(0.6, v + 0.03); el.volume = v; if (v >= 0.6) clearInterval(fade); }, 80);
      this.current = { name, stop: () => { clearInterval(fade); el.pause(); el.src = ''; } };
    } else {
      if (token !== this.token) return;
      this.current = { name, stop: this.synth(name) };
    }
  }

  stop() {
    this.token++;
    this.current?.stop();
    this.current = null;
  }

  /** Optional narrator line: /public/audio/vo-<era>.mp3 (e.g. from ElevenLabs) */
  async voice(name: string) {
    const src = `/audio/vo-${name}.mp3`;
    if (!(await exists(src))) return;
    const el = new Audio(src);
    el.volume = 0.9;
    el.play().catch(() => {});
  }

  /** Time-travel whoosh */
  whoosh() {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const n = this.noise();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(200, t);
    bp.frequency.exponentialRampToValueAtTime(4000, t + 1.3);
    bp.frequency.exponentialRampToValueAtTime(150, t + 2.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 1.1);
    g.gain.linearRampToValueAtTime(0, t + 2.6);
    n.connect(bp).connect(g).connect(this.master!);
    n.start(t);
    n.stop(t + 2.7);

    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(60, t);
    o.frequency.exponentialRampToValueAtTime(420, t + 1.2);
    o.frequency.exponentialRampToValueAtTime(40, t + 2.4);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0, t);
    og.gain.linearRampToValueAtTime(0.18, t + 1);
    og.gain.linearRampToValueAtTime(0, t + 2.4);
    o.connect(og).connect(this.master!);
    o.start(t);
    o.stop(t + 2.5);
  }

  /** Discovery chime when an object is clicked */
  chime() {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    [880, 1318.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + i * 0.08);
      g.gain.linearRampToValueAtTime(0.12, t + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 1.2);
      o.connect(g).connect(this.master!);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 1.3);
    });
  }
}

export const audio = new AudioEngine();
