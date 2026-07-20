import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EclipseScene from "@/components/EclipseScene";

export default function About() {
  return (
    <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
      {/* The 3D Eclipse Background */}
      <EclipseScene />

      {/* Navigation */}
      <nav className="absolute top-8 left-8 z-50 pointer-events-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>

      {/* The Foreground Content Overlay */}
      <div className="relative z-10 w-full flex flex-col items-center justify-start pointer-events-none">
        
        {/* 100vh Spacer: Ensures the user only sees the Eclipse when they first load the page */}
        <div className="w-full h-[100vh] flex items-end justify-center pb-24">
           {/* Subtle Scroll Hint */}
           <div className="text-[#D4A843]/50 font-sans tracking-[0.3em] text-xs uppercase animate-pulse">
             Scroll to Unveil
           </div>
        </div>

        {/* The Text Content Container (No Box, pure void overlay) */}
        <div className="w-full max-w-3xl pointer-events-auto pb-64 px-6 md:px-0">
          
          <div className="text-center mb-16">
            <span className="text-[#D4A843] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4">Chapter I</span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#F4ECD8] leading-tight">The Alchemist</h1>
          </div>

          <div className="text-[18px] md:text-[22px] font-serif text-[#EBE3D1]/90 leading-relaxed space-y-8 mb-32 drop-shadow-lg">
            <p>
              <span className="float-left text-8xl leading-[0.7] pr-4 pt-2 text-[#D4A843]">I</span>
              'm an AI student who'd rather build than just study — most of what I know about machine learning, web systems, and software architecture has come from shipping real projects rather than only coursework.
            </p>
            <p>
              Outside of code, I care a lot about Islamic philosophy — Rumi and Al-Ghazali especially — and about staying genuinely informed on geopolitics and ideas rather than taking headlines at face value.
            </p>
            <p>
              I'm always building something; right now that's a multi-agent fact-checking system and a portfolio that took longer to design than most of my projects.
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A843]/50 to-transparent my-24" />

          <div className="text-center mb-16">
            <span className="text-[#D4A843] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4">Chapter II</span>
            <h2 className="text-4xl md:text-6xl font-serif text-[#F4ECD8] leading-tight">The Arsenal</h2>
          </div>

          <div className="space-y-16">
            <div>
              <h3 className="text-sm uppercase tracking-[0.4em] text-[#D4A843] mb-8 font-sans font-bold text-center">Languages & Core</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++'].map(t => (
                  <span key={t} className="px-6 py-2 border border-[#D4A843]/40 rounded-full text-sm font-sans text-[#F4ECD8] tracking-widest backdrop-blur-sm bg-black/20 hover:bg-[#D4A843]/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-[0.4em] text-[#D4A843] mb-8 font-sans font-bold text-center">Web & Systems</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map(t => (
                  <span key={t} className="px-6 py-2 border border-[#D4A843]/40 rounded-full text-sm font-sans text-[#F4ECD8] tracking-widest backdrop-blur-sm bg-black/20 hover:bg-[#D4A843]/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.4em] text-[#D4A843] mb-8 font-sans font-bold text-center">Machine Learning</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['PyTorch', 'TensorFlow', 'HuggingFace', 'LangChain', 'OpenCV'].map(t => (
                  <span key={t} className="px-6 py-2 border border-[#D4A843]/40 rounded-full text-sm font-sans text-[#F4ECD8] tracking-widest backdrop-blur-sm bg-black/20 hover:bg-[#D4A843]/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
