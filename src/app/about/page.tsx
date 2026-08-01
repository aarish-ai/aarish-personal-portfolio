"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function About() {
  const [showVerse, setShowVerse] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowVerse(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">

      {/* Navigation */}
      <nav className="absolute top-8 left-8 z-50 pointer-events-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold)] transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>
      </nav>

      {/* The Foreground Content Overlay */}
      <div className="relative z-10 w-full flex flex-col items-center justify-start pointer-events-none">
        
        {/* 100vh Spacer: Ensures the user sees the Sea of Stars and Verse before scrolling */}
        <div className="w-full h-[100vh] flex flex-col items-center justify-center relative pb-12">
           
           {/* The Verse */}
           <div className={`transition-opacity duration-[2000ms] ease-in-out flex flex-col items-center gap-6 text-center ${showVerse ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-6xl font-serif text-[#D4A843] drop-shadow-[0_0_15px_rgba(212,168,67,0.3)] leading-relaxed" dir="rtl">
                ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
              </h2>
              <p className="text-[#F4ECD8]/70 font-sans tracking-[0.2em] text-sm uppercase mt-4">
                "All praise is for Allah - the Lord of all Worlds"
              </p>
           </div>

           {/* Subtle Scroll Hint */}
           <div className={`absolute bottom-24 text-[#D4A843]/50 font-sans tracking-[0.3em] text-xs uppercase animate-pulse transition-opacity duration-[2000ms] ${showVerse ? 'opacity-100' : 'opacity-0'}`}>
             Scroll to Unveil
           </div>
        </div>

        {/* The Text Content Container (With soft gradient strip and text shadows) */}
        <div className="w-full max-w-2xl pointer-events-auto pb-64 px-6 md:px-12 relative">
          
          {/* Soft dark strip to dim the corona without hard edges */}
          <div 
            className="absolute inset-0 bg-[#020308]/50 backdrop-blur-[4px] -z-10"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
            }}
          />

          <div className="text-center mb-16 pt-16">
            <span className="text-[#D4A843] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4 drop-shadow-md">Chapter I</span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#F4ECD8] leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">Who Am I?</h1>
          </div>

          <div className="text-[18px] md:text-[22px] font-serif text-[#EBE3D1]/95 leading-relaxed space-y-8 mb-32 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <p>
              <span className="float-left text-8xl leading-[0.7] pr-4 pt-2 text-[#D4A843] drop-shadow-lg">I</span>
              'm an AI student currently pursuing my Bachelors from NUST Islamabad. I'm really passionate about tech in general and specifcally AI, I want to pursue the field of AI engineering - making products that are actually useful and help people, using the power of LLMs, RAG, Agentic AI and much more.
            </p>
            <p>
              On the technical side, I would say I'm really good at the basics of Python, familiar with libraries like TensorFlow, PyTorch, scikit-learn, numpy and pandas - and understand the base concepts of AI. Fuhtermore, I have worked on some projects which has given me exposed me to LLMs, APIs, Vector Databases, REST APIs, Sentence Transformers, Prompt Engineering and Web Scraping. Lastly, as I work on my own projects I've also developed front and backends for them i.e developing complete full stack AI powered applications which are production ready - one of which was deployed and showcased on a Hackathon successfully i.e the Fake Forward App.
            </p>
            <p>
              I'm trying to constantly learn and build something, as of July I'm finalizing my Truth Mirror Project and also starting to build an Execution OS which takes you from meetings to getting work done and no, it's note another AI meeting note taker - and doing AI engineering courses. Feel free to reach out, I don't mind talking to other devs.
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A843]/50 to-transparent my-24" />

          <div className="text-center mb-16">
            <span className="text-[#D4A843] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4">Chapter II</span>
            <h2 className="text-4xl md:text-6xl font-serif text-[#F4ECD8] leading-tight">The Tech</h2>
          </div>

          <div className="space-y-16">
            <div>
              <h3 className="text-sm uppercase tracking-[0.4em] text-[#D4A843] mb-8 font-sans font-bold text-center">Languages & Core</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['Python', 'SQL', 'OOP', 'REST APIs', 'C++', 'Java', 'Version Control'].map(t => (
                  <span key={t} className="px-6 py-2 border border-[#D4A843]/40 rounded-full text-sm font-sans text-[#F4ECD8] tracking-widest backdrop-blur-sm bg-black/20 hover:bg-[#D4A843]/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-[0.4em] text-[#D4A843] mb-8 font-sans font-bold text-center">AI Engineering</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['OpenAI API', 'LangChain', 'LangGraph', 'Pydantic', 'Chroma', 'Hugging Face Transformers', 'Tokenizer', 'Web Scraping', 'FastAPI', 'Flask', 'Django', 'SQLite', 'Docker', 'LLMs', 'Multi-Step Reasoning Workflows', 'Tool Calling', 'Model Routing', 'JSON schema output',  'LLM-as-judge',  'Logging', ].map(t => (
                  <span key={t} className="px-6 py-2 border border-[#D4A843]/40 rounded-full text-sm font-sans text-[#F4ECD8] tracking-widest backdrop-blur-sm bg-black/20 hover:bg-[#D4A843]/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.4em] text-[#D4A843] mb-8 font-sans font-bold text-center">Machine Learning</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['Data Cleaning', 'Model Training', 'Model Evaluation', 'Weights and Biases', 'Linear Algebra', 'Calculus (Multi-Variable)', 'Numerical Methods', 'Linear Regression', 'KNN', 'CNN', 'keras', 'Batch Normalization', 'Transfer Learning', 'Hyperparameter tuning'].map(t => (
                  <span key={t} className="px-6 py-2 border border-[#D4A843]/40 rounded-full text-sm font-sans text-[#F4ECD8] tracking-widest backdrop-blur-sm bg-black/20 hover:bg-[#D4A843]/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
