"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Starfield() {
  const [positions, sizes] = useMemo(() => {
    const numStars = 800;
    const pos = new Float32Array(numStars * 3);
    const siz = new Float32Array(numStars);
    for (let i = 0; i < numStars; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = -20 + (Math.random() * 10); // Far behind the eclipse
      siz[i] = Math.random() * 1.5;
    }
    return [pos, siz];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" count={sizes.length} args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial color="#F4ECD8" size={0.05} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Eclipse() {
  const moonRef = useRef<THREE.Mesh>(null);
  
  // Generate the massive golden corona texture procedurally
  const coronaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 256);
    
    // Smooth golden falloff
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 230, 100, 0.9)');
    gradient.addColorStop(0.3, 'rgba(212, 168, 67, 0.6)');
    gradient.addColorStop(0.7, 'rgba(212, 168, 67, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Generate the sharp, blinding "Diamond Ring" lens flare texture
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

  useFrame((state) => {
    // Subtle parallax on mouse move
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    
    if (moonRef.current) {
      // Moon moves slightly towards the mouse, unveiling the eclipse
      moonRef.current.position.x = THREE.MathUtils.lerp(moonRef.current.position.x, mouseX * 0.5, 0.05);
      moonRef.current.position.y = THREE.MathUtils.lerp(moonRef.current.position.y, mouseY * 0.5, 0.05);
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* The Corona (Sun) - Pure 2D Sprite, 0 computation cost */}
      <sprite scale={[28, 28, 1]} position={[0, 0, -2]}>
        <spriteMaterial map={coronaTexture} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      {/* The Moon - Pitch Black Sphere matching background, unlit */}
      <mesh ref={moonRef} position={[0, 0, 0]}>
        {/* Massive sphere so it acts as a black framing background for the text */}
        <sphereGeometry args={[4.8, 64, 64]} />
        <meshBasicMaterial color="#020308" />
      </mesh>

      {/* The Diamond Ring Flare (Sits just behind the edge of the moon on the top right) */}
      <sprite scale={[8, 8, 1]} position={[3.2, 3.2, -1]}>
        <spriteMaterial map={flareTexture} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}

export default function EclipseScene() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#020308]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Starfield />
        <Eclipse />
      </Canvas>
    </div>
  );
}
