export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/10 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-mono text-xs tracking-widest text-white/40 uppercase">
          © {currentYear} KRISHNA JHA
        </span>

        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="https://github.com/ikrishnajha21"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-widest text-white/40 hover:text-white transition-colors uppercase"
          >
            GITHUB
          </a>
          <a
            href="https://www.linkedin.com/in/krishna-jha-59b969303/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-widest text-white/40 hover:text-white transition-colors uppercase"
          >
            LINKEDIN
          </a>

        </div>
      </div>
    </footer>
  );
}
