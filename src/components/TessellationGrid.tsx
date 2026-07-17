"use client";

import { useState } from "react";
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

// Octagon clip path
const OCTAGON_CLIP = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";

export default function TessellationGrid({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      {/* The Geometric Grid */}
      <div className="w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-4 md:gap-8 p-4 md:p-12 relative z-10">
        <AnimatePresence>
          {projects.map((project, index) => {
            // Create a staggered masonry feel by pushing down even items slightly
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1, 
                  type: "spring", 
                  bounce: 0.4 
                }}
                className={`relative w-48 h-48 md:w-64 md:h-64 cursor-pointer group ${isEven ? 'mt-0 md:mt-12' : 'mt-0'}`}
                onClick={() => setActiveProject(project)}
              >
                {/* The Golden Border / Glow */}
                <div 
                  className="absolute inset-0 bg-[#D4A843]/20 group-hover:bg-[#D4A843] transition-colors duration-500 blur-md scale-105"
                  style={{ clipPath: OCTAGON_CLIP }}
                ></div>
                
                {/* The Octagon Tile */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-[#1C1508] via-[#1A1205] to-[#120E04] border border-[#D4A843]/40 group-hover:border-[#D4A843] transition-colors duration-500 flex flex-col items-center justify-center text-center p-4"
                  style={{ clipPath: OCTAGON_CLIP }}
                >
                  {/* Subtle Noise Texture */}
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
                  
                  <span className="text-[#D4A843] opacity-60 text-[10px] tracking-widest uppercase mb-4 group-hover:opacity-100 transition-opacity">Folio {String(index + 1).padStart(2, '0')}</span>
                  <h2 className="text-2xl md:text-3xl font-serif text-[#D4A843] drop-shadow-md z-10">{project.name}</h2>
                  
                  {/* Geometric Decor */}
                  <div className="absolute bottom-6 w-12 h-12 border border-[#D4A843]/10 rotate-45 pointer-events-none group-hover:rotate-90 group-hover:border-[#D4A843]/40 transition-all duration-700"></div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expanded Project Modal (Parchment) */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-[#080F1C]/80 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setActiveProject(null)}></div>
            
            <motion.div 
              layoutId={`project-${activeProject.id}`}
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#EBE3D1] shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-lg p-8 md:p-16 border border-[#D4A843]/30"
            >
              {/* Paper Texture */}
              <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
              
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full border border-[#D4A843]/40 text-[#0F1E35] hover:bg-[#D4A843]/10 transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10 flex flex-col space-y-8">
                <div>
                  <h2 className="text-4xl md:text-6xl font-serif text-[#080F1C] mb-4">{activeProject.name}</h2>
                  <p className="font-serif italic text-xl md:text-2xl text-[#6A2C2C] leading-snug max-w-2xl">
                    {activeProject.oneLiner}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {activeProject.tech.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full border border-[#D4A843]/40 bg-[#D4A843]/10 text-[#0F1E35] text-xs tracking-wider uppercase font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-[#D4A843]/30 my-4 relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#EBE3D1] border border-[#D4A843]"></div>
                </div>

                <div className="space-y-8 text-[15px] md:text-[17px] leading-relaxed text-[#0F1E35] font-serif">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4A843] mb-3 flex items-center gap-2 font-sans font-bold">
                      <span className="w-4 h-px bg-[#D4A843]"></span> The Problem
                    </h3>
                    <p>
                      <span className="text-5xl font-serif text-[#D4A843] leading-[0.5] mr-2 float-left pt-2 drop-shadow-sm">T</span>
                      {activeProject.problem}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4A843] mb-3 flex items-center gap-2 font-sans font-bold">
                      <span className="w-4 h-px bg-[#D4A843]"></span> The Approach
                    </h3>
                    <p>{activeProject.approach}</p>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4A843] mb-3 flex items-center gap-2 font-sans font-bold">
                      <span className="w-4 h-px bg-[#D4A843]"></span> The Outcome
                    </h3>
                    <p>{activeProject.outcome}</p>
                  </div>
                </div>
                
                {activeProject.url && (
                  <div className="pt-8 flex justify-center">
                    <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D4A843] text-[#0F1E35] hover:bg-[#D4A843] hover:text-[#080F1C] transition-all duration-300 font-sans tracking-widest uppercase text-sm font-medium">
                      View Live Site
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
