import fs from 'fs';
import path from 'path';
import TessellationGrid from '@/components/TessellationGrid';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getProjects() {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden pt-16 md:pt-24 pb-20">
      <nav className="absolute top-8 left-8 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <h1 className="text-sm tracking-[0.3em] uppercase text-[var(--gold)] mb-12 opacity-80 text-center">Selected Works</h1>
        <TessellationGrid projects={projects} />
      </div>
    </main>
  );
}
