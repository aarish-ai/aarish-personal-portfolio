import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 relative">
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-light tracking-widest text-[var(--gold)] drop-shadow-[0_0_25px_rgba(212,168,67,0.3)] serif uppercase">
          Aarish
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--ivory)] opacity-80 max-w-2xl font-light tracking-wide leading-relaxed">
          Crafting immersive digital experiences through engineering and alchemy.
        </p>

        <div className="pt-12">
          <Link 
            href="/work" 
            className="group relative inline-flex items-center gap-4 px-8 py-4 border border-[var(--gold-soft)]/40 rounded-full hover:border-[var(--gold)] bg-[var(--ink-soft)]/50 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.15)]"
          >
            <span className="text-[var(--gold)] uppercase tracking-widest text-sm font-medium">Enter the Study</span>
            <ArrowRight className="w-4 h-4 text-[var(--gold)] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
