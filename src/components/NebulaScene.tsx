"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import * as THREE from 'three';

const NUM_PARTICLES = 2500;

function Particles({ warpActive }: { warpActive: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  // Create a procedural glowing dot texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(212, 168, 67, 0.8)'); // Gold core
      gradient.addColorStop(0.5, 'rgba(212, 168, 67, 0.2)'); // Soft glow
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  const [positions, scales, opacities, baseZ] = useMemo(() => {
    const p = new Float32Array(NUM_PARTICLES * 3);
    const s = new Float32Array(NUM_PARTICLES);
    const o = new Float32Array(NUM_PARTICLES);
    const bz = new Float32Array(NUM_PARTICLES);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      // Create a cylindrical spread around the user
      const radius = 5 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 40;

      p[i * 3] = Math.cos(theta) * radius;
      p[i * 3 + 1] = y;
      
      // Spread Z from far back to just in front of camera
      const z = (Math.random() - 0.5) * 50; 
      p[i * 3 + 2] = z;
      bz[i] = z; // Store base Z for resetting during warp

      s[i] = Math.random() * 1.5 + 0.5; // Slightly larger for the soft texture
      o[i] = Math.random() * 0.5 + 0.1;
    }

    return [p, s, o, bz];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Normal rotation
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.01;

    // Mouse interactivity: Swirling force
    const targetX = (mouse.x * viewport.width) / 4;
    const targetY = (mouse.y * viewport.height) / 4;
    
    // Camera pan
    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);

    // Warp speed logic (flying through stars)
    if (warpActive) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const posArray = positionsAttr.array as Float32Array;
      
      for (let i = 0; i < NUM_PARTICLES; i++) {
        posArray[i * 3 + 2] += delta * 60; // Move fast towards camera
        
        // If it passes the camera (z > 15), wrap it far back
        if (posArray[i * 3 + 2] > 20) {
          posArray[i * 3 + 2] = -40;
        }
      }
      positionsAttr.needsUpdate = true;
    }
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
        size={0.4} // Increased size because glow edges are transparent
        map={particleTexture}
        color="#F4ECD8" // Ivory tint to mix with gold texture
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function NebulaScene() {
  const pathname = usePathname();
  const [warpActive, setWarpActive] = useState(false);

  // Trigger warp effect on route change
  useEffect(() => {
    setWarpActive(true);
    const timeout = setTimeout(() => {
      setWarpActive(false);
    }, 800); // 0.8 seconds of warp speed

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--color-ink-soft)_0%,_var(--color-ink)_100%)]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#080F1C', 10, 40]} />
        <Particles warpActive={warpActive} />
      </Canvas>
    </div>
  );
}
