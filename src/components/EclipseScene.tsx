"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Eclipse() {
  const moonRef = useRef<THREE.Mesh>(null);
  
  // Generate glowing corona texture procedurally
  const coronaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    
    // Brilliant white/gold center fading to soft gold, then transparent
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 230, 100, 1)');
    gradient.addColorStop(0.3, 'rgba(212, 168, 67, 0.6)');
    gradient.addColorStop(0.7, 'rgba(212, 168, 67, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    // Subtle parallax on mouse move
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    
    if (moonRef.current) {
      // Moon moves slightly towards the mouse to create the eclipse unveiling effect
      moonRef.current.position.x = THREE.MathUtils.lerp(moonRef.current.position.x, mouseX * 0.4, 0.05);
      moonRef.current.position.y = THREE.MathUtils.lerp(moonRef.current.position.y, mouseY * 0.4, 0.05);
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* The Corona (Sun) - Pure 2D Sprite, 0 computation cost */}
      <sprite scale={[16, 16, 1]} position={[0, 0, -2]}>
        <spriteMaterial 
          map={coronaTexture} 
          transparent 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </sprite>

      {/* The Moon - Pitch Black Sphere matching background, unlit */}
      <mesh ref={moonRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshBasicMaterial color="#020308" />
      </mesh>
    </group>
  );
}

export default function EclipseScene() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#020308]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Eclipse />
      </Canvas>
    </div>
  );
}
