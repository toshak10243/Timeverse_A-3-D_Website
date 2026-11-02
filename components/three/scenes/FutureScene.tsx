'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Sparkles, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { windowTexture } from '@/lib/textures';
import { rng } from '@/lib/registry';
import { useStore } from '@/lib/store';

const CYAN = '#5ee7ff';
const MAGENTA = '#ff4fd8';

function Buildings() {
  const items = useMemo(() => {
    const r = rng(77);
    const out: { p: [number, number, number]; w: number; d: number; h: number; tint: string; seed: number; round: boolean }[] = [];
    while (out.length < 70) {
      const a = r() * Math.PI * 2, dist = 26 + r() * 80;
      const x = Math.cos(a) * dist, z = Math.sin(a) * dist;
      if (z > 10 && Math.abs(x) < 20) continue; // keep camera view clear
      out.push({
        p: [x, 0, z],
        w: 3 + r() * 6,
        d: 3 + r() * 6,
        h: 10 + r() * (dist > 60 ? 55 : 30),
        tint: r() > 0.7 ? MAGENTA : CYAN,
        seed: Math.floor(r() * 9) + 1,
        round: r() > 0.75,
      });
    }
    return out;
  }, []);
  return (
    <>
      {items.map((b, i) => {
        const tex = windowTexture(b.seed, b.tint === MAGENTA ? '#ff9be9' : '#8ff0ff');
        return (
          <group key={i} position={b.p}>
            <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
              {b.round ? <cylinderGeometry args={[b.w / 2, b.w / 2, b.h, 20]} /> : <boxGeometry args={[b.w, b.h, b.d]} />}
              <meshStandardMaterial color="#0d1020" metalness={0.8} roughness={0.25} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={1.4} />
            </mesh>
            {/* glowing roof edge */}
            <mesh position={[0, b.h + 0.1, 0]}>
              {b.round ? <cylinderGeometry args={[b.w / 2 + 0.1, b.w / 2 + 0.1, 0.2, 20]} /> : <boxGeometry args={[b.w + 0.2, 0.2, b.d + 0.2]} />}
              <meshStandardMaterial color={b.tint} emissive={b.tint} emissiveIntensity={3} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function AetherTower() {
  const rings = useRef<THREE.Group>(null!);
  const beacon = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(({ clock }, dt) => {
    rings.current.children.forEach((c, i) => { c.rotation.y += dt * (0.25 + i * 0.12) * (i % 2 ? -1 : 1); });
    beacon.current.emissiveIntensity = 3 + Math.sin(clock.elapsedTime * 3) * 2;
  });
  const floors = 26;
  return (
    <group>
      <mesh position={[0, 0.5, 0]} receiveShadow><cylinderGeometry args={[9, 10, 1, 48]} /><meshStandardMaterial color="#141832" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 1.02, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[8.4, 8.8, 64]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3} toneMapped={false} /></mesh>
      {Array.from({ length: floors }).map((_, i) => {
        const t = i / floors;
        const s = 6 - t * 3.4;
        return (
          <mesh key={i} position={[0, 1 + i * 1.25 + 0.6, 0]} rotation-y={i * 0.09} castShadow>
            <boxGeometry args={[s, 1.15, s]} />
            <meshStandardMaterial color={i % 4 === 0 ? '#9fe9ff' : '#1a2140'} metalness={0.9} roughness={0.12} emissive={i % 4 === 0 ? CYAN : '#000000'} emissiveIntensity={i % 4 === 0 ? 1.4 : 0} />
          </mesh>
        );
      })}
      <mesh position={[0, 1 + floors * 1.25 + 2.5, 0]}><cylinderGeometry args={[0.05, 0.25, 5, 8]} /><meshStandardMaterial color="#cfd8ff" metalness={1} roughness={0.2} /></mesh>
      <mesh position={[0, 1 + floors * 1.25 + 5.2, 0]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial ref={beacon} color="#ffffff" emissive={MAGENTA} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <group ref={rings}>
        {[10, 18, 27].map((y, i) => (
          <mesh key={y} position={[0, y, 0]} rotation-x={Math.PI / 2 + (i - 1) * 0.12}>
            <torusGeometry args={[6.5 - i * 1.2, 0.09, 8, 80]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={4} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SkyCarBody({ color = CYAN }: { color?: string }) {
  return (
    <group>
      <mesh scale={[2.2, 0.55, 0.95]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#e9eef7" metalness={0.7} roughness={0.2} /></mesh>
      <mesh position={[0.4, 0.35, 0]} scale={[1.1, 0.45, 0.7]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color="#0b1a2e" metalness={1} roughness={0.05} /></mesh>
      {[-1, 1].map((z) => (
        <group key={z} position={[-0.6, -0.1, z * 1.15]}>
          <mesh rotation-x={Math.PI / 2}><torusGeometry args={[0.45, 0.08, 8, 24]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} /></mesh>
        </group>
      ))}
      <mesh position={[-2.15, 0, 0]}><boxGeometry args={[0.1, 0.18, 1.2]} /><meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={4} toneMapped={false} /></mesh>
    </group>
  );
}

/** The selectable sky car — orbits the tower and pauses when inspected. */
function HeroSkyCar() {
  const ref = useRef<THREE.Group>(null!);
  const a = useRef(0);
  const sp = useRef(0.22);
  useFrame(({ clock }, dt) => {
    const paused = useStore.getState().selected === 'skycar';
    sp.current = THREE.MathUtils.lerp(sp.current, paused ? 0 : 0.22, 1 - Math.exp(-dt * 2));
    a.current += sp.current * dt;
    const r = 16;
    ref.current.position.set(Math.cos(a.current) * r, 9 + Math.sin(clock.elapsedTime * 0.8) * 0.5, Math.sin(a.current) * r);
    ref.current.rotation.y = -a.current - Math.PI / 2;
  });
  return (
    <group ref={ref}>
      <Interactive id="skycar" markerY={2}>
        <SkyCarBody />
      </Interactive>
    </group>
  );
}

function Traffic() {
  const lanes = useMemo(() => {
    const r = rng(9);
    return Array.from({ length: 16 }, () => ({ r: 24 + r() * 40, y: 12 + r() * 30, sp: (0.05 + r() * 0.12) * (r() > 0.5 ? 1 : -1), off: r() * Math.PI * 2, c: r() > 0.5 ? CYAN : MAGENTA }));
  }, []);
  const refs = useRef<THREE.Group[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    lanes.forEach((l, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = l.off + t * l.sp;
      g.position.set(Math.cos(a) * l.r, l.y, Math.sin(a) * l.r);
      g.rotation.y = -a - (l.sp > 0 ? Math.PI / 2 : -Math.PI / 2);
    });
  });
  return (
    <>
      {lanes.map((l, i) => (
        <group key={i} ref={(el) => { if (el) refs.current[i] = el; }} scale={0.55}>
          <SkyCarBody color={l.c} />
        </group>
      ))}
    </>
  );
}

function Robot() {
  const head = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { head.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.6; });
  const shell = <meshStandardMaterial color="#eef2f8" metalness={0.4} roughness={0.25} />;
  const joint = <meshStandardMaterial color="#1b2238" metalness={0.9} roughness={0.3} />;
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.4}>
      <group position={[0, 0.3, 0]}>
        <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[0.6, 0.75, 40]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={4} toneMapped={false} side={THREE.DoubleSide} /></mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.6, 0]} castShadow><capsuleGeometry args={[0.11, 0.65, 6, 12]} />{shell}</mesh>
        ))}
        <mesh position={[0, 1.15, 0]}><sphereGeometry args={[0.18, 16, 12]} />{joint}</mesh>
        <mesh position={[0, 1.65, 0]} castShadow scale={[1, 1.15, 0.8]}><sphereGeometry args={[0.42, 24, 16]} />{shell}</mesh>
        <mesh position={[0, 1.7, 0.33]}><circleGeometry args={[0.12, 24]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={5} toneMapped={false} /></mesh>
        {[-0.55, 0.55].map((x) => (
          <group key={x} position={[x, 1.85, 0]} rotation-z={x > 0 ? -0.2 : 0.2}>
            <mesh position={[0, -0.4, 0]} castShadow><capsuleGeometry args={[0.09, 0.6, 6, 12]} />{shell}</mesh>
          </group>
        ))}
        <group ref={head} position={[0, 2.35, 0]}>
          <mesh castShadow scale={[1, 0.85, 0.95]}><sphereGeometry args={[0.3, 24, 16]} />{shell}</mesh>
          <mesh position={[0, 0.02, 0.2]} scale={[1, 0.35, 0.5]}><sphereGeometry args={[0.24, 20, 12]} /><meshStandardMaterial color="#05101e" emissive={CYAN} emissiveIntensity={1.6} metalness={1} roughness={0.1} /></mesh>
          <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />{joint}</mesh>
          <mesh position={[0, 0.46, 0]}><sphereGeometry args={[0.04, 10, 8]} /><meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={5} toneMapped={false} /></mesh>
        </group>
      </group>
    </Float>
  );
}

export default function FutureScene() {
  return (
    <>
      <color attach="background" args={['#04050d']} />
      <fog attach="fog" args={['#070a1c', 40, 210]} />
      <Stars radius={260} depth={60} count={4000} factor={5} fade speed={0.6} />
      <hemisphereLight args={['#4a5cff', '#05060f', 0.5]} />
      <ambientLight intensity={0.2} />
      <directionalLight castShadow position={[-30, 50, 20]} intensity={1.2} color="#b9c6ff" shadow-mapSize={[2048, 2048]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
      <pointLight position={[0, 20, 0]} color={CYAN} intensity={60} distance={60} decay={2} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#05060e" metalness={0.9} roughness={0.35} />
      </mesh>
      <Grid
        position={[0, 0.02, 0]}
        infiniteGrid
        cellSize={2}
        sectionSize={10}
        cellColor="#1b3a66"
        sectionColor={CYAN}
        sectionThickness={1}
        cellThickness={0.6}
        fadeDistance={160}
        fadeStrength={1.5}
      />

      <Interactive id="tower" markerY={42}>
        <AetherTower />
      </Interactive>
      <HeroSkyCar />
      <Traffic />

      <Interactive id="robot" position={[12, 0, 14]} rotation={[0, -0.6, 0]} markerY={3.4}>
        <Robot />
      </Interactive>

      <Buildings />
      <Sparkles count={200} scale={[100, 40, 100]} position={[0, 20, 0]} size={2.5} speed={0.4} color={CYAN} opacity={0.6} />
    </>
  );
}
