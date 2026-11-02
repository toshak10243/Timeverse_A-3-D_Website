'use client';
import { useMemo } from 'react';
import { Sparkles } from '@react-three/drei';
import { GradientSky } from '../GradientSky';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { brickTexture, glyphTexture } from '@/lib/textures';
import { rng } from '@/lib/registry';

const sandstone = '#e3c48f';
const limestone = '#cfa66b';

function Desert() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(500, 500, 200, 200);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const d = Math.hypot(x, y);
      const dunes = Math.sin(x * 0.045) * Math.cos(y * 0.038) * 2.2 + Math.sin(x * 0.12 + y * 0.07) * 0.7;
      const blend = THREE.MathUtils.smoothstep(d, 45, 90);
      p.setZ(i, dunes * blend + (d > 140 ? (d - 140) * 0.05 : 0));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} receiveShadow>
      <meshStandardMaterial color="#dcb57a" roughness={1} />
    </mesh>
  );
}

function Pyramid({ base, height, cap = false }: { base: number; height: number; cap?: boolean }) {
  const tex = useMemo(() => brickTexture({ base: sandstone, mortar: '#b8925e', rows: 40, cols: 10, repeat: [4, 1] }), []);
  const r = base / Math.SQRT2;
  const capH = height * 0.07;
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[r, height, 4, 1]} />
        <meshStandardMaterial map={tex} roughness={0.95} flatShading />
      </mesh>
      {cap && (
        <mesh position={[0, height - capH / 2 + 0.02, 0]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[r * 0.07 + 0.05, capH, 4, 1]} />
          <meshStandardMaterial color="#ffd27a" metalness={1} roughness={0.25} emissive="#a86b12" emissiveIntensity={0.4} flatShading />
        </mesh>
      )}
    </group>
  );
}

function Sphinx() {
  const m = <meshStandardMaterial color={limestone} roughness={1} flatShading />;
  return (
    <group>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow><boxGeometry args={[10, 0.6, 4.2]} />{m}</mesh>
      {/* body & haunches */}
      <mesh position={[-0.8, 1.7, 0]} castShadow><boxGeometry args={[5.4, 2.2, 2.5]} />{m}</mesh>
      <mesh position={[-3.4, 1.9, 0]} castShadow><boxGeometry args={[2.2, 2.6, 2.9]} />{m}</mesh>
      {/* front paws */}
      {[-0.85, 0.85].map((z) => (
        <mesh key={z} position={[3.4, 0.95, z]} castShadow><boxGeometry args={[3.4, 0.7, 0.8]} />{m}</mesh>
      ))}
      {/* chest */}
      <mesh position={[1.9, 2.4, 0]} castShadow><boxGeometry args={[1.6, 2.8, 2.2]} />{m}</mesh>
      {/* nemes headdress */}
      <mesh position={[2.1, 4.1, 0]} rotation-y={Math.PI / 4} scale={[1, 1, 1]} castShadow>
        <cylinderGeometry args={[0.65, 1.15, 2.1, 4]} />
        <meshStandardMaterial color="#c49a5e" roughness={1} flatShading />
      </mesh>
      {/* face */}
      <mesh position={[2.65, 4.2, 0]} castShadow><boxGeometry args={[0.9, 1.3, 0.95]} />{m}</mesh>
      <mesh position={[3.15, 4.15, 0]}><boxGeometry args={[0.2, 0.35, 0.2]} />{m}</mesh>
      {/* tail */}
      <mesh position={[-2.2, 0.75, 1.35]} rotation-y={0.1}><boxGeometry args={[3, 0.25, 0.25]} />{m}</mesh>
      {/* Dream stela between paws */}
      <mesh position={[2.4, 1.2, 0]} castShadow><boxGeometry args={[0.25, 1.6, 1.1]} /><meshStandardMaterial color="#8b5a3c" roughness={0.8} /></mesh>
    </group>
  );
}

function Obelisk() {
  const glyph = useMemo(() => glyphTexture(), []);
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow><boxGeometry args={[2, 0.8, 2]} /><meshStandardMaterial color={limestone} roughness={1} /></mesh>
      <mesh position={[0, 0.8 + 4.5, 0]} rotation-y={Math.PI / 4} castShadow>
        <cylinderGeometry args={[0.38, 0.62, 9, 4, 1]} />
        <meshStandardMaterial map={glyph} color="#d69a6a" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, 0.8 + 9 + 0.32, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[0.38, 0.65, 4, 1]} />
        <meshStandardMaterial color="#ffd27a" metalness={1} roughness={0.2} emissive="#b0741a" emissiveIntensity={0.6} flatShading />
      </mesh>
    </group>
  );
}

function Palm({ position, h = 5, lean = 0.15 }: { position: [number, number, number]; h?: number; lean?: number }) {
  const leaves = Array.from({ length: 7 });
  return (
    <group position={position} rotation-z={lean}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[i * lean * 0.6, (i + 0.5) * (h / 6), 0]} castShadow>
          <cylinderGeometry args={[0.16 - i * 0.012, 0.2 - i * 0.012, h / 6 + 0.05, 6]} />
          <meshStandardMaterial color="#7a5a36" roughness={1} />
        </mesh>
      ))}
      <group position={[6 * lean * 0.6, h, 0]}>
        {leaves.map((_, i) => (
          <group key={i} rotation={[0, (i / leaves.length) * Math.PI * 2, 0]}>
            <mesh position={[1.3, -0.35, 0]} rotation-z={-0.5} castShadow>
              <boxGeometry args={[2.8, 0.05, 0.6]} />
              <meshStandardMaterial color="#4f7a2c" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Rocks() {
  const items = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 40 }, () => {
      const a = r() * Math.PI * 2, d = 20 + r() * 50;
      return { p: [Math.cos(a) * d, 0.2, Math.sin(a) * d] as [number, number, number], s: 0.3 + r() * 0.9, ry: r() * 3 };
    });
  }, []);
  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} position={it.p} scale={it.s} rotation-y={it.ry} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#b9925f" roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

export default function EgyptScene() {
  return (
    <>
      <fog attach="fog" args={['#e9c896', 60, 260]} />
      <GradientSky top="#5f93cc" horizon="#f4dcae" bottom="#e2bf86" sun="#fff0c8" sunDir={[0.6, 0.28, -0.75]} />
      <hemisphereLight args={['#ffe9c4', '#a06d3a', 0.6]} />
      <ambientLight intensity={0.25} color="#ffe2b8" />
      <directionalLight
        castShadow
        position={[45, 40, -35]}
        intensity={2.6}
        color="#ffd296"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0004}
      />

      <Desert />
      <Rocks />

      <Interactive id="pyramid" position={[0, 0, -6]} markerY={15}>
        <Pyramid base={22} height={14} cap />
      </Interactive>
      <group position={[-30, 0, -30]}><Pyramid base={18} height={11.5} /></group>
      <group position={[-52, 0, -52]}><Pyramid base={10} height={6.5} /></group>
      {[-8, -3, 2].map((x) => (
        <group key={x} position={[x - 44, 0, -36 + x]}><Pyramid base={3.4} height={2.2} /></group>
      ))}

      <Interactive id="sphinx" position={[20, 0, 14]} rotation={[0, -0.75, 0]} markerY={6}>
        <Sphinx />
      </Interactive>

      <Interactive id="obelisk" position={[-14, 0, 14]} markerY={11.5}>
        <Obelisk />
      </Interactive>

      {/* oasis */}
      <mesh rotation-x={-Math.PI / 2} position={[-22, 0.05, 30]}>
        <circleGeometry args={[6, 40]} />
        <meshStandardMaterial color="#2c6a74" metalness={0.4} roughness={0.15} />
      </mesh>
      <Palm position={[-27, 0, 27]} h={6} lean={0.18} />
      <Palm position={[-17, 0, 33]} h={5} lean={-0.2} />
      <Palm position={[-24, 0, 36]} h={6.5} lean={0.1} />
      <Palm position={[-15, 0, 26]} h={4.5} lean={-0.12} />

      <Sparkles count={160} scale={[90, 14, 90]} position={[0, 6, 0]} size={2.4} speed={0.35} color="#fff1cf" opacity={0.55} />
    </>
  );
}
