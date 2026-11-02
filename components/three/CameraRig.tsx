'use client';
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { Era } from '@/lib/eras';
import { useStore } from '@/lib/store';
import { objectRegistry } from '@/lib/registry';

/** Cinematic camera: flies in on arrival, and flies to any selected object. */
export function CameraRig({ era }: { era: Era }) {
  const selected = useStore((s) => s.selected);
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as any;
  const first = useRef(true);

  useEffect(() => {
    if (!controls) return;
    const obj = era.objects.find((o) => o.id === selected);
    let target: THREE.Vector3;
    let pos: THREE.Vector3;
    if (obj) {
      const base = new THREE.Vector3();
      objectRegistry.get(obj.id)?.getWorldPosition(base);
      target = base.add(new THREE.Vector3(0, obj.focusY, 0));
      const mobile = window.innerWidth < 640;
      // portrait screens have a narrow horizontal view, so pull back further
      const off = new THREE.Vector3(...obj.offset).multiplyScalar(mobile ? 1.7 : 1);
      pos = target.clone().add(off);
      // Frame the object so the info card doesn't cover it:
      // desktop → card is on the right, so push the object left;
      // mobile  → card is a bottom sheet, so push the object up.
      const L = off.length();
      const shift = new THREE.Vector3();
      if (mobile) {
        shift.set(0, -0.22 * L, 0);
      } else {
        const dir = target.clone().sub(pos).normalize();
        shift.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.22 * L);
      }
      target.add(shift);
      pos.add(shift);
      pos.y = Math.max(pos.y, 0.8);
    } else {
      target = new THREE.Vector3(...era.camera.target);
      pos = new THREE.Vector3(...era.camera.position);
    }
    if (first.current) {
      camera.position.set(...era.camera.intro);
      controls.target.copy(target);
    }
    const duration = first.current ? 3.6 : 1.7;
    first.current = false;
    controls.enabled = false;
    const tl = gsap.timeline({
      onUpdate: () => controls.update(),
      onComplete: () => { controls.enabled = true; },
    });
    tl.to(controls.target, { x: target.x, y: target.y, z: target.z, duration, ease: 'power3.inOut' }, 0);
    tl.to(camera.position, { x: pos.x, y: pos.y, z: pos.z, duration, ease: 'power3.inOut' }, 0);
    return () => { tl.kill(); controls.enabled = true; };
  }, [selected, controls, camera, era]);

  return null;
}
