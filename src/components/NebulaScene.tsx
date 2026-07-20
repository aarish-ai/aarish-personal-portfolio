"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import * as THREE from 'three';

const NUM_PARTICLES = 2500;

function EclipseElements({ isAbout }: { isAbout: boolean }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Sprite>(null);
  const flareRef = useRef<THREE.Sprite>(null);
  const starsRef = useRef<THREE.Points>(null);
  
  const progress = useRef(0);

  // Generate the massive golden corona texture
  const coronaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 230, 100, 0.9)');
    gradient.addColorStop(0.3, 'rgba(212, 168, 67, 0.6)');
    gradient.addColorStop(0.7, 'rgba(212, 168, 67, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Generate the "Diamond Ring" lens flare texture
  const flareTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.05, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.2, 'rgba(255, 230, 100, 0.4)');
    gradient.addColorStop(0.5, 'rgba(212, 168, 67, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Static Starfield background specifically for the Eclipse
  const [starPositions, starSizes] = useMemo(() => {
    const numStars = 800;
    const pos = new Float32Array(numStars * 3);
    const siz = new Float32Array(numStars);
    for (let i = 0; i < numStars; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = -20 + (Math.random() * 10); // Far behind
      siz[i] = Math.random() * 1.5;
    }
    return [pos, siz];
  }, []);

  useFrame((state, delta) => {
    // The exact cinematic timeline the user requested
    if (isAbout) {
      progress.current += delta;
    } else {
      progress.current -= delta * 3; // Fast reverse when leaving
      if (progress.current < 0) progress.current = 0;
    }

    const t = progress.current;

    // t=0 to t=1: Hyperspace jump (particles rushing).
    // During this time, Corona smoothly fades in at the destination.
    if (coronaRef.current) {
       const coronaOpacity = Math.min(1, t / 1.0); // Fades in over 1 second
       (coronaRef.current.material as THREE.SpriteMaterial).opacity = coronaOpacity;
    }

    // t=0 to t=3.5: Moon slowly slides into place to cover the Sun.
    if (moonRef.current) {
       const slideProgress = Math.min(1, t / 3.5);
       const easeOutCubic = 1 - Math.pow(1 - slideProgress, 3); // Smooth deceleration
       
       const targetX = 15 - (easeOutCubic * 15);
       
       if (t >= 3.5) {
          // Enable parallax once fully locked
          moonRef.current.position.x = THREE.MathUtils.lerp(moonRef.current.position.x, state.pointer.x * 0.5, 0.05);
          moonRef.current.position.y = THREE.MathUtils.lerp(moonRef.current.position.y, state.pointer.y * 0.5, 0.05);
       } else {
          moonRef.current.position.x = targetX;
          moonRef.current.position.y = 0;
       }
    }

    // t=2.5 to t=4: Stars fade in once the Sun is mostly covered.
    if (starsRef.current) {
       const starOpacity = Math.max(0, Math.min(1, (t - 2.5) / 1.5)) * 0.6;
       (starsRef.current.material as THREE.PointsMaterial).opacity = starOpacity;
    }
    
    // Flare fades in exactly as the eclipse aligns
    if (flareRef.current) {
       const flareOpacity = Math.max(0, Math.min(1, (t - 2.8) / 1.0));
       (flareRef.current.material as THREE.SpriteMaterial).opacity = flareOpacity;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Background Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starPositions.length / 3} args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-size" count={starSizes.length} args={[starSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial color="#F4ECD8" size={0.05} transparent opacity={0} sizeAttenuation depthWrite={false} />
      </points>

      {/* The Corona (Sun) */}
      <sprite ref={coronaRef} scale={[28, 28, 1]} position={[0, 0, -2]}>
        <spriteMaterial map={coronaTexture} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      {/* The Moon */}
      <mesh ref={moonRef} position={[15, 0, 0]}>
        <sphereGeometry args={[4.8, 64, 64]} />
        <meshBasicMaterial color="#020308" />
      </mesh>

      {/* The Diamond Ring Flare */}
      <sprite ref={flareRef} scale={[8, 8, 1]} position={[3.2, 3.2, -1]}>
        <spriteMaterial map={flareTexture} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}

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

    // Smoothly interpolate positions based on route (Sun collapse is removed for hyperspace jump)
    const targetPositions = isHome ? astrolabePositions : basePositions;
    
    const lerpSpeed = delta * 0.8;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      if (warpActive) {
        // Warp speed: Particles rush past camera like Millenium Falcon
        posArray[i * 3 + 2] += delta * 80;
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

    // Fade out particles rapidly if we jumped into the Eclipse (/about)
    if (isAbout) {
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0, delta * 2.5);
    } else {
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.8, delta * 2);
    }
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

  // Trigger warp effect on route change
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
        {/* We only render the Eclipse elements globally so they seamlessly animate in/out */}
        <EclipseElements isAbout={isAbout} />
        <Particles warpActive={warpActive} isHome={isHome} isAbout={isAbout} />
      </Canvas>
    </div>
  );
}
