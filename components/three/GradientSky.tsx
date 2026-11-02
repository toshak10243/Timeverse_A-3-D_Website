'use client';
import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Lightweight sky dome: vertical gradient + soft sun glow.
 * Values stay in a safe range so bloom never blows out.
 */
export function GradientSky({
  top = '#6fa3d8', horizon = '#f3d9a8', bottom = '#e2bf86', sun = '#fff1cf',
  sunDir = [0.5, 0.25, -0.8], sunSize = 0.9965,
}: { top?: string; horizon?: string; bottom?: string; sun?: string; sunDir?: [number, number, number]; sunSize?: number }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color(top) },
      uHorizon: { value: new THREE.Color(horizon) },
      uBottom: { value: new THREE.Color(bottom) },
      uSun: { value: new THREE.Color(sun) },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSunSize: { value: sunSize },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 uTop, uHorizon, uBottom, uSun, uSunDir; uniform float uSunSize; varying vec3 vDir;
      void main(){
        float h = vDir.y;
        vec3 col = h > 0.0 ? mix(uHorizon, uTop, pow(clamp(h,0.0,1.0), 0.55)) : mix(uHorizon, uBottom, clamp(-h*4.0,0.0,1.0));
        float d = dot(normalize(vDir), uSunDir);
        col += uSun * smoothstep(uSunSize, 1.0, d) * 1.2;      // disc
        col += uSun * pow(max(d,0.0), 24.0) * 0.35;           // glow
        gl_FragColor = vec4(min(col, vec3(1.6)), 1.0);
        #include <colorspace_fragment>
      }`,
  }), [top, horizon, bottom, sun, sunDir, sunSize]);
  return (
    <mesh material={mat} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[600, 32, 16]} />
    </mesh>
  );
}
