import { useState, useEffect } from 'react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fail-safe fallback: Dismiss loading spinner after 2500ms if iframe onLoad is blocked/delayed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="hero" 
      className="h-screen w-full bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center"
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] z-10 gap-4">
          <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="font-mono text-xs tracking-widest text-white/60 uppercase animate-pulse">
            LOADING PORTFOLIO INTERFACE...
          </p>
        </div>
      )}
      <iframe
        src="https://portfoliokkkk.framer.website/"
        className="absolute top-0 left-0 w-full h-[calc(100%+120px)] border-0 m-0 p-0 z-0 overflow-hidden"
        title="Krishna Jha Portfolio Hero"
        scrolling="no"
        onLoad={() => setIsLoading(false)}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerPolicy="no-referrer"
      />
    </section>
  );
}
