"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, FileText, X, Menu } from "lucide-react";

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

export default function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-8 right-8 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#020308]/80 backdrop-blur-md border border-[#D4A843]/30 text-[#D4A843] hover:bg-[#D4A843]/10 hover:border-[#D4A843]/60 transition-all shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-0 w-64 bg-[#020308]/90 backdrop-blur-xl border border-[#D4A843]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            <a href="mailto:hello@example.com" className="flex items-center gap-4 px-6 py-4 text-[#F4ECD8] hover:bg-[#D4A843]/10 hover:text-[#D4A843] transition-colors border-b border-[#D4A843]/10">
              <Mail className="w-4 h-4" />
              <span className="font-sans text-sm tracking-wider">Email</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6 py-4 text-[#F4ECD8] hover:bg-[#D4A843]/10 hover:text-[#D4A843] transition-colors border-b border-[#D4A843]/10">
              <GithubIcon />
              <span className="font-sans text-sm tracking-wider">GitHub</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6 py-4 text-[#F4ECD8] hover:bg-[#D4A843]/10 hover:text-[#D4A843] transition-colors border-b border-[#D4A843]/10">
              <LinkedinIcon />
              <span className="font-sans text-sm tracking-wider">LinkedIn</span>
            </a>
            <a href="/CV.pdf" download className="flex items-center gap-4 px-6 py-4 text-[#D4A843] hover:bg-[#D4A843]/10 transition-colors bg-black/20">
              <FileText className="w-4 h-4" />
              <span className="font-sans text-sm tracking-wider font-bold">Download CV</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
