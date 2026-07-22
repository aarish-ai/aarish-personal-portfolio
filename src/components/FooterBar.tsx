"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FooterBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (pathname === '/work') {
      setIsVisible(false);
      return;
    }

    if (pathname === '/about') {
      const handleScroll = () => {
        if (window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      };
      
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    setIsVisible(true);
  }, [pathname]);

  return (
    <div className={`fixed bottom-8 left-0 w-full z-50 flex justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-wrap items-center justify-center px-6 gap-4 md:gap-8">
        <a href="mailto:aarish.ai@example.com" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
          aarish.ai@example.com
        </a>
        
        <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
        
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
          GitHub
        </a>
        
        <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
        
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
          LinkedIn
        </a>
        
        <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
        
        <a href="/CV.pdf" download className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans text-sm tracking-wide">
          Download CV
        </a>
      </div>
    </div>
  );
}
