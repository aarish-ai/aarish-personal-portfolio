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
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start pt-[60vh] pb-32 px-6 pointer-events-none">
        
        {/* The Text Content Container */}
        <div className="w-full max-w-3xl pointer-events-auto bg-[#020308]/60 backdrop-blur-md rounded-2xl border border-[#D4A843]/20 p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          <div className="text-center mb-16">
            <span className="text-[#D4A843] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4">Chapter I</span>
            <h1 className="text-5xl md:text-6xl font-serif text-[#F4ECD8] leading-tight">The Alchemist</h1>
          </div>

          <div className="text-[18px] md:text-[20px] font-serif text-[#EBE3D1]/80 leading-relaxed space-y-8 mb-20">
            <p>
              <span className="float-left text-7xl leading-[0.7] pr-3 pt-2 text-[#D4A843]">I</span>
              'm an AI student who'd rather build than just study — most of what I know about machine learning, web systems, and software architecture has come from shipping real projects rather than only coursework.
            </p>
            <p>
              Outside of code, I care a lot about Islamic philosophy — Rumi and Al-Ghazali especially — and about staying genuinely informed on geopolitics and ideas rather than taking headlines at face value.
            </p>
            <p>
              I'm always building something; right now that's a multi-agent fact-checking system and a portfolio that took longer to design than most of my projects.
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A843]/30 to-transparent my-16" />

          <div className="text-center mb-12">
            <span className="text-[#D4A843] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4">Chapter II</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#F4ECD8] leading-tight">The Arsenal</h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-[#D4A843] mb-5 font-sans font-bold text-center">Languages & Core</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++'].map(t => (
                  <span key={t} className="px-4 py-2 bg-white/5 border border-[#D4A843]/30 rounded text-sm font-sans text-[#F4ECD8] tracking-wider">{t}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-[#D4A843] mb-5 font-sans font-bold text-center">Web & Systems</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map(t => (
                  <span key={t} className="px-4 py-2 bg-white/5 border border-[#D4A843]/30 rounded text-sm font-sans text-[#F4ECD8] tracking-wider">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-[#D4A843] mb-5 font-sans font-bold text-center">Machine Learning</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['PyTorch', 'TensorFlow', 'HuggingFace', 'LangChain', 'OpenCV'].map(t => (
                  <span key={t} className="px-4 py-2 bg-white/5 border border-[#D4A843]/30 rounded text-sm font-sans text-[#F4ECD8] tracking-wider">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
