"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ManuscriptBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For centering: When open, the book spans two pages (Left and Right).
  // The container itself is the Right page.
  // To keep the *spread* centered, the container must shift right by half its width.
  const openShift = isMobile ? "0%" : "50%";
  const openRotateY = -180; // The cover swings open to the left

  return (
    <div className="relative flex justify-center items-center w-full min-h-[700px] perspective-[2500px] mt-8 md:mt-16">
      
      {/* The Book Container (Represents the Right Page bounds) */}
      <motion.div 
        initial={{ rotateX: 20, rotateY: -10, opacity: 0, y: 50, scale: 0.9 }}
        animate={{ 
          rotateX: isOpen ? 0 : 5, 
          rotateY: 0, 
          opacity: 1, 
          y: 0, 
          scale: 1,
          x: isOpen ? openShift : "0%"
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[340px] md:w-[450px] h-[500px] md:h-[600px] transform-style-3d cursor-pointer shadow-[20px_20px_40px_rgba(0,0,0,0.5)]"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        
        {/* RIGHT PAGE (Base layer of the book, static) */}
        <div className="absolute inset-0 w-full h-full bg-[#EBE3D1] shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)] p-8 md:p-12 overflow-hidden rounded-r-xl border border-[#D4A843]/10 z-0">
          {/* Subtle noise texture for paper */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
          
          <div className="relative z-10 h-full flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif text-[#080F1C] mb-6 relative inline-block self-start">
              About
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#D4A843]"></span>
            </h1>
            
            <div className="text-[14px] md:text-[16px] font-serif text-[#0F1E35] leading-relaxed">
              <p>
                <span className="float-left text-5xl md:text-6xl leading-[0.7] pr-2 pt-2 text-[#D4A843]">I</span>
                'm an AI student who'd rather build than just study — most of
                what I know about machine learning, web systems, and software
                architecture has come from shipping real projects rather than
                only coursework.
              </p>
              <p className="mt-4">
                Outside of code, I care a lot about Islamic philosophy — Rumi and Al-Ghazali especially — and about staying genuinely informed on geopolitics and ideas rather than taking headlines at face value.
              </p>
              <p className="mt-4">
                I'm always building something; right now that's a multi-agent fact-checking system and a portfolio that took longer to design than most of my projects.
              </p>
            </div>
          </div>
        </div>

        {/* FRONT COVER & LEFT PAGE FLAP (Swings open) */}
        <motion.div 
          className="absolute inset-0 w-full h-full origin-left transform-style-3d z-20"
          animate={{ rotateY: isOpen ? openRotateY : 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* FRONT COVER (Outside, visible when closed) */}
          <div 
            className="absolute inset-0 w-full h-full bg-[#1A1205] border-r border-[#120D04] rounded-r-xl shadow-[inset_-5px_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center p-6 overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Leather texture */}
            <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
            
            <div className="w-full h-full border-2 border-[#D4A843]/40 rounded-lg p-2 relative z-10 flex flex-col items-center justify-center">
              <div className="w-full h-full border border-[#D4A843]/20 rounded flex flex-col items-center justify-center text-center px-4 relative">
                <span className="text-[#D4A843] opacity-60 text-xs tracking-[0.3em] uppercase mb-8">Journal</span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#D4A843] mb-4">Aarish</h2>
                <div className="w-12 h-px bg-[#D4A843]/50 mb-4"></div>
                <p className="text-[#D4A843]/70 font-serif italic text-sm md:text-base">Digital Alchemist</p>
                
                {!isOpen && (
                  <span className="absolute bottom-8 text-[#D4A843] text-[10px] tracking-widest uppercase opacity-50 animate-pulse">
                    Click to Open
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* LEFT PAGE (Inside of front cover, visible when open) */}
          <div 
            className="absolute inset-0 w-full h-full bg-[#EBE3D1] border-l border-[#D4A843]/30 shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)] p-8 md:p-12 overflow-hidden rounded-l-xl"
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)" // Flips the content so it faces the user when the cover swings open
            }}
          >
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8">
              <div className="relative w-40 h-56 md:w-56 md:h-72 border-4 border-[#0F1E35] shadow-xl p-2 bg-[#F4ECD8]">
                <img 
                  src="/assets/aarish.jpg" 
                  alt="Aarish Portrait" 
                  className="w-full h-full object-cover sepia-[0.3] contrast-125"
                />
              </div>
              
              <div className="text-center max-w-[90%]">
                <p className="font-serif italic text-sm md:text-base text-[#6A2C2C] leading-snug">
                  "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself."
                </p>
                <p className="text-[#080F1C] text-[10px] tracking-[0.2em] uppercase mt-4 opacity-70">— Rumi</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center Binding Shadow (Only visible when open) */}
        {isOpen && (
          <div className="absolute top-0 bottom-0 left-0 w-8 -translate-x-full bg-gradient-to-r from-[rgba(0,0,0,0.15)] to-transparent pointer-events-none z-30"></div>
        )}

      </motion.div>
    </div>
  );
}
