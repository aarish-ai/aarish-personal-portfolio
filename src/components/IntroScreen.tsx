"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
});

function TypewriterText({ text, delay, duration }: { text: string; delay: number; duration: number }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const step = (duration * 1000) / text.length;
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, step);
      
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [text, delay, duration]);

  return <span>{displayText}</span>;
}

export default function IntroScreen() {
  const [showIntro, setShowIntro] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasPlayed = sessionStorage.getItem("introPlayed");
    if (hasPlayed) {
      setShowIntro(false);
    } else {
      sessionStorage.setItem("introPlayed", "true");
      // Hide after sequence completes (1.5s wait + 1.5s fade + 4.5s write + 1s hold = 8.5s)
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 8500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isClient) {
    // Render static black screen for SSR to match initial client render
    return <div className="fixed inset-0 z-[100] bg-[#020308]" />;
  }

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#020308] flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Arabic Text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
            className={`absolute top-12 md:top-16 text-2xl md:text-4xl lg:text-5xl text-[#D4A843] drop-shadow-[0_0_25px_rgba(212,168,67,0.4)] text-center ${amiri.className}`}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </motion.h1>

          {/* Typewriter Text */}
          <div className="text-3xl md:text-5xl text-[#F4ECD8] font-light tracking-wide h-12 md:h-16 opacity-80 flex items-center justify-center">
            <TypewriterText text="As-salam u Alaykum! I am . . ." delay={3} duration={4.5} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
