"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import * as THREE from 'three';

const NUM_PARTICLES = 2500;

function Particles({ warpActive, isAbout }: { warpActive: boolean, isAbout: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Procedural glowing dot texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(212, 168, 67, 0.8)'); 
      gradient.addColorStop(0.5, 'rgba(212, 168, 67, 0.2)'); 
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [basePositions, astrolabePositions, scales, currentPositions] = useMemo(() => {
    const baseP = new Float32Array(NUM_PARTICLES * 3);
    const astroP = new Float32Array(NUM_PARTICLES * 3);
    const currP = new Float32Array(NUM_PARTICLES * 3);
    const s = new Float32Array(NUM_PARTICLES);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      // --- Base Nebula State ---
      const radius = 5 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 50; 
      
      baseP[i * 3] = Math.cos(theta) * radius;
      baseP[i * 3 + 1] = y;
      baseP[i * 3 + 2] = z;
      
      currP[i * 3] = baseP[i * 3];
      currP[i * 3 + 1] = baseP[i * 3 + 1];
      currP[i * 3 + 2] = baseP[i * 3 + 2];

      s[i] = Math.random() * 1.5 + 0.5;

      // --- Astrolabe/Gyroscope Target State ---
      // Distribute particles into 3 interlocking rings at different radii + a central core
      const ringGroup = i % 9;
      const ringTheta = Math.random() * Math.PI * 2;
      let targetX = 0, targetY = 0, targetZ = 0;

      if (i < 500) {
        // Inner glowing core
        targetX = (Math.random() - 0.5) * 6;
        targetY = (Math.random() - 0.5) * 6;
        targetZ = (Math.random() - 0.5) * 6;
      } else {
        // Rings
        const r = ringGroup < 3 ? 12 : ringGroup < 6 ? 18 : 25;
        const axis = ringGroup % 3;
        
        if (axis === 0) { // XY Plane
          targetX = Math.cos(ringTheta) * r;
          targetY = Math.sin(ringTheta) * r;
          targetZ = (Math.random() - 0.5) * 0.5;
        } else if (axis === 1) { // XZ Plane
          targetX = Math.cos(ringTheta) * r;
          targetY = (Math.random() - 0.5) * 0.5;
          targetZ = Math.sin(ringTheta) * r;
        } else { // YZ Plane
          targetX = (Math.random() - 0.5) * 0.5;
          targetY = Math.cos(ringTheta) * r;
          targetZ = Math.sin(ringTheta) * r;
        }
      }
      
      astroP[i * 3] = targetX;
      astroP[i * 3 + 1] = targetY;
      astroP[i * 3 + 2] = targetZ - 10; // Push back slightly
    }

    return [baseP, astroP, s, currP];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Normal rotation of the entire system
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.01;

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionsAttr.array as Float32Array;

    // Smoothly interpolate positions between Nebula and Astrolabe
    const targetPositions = isAbout ? astrolabePositions : basePositions;
    const lerpSpeed = isAbout ? delta * 1.5 : delta * 0.8;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      if (warpActive) {
        // Warp speed: ignore target temporarily and fly at camera
        posArray[i * 3 + 2] += delta * 60;
        if (posArray[i * 3 + 2] > 20) {
          posArray[i * 3 + 2] = -40; // Wrap back
        }
      } else {
        // Smoothly lerp towards target shape
        posArray[i * 3] += (targetPositions[i * 3] - posArray[i * 3]) * lerpSpeed;
        posArray[i * 3 + 1] += (targetPositions[i * 3 + 1] - posArray[i * 3 + 1]) * lerpSpeed;
        posArray[i * 3 + 2] += (targetPositions[i * 3 + 2] - posArray[i * 3 + 2]) * lerpSpeed;
      }
    }
    
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={currentPositions.length / 3}
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        map={particleTexture}
        color="#F4ECD8"
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
  const isHome = pathname === '/';

  // Trigger warp effect on route change
  useEffect(() => {
    setWarpActive(true);
    const timeout = setTimeout(() => {
      setWarpActive(false);
    }, 800); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--color-ink-soft)_0%,_var(--color-ink)_100%)]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#080F1C', 10, 40]} />
        <Particles warpActive={warpActive} isAbout={isHome} />
      </Canvas>
    </div>
  );
}
