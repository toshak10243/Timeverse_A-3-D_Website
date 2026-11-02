'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Hyperspace tunnel shown during time travel. */
function Streaks({ count = 900 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const data = useMemo(
    () => Array.from({ length: count }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 1.2 + Math.random() * 7,
      z: -Math.random() * 120,
      s: 0.6 + Math.random() * 1.4,
    })),
    [count],
  );
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const c1 = new THREE.Color('#5ee7ff'), c2 = new THREE.Color('#ffb347'), c3 = new THREE.Color('#ffffff');
    for (let i = 0; i < count; i++) {
      const c = Math.random() > 0.8 ? c2 : Math.random() > 0.5 ? c1 : c3;
      arr.set([c.r * 1.4, c.g * 1.4, c.b * 1.4], i * 3);
    }
    return arr;
  }, [count]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const speed = useRef(10);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = clock.elapsedTime;
    speed.current = 30 + Math.min(t, 1.4) * 110;
    data.forEach((d, i) => {
      d.z += speed.current * dt * d.s;
      if (d.z > 6) d.z = -120;
      const twist = t * 0.6;
      o.position.set(Math.cos(d.a + twist) * d.r, Math.sin(d.a + twist) * d.r, d.z);
      o.scale.set(1, 1, 1 + speed.current * 0.06);
      o.updateMatrix();
      mesh.current.setMatrixAt(i, o.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.03, 0.03, 1]} />
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    g.current.children.forEach((c) => {
      c.position.z += dt * 60;
      if (c.position.z > 5) c.position.z -= 120;
    });
  });
  return (
    <group ref={g}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 10]}>
          <torusGeometry args={[8.5, 0.03, 8, 96]} />
          <meshBasicMaterial color="#5ee7ff" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function WarpCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
      <color attach="background" args={['#02030a']} />
      <fog attach="fog" args={['#02030a', 30, 120]} />
      <Streaks />
      <Rings />
    </Canvas>
  );
}
