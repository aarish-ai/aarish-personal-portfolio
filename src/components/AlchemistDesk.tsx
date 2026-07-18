"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Html, Float, SoftShadows } from "@react-three/drei";
import * as THREE from "three";

function FlickeringCandle() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Procedural flicker using sine waves of different frequencies
      const t = clock.elapsedTime;
      const flicker = 1.5 + Math.sin(t * 10) * 0.1 + Math.sin(t * 23) * 0.05 + Math.sin(t * 5) * 0.15;
      lightRef.current.intensity = flicker;
    }
  });

  return (
    <group position={[-3, 0, -2.5]}>
      {/* The Wax */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#fdf5e6" roughness={0.7} />
      </mesh>
      
      {/* The Flame (Glowing core) */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* The Light Source */}
      <pointLight 
        ref={lightRef} 
        position={[0, 0.9, 0]} 
        color="#FFAA00" 
        distance={15} 
        decay={2} 
        castShadow 
        shadow-mapSize={1024}
        shadow-bias={-0.001}
      />
    </group>
  );
}

function DeskProps() {
  return (
    <>
      {/* A Floating Geometric Crystal (Astrolabe gem) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[3.5, 0.5, -2]} castShadow receiveShadow>
          <octahedronGeometry args={[0.6]} />
          <meshPhysicalMaterial 
            color="#D4A843" 
            metalness={0.9} 
            roughness={0.1} 
            transmission={0.6} 
            thickness={0.5} 
            envMapIntensity={2}
          />
        </mesh>
      </Float>

      {/* Brass Astrolabe Rings scattered on desk */}
      <mesh position={[-3.5, 0.05, 1.5]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 16, 100]} />
        <meshStandardMaterial color="#D4A843" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-3.3, 0.1, 1.3]} castShadow receiveShadow rotation={[Math.PI / 2 + 0.2, 0, 0.2]}>
        <torusGeometry args={[0.6, 0.04, 16, 100]} />
        <meshStandardMaterial color="#D4A843" metalness={1} roughness={0.3} />
      </mesh>
    </>
  );
}

function TheManuscript() {
  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
      {/* A faint paper-colored mesh underneath so it casts shadows realistically on the desk */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <planeGeometry args={[11.5, 8.5]} />
        <meshStandardMaterial color="#EBE3D1" roughness={0.9} />
      </mesh>

      {/* The HTML Transform placing DOM natively in 3D Space */}
      <Html 
        transform 
        occlude="blending"
        position={[0, 0, 0.01]} 
        distanceFactor={4} 
        zIndexRange={[100, 0]}
        className="w-[1100px] h-[800px] bg-transparent flex"
      >
        <div className="w-full h-full flex shadow-2xl rounded-sm border border-[#D4A843]/20 overflow-hidden bg-[#EBE3D1] relative">
          
          {/* Subtle Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
          
          {/* Spine gradient */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-10" />

          {/* Left Page: Philosophy */}
          <div className="w-1/2 p-16 border-r border-[#D4A843]/20 relative z-0">
            <span className="text-[#D4A843] font-sans tracking-widest text-xs uppercase font-bold mb-4 block">Chapter I</span>
            <h1 className="text-5xl font-serif text-[#080F1C] mb-8 leading-tight">The Alchemist</h1>
            
            <div className="text-[18px] font-serif text-[#0F1E35] leading-relaxed space-y-6">
              <p>
                <span className="float-left text-7xl leading-[0.6] pr-2 pt-2 text-[#D4A843]">I</span>
                'm an AI student who'd rather build than just study — most of what I know about machine learning, web systems, and software architecture has come from shipping real projects rather than only coursework.
              </p>
              <p>
                Outside of code, I care a lot about Islamic philosophy — Rumi and Al-Ghazali especially — and about staying genuinely informed on geopolitics and ideas rather than taking headlines at face value.
              </p>
              <p>
                I'm always building something; right now that's a multi-agent fact-checking system and a portfolio that took longer to design than most of my projects.
              </p>
            </div>
          </div>

          {/* Right Page: The Arsenal */}
          <div className="w-1/2 p-16 relative z-0">
            <span className="text-[#D4A843] font-sans tracking-widest text-xs uppercase font-bold mb-4 block">Chapter II</span>
            <h2 className="text-4xl font-serif text-[#080F1C] mb-8 leading-tight">The Arsenal</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-sans font-bold">Languages & Core</h3>
                <div className="flex flex-wrap gap-2">
                  {['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++'].map(t => (
                    <span key={t} className="px-3 py-1 bg-white/50 border border-[#D4A843]/30 rounded text-sm font-sans text-[#0F1E35]">{t}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-sans font-bold">Web & Systems</h3>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map(t => (
                    <span key={t} className="px-3 py-1 bg-white/50 border border-[#D4A843]/30 rounded text-sm font-sans text-[#0F1E35]">{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4A843] mb-4 font-sans font-bold">Machine Learning</h3>
                <div className="flex flex-wrap gap-2">
                  {['PyTorch', 'TensorFlow', 'HuggingFace', 'LangChain', 'OpenCV'].map(t => (
                    <span key={t} className="px-3 py-1 bg-white/50 border border-[#D4A843]/30 rounded text-sm font-sans text-[#0F1E35]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Html>
    </group>
  );
}

export default function AlchemistDesk() {
  return (
    <div className="absolute inset-0 w-full h-full z-10 bg-[#020308]">
      <Canvas shadows camera={{ position: [0, 5, 6], fov: 45 }}>
        <SoftShadows size={15} focus={0.5} samples={10} />
        <fog attach="fog" args={['#020308', 10, 25]} />
        
        <ambientLight intensity={0.05} />
        {/* Subtle moonlight from window */}
        <spotLight position={[10, 10, 5]} angle={0.3} penumbra={1} intensity={0.2} color="#4A90E2" castShadow />

        {/* The Dark Wooden Desk Surface */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#0a0705" roughness={0.9} metalness={0.1} />
        </mesh>

        <FlickeringCandle />
        <DeskProps />
        <TheManuscript />

        {/* Camera Controls restricted to desk viewing */}
        <CameraControls 
          makeDefault 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
          minDistance={3}
          maxDistance={10}
          dollySpeed={0.5}
        />
      </Canvas>

      {/* UI Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#D4A843]/60 font-sans tracking-[0.3em] uppercase text-xs pointer-events-none">
        Drag to examine the desk
      </div>
    </div>
  );
}
