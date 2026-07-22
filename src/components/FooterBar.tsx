"use client";

export default function FooterBar() {
  return (
    <div className="fixed bottom-8 left-0 w-full z-50 pointer-events-none flex justify-center">
      <div className="flex flex-wrap items-center justify-center pointer-events-auto px-6 gap-2 md:gap-4">
        <a href="mailto:aarish.ai@example.com" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_10px_rgba(212,168,67,1)] font-serif text-lg md:text-xl">
          aarish.ai@example.com
        </a>
        
        <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
        
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_10px_rgba(212,168,67,1)] font-serif text-lg md:text-xl">
          GitHub
        </a>
        
        <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
        
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_10px_rgba(212,168,67,1)] font-serif text-lg md:text-xl">
          LinkedIn
        </a>
        
        <span className="text-[#D4A843]/60 mx-1 md:mx-2">•</span>
        
        <a href="/CV.pdf" download className="text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_10px_rgba(212,168,67,1)] font-serif text-lg md:text-xl">
          Download CV
        </a>
      </div>
    </div>
  );
}
