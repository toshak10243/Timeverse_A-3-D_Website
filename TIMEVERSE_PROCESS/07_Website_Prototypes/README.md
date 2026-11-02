# 07 · Website Prototypes & Interface Iterations

## 1. Prototype Evolution
### Phase 1: Pure 2D Cards (Early Wireframe)
- Initial prototype was a conventional flat scroll-based timeline.
- **Problem**: Lacked immersion; felt like reading a static web article.

### Phase 2: Integrated Three.js Canvas
- Replaced 2D cards with full-screen React Three Fiber viewport.
- Added OrbitControls, directional sun lighting with realistic soft shadows, and procedural particle dust.

### Phase 3: Spatial Focus & Object Inspection (Final)
- Integrated dynamic camera tweening via `CameraRig.tsx` and Framer Motion UI overlays.
- Clicking an artifact (e.g. Pyramid, Sphinx, Locomotive) calculates smooth vector offsets:
  ```typescript
  const offset = object.offset;
  const target = [object.position.x, object.position.y + object.focusY, object.position.z];
  // Smooth GSAP / Lerp camera translation
  ```
- Instant HUD update with curated historical facts and encyclopedia cross-links.

## 2. Key Interface Modules
- `components/ui/EraHUD.tsx`: Responsive navigation, year display, audio toggle, and era selection.
- `components/ui/TransitionOverlay.tsx`: Hyperspace jump warp tunnel rendered dynamically between route changes.
- `components/ui/VideoModal.tsx`: High-definition video player overlay triggered on demand for cinematic perspective.
