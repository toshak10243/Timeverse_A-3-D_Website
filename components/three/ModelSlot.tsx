'use client';
import { ReactNode, Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from 'three';

/** Loads a GLB, scales it to `fit` units and sits it on the ground. */
function GLB({ url, fit }: { url: string; fit: number }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    c.scale.setScalar(fit / Math.max(size.x, size.y, size.z, 0.0001));
    const b2 = new THREE.Box3().setFromObject(c);
    const center = b2.getCenter(new THREE.Vector3());
    c.position.set(-center.x, -b2.min.y, -center.z);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; }
    });
    return c;
  }, [scene, fit]);
  return <primitive object={model} />;
}

/** AI model if available, procedural fallback otherwise. */
export function ModelSlot({ url, fit, fallback }: { url: string; fit: number; fallback: ReactNode }) {
  return (
    <ErrorBoundary fallback={<>{fallback}</>}>
      <Suspense fallback={fallback}>
        <GLB url={url} fit={fit} />
      </Suspense>
    </ErrorBoundary>
  );
}
