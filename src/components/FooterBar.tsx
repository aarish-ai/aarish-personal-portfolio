"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FooterBar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;

    // We can't guarantee introTimestamp is set immediately if IntroScreen and FooterBar 
    // mount at the same time and IntroScreen hasn't run its useEffect yet. 
    // However, they both run on client mount. To be safe, wait a tick.
    const checkIntro = () => {
      const introTimestamp = sessionStorage.getItem("introTimestamp");
      
      if (!introTimestamp) {
        // Intro hasn't even started or mounted yet, wait 8.5s
        const timer = setTimeout(() => setShowFooter(true), 8500);
        return () => clearTimeout(timer);
      }
      
      const elapsed = Date.now() - parseInt(introTimestamp);
      if (elapsed > 8500) {
        setShowFooter(true);
      } else {
        const timer = setTimeout(() => setShowFooter(true), 8500 - elapsed);
        return () => clearTimeout(timer);
      }
    };
    
    // Give IntroScreen's useEffect a chance to set the timestamp
    const initialTimer = setTimeout(checkIntro, 10);
    return () => clearTimeout(initialTimer);
  }, [pathname]);

  // The user requested this only be on the home page
  if (pathname !== '/' || !showFooter) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-0 w-full z-50 flex justify-center pointer-events-none">
      {/* Interaction Zone */}
      <div 
        className="pointer-events-auto flex items-center justify-center relative min-h-[60px] min-w-[200px] px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="connect-text"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <motion.span 
                animate={{ 
                  textShadow: [
                    "0px 0px 4px rgba(212,168,67,0.2)", 
                    "0px 0px 15px rgba(212,168,67,1)", 
                    "0px 0px 4px rgba(212,168,67,0.2)"
                  ] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-[#D4A843] font-sans text-sm tracking-[0.2em] uppercase"
              >
                Connect
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="links-array"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-8 w-max"
            >
              <a href="mailto:aarishmuhammad@gamil.com" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
                aarishmuhammad@gmail.com
              </a>
              <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
              <a href="https://github.com/aarish-ai" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
                GitHub
              </a>
              <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
              <a href="https://linkedin.com/aarish-muhammad-3161b8321/" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
                LinkedIn
              </a>
              <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
              <a href="/CV.pdf" download className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
                Download CV
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
