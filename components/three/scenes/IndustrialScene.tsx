'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { Smoke } from '../Smoke';
import { brickTexture } from '@/lib/textures';
import { rng } from '@/lib/registry';
import { useStore } from '@/lib/store';

const R = 26; // railway loop radius
const iron = <meshStandardMaterial color="#2a2a2c" metalness={0.8} roughness={0.45} />;
const brass = <meshStandardMaterial color="#c7953e" metalness={1} roughness={0.3} />;

function Track() {
  const sleepers = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.4, 0.15, 2.6);
    const mat = new THREE.MeshStandardMaterial({ color: '#3d2b1d', roughness: 1 });
    const n = 160;
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    const m = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      m.position.set(Math.cos(a) * R, 0.08, Math.sin(a) * R);
      m.rotation.y = -a;
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
    }
    mesh.receiveShadow = true;
    return mesh;
  }, []);
  return (
    <group>
      <primitive object={sleepers} />
      {[-0.75, 0.75].map((o) => (
        <mesh key={o} rotation-x={-Math.PI / 2} position={[0, 0.22, 0]}>
          <ringGeometry args={[R + o - 0.06, R + o + 0.06, 200]} />
          <meshStandardMaterial color="#9a9ca0" metalness={1} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* gravel bed */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[R - 2, R + 2, 200]} />
        <meshStandardMaterial color="#4a4440" roughness={1} />
      </mesh>
    </group>
  );
}

function Wheel({ r, x, z, spin }: { r: number; x: number; z: number; spin: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => { ref.current.rotation.z = -spin.current / r; });
  return (
    <group position={[x, r, z]}>
      <group ref={ref}>
        <mesh rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[r, r, 0.14, 24]} />
          <meshStandardMaterial color="#7a1c1c" metalness={0.5} roughness={0.5} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation-z={(i * Math.PI) / 3} position={[0, 0, z > 0 ? 0.08 : -0.08]}>
            <boxGeometry args={[r * 1.9, 0.07, 0.03]} />
            {brass}
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Locomotive({ spin, chimney }: { spin: React.MutableRefObject<number>; chimney: React.MutableRefObject<THREE.Object3D | null> }) {
  const body = <meshStandardMaterial color="#1d3b2a" metalness={0.6} roughness={0.35} />;
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow><boxGeometry args={[6.2, 0.35, 1.7]} />{iron}</mesh>
      {/* boiler */}
      <mesh position={[0.6, 1.95, 0]} rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.8, 0.8, 4.2, 24]} />{body}</mesh>
      {[-0.8, 0.6, 2].map((x) => (
        <mesh key={x} position={[x, 1.95, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.83, 0.83, 0.1, 24]} />{brass}</mesh>
      ))}
      <mesh position={[2.75, 1.95, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.85, 0.85, 0.3, 24]} />{iron}</mesh>
      {/* headlamp */}
      <mesh position={[2.95, 2.3, 0]}><sphereGeometry args={[0.18, 12, 10]} /><meshStandardMaterial color="#fff2c8" emissive="#ffcf6b" emissiveIntensity={4} /></mesh>
      {/* chimney */}
      <mesh position={[2.3, 3.1, 0]} castShadow><cylinderGeometry args={[0.24, 0.3, 1.5, 14]} />{iron}</mesh>
      <mesh position={[2.3, 3.9, 0]}><cylinderGeometry args={[0.42, 0.26, 0.4, 14]} />{iron}</mesh>
      <object3D ref={chimney} position={[2.3, 4.2, 0]} />
      {/* dome */}
      <mesh position={[0.4, 2.85, 0]}><sphereGeometry args={[0.38, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />{brass}</mesh>
      {/* cab */}
      <mesh position={[-2.1, 2.3, 0]} castShadow><boxGeometry args={[1.9, 2.3, 1.9]} />{body}</mesh>
      <mesh position={[-2.1, 3.55, 0]} castShadow><boxGeometry args={[2.2, 0.15, 2.2]} />{iron}</mesh>
      {[-0.96, 0.96].map((z) => (
        <mesh key={z} position={[-2.1, 2.7, z]}><planeGeometry args={[0.9, 0.7]} /><meshStandardMaterial color="#ffcf8a" emissive="#ff9f3a" emissiveIntensity={1.4} side={THREE.DoubleSide} /></mesh>
      ))}
      {/* wheels */}
      {[-0.86, 0.86].map((z) => (
        <group key={z}>
          <Wheel r={0.78} x={-0.9} z={z} spin={spin} />
          <Wheel r={0.78} x={0.8} z={z} spin={spin} />
          <Wheel r={0.42} x={2.4} z={z} spin={spin} />
          <Wheel r={0.42} x={-2.4} z={z} spin={spin} />
        </group>
      ))}
      {/* piston cylinders */}
      {[-0.95, 0.95].map((z) => (
        <mesh key={z} position={[2.2, 0.9, z]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.22, 0.22, 0.9, 12]} />{iron}</mesh>
      ))}
    </group>
  );
}

function Tender() {
  return (
    <group>
      <mesh position={[0, 1.6, 0]} castShadow><boxGeometry args={[3, 1.6, 1.8]} /><meshStandardMaterial color="#1d3b2a" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0, 2.45, 0]}><boxGeometry args={[2.7, 0.3, 1.5]} /><meshStandardMaterial color="#111" roughness={1} /></mesh>
      {[-1, 1].map((x) => [-0.86, 0.86].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.45, z]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.45, 0.45, 0.12, 16]} /><meshStandardMaterial color="#7a1c1c" /></mesh>
      )))}
    </group>
  );
}

function Carriage() {
  return (
    <group>
      <mesh position={[0, 1.9, 0]} castShadow><boxGeometry args={[4.2, 2.1, 1.9]} /><meshStandardMaterial color="#6b2a1f" roughness={0.7} /></mesh>
      <mesh position={[0, 3.05, 0]} rotation-x={Math.PI / 2} scale={[1, 1, 0.25]}><cylinderGeometry args={[1, 1, 4.3, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#2b2b2b" side={THREE.DoubleSide} /></mesh>
      {[-1.4, -0.45, 0.5, 1.45].map((x) => [-0.96, 0.96].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 2.15, z]}><planeGeometry args={[0.6, 0.6]} /><meshStandardMaterial color="#ffd79a" emissive="#ffae4a" emissiveIntensity={1.2} side={THREE.DoubleSide} /></mesh>
      )))}
      {[-1.4, 1.4].map((x) => [-0.86, 0.86].map((z) => (
        <mesh key={`w${x}${z}`} position={[x, 0.45, z]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.45, 0.45, 0.12, 16]} /><meshStandardMaterial color="#7a1c1c" /></mesh>
      )))}
    </group>
  );
}

/** The train runs around the loop and pauses when you inspect it. */
function Train() {
  const angle = useRef(0.6);
  const speed = useRef(0.09);
  const spin = useRef(0);
  const cars = [useRef<THREE.Group>(null!), useRef<THREE.Group>(null!), useRef<THREE.Group>(null!), useRef<THREE.Group>(null!)];
  const chimney = useRef<THREE.Object3D | null>(null);
  const gaps = [0, -0.19, -0.37, -0.57]; // angular spacing of cars

  useFrame((_, dt) => {
    const paused = useStore.getState().selected === 'locomotive';
    speed.current = THREE.MathUtils.lerp(speed.current, paused ? 0 : 0.09, 1 - Math.exp(-dt * 1.5));
    angle.current += speed.current * dt;
    spin.current += speed.current * dt * R;
    cars.forEach((c, i) => {
      const a = angle.current + gaps[i];
      c.current.position.set(Math.cos(a) * R, 0.25, Math.sin(a) * R);
      c.current.rotation.y = -a - Math.PI / 2;
    });
  });

  return (
    <>
      <group ref={cars[0]}>
        <Interactive id="locomotive" markerY={5.2}>
          <Locomotive spin={spin} chimney={chimney} />
        </Interactive>
      </group>
      <group ref={cars[1]}><Tender /></group>
      <group ref={cars[2]}><Carriage /></group>
      <group ref={cars[3]}><Carriage /></group>
      <Smoke source={chimney} count={26} color="#d6d0c6" rise={2.6} size={0.9} life={3.2} />
    </>
  );
}

function Factory() {
  const brick = useMemo(() => brickTexture({ base: '#8a3b26', mortar: '#4a2a1e', rows: 28, cols: 14, repeat: [3, 1], seed: 9 }), []);
  const chimneyTex = useMemo(() => brickTexture({ base: '#7a3322', mortar: '#3e2219', rows: 40, cols: 8, repeat: [1, 3], seed: 2 }), []);
  return (
    <group>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 8, 11]} />
        <meshStandardMaterial map={brick} roughness={1} />
      </mesh>
      {/* saw-tooth roof */}
      {[-7.2, -3.6, 0, 3.6, 7.2].map((x) => (
        <mesh key={x} position={[x, 9.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[2.1, 2.1, 11, 3]} />
          <meshStandardMaterial color="#3a3836" roughness={0.9} flatShading />
        </mesh>
      ))}
      {/* windows */}
      {Array.from({ length: 7 }).map((_, i) =>
        [2.3, 5.4].map((y) => (
          <mesh key={`${i}${y}`} position={[-7.2 + i * 2.4, y, 5.51]}>
            <planeGeometry args={[1.3, 1.9]} />
            <meshStandardMaterial color="#ffd08a" emissive="#ff9b3d" emissiveIntensity={1.8} />
          </mesh>
        )),
      )}
      <mesh position={[0, 1.6, 5.52]}><planeGeometry args={[2.6, 3.2]} /><meshStandardMaterial color="#2a1a12" /></mesh>
      {/* chimneys */}
      {[-6, 6].map((x) => (
        <group key={x} position={[x, 0, -3.5]}>
          <mesh position={[0, 10, 0]} castShadow><cylinderGeometry args={[0.8, 1.15, 20, 18]} /><meshStandardMaterial map={chimneyTex} roughness={1} /></mesh>
          <mesh position={[0, 20.1, 0]}><cylinderGeometry args={[1, 0.85, 0.6, 18]} /><meshStandardMaterial color="#2d2b29" /></mesh>
          <Smoke position={[0, 20.6, 0]} count={30} color="#59544e" rise={2} size={1.6} life={6} />
        </group>
      ))}
    </group>
  );
}

function BeamEngine() {
  const fly = useRef<THREE.Group>(null!);
  const beam = useRef<THREE.Group>(null!);
  const g1 = useRef<THREE.Mesh>(null!);
  const g2 = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 1.4;
    fly.current.rotation.z = -t;
    beam.current.rotation.z = Math.sin(t) * 0.18;
    g1.current.rotation.z = t * 1.5;
    g2.current.rotation.z = -t * 1.5 + 0.3;
  });
  const gearGeo = useMemo(() => {
    const s = new THREE.Shape();
    const teeth = 12, r1 = 0.7, r2 = 0.88;
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 ? r1 : r2;
      const a2 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
      if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      s.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
    }
    return new THREE.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: false });
  }, []);
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow><boxGeometry args={[6, 0.8, 2.6]} /><meshStandardMaterial color="#5c5853" roughness={1} /></mesh>
      {/* flywheel */}
      <group position={[2, 3.1, 0]}>
        <group ref={fly}>
          <mesh castShadow><torusGeometry args={[2.1, 0.18, 12, 40]} />{iron}</mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation-z={(i * Math.PI) / 4}><boxGeometry args={[4.2, 0.14, 0.14]} />{iron}</mesh>
          ))}
          <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />{brass}</mesh>
        </group>
      </group>
      {/* pillar & rocking beam */}
      <mesh position={[-0.6, 3, -0.8]} castShadow><boxGeometry args={[0.5, 4.6, 0.5]} />{iron}</mesh>
      <group ref={beam} position={[-0.6, 5.3, -0.8]}>
        <mesh castShadow><boxGeometry args={[5.4, 0.35, 0.3]} />{iron}</mesh>
        <mesh position={[0, 0, 0.2]}><sphereGeometry args={[0.2, 12, 8]} />{brass}</mesh>
      </group>
      {/* steam cylinder */}
      <mesh position={[-2.8, 2, -0.8]} castShadow><cylinderGeometry args={[0.6, 0.6, 2.4, 18]} /><meshStandardMaterial color="#4a5a3a" metalness={0.5} roughness={0.5} /></mesh>
      <mesh position={[-2.8, 3.4, -0.8]}><cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />{brass}</mesh>
      {/* gears */}
      <mesh ref={g1} geometry={gearGeo} position={[-1.2, 1.8, 0.9]}><meshStandardMaterial color="#b0782f" metalness={0.9} roughness={0.35} /></mesh>
      <mesh ref={g2} geometry={gearGeo} position={[0.4, 1.8, 0.9]}><meshStandardMaterial color="#8c8c8c" metalness={0.9} roughness={0.35} /></mesh>
      <Smoke position={[-2.8, 3.4, -0.8]} count={10} color="#ffffff" rise={1.2} size={0.4} life={2} />
    </group>
  );
}

function Skyline() {
  const items = useMemo(() => {
    const r = rng(21);
    return Array.from({ length: 34 }, () => {
      const a = r() * Math.PI * 2, d = 48 + r() * 50;
      return { p: [Math.cos(a) * d, 0, Math.sin(a) * d] as [number, number, number], w: 4 + r() * 8, h: 3 + r() * 8, chimney: r() > 0.5, ch: 8 + r() * 10 };
    });
  }, []);
  return (
    <>
      {items.map((b, i) => (
        <group key={i} position={b.p} rotation-y={Math.atan2(b.p[0], b.p[2])}>
          <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow><boxGeometry args={[b.w, b.h, 5]} /><meshStandardMaterial color="#4b3a33" roughness={1} /></mesh>
          {b.chimney && <mesh position={[b.w / 3, b.ch / 2, 0]}><cylinderGeometry args={[0.4, 0.6, b.ch, 10]} /><meshStandardMaterial color="#3d2c26" /></mesh>}
        </group>
      ))}
    </>
  );
}

function GasLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.06, 0.09, 3.2, 8]} />{iron}</mesh>
      <mesh position={[0, 3.35, 0]}><boxGeometry args={[0.35, 0.45, 0.35]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb24a" emissiveIntensity={3} /></mesh>
      <pointLight position={[0, 3.3, 0]} color="#ffb766" intensity={5} distance={10} decay={2} />
    </group>
  );
}

export default function IndustrialScene() {
  const cobble = useMemo(() => brickTexture({ base: '#4d4843', mortar: '#2d2a27', rows: 60, cols: 40, variance: 14, repeat: [12, 12], seed: 4 }), []);
  return (
    <>
      <color attach="background" args={['#6e6258']} />
      <fog attach="fog" args={['#6e6258', 35, 150]} />
      <hemisphereLight args={['#d9c3a5', '#2a2420', 0.6]} />
      <directionalLight
        castShadow
        position={[30, 30, 25]}
        intensity={1.8}
        color="#ffcf9a"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0004}
      />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial map={cobble} roughness={1} />
      </mesh>

      <Track />
      <Train />

      <Interactive id="factory" position={[0, 0, -4]} markerY={12}>
        <Factory />
      </Interactive>

      <Interactive id="engine" position={[-6, 0, 10]} rotation={[0, 0.35, 0]} markerY={7}>
        <BeamEngine />
      </Interactive>

      <GasLamp position={[5, 0, 11]} />
      <GasLamp position={[-12, 0, 6]} />
      <GasLamp position={[12, 0, 4]} />
      <Skyline />
      <Sparkles count={120} scale={[80, 20, 80]} position={[0, 8, 0]} size={2} speed={0.2} color="#ffb070" opacity={0.4} />
    </>
  );
}
