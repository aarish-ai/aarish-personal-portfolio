import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ManuscriptBook from "@/components/ManuscriptBook";

export default function About() {
  return (
    <main className="flex-1 flex flex-col min-h-screen relative p-6 md:p-12 overflow-hidden">
      <nav className="absolute top-8 left-8 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>
      
      <div className="flex-1 flex items-center justify-center relative z-10 w-full h-full perspective-1000">
        <ManuscriptBook />
      </div>
    </main>
  );
}
