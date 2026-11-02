# 06 · Audio System & Sound Design Experiments

## 1. Hybrid Sound Architecture
TIMEVERSE employs a resilient two-tier audio engine designed in `lib/audio.ts`:

1. **Layer 1: Pre-Rendered Audio (`public/audio/*.mp3`)**:
   - AI-composed ambient tracks (Udio) and voiceover narration (ElevenLabs).
   - The engine checks for file availability via `HEAD` requests. If present, it streams seamlessly on loop.
2. **Layer 2: Real-time Web Audio API Procedural Synthesizer**:
   - If audio files are unavailable or loading, the custom Web Audio oscillator/filter graph generates live generative drones and spatial noise so the experience is never silent.

## 2. Era Audio Palette & Frequency Design
| Era | Audio Track | Synthesizer Fallback Profile | Harmonic Mood |
|---|---|---|---|
| **Chrono Portal** | `portal.mp3` | 70 Hz sub-bass drone + bandpass white noise | Cosmic resonance, tension |
| **Ancient Egypt** | `egypt.mp3` | 110 Hz low drone + wind resonance filter | Arid solitude, desert vastness |
| **Medieval Europe** | `medieval.mp3` | 146 Hz tonic + medieval fifth intervals | Solitary fortress, stone reverb |
| **Industrial Age** | `industrial.mp3` | 60 Hz heavy rhythmic pulse + filtered metallic noise | Steam pressure, mechanical cadence |
| **Neo-Future 2200** | `future.mp3` | 220 Hz dual saw-wave oscillator + low-pass sweep | Clean cybernetic ambiance |

## 3. Browser Audio Autoplay Compliance
- Web browsers block unprompted audio autoplay.
- An explicit user gesture triggers the audio context on the initial *"Enter Experience"* button click (`setSoundOn(true)`), ensuring smooth, unmuted transitions throughout the entire session.
