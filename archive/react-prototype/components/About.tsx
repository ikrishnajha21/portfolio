import HelmetCanvas from './HelmetCanvas';

export default function About() {
  const facts = [
    { label: 'BASED IN', value: 'India 🇮🇳' },
    { label: 'FOCUS', value: 'Frontend · UI/UX · Motion' },
    { label: 'AVAILABLE FOR', value: 'Freelance & Full-time' },
    { label: 'EXPERIENCE', value: '3+ Years' },
  ];

  return (
    <section 
      id="about" 
      className="py-24 md:py-32 border-b border-white/10 relative overflow-hidden"
    >
      {/* Decorative Watermark */}
      <div className="absolute top-10 left-[-20px] font-syne font-extrabold text-[140px] md:text-[280px] text-white/[0.02] leading-none pointer-events-none select-none z-0">
        KJ
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Label and Title */}
        <div className="mb-16 md:mb-24">
          <p className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4">
            THE PERSON BEHIND IT
          </p>
          <h2 className="font-syne font-extrabold text-5xl md:text-8xl tracking-tight text-[#F5F5F5] leading-none">
            ABOUT <span className="text-transparent stroke-text">ME</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Biography & Facts */}
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="font-sans font-light text-lg md:text-xl text-white/80 leading-relaxed">
                Hey, I'm <strong className="font-semibold text-white">Krishna Jha</strong> — a creative developer and designer based in <strong className="font-semibold text-white">India</strong>. I'm passionate about the intersection of design and engineering, building web experiences that feel <strong className="font-semibold text-white">alive, fast, and polished</strong>.
              </p>
              <p className="font-sans font-light text-base md:text-lg text-white/60 leading-relaxed">
                From pixel-perfect UI to performant animations, I care deeply about every detail. I draw inspiration from motion design, film, and architecture — believing that the best digital products feel like extensions of the physical world.
              </p>
            </div>

            {/* Facts Grid */}
            <div className="border-t border-b border-white/10 py-4 divide-y divide-white/5 font-sans">
              {facts.map((fact, index) => (
                <div key={index} className="flex justify-between items-center py-4">
                  <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                    {fact.label}
                  </span>
                  <span className="text-sm font-medium text-white/95">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive 3D Helmet Wireframe Canvas */}
          <div className="w-full flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-10 shadow-inner relative group">
            <div className="absolute top-6 left-6 font-mono text-[10px] tracking-widest text-white/30 uppercase">
              ✦ ROTATING WIREFRAME OBJECT
            </div>
            <div className="w-full h-full max-w-[420px] max-h-[420px]">
              <HelmetCanvas />
            </div>
            <div className="mt-4 font-mono text-[10px] tracking-widest text-white/40 uppercase group-hover:text-white/60 transition-colors">
              DRAG TO ROTATE & HOVER TO EXPLORE
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px #F5F5F5;
        }
      `}</style>
    </section>
  );
}
