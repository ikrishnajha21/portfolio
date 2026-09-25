/**
 * KRISHNA JHA — PORTFOLIO MAIN CORE ANIMATION ENTRY FILE
 *
 * DESIGN & ANIMATION PHILOSOPHY (Apple Hiring Bar):
 * - Timing Eases Chosen:
 *   1. "expo.out" (or custom cubic-bezier(.19, 1, .22, 1)): Extremely fast initial acceleration, then a highly damped decay. Used for primary entrances (headlines, masks) to feel responsive and energetic.
 *   2. "power3.inOut" (or cubic-bezier(.25, 1, .5, 1)): Super smooth transition curves used for state changes, sliding tabs, and magnetic pull releases.
 *   3. "back.out(1.5)": High-precision spring overshoot used very sparingly only for tech badges and tag pop-ins to add physical kinetic feedback.
 * - Physics over generic easing: Smooth scroll tracking via Lenis, interactive 3D orthographic globe, and velocity-based cursor skews are calculated frame-by-frame for natural, organic momentum.
 */

// Global Animation State & Design Tokens
const DesignTokens = {
  colors: {
    bg: '#ebebeb',
    text: '#0a0a0a',
    border: '#d0d0d0',
    muted: '#777777',
    glow: '#c8d8f0',
  },
  easing: {
    expoOut: 'expo.out',
    smoothInOut: 'power3.inOut',
    backOut: 'back.out(1.5)',
    mechanical: 'cubic-bezier(0.25, 1, 0.5, 1)'
  },
  timings: {
    entrance: 1.2,
    stateChange: 0.35,
    staggerFast: 0.04,
    staggerSlow: 0.08
  }
};

// Global Utilities & Helpers
const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. LENIS SMOOTH SCROLL INTEGRATION
   ============================================================ */
let lenis = null;
function initSmoothScroll() {
  if (prefersReducedMotion() || isTouchDevice()) return;
  
  if (typeof Lenis === 'undefined') {
    console.warn("Lenis library is not loaded. Skipping smooth scroll.");
    return;
  }

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    infinite: false,
  });

  // Stop scroll immediately if page-loader is still on the screen
  if (document.getElementById('page-loader')) {
    lenis.stop();
  }

  // Always use standard high-precision requestAnimationFrame loop for Lenis
  function raf(time) {
    if (lenis) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
  }
  requestAnimationFrame(raf);

  // Synchronize ScrollTrigger with Lenis scroll events if loaded
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }
  if (typeof gsap !== 'undefined') {
    gsap.ticker.lagSmoothing(500, 33);
  }
}

/* ============================================================
   2. ROBUST HAND-ROLLED LINE SPLITTER (SplitTextReveal)
   ============================================================ */
class SplitTextReveal {
  static splitLines(element) {
    if (!element) return;
    
    const hasBr = element.querySelector('br') !== null;
    let lines = [];
    
    if (hasBr) {
      // Split by <br> tags to respect intended structural line breaks
      const htmlParts = element.innerHTML.split(/<br\s*\/?>/i);
      lines = htmlParts.map(part => {
        const temp = document.createElement('div');
        temp.innerHTML = part;
        
        // Recursively traverse the DOM to build segments
        function traverse(node, currentOutline = false, currentQuote = false) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            const parts = text.split(/(\s+)/);
            return parts.map(part => {
              if (/\s+/.test(part)) {
                return { isSpace: true };
              } else {
                return {
                  text: part,
                  isOutline: currentOutline,
                  isQuoteFallback: currentQuote
                };
              }
            }).filter(p => p.isSpace || p.text.length > 0);
          }
          
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            let isOutline = currentOutline;
            let isQuote = currentQuote;
            
            if (tagName === 'span') {
              if (node.classList.contains('quote-fallback')) {
                isQuote = true;
              } else {
                isOutline = true;
              }
            }
            
            let segments = [];
            node.childNodes.forEach(child => {
              segments = segments.concat(traverse(child, isOutline, isQuote));
            });
            return segments;
          }
          return [];
        }
        
        const segments = traverse(temp);
        
        let currentWordSegments = [];
        let lineWords = [];
        
        function buildWord(wordSegs) {
          let plainText = '';
          let html = '';
          let isOutline = false;
          
          wordSegs.forEach(seg => {
            plainText += seg.text;
            if (seg.isOutline) {
              isOutline = true;
            }
            if (seg.isQuoteFallback) {
              html += `<span class="quote-fallback">${seg.text}</span>`;
            } else {
              html += seg.text;
            }
          });
          
          const lowerWord = plainText.toLowerCase();
          const keywordOutline = lowerWord.includes('person') || 
                                 lowerWord.includes('work') || 
                                 lowerWord.includes('built') || 
                                 lowerWord.includes('where');
          
          return {
            text: plainText,
            html: html,
            outline: isOutline || keywordOutline
          };
        }
        
        segments.forEach(seg => {
          if (seg.isSpace) {
            if (currentWordSegments.length > 0) {
              lineWords.push(buildWord(currentWordSegments));
              currentWordSegments = [];
            }
          } else {
            currentWordSegments.push(seg);
          }
        });
        if (currentWordSegments.length > 0) {
          lineWords.push(buildWord(currentWordSegments));
        }
        
        return lineWords;
      });
    } else {
      // Fallback: Split into individual words and group by visual top offset
      const text = element.textContent.trim();
      const words = text.split(/\s+/);
      element.innerHTML = '';
  
      const wordSpans = words.map(word => {
        const span = document.createElement('span');
        span.className = 'split-word-measure';
        span.style.display = 'inline-block';
        span.style.whiteSpace = 'nowrap';
        span.textContent = word;
        element.appendChild(span);
        element.appendChild(document.createTextNode(' '));
        return span;
      });
  
      let currentLine = [];
      let lastY = -1;
  
      wordSpans.forEach(span => {
        const y = span.getBoundingClientRect().top;
        if (lastY === -1 || Math.abs(y - lastY) > 6) {
          if (currentLine.length > 0) {
            lines.push(currentLine);
          }
          currentLine = [{ text: span.textContent, html: span.textContent, outline: false }];
          lastY = y;
        } else {
          currentLine.push({ text: span.textContent, html: span.textContent, outline: false });
        }
      });
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
    }
  
    // Clear element and build line structures
    element.innerHTML = '';
    
    lines.forEach((lineWords, lineIdx) => {
      const lineWrapper = document.createElement('div');
      lineWrapper.className = 'split-line-wrapper';
      
      const lineSpan = document.createElement('div');
      lineSpan.className = 'split-line';
      
      // Re-assemble line text, handling fill/outline state
      lineWords.forEach((wordObj, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.innerHTML = (wordObj.html || wordObj.text) + (wordIdx < lineWords.length - 1 ? ' ' : '');
        
        const lowerWord = wordObj.text.toLowerCase();
        if (wordObj.outline || lowerWord.includes('person') || lowerWord.includes('work') || lowerWord.includes('built') || lowerWord.includes('where')) {
          wordSpan.className = 'text-outline';
        } else {
          wordSpan.className = 'text-fill';
        }
        
        lineSpan.appendChild(wordSpan);
      });
      
      lineWrapper.appendChild(lineSpan);
      element.appendChild(lineWrapper);
    });
  }

  static animateReveal(element, delay = 0) {
    if (!element) return;
    const lines = element.querySelectorAll('.split-line');
    if (lines.length === 0) return;

    gsap.fromTo(lines, 
      { yPercent: 110, rotateX: 18 },
      {
        yPercent: 0,
        rotateX: 0,
        duration: DesignTokens.timings.entrance,
        ease: 'power4.out',
        stagger: DesignTokens.timings.staggerSlow,
        delay: delay,
        scrollTrigger: {
          trigger: element,
          start: 'top 95%',
          toggleActions: 'play none none none',
          onEnter: () => {
            element.classList.add('visible');
            element.style.opacity = '1';
          }
        },
        onStart: () => {
          element.classList.add('visible');
          element.style.opacity = '1';
        },
        onComplete: () => {
          // Animate the stroke-width draw-on for outline texts
          const outlines = element.querySelectorAll('.text-outline');
          gsap.fromTo(outlines, 
            { webkitTextStrokeWidth: '0px' },
            { webkitTextStrokeWidth: '1.5px', duration: 0.6, ease: 'power2.out' }
          );
        }
      }
    );
  }
}

/* ============================================================
   3. PREMIUM CONTEXTUAL CUSTOM CURSOR
   ============================================================ */
class Cursor {
  constructor() {
    if (isTouchDevice()) return;
    this.container = document.createElement('div');
    this.container.className = 'custom-cursor';
    this.container.id = 'premium-cursor';
    
    this.label = document.createElement('span');
    this.label.className = 'custom-cursor-label';
    this.container.appendChild(this.label);
    
    document.body.appendChild(this.container);
    
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.lerp = 0.32; // Snappy and ultra-responsive lag-free feel
    this.skew = 0;
    this.prevMouseX = this.mouse.x;
    
    this.initListeners();
    this.loop();
  }

  initListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Ripple effect on click
    window.addEventListener('click', (e) => {
      if (prefersReducedMotion()) return;
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(ripple,
          { scale: 0, opacity: 1, xPercent: -50, yPercent: -50 },
          { scale: 3.5, opacity: 0, duration: 0.55, ease: 'power2.out', onComplete: () => ripple.remove() }
        );
      } else {
        setTimeout(() => ripple.remove(), 550);
      }
    });
  }

  setState(state, options = {}) {
    if (!this.container) return;
    this.container.className = 'custom-cursor'; // reset
    this.container.style.borderStyle = 'solid'; // reset
    this.container.innerHTML = '';
    this.container.appendChild(this.label);
    
    if (state === 'magnetic') {
      this.container.classList.add('magnetic-active');
      this.label.textContent = options.label || 'VIEW';
    } else if (state === 'caret') {
      this.container.classList.add('text-scrub-active');
    } else if (state === 'drag') {
      this.container.classList.add('drag-active');
      this.container.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M5 12l5-5M5 12l5 5M19 12l-5-5M19 12l-5 5"/></svg>`;
    } else if (state === 'rotate') {
      this.container.classList.add('rotate-active');
      // Rotating ring around illustration
      const rotatingRing = document.createElement('div');
      rotatingRing.style.position = 'absolute';
      rotatingRing.style.inset = '-10px';
      rotatingRing.style.border = '1px dashed var(--text)';
      rotatingRing.style.borderRadius = '50%';
      rotatingRing.style.animation = 'cursor-spin 10s linear infinite';
      this.container.appendChild(rotatingRing);
      this.label.textContent = options.label || 'DRAG';
      this.container.appendChild(this.label);
    }
  }

  reset() {
    if (!this.container) return;
    this.container.className = 'custom-cursor';
    this.container.innerHTML = '';
    this.container.appendChild(this.label);
  }

  loop() {
    if (!this.container) return;
    // Lerp position
    const dx = this.mouse.x - this.pos.x;
    const dy = this.mouse.y - this.pos.y;
    this.pos.x += dx * this.lerp;
    this.pos.y += dy * this.lerp;

    // Velocity-based skew (dynamic skew on speed) with smooth lerped rotation
    const velocityX = this.mouse.x - this.prevMouseX;
    const targetSkew = velocityX * 0.08;
    this.skew += (targetSkew - this.skew) * 0.15;
    this.prevMouseX = this.mouse.x;

    // Apply translation with skew rotation and proper centering
    if (!prefersReducedMotion()) {
      this.container.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%) rotate(${this.skew}deg)`;
    } else {
      this.container.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;
    }

    // Hide custom cursor inside the hero section for an ordinary native cursor
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      if (
        this.mouse.x >= rect.left &&
        this.mouse.x <= rect.right &&
        this.mouse.y >= rect.top &&
        this.mouse.y <= rect.bottom
      ) {
        this.container.style.opacity = '0';
        this.container.style.pointerEvents = 'none';
      } else {
        this.container.style.opacity = '1';
        this.container.style.pointerEvents = 'none';
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

// Global Cursor Instance
let globalCursor = null;

/* ============================================================
   4. MAGNETIC BUTTONS AND PILLS (MagneticButton)
   ============================================================ */
class MagneticButton {
  static initAll() {
    // Delegated to the unified, GPU-accelerated initGodLevelMagneticSystem to avoid duplicate event listeners
    if (typeof initGodLevelMagneticSystem === 'function') {
      initGodLevelMagneticSystem();
    }
  }
}

/* ============================================================
   5. GLOBAL SCROLL PROGRESS & SECTION PINNED HANDOFFS
   ============================================================ */
function initGlobalScrollIndicators() {
  // 1. Fixed progress bar at top of screen
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressBar.style.opacity = '0';
  progressBar.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  document.body.appendChild(progressBar);

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
      }
    });

    // Reveal progress bar only after scrolling past the Hero section
    const heroSection = document.querySelector('.page-hero, #hero-section, #hero, .shell');
    if (heroSection) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom top',
        onEnter: () => { progressBar.style.opacity = '1'; },
        onLeaveBack: () => { progressBar.style.opacity = '0'; }
      });
    }
  } else {
    const heroSection = document.querySelector('.page-hero, #hero-section, #hero, .shell');
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = window.scrollY / scrollHeight;
        progressBar.style.width = `${progress * 100}%`;
      }

      const heroHeight = heroSection ? heroSection.offsetHeight : 300;
      if (window.scrollY > heroHeight) {
        progressBar.style.opacity = '1';
      } else {
        progressBar.style.opacity = '0';
      }
    });
  }

  // 2. Active Header Nav Underline Slider
  const nav = document.querySelector('.header-nav');
  if (nav) {
    const activeLink = nav.querySelector('.header-nav-link.active');
    const underline = document.createElement('div');
    underline.className = 'nav-underline';
    nav.appendChild(underline);

    function updateUnderline(target) {
      if (!target) return;
      underline.style.width = `${target.offsetWidth}px`;
      underline.style.left = `${target.offsetLeft}px`;
    }

    // Initial positioning
    setTimeout(() => updateUnderline(activeLink), 150);

    // Slide on hover
    nav.querySelectorAll('.header-nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => updateUnderline(link));
      link.addEventListener('mouseleave', () => {
        const currActive = nav.querySelector('.header-nav-link.active');
        updateUnderline(currActive);
      });
    });
  }

  // 3. Draw hairline dividers on entry
  const hairpins = document.querySelectorAll('.timeline-item, .fact-row .fact-key, .project-item, .contact-email-wrap');
  hairpins.forEach(pin => {
    // Draw in border dynamically
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(pin, 
        { borderBottomColor: 'rgba(0,0,0,0)' },
        { 
          borderBottomColor: 'var(--border)', 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pin,
            start: 'top 92%'
          }
        }
      );
    } else {
      pin.style.borderBottomColor = 'var(--border)';
    }
  });
}

/* ============================================================
   6. INTERACTIVE 3D WIREFRAME GLOBE (WireframeGlobe)
   ============================================================ */
class WireframeGlobe {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'globe-svg');
    this.svg.setAttribute('viewBox', '-200 -200 400 400');
    this.container.appendChild(this.svg);

    this.points = [];
    this.radius = 160;
    this.rotation = { yaw: 0.5, pitch: 0.3 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragRotation = { yaw: 0, pitch: 0 };
    this.velocity = { yaw: 0.005, pitch: 0 };
    this.lastFrameTime = performance.now();
    this.isVisible = false;
    this.rafId = null;

    this.generateSphere();
    this.createStaticPaths();
    this.initInteraction();
    this.initScrollTrigger();
    this.initVisibilityObserver();
  }

  generateSphere() {
    const latCount = 7;
    const lonCount = 12;

    for (let i = 0; i <= latCount; i++) {
      const theta = (i * Math.PI) / latCount - Math.PI / 2;
      for (let j = 0; j < lonCount; j++) {
        const phi = (j * 2 * Math.PI) / lonCount;
        const x = this.radius * Math.cos(theta) * Math.cos(phi);
        const y = this.radius * Math.sin(theta);
        const z = this.radius * Math.cos(theta) * Math.sin(phi);
        this.points.push({ x, y, z, latIndex: i, lonIndex: j });
      }
    }
  }

  createStaticPaths() {
    this.latPaths = [];
    for (let i = 0; i <= 7; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      if (i === 3 || i === 4) path.setAttribute('class', 'globe-major');
      this.svg.appendChild(path);
      this.latPaths.push(path);
    }

    this.lonPaths = [];
    for (let j = 0; j < 12; j++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.svg.appendChild(path);
      this.lonPaths.push(path);
    }
  }

  initVisibilityObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.rafId) {
            this.lastFrameTime = performance.now();
            this.animate();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(this.container);
    } else {
      this.isVisible = true;
      this.animate();
    }
  }

  initInteraction() {
    if (!isTouchDevice()) {
      this.container.addEventListener('mouseenter', () => {
        if (globalCursor) globalCursor.setState('rotate', { label: 'DRAG' });
      });
      this.container.addEventListener('mouseleave', () => {
        if (globalCursor) globalCursor.reset();
      });
    }

    const onDragStart = (clientX, clientY) => {
      this.isDragging = true;
      this.dragStart.x = clientX;
      this.dragStart.y = clientY;
      this.dragRotation.yaw = this.rotation.yaw;
      this.dragRotation.pitch = this.rotation.pitch;
      this.velocity = { yaw: 0, pitch: 0 };
    };

    const onDragMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const dx = clientX - this.dragStart.x;
      const dy = clientY - this.dragStart.y;
      
      const targetYaw = this.dragRotation.yaw + dx * 0.007;
      const targetPitch = this.dragRotation.pitch - dy * 0.007;

      this.velocity.yaw = (targetYaw - this.rotation.yaw) * 0.3;
      this.velocity.pitch = (targetPitch - this.rotation.pitch) * 0.3;

      this.rotation.yaw = targetYaw;
      this.rotation.pitch = Math.max(-Math.PI/2.1, Math.min(Math.PI/2.1, targetPitch));
    };

    const onDragEnd = () => {
      this.isDragging = false;
    };

    const onMouseMove = (e) => onDragMove(e.clientX, e.clientY);
    const onMouseUp = () => {
      onDragEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    this.container.addEventListener('mousedown', (e) => {
      onDragStart(e.clientX, e.clientY);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    const onTouchMove = (e) => {
      if (e.touches.length > 0) onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => {
      onDragEnd();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);
      }
    }, { passive: true });
  }

  initScrollTrigger() {
    if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
      if (this.svg) {
        this.svg.style.opacity = '1';
        this.svg.style.transform = 'scale(1)';
      }
      return;
    }

    ScrollTrigger.create({
      trigger: this.container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        if (!this.isDragging) {
          this.rotation.yaw += self.getVelocity() * 0.0001;
        }
      }
    });

    gsap.fromTo(this.svg,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.container,
          start: 'top 85%',
        }
      }
    );
  }

  animate() {
    if (!this.isVisible) {
      this.rafId = null;
      return;
    }

    if (!this.isDragging) {
      this.rotation.yaw += this.velocity.yaw + 0.0015;
      this.rotation.pitch += this.velocity.pitch;
      this.velocity.yaw *= 0.94;
      this.velocity.pitch *= 0.94;
    }

    this.render();
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  render() {
    const cosYaw = Math.cos(this.rotation.yaw);
    const sinYaw = Math.sin(this.rotation.yaw);
    const cosPitch = Math.cos(this.rotation.pitch);
    const sinPitch = Math.sin(this.rotation.pitch);

    const projected = this.points.map(p => {
      const x1 = p.x * cosYaw - p.z * sinYaw;
      const y1 = p.y;
      const z1 = p.x * sinYaw + p.z * cosYaw;

      const y2 = y1 * cosPitch - z1 * sinPitch;
      const z2 = y1 * sinPitch + z1 * cosPitch;

      return { x: x1, y: y2, z: z2, orig: p };
    });

    // Update latitude rings
    const latCount = 7;
    for (let i = 0; i <= latCount; i++) {
      const ring = projected.filter(p => p.orig.latIndex === i);
      let pathData = '';
      let averageZ = 0;

      for (let k = 0; k < ring.length; k++) {
        const p = ring[k];
        averageZ += p.z;
        pathData += (k === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      }
      pathData += ' Z';

      const ringPath = this.latPaths[i];
      if (ringPath) {
        ringPath.setAttribute('d', pathData);
        const isFront = (averageZ / ring.length) > 0;
        const opacity = (i === 3 || i === 4) ? (isFront ? '0.65' : '0.14') : (isFront ? '0.35' : '0.08');
        ringPath.setAttribute('stroke-opacity', opacity);
      }
    }

    // Update longitude ribs
    const lonCount = 12;
    for (let j = 0; j < lonCount; j++) {
      const ring = projected.filter(p => p.orig.lonIndex === j);
      ring.sort((a, b) => a.orig.latIndex - b.orig.latIndex);

      let pathData = '';
      let averageZ = 0;
      for (let k = 0; k < ring.length; k++) {
        const p = ring[k];
        averageZ += p.z;
        pathData += (k === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      }

      const ribPath = this.lonPaths[j];
      if (ribPath) {
        ribPath.setAttribute('d', pathData);
        const isFront = (averageZ / ring.length) > 0;
        const opacity = (j === 0 || j === 6) ? (isFront ? '0.5' : '0.1') : (isFront ? '0.3' : '0.07');
        ribPath.setAttribute('stroke-opacity', opacity);
      }
    }
  }
}

/* ============================================================
   7. CHOREOGRAPHY FOR ABOUT PAGE
   ============================================================ */
function animateAboutPage() {
  const container = document.querySelector('.about-grid');
  if (!container) return;
  if (typeof gsap === 'undefined') return;

  // Split & reveal heading
  const pageTitle = document.querySelector('#about .page-title');
  if (pageTitle) {
    SplitTextReveal.splitLines(pageTitle);
    SplitTextReveal.animateReveal(pageTitle, 0.1);
  }

  // Eyebrow label slide & tracking tween
  const pageLabel = document.querySelector('#about .page-label');
  if (pageLabel) {
    gsap.fromTo(pageLabel, 
      { opacity: 0, y: 12, letterSpacing: '0.08em' },
      { opacity: 1, y: 0, letterSpacing: '0.15em', duration: 1, ease: 'power3.out' }
    );
  }

  // Waterfall About Number parallax
  const watermark = document.createElement('div');
  watermark.className = 'about-watermark';
  watermark.textContent = 'KJ';
  const parentNode = document.querySelector('.page-shell');
  if (parentNode) {
    parentNode.insertBefore(watermark, parentNode.firstChild);
    
    gsap.fromTo(watermark,
      { y: 80 },
      {
        y: -120,
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // Remove the static KJ element from markup to clean layout
  const staticKj = document.querySelector('.about-number');
  if (staticKj) staticKj.remove();

  // Create Interactive Wireframe Globe in place of portrait image frame
  const colRight = document.querySelector('.about-image-col');
  if (colRight) {
    colRight.innerHTML = ''; // clear portrait frame
    const globeContainer = document.createElement('div');
    globeContainer.className = 'globe-container';
    globeContainer.id = 'interactive-globe';
    colRight.appendChild(globeContainer);

    // Initialize the interactive globe mesh
    new WireframeGlobe('interactive-globe');
  }

  // Staggered reveal for all About Grid elements as they enter the viewport
  const aboutGrid = document.querySelector('.about-grid');
  if (aboutGrid && typeof gsap !== 'undefined') {
    // Select the key info elements inside the grid to orchestrate a unified cascade
    const revealElements = aboutGrid.querySelectorAll('.about-number, .bio-text, .fact-row, .skills-wrap, .about-image-col');
    gsap.fromTo(revealElements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: aboutGrid,
          start: 'top 80%'
        }
      }
    );
  }

  // Tech tags scale with overshoot
  const skillTags = document.querySelectorAll('.skill-tag');
  if (skillTags.length > 0) {
    gsap.fromTo(skillTags,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',
        stagger: 0.025,
        scrollTrigger: {
          trigger: '.skills-wrap',
          start: 'top 90%'
        }
      }
    );
  }

  // Experience timeline cascade and vertical track-line assembly
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const trackLine = document.createElement('div');
    trackLine.className = 'timeline-track-line';
    timeline.insertBefore(trackLine, timeline.firstChild);

    // Scrub timeline vertical connector line
    gsap.fromTo(trackLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: true
        }
      }
    );

    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      gsap.fromTo(timelineItems,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%'
          }
        }
      );
    }
  }
}

/* ============================================================
   8. CHOREOGRAPHY FOR PROJECTS PAGE
   ============================================================ */
class FilterPillMorph {
  constructor() {
    this.row = document.querySelector('.filter-row');
    if (!this.row) return;

    this.bg = document.createElement('div');
    this.bg.className = 'filter-morph-bg';
    this.row.appendChild(this.bg);

    this.buttons = this.row.querySelectorAll('.filter-btn');
    this.init();
  }

  init() {
    const activeBtn = this.row.querySelector('.filter-btn.active') || this.buttons[0];
    this.morphTo(activeBtn, false);

    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.morphTo(btn, true);
        
        // Custom FLIP Filter animation
        this.filterCategory(btn.getAttribute('data-filter'));
      });
    });
  }

  morphTo(target, animate = true) {
    if (!target) return;
    const rowRect = this.row.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const left = targetRect.left - rowRect.left;
    const width = targetRect.width;
    const height = targetRect.height;
    const top = targetRect.top - rowRect.top;

    if (animate && !prefersReducedMotion()) {
      anime({
        targets: this.bg,
        left: left,
        width: width,
        height: height,
        top: top,
        duration: 380,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    } else {
      this.bg.style.left = `${left}px`;
      this.bg.style.width = `${width}px`;
      this.bg.style.height = `${height}px`;
      this.bg.style.top = `${top}px`;
    }
  }

  filterCategory(category) {
    const items = document.querySelectorAll('.project-item');
    if (items.length === 0) return;

    // FLIP technique with GSAP for layout transitions
    const states = [];
    items.forEach(item => {
      states.push({
        el: item,
        rect: item.getBoundingClientRect(),
        display: window.getComputedStyle(item).display
      });
    });

    items.forEach(item => {
      const itemCat = item.getAttribute('data-cat') || '';
      const categories = itemCat.split(' ');
      if (category === 'all' || categories.includes(category)) {
        gsap.to(item, {
          opacity: 1,
          scale: 1,
          height: 'auto',
          padding: '32px 0',
          duration: 0.4,
          ease: 'power3.out',
          onStart: () => {
            item.style.display = 'grid';
          }
        });
      } else {
        gsap.to(item, {
          opacity: 0,
          scale: 0.95,
          height: 0,
          padding: '0 0',
          duration: 0.35,
          ease: 'power3.inOut',
          onComplete: () => {
            item.style.display = 'none';
          }
        });
      }
    });

    // Refresh ScrollTrigger to update checkpoints
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 450);
  }
}

function animateProjectsPage() {
  const list = document.querySelector('.project-list');
  if (!list) return;
  if (typeof gsap === 'undefined') return;

  // Split and reveal heading
  const heading = document.querySelector('#projects .page-title');
  if (heading) {
    SplitTextReveal.splitLines(heading);
    SplitTextReveal.animateReveal(heading, 0.1);
  }

  // Active morphing filtering pill tabs
  new FilterPillMorph();

  // 1. Staggered reveal for Featured Project Cards as they enter the viewport
  const featuredCards = document.querySelectorAll('.featured-grid .featured-card');
  if (featuredCards.length > 0) {
    gsap.fromTo(featuredCards,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: '.featured-grid',
          start: 'top 85%'
        }
      }
    );
  }

  // 2. Staggered reveal for Project List Items as they enter the viewport
  const projectItems = document.querySelectorAll('.project-list .project-item');
  if (projectItems.length > 0) {
    gsap.fromTo(projectItems,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.project-list',
          start: 'top 85%'
        }
      }
    );
  }

  // Floating preview image container setup
  let previewContainer = document.querySelector('.project-preview-container');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.className = 'project-preview-container';
    const previewImg = document.createElement('img');
    previewImg.alt = 'Project Preview';
    previewContainer.appendChild(previewImg);
    document.body.appendChild(previewContainer);
  }
  const previewImg = previewContainer.querySelector('img');

  // Unsplash high-resolution creative imagery for dynamic cursor previews
  const projectImages = {
    'proj-1': 'src/assets/images/arogya_flow_featured.png',
    'proj-2': 'src/assets/images/project_darkyn_featured.png',
    'proj-3': 'src/assets/images/safeyatra_featured.png',
    'proj-4': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    'proj-5': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    'proj-6': 'src/assets/images/krishna_ar_featured.png',
    'proj-7': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80'
  };

  // 3. Project item row hover/focus magnetic interactions and image preview reveals
  const items = document.querySelectorAll('.project-item');
  items.forEach(item => {
    // Inject expanding background bar
    if (!item.querySelector('.project-item-bg')) {
      const bgBar = document.createElement('div');
      bgBar.className = 'project-item-bg';
      item.appendChild(bgBar);
    }

    // Setup interactive events
    if (!isTouchDevice()) {
      const xTo = gsap.quickTo(previewContainer, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(previewContainer, 'y', { duration: 0.45, ease: 'power3.out' });

      item.addEventListener('mouseenter', () => {
        if (globalCursor) globalCursor.setState('magnetic', { label: 'VIEW' });
        
        // Push arrow further up-right
        const arrow = item.querySelector('.proj-arrow');
        if (arrow) gsap.to(arrow, { x: 4, y: -4, scale: 1.1, duration: 0.3, ease: 'back.out(2)' });

        // Update the preview image source and animate it visible
        const imgId = item.id;
        if (imgId && projectImages[imgId]) {
          previewImg.src = projectImages[imgId];
          gsap.to(previewContainer, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
        }

        // Beautiful, stable scale-up
        gsap.to(item, {
          scale: 1.01,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      item.addEventListener('mousemove', (e) => {
        // Move floating preview to center on cursor
        xTo(e.clientX - 140); // Width / 2
        yTo(e.clientY - 90);  // Height / 2
      });

      item.addEventListener('mouseleave', () => {
        if (globalCursor) globalCursor.reset();
        
        const arrow = item.querySelector('.proj-arrow');
        if (arrow) gsap.to(arrow, { x: 0, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });

        // Hide floating preview
        gsap.to(previewContainer, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power3.in' });

        // Reset the item scale smoothly
        gsap.to(item, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      });
    }
  });

  // Cursor feedback on featured cards hover
  const featured = document.querySelectorAll('.featured-card');
  featured.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (globalCursor) globalCursor.setState('magnetic', { label: 'OPEN' });
    });

    card.addEventListener('mouseleave', () => {
      if (globalCursor) globalCursor.reset();
    });
  });
}

/* ============================================================
   9. CHOREOGRAPHY FOR CONTACT PAGE
   ============================================================ */
function animateContactPage() {
  const emailWrap = document.querySelector('.contact-email-wrap');
  if (!emailWrap) return;
  if (typeof gsap === 'undefined') return;

  // Split and reveal heading (DEACTIVATED for Contact Section to allow immediate static display)
  const heading = document.querySelector('#contact .page-title');
  if (heading) {
    heading.classList.add('visible');
    heading.style.opacity = '1';
    heading.style.transform = 'none';
  }

  // Eyebrow label slide (DEACTIVATED for Contact Section to allow immediate static display)
  const label = document.querySelector('#contact .page-label');
  if (label) {
    label.classList.add('visible');
    label.style.opacity = '1';
    label.style.transform = 'none';
  }

  // Fast typing character assemble for email on section reveal
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) {
    const origMail = emailLink.textContent;
    gsap.fromTo(emailLink,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.1,
        scrollTrigger: {
          trigger: emailWrap,
          start: 'top 95%',
          onEnter: () => {
            let tick = 0;
            const interval = setInterval(() => {
              emailLink.textContent = origMail.substring(0, tick) + (tick < origMail.length ? '_' : '');
              tick += 2;
              if (tick > origMail.length) {
                emailLink.textContent = origMail;
                clearInterval(interval);
              }
            }, 18);
          }
        }
      }
    );
  }

  // Copy Email Address custom feedback
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('ikrishnajha21@gmail.com').then(() => {
        copyBtn.classList.add('copied');
        
        // Anime timing feedback
        anime({
          targets: copyBtn,
          scale: [1, 0.92, 1],
          duration: 250,
          easing: 'easeOutQuad'
        });

        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="stroke: #fff;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          COPIED
        `;

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            COPY
          `;
        }, 2200);
      });
    });
  }

  // Form group input interactions
  const fields = document.querySelectorAll('.field-input, .field-textarea');
  fields.forEach(field => {
    field.addEventListener('focus', () => {
      if (globalCursor) globalCursor.setState('caret');
    });
    field.addEventListener('blur', () => {
      if (globalCursor) globalCursor.reset();
    });
  });

/* ============================================================
   8.5 DYNAMIC TOAST NOTIFICATION ENGINE
   ============================================================ */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMarkup = type === 'success'
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  toast.innerHTML = `
    <div class="toast-icon">${iconMarkup}</div>
    <div class="toast-message">${message}</div>
    <div class="toast-close" role="button" aria-label="Close notification">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </div>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Smooth entrance
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Stagger/Animate the toast progress bar depletion
  const progressBar = toast.querySelector('.toast-progress');
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(progressBar, { scaleX: 1 }, { scaleX: 0, duration: 4.0, ease: 'none', transformOrigin: 'left' });
  } else {
    progressBar.style.transition = 'transform 4s linear';
    progressBar.style.transform = 'scaleX(0)';
  }

  const autoDismiss = setTimeout(() => {
    dismissToast(toast);
  }, 4000);

  // Close handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoDismiss);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => {
    toast.remove();
    const container = document.querySelector('.toast-container');
    if (container && container.children.length === 0) {
      container.remove();
    }
  }, 600);
}

  // Contact Form Submission Handler
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('field-name').value.trim();
      const email = document.getElementById('field-email').value.trim();
      const subjectEl = document.getElementById('field-subject');
      const subject = subjectEl ? subjectEl.value.trim() : '';
      const message = document.getElementById('field-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;

      fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject || "Portfolio Collaboration Enquiry",
          message: message,
          _subject: `New portfolio message from ${name}`,
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
          showToast('✓ Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
          form.reset();
        } else if (data && data.message && (data.message.toLowerCase().includes('activate') || data.message.toLowerCase().includes('activation'))) {
          showToast('✉ Form Activation Required! Please check your email inbox (and spam) for the FormSubmit link to activate.', 'info');
          form.reset();
        } else {
          showToast('Failed to send message: ' + ((data && data.message) || 'Please try again or email directly.'), 'error');
        }
      })
      .catch(err => {
        console.error("Error sending message:", err);
        showToast('Error sending message. Please try again or email directly.', 'error');
      })
      .finally(() => {
        submitBtn.innerHTML = `SEND MESSAGE <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        submitBtn.disabled = false;
      });
    });
  }
}

/* ============================================================
   8.8 BLOG SECTION ANIMATION
   ============================================================ */
function animateBlogSection() {
  const grid = document.querySelector('.blog-grid');
  if (!grid) return;
  if (typeof gsap === 'undefined') return;

  // Reveal blog section heading
  const heading = document.querySelector('#blog-section .page-title');
  if (heading) {
    SplitTextReveal.splitLines(heading);
    SplitTextReveal.animateReveal(heading, 0.1);
  }

  // Staggered reveal for Blog Cards
  const cards = document.querySelectorAll('.blog-grid .blog-card');
  if (cards.length > 0) {
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.blog-grid',
          start: 'top 85%'
        }
      }
    );
  }
}

/* ============================================================
   8.9 HERO IFRAME SCROLL TRAP FIX
   ============================================================ */
function initHeroIframeScrollFix() {
  const heroSection = document.getElementById('hero-section');
  const iframe = document.getElementById('hero');
  if (!heroSection || !iframe) return;

  function handleScrollPointerEvents() {
    const scrollY = window.scrollY;
    if (scrollY > 15) {
      iframe.style.pointerEvents = 'none';
    } else {
      iframe.style.pointerEvents = 'auto';
    }
  }

  if (lenis) {
    lenis.on('scroll', (e) => {
      handleScrollPointerEvents();
    });
  } else {
    window.addEventListener('scroll', handleScrollPointerEvents);
  }
}

/* ============================================================
   9.0 PORTFOLIO TRANSLATION ENGINE & DICTIONARY
   ============================================================ */
const Translations = {
  en: {
    '#h-home': 'HOME',
    '#h-about': 'ABOUT',
    '#h-projects': 'PROJECTS',
    '#h-blog': 'BLOG',
    '#h-contact': 'CONTACT',
    '#about .page-label': 'About',
    '#about .page-title': 'THE<br>PERSON<br>BEHIND IT',
    '#about [aria-label="Biography"] .section-label': 'Biography',
    '#about .bio-text:nth-of-type(1)': `Hey, I'm <strong>Krishna Jha</strong> — a creative developer and designer based in <strong>India</strong>. I'm passionate about the intersection of design and engineering, building web experiences that feel <strong>alive, fast, and polished</strong>.`,
    '#about .bio-text:nth-of-type(2)': `From pixel-perfect UI to performant animations, I care deeply about every detail. I draw inspiration from motion design, film, and architecture — believing that the best digital products feel like extensions of the physical world.`,
    '#about .fact-row:nth-child(1) .fact-key': 'Based in',
    '#about .fact-row:nth-child(1) .fact-val': 'India',
    '#about .fact-row:nth-child(2) .fact-key': 'Focus',
    '#about .fact-row:nth-child(2) .fact-val': 'Frontend · UI/UX · Motion',
    '#about .fact-row:nth-child(3) .fact-key': 'Available for',
    '#about .fact-row:nth-child(3) .fact-val': 'Freelance & Full-time',
    '#about .fact-row:nth-child(4) .fact-key': 'Experience',
    '#about .fact-row:nth-child(4) .fact-val': '3+ Years',
    '#about [aria-label="Experience"] .section-label': 'Experience',
    '#about [aria-label="Experience"] .section-title': `WHERE I<span class="quote-fallback">'</span>VE<br>WORKED`,
    '#exp-1 .timeline-date': '2024 — PRESENT',
    '#exp-1 .timeline-role': 'FRONTEND DEVELOPER',
    '#exp-1 .timeline-company': 'Freelance / Independent',
    '#exp-1 .timeline-desc': 'Building custom web experiences for clients worldwide. Specialising in interactive, animation-rich frontends with a focus on performance and accessibility.',
    '#about-cta': 'GET IN TOUCH',
    '.cta-section p': "Have a project or opportunity in mind? Let's build something great.",
    '.cta-section .section-title': "LET<span class=\"quote-fallback\">'</span>S<br>WORK<br>TOGETHER",
    '#projects .page-label': 'Selected Work',
    '#projects .page-title': "WHAT<br>I<span class=\"quote-fallback\">'</span>VE<br><span>BUILT</span>",
    '#projects [aria-label="Featured projects"] .section-label:nth-of-type(1)': 'Featured',
    '#projects [aria-label="Featured projects"] .section-label:nth-of-type(2)': 'All Projects',
    '#filter-all': 'All',
    '#filter-frontend': 'Frontend',
    '#filter-design': 'Design',
    '#filter-fullstack': 'Full-Stack',
    '#filter-motion': 'Motion',
    '#proj-1 .proj-cat': 'Real-time Blood Bank · Health-tech',
    '#proj-1 .proj-desc': 'An intelligent blood bank infrastructure matching hospital demand with active donors in real-time, inspired by modern health-tech design systems.',
    '#proj-2 .proj-cat': 'Cybersecurity · Tactical Deck · React',
    '#proj-2 .proj-desc': 'This project is Darkyn Cores, a highly polished, terminal-inspired tactical defense deck and cybersecurity intelligence suite styled after the Dark Knight\'s legendary command systems.',
    '#proj-3 .proj-cat': 'Smart Tourism & Safety · AI Travel Companion',
    '#proj-3 .proj-desc': 'SafeYatra is an intelligent travel safety and navigation platform crafted for tourists, providing real-time local safety advisories, verified secure routes, emergency SOS assistance, and curated tourist guidance.',
    '#proj-4 .proj-cat': 'Interactive Scrollytelling · GSAP · Canvas',
    '#proj-4 .proj-desc': 'THE CHOPRA CASE — Interactive Scrollytelling Investigation. An immersive, high-fidelity scrollytelling visual feature that reconstructs and investigates the infamous 1978 Geeta and Sanjay Chopra kidnapping and homicide case in New Delhi, India.',
    '#proj-5 .proj-cat': 'Machine Learning · React · Python',
    '#proj-5 .proj-desc': 'An intelligent web-based application utilizing machine learning models to predict residential housing market prices based on custom location and feature parameters.',
    '#proj-6 .proj-cat': 'Browser AR · MediaPipe · Gesture Tracking',
    '#proj-6 .proj-desc': 'Krishna\'s AR Universe is a browser-based AR app that tracks hand gestures in real-time using MediaPipe. Perform gestures like fist, pinch, and open hand to trigger visual effects and audio.',
    '#proj-7 .proj-cat': 'Climate Digital Twin · React · Satellite Data',
    '#proj-7 .proj-desc': "An interactive climate analysis platform and digital twin of India's subcontinent, processing real-time satellite data and climate models.",
    '#contact .page-label': 'Contact',
    '#contact .page-title': "LET<span class=\"quote-fallback\">'</span>S<br><span>WORK</span><br>TOGETHER",
    '.email-label': 'SAY HELLO',
    '.copy-btn .btn-text': 'COPY',
    '.form-label': 'OR FILL THE FORM',
    'label[for="field-name"]': 'Your Name *',
    'label[for="field-email"]': 'Your Email *',
    'label[for="field-message"]': 'Your Message *',
    '#form-submit-btn': 'SEND MESSAGE',
    '.social-label': 'STAY CONNECTED',
    '.site-footer span': '© 2026 KRISHNA JHA',
    '#link-about': 'ABOUT',
    '#link-projects': 'PROJECTS',
    '#link-contact': 'CONTACT'
  },
  es: {
    '#h-home': 'INICIO',
    '#h-about': 'SOBRE MÍ',
    '#h-projects': 'PROYECTOS',
    '#h-blog': 'BLOG',
    '#h-contact': 'CONTACTO',
    '#about .page-label': 'Acerca de',
    '#about .page-title': 'LA<br>PERSONA<br>DETRÁS',
    '#about [aria-label="Biography"] .section-label': 'Biografía',
    '#about .bio-text:nth-of-type(1)': `Hola, soy <strong>Krishna Jha</strong> — un desarrollador y diseñador creativo con sede en la <strong>India</strong>. Me apasiona la intersección del diseño y la ingeniería, creando experiencias web que se sienten <strong>vivas, rápidas y pulidas</strong>.`,
    '#about .bio-text:nth-of-type(2)': `Desde interfaces de usuario pixel-perfect hasta animaciones fluidas, me importa profundamente cada detalle. Me inspiro en el diseño de movimiento, el cine y la arquitectura — creyendo que los mejores productos digitales se sienten como extensiones del mundo físico.`,
    '#about .fact-row:nth-child(1) .fact-key': 'Ubicado en',
    '#about .fact-row:nth-child(1) .fact-val': 'India',
    '#about .fact-row:nth-child(2) .fact-key': 'Especialidad',
    '#about .fact-row:nth-child(2) .fact-val': 'Frontend · UI/UX · Animación',
    '#about .fact-row:nth-child(3) .fact-key': 'Disponible para',
    '#about .fact-row:nth-child(3) .fact-val': 'Proyectos & Tiempo Completo',
    '#about .fact-row:nth-child(4) .fact-key': 'Experiencia',
    '#about .fact-row:nth-child(4) .fact-val': '3+ Años',
    '#about [aria-label="Experience"] .section-label': 'Experiencia',
    '#about [aria-label="Experience"] .section-title': `DÓNDE HE<br>TRABAJADO`,
    '#exp-1 .timeline-date': '2024 — PRESENTE',
    '#exp-1 .timeline-role': 'DESARROLLADOR FRONTEND',
    '#exp-1 .timeline-company': 'Freelance / Independiente',
    '#exp-1 .timeline-desc': 'Creando experiencias web personalizadas para clientes de todo el mundo. Especializado en frontends interactivos y ricos en animaciones con enfoque en rendimiento y accesibilidad.',
    '#about-cta': 'PONTE EN CONTACTO',
    '.cta-section p': '¿Tienes un proyecto o una oportunidad en mente? Construyamos algo grandioso.',
    '.cta-section .section-title': 'TRABAJEMOS<br>JUNTOS',
    '#projects .page-label': 'Trabajo Seleccionado',
    '#projects .page-title': "LO QUE<br>HE<br><span>CONSTRUIDO</span>",
    '#projects [aria-label="Featured projects"] .section-label:nth-of-type(1)': 'Destacados',
    '#projects [aria-label="Featured projects"] .section-label:nth-of-type(2)': 'Todos los Proyectos',
    '#filter-all': 'Todos',
    '#filter-frontend': 'Frontend',
    '#filter-design': 'Diseño',
    '#filter-fullstack': 'Full-Stack',
    '#filter-motion': 'Animación',
    '#proj-1 .proj-cat': 'Banco de Sangre en Tiempo Real · Tec. Médica',
    '#proj-1 .proj-desc': 'Una infraestructura inteligente de banco de sangre que conecta la demanda hospitalaria con donantes activos en tiempo real, inspirada en sistemas de diseño de tecnología médica modernos.',
    '#proj-2 .proj-cat': 'Ciberseguridad · Deck Táctico · React',
    '#proj-2 .proj-desc': 'Este proyecto es Darkyn Cores, una baraja de defensa táctica muy pulida, inspirada en una terminal de comandos, y una suite de inteligencia de ciberseguridad diseñada al estilo de los sistemas de comando legendarios de Dark Knight.',
    '#proj-3 .proj-cat': 'Turismo Inteligente y Seguridad · Asistente de Viaje IA',
    '#proj-3 .proj-desc': 'SafeYatra es una plataforma inteligente de seguridad y navegación de viajes diseñada para turistas, que ofrece avisos locales en tiempo real, rutas seguras verificadas, asistencia SOS de emergencia y orientación turística.',
    '#proj-4 .proj-cat': 'Diseño de Movimiento · GSAP · Canvas',
    '#proj-5 .proj-cat': 'Panel SaaS · React · Node.js',
    '#proj-6 .proj-cat': 'AR en Navegador · MediaPipe · Seguimiento de Gestos',
    '#proj-6 .proj-desc': 'Krishna\'s AR Universe es una aplicación de AR basada en el navegador que rastrea los gestos de las manos en tiempo real utilizando MediaPipe. Realiza gestos como puño, pinza y mano abierta para activar efectos visuales y audio.',
    '#proj-7 .proj-cat': 'Gemelo Digital Climático · React · Datos de Satélite',
    '#proj-7 .proj-desc': 'Una plataforma de análisis climático interactivo y gemelo digital del subcontinente de la India, que procesa datos de satélite y modelos climáticos en tiempo real.',
    '#contact .page-label': 'Contacto',
    '#contact .page-title': 'TRABAJEMOS<br><span>JUNTOS</span>',
    '.email-label': 'DI HOLA',
    '.copy-btn .btn-text': 'COPIAR',
    '.form-label': 'O LLENA EL FORMULARIO',
    'label[for="field-name"]': 'Tu Nombre *',
    'label[for="field-email"]': 'Tu Correo *',
    'label[for="field-message"]': 'Tu Mensaje *',
    '#form-submit-btn': 'ENVIAR MENSAJE',
    '.social-label': 'MANTENTE CONECTADO',
    '.site-footer span': '© 2026 KRISHNA JHA',
    '#link-about': 'SOBRE MÍ',
    '#link-projects': 'PROYECTOS',
    '#link-contact': 'CONTACTO'
  }
};

function applyTranslations(lang) {
  if (!Translations[lang]) return;
  const dict = Translations[lang];
  for (const selector in dict) {
    const el = document.querySelector(selector);
    if (el) {
      if (selector === 'label[for="field-name"]') {
        const input = document.getElementById('field-name');
        if (input) input.placeholder = lang === 'es' ? 'Tu Nombre' : 'Your Name';
      } else if (selector === 'label[for="field-email"]') {
        const input = document.getElementById('field-email');
        if (input) input.placeholder = lang === 'es' ? 'Tu Correo' : 'Your Email';
      } else if (selector === 'label[for="field-message"]') {
        const input = document.getElementById('field-message');
        if (input) input.placeholder = lang === 'es' ? 'Tu Mensaje' : 'Your Message';
      }
      el.innerHTML = dict[selector];
    }
  }
}

function updateLanguageButton(lang) {
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) {
    btn.textContent = lang === 'en' ? 'ES' : 'EN';
  }
}

/* ============================================================
   9.1 ESTIMATED READING TIME SYSTEM
   ============================================================ */
function initReadingTime() {
  // Biography Section (about.html)
  const bioTexts = document.querySelectorAll('.bio-text');
  if (bioTexts.length > 0) {
    let bioWordCount = 0;
    bioTexts.forEach(el => {
      bioWordCount += el.textContent.trim().split(/\s+/).filter(Boolean).length;
    });
    const bioMinutes = Math.ceil(bioWordCount / 200);
    const firstBio = bioTexts[0];
    
    const readLabel = `Biography · ${bioMinutes} min read`;

    if (firstBio && !document.getElementById('bio-reading-time')) {
      const badge = document.createElement('div');
      badge.id = 'bio-reading-time';
      badge.className = 'reading-time-badge about-reading-time';
      badge.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-right:4px;">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
        <span>${readLabel}</span>
      `;
      firstBio.parentNode.insertBefore(badge, firstBio);
    }
  }

  // Project items reading times (projects.html)
  const featuredCards = document.querySelectorAll('.featured-card');
  featuredCards.forEach(card => {
    if (card.querySelector('.reading-time-badge-inline')) return;
    const text = card.textContent.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    
    const tagsContainer = card.querySelector('.feat-tags');
    if (tagsContainer) {
      const badge = document.createElement('span');
      badge.className = 'feat-tag reading-time-badge-inline';
      badge.style.background = 'rgba(255,255,255,0.08)';
      badge.style.border = '1px solid rgba(255,255,255,0.15)';
      badge.innerHTML = `⏱ ${minutes} min read`;
      tagsContainer.appendChild(badge);
    }
  });

  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    if (item.querySelector('.reading-time-badge')) return;
    const text = item.textContent.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    
    const projMain = item.querySelector('.proj-main');
    if (projMain) {
      const badge = document.createElement('div');
      badge.className = 'reading-time-badge';
      badge.style.marginTop = '6px';
      badge.style.display = 'inline-flex';
      badge.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-right:4px;">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
        <span>${minutes} min read</span>
      `;
      projMain.appendChild(badge);
    }
  });
}

/* ============================================================
   9.2 GSAP BACK TO TOP FLOATING BUTTON
   ============================================================ */
function initBackToTop() {
  if (document.getElementById('back-to-top-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'back-to-top-btn';
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;
  document.body.appendChild(btn);

  // Magnetic Pull effect on Hover
  if (typeof MagneticButton !== 'undefined') {
    btn.setAttribute('data-magnetic', '');
    new MagneticButton(btn);
  }

  btn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else if (typeof gsap !== 'undefined') {
      gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'expo.out' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  let secondSection = document.querySelector('section:nth-of-type(2)');
  if (!secondSection) {
    secondSection = document.querySelector('.about-grid') || document.querySelector('.featured-grid') || document.querySelector('.contact-email-wrap');
  }

  if (secondSection && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: secondSection,
      start: 'bottom 20%',
      onEnter: () => {
        gsap.to(btn, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
      },
      onLeaveBack: () => {
        gsap.to(btn, { opacity: 0, y: 20, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
      }
    });
  } else {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        gsap.to(btn, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(btn, { opacity: 0, y: 20, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
      }
    });
  }
}

/* ============================================================
   9.5 REVEAL ANIMATIONS TRIGGER
   ============================================================ */
function initRevealScrollTriggers() {
  const elements = Array.from(document.querySelectorAll('.reveal')).filter(el => {
    // Exclude elements that are animated manually with stagger in About & Projects sections, and disable contact section entirely
    return !el.closest('.about-grid') && 
           !el.closest('.timeline') && 
           !el.closest('.featured-grid') && 
           !el.closest('.project-list') &&
           !el.closest('.filter-row') &&
           !el.closest('#contact');
  });

  if (elements.length === 0) return;

  if (typeof ScrollTrigger !== 'undefined') {
    elements.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        onEnter: () => {
          el.classList.add('visible');
        },
        once: true
      });
    });
  } else {
    // Robust IntersectionObserver fallback for scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    elements.forEach(el => observer.observe(el));
  }
}

/* ============================================================
   9.5 FIXED NAVBAR & HASH SMOOTH SCROLLING
   ============================================================ */
function initFixedNavbarAndSmoothScroll() {
  const fixedNav = document.querySelector('.site-header');
  if (fixedNav && typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    // 1. Scroll-triggered hiding/revealing of navbar (Scroll Down = Hide, Scroll Up = Show, Hidden on Landing page)
    let lastScrollY = window.scrollY;
    let accumulatedScroll = 0;
    const scrollThreshold = 10; // threshold in pixels

    // Ensure hidden initially on load if we are at the top
    if (window.scrollY < 300) {
      fixedNav.classList.add('nav-hidden');
    }

    function handleNavScroll(currentScrollY) {
      const diff = currentScrollY - lastScrollY;
      
      // If we are on the landing page (first section)
      if (currentScrollY < 300) {
        fixedNav.classList.add('nav-hidden');
        fixedNav.style.backgroundColor = 'transparent';
        fixedNav.style.borderBottomColor = 'transparent';
      } else {
        // We scrolled past 300px (approaching about section)
        fixedNav.style.backgroundColor = 'rgba(235, 235, 235, 0.85)';
        fixedNav.style.borderBottomColor = 'rgba(0, 0, 0, 0.06)';
        
        // If we are in the transition zone near the top, keep visible
        if (currentScrollY < 600) {
          fixedNav.classList.remove('nav-hidden');
        } else {
          // Standard show/hide on scroll direction past transition zone
          if (diff > 0) {
            accumulatedScroll += diff;
            if (accumulatedScroll > scrollThreshold) {
              fixedNav.classList.add('nav-hidden');
              accumulatedScroll = 0;
            }
          } else if (diff < 0) {
            accumulatedScroll += diff;
            if (accumulatedScroll < -scrollThreshold) {
              fixedNav.classList.remove('nav-hidden');
              accumulatedScroll = 0;
            }
          }
        }
      }
      lastScrollY = currentScrollY;
    }

    if (lenis) {
      lenis.on('scroll', (e) => {
        handleNavScroll(e.scroll);
      });
    } else {
      window.addEventListener('scroll', () => {
        handleNavScroll(window.scrollY);
      });
    }

    // 2. Active section highlights in fixed navbar with scroll chapter wipe integration
    const sections = [
      { id: '#about', linkId: '#h-about' },
      { id: '#projects', linkId: '#h-projects' },
      { id: '#blog-section', linkId: '#h-blog' },
      { id: '#contact', linkId: '#h-contact' }
    ];

    let currentSectionId = '';

    sections.forEach(sec => {
      const el = document.querySelector(sec.id);
      const link = document.querySelector(sec.linkId);
      if (el && link) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 40%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) {
              document.querySelectorAll('.site-header .header-nav-link').forEach(l => l.classList.remove('active'));
              link.classList.add('active');
              
              // Move sliding underline
              const nav = document.querySelector('.site-header .header-nav');
              const underline = nav ? nav.querySelector('.nav-underline') : null;
              if (underline) {
                underline.style.width = `${link.offsetWidth}px`;
                underline.style.left = `${link.offsetLeft}px`;
              }

              if (currentSectionId !== sec.id) {
                currentSectionId = sec.id;
              }
            }
          }
        });
      }
    });
  }

  // 3. Smooth scrolling click interceptor
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip side progress nav as it has its own specialized handlers
    if (anchor.closest('#side-progress-nav')) return;

    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      // If the target is "#", scroll to top
      if (targetId === '#' || targetId === '#hero-section') {
        if (lenis) lenis.scrollTo(0, { duration: 1.0 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { duration: 1.0 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}

/* ============================================================
   9.8 KEYBOARD SHORTCUT NAVIGATION AND ACCESSIBILITY
   ============================================================ */
function initKeyboardNavigation() {
  const targets = Array.from(document.querySelectorAll('.page-hero, .about-grid, .timeline, .cta-section, .featured-grid, .project-list, .contact-email-wrap, .contact-grid, #hero-section'));
  if (targets.length === 0) return;

  // Add tabindex to section elements for focus management (without highlighting unless tabbed)
  targets.forEach(target => {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.style.outline = 'none';
  });

  window.addEventListener('keydown', (e) => {
    // Prevent interception when the user is typing in form fields
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      let currentIdx = -1;
      // Identify current most prominent section on viewport
      targets.forEach((target, idx) => {
        const rect = target.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom > 140) {
          currentIdx = idx;
        }
      });

      let targetIdx = currentIdx;
      if (e.key === 'ArrowDown') {
        targetIdx = Math.min(targets.length - 1, currentIdx + 1);
        if (currentIdx === -1) targetIdx = 0;
      } else if (e.key === 'ArrowUp') {
        targetIdx = Math.max(0, currentIdx - 1);
      }

      const targetEl = targets[targetIdx];
      if (targetEl) {
        if (typeof lenis !== 'undefined' && lenis) {
          lenis.scrollTo(targetEl, { offset: 0, duration: 1.0 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        targetEl.focus({ preventScroll: true });
      }
    }
  });
}

/* ============================================================
   10. CONTEXTUAL ROUTING ON RUNTIME READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Page Loader Fade-out Handler - Instant and responsive
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    document.body.classList.add('no-scroll');
    
    let isDismissed = false;
    const fadeOutLoader = () => {
      if (isDismissed) return;
      isDismissed = true;

      const finishDismiss = () => {
        if (pageLoader && pageLoader.parentNode) pageLoader.remove();
        document.body.classList.remove('no-scroll');
        if (lenis) lenis.start();
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }

        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            setTimeout(() => {
              if (lenis) {
                lenis.scrollTo(target, { immediate: true });
              } else {
                target.scrollIntoView();
              }
              target.setAttribute('tabindex', '-1');
              target.focus({ preventScroll: true });
            }, 50);
          }
        }
      };

      if (typeof gsap !== 'undefined') {
        gsap.to(pageLoader, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: finishDismiss
        });
      } else {
        pageLoader.classList.add('fade-out');
        setTimeout(finishDismiss, 200);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(fadeOutLoader, 40);
    } else {
      window.addEventListener('load', () => setTimeout(fadeOutLoader, 40));
      setTimeout(fadeOutLoader, 1000); // Fail-safe backup
    }
  }

  // 0. Register ScrollTrigger plugin with GSAP if available
  try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  } catch (err) {
    console.error("Error registering ScrollTrigger:", err);
  }

  // 1. Setup smooth custom cursor
  try {
    if (!isTouchDevice()) {
      globalCursor = new Cursor();
    } else {
      globalCursor = null;
    }
  } catch (err) {
    console.error("Error creating cursor:", err);
  }

  // 2. Initialize smooth scrolling engine
  try {
    initSmoothScroll();
    initHeroIframeScrollFix();
  } catch (err) {
    console.error("Error initializing smooth scroll:", err);
  }

  // 3. Setup core scroll and nav trackers
  try {
    initGlobalScrollIndicators();
  } catch (err) {
    console.error("Error initializing scroll indicators:", err);
  }

  // 4. Initialize premium interactions for standard buttons
  try {
    MagneticButton.initAll();
  } catch (err) {
    console.error("Error initializing magnetic buttons:", err);
  }

  // 4.1 Setup Language Switcher & Translate DOM contents BEFORE text splitting/reveals
  let activeLang = 'en';
  try {
    applyTranslations(activeLang);
  } catch (err) {
    console.error("Error in language setup:", err);
  }

  // 4.2 Initialize Estimated Reading Time badge
  try {
    initReadingTime();
  } catch (err) {
    console.error("Error initializing reading time badge:", err);
  }

  // 4.3 Initialize Back to Top floating button
  try {
    initBackToTop();
  } catch (err) {
    console.error("Error initializing back to top button:", err);
  }

  // 4.5 Setup reveal scroll triggers to transition `.reveal` elements to `.visible`
  try {
    initRevealScrollTriggers();
  } catch (err) {
    console.error("Error initializing reveal scroll triggers:", err);
  }

  // 5. Initialize fixed navbar, smooth scrolling, and all page sections
  try {
    initFixedNavbarAndSmoothScroll();
    animateAboutPage();
    animateProjectsPage();
    animateBlogSection();
    animateContactPage();
    initKeyboardNavigation();
  } catch (err) {
    console.error("Error running single page initialization:", err);
  }

  // 6. INITIALIZE ELITE EXPERIENTIAL ENGINE (10 CATEGORIES)
  try {
    initEliteExperientialEngine();
  } catch (err) {
    console.error("Error launching Elite Experiential Engine:", err);
  }

  // 6.1 INITIALIZE SIGNATURE MOTION SYSTEMS (Dumeme, Made in Evolve, Zajno)
  try {
    initSignatureMotionSystems();
  } catch (err) {
    console.error("Error launching Signature Motion Systems:", err);
  }

  // 6.2 INITIALIZE GOD-LEVEL ANIMATION SUITE (Awwwards / FWA Standard)
  try {
    initGodLevelAnimationSuite();
  } catch (err) {
    console.error("Error launching God-Level Animation Suite:", err);
  }

  // Standard cleanup on ScrollTrigger
  try {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.addEventListener('refresh', () => {
        // Keep Lenis aligned on layout updates
        if (lenis) lenis.resize();
      });
    }
  } catch (err) {
    console.error("Error setting ScrollTrigger refresh:", err);
  }

  // Final safety net: if any reveal element is still hidden, force show them and reset split-lines
  const forceShowAllRevealElements = () => {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
      // If it contains split-lines, ensure they are also forced visible and reset
      el.querySelectorAll('.split-line').forEach(line => {
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf(line);
          gsap.set(line, { yPercent: 0, rotateX: 0, clearProps: "all" });
        } else {
          line.style.transform = 'none';
          line.style.opacity = '1';
        }
      });
    });
  };

  // Run on timeout (2.5s is safe, ensuring it happens after the page loader fades out)
  setTimeout(forceShowAllRevealElements, 2500);

  // Also run if the user scrolls close to the bottom of the page to guarantee visibility of the Contact section
  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (window.scrollY + clientHeight >= scrollHeight - 120) {
      forceShowAllRevealElements();
    }
  });
});

/* ============================================================
   11.0 ELITE EXPERIENTIAL ENGINE IMPLEMENTATION (10 CATEGORIES)
   ============================================================ */
function initEliteExperientialEngine() {
  console.log("⚡ Elite Experiential Engine active.");

  // ──── CATEGORY 5: PAGE-LOAD PROGRESS CURTAIN ────
  initProgressCurtain();

  // ──── CATEGORY 1 & 9: THREE.JS & WEBGL SHADER BACKGROUNDS ────
  // WebGL Background animation has been disabled.
  console.log("Background animations disabled.");

  // ──── CATEGORY 2: GSAP & SCROLLTRIGGER CHOREOGRAPHY ────
  initScrollChoreography();

  // ──── CATEGORY 3 & 4: ANIME.JS SPRING PHYSICS, STAGGER & TYPOGRAPHY ────
  initMicroInteractionsAndText();

  // ──── CATEGORY 8 & 10: REVEAL EFFECTS, 3D PERSPECTIVE & ELITE PORTFOLIO DETAILS ────
  initEliteDetails();

  // ──── CUSTOM INTERACTIVE SHIMMER FOOTER ────
  try {
    initFooterInteractiveLogo();
  } catch (err) {
    console.error("Error launching Interactive Footer:", err);
  }
}

/* ────────────────────────────────────────────────────────────
   CATEGORY 1 & 9: THREE.JS BACKGROUND & SHADERS
   ──────────────────────────────────────────────────────────── */
function initThreeJSBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'webgl-canvas';
  document.body.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── CHROMATIC DISPERSION PARTICLES ──
  const particlesCount = 800;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 15;
    positions[i + 1] = (Math.random() - 0.5) * 15;
    positions[i + 2] = (Math.random() - 0.5) * 8;

    colors[i] = Math.random() * 0.3 + 0.7; // R
    colors[i + 1] = Math.random() * 0.3 + 0.7; // G
    colors[i + 2] = Math.random() * 0.4 + 0.6; // B
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Custom Chromatic Aberration Shader Material
  const particlesMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScrollVelocity: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScrollVelocity;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec3 p = position;
        float d = distance(p.xy, uMouse * 8.0);
        if (d < 3.0) {
          float force = (1.0 - (d / 3.0)) * 0.8;
          p.xy += normalize(p.xy - uMouse * 8.0) * force * (1.0 + uScrollVelocity * 0.05);
        }
        p.y += sin(uTime * 0.5 + p.x) * 0.1;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (4.0 + sin(uTime + p.y) * 2.0) * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        if (length(uv) > 0.5) discard;
        // Radial gradient particle glow
        float intensity = 1.0 - (length(uv) * 2.0);
        // Create RGB channel offset split at particle edges
        vec3 col = vColor * intensity;
        gl_FragColor = vec4(col, intensity * 0.4);
      }
    `,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlesMesh);

  // ── RAYMARCHING SDF WATERMARK (LIQUID MERCURY BLOB) ──
  const blobGeo = new THREE.SphereGeometry(1.8, 64, 64);
  const blobMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uMouse;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 p = position;
        // Simple noise harmonics simulating mercury deformation
        float noise = sin(p.x * 2.0 + uTime) * cos(p.y * 2.0 + uTime) * 0.35
                    + sin(p.z * 1.5 - uTime * 0.8) * 0.2;
        p += normal * noise * (1.0 + abs(sin(uScroll * 0.002)) * 1.2);
        
        // Displace based on mouse coordinate proximity
        float distToMouse = distance(p.xy, uMouse * 5.0);
        if (distToMouse < 2.0) {
          p += normal * (1.0 - distToMouse / 2.0) * 0.4;
        }

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Fresnel calculation for mercury look
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
        
        // Metallic reflection and deep shading
        vec3 reflectionColor = vec3(0.75, 0.82, 0.94);
        vec3 baseShading = vec3(0.08, 0.1, 0.12);
        vec3 col = mix(baseShading, reflectionColor, fresnel + 0.15);
        col += vec3(0.95, 0.98, 1.0) * pow(max(dot(normal, vec3(0.577, 0.577, 0.577)), 0.0), 16.0); // Specular highlight
        
        gl_FragColor = vec4(col, 0.35 + fresnel * 0.55);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const blobMesh = new THREE.Mesh(blobGeo, blobMat);
  blobMesh.position.set(-3, -1, -2);
  scene.add(blobMesh);

  // ── VOLUMETRIC FRESNEL GLOW RING ──
  const ringGeo = new THREE.TorusGeometry(3.5, 0.08, 16, 100);
  const ringMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform float uScrollVelocity;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
        vec3 glowCol = vec3(0.72, 0.83, 0.98) * (1.0 + abs(uScrollVelocity) * 0.12);
        gl_FragColor = vec4(glowCol, fresnel * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  scene.add(ringMesh);

  // ── GLOW-PROPAGATION GRID ──
  const gridHelper = new THREE.GridHelper(24, 24, 0x8cb4e6, 0x222222);
  gridHelper.position.y = -4;
  gridHelper.rotation.x = 0.1;
  scene.add(gridHelper);

  // Shockwave Propagation uniform
  let clickWaveCenter = new THREE.Vector3(0, 0, 0);
  let clickWaveRadius = 0;
  let clickWaveActive = false;

  window.addEventListener('click', (e) => {
    // Cast coordinate ray to propagation plane
    clickWaveCenter.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0);
    clickWaveRadius = 0;
    clickWaveActive = true;
  });

  // Mouse / Scroll listeners
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  const clock = new THREE.Clock();

  function animateWebGL() {
    const time = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Lerp mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Track scroll velocity
    const currentScrollY = window.scrollY;
    scrollVelocity = (currentScrollY - lastScrollY) * 0.25;
    lastScrollY = currentScrollY;

    // Update Uniforms
    particlesMat.uniforms.uTime.value = time;
    particlesMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
    particlesMat.uniforms.uScrollVelocity.value = scrollVelocity;

    blobMat.uniforms.uTime.value = time;
    blobMat.uniforms.uScroll.value = currentScrollY;
    blobMat.uniforms.uMouse.value.set(mouse.x, mouse.y);

    ringMat.uniforms.uTime.value = time;
    ringMat.uniforms.uScrollVelocity.value = scrollVelocity;

    // Slow animations
    particlesMesh.rotation.y = time * 0.02;
    blobMesh.rotation.x = time * 0.1;
    blobMesh.rotation.y = time * 0.08;

    ringMesh.rotation.z = time * 0.15 + (currentScrollY * 0.002);
    ringMesh.rotation.y = Math.sin(time * 0.5) * 0.1;

    // Grid Shockwave Propagation
    if (clickWaveActive) {
      clickWaveRadius += 10 * delta;
      gridHelper.position.z = Math.sin(time * 5) * 0.1; // gentle coordinate bounce
      if (clickWaveRadius > 30) {
        clickWaveActive = false;
      }
    }

    // CATEGORY 9: ORTHOGRAPHIC/PERSPECTIVE CAMERA TILT
    camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animateWebGL);
  }

  animateWebGL();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── INERTIAL ORBIT WEBGL WIREFRAME WIDGET ──
  initInertialWidget();
}

/* ── Floating Draggable 3D Shape Widget with Momentum ── */
function initInertialWidget() {
  const container = document.createElement('div');
  container.id = 'inertial-widget-container';
  
  // Append near About title or as a Floating UI item if appropriate
  const aboutHeading = document.querySelector('.about-grid');
  if (aboutHeading) {
    aboutHeading.appendChild(container);
  } else {
    // Fallback: place in shell
    const shell = document.querySelector('.page-shell');
    if (shell) shell.appendChild(container);
  }

  const wScene = new THREE.Scene();
  const wCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
  wCamera.position.z = 4;

  const wRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  wRenderer.setSize(180, 180);
  container.appendChild(wRenderer.domElement);

  const geom = new THREE.IcosahedronGeometry(1.1, 1);
  const wMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, wireframe: true, transparent: true, opacity: 0.18 });
  const wMesh = new THREE.Mesh(geom, wMat);
  wScene.add(wMesh);

  // Drag physics states
  let isDragging = false;
  let previousMousePos = { x: 0, y: 0 };
  let spinVelocity = { x: 0.005, y: 0.005 };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePos.x;
    const deltaY = e.clientY - previousMousePos.y;
    wMesh.rotation.y += deltaX * 0.01;
    wMesh.rotation.x += deltaY * 0.01;
    spinVelocity = { x: deltaY * 0.005, y: deltaX * 0.005 };
    previousMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch triggers
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - previousMousePos.x;
    const deltaY = e.touches[0].clientY - previousMousePos.y;
    wMesh.rotation.y += deltaX * 0.01;
    wMesh.rotation.x += deltaY * 0.01;
    spinVelocity = { x: deltaY * 0.005, y: deltaX * 0.005 };
    previousMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  window.addEventListener('touchend', () => isDragging = false);

  const tClock = new THREE.Clock();

  function loopWidget() {
    const time = tClock.getElapsedTime();
    if (!isDragging) {
      // Natural momentum deceleration
      wMesh.rotation.x += spinVelocity.x;
      wMesh.rotation.y += spinVelocity.y;
      spinVelocity.x *= 0.95;
      spinVelocity.y *= 0.95;

      // Lissajous Autonomous Orbit baseline pull
      wMesh.rotation.x += Math.sin(time) * 0.001;
      wMesh.rotation.y += Math.cos(time * 0.8) * 0.001;
    }
    wRenderer.render(wScene, wCamera);
    requestAnimationFrame(loopWidget);
  }
  loopWidget();
}

/* ────────────────────────────────────────────────────────────
   CATEGORY 5: PROGRESS CURTAIN & DYNAMIC CUSTOM SCROLLBAR
   ──────────────────────────────────────────────────────────── */
function initProgressCurtain() {
  initCustomScrollbar(); // Bypass progress curtain loader completely
}

function initCustomScrollbar() {
  if (isTouchDevice()) return;
  const track = document.createElement('div');
  track.className = 'custom-scrollbar-track';
  const thumb = document.createElement('div');
  thumb.className = 'custom-scrollbar-thumb';
  track.appendChild(thumb);
  document.body.appendChild(track);

  gsap.to(track, { opacity: 1, duration: 0.5 });

  const updateScrollbar = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = window.scrollY / totalHeight;
    const maxThumbTop = track.clientHeight - thumb.clientHeight;
    thumb.style.transform = `translate3d(0, ${progress * maxThumbTop}px, 0)`;
  };

  window.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);
  updateScrollbar();

  // Click & Drag functionality
  let isDragging = false;
  let startY = 0;
  let startScrollY = 0;

  thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollY = window.scrollY;
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const maxThumbTop = track.clientHeight - thumb.clientHeight;
    const ratio = deltaY / maxThumbTop;
    const targetScrollY = startScrollY + ratio * totalHeight;
    
    if (lenis) {
      lenis.scrollTo(targetScrollY, { immediate: true });
    } else {
      window.scrollTo(0, targetScrollY);
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
}

/* ────────────────────────────────────────────────────────────
   CATEGORY 2: GSAP & SCROLLTRIGGER CHOREOGRAPHY
   ──────────────────────────────────────────────────────────── */
function initScrollChoreography() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // List of fixes made during creative technologist audit:
  // 1. FIXED: Removed duplicate ScrollTrigger definitions on '.timeline-item' and '.project-item' that were clashing and causing stuttering.
  // 2. FIXED: Eliminated FOUC by leveraging proper CSS transforms and opacity setups.
  // 3. FIXED: Handled memory leaks and recalculation glitches by optimizing resize ScrollTrigger refresh hooks.
  // 4. FIXED: Enforced strict hardware-acceleration using will-change and lightweight transforms only.

  const isReduced = prefersReducedMotion();
  const isMobile = isTouchDevice() || window.innerWidth < 768;

  // ── 1. SECTION BOUNDARY TIMELINES (OPTIMIZED FOR ZERO-JANK 60FPS) ──
  // Heavy blur filters and clipPath scrubs removed for smooth, instant scrolling

  // ── 2. ELITE CHARACTER-BY-CHARACTER LABEL REVEALS ──
  initSectionLabelReveals();

  // ── 3. DRAW-IN ACCENT DIVIDERS WITH SHIMMER ──
  initChapterDividers();

  // ── 4. MULTI-LAYER PARALLAX REFINEMENT ──
  initParallaxRefinement(isReduced, isMobile);

  // ── 5. SCROLL-VELOCITY SKEW & TILT SYSTEM ──
  initVelocityAwareEffects(isReduced, isMobile);
}

function initSectionLabelReveals() {
  const sections = [
    { id: '#about', labelSel: '#about .page-label' },
    { id: '#projects', labelSel: '#projects .page-label' },
    { id: '#blog-section', labelSel: '#blog-section .page-label' }
  ];

  sections.forEach(({ id, labelSel }) => {
    const label = document.querySelector(labelSel);
    if (!label) return;

    // Split label into letters/chars beautifully
    const originalText = label.textContent.trim();
    label.innerHTML = '';
    
    const wrapper = document.createElement('span');
    wrapper.className = 'label-mask-wrapper';
    
    const chars = [];
    for (let char of originalText) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'char-span';
      span.style.transform = 'translateY(110%)';
      wrapper.appendChild(span);
      chars.push(span);
    }
    label.appendChild(wrapper);

    gsap.to(chars, {
      y: '0%',
      duration: 0.7,
      stagger: 0.04,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: id,
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

function initChapterDividers() {
  const targets = ['#about', '#projects', '#blog-section', '#contact'];
  targets.forEach(id => {
    const el = document.querySelector(id);
    if (!el) return;

    // Create the premium gradient divider
    const divider = document.createElement('div');
    divider.className = 'chapter-divider';
    
    const shimmer = document.createElement('div');
    shimmer.className = 'chapter-divider-shimmer';
    divider.appendChild(shimmer);
    
    el.appendChild(divider);

    // Draw the divider from center / left
    gsap.fromTo(divider, 
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: id,
          start: 'top 95%',
          end: 'top 75%',
          scrub: true
        }
      }
    );

    // Shimmer pass once when section settles
    ScrollTrigger.create({
      trigger: id,
      start: 'top 25%',
      onEnter: () => {
        gsap.fromTo(shimmer,
          { left: '-100%' },
          { left: '200%', duration: 1.1, ease: 'power2.inOut' }
        );
      }
    });
  });
}

function initParallaxRefinement(isReduced, isMobile) {
  if (isReduced) return;

  // Parallax for featured project card images
  document.querySelectorAll('.featured-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;

    card.style.overflow = 'hidden';
    img.style.scale = '1.12';
    img.style.willChange = 'transform';

    gsap.fromTo(img,
      { yPercent: isMobile ? -3 : -8 },
      {
        yPercent: isMobile ? 3 : 8,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // Parallax about watermark
  const watermark = document.querySelector('.about-watermark');
  if (watermark) {
    watermark.style.willChange = 'transform';
    gsap.fromTo(watermark,
      { yPercent: isMobile ? 10 : 25 },
      {
        yPercent: isMobile ? -10 : -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // Parallax interactive globe container
  const globe = document.getElementById('interactive-globe');
  if (globe) {
    globe.style.willChange = 'transform';
    gsap.fromTo(globe,
      { yPercent: isMobile ? 4 : 10 },
      {
        yPercent: isMobile ? -4 : -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }
}

function initVelocityAwareEffects(isReduced, isMobile) {
  if (isReduced || isMobile) return;

  let proxy = { skew: 0, tilt: 0 };
  const skewSetter = gsap.quickSetter('.project-item, .featured-card, .blog-card', 'skewY', 'deg');
  const tiltSetter = gsap.quickSetter('.project-item, .featured-card', 'rotateX', 'deg');
  
  const clampSkew = gsap.utils.clamp(-2.5, 2.5); // max 2.5 degrees skew
  const clampTilt = gsap.utils.clamp(-5, 5); // max 5 degrees tilt

  ScrollTrigger.create({
    onUpdate: (self) => {
      const vel = self.getVelocity();
      const skewValue = clampSkew(vel / 1500);
      const tiltValue = clampTilt(vel / 1000);
      
      gsap.to(proxy, {
        skew: skewValue,
        tilt: tiltValue,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => {
          skewSetter(proxy.skew);
          tiltSetter(-proxy.tilt);
        }
      });
    }
  });
}

/* ────────────────────────────────────────────────────────────
   CATEGORY 3 & 4: ANIME.JS SPRING PHYSICS & TYPOGRAPHY REVEALS
   ──────────────────────────────────────────────────────────── */
function initMicroInteractionsAndText() {
  // ── SPRING PHYSICS CLICK REBOUNDS ──
  const buttonPills = document.querySelectorAll('.nav-pill, .cta-btn, .copy-btn, .submit-btn');
  buttonPills.forEach(pill => {
    pill.addEventListener('mousedown', () => {
      if (typeof anime === 'undefined') return;
      anime({
        targets: pill,
        scale: 0.9,
        skewX: 2,
        duration: 100,
        easing: 'easeOutQuad'
      });
    });

    pill.addEventListener('mouseup', () => {
      if (typeof anime === 'undefined') return;
      anime({
        targets: pill,
        scale: 1,
        skewX: 0,
        duration: 800,
        easing: 'elastic(1, 0.55)'
      });
    });
  });

}

/* ────────────────────────────────────────────────────────────
   CATEGORY 8 & 10: REVEAL EFFECTS, 3D PERSPECTIVE & PORTFOLIO DETAILS
   ──────────────────────────────────────────────────────────── */
function initEliteDetails() {
  // ── ODOMETER STATS YEAR TICKERS ──
  const expNumber = document.querySelector('.about-number');
  if (expNumber) {
    const originalNumber = expNumber.textContent.trim();
    if (!isNaN(originalNumber)) {
      expNumber.innerHTML = `<span class="odometer-wrapper"></span>`;
      const wrapper = expNumber.querySelector('.odometer-wrapper');
      
      // Let's scroll digits dynamically
      for (let i = 0; i < originalNumber.length; i++) {
        const digitCol = document.createElement('div');
        digitCol.className = 'odometer-digit-col';
        for (let num = 0; num <= parseInt(originalNumber[i]); num++) {
          const div = document.createElement('div');
          div.textContent = num;
          digitCol.appendChild(div);
        }
        wrapper.appendChild(digitCol);

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(digitCol, 
            { y: 0 },
            { 
              y: -(digitCol.clientHeight - divHeight(digitCol)), 
              duration: 1.5, 
              ease: 'power3.out',
              scrollTrigger: {
                trigger: expNumber,
                start: 'top 85%'
              }
            }
          );
        }
      }
    }
  }
}

function divHeight(col) {
  const firstChild = col.querySelector('div');
  return firstChild ? firstChild.clientHeight : 30;
}

function initFooterInteractiveLogo() {
  // Kept static centered gradient. Mouse hover listener removed to keep only the beautiful floating bounce effect.
  const gradient = document.getElementById('paint0_linear_1145_73');
  if (gradient) {
    gradient.setAttribute('x1', '705'); // viewboxWidth / 2
  }
}


/* ============================================================
   14.0 SIGNATURE MOTION SYSTEMS (Dumeme, Made in Evolve, Zajno)
   ============================================================ */

let isTransitioningNav = false;

function initSignatureMotionSystems() {
  // 1. Adaptive Parallax-within-mask (Zajno-inspired)
  initMaskedImageParallax();

  // 2. Sticky Side Progress Navigation (Zajno-inspired)
  initSideProgressNav();

  // 3. Oversized Scroll-Reveal Headline (Made in Evolve-inspired)
  initScrollHeadlineReveal();

  // 4. Scroll Motif Infinite Track (Dumeme-inspired)
  initScrollMotifStrips();
}

// 1. Adaptive Parallax-within-mask (Zajno-inspired image drift)
function initMaskedImageParallax() {
  if (prefersReducedMotion() || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Parallax for About portrait image(s) inside frame
  const aboutImages = document.querySelectorAll('.about-img-frame img');
  aboutImages.forEach(img => {
    gsap.fromTo(img,
      { yPercent: -4, scale: 1.1 },
      {
        yPercent: 4,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-img-frame',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // Parallax for Featured Card images
  gsap.utils.toArray('.featured-card img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -5, scale: 1.15 },
      {
        yPercent: 5,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.featured-card'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

// 2. Sticky Side Progress Navigation (Zajno-inspired sticky status)
function initSideProgressNav() {
  const sideNav = document.getElementById('side-progress-nav');
  if (!sideNav) return;

  const sideNavLinks = sideNav.querySelectorAll('.side-nav-dot-wrap');

  // Sync side nav active states dynamically based on scroll
  const sections = [
    { id: '#hero-section', index: 0 },
    { id: '#about', index: 1 },
    { id: '#projects', index: 2 },
    { id: '#blog-section', index: 3 },
    { id: '#contact', index: 4 }
  ];

  if (typeof ScrollTrigger !== 'undefined') {
    sections.forEach(sec => {
      const el = document.querySelector(sec.id);
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive && !isTransitioningNav) {
              sideNavLinks.forEach(link => link.classList.remove('active'));
              if (sideNavLinks[sec.index]) {
                sideNavLinks[sec.index].classList.add('active');
              }
            }
          }
        });
      }
    });
  }

  // Handle magnetic state custom cursor over progress dots
  sideNavLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (globalCursor) {
        globalCursor.setState('magnetic', { label: 'GO TO' });
      }
    });
    link.addEventListener('mouseleave', () => {
      if (globalCursor) {
        globalCursor.reset();
      }
    });
  });

  // Intercept click on side progress dots for Dumeme Chapter Wipe
  sideNavLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const doScroll = () => {
          if (lenis) lenis.scrollTo(targetEl, { immediate: true });
          else targetEl.scrollIntoView();

          // Set active dot
          sideNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Focus target element for screen-readers
          targetEl.setAttribute('tabindex', '-1');
          targetEl.focus({ preventScroll: true });
        };

        if (prefersReducedMotion()) {
          doScroll();
        } else {
          isTransitioningNav = true;
          triggerChapterWipe(targetEl, () => {
            doScroll();
            isTransitioningNav = false;
          });
        }
      }
    });
  });
}

// Instant Chapter Navigation (No screen-blocking shutter)
function triggerChapterWipe(targetElement, onMidpoint) {
  if (onMidpoint) onMidpoint();
}

// Natural Scroll Chapter Turn (Disabled for zero-latency scroll performance)
function triggerNaturalChapterWipe() {
  // No-op to avoid screen flashes during scrolling
}

// 3. Oversized Scroll-Reveal Headline (Made in Evolve-inspired words fade)
function initScrollHeadlineReveal() {
  if (prefersReducedMotion() || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // If prefers-reduced-motion is true, keep it fully visible and static
    const words = document.querySelectorAll('.headline-word');
    words.forEach(word => {
      word.style.opacity = '1';
      word.style.transform = 'none';
    });
    return;
  }

  const words = gsap.utils.toArray('.headline-word');
  if (words.length === 0) return;

  // Reveal words on scroll (scrubbed, staggered fade and subtle scale-up)
  gsap.fromTo(words,
    { opacity: 0.08, scale: 0.9, y: 20 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: 0.15,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '#philosophy-highlight-section',
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: true
      }
    }
  );
}

// 4. Scroll Motif Infinite Track (Dumeme-inspired text drifts) — Animated with high-precision scroll-velocity physical skew & squeeze
function initScrollMotifStrips() {
  if (prefersReducedMotion() || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const containers = document.querySelectorAll('.scroll-motif-container');
  if (containers.length === 0) return;

  // Track scroll velocity dynamically and apply a responsive physical skew and scale to the container elements.
  // This keeps the continuous CSS infinite marquee (on .scroll-motif-track) independent and hardware-accelerated.
  const skewSetters = Array.from(containers).map(el => gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3.out" }));
  const scaleSetters = Array.from(containers).map(el => gsap.quickTo(el, "scaleY", { duration: 0.6, ease: "power3.out" }));

  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      
      // Map vertical scroll velocity to a subtle horizontal shear angle (skew)
      let skew = velocity * 0.0035;
      if (Math.abs(skew) > 12) {
        skew = skew < 0 ? -12 : 12;
      }

      // Map scroll speed to a vertical scaling compression/stretch effect (elastic response)
      let scale = 1 - Math.abs(velocity) * 0.0001;
      if (scale < 0.85) scale = 0.85;

      // Update all container states inside the animation frame
      skewSetters.forEach(setter => setter(skew));
      scaleSetters.forEach(setter => setter(scale));
    }
  });
}

/* ============================================================
   15.0 GOD-LEVEL ANIMATION SUITE (Awwwards / FWA Standard)
   Zero modification to #hero-section, zero color tampering, 100% features intact
   ============================================================ */
function initGodLevelAnimationSuite() {
  console.log("⚡ God-Level Animation Suite active.");

  // 1. 3D Tilt & Specular Dynamic Spotlight on Cards
  try {
    initGodLevel3DTiltAndSpecular();
  } catch (e) {
    console.error("Error in 3D Tilt & Specular:", e);
  }

  // 2. Double-Layer Magnetic Attraction System
  try {
    initGodLevelMagneticSystem();
  } catch (e) {
    console.error("Error in Magnetic System:", e);
  }

  // 3. Timeline Laser Guide Rail & Milestone Radar Pulse
  try {
    initGodLevelTimelineInteractions();
  } catch (e) {
    console.error("Error in Timeline System:", e);
  }

  // 4. Projects Showcase Interactive 3D Floating Lens & Odometer Flip
  try {
    initGodLevelProjectRowInteractions();
  } catch (e) {
    console.error("Error in Project Row System:", e);
  }

  // 5. Giant SVG Logotype Piano Wave Physics
  try {
    initGodLevelFooterLogotypePhysics();
  } catch (e) {
    console.error("Error in Logotype Physics:", e);
  }

  // 6. Confetti Particle Cannon on Copy Email
  try {
    initGodLevelConfettiCannon();
  } catch (e) {
    console.error("Error in Confetti Cannon:", e);
  }

  // 7. Kinetic Text Wave Ripple on Section Headings
  try {
    initGodLevelKineticTextWave();
  } catch (e) {
    console.error("Error in Kinetic Text Wave:", e);
  }

  // 8. Back to Top Spinner Dynamic Kinetic Flywheel
  try {
    initGodLevelBackToTopFlywheel();
  } catch (e) {
    console.error("Error in BackToTop Flywheel:", e);
  }
}

// ── 1. 3D Tilt & Specular Dynamic Spotlight on Cards ──
function initGodLevel3DTiltAndSpecular() {
  if (prefersReducedMotion() || isTouchDevice()) return;
  if (typeof gsap === 'undefined') return;

  const tiltCards = document.querySelectorAll('.featured-card, .blog-card');
  tiltCards.forEach(card => {
    // Inject specular sheen overlay if missing
    let sheen = card.querySelector('.specular-sheen');
    if (!sheen) {
      sheen = document.createElement('div');
      sheen.className = 'specular-sheen';
      card.appendChild(sheen);
    }

    const img = card.querySelector('img');

    // Use gsap.quickTo for silky smooth 60/120fps interpolated physics
    const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    const imgX = img ? gsap.quickTo(img, 'x', { duration: 0.45, ease: 'power2.out' }) : null;
    const imgY = img ? gsap.quickTo(img, 'y', { duration: 0.45, ease: 'power2.out' }) : null;

    let rect = null;
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      rotY(normX * 12);
      rotX(-normY * 12);

      // Inner image holographic parallax counter-drift
      if (imgX && imgY) {
        imgX(-normX * 16);
        imgY(-normY * 16);
      }

      // Specular spotlight coordinate
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${pctX}%`);
      card.style.setProperty('--mouse-y', `${pctY}%`);
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      if (img) {
        gsap.to(img, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  });
}

// ── 2. Double-Layer Magnetic Attraction System ──
function initGodLevelMagneticSystem() {
  if (prefersReducedMotion() || isTouchDevice()) return;
  if (typeof gsap === 'undefined') return;

  const magneticTargets = document.querySelectorAll(
    '.cta-btn, .copy-btn, .submit-btn, .nav-pill, .filter-btn, .social-icon-link, .side-nav-dot-wrap, #foot-spinner-container, .proj-arrow, .blog-arrow, .social-item, .footer-link, .header-nav-link'
  );

  magneticTargets.forEach(el => {
    if (el.dataset.godMagnetic === 'true') return;
    el.dataset.godMagnetic = 'true';

    // Find inner element for secondary parallax layer
    const inner = el.querySelector('span, svg, a') || el.firstElementChild;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power2.out' });
    const innerXTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.2, ease: 'power2.out' }) : null;
    const innerYTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.2, ease: 'power2.out' }) : null;

    let rect = null;
    el.addEventListener('mouseenter', () => {
      rect = el.getBoundingClientRect();
      if (globalCursor) {
        const isCopy = el.classList.contains('copy-btn');
        const isLink = el.classList.contains('footer-link') || el.classList.contains('header-nav-link');
        const labelText = isCopy ? 'COPY' : (isLink ? 'OPEN' : 'CLICK');
        globalCursor.setState('magnetic', { label: labelText });
      }
    });

    el.addEventListener('mousemove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.28;
      const deltaY = (e.clientY - centerY) * 0.28;

      xTo(deltaX);
      yTo(deltaY);

      if (innerXTo && innerYTo) {
        innerXTo(deltaX * 0.35);
        innerYTo(deltaY * 0.35);
      }
    });

    el.addEventListener('mouseleave', () => {
      rect = null;
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      if (inner) {
        gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      }
      if (globalCursor) {
        globalCursor.reset();
      }
    });
  });
}

// ── 3. Timeline Laser Guide Rail & Milestone Radar Pulse ──
function initGodLevelTimelineInteractions() {
  if (prefersReducedMotion() || typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') return;

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // Insert laser track and head
  let laserTrack = timeline.querySelector('.timeline-laser-track');
  if (!laserTrack) {
    laserTrack = document.createElement('div');
    laserTrack.className = 'timeline-laser-track';
    
    const laserHead = document.createElement('div');
    laserHead.className = 'timeline-laser-head';
    laserTrack.appendChild(laserHead);

    timeline.appendChild(laserTrack);
  }

  // Laser fills down with scroll
  ScrollTrigger.create({
    trigger: timeline,
    start: 'top 75%',
    end: 'bottom 60%',
    scrub: 0.2,
    onUpdate: (self) => {
      gsap.set(laserTrack, { scaleY: self.progress });
    }
  });

  // Radar ring expansion on reaching each milestone
  const items = timeline.querySelectorAll('.timeline-item');
  items.forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 65%',
      onEnter: () => {
        const pulse = document.createElement('div');
        pulse.className = 'timeline-radar-pulse';
        pulse.style.top = `${item.offsetTop + 18}px`;
        timeline.appendChild(pulse);

        gsap.fromTo(pulse,
          { scale: 0.8, opacity: 0.9 },
          { scale: 3.2, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => pulse.remove() }
        );

        gsap.fromTo(item,
          { x: -6 },
          { x: 0, duration: 0.5, ease: 'back.out(2)' }
        );
      }
    });
  });
}

// ── 4. Projects Showcase Interactive 3D Floating Lens & Odometer Flip ──
function initGodLevelProjectRowInteractions() {
  let isPreviewActive = false;
  const items = document.querySelectorAll('.project-item');
  items.forEach(item => {
    const numEl = item.querySelector('.proj-num');
    if (numEl && !numEl.querySelector('.proj-num-inner')) {
      const origNum = numEl.textContent.trim();
      numEl.innerHTML = `
        <span class="proj-num-inner">
          <span>${origNum}</span>
          <span class="proj-num-dup">${origNum}</span>
        </span>
      `;
    }

    const tags = item.querySelectorAll('.proj-tags span');
    item.addEventListener('mouseenter', () => {
      isPreviewActive = true;
      if (tags.length > 0 && typeof gsap !== 'undefined') {
        gsap.fromTo(tags,
          { y: 3, scale: 0.95 },
          { y: 0, scale: 1, duration: 0.35, stagger: 0.04, ease: 'back.out(2)', overwrite: 'auto' }
        );
      }
    });

    item.addEventListener('mouseleave', () => {
      isPreviewActive = false;
    });
  });

  // Inertial tilt on the floating project preview container
  const preview = document.querySelector('.project-preview-container');
  if (preview && !isTouchDevice() && !prefersReducedMotion() && typeof gsap !== 'undefined') {
    let lastX = 0;
    let lastY = 0;

    window.addEventListener('mousemove', (e) => {
      if (!isPreviewActive) return;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const tiltY = Math.max(-14, Math.min(14, deltaX * 0.35));
      const tiltX = Math.max(-14, Math.min(14, -deltaY * 0.35));
      gsap.to(preview, {
        rotateY: tiltY,
        rotateX: tiltX,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }
}

// ── 5. Giant SVG Logotype Piano Wave Physics ──
function initGodLevelFooterLogotypePhysics() {
  const logoWrapper = document.getElementById('footer-interactive-logo');
  if (!logoWrapper || isTouchDevice()) return;
  if (typeof gsap === 'undefined') return;

  const letters = logoWrapper.querySelectorAll('.logo-letter');
  if (letters.length === 0) return;

  const letterCoords = [
    { el: letters[0], x: 285 },
    { el: letters[1], x: 425 },
    { el: letters[2], x: 565 },
    { el: letters[3], x: 705 },
    { el: letters[4], x: 845 },
    { el: letters[5], x: 985 },
    { el: letters[6], x: 1125 }
  ];

  let rect = null;
  logoWrapper.addEventListener('mouseenter', () => {
    rect = logoWrapper.getBoundingClientRect();
  });

  logoWrapper.addEventListener('mousemove', (e) => {
    if (!rect) rect = logoWrapper.getBoundingClientRect();
    const mouseSvgX = ((e.clientX - rect.left) / rect.width) * 1410;

    letterCoords.forEach(item => {
      if (!item.el) return;
      const dist = Math.abs(mouseSvgX - item.x);
      const radius = 240;

      if (dist < radius) {
        const factor = 1 - (dist / radius);
        const displaceY = -Math.sin(factor * (Math.PI / 2)) * 48;
        const scaleVal = 1 + factor * 0.18;
        const tilt = (mouseSvgX < item.x ? 1 : -1) * factor * 7;

        gsap.to(item.el, {
          y: displaceY,
          scale: scaleVal,
          rotation: tilt,
          duration: 0.2,
          ease: 'power2.out',
          transformOrigin: '50% 100%',
          overwrite: 'auto'
        });
      } else {
        gsap.to(item.el, {
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out',
          transformOrigin: '50% 100%',
          overwrite: 'auto'
        });
      }
    });
  });

  logoWrapper.addEventListener('mouseleave', () => {
    rect = null;
    letters.forEach((letter, i) => {
      gsap.to(letter, {
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: i * 0.02,
        ease: 'power2.out',
        transformOrigin: '50% 100%',
        overwrite: 'auto'
      });
    });
  });
}

// ── 6. Confetti Particle Cannon on Copy Email ──
function initGodLevelConfettiCannon() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    if (prefersReducedMotion()) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-burst-canvas';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const rect = copyBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const particles = [];
    const colors = ['#0a0a0a', '#333333', '#777777', '#999999', '#bbbbbb'];
    const particleCount = 42;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * (i / particleCount)) + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        opacity: 1
      });
    }

    let start = performance.now();
    const duration = 1000;

    function render(time) {
      const elapsed = time - start;
      const progress = elapsed / duration;

      if (progress >= 1) {
        canvas.remove();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.opacity = 1 - progress;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  });
}

// ── 7. Section Headings (Solid, Crisp, Zero-Glitch Typography) ──
function initGodLevelKineticTextWave() {
  // Headings remain crisp and stable without layout-thrashing character wobbles
}

// ── 8. Back to Top Spinner Dynamic Kinetic Flywheel ──
function initGodLevelBackToTopFlywheel() {
  // Handled smoothly via GPU-accelerated CSS keyframe animation (.spinning-text-container)
}


