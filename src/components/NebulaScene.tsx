"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import * as THREE from 'three';

const NUM_PARTICLES = 2500;

function Particles({ warpActive, isHome, isAbout }: { warpActive: boolean, isHome: boolean, isAbout: boolean }) {
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

  const [basePositions, astrolabePositions, wavePositions, scales, currentPositions] = useMemo(() => {
    const baseP = new Float32Array(NUM_PARTICLES * 3);
    const astroP = new Float32Array(NUM_PARTICLES * 3);
    const waveP = new Float32Array(NUM_PARTICLES * 3);
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
      const ringGroup = i % 9;
      const ringTheta = Math.random() * Math.PI * 2;
      let targetX = 0, targetY = 0, targetZ = 0;

      if (i < 500) {
        targetX = (Math.random() - 0.5) * 6;
        targetY = (Math.random() - 0.5) * 6;
        targetZ = (Math.random() - 0.5) * 6;
      } else {
        const r = ringGroup < 3 ? 12 : ringGroup < 6 ? 18 : 25;
        const axis = ringGroup % 3;
        
        if (axis === 0) { 
          targetX = Math.cos(ringTheta) * r;
          targetY = Math.sin(ringTheta) * r;
          targetZ = (Math.random() - 0.5) * 0.5;
        } else if (axis === 1) { 
          targetX = Math.cos(ringTheta) * r;
          targetY = (Math.random() - 0.5) * 0.5;
          targetZ = Math.sin(ringTheta) * r;
        } else { 
          targetX = (Math.random() - 0.5) * 0.5;
          targetY = Math.cos(ringTheta) * r;
          targetZ = Math.sin(ringTheta) * r;
        }
      }
      
      astroP[i * 3] = targetX;
      astroP[i * 3 + 1] = targetY;
      astroP[i * 3 + 2] = targetZ - 10;

      // --- Sea of Stars State (The Quantum Wave) ---
      // We map the 2500 particles onto a massive 50x50 2D grid placed on the floor
      const row = Math.floor(i / 50);
      const col = i % 50;
      
      // Spread the grid wide (-50 to +50 on X, -60 to +10 on Z)
      const waveX = (col / 50) * 100 - 50;
      const waveZ = (row / 50) * 80 - 60;
      const waveY = -12; // Bottom of the screen
      
      waveP[i * 3] = waveX;
      waveP[i * 3 + 1] = waveY;
      waveP[i * 3 + 2] = waveZ;
    }

    return [baseP, astroP, waveP, s, currP];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Normal rotation of the entire system (only for Home/Base states, not the Sea)
    if (!isAbout) {
       pointsRef.current.rotation.y += delta * 0.03;
       pointsRef.current.rotation.x += delta * 0.01;
    } else {
       // Gracefully level out the rotation for the beautiful flat sea
       pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, 0, delta * 2);
       pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, 0, delta * 2);
    }

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionsAttr.array as Float32Array;

    // Base target positions
    const targetPositions = isAbout ? wavePositions : (isHome ? astrolabePositions : basePositions);
    
    // Faster lerp for pulling into the Sea of Stars
    const lerpSpeed = isAbout ? delta * 2.5 : delta * 0.8;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      if (warpActive) {
        // Hyperspace jump transition
        posArray[i * 3 + 2] += delta * 80;
        if (posArray[i * 3 + 2] > 20) {
          posArray[i * 3 + 2] = -60; // Wrap back deep into the distance
        }
      } else {
        let targetX = targetPositions[i * 3];
        let targetY = targetPositions[i * 3 + 1];
        let targetZ = targetPositions[i * 3 + 2];

        // Apply undulating quantum wave math if on About page
        if (isAbout) {
           const time = state.clock.elapsedTime;
           // Complex interference wave using Sine and Cosine
           targetY += Math.sin(targetX * 0.15 + time) * 1.5;
           targetY += Math.cos(targetZ * 0.15 + time * 0.8) * 1.5;
        }

        // Smoothly lerp current positions towards the calculated target
        posArray[i * 3] += (targetX - posArray[i * 3]) * lerpSpeed;
        posArray[i * 3 + 1] += (targetY - posArray[i * 3 + 1]) * lerpSpeed;
        posArray[i * 3 + 2] += (targetZ - posArray[i * 3 + 2]) * lerpSpeed;
      }
    }
    
    positionsAttr.needsUpdate = true;

    // Keep particles fully visible; they are the entire background now
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = THREE.MathUtils.lerp(material.opacity, 0.8, delta * 2);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={currentPositions.length / 3} args={[currentPositions, 3]} />
        <bufferAttribute attach="attributes-scale" count={scales.length} args={[scales, 1]} />
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
  const isAbout = pathname === '/about';

  // Trigger hyperspace warp effect on route change
  useEffect(() => {
    setWarpActive(true);
    const timeout = setTimeout(() => {
      setWarpActive(false);
    }, 800); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020308]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        {/* The entire universe is now purely governed by the particles */}
        <Particles warpActive={warpActive} isHome={isHome} isAbout={isAbout} />
      </Canvas>
    </div>
  );
}
