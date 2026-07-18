import fs from 'fs';
import path from 'path';
import ConstellationCanvas from '@/components/ConstellationCanvas';
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
    <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
      <nav className="absolute top-8 left-8 z-50 pointer-events-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>

      {/* The Interactive Constellation mounts here, taking full screen */}
      <ConstellationCanvas projects={projects} />
    </main>
  );
}
