'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { objectRegistry } from '@/lib/registry';
import { useEra } from './EraContext';
import { ModelSlot } from './ModelSlot';

type V3 = [number, number, number];

/**
 * Wrap any 3D object to make it clickable/discoverable.
 * The `id` must match an object id in lib/eras.ts.
 */
export function Interactive({
  id, children, position, rotation, scale = 1, markerY = 3,
}: { id: string; children: ReactNode; position?: V3; rotation?: V3; scale?: number; markerY?: number }) {
  const era = useEra();
  const obj = era.objects.find((o) => o.id === id);
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const [hover, setHover] = useState(false);
  const selected = useStore((s) => s.selected === id);
  const discovered = useStore((s) => !!s.discovered[`${era.id}:${id}`]);
  const select = useStore((s) => s.select);
  const tmp = useRef(new THREE.Vector3());
  useCursor(hover);

  useEffect(() => {
    objectRegistry.set(id, group.current);
    return () => { objectRegistry.delete(id); };
  }, [id]);

  useFrame((_, dt) => {
    tmp.current.setScalar(hover ? 1.035 : 1);
    inner.current.scale.lerp(tmp.current, 1 - Math.exp(-dt * 10));
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(true); };
  const out = () => setHover(false);
  const click = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); select(id); };

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <group ref={inner} onPointerOver={over} onPointerOut={out} onClick={click}>
        {obj?.modelUrl ? <ModelSlot url={obj.modelUrl} fit={obj.modelFit ?? 6} fallback={children} /> : children}
      </group>
      <Html position={[0, markerY, 0]} center zIndexRange={[20, 0]}>
        <button
          onClick={() => select(id)}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          className={`marker ${selected ? 'is-selected' : ''} ${discovered ? 'is-found' : ''} ${hover ? 'is-hover' : ''}`}
          aria-label={obj?.name}
        >
          <span className="marker-dot" />
          <span className="marker-label">{obj?.name}</span>
        </button>
      </Html>
    </group>
  );
}
