"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

// Container variants for staggered text entry
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function PlayingCardsDeck({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProject = projects[activeIndex];

  return (
    <>
      {/* Left Panel: The Card Hand */}
      {/* Decreased width and height to make cards smaller, added mr-12 for separation */}
      <div className="relative w-[260px] h-[380px] md:w-[300px] md:h-[440px] flex-shrink-0 perspective-1000 mr-0 lg:mr-16">
        <AnimatePresence initial={false}>
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const diff = index - activeIndex;
            const absoluteDiff = Math.abs(diff);

            // Hide cards beyond the top 3
            if (absoluteDiff > 2) return null;

            const zIndex = projects.length - absoluteDiff;
            
            // Fan rotation and spread
            const rotateZ = diff * 8; 
            const x = diff * 45; 
            const y = absoluteDiff * 20;

            return (
              <motion.div
                key={project.id}
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, x: -100, rotateZ: 0 }}
                animate={{
                  rotateZ,
                  x,
                  y,
                  zIndex,
                  scale: isActive ? 1.05 : 0.95 - absoluteDiff * 0.05,
                  opacity: 1,
                }}
                // Give a staggered entry delay based on index
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: index * 0.1 // Stagger the fly-in
                }}
                className="absolute inset-0 origin-bottom cursor-pointer select-none"
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* The Card Front */}
                <div className={`w-full h-full rounded-2xl border ${isActive ? 'border-[var(--gold)]/60 shadow-[0_0_30px_rgba(212,168,67,0.25)]' : 'border-[var(--gold)]/20 shadow-xl'} bg-gradient-to-br from-[#1C1508] via-[#1A1205] to-[#120E04] p-5 flex flex-col items-center justify-center text-center overflow-hidden transition-colors`}>
                  <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
                  
                  <div className="w-full flex justify-between items-center opacity-60 text-[10px] tracking-widest uppercase text-[var(--gold)] font-medium mb-auto">
                    <span>Folio</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif text-[var(--gold)] drop-shadow-md mt-10 mb-3">
                    {project.name}
                  </h2>
                  <p className="font-serif italic text-xs text-[var(--gold-soft)] px-3 mb-auto leading-relaxed">
                    {project.oneLiner}
                  </p>

                  <div className="w-full flex justify-between items-center opacity-60 text-[10px] tracking-widest uppercase text-[var(--gold)] font-medium mt-auto rotate-180">
                    <span>Folio</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Right Panel: Project Details */}
      <div className="flex-1 max-w-2xl w-full min-h-[400px] flex flex-col justify-center relative bg-[var(--ink-soft)]/20 p-8 rounded-xl border border-[var(--gold-soft)]/10 backdrop-blur-sm mt-12 lg:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.2 } }}
            className="flex flex-col space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--ivory)] mb-3">{activeProject.name}</h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {activeProject.tech.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 text-[var(--gold)] text-xs tracking-wider uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="space-y-5 text-[14px] md:text-[15px] leading-relaxed text-[var(--ivory)]/80 font-light">
              <motion.div variants={itemVariants}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-[var(--gold-soft)]/40"></span> The Problem
                </h3>
                <p>
                  <span className="text-3xl font-serif text-[var(--gold)] leading-[0.5] mr-2 float-left pt-2 drop-shadow-[0_0_15px_rgba(212,168,67,0.3)]">T</span>
                  {activeProject.problem}
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-[var(--gold-soft)]/40"></span> The Approach
                </h3>
                <p>{activeProject.approach}</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-[var(--gold-soft)]/40"></span> The Outcome
                </h3>
                <p>{activeProject.outcome}</p>
              </motion.div>
            </div>
            
            {activeProject.url && (
              <motion.div variants={itemVariants} className="pt-4">
                <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--ivory)] transition-colors border-b border-[var(--gold)]/30 hover:border-[var(--ivory)] pb-1 text-sm tracking-widest uppercase">
                  View Live Site
                </a>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
