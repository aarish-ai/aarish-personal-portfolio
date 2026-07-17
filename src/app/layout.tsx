import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({ 
  weight: ['300', '400', '500', '600', '700'], 
  subsets: ["latin"],
  variable: '--font-cormorant' 
});

import NebulaScene from "@/components/NebulaScene";
import AstrolabeNav from "@/components/AstrolabeNav";

export const metadata: Metadata = {
  title: "Aarish | Portfolio",
  description: "Aarish - Night Study Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased bg-[var(--ink)] text-[var(--ivory)] min-h-screen selection:bg-[var(--gold)]/30 selection:text-[var(--gold)]">
        <NebulaScene />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
        <AstrolabeNav />
      </body>
    </html>
  );
}
