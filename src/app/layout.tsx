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
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <NebulaScene />
        {children}
      </body>
    </html>
  );
}
