export default function Experience() {
  const items = [
    {
      date: '2024 — PRESENT',
      role: 'FRONTEND DEVELOPER',
      company: 'Freelance / Independent',
      desc: 'Building custom web experiences for clients worldwide. Specialising in interactive, animation-rich frontends with a focus on performance and accessibility.',
    },
    {
      date: '2023 — 2024',
      role: 'UI DEVELOPER INTERN',
      company: 'Tech Startup',
      desc: "Contributed to the company's core product UI, built reusable component libraries, and implemented design-to-code workflows using Figma and React.",
    },
    {
      date: '2021 — 2023',
      role: 'DESIGN & DEV LEAD',
      company: 'College Tech Club',
      desc: 'Led a team of 12 to build and launch 5+ web projects. Organised design sprints, hackathons, and workshops on modern frontend tooling.',
    },
  ];

  return (
    <section 
      id="experience" 
      className="py-24 md:py-32 border-b border-white/10 bg-[#0C0C0C]/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Label & Title */}
        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4">
            MY TIMELINE
          </p>
          <h2 className="font-syne font-extrabold text-4xl md:text-7xl tracking-tight text-[#F5F5F5] leading-none">
            EXPERIENCE
          </h2>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-16 space-y-12">
          {items.map((item, index) => (
            <div key={index} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-4 h-4 bg-[#0A0A0A] border border-white/30 rounded-full group-hover:border-white transition-colors" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-baseline">
                {/* Date */}
                <div className="font-mono text-xs tracking-widest text-white/40 uppercase">
                  {item.date}
                </div>

                {/* Role, Company and Description */}
                <div className="md:col-span-3 space-y-3">
                  <h3 className="font-syne font-extrabold text-xl md:text-2xl tracking-wide text-white group-hover:opacity-90 transition-opacity">
                    {item.role}
                  </h3>
                  <p className="font-mono text-xs tracking-widest text-white/50 uppercase">
                    {item.company}
                  </p>
                  <p className="font-sans font-light text-sm md:text-base text-white/60 leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
