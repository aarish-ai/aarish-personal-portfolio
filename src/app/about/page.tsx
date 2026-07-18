import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AlchemistDesk from "@/components/AlchemistDesk";

export default function About() {
  return (
    <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
      <nav className="absolute top-8 left-8 z-50 pointer-events-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>

      <AlchemistDesk />
    </main>
  );
}
