import projectsData from "../../../data/projects.json";
import PlayingCardsDeck from "@/components/PlayingCardsDeck";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Work() {
  return (
    <main className="flex-1 flex flex-col min-h-screen relative p-6 md:p-12">
      <nav className="absolute top-8 left-8 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>
      
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center mt-16 max-w-7xl mx-auto w-full gap-12 lg:gap-24 relative z-10">
        <PlayingCardsDeck projects={projectsData} />
      </div>
    </main>
  );
}
