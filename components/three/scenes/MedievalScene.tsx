'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { GradientSky } from '../GradientSky';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { brickTexture } from '@/lib/textures';
import { rng } from '@/lib/registry';

function useStone(repeat: [number, number] = [2, 1]) {
  return useMemo(() => brickTexture({ base: '#8f8a80', mortar: '#5e5a53', rows: 14, cols: 6, variance: 16, repeat, seed: 3 }), [repeat]);
}

function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(500, 500, 160, 160);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const d = Math.hypot(x, y);
      const hills = Math.sin(x * 0.03) * Math.cos(y * 0.035) * 3 + Math.sin(x * 0.09 + y * 0.05);
      // river valley along z ≈ +34  (plane y maps to -z)
      const river = Math.exp(-Math.pow((-y - 34) / 5, 2)) * -2.2;
      const blend = THREE.MathUtils.smoothstep(d, 26, 70);
      p.setZ(i, hills * blend + river + (d > 160 ? (d - 160) * 0.12 : 0));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} receiveShadow>
      <meshStandardMaterial color="#5d7a38" roughness={1} />
    </mesh>
  );
}

function Crenels({ length, y, z = 0, depth = 1.2, step = 1.3 }: { length: number; y: number; z?: number; depth?: number; step?: number }) {
  const n = Math.floor(length / step);
  const tex = useStone([0.3, 0.3]);
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + step / 2 + i * step, y, z]} castShadow>
          <boxGeometry args={[step * 0.55, 0.8, depth]} />
          <meshStandardMaterial map={tex} roughness={1} />
        </mesh>
      ))}
    </>
  );
}

function Wall({ length, h = 5 }: { length: number; h?: number }) {
  const tex = useStone([length / 6, h / 5]);
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, h, 1.4]} />
        <meshStandardMaterial map={tex} roughness={1} />
      </mesh>
      <Crenels length={length} y={h + 0.4} z={0.4} depth={0.5} />
    </group>
  );
}

function Tower({ r = 2.3, h = 9, roof = '#7b2d2d' }: { r?: number; h?: number; roof?: string }) {
  const tex = useStone([3, 2]);
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 1.08, h, 20]} />
        <meshStandardMaterial map={tex} roughness={1} />
      </mesh>
      <mesh position={[0, h + 0.15, 0]} castShadow>
        <cylinderGeometry args={[r + 0.3, r + 0.3, 0.3, 20]} />
        <meshStandardMaterial color="#77736b" roughness={1} />
      </mesh>
      <mesh position={[0, h + 2.4, 0]} castShadow>
        <coneGeometry args={[r + 0.5, 4.2, 20]} />
        <meshStandardMaterial color={roof} roughness={0.8} />
      </mesh>
      {/* arrow slit */}
      <mesh position={[0, h * 0.6, r + 0.01]}>
        <planeGeometry args={[0.25, 1.2]} />
        <meshStandardMaterial color="#121212" />
      </mesh>
    </group>
  );
}

function Banner({ position, color = '#a32424' }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const geo = useMemo(() => new THREE.PlaneGeometry(1.8, 1, 12, 4).translate(0.9, 0, 0), []);
  const base = useMemo(() => geo.attributes.position.array.slice(), [geo]);
  useFrame(({ clock }) => {
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3];
      p.setZ(i, Math.sin(x * 3 - clock.elapsedTime * 4) * 0.18 * x);
    }
    p.needsUpdate = true;
  });
  return (
    <group position={position}>
      <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.05, 0.05, 3, 6]} /><meshStandardMaterial color="#3b2b1b" /></mesh>
      <mesh ref={ref} geometry={geo} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Castle() {
  const S = 22; // courtyard size
  const keepTex = useStone([3, 3]);
  return (
    <group>
      {/* mound */}
      <mesh position={[0, 0.6, 0]} receiveShadow>
        <cylinderGeometry args={[19, 22, 1.2, 40]} />
        <meshStandardMaterial color="#6b6a4a" roughness={1} />
      </mesh>
      <group position={[0, 1.2, 0]}>
        {/* walls */}
        <group position={[0, 0, -S / 2]}><Wall length={S} /></group>
        <group position={[-S / 2, 0, 0]} rotation-y={Math.PI / 2}><Wall length={S} /></group>
        <group position={[S / 2, 0, 0]} rotation-y={-Math.PI / 2}><Wall length={S} /></group>
        {/* front wall with gate */}
        <group position={[-S / 4 - 1.5, 0, S / 2]} rotation-y={Math.PI}><Wall length={S / 2 - 3} /></group>
        <group position={[S / 4 + 1.5, 0, S / 2]} rotation-y={Math.PI}><Wall length={S / 2 - 3} /></group>
        {/* gatehouse */}
        <group position={[0, 0, S / 2]}>
          {[-2.4, 2.4].map((x) => (
            <group key={x} position={[x, 0, 0]}><Tower r={1.6} h={7.5} roof="#3d4f7a" /></group>
          ))}
          <mesh position={[0, 5.6, 0]} castShadow>
            <boxGeometry args={[3.4, 2.2, 1.8]} />
            <meshStandardMaterial map={keepTex} roughness={1} />
          </mesh>
          <mesh position={[0, 2.2, 0.75]}>
            <boxGeometry args={[3, 4.4, 0.4]} />
            <meshStandardMaterial color="#1a120c" />
          </mesh>
          {/* drawbridge */}
          <mesh position={[0, 0.05, 3.2]} rotation-x={-0.12} castShadow receiveShadow>
            <boxGeometry args={[3, 0.25, 6]} />
            <meshStandardMaterial color="#5a3b22" roughness={1} />
          </mesh>
        </group>
        {/* corner towers */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => (
          <group key={`${x}${z}`} position={[(x * S) / 2, 0, (z * S) / 2]}><Tower /></group>
        ))}
        {/* keep */}
        <group position={[0, 0, -2]}>
          <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[8, 13, 8]} />
            <meshStandardMaterial map={keepTex} roughness={1} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r) => (
            <group key={r} rotation-y={r}><Crenels length={8} y={13.4} z={3.7} depth={0.6} step={1.15} /></group>
          ))}
          <group position={[2.6, 13, 2.6]}><Tower r={1.2} h={4} roof="#7b2d2d" /></group>
          {/* glowing windows */}
          {[[-2, 9], [2, 9], [0, 5]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 4.01]}>
              <planeGeometry args={[0.7, 1.3]} />
              <meshStandardMaterial color="#ffb456" emissive="#ff9a2e" emissiveIntensity={2.2} />
            </mesh>
          ))}
          <Banner position={[-3.4, 15.6, 3.4]} />
          <Banner position={[3.4, 21.2, 3.4]} color="#2c4a8a" />
        </group>
      </group>
    </group>
  );
}

function House({ position, rot = 0, s = 1 }: { position: [number, number, number]; rot?: number; s?: number }) {
  return (
    <group position={position} rotation-y={rot} scale={s}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 2.4, 2.6]} />
        <meshStandardMaterial color="#d9c9a3" roughness={1} />
      </mesh>
      {/* timber beams */}
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.2, 1.31]}><boxGeometry args={[0.15, 2.4, 0.02]} /><meshStandardMaterial color="#4a3020" /></mesh>
      ))}
      <mesh position={[0, 3.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.75, 1.75, 3.7, 3]} />
        <meshStandardMaterial color="#7a5a2e" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.6, 0.6, 1.31]}><planeGeometry args={[0.5, 0.5]} /><meshStandardMaterial color="#ffb456" emissive="#ff9a2e" emissiveIntensity={1.6} /></mesh>
    </group>
  );
}

function Trees() {
  const items = useMemo(() => {
    const r = rng(5);
    const out: { p: [number, number, number]; s: number }[] = [];
    while (out.length < 70) {
      const a = r() * Math.PI * 2, d = 32 + r() * 75;
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (Math.abs(z - 34) < 6) continue; // keep river clear
      out.push({ p: [x, 0, z], s: 0.7 + r() * 0.9 });
    }
    return out;
  }, []);
  return (
    <>
      {items.map((t, i) => (
        <group key={i} position={t.p} scale={t.s}>
          <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.2, 0.3, 2.4, 6]} /><meshStandardMaterial color="#4d3522" /></mesh>
          <mesh position={[0, 3.4, 0]} castShadow><icosahedronGeometry args={[1.8, 0]} /><meshStandardMaterial color={i % 3 ? '#3e5b26' : '#4f6e2b'} flatShading roughness={1} /></mesh>
        </group>
      ))}
    </>
  );
}

function Knight() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.position.y = Math.sin(clock.elapsedTime * 1.6) * 0.02; });
  const mail = <meshStandardMaterial color="#8a8f96" metalness={0.85} roughness={0.45} />;
  return (
    <group ref={ref}>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]} castShadow><boxGeometry args={[0.22, 0.9, 0.24]} />{mail}</mesh>
      ))}
      <mesh position={[0, 1.25, 0]} castShadow><cylinderGeometry args={[0.32, 0.4, 0.95, 10]} /><meshStandardMaterial color="#efe9da" roughness={0.9} /></mesh>
      {/* red cross */}
      <mesh position={[0, 1.3, 0.37]}><boxGeometry args={[0.1, 0.6, 0.02]} /><meshStandardMaterial color="#a32424" /></mesh>
      <mesh position={[0, 1.4, 0.37]}><boxGeometry args={[0.4, 0.1, 0.02]} /><meshStandardMaterial color="#a32424" /></mesh>
      {/* arms */}
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]} castShadow><boxGeometry args={[0.18, 0.75, 0.2]} />{mail}</mesh>
      ))}
      {/* great helm */}
      <mesh position={[0, 1.98, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.45, 12]} /><meshStandardMaterial color="#a8adb4" metalness={0.9} roughness={0.3} /></mesh>
      <mesh position={[0, 2.02, 0.19]}><boxGeometry args={[0.3, 0.04, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
      {/* shield */}
      <group position={[-0.62, 1.25, 0.15]} rotation-y={-0.3}>
        <mesh castShadow><boxGeometry args={[0.08, 0.85, 0.6]} /><meshStandardMaterial color="#efe9da" /></mesh>
        <mesh position={[-0.05, 0, 0]}><boxGeometry args={[0.02, 0.7, 0.12]} /><meshStandardMaterial color="#a32424" /></mesh>
        <mesh position={[-0.05, 0.1, 0]}><boxGeometry args={[0.02, 0.12, 0.45]} /><meshStandardMaterial color="#a32424" /></mesh>
      </group>
      {/* sword */}
      <group position={[0.58, 0.95, 0.12]} rotation-x={0.2}>
        <mesh position={[0, -0.35, 0]}><boxGeometry args={[0.05, 0.9, 0.02]} /><meshStandardMaterial color="#d8dde3" metalness={1} roughness={0.15} /></mesh>
        <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.3, 0.04, 0.05]} /><meshStandardMaterial color="#8a6b2a" metalness={0.7} /></mesh>
      </group>
      {/* cape */}
      <mesh position={[0, 1.15, -0.36]} rotation-x={0.08}><planeGeometry args={[0.8, 1.5]} /><meshStandardMaterial color="#7a1d1d" side={THREE.DoubleSide} /></mesh>
    </group>
  );
}

function Cart() {
  const wood = <meshStandardMaterial color="#6b4628" roughness={1} />;
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow><boxGeometry args={[2.6, 0.12, 1.4]} />{wood}</mesh>
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} position={[0, 1.2, z]} castShadow><boxGeometry args={[2.6, 0.4, 0.08]} />{wood}</mesh>
      ))}
      {[-0.82, 0.82].map((z) => (
        <group key={z} position={[0, 0.6, z]} rotation-x={Math.PI / 2}>
          <mesh castShadow><torusGeometry args={[0.55, 0.07, 8, 20]} />{wood}</mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation-y={(i * Math.PI) / 4}><boxGeometry args={[1.05, 0.06, 0.06]} />{wood}</mesh>
          ))}
        </group>
      ))}
      {[-0.4, 0.4].map((z) => (
        <mesh key={z} position={[2.1, 0.85, z]} rotation-z={0.12}><boxGeometry args={[2, 0.08, 0.08]} />{wood}</mesh>
      ))}
      {/* cargo */}
      <mesh position={[-0.6, 1.4, 0]} castShadow><cylinderGeometry args={[0.35, 0.35, 0.8, 12]} /><meshStandardMaterial color="#7d5530" /></mesh>
      <mesh position={[0.4, 1.3, -0.2]} scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.42, 10, 8]} /><meshStandardMaterial color="#c9b58a" roughness={1} /></mesh>
      <mesh position={[0.6, 1.3, 0.3]} scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.38, 10, 8]} /><meshStandardMaterial color="#bfa97b" roughness={1} /></mesh>
    </group>
  );
}

function Torch({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    light.current.intensity = 6 + Math.sin(t * 13) * 1.2 + Math.sin(t * 7.3) * 0.8;
  });
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.06, 0.08, 2, 6]} /><meshStandardMaterial color="#3b2b1b" /></mesh>
      <mesh position={[0, 2.15, 0]}><sphereGeometry args={[0.16, 10, 8]} /><meshStandardMaterial color="#ffb347" emissive="#ff7a1a" emissiveIntensity={4} /></mesh>
      <pointLight ref={light} position={[0, 2.3, 0]} color="#ff9a3c" distance={12} decay={2} />
    </group>
  );
}

export default function MedievalScene() {
  return (
    <>
      <fog attach="fog" args={['#c7a786', 50, 240]} />
      <GradientSky top="#3d5f8f" horizon="#f2b97e" bottom="#c7a786" sun="#ffd9a0" sunDir={[-0.85, 0.12, -0.45]} sunSize={0.997} />
      <hemisphereLight args={['#ffdcb0', '#3c4a2a', 0.55]} />
      <directionalLight
        castShadow
        position={[-50, 35, -20]}
        intensity={2.3}
        color="#ffbf80"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0004}
      />

      <Ground />
      {/* river */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.9, 34]}>
        <planeGeometry args={[500, 9]} />
        <meshStandardMaterial color="#2e5a6e" metalness={0.5} roughness={0.12} />
      </mesh>

      <Interactive id="castle" markerY={25}>
        <Castle />
      </Interactive>

      <Interactive id="knight" position={[4.5, 1.2, 18]} rotation={[0, -0.4, 0]} markerY={2.8}>
        <Knight />
      </Interactive>

      <Interactive id="cart" position={[-6, 0, 24]} rotation={[0, 0.5, 0]} markerY={2.4}>
        <Cart />
      </Interactive>

      <Torch position={[-2.4, 1.2, 17.5]} />
      <Torch position={[2.4, 1.2, 17.5]} />

      {[[28, 8, 0.3], [32, 18, -0.4], [24, 22, 0.9], [-28, 10, -0.2], [-33, 20, 0.5], [-24, 25, -0.8], [36, -8, 1.2], [-36, -6, -1.1]].map(([x, z, r], i) => (
        <House key={i} position={[x, 0, z]} rot={r} s={i % 2 ? 1.1 : 0.9} />
      ))}
      <Trees />
      <Sparkles count={60} scale={[60, 8, 60]} position={[0, 3, 10]} size={3} speed={0.3} color="#ffd38a" opacity={0.6} />
    </>
  );
}
