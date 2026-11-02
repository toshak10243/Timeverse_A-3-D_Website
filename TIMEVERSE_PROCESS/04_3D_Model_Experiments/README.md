# 04 · 3D Model Experiments & Asset Pipeline

## 1. Toolchain & Workflow
```
[ AI 2D Concept / Reference ]
             │
             ▼
[ Meshy AI: Image-to-3D / Text-to-3D ]
             │
             ▼
[ Blender: Retopology, Decimation, Pivot Centering, Normal Baking ]
             │
             ▼
[ GLTF / GLB Binary Export (Web-Ready < 1.5MB per asset) ]
             │
             ▼
[ Three.js / React Three Fiber (R3F) Component with Procedural Fallbacks ]
```

## 2. Model Iterations & Experiments

### A. The Great Pyramid (`pyramid.glb`)
- **Meshy Generation**: Initial prompt yielded an irregular mound rather than sharp limestone tiers.
- **Cleanup**: In Blender, faces were planarized, non-manifold geometry removed, base centered at `(0, 0, 0)`, and material roughness set to `0.85` to emulate rough sandstone.

### B. The Great Sphinx (`sphinx.glb`)
- **Generation**: Generated with Meshy using high-resolution prompt focusing on the headdress (nemes) and lion body.
- **Scale Calibration**: Positioned along the eastern axis of the Egyptian scene coordinate space.

### C. Medieval Fortress Keep (`castle.glb`)
- **Challenge**: Initial AI generation created overly dense geometry (>180k polygons) which caused WebGL frame drops.
- **Optimization**: Applied Decimate modifier down to 2,400 faces, baked ambient occlusion into vertex attributes, and exported at 26-unit fit.

### D. Industrial Steam Locomotive (`steam-train.glb`)
- **Generation**: Meshy mechanical text-to-3D experiment. Retained dark iron metallic properties (`metallic: 0.8`, `roughness: 0.3`).

### E. Speculative Skycar (`futuristic-car.glb`)
- **Generation**: Smooth organic surfaces with illuminated cyan emissive trim.

## 3. Dynamic ModelSlot System
In `components/three/ModelSlot.tsx`, all models are wrapped with:
- Bounding-box automatic re-centering and scaling (`size.setScalar(fit / maxDim)`).
- React `Suspense` and `ErrorBoundary` — ensuring that if a user's network fails to fetch the 3D model, the procedural Three.js mesh renders without breaking the app.
