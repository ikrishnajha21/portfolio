import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header 
      id="site-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md py-4 border-b border-white/10 shadow-sm translate-y-0 opacity-100' 
          : 'bg-transparent py-6 -translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-full w-full px-6 md:px-16 flex flex-row items-center justify-between md:grid md:grid-cols-3">
        {/* Logo */}
        <button 
          id="nav-logo-btn"
          onClick={() => onNavigate('hero')}
          className="font-syne font-extrabold text-xl md:text-2xl tracking-tight text-[#F5F5F5] cursor-pointer hover:opacity-80 transition-opacity justify-self-start"
        >
          KRISHNA JHA
        </button>

        {/* Navigation Links */}
        <nav id="main-navigation" className="flex items-center gap-5 md:gap-7 justify-self-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className="font-sans font-medium text-xs md:text-sm tracking-widest text-[#F5F5F5] relative py-1.5 cursor-pointer hover:opacity-75 transition-opacity"
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div 
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F5F5F5]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Social Buttons - Desktop */}
        <div className="hidden lg:flex items-center gap-3 justify-self-end">
          <a 
            id="social-btn-github"
            href="https://github.com/ikrishnajha21" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-sans font-medium text-[10px] tracking-widest text-[#F5F5F5] border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300 bg-transparent"
          >
            GITHUB
          </a>
          <a 
            id="social-btn-linkedin"
            href="https://www.linkedin.com/in/krishna-jha-59b969303/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-sans font-medium text-[10px] tracking-widest text-[#0A0A0A] bg-[#F5F5F5] px-4 py-2 rounded-full hover:bg-white/90 border border-[#F5F5F5] hover:border-white/90 transition-all duration-300"
          >
            LINKEDIN
          </a>
        </div>
      </div>

      {/* Social Buttons - Mobile Row (Shows at top screen below logo if needed, but keeping navbar minimal) */}
    </header>
  );
}
