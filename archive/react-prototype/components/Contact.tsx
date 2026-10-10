import { useState } from 'react';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ikrishnajha21@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', text: '' });

    fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formState.name,
        email: formState.email,
        subject: formState.subject || "Collaboration Enquiry",
        message: formState.message,
        _subject: `New portfolio message from ${formState.name}`,
        _captcha: "false"
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Server returned an error status');
      }
      return response.json();
    })
    .then(data => {
      if (data && (data.success === "true" || data.success === true)) {
        setStatus({ type: 'success', text: "✓ Message sent successfully! I'll get back to you within 24 hours." });
        setFormState({ name: '', email: '', subject: '', message: '' });
      } else if (data && data.message && (data.message.toLowerCase().includes('activate') || data.message.toLowerCase().includes('activation'))) {
        setStatus({ type: 'info', text: "✉ Form Activation Required! Please check your email inbox (and spam) for the FormSubmit link to activate." });
        setFormState({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', text: 'Failed to send message: ' + ((data && data.message) || 'Please try again.') });
      }
    })
    .catch(err => {
      console.error("Error sending email:", err);
      setStatus({ type: 'error', text: 'Error sending message. Please try again or email directly.' });
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/ikrishnajha21' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/krishna-jha-59b969303/' },
    { name: 'Email', url: 'mailto:ikrishnajha21@gmail.com' },
  ];

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4">
            GET IN TOUCH
          </p>
          <h2 className="font-syne font-extrabold text-5xl md:text-8xl tracking-tight text-[#F5F5F5] leading-none">
            LET'S <span className="text-transparent stroke-text">WORK</span><br />
            TOGETHER
          </h2>
        </div>

        {/* Email Highlight Block */}
        <div className="mb-20 bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-2">
              SEND AN EMAIL
            </p>
            <a 
              href="mailto:ikrishnajha21@gmail.com"
              className="font-syne font-extrabold text-2xl md:text-4xl text-white hover:text-white/80 transition-colors tracking-wide"
            >
              ikrishnajha21@gmail.com
            </a>
          </div>
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-6 py-3 border border-white/15 hover:border-white/40 rounded-full font-mono text-[11px] tracking-widest text-white uppercase bg-transparent transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                COPIED
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                COPY
              </>
            )}
          </button>
        </div>

        {/* Form + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Form */}
          <div className="lg:col-span-7 space-y-8">
            <p className="font-mono text-xs tracking-widest text-white/40 uppercase">
              Or send a message
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-mono text-[10px] tracking-widest text-white/50 uppercase">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Krishna Jha"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="font-mono text-[10px] tracking-widest text-white/50 uppercase">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="hello@example.com"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="font-mono text-[10px] tracking-widest text-white/50 uppercase">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  placeholder="Collaboration / Project Enquiry"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="font-mono text-[10px] tracking-widest text-white/50 uppercase">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell me about your project..."
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 focus:border-white/30 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-[#F5F5F5] hover:bg-[#EAEAEA] disabled:bg-white/40 text-[#0A0A0A] font-mono text-[11px] tracking-widest uppercase rounded-full flex items-center gap-3 transition-colors cursor-pointer"
                >
                  {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                {status.text && (
                  <p className={`mt-4 font-mono text-xs ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    {status.text}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-12 lg:pl-12">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-green-500/20 bg-green-500/[0.03] rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-green-400 uppercase">
                Available for new projects
              </span>
            </div>

            {/* Social Lists */}
            <div className="space-y-4">
              <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                FIND ME ON
              </p>
              <div className="divide-y divide-white/5 border-t border-b border-white/5">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-4 flex justify-between items-center text-white/70 hover:text-white transition-colors"
                  >
                    <span className="font-syne font-semibold text-base">{link.name}</span>
                    <span className="text-lg opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Meta info */}
            <div className="space-y-6">
              <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase border-b border-white/5 pb-2">
                INFO
              </p>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase mb-1">LOCATION</p>
                  <p className="text-sm font-semibold text-white/90">India 🇮🇳</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase mb-1">RESPONSE TIME</p>
                  <p className="text-sm font-semibold text-white/90">Within 24 hours</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase mb-1">TIME ZONE</p>
                  <p className="text-sm font-semibold text-white/90">IST (UTC+5:30)</p>
                </div>
              </div>
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
