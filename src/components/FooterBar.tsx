"use client";

import { Mail, FileText } from "lucide-react";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17A5.2 5.2 0 0 0 19 4.8a5.2 5.2 0 0 0-1.04-2.81 5.2 5.2 0 0 0-3.32-1.04C11.33 2.16 8.67 2.16 5.36.95a5.2 5.2 0 0 0-3.32 1.04 5.2 5.2 0 0 0-1.04 2.81 5.2 5.2 0 0 0 1.5 3.03C2.5 13.57 5.85 14.59 9 14.97a4.8 4.8 0 0 0-1 3.03v4"></path>
    <path d="M9 18c-3.51 1.17-6-1.5-6-3"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function FooterBar() {
  return (
    <div className="fixed bottom-8 left-0 w-full z-50 pointer-events-none flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pointer-events-auto px-6 py-4 bg-[#020308]/40 backdrop-blur-md rounded-full border border-[#D4A843]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <a href="mailto:aarish.ai@example.com" className="flex items-center gap-3 text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]">
          <Mail className="w-4 h-4" />
          <span className="font-sans text-[11px] md:text-xs tracking-widest uppercase font-medium">aarish.ai@example.com</span>
        </a>
        
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]">
          <GithubIcon />
          <span className="font-sans text-[11px] md:text-xs tracking-widest uppercase font-medium">GitHub</span>
        </a>
        
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]">
          <LinkedinIcon />
          <span className="font-sans text-[11px] md:text-xs tracking-widest uppercase font-medium">LinkedIn</span>
        </a>
        
        <a href="/CV.pdf" download className="flex items-center gap-3 text-[#D4A843] hover:text-[#FFEDA0] transition-colors drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]">
          <FileText className="w-4 h-4" />
          <span className="font-sans text-[11px] md:text-xs tracking-widest uppercase font-bold">Download CV</span>
        </a>
      </div>
    </div>
  );
}
