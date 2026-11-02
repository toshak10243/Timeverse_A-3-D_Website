'use client';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import type { Era } from '@/lib/eras';
import { EraContext } from './EraContext';
import { CameraRig } from './CameraRig';
import EgyptScene from './scenes/EgyptScene';
import MedievalScene from './scenes/MedievalScene';
import IndustrialScene from './scenes/IndustrialScene';
import FutureScene from './scenes/FutureScene';

const SCENES = { egypt: EgyptScene, medieval: MedievalScene, industrial: IndustrialScene, future: FutureScene };

export default function EraCanvas({ era }: { era: Era }) {
  const Scene = SCENES[era.id];
  // If the GPU can't keep up (WebGL context lost), remount in "lite" mode
  // without post-processing and shadows.
  const [lite, setLite] = useState(() => typeof window !== 'undefined' && window.location.search.includes('lite'));
  const bloom = era.id === 'future' ? 1.1 : era.id === 'industrial' ? 0.6 : 0.35;
  return (
    <Canvas
      key={lite ? 'lite' : 'full'}
      shadows={!lite}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); setLite(true); }, { once: true });
      }}
      dpr={lite ? [1, 1] : [1, 1.75]}
      camera={{ fov: 50, near: 0.1, far: 1200, position: era.camera.intro }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="!fixed inset-0"
    >
      <EraContext.Provider value={era}>
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          minDistance={3}
          maxDistance={era.camera.maxDistance}
          maxPolarAngle={Math.PI / 2.08}
          rotateSpeed={0.6}
        />
        <CameraRig era={era} />
        <AdaptiveDpr pixelated={false} />
        {!lite && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={bloom} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.75} />
          </EffectComposer>
        )}
      </EraContext.Provider>
    </Canvas>
  );
}
