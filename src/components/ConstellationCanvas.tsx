"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, CameraControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Project = {
  id: string;
  name: string;
  oneLiner: string;
  tech: string[];
  image: string;
  problem: string;
  approach: string;
  outcome: string;
  url: string;
};

// Fixed positions for the constellation nodes
const CONSTELLATION_POSITIONS: Record<string, [number, number, number]> = {
  "01": [-5, 2, -2],
  "02": [0, -1, 1],
  "03": [4, 3, -1],
};

function ConstellationNode({ 
  position, 
  project, 
  isActive, 
  anyActive,
  onClick 
}: { 
  position: [number, number, number]; 
  project: Project; 
  isActive: boolean;
  anyActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)'); 
    gradient.addColorStop(0.2, 'rgba(255, 200, 50, 0.8)');
    gradient.addColorStop(1, 'rgba(212, 168, 67, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      const targetScale = hovered ? 1.5 : (isActive ? 1.2 : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const haloScale = hovered || isActive ? 4 : 2.5;

  return (
    <group position={position}>
      {/* The Soft Glowing Halo (Matches Nebula but brighter) */}
      <sprite scale={[haloScale, haloScale, 1]}>
        <spriteMaterial map={glowTexture} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={hovered || isActive ? 1 : 0.7} />
      </sprite>

      {/* The Distorting Core */}
      <Sphere 
        ref={meshRef}
        args={[0.4, 32, 32]} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <MeshDistortMaterial 
          color={hovered || isActive ? "#FFEDA0" : "#FFC107"} 
          emissive={hovered || isActive ? "#FFD700" : "#D4A843"}
          emissiveIntensity={hovered || isActive ? 3 : 1.5}
          distort={0.4} 
          speed={3} 
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Floating HTML Label */}
      <Html distanceFactor={15} center position={[0, -1.2, 0]} zIndexRange={[100, 0]}>
        <div className={`transition-all duration-500 flex flex-col items-center pointer-events-none ${anyActive ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className={`font-serif whitespace-nowrap drop-shadow-md transition-all duration-300 ${hovered ? 'text-2xl text-[#FFEDA0]' : 'text-xl text-[#D4A843]'}`}>
            {project.name}
          </h3>
        </div>
      </Html>
    </group>
  );
}

function ConstellationScene({ projects, activeProject, setActiveProject }: { projects: Project[], activeProject: Project | null, setActiveProject: (p: Project | null) => void }) {
  const controlsRef = useRef<CameraControls>(null);

  // The lines connecting the stars
  const points = useMemo(() => projects.map((p, i) => {
    const posId = String(i + 1).padStart(2, '0');
    return new THREE.Vector3(...(CONSTELLATION_POSITIONS[posId] || [0,0,0]));
  }), [projects]);

  // Handle camera fly-ins
  useEffect(() => {
    if (controlsRef.current) {
      if (activeProject) {
        const index = projects.findIndex(p => p.id === activeProject.id);
        const posId = String(index + 1).padStart(2, '0');
        const pos = CONSTELLATION_POSITIONS[posId] || [0,0,0];
        
        // Fly close to the star, slightly offset to the right so the modal has space on the left
        controlsRef.current.setLookAt(
          pos[0] + 2, pos[1], pos[2] + 4, // camera pos
          pos[0], pos[1], pos[2],         // look at target
          true // animate
        );
      } else {
        // Fly back to overview
        controlsRef.current.setLookAt(
          0, 0, 15,
          0, 0, 0,
          true
        );
      }
    }
  }, [activeProject, projects]);

  return (
    <>
      <CameraControls 
        ref={controlsRef} 
        makeDefault 
        minDistance={5} 
        maxDistance={30}
        dollySpeed={0.5}
        smoothTime={0.8}
        // Disable interactions when a project is open to keep focus
        enabled={!activeProject}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#D4A843" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />

      {/* The connecting lines */}
      <Line
        points={points}
        color="#D4A843"
        lineWidth={1.5}
        transparent
        opacity={0.3}
        dashed={true}
        dashScale={20}
        dashSize={1}
        dashOffset={0}
      />

      {projects.map((project, index) => {
        const posId = String(index + 1).padStart(2, '0');
        const pos = CONSTELLATION_POSITIONS[posId] || [0,0,0];
        return (
          <ConstellationNode
            key={project.id}
            position={pos}
            project={project}
            isActive={activeProject?.id === project.id}
            anyActive={activeProject !== null}
            onClick={() => setActiveProject(project)}
          />
        );
      })}
    </>
  );
}

export default function ConstellationCanvas({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: showStars ? 1 : 0 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 w-full h-full z-10"
    >
      
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={['#080F1C', 10, 40]} />
        <ConstellationScene 
          projects={projects} 
          activeProject={activeProject} 
          setActiveProject={setActiveProject} 
        />
      </Canvas>

      {/* HTML Overlay Modal for Active Project */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start p-6 md:p-16 pointer-events-none"
          >
            {/* The Dark Glassmorphism Panel */}
            <motion.div 
              initial={{ x: -50, opacity: 0, rotateY: 20 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: -50, opacity: 0, rotateY: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
              className="relative w-full md:w-[600px] max-h-[85vh] overflow-y-auto bg-[#020308]/70 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-3xl p-8 md:p-12 border border-[#D4A843]/20 pointer-events-auto mt-20 md:mt-0"
              style={{ perspective: "1500px" }}
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-[#D4A843]/40 text-[#F4ECD8] hover:bg-[#D4A843]/20 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 flex flex-col space-y-8">
                <div>
                  <span className="text-[#D4A843] font-sans tracking-widest text-xs uppercase font-bold mb-2 block drop-shadow-md">Project Folio</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#F4ECD8] mb-4 leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{activeProject.name}</h2>
                  <p className="font-serif italic text-lg md:text-xl text-[#D4A843]/80 leading-snug">
                    {activeProject.oneLiner}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {activeProject.tech.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full border border-[#D4A843]/30 bg-black/40 text-[#F4ECD8] text-[10px] tracking-wider uppercase font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A843]/50 to-transparent my-2"></div>

                <div className="space-y-6 text-[14px] md:text-[16px] leading-relaxed text-[#F4ECD8]/90 font-serif pr-4">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#D4A843] mb-2 font-sans font-bold">The Problem</h3>
                    <p className="text-justify">{activeProject.problem}</p>
                  </div>

                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#D4A843] mb-2 font-sans font-bold">The Approach</h3>
                    <p className="text-justify">{activeProject.approach}</p>
                  </div>

                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#D4A843] mb-2 font-sans font-bold">The Outcome</h3>
                    <p className="text-justify">{activeProject.outcome}</p>
                  </div>
                </div>
                
                {activeProject.url && (
                  <div className="pt-6">
                    <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-4 rounded-xl border border-[#D4A843]/50 text-[#F4ECD8] hover:bg-[#D4A843]/10 hover:border-[#D4A843] transition-all duration-300 font-sans tracking-widest uppercase text-xs font-medium">
                      Examine Live Artifact
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Hint */}
      <AnimatePresence>
        {!activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#D4A843]/60 font-sans tracking-[0.3em] uppercase text-xs pointer-events-none"
          >
            Drag to explore • Click a star to inspect
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
