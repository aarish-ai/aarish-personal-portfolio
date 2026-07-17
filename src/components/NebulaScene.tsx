"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_PARTICLES = 2500;

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, scales, opacities] = useMemo(() => {
    const p = new Float32Array(NUM_PARTICLES * 3);
    const s = new Float32Array(NUM_PARTICLES);
    const o = new Float32Array(NUM_PARTICLES);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      // Create a large spherical/cylindrical spread
      const radius = 5 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 30;

      p[i * 3] = Math.cos(theta) * radius;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = Math.sin(theta) * radius;

      s[i] = Math.random();
      o[i] = Math.random() * 0.5 + 0.1;
    }

    return [p, s, o];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Slow rotation
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;

    // React to mouse
    // mouse.x is -1 to 1, mouse.y is -1 to 1
    const targetX = (mouse.x * viewport.width) / 4;
    const targetY = (mouse.y * viewport.height) / 4;
    
    // Smooth camera pan based on mouse
    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#D4A843"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function NebulaScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--color-ink-soft)_0%,_var(--color-ink)_100%)]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#080F1C', 10, 30]} />
        <Particles />
      </Canvas>
    </div>
  );
}
