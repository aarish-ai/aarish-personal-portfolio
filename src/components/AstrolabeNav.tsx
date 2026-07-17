"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Briefcase, User } from "lucide-react";

export default function AstrolabeNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Work", path: "/work", icon: Briefcase },
    { name: "About", path: "/about", icon: User },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-center justify-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="absolute bottom-4 right-4 w-48 h-48 rounded-full border border-[#D4A843]/30 pointer-events-none"
          >
            {/* Inner Ring */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-dashed border-[#D4A843]/20"
            />
            
            {/* Nav Items placed along the circle arc */}
            {navItems.map((item, index) => {
              // Calculate position on a quarter circle (top-left of the ring since it's bottom-right anchored)
              const angle = (Math.PI / 2) * (index / (navItems.length - 1)) + Math.PI; // from 180 to 270 degrees
              const radius = 70;
              const x = Math.cos(angle) * radius + 96; // 96 is center of 192px (48rem)
              const y = Math.sin(angle) * radius + 96;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,168,67,0.4)] ${isActive ? 'bg-[#D4A843] text-[#080F1C]' : 'bg-[#0F1E35] border border-[#D4A843]/40 text-[#D4A843]'}`}
                  style={{ left: x, top: y }}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Central Hub (Trigger) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-[0_0_30px_rgba(212,168,67,0.2)] transition-colors duration-500 ${isOpen ? 'border-[#D4A843] bg-[#0F1E35]' : 'border-[#D4A843]/50 bg-[#080F1C] hover:border-[#D4A843]'}`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <Compass className="w-8 h-8 text-[#D4A843]" />
        </motion.div>
      </motion.button>
    </div>
  );
}
