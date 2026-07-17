"use client";

import { motion } from "framer-motion";

export default function ManuscriptBook() {
  return (
    <div className="relative flex justify-center items-center w-full max-w-5xl mx-auto perspective-[2000px] mt-16 md:mt-24">
      {/* The Book Container */}
      <motion.div 
        initial={{ rotateX: 20, rotateY: -10, opacity: 0, y: 50, scale: 0.9 }}
        animate={{ rotateX: 5, rotateY: 0, opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col md:flex-row w-full h-auto min-h-[500px] md:h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-style-3d"
      >
        
        {/* Left Page (Portrait & Quote) */}
        <div className="flex-1 bg-[#EBE3D1] border-r border-[#D4A843]/30 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden rounded-t-xl md:rounded-tr-none md:rounded-l-xl">
          {/* Subtle noise texture for paper */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8">
            <div className="relative w-48 h-64 md:w-64 md:h-80 border-4 border-[#0F1E35] shadow-xl p-2 bg-[#F4ECD8]">
              <img 
                src="assets/aarish.jpg" 
                alt="Aarish Portrait" 
                className="w-full h-full object-cover sepia-[0.3] contrast-125"
              />
            </div>
            
            <div className="text-center max-w-[80%]">
              <p className="font-serif italic text-lg md:text-xl text-[#6A2C2C] leading-snug">
                "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself."
              </p>
              <p className="text-[#080F1C] text-xs tracking-[0.2em] uppercase mt-4 opacity-70">— Rumi</p>
            </div>
          </div>
        </div>

        {/* Right Page (Bio) */}
        <div className="flex-1 bg-[#EBE3D1] shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)] p-8 md:p-16 relative overflow-hidden rounded-b-xl md:rounded-bl-none md:rounded-r-xl">
          <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
          
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-serif text-[#080F1C] mb-8 relative inline-block">
              About
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#D4A843]"></span>
            </h1>
            
            <div className="text-[17px] md:text-lg font-serif text-[#0F1E35] leading-relaxed">
              <p>
                <span className="float-left text-6xl md:text-7xl leading-[0.6] pr-2 pt-2 text-[#D4A843]">I</span>
                'm an AI student who'd rather build than just study — most of
                what I know about machine learning, web systems, and software
                architecture has come from shipping real projects rather than
                only coursework.
              </p>
              <p className="mt-5">
                Outside of code, I care a lot about Islamic philosophy — Rumi and Al-Ghazali especially — and about staying genuinely informed on geopolitics and ideas rather than taking headlines at face value.
              </p>
              <p className="mt-5">
                I'm always building something; right now that's a multi-agent fact-checking system and a portfolio that, frankly, took longer to design than most of my projects.
              </p>
            </div>

            <div className="mt-auto pt-12 flex justify-end">
              <span className="text-[#D4A843] font-serif italic text-2xl">Folio 02</span>
            </div>
          </div>
        </div>

        {/* Center Binding Shadow */}
        <div className="absolute top-0 bottom-0 left-0 md:left-1/2 w-full md:w-8 -translate-x-0 md:-translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.15)] to-transparent pointer-events-none"></div>

      </motion.div>
    </div>
  );
}
