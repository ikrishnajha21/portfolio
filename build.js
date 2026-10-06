const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script>
    // Robust cross-origin third-party script error silencer (e.g., from Framer or sandboxed iframe platform)
    window.addEventListener('error', function(e) {
      if (e.message && (e.message.includes('Script error.') || e.message.includes('Unexpected token') || e.message.includes('cross-origin'))) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KRISHNA JHA — Portfolio</title>
  <meta name="description" content="Krishna Jha — Creative Developer & Designer.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕷</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  
  <style>
    /* ── Seamless Multi-Section Scroll Flow Structure ── */
    html, body {
      width: 100%;
      height: auto;
      overflow-x: hidden;
      overflow-y: auto;
      background: #ebebeb;
      scroll-behavior: auto !important;
    }
    
    #hero-section {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #ebebeb;
    }

    #hero {
      position: absolute;
      top: 0; left: 0; width: 100%; height: calc(100% + 80px);
      border: none;
      z-index: 1;
    }

    /* Page navigation anchors inside hero section */
    .page-nav {
      position: absolute; bottom: 18px; left: 28px;
      z-index: 100; display: flex; gap: 18px;
    }
    .page-nav a {
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: #555; transition: color 0.2s;
    }
    .page-nav a:hover { color: #0a0a0a; }

    /* Scroll hint bouncing arrow */
    .scroll-hint {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      cursor: pointer;
      color: #0a0a0a;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translate(-50%, 0); }
      40% { transform: translate(-50%, -6px); }
      60% { transform: translate(-50%, -3px); }
    }

    /* Page section wrappers */
    .scroll-section {
      position: relative;
      width: 100%;
      background: var(--bg);
    }
  </style>
</head>
<body>

  <!-- Page Loader (Uiverse.io by JkHuger, customized for Krishna Jha) -->
  <div id="page-loader" class="page-loader-overlay">
    <main id="loader-container">
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div class="dots2">
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
        <div class="dot2"></div>
      </div>
      <div class="circle"></div>
    </main>
  </div>

<div class="scroll-container">

  <!-- ── Header (Sticky Global Navbar) ── -->
  <header class="site-header nav-hidden">
    <div class="site-header-inner">
      <a href="#hero-section" class="logo">KRISHNA JHA</a>

      <nav class="header-nav" aria-label="Page links">
        <a href="#about"          class="header-nav-link"          id="h-about">01 ABOUT</a>
        <a href="#projects"       class="header-nav-link"          id="h-projects">02 PROJECTS</a>
        <a href="#blog-section"   class="header-nav-link"          id="h-blog">BLOG</a>
        <a href="#leetcode"       class="header-nav-link"          id="h-leetcode">LEETCODE</a>
        <a href="#contact"        class="header-nav-link"          id="h-contact">04 CONTACT</a>
      </nav>

      <nav class="nav-pills" aria-label="Social links">
        <a href="https://github.com/ikrishnajha21" target="_blank" rel="noopener" class="nav-pill outline" id="nav-github">GITHUB</a>
        <a href="https://www.linkedin.com/in/krishna-jha-59b969303/" target="_blank" rel="noopener" class="nav-pill filled" id="nav-linkedin">LINKEDIN</a>
      </nav>
    </div>
  </header>

  <!-- ── 1. Hero Section (Untouched layout & same Framer experience) ── -->
  <section id="hero-section">
    <!-- Interactive Hero imported directly from Framer -->
    <iframe id="hero" src="https://portfoliokkkk.framer.website/" title="Krishna Jha — Hover Reveal" allow="autoplay; fullscreen" scrolling="no"></iframe>


    
    <div class="scroll-hint" onclick="if(lenis) lenis.scrollTo('#about'); else document.querySelector('#about').scrollIntoView({behavior: 'smooth'});">
      <span>SCROLL DOWN</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: bounce 2s infinite;">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </section>

  <!-- ── 2. About Section (Integrated from about.html) ── -->
  <div id="about" class="page-shell scroll-section" style="border-top: 1px solid var(--border); padding-top: 60px;">
    <!-- Page Hero -->
    <section class="page-hero" aria-label="About heading">
      <p class="page-label reveal">About</p>
      <h1 class="page-title reveal reveal-delay-1">
        THE<br>
        <span>PERSON</span><br>
        BEHIND IT
      </h1>
    </section>

    <!-- Bio & Image -->
    <section class="section" aria-label="Biography">
      <div class="about-grid">

        <!-- Left: Text -->
        <div>
          <div class="about-number reveal">KJ</div>

          <p class="bio-text reveal reveal-delay-1">
            Hey, I'm <strong>Krishna Jha</strong> — a creative developer and designer
            based in <strong>India</strong>. I'm passionate about the intersection of
            design and engineering, building web experiences that feel
            <strong>alive, fast, and polished</strong>.
          </p>
          <p class="bio-text reveal reveal-delay-2" style="margin-top:20px;">
            From pixel-perfect UI to performant animations, I care deeply about
            every detail. I draw inspiration from motion design, film, and
            architecture — believing that the best digital products feel like
            extensions of the physical world.
          </p>

          <div class="fact-table reveal reveal-delay-3" role="table" aria-label="About facts">
            <div class="fact-row">
              <span class="fact-key">Based in</span>
              <span class="fact-val">India</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Focus</span>
              <span class="fact-val">Frontend · UI/UX · Motion</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Available for</span>
              <span class="fact-val">Freelance & Full-time</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Experience</span>
              <span class="fact-val">3+ Years</span>
            </div>
          </div>

          <!-- Skills -->
          <div class="skills-wrap reveal reveal-delay-4">
            <span class="skill-tag">HTML5</span>
            <span class="skill-tag">CSS3</span>
            <span class="skill-tag">JavaScript</span>
            <span class="skill-tag">React</span>
            <span class="skill-tag">Next.js</span>
            <span class="skill-tag">Node.js</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">Figma</span>
            <span class="skill-tag">Framer</span>
            <span class="skill-tag">GSAP</span>
            <span class="skill-tag">Three.js</span>
            <span class="skill-tag">WebGL</span>
          </div>
        </div>

        <!-- Right: Image -->
        <div class="about-image-col reveal reveal-delay-1">
          <div class="about-img-frame" id="aboutImgFrame">
            <img
              src="https://framerusercontent.com/images/jn3m32cwp8FMbhBSp3AxbdjaPE4.png"
              alt="Krishna Jha portrait"
              loading="lazy"
            >
            <div class="about-img-reveal" id="aboutImgReveal" aria-hidden="true">
              <img
                src="https://framerusercontent.com/images/jn3m32cwp8FMbhBSp3AxbdjaPE4.png"
                alt=""
                loading="lazy"
                style="width:100%;height:100%;object-fit:cover;object-position:top center;"
              >
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Experience -->
    <section class="section" aria-label="Experience" style="border-top: 1px solid var(--border); padding-top: 80px; padding-bottom: 80px;">
      <p class="section-label reveal">Experience</p>
      <h2 class="section-title reveal">WHERE I<span class="quote-fallback">\'</span>VE<br>WORKED</h2>

      <div class="timeline">

        <article class="timeline-item reveal" id="exp-1">
          <span class="timeline-date">2024 — PRESENT</span>
          <div>
            <h3 class="timeline-role">FRONTEND DEVELOPER</h3>
            <p class="timeline-company">FREELANCE / INDEPENDENT</p>
            <p class="timeline-desc">
              Building custom web experiences for clients worldwide. Specialising in
              interactive, animation-rich frontends with a focus on performance and
              accessibility.
            </p>
          </div>
        </article>

      </div>
    </section>
  </div>

  <!-- Oversized Scroll-Reveal Headline — Made in Evolve-inspired transition beat -->
  <section class="scroll-headline-section" id="philosophy-highlight-section" aria-label="Philosophy highlight">
    <div class="scroll-headline-container">
      <div class="scroll-headline-words">
        <span class="headline-word">BUILDING</span>
        <span class="headline-word">EXPERIENCES</span>
        <span class="headline-word">THAT</span>
        <span class="headline-word">FEEL</span>
        <span class="headline-word">ALIVE,</span>
        <span class="headline-word">FAST,</span>
        <span class="headline-word">AND</span>
        <span class="headline-word">POLISHED.</span>
      </div>
    </div>
  </section>

  <!-- Signature Scroll Motif Strip 1 — Dumeme-inspired ambient texture -->
  <div class="scroll-motif-container" id="scroll-motif-1" aria-hidden="true">
    <div class="scroll-motif-track">
      <div class="scroll-motif-text">DEVELOPER — DESIGNER — CREATIVE — CODER — MOTION — BRAND — DEVELOPER — DESIGNER — CREATIVE — CODER — MOTION — BRAND — DEVELOPER — DESIGNER — CREATIVE — CODER — MOTION — BRAND — &nbsp;</div>
      <div class="scroll-motif-text">DEVELOPER — DESIGNER — CREATIVE — CODER — MOTION — BRAND — DEVELOPER — DESIGNER — CREATIVE — CODER — MOTION — BRAND — DEVELOPER — DESIGNER — CREATIVE — CODER — MOTION — BRAND — &nbsp;</div>
    </div>
  </div>

  <!-- ── 3. Projects Section (Integrated from projects.html) ── -->
  <div id="projects" class="page-shell scroll-section" style="border-top: 1px solid var(--border); padding-top: 60px;">
    <!-- Page Hero -->
    <section class="page-hero" aria-label="Projects heading">
      <p class="page-label reveal">Portfolio</p>
      <h1 class="page-title reveal reveal-delay-1">
        WHAT<br>
        I<span class="quote-fallback">\'</span>VE<br>
        <span>BUILT</span>
      </h1>
    </section>

    <!-- Featured Projects -->
    <section class="section" aria-label="Featured projects">
      <p class="section-label reveal">Featured</p>

      <div class="featured-grid">

        <article class="featured-card reveal" id="feat-1" role="article" aria-label="Project: Arogya-Flow" onclick="window.open('https://arogyaflow.ai.studio', '_blank');">
          <img
            src="src/assets/images/arogya_flow_featured.png"
            alt="Arogya-Flow — intelligent blood bank system"
            loading="lazy"
            referrerPolicy="no-referrer"
          >
          <div class="feat-arrow" aria-hidden="true">
            <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
              <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="featured-card-content">
            <p class="feat-year">2026</p>
            <h2 class="feat-title">AROGYA-FLOW</h2>
            <div class="feat-tags">
              <span class="feat-tag">Health-Tech</span>
              <span class="feat-tag">Real-Time</span>
              <span class="feat-tag">Node.js</span>
            </div>
          </div>
        </article>

        <article class="featured-card reveal reveal-delay-1" id="feat-2" role="article" aria-label="Project: Project Darkyn" onclick="window.open('https://projectdarkyn.ai.studio', '_blank');" style="cursor: pointer;">
          <img
            src="src/assets/images/project_darkyn_featured.png"
            alt="Project Darkyn — tactical defense deck and cybersecurity intelligence suite"
            loading="lazy"
          >
          <div class="feat-arrow" aria-hidden="true">
            <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
              <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="featured-card-content">
            <p class="feat-year">2026</p>
            <h2 class="feat-title">PROJECTDARKYN</h2>
            <div class="feat-tags">
              <span class="feat-tag">Cybersecurity</span>
              <span class="feat-tag">Tactical Deck</span>
              <span class="feat-tag">React</span>
            </div>
          </div>
        </article>

      </div>

      <!-- All Projects List -->
      <p class="section-label reveal" style="margin-bottom:24px; margin-top: 80px;">All Projects</p>

      <!-- Filter Row -->
      <div class="filter-row reveal reveal-delay-1" role="group" aria-label="Project filters">
        <button class="filter-btn active" data-filter="all"        id="filter-all">All</button>
        <button class="filter-btn"        data-filter="frontend"   id="filter-frontend">Frontend</button>
        <button class="filter-btn"        data-filter="design"     id="filter-design">Design</button>
        <button class="filter-btn"        data-filter="fullstack"  id="filter-fullstack">Full-Stack</button>
        <button class="filter-btn"        data-filter="motion"     id="filter-motion">Motion</button>
      </div>

      <div class="project-list" id="project-list">

        <article class="project-item reveal" data-cat="fullstack frontend" id="proj-1" onclick="window.open('https://arogyaflow.ai.studio', '_blank');">
          <span class="proj-num">01</span>
          <div class="proj-main">
            <h2 class="proj-name">AROGYA-FLOW</h2>
            <p class="proj-cat">Real-time Blood Bank · Health-tech</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">An intelligent blood bank infrastructure matching hospital demand with active donors in real-time, inspired by modern health-tech design systems.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>Health-Tech</span>
              <span>Real-Time</span>
              <span>Node.js</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="project-item reveal reveal-delay-1" data-cat="fullstack design" id="proj-2" onclick="window.open('https://projectdarkyn.ai.studio', '_blank');">
          <span class="proj-num">02</span>
          <div class="proj-main">
            <h2 class="proj-name">PROJECTDARKYN</h2>
            <p class="proj-cat">Cybersecurity · Tactical Deck · React</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">This project is Darkyn Cores, a highly polished, terminal-inspired tactical defense deck and cybersecurity intelligence suite styled after the Dark Knight's legendary command systems.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>Cybersecurity</span>
              <span>Tactical Deck</span>
              <span>React</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="project-item reveal reveal-delay-2" data-cat="fullstack frontend" id="proj-7" onclick="window.open('https://remix-india-climate-digital-twin-422592704561.asia-east1.run.app', '_blank');">
          <span class="proj-num">03</span>
          <div class="proj-main">
            <h2 class="proj-name">INDIA CLIMATE DIGITAL TWIN</h2>
            <p class="proj-cat">Climate Digital Twin · React · Satellite Data</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">An interactive climate analysis platform and digital twin of India's subcontinent, processing real-time satellite data and climate models.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>React</span>
              <span>Satellite Data</span>
              <span>AI Models</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="project-item reveal reveal-delay-3" data-cat="frontend motion" id="proj-4" onclick="window.open('https://thechopracase.ai.studio/', '_blank');">
          <span class="proj-num">04</span>
          <div class="proj-main">
            <h2 class="proj-name">THE CHOPRA CASE</h2>
            <p class="proj-cat">Interactive Scrollytelling · GSAP · Canvas</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">THE CHOPRA CASE — Interactive Scrollytelling Investigation. An immersive, high-fidelity scrollytelling visual feature that reconstructs and investigates the infamous 1978 Geeta and Sanjay Chopra kidnapping and homicide case in New Delhi, India.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>GSAP</span>
              <span>Canvas</span>
              <span>Scrollytelling</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="project-item reveal" data-cat="frontend motion" id="proj-6" onclick="window.open('https://krishnasaruniverse.netlify.app/', '_blank');">
          <span class="proj-num">05</span>
          <div class="proj-main">
            <h2 class="proj-name">KRISHNA AI UNIVERSE</h2>
            <p class="proj-cat">Browser AR · MediaPipe · Gesture Tracking</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">Krishna AI Universe is a browser-based AR and AI environment that tracks hand gestures in real-time using MediaPipe. Perform gestures like fist, pinch, and open hand to trigger visual effects and audio.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>Browser AR</span>
              <span>MediaPipe</span>
              <span>Gesture Tracking</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="project-item reveal reveal-delay-1" data-cat="fullstack frontend" id="proj-3" onclick="window.open('https://safeyatra.ai.studio/', '_blank');">
          <span class="proj-num">06</span>
          <div class="proj-main">
            <h2 class="proj-name">SAFEYATRA</h2>
            <p class="proj-cat">Smart Tourism & Safety · AI Travel Companion</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">SafeYatra is an intelligent travel safety and navigation platform crafted for tourists, providing real-time local safety advisories, verified secure routes, emergency SOS assistance, and curated tourist guidance.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>Tourist Tech</span>
              <span>Travel Safety</span>
              <span>Smart Tourism</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="project-item reveal reveal-delay-2" data-cat="fullstack frontend" id="proj-5" onclick="window.open('https://housepricepredictor-183255905777.asia-south1.run.app/', '_blank');">
          <span class="proj-num">07</span>
          <div class="proj-main">
            <h2 class="proj-name">HOUSE PRICE PREDICTOR</h2>
            <p class="proj-cat">Machine Learning · React · Python</p>
            <p class="proj-desc" style="font-size: 14px; margin-top: 8px; color: var(--text-muted); max-width: 550px; line-height: 1.5;">An intelligent web-based application utilizing machine learning models to predict residential housing market prices based on custom location and feature parameters.</p>
          </div>
          <div class="proj-right">
            <div class="proj-tags">
              <span>React</span>
              <span>Python</span>
              <span>Machine Learning</span>
            </div>
            <span class="proj-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

      </div>
    </section>
  </div>

  <!-- Signature Scroll Motif Strip 2 — Dumeme-inspired ambient texture -->
  <div class="scroll-motif-container" id="scroll-motif-2" aria-hidden="true">
    <div class="scroll-motif-track">
      <div class="scroll-motif-text">ARTISTRY — INTERACTION — POLISH — PERFORMANCE — SPEED — DESIGN — ARTISTRY — INTERACTION — POLISH — PERFORMANCE — SPEED — DESIGN — ARTISTRY — INTERACTION — POLISH — PERFORMANCE — SPEED — DESIGN — &nbsp;</div>
      <div class="scroll-motif-text">ARTISTRY — INTERACTION — POLISH — PERFORMANCE — SPEED — DESIGN — ARTISTRY — INTERACTION — POLISH — PERFORMANCE — SPEED — DESIGN — ARTISTRY — INTERACTION — POLISH — PERFORMANCE — SPEED — DESIGN — &nbsp;</div>
    </div>
  </div>

  <!-- ── 4. Blog Section (NEW section between Projects & Contact) ── -->
  <div id="blog-section" class="page-shell scroll-section" style="border-top: 1px solid var(--border); padding-top: 60px;">
    <!-- Page Hero -->
    <section class="page-hero" aria-label="Blog heading">
      <p class="page-label reveal">Writing</p>
      <h1 class="page-title reveal reveal-delay-1">
        THOUGHTS<br>
        <span>I<span class="quote-fallback">\'</span>VE SHARED</span>
      </h1>
    </section>

    <!-- Blog Grid -->
    <section class="section" aria-label="Blog posts list" style="padding-bottom: 80px;">
      <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; margin-top: 24px; margin-bottom: 56px;">
        
        <article class="blog-card reveal" style="background: #ffffff; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.3s ease; height: 320px; cursor: pointer;" id="blog-1" onclick="window.open('https://medium.com/@jhak99797/from-senet-to-starcraft-how-ancient-games-shaped-professional-pc-gaming-8f85da6757fe?sharedUserId=jhak99797', '_blank');">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 999px;">Ludology &bull; Esports</span>
              <span style="font-size: 11px; color: var(--text-muted);">6 min read</span>
            </div>
            <h3 class="blog-title" style="font-family: var(--font-display); font-size: 22px; line-height: 1.25; letter-spacing: -0.01em; color: var(--text); margin-bottom: 12px; transition: color 0.2s;">From Senet to StarCraft: How Ancient Games Shaped Professional PC Gaming</h3>
            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">Tracing how ancient board games informed the strategic frameworks, cognitive loops, and design mechanics of modern competitive PC gaming.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
            <span style="font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase;">February 2026</span>
            <span class="blog-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="blog-card reveal reveal-delay-1" style="background: #ffffff; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.3s ease; height: 320px; cursor: pointer;" id="blog-2" onclick="window.open('https://medium.com/@jhak99797/from-vedas-to-virtual-reality-how-ancient-indian-knowledge-shaped-modern-technology-but-was-1990e2b31005?sharedUserId=jhak99797', '_blank');">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 999px;">Philosophy &bull; Computation</span>
              <span style="font-size: 11px; color: var(--text-muted);">8 min read</span>
            </div>
            <h3 class="blog-title" style="font-family: var(--font-display); font-size: 22px; line-height: 1.25; letter-spacing: -0.01em; color: var(--text); margin-bottom: 12px; transition: color 0.2s;">From Vedas to VR: Ancient Indian Knowledge & Modern Tech</h3>
            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">Investigating the deep mathematical foundations of Vedic knowledge and its unrecognized contributions to binary logic, linguistics, and computing.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
            <span style="font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase;">March 2026</span>
            <span class="blog-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

        <article class="blog-card reveal reveal-delay-2" style="background: #ffffff; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.3s ease; height: 320px; cursor: pointer;" id="blog-3" onclick="window.open('https://medium.com/@jhak99797/blood-at-bronkhorstspruit-the-15-minute-massacre-that-shattered-the-british-empire-e4e8d43a86ab?sharedUserId=jhak99797', '_blank');">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 999px;">History &bull; Empire</span>
              <span style="font-size: 11px; color: var(--text-muted);">7 min read</span>
            </div>
            <h3 class="blog-title" style="font-family: var(--font-display); font-size: 22px; line-height: 1.25; letter-spacing: -0.01em; color: var(--text); margin-bottom: 12px; transition: color 0.2s;">Blood at Bronkhorstspruit: The 15-Minute Massacre</h3>
            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">A gripping military history analysis of the 1880 battle that triggered the First Boer War, disrupting imperial dominance in a matter of minutes.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
            <span style="font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase;">April 2026</span>
            <span class="blog-arrow">
              <svg class="morph-arrow-svg" viewBox="0 0 24 24" width="24" height="24">
                <path class="arrow-path" d="M 6 18 L 18 6 M 10 6 L 18 6 L 18 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
        </article>

      </div>

      <div style="display: flex; justify-content: center;">
        <a href="https://medium.com/@jhak99797" target="_blank" rel="noopener" class="cta-btn" id="blog-view-all">
          VIEW ALL POSTS
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </section>
  </div>

  <!-- ── 5. LeetCode Profile & Activity Graph Section ── -->
  <div id="leetcode" class="page-shell scroll-section" style="border-top: 1px solid var(--border); padding-top: 60px;">
    <!-- Page Hero -->
    <section class="page-hero" aria-label="Coding Activity heading">
      <p class="page-label reveal">Algorithmic & Open Source</p>
      <h1 class="page-title reveal reveal-delay-1">
        CODE<br>
        <span id="activity-title-word">CHALLENGES</span><br>
        & STATS
      </h1>

      <!-- Segmented Interactive Toggle -->
      <div class="reveal reveal-delay-2" style="margin-top: 18px;">
        <div class="activity-toggle-bar" role="tablist" aria-label="Coding platform selector">
          <button
            type="button"
            class="activity-toggle-btn active"
            id="tab-toggle-leetcode"
            role="tab"
            aria-selected="true"
            aria-controls="panel-leetcode"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.738l3.854-4.127 5.406-5.787a1.379 1.379 0 0 0-.969-2.316zm3.692 9.043a1.38 1.38 0 0 0-.979 2.355l4.316 4.316-4.316 4.317a1.38 1.38 0 0 0 1.952 1.951l5.293-5.292a1.38 1.38 0 0 0 0-1.952l-5.293-5.292a1.37 1.37 0 0 0-.973-.403z"/>
            </svg>
            <span>LEETCODE</span>
          </button>
          <button
            type="button"
            class="activity-toggle-btn"
            id="tab-toggle-github"
            role="tab"
            aria-selected="false"
            aria-controls="panel-github"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GITHUB</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Coding Activity Interactive Container -->
    <section class="section" aria-label="Coding statistics and activity graph" style="padding-bottom: 80px;">
      <div class="leetcode-container">

        <!-- ════════ PANEL 1: LEETCODE VIEW ════════ -->
        <div class="activity-view-panel active" id="panel-leetcode" role="tabpanel" aria-labelledby="tab-toggle-leetcode">
          <!-- Top Profile & Summary Card -->
          <div class="leetcode-header-card reveal">
            <div class="leetcode-top-row">
              <div class="leetcode-user-badge">
                <img
                  src="https://assets.leetcode.com/users/krishna217/avatar_1772532596.png"
                  alt="Krishna Jha LeetCode avatar"
                  class="leetcode-avatar-img"
                  id="leetcode-avatar"
                  onerror="this.src='https://leetcode.com/static/images/LeetCode_logo_rvs.png'"
                >
                <div class="leetcode-user-details">
                  <h3 id="leetcode-username">
                    krishna217
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #ffaa00;" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </h3>
                  <p>
                    <span>Global Rank: <strong id="leetcode-global-rank" style="color: var(--text);">#1,623,635</strong></span>
                    <span>·</span>
                    <span id="leetcode-active-days">60 Active Days</span>
                  </p>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px; flex-wrap: wrap;">
                <span class="leetcode-streak-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color: #ffaa00;" aria-hidden="true">
                    <path d="M12 2c.5 2.5 2 4.5 4 6 2.5 1.9 4 4.8 4 8 0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.2 1.5-6.1 4-8 .5 1.5 2 3.5 4 4 0-3 2-6 4-10z"/>
                  </svg>
                  <span id="leetcode-streak-val">49 DAYS STREAK</span>
                </span>
                <a href="https://leetcode.com/u/krishna217/" target="_blank" rel="noopener noreferrer" class="nav-pill filled" style="height: 32px; padding: 0 16px; font-size: 11px;">
                  VIEW ON LEETCODE
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 6px;">
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Quick Stats Numbers -->
            <div class="leetcode-stats-overview">
              <div class="stat-cell">
                <span class="stat-cell-label">Problems Solved</span>
                <span class="stat-cell-val" id="stat-total-solved">105</span>
                <span class="stat-cell-sub">182 Submissions</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Easy</span>
                <span class="stat-cell-val" style="color: #00b8a3;" id="stat-easy-solved">88</span>
                <span class="stat-cell-sub">83.8% of total</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Medium</span>
                <span class="stat-cell-val" style="color: #ffc01e;" id="stat-med-solved">16</span>
                <span class="stat-cell-sub">15.2% of total</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Hard</span>
                <span class="stat-cell-val" style="color: #ff375f;" id="stat-hard-solved">1</span>
                <span class="stat-cell-sub">1.0% of total</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Max Streak</span>
                <span class="stat-cell-val" id="stat-max-streak">49<span style="font-size: 16px; font-weight: normal; margin-left: 2px;">d</span></span>
                <span class="stat-cell-sub">Consistent Daily</span>
              </div>
            </div>
          </div>

          <!-- 3 Progress Breakdown Cards -->
          <div class="leetcode-diff-grid">
            <!-- Easy -->
            <div class="diff-card reveal">
              <div class="diff-card-header">
                <span class="diff-name easy">EASY</span>
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;" id="diff-easy-ratio">88 / 870</span>
              </div>
              <div class="diff-count-num" id="diff-easy-count">88</div>
              <div class="diff-bar-track">
                <div class="diff-bar-fill easy" id="bar-easy" style="width: 10.1%;"></div>
              </div>
              <span style="font-size: 11px; color: var(--text-muted);">Fundamentals, Strings, Arrays & Sorting</span>
            </div>

            <!-- Medium -->
            <div class="diff-card reveal reveal-delay-1">
              <div class="diff-card-header">
                <span class="diff-name medium">MEDIUM</span>
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;" id="diff-med-ratio">16 / 1827</span>
              </div>
              <div class="diff-count-num" id="diff-med-count">16</div>
              <div class="diff-bar-track">
                <div class="diff-bar-fill medium" id="bar-med" style="width: 0.9%;"></div>
              </div>
              <span style="font-size: 11px; color: var(--text-muted);">Hash Tables, Dynamic Programming, Greedy</span>
            </div>

            <!-- Hard -->
            <div class="diff-card reveal reveal-delay-2">
              <div class="diff-card-header">
                <span class="diff-name hard">HARD</span>
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;" id="diff-hard-ratio">1 / 803</span>
              </div>
              <div class="diff-count-num" id="diff-hard-count">1</div>
              <div class="diff-bar-track">
                <div class="diff-bar-fill hard" id="bar-hard" style="width: 0.2%;"></div>
              </div>
              <span style="font-size: 11px; color: var(--text-muted);">Complex Game Theory & Advanced Algos</span>
            </div>
          </div>

          <!-- Interactive Heatmap Activity Graph Card -->
          <div class="leetcode-heatmap-card reveal">
            <div class="heatmap-card-header">
              <div class="heatmap-title-group">
                <h3>SUBMISSION CALENDAR GRAPH</h3>
                <p><span id="heatmap-total-subs">220</span> submissions in the past months · Monochromatic Theme</p>
              </div>
              <div class="heatmap-legend">
                <span>Less</span>
                <div class="legend-box" style="background: #ebedf0;" title="0 submissions"></div>
                <div class="legend-box" style="background: #9be9a8;" title="1-2 submissions"></div>
                <div class="legend-box" style="background: #40c463;" title="3-5 submissions"></div>
                <div class="legend-box" style="background: #30a14e;" title="6-9 submissions"></div>
                <div class="legend-box" style="background: #216e39;" title="10+ submissions"></div>
                <span>More</span>
              </div>
            </div>

            <!-- Heatmap Matrix Grid -->
            <div class="heatmap-scroll-wrapper">
              <div class="heatmap-grid" id="leetcode-heatmap-grid">
                <!-- Dynamically populated with accurate SVG/div day cells -->
              </div>
            </div>
          </div>

          <!-- Recent Solved Problems Card -->
          <div class="leetcode-recent-card reveal">
            <div class="recent-card-header">
              <h3>RECENT ACCEPTED SOLUTIONS</h3>
            </div>
            <div class="recent-list" id="leetcode-recent-list">
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-check-icon">✓</div>
                  <span class="recent-item-title">Remove Duplicates from Sorted Array</span>
                </div>
                <span class="recent-item-time">Recently Solved</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-check-icon">✓</div>
                  <span class="recent-item-title">House Robber</span>
                </div>
                <span class="recent-item-time">Recently Solved</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-check-icon">✓</div>
                  <span class="recent-item-title">Detect Capital</span>
                </div>
                <span class="recent-item-time">Recently Solved</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-check-icon">✓</div>
                  <span class="recent-item-title">Reverse Integer</span>
                </div>
                <span class="recent-item-time">Recently Solved</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-check-icon">✓</div>
                  <span class="recent-item-title">Max Consecutive Ones</span>
                </div>
                <span class="recent-item-time">Recently Solved</span>
              </div>
            </div>
          </div>

          <!-- View on LeetCode button -->
          <div style="display: flex; justify-content: center; margin-top: 8px;">
            <a href="https://leetcode.com/u/krishna217/" target="_blank" rel="noopener noreferrer" class="cta-btn" id="leetcode-view-profile">
              VISIT LEETCODE PROFILE
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- ════════ PANEL 2: GITHUB VIEW ════════ -->
        <div class="activity-view-panel" id="panel-github" role="tabpanel" aria-labelledby="tab-toggle-github">
          <!-- Top GitHub Profile & Summary Card -->
          <div class="leetcode-header-card">
            <div class="leetcode-top-row">
              <div class="leetcode-user-badge">
                <img
                  src="https://avatars.githubusercontent.com/u/252618724?v=4"
                  alt="Krishna Jha GitHub avatar"
                  class="leetcode-avatar-img"
                  id="github-avatar"
                >
                <div class="leetcode-user-details">
                  <h3 id="github-fullname">
                    ikrishnajha21
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: #0a0a0a;" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </h3>
                  <p>
                    <span id="github-bio">Engineering Student · Mumbai, India</span>
                    <span>·</span>
                    <span>Joined 2026</span>
                  </p>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px; flex-wrap: wrap;">
                <span class="leetcode-streak-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #40c463;" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span id="github-contrib-badge">ACTIVE CONTRIBUTOR</span>
                </span>
                <a href="https://github.com/ikrishnajha21" target="_blank" rel="noopener noreferrer" class="nav-pill filled" style="height: 32px; padding: 0 16px; font-size: 11px;">
                  VIEW ON GITHUB
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 6px;">
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Quick GitHub Metrics -->
            <div class="leetcode-stats-overview">
              <div class="stat-cell">
                <span class="stat-cell-label">Public Repos</span>
                <span class="stat-cell-val" id="github-repo-count">30</span>
                <span class="stat-cell-sub">Open Source</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Contributions</span>
                <span class="stat-cell-val" style="color: #216e39;" id="github-contrib-count">86</span>
                <span class="stat-cell-sub">Past Year</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Followers</span>
                <span class="stat-cell-val" id="github-followers">18</span>
                <span class="stat-cell-sub">Developers</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Following</span>
                <span class="stat-cell-val" id="github-following">31</span>
                <span class="stat-cell-sub">Connections</span>
              </div>
              <div class="stat-cell">
                <span class="stat-cell-label">Location</span>
                <span class="stat-cell-val" style="font-size: 22px;">Mumbai</span>
                <span class="stat-cell-sub">India 🇮🇳</span>
              </div>
            </div>
          </div>

          <!-- Interactive GitHub Contributions Graph Card -->
          <div class="leetcode-heatmap-card">
            <div class="heatmap-card-header">
              <div class="heatmap-title-group">
                <h3>GITHUB CONTRIBUTION GRAPH</h3>
                <p><span id="github-total-contribs">86</span> contributions in the last year · Synced from GitHub API</p>
              </div>
              <div class="heatmap-legend">
                <span>Less</span>
                <div class="legend-box" style="background: #ebedf0;" title="0 contributions"></div>
                <div class="legend-box" style="background: #9be9a8;" title="1-2 contributions"></div>
                <div class="legend-box" style="background: #40c463;" title="3-5 contributions"></div>
                <div class="legend-box" style="background: #30a14e;" title="6-9 contributions"></div>
                <div class="legend-box" style="background: #216e39;" title="10+ contributions"></div>
                <span>More</span>
              </div>
            </div>

            <!-- Heatmap Matrix Grid for GitHub -->
            <div class="heatmap-scroll-wrapper">
              <div class="heatmap-grid" id="github-heatmap-grid">
                <!-- Dynamically populated with accurate GitHub contribution cells -->
              </div>
            </div>
          </div>

          <!-- GitHub Repositories Grid Card -->
          <div class="leetcode-recent-card">
            <div class="recent-card-header">
              <h3>FEATURED REPOSITORIES</h3>
            </div>
            <div class="github-repos-grid" id="github-repos-list">
              <!-- Dynamically populated or rendered with active GitHub repos -->
              <div class="github-repo-card" onclick="window.open('https://github.com/ikrishnajha21/portfolio', '_blank')">
                <div>
                  <div class="github-repo-title-row">
                    <h4 class="github-repo-name">portfolio</h4>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </div>
                  <p class="github-repo-desc">Interactive high-performance portfolio crafted with Lenis, GSAP, and modular architecture.</p>
                </div>
                <div class="github-repo-meta">
                  <span class="github-lang-pill"><span class="lang-dot" style="background:#e34c26;"></span> HTML / JS</span>
                  <span>Public</span>
                </div>
              </div>

              <div class="github-repo-card" onclick="window.open('https://github.com/ikrishnajha21/movie_recommendation', '_blank')">
                <div>
                  <div class="github-repo-title-row">
                    <h4 class="github-repo-name">movie_recommendation</h4>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </div>
                  <p class="github-repo-desc">Content-based movie recommendation system built with machine learning techniques.</p>
                </div>
                <div class="github-repo-meta">
                  <span class="github-lang-pill"><span class="lang-dot" style="background:#f1e05a;"></span> JavaScript / ML</span>
                  <span>Public</span>
                </div>
              </div>

              <div class="github-repo-card" onclick="window.open('https://github.com/ikrishnajha21/workshop-react-pixora', '_blank')">
                <div>
                  <div class="github-repo-title-row">
                    <h4 class="github-repo-name">workshop-react-pixora</h4>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </div>
                  <p class="github-repo-desc">Modern interactive image styling and workshop application built with React and CSS.</p>
                </div>
                <div class="github-repo-meta">
                  <span class="github-lang-pill"><span class="lang-dot" style="background:#563d7c;"></span> CSS / React</span>
                  <span>Public</span>
                </div>
              </div>

              <div class="github-repo-card" onclick="window.open('https://github.com/ikrishnajha21/backend', '_blank')">
                <div>
                  <div class="github-repo-title-row">
                    <h4 class="github-repo-name">backend</h4>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </div>
                  <p class="github-repo-desc">Scalable server-side API services and database connectivity modules.</p>
                </div>
                <div class="github-repo-meta">
                  <span class="github-lang-pill"><span class="lang-dot" style="background:#3178c6;"></span> TypeScript / Node</span>
                  <span>Public</span>
                </div>
              </div>
            </div>
          </div>

          <!-- View on GitHub button -->
          <div style="display: flex; justify-content: center; margin-top: 8px;">
            <a href="https://github.com/ikrishnajha21" target="_blank" rel="noopener noreferrer" class="cta-btn" id="github-view-profile">
              VISIT GITHUB PROFILE
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  </div>

  <!-- Signature Scroll Motif Strip 3 — Dumeme-inspired ambient texture -->
  <div class="scroll-motif-container" id="scroll-motif-3" aria-hidden="true">
    <div class="scroll-motif-track">
      <div class="scroll-motif-text">MINIMAL — AUTHENTIC — ELEGANT — INTENTIONAL — FLUID — CLEAN — MINIMAL — AUTHENTIC — ELEGANT — INTENTIONAL — FLUID — CLEAN — MINIMAL — AUTHENTIC — ELEGANT — INTENTIONAL — FLUID — CLEAN — &nbsp;</div>
      <div class="scroll-motif-text">MINIMAL — AUTHENTIC — ELEGANT — INTENTIONAL — FLUID — CLEAN — MINIMAL — AUTHENTIC — ELEGANT — INTENTIONAL — FLUID — CLEAN — MINIMAL — AUTHENTIC — ELEGANT — INTENTIONAL — FLUID — CLEAN — &nbsp;</div>
    </div>
  </div>

  <!-- ── 6. Contact Section (Integrated from contact.html) ── -->
  <div id="contact" class="page-shell scroll-section" style="border-top: 1px solid var(--border); padding-top: 60px;">
    <!-- Page Hero -->
    <section class="page-hero" aria-label="Contact heading">
      <p class="page-label reveal">Contact</p>
      <h1 class="page-title reveal reveal-delay-1">
        LET<span class="quote-fallback">\'</span>S<br>
        <span>WORK</span><br>
        TOGETHER
      </h1>
    </section>

    <!-- Email -->
    <div class="contact-email-wrap">
      <p class="email-label reveal">Send a mail</p>
      <div class="reveal reveal-delay-1 email-row-wrap">
        <a
          href="mailto:ikrishnajha21@gmail.com"
          class="email-link"
          id="contact-email-link"
        >ikrishnajha21@gmail.com</a>
        <button
          class="copy-btn"
          id="copy-email-btn"
          aria-label="Copy email address"
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          COPY
        </button>
      </div>
    </div>

    <!-- Form + Sidebar -->
    <section class="section" aria-label="Contact form">
      <div class="contact-grid">

        <!-- Form -->
        <div>
          <p class="section-label reveal">Or send a message</p>

          <form class="contact-form reveal reveal-delay-1" id="contact-form" novalidate>
            <div class="field-group">
              <label class="field-label" for="field-name">Your Name</label>
              <input
                class="field-input"
                type="text"
                id="field-name"
                name="name"
                placeholder="Krishna Jha"
                autocomplete="name"
                required
              >
              <div class="field-tracer"></div>
            </div>

            <div class="field-group">
              <label class="field-label" for="field-email">Email Address</label>
              <input
                class="field-input"
                type="email"
                id="field-email"
                name="email"
                placeholder="hello@example.com"
                autocomplete="email"
                required
              >
              <div class="field-tracer"></div>
            </div>

            <div class="field-group">
              <label class="field-label" for="field-subject">Subject</label>
              <input
                class="field-input"
                type="text"
                id="field-subject"
                name="subject"
                placeholder="Project enquiry / Collaboration / Just saying hi"
              >
              <div class="field-tracer"></div>
            </div>

            <div class="field-group">
              <label class="field-label" for="field-message">Message</label>
              <textarea
                class="field-textarea"
                id="field-message"
                name="message"
                placeholder="Tell me about your project or what you have in mind..."
                required
              ></textarea>
              <div class="field-tracer"></div>
            </div>

            <div>
              <button type="submit" class="submit-btn" id="form-submit-btn">
                SEND MESSAGE
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <p class="form-status" id="form-status" aria-live="polite"></p>
            </div>
          </form>
        </div>

        <!-- Sidebar -->
        <div class="contact-sidebar">

          <!-- Availability -->
          <div class="availability reveal">
            <div class="avail-dot"></div>
            <span class="avail-text">Available for new projects</span>
          </div>

          <!-- Social links -->
          <div class="reveal reveal-delay-1">
            <p class="sidebar-section-title">Find me on</p>
            <div class="social-list">

              <a
                href="https://github.com/ikrishnajha21"
                target="_blank"
                rel="noopener noreferrer"
                class="social-item"
                id="side-github"
              >
                <span>GitHub</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/krishna-jha-59b969303/"
                target="_blank"
                rel="noopener noreferrer"
                class="social-item"
                id="side-linkedin"
              >
                <span>LinkedIn</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
              </a>

              <a
                href="https://leetcode.com/u/krishna217/"
                target="_blank"
                rel="noopener noreferrer"
                class="social-item"
                id="side-leetcode"
              >
                <span>LeetCode</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
              </a>

              <a
                href="mailto:ikrishnajha21@gmail.com"
                class="social-item"
                id="side-email"
              >
                <span>Email</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
              </a>

            </div>
          </div>

          <!-- Location / response time -->
          <div class="reveal reveal-delay-2">
            <p class="sidebar-section-title">Info</p>
            <div style="display:flex;flex-direction:column;gap:16px;">
              <div>
                <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">Location</p>
                <p style="font-size:15px;font-weight:500;">India 🇮🇳</p>
              </div>
              <div>
                <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">Response Time</p>
                <p style="font-size:15px;font-weight:500;">Within 24 hours</p>
              </div>
              <div>
                <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">Time Zone</p>
                <p style="font-size:15px;font-weight:500;">IST (UTC+5:30)</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer" id="site-foot">
      <div class="site-footer-inner">
        <div class="stripe-divider"></div>
        
        <dl class="footer-details-list">
          <div class="details-item" id="foot-detail-1">
            <dt>Crafted by</dt>
            <dd>
              <a class="link-underline" href="https://github.com/ikrishnajha21" target="_blank" rel="noopener">KRISHNA JHA</a>
            </dd>
          </div>

          <div class="details-item" id="foot-detail-2">
            <dt>Inspired by</dt>
            <dd>
              <ul>
                <li>Tailwind CSS</li>
                <li>shadcn/ui</li>
                <li>Vercel</li>
                <li>Evil Charts</li>
                <li>Devouring Details</li>
                <li>Skiper UI</li>
                <li>Making Software</li>
              </ul>
            </dd>
          </div>

          <div class="details-item" id="foot-detail-3">
            <dt>Deployed on</dt>
            <dd>Cloud Run</dd>
          </div>

          <div class="details-item" id="foot-detail-4">
            <dt>Analytics</dt>
            <dd>
              <ul>
                <li>
                  <a class="link-underline" href="https://openpanel.dev" target="_blank" rel="noopener">OpenPanel</a>
                </li>
                <li>Google Analytics</li>
              </ul>
            </dd>
          </div>

          <div class="details-item" id="foot-detail-5">
            <dt>Source code</dt>
            <dd>
              <a class="link-underline" href="https://github.com/ikrishnajha21" target="_blank" rel="noopener">GitHub</a>
            </dd>
          </div>

          <div class="details-item" id="foot-detail-6">
            <dt>License</dt>
            <dd>
              <a class="link-underline" href="https://github.com/ikrishnajha21" target="_blank" rel="noopener">MIT</a>
            </dd>
          </div>
        </dl>

        <!-- Social media link rows with dividers -->
        <div class="footer-social-row" id="foot-socials">
          <div class="social-row-inner">
            <a class="social-icon-link" href="https://github.com/ikrishnajha21" target="_blank" rel="noopener" aria-label="GitHub Profile" id="foot-soc-gh">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>

            <div class="footer-separator"></div>

            <a class="social-icon-link" href="https://www.linkedin.com/in/krishna-jha-59b969303/" target="_blank" rel="noopener" aria-label="LinkedIn Profile" id="foot-soc-li">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            <div class="footer-separator"></div>

            <a class="social-icon-link" href="https://www.dmca.com/ProtectionPro.aspx" target="_blank" rel="noopener" aria-label="DMCA Protection Status" id="foot-soc-dmca">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <!-- Large Interactive Logotype -->
      <div class="interactive-logotype-container" id="foot-logo-container">
        <div class="interactive-logotype-wrapper" id="footer-interactive-logo">
          <svg class="big-logotype-svg" viewBox="0 0 1410 320" fill="none" xmlns="http://www.w3.org/2000/svg" id="foot-logo-svg">
            <defs>
              <linearGradient id="paint0_linear_1145_73" x1="705" y1="1" x2="705" y2="319" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--text)" stop-opacity="1" />
                <stop offset="1" stop-color="var(--text)" stop-opacity="1" />
              </linearGradient>
            </defs>
            <g class="footer-logo-letters">
              <text class="logo-letter letter-k" x="285" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">K</text>
              <text class="logo-letter letter-r" x="425" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">R</text>
              <text class="logo-letter letter-i" x="565" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">I</text>
              <text class="logo-letter letter-s" x="705" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">S</text>
              <text class="logo-letter letter-h" x="845" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">H</text>
              <text class="logo-letter letter-n" x="985" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">N</text>
              <text class="logo-letter letter-a" x="1125" y="60%" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="240">A</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Built-by Spinner (Acts as Back-to-Top Button) -->
      <div class="footer-spinner-wrap" id="foot-spinner-container" style="cursor: pointer; position: relative;" onclick="if(window.lenis) window.lenis.scrollTo(0); else window.scrollTo({top: 0, behavior: \'smooth\'});" title="Scroll to top">
        <!-- Rotating Text -->
        <div class="spinning-text-container" id="footer-circular-text">
          <svg viewBox="0 0 100 100" style="display: block; width: 100%; height: 100%;">
            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
            <text font-family="var(--font-body)" font-size="6.8" font-weight="600" fill="var(--text-muted)" letter-spacing="1.2">
              <textPath href="#circlePath">CRAFTED WITH CARE BY KRISHNA • CRAFTED WITH CARE BY KRISHNA • </textPath>
            </text>
          </svg>
        </div>
        <!-- Static Center Arrow (pointing directly UP, does not rotate) -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; pointer-events: none; display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </div>
      </div>

    </footer>
  </div>

</div>

<!-- Chapter Wipe Overlay — Dumeme-inspired nav transition -->
<div class="chapter-wipe" id="chapter-wipe" aria-hidden="true"></div>

<!-- Sticky Side Progress Navigation — Zajno-inspired tracking -->
<nav class="side-progress-nav" id="side-progress-nav" aria-label="Progress navigation">
  <a href="#hero-section" class="side-nav-dot-wrap active" data-section="01" aria-label="Go to Hero section">
    <span class="side-nav-num">01</span>
    <span class="side-nav-dot"></span>
    <span class="side-nav-label">Home</span>
  </a>
  <a href="#about" class="side-nav-dot-wrap" data-section="02" aria-label="Go to About section">
    <span class="side-nav-num">02</span>
    <span class="side-nav-dot"></span>
    <span class="side-nav-label">About</span>
  </a>
  <a href="#projects" class="side-nav-dot-wrap" data-section="03" aria-label="Go to Projects section">
    <span class="side-nav-num">03</span>
    <span class="side-nav-dot"></span>
    <span class="side-nav-label">Projects</span>
  </a>
  <a href="#blog-section" class="side-nav-dot-wrap" data-section="04" aria-label="Go to Blog section">
    <span class="side-nav-num">04</span>
    <span class="side-nav-dot"></span>
    <span class="side-nav-label">Blog</span>
  </a>
  <a href="#leetcode" class="side-nav-dot-wrap" data-section="05" aria-label="Go to LeetCode section">
    <span class="side-nav-num">05</span>
    <span class="side-nav-dot"></span>
    <span class="side-nav-label">LeetCode</span>
  </a>
  <a href="#contact" class="side-nav-dot-wrap" data-section="06" aria-label="Go to Contact section">
    <span class="side-nav-num">06</span>
    <span class="side-nav-dot"></span>
    <span class="side-nav-label">Contact</span>
  </a>
</nav>

<!-- Toast element container -->
<div class="toast-container" style="position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 12px; pointer-events: none;"></div>

<!-- CDNs for Premium Core Animations -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"></script>
<script src="script.js"></script>

</body>
</html>`;

fs.writeFileSync('./index.html', html, 'utf8');
console.log('Done! Size:', fs.statSync('./index.html').size, 'bytes');
