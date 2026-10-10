import { useState } from 'react';

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const featuredProjects = [
    {
      id: 'feat-1',
      year: '2024',
      title: 'ARCADIA UI',
      tags: ['React', 'TypeScript', 'Storybook'],
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    },
    {
      id: 'feat-2',
      year: '2024',
      title: 'LUMINARY',
      tags: ['Three.js', 'WebGL', 'GLSL'],
      img: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
    },
  ];

  const allProjects = [
    {
      num: '01',
      name: 'ARCADIA UI',
      cat: 'Design System · React · TypeScript',
      tags: ['React', 'TypeScript', 'Storybook'],
      categories: ['frontend', 'design'],
    },
    {
      num: '02',
      name: 'LUMINARY',
      cat: 'Generative Art · WebGL · Three.js',
      tags: ['Three.js', 'WebGL', 'GLSL'],
      categories: ['frontend', 'motion'],
    },
    {
      num: '03',
      name: 'DRIFT COMMERCE',
      cat: 'E-Commerce · Next.js · Shopify',
      tags: ['Next.js', 'Shopify', 'GSAP'],
      categories: ['fullstack', 'frontend'],
    },
    {
      num: '04',
      name: 'ORBIT MOTION',
      cat: 'Motion Design · GSAP · Canvas',
      tags: ['GSAP', 'Canvas', 'SVG'],
      categories: ['motion', 'design'],
    },
    {
      num: '05',
      name: 'NOVA DASHBOARD',
      cat: 'SaaS Dashboard · React · Node.js',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      categories: ['fullstack'],
    },
    {
      num: '06',
      name: 'PULSE REBRAND',
      cat: 'Brand Design · Figma · Framer',
      tags: ['Figma', 'Framer', 'Brand'],
      categories: ['design'],
    },
    {
      num: '07',
      name: 'SAFEYATRA',
      cat: 'Tourist Travel Safety & AI Companion · Full-Stack',
      tags: ['Tourism Tech', 'Travel Safety', 'React'],
      categories: ['fullstack', 'frontend'],
      url: 'https://safeyatra.ai.studio/',
    },
  ];

  const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'design', label: 'Design' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'motion', label: 'Motion' },
  ];

  const filteredProjects = filter === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.categories.includes(filter));

  return (
    <section id="projects" className="py-24 md:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4">
            SELECTED WORK
          </p>
          <h2 className="font-syne font-extrabold text-5xl md:text-8xl tracking-tight text-[#F5F5F5] leading-none">
            PROJECTS
          </h2>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {featuredProjects.map((proj) => (
            <article 
              key={proj.id} 
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#1A1A1A] cursor-pointer flex flex-col justify-end p-8 border border-white/5"
            >
              <img 
                src={proj.img} 
                alt={proj.title} 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.45] group-hover:scale-[1.03] transition-all duration-700 ease-in-out"
              />
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                ↗
              </div>
              <div className="relative z-10 space-y-3">
                <p className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
                  {proj.year}
                </p>
                <h3 className="font-syne font-extrabold text-2xl md:text-3xl text-white tracking-wide">
                  {proj.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] tracking-widest bg-white/10 text-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Filter Row */}
        <div className="flex items-center justify-between flex-wrap gap-6 mb-12 border-b border-white/10 pb-6">
          <p className="font-mono text-xs tracking-widest text-white/40 uppercase">
            All Projects ({allProjects.length})
          </p>
          
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer border ${
                  filter === btn.id
                    ? 'bg-[#F5F5F5] text-[#0A0A0A] border-[#F5F5F5]'
                    : 'bg-transparent text-white/50 border-white/10 hover:text-white/80 hover:border-white/20'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {filteredProjects.map((proj) => (
            <article 
              key={proj.num}
              onClick={() => (proj as any).url && window.open((proj as any).url, '_blank')}
              className="group relative py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer overflow-hidden"
            >
              {/* Background Slide-in Hover Effect */}
              <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none" />

              <div className="flex items-center gap-6 md:gap-10 relative z-10">
                <span className="font-syne text-sm font-bold text-white/30 group-hover:text-white/60 transition-colors">
                  {proj.num}
                </span>
                <div className="space-y-1">
                  <h3 className="font-syne font-extrabold text-xl md:text-3xl text-white tracking-wide">
                    {proj.name}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-white/40 group-hover:text-white/60 transition-colors">
                    {proj.cat}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end relative z-10">
                <div className="flex gap-2 flex-wrap">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] tracking-widest border border-white/10 text-white/50 group-hover:text-white/80 group-hover:border-white/30 px-3 py-1 rounded-full uppercase transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xl text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                  ↗
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
