'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Lightweight puffing smoke. `position` is local to the parent;
 * `source` is a ref to a (moving) object that emits the smoke.
 */
export function Smoke({
  position, source, count = 22, color = '#bdb6ad', rise = 2.2, size = 1, life = 4,
}: {
  position?: [number, number, number];
  source?: React.MutableRefObject<THREE.Object3D | null>;
  count?: number; color?: string; rise?: number; size?: number; life?: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const parts = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      age: (i / count) * life,
      pos: new THREE.Vector3(),
      drift: new THREE.Vector3((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6),
      mat: new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0, roughness: 1, depthWrite: false }),
    })),
    [count, color, life],
  );
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.5, 1), []);
  const origin = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    if (source?.current) {
      source.current.getWorldPosition(origin.current);
      group.current.worldToLocal(origin.current);
    } else if (position) origin.current.set(...position);
    const meshes = group.current.children as THREE.Mesh[];
    parts.forEach((p, i) => {
      p.age += dt;
      if (p.age > life) { p.age = 0; p.pos.copy(origin.current); }
      if (p.age === 0 || p.pos.lengthSq() === 0) p.pos.copy(origin.current);
      const t = p.age / life;
      p.pos.y += rise * dt;
      p.pos.addScaledVector(p.drift, dt);
      const m = meshes[i];
      m.position.copy(p.pos);
      m.scale.setScalar(size * (0.6 + t * 2.8));
      p.mat.opacity = Math.sin(Math.PI * t) * 0.55;
    });
  });

  return (
    <group ref={group}>
      {parts.map((p, i) => <mesh key={i} geometry={geo} material={p.mat} />)}
    </group>
  );
}
