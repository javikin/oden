import React, { useState, useEffect } from "react";

export function OdenHeroModern() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
      </style>

      <section className="relative isolate h-screen overflow-hidden bg-black text-white">
        {/* BACKGROUND GRADIENTS */}
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: [
              // Main luminous gradient (orange to red to purple to black)
              "radial-gradient(80% 55% at 50% 52%, rgba(252,127,60,0.45) 0%, rgba(214,76,82,0.46) 27%, rgba(61,36,47,0.38) 47%, rgba(39,38,67,0.45) 60%, rgba(8,8,12,0.92) 78%, rgba(0,0,0,1) 88%)",
              // Warm sweep from top-left
              "radial-gradient(85% 60% at 14% 0%, rgba(255,193,171,0.65) 0%, rgba(233,109,99,0.58) 30%, rgba(48,24,28,0.0) 64%)",
              // Cool rim on top-right
              "radial-gradient(70% 50% at 86% 22%, rgba(88,112,255,0.40) 0%, rgba(16,18,28,0.0) 55%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />

        {/* NAVIGATION */}
        <header className="relative z-10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white" />
              <span className="text-xl font-semibold tracking-tight">Oden Forge</span>
            </div>

            <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
              {['Features','Docs','Examples','Pricing'].map((item)=>(
                <a key={item} className="hover:text-white transition-colors" href="#">{item}</a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <button className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors">Sign in</button>
              <button className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-sm transition hover:bg-white/90">Get Started</button>
            </div>

            <button className="md:hidden rounded-full bg-white/10 px-3 py-2 text-sm">Menu</button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-16 md:py-24 lg:py-28">
          <div className={`mx-auto text-center ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>

            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              LIVING QUALITY GATES
            </span>

            {/* Main Headline */}
            <h1 style={{ animationDelay: '200ms' }} className={`mt-8 text-5xl font-bold tracking-tight md:text-7xl ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              Professional Development<br />
              <span className="text-white/90">with Quality Enforcement</span>
            </h1>

            {/* Subtitle */}
            <p style={{ animationDelay: '300ms' }} className={`mx-auto mt-6 max-w-2xl text-balance text-lg text-white/80 ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              Transform from reactive debugging to proactive quality gates.<br />
              The essential toolkit for professional development teams.
            </p>

            {/* CTA Buttons */}
            <div style={{ animationDelay: '400ms' }} className={`mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <a href="#" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-lg transition hover:bg-white/90 hover:shadow-xl">
                Try Live Demo
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/5">
                View GitHub
              </a>
            </div>
          </div>
        </div>

        {/* TRUSTED BY */}
        <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6 pb-24">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-white/50 mb-6">TRUSTED BY PRODUCTION TEAMS</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
              {["🚑 Cruz Roja", "🏪 SICAR POS", "🚀 Rocket", "⭐ Tu.Coach"].map((brand) => (
                <div key={brand} className="text-sm font-medium text-white/70">{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}