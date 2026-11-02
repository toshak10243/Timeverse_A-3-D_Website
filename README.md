# TIMEVERSE — A Journey Through Time

*One Portal. Infinite Eras. Endless Possibilities.*

An interactive 3D website built with Next.js and React Three Fiber. You go through a time machine and explore four eras in 3D: Ancient Egypt, the Medieval World, the Industrial Revolution and an imagined Future.

The site **works right away**. Every 3D scene is built in code, and the background audio is generated live in the browser. When your AI assets are ready (Meshy models, Kling videos, Udio/ElevenLabs audio), drop them into `public/` and the site uses them automatically.

---

## 1. What you need

| Requirement | Version |
|---|---|
| Node.js | 18.18+ (20 LTS recommended) — https://nodejs.org |
| A code editor | VS Code |
| A modern browser | Chrome / Edge (WebGL 2) |

## 2. Run it (Windows / Mac / Linux)

```bash
# inside the unzipped folder
npm install
npm run dev
```
Open **http://localhost:3000**

Production build: `npm run build` then `npm start`.
Deploy for free: push to GitHub → import into **Vercel** → Deploy (no setup needed).

> If a laptop struggles, add `?lite` to an era URL (e.g. `/era/egypt?lite`) to turn off bloom and shadows. The site also does this automatically if the GPU crashes.

---

## 3. Site map

| Route | Section |
|---|---|
| `/` | **Landing**: animated 3D time machine, background video, Enter button |
| `/timeline` | **Time Machine / Era Selection**: interactive timeline, previews, "Travel Through Time" |
| `/era/egypt` · `/era/medieval` · `/era/industrial` · `/era/future` | **3D Exploration + Discover History**: full-screen scene, clickable artifacts, fact cards, history drawer, cinematic video |
| *(between pages)* | **Time Travel Animation**: warp tunnel, flash, whoosh sound |
| `/about` | **About / Credits**: concept, AI tools, process, credits |

### Features checklist
- ✅ Rotate (drag) and zoom (scroll / pinch) with orbit controls
- ✅ Four selectable eras with an animated time-travel transition
- ✅ Click glowing markers or artifact chips: the camera flies to the object and a fact card opens
- ✅ "Artifacts discovered" progress for each era
- ✅ History drawer with a timeline and Learn More links
- ✅ Cinematic video modal for each era
- ✅ Sound on/off, era ambience, discovery chime, narrator captions
- ✅ Loading screen with real progress
- ✅ Responsive (desktop + mobile, bottom-sheet cards on phones)
- ✅ Keyboard: ← → Enter on the timeline, Esc closes panels

---

## 4. Project structure

```
app/
  page.tsx               Landing
  timeline/page.tsx      Era selection
  era/[id]/page.tsx      3D era route
  about/page.tsx         About / credits
components/
  three/
    scenes/              EgyptScene, MedievalScene, IndustrialScene, FutureScene
    TimeMachineCanvas    Landing 3D portal
    WarpCanvas           Time-travel tunnel
    EraCanvas            Canvas + controls + bloom for each era
    Interactive          Makes any object clickable (marker, hover, GLB swap)
    CameraRig            GSAP camera flights
    ModelSlot            Loads your GLB, with procedural fallback
  ui/                    HUD, info card, loader, video modal, nav, transition
lib/
  eras.ts                ★ ALL era content: text, facts, camera, model paths
  audio.ts               Audio engine (file → else synth)
  store.ts               Global state (zustand)
public/
  models/ videos/ audio/ images/   ← put your AI assets here (see each README)
TIMEVERSE_PROCESS/       Folder skeleton for your process evidence
```

## 5. Adding your AI assets

| Asset | Put it in | Then |
|---|---|---|
| Meshy model | `public/models/pyramid.glb` | Uncomment `modelUrl` for that object in `lib/eras.ts` |
| Kling video | `public/videos/egypt.mp4` (+ `portal.mp4`) | Nothing, it's picked up automatically |
| Music / ambience | `public/audio/egypt.mp3` (+ `portal.mp3`) | Nothing, it replaces the synth |
| Narration | `public/audio/vo-egypt.mp3` | Plays when the era opens (if sound is on) |
| Concept image | `public/images/egypt.jpg` | Shows on the timeline card |

**Meshy → web workflow:** concept image → Meshy *Image to 3D* → export GLB → Blender (fix scale, delete hidden faces, Decimate to ~50–100k tris) → export GLB → `npx @gltf-transform/cli optimize in.glb out.glb --texture-compress webp`.

Remember to fill in **real credits** on the About page (`app/about/page.tsx`, section 05). Meshy free-tier models need CC BY 4.0 attribution.

## 6. Editing content
Everything you'll want to change (facts, descriptions, years, narration, colours, camera angles) is in **`lib/eras.ts`**. To add a new clickable object:
1. Add an entry to that era's `objects` array.
2. Wrap the 3D mesh in the scene file with `<Interactive id="your-id"> … </Interactive>`.

## 7. Tech stack
Next.js 14 · TypeScript · Three.js · React Three Fiber · Drei · @react-three/postprocessing · GSAP · Framer Motion · Tailwind CSS · Zustand · Web Audio API
