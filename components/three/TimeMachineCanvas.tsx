'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sparkles, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const CYAN = '#5ee7ff';
const AMBER = '#ffb347';

/** Ring of instanced "time ticks" around the portal. */
function TickRing({ radius, count, color }: { radius: number; count: number; color: string }) {
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.05, 0.32, 0.05);
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.5, toneMapped: false });
    const m = new THREE.InstancedMesh(geo, mat, count);
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      o.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      o.rotation.z = a - Math.PI / 2;
      o.scale.y = i % 5 === 0 ? 2.2 : 1;
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    return m;
  }, [radius, count, color]);
  return <primitive object={mesh} />;
}

function TimeMachine({ intensity = 1 }: { intensity?: number }) {
  const r1 = useRef<THREE.Mesh>(null!);
  const r2 = useRef<THREE.Mesh>(null!);
  const r3 = useRef<THREE.Mesh>(null!);
  const ticks = useRef<THREE.Group>(null!);
  const root = useRef<THREE.Group>(null!);

  useFrame(({ clock, pointer }, dt) => {
    const t = clock.elapsedTime;
    r1.current.rotation.x = t * 0.5;
    r1.current.rotation.y = t * 0.3;
    r2.current.rotation.y = -t * 0.45;
    r2.current.rotation.z = t * 0.2;
    r3.current.rotation.x = -t * 0.25;
    r3.current.rotation.z = -t * 0.4;
    ticks.current.rotation.z = -t * 0.08;
    // mouse parallax
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.35, 1 - Math.exp(-dt * 3));
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.2, 1 - Math.exp(-dt * 3));
  });

  const ringMat = (c: string) => (
    <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.2 * intensity} metalness={0.9} roughness={0.2} toneMapped={false} />
  );

  return (
    <group ref={root}>
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.6}>
        {/* energy core */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial color="#9ff3ff" emissive={CYAN} emissiveIntensity={1.6 * intensity} distort={0.42} speed={2.2} roughness={0.1} toneMapped={false} />
        </mesh>
        <mesh scale={1.35}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
        <mesh ref={r1}><torusGeometry args={[2.1, 0.045, 16, 140]} />{ringMat(CYAN)}</mesh>
        <mesh ref={r2}><torusGeometry args={[2.6, 0.035, 16, 160]} />{ringMat(AMBER)}</mesh>
        <mesh ref={r3}><torusGeometry args={[3.1, 0.06, 16, 180]} />{ringMat(CYAN)}</mesh>
      </Float>

      {/* outer clock frame */}
      <group ref={ticks} position={[0, 0, -0.6]}>
        <TickRing radius={4.1} count={60} color={AMBER} />
      </group>
      <mesh position={[0, 0, -0.6]}>
        <torusGeometry args={[4.5, 0.12, 16, 200]} />
        <meshStandardMaterial color="#2a2f3d" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.6]}>
        <torusGeometry args={[4.5, 0.025, 8, 200]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* platform */}
      <group position={[0, -4.6, 0]}>
        <mesh><cylinderGeometry args={[3.2, 3.8, 0.5, 64]} /><meshStandardMaterial color="#141822" metalness={0.95} roughness={0.25} /></mesh>
        <mesh position={[0, 0.26, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[2.6, 2.75, 64]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3} toneMapped={false} /></mesh>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.6, 2.4, 4, 48, 1, true]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.06} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function TimeMachineCanvas({ intensity = 1, className = '' }: { intensity?: number; className?: string }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 11], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className={className}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 6]} intensity={80} color={AMBER} />
      <pointLight position={[-6, -2, 4]} intensity={60} color={CYAN} />
      <Stars radius={80} depth={40} count={2500} factor={3} fade speed={0.8} />
      <Sparkles count={120} scale={[14, 10, 6]} size={2.5} speed={0.5} color={CYAN} opacity={0.7} />
      <TimeMachine intensity={intensity} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.2 * intensity} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
