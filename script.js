/* ==========================================
   CYBER-NEXUS SYSTEM CONTROLLER (MAIN CORE)
   ========================================== */

// --- GLOBAL AUDIO STATE & SYNTHESIZER ---
let audioCtx = null;
let isAudioMuted = true;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Function to play short sine beeps for keyboard typing
window.playTerminalBeep = function() {
  if (isAudioMuted) return;
  initAudioContext();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(650 + Math.random() * 100, audioCtx.currentTime); // Slight pitch variation
  
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

// Generic synthesizer function for retro cyber tones
window.playAlertSound = function(freq = 440, type = 'sine', duration = 0.15, volume = 0.08) {
  if (isAudioMuted) return;
  initAudioContext();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

// Holographic drive mounting sweep sound
function playMountSound() {
  if (isAudioMuted) return;
  initAudioContext();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.35);
  
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.35);
}

// 8-bit cyber arpeggio sound
function playBootArpeggio() {
  if (isAudioMuted) return;
  initAudioContext();
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
  notes.forEach((freq, index) => {
    setTimeout(() => {
      if (isAudioMuted) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    }, index * 70);
  });
}

// --- DOM READY FLOW ---
document.addEventListener('DOMContentLoaded', () => {
  // Unmute audio on first human interaction
  document.addEventListener('click', () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, { once: true });

  // Custom Cursor variables
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  // Custom cursor follow loop
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
  });

  function updateCursor() {
    // Lerp (Linear Interpolation) for a lag effect on the ring
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Attach hover triggers to interactive elements
  function setupHoverEffects() {
    const hoverElements = document.querySelectorAll('a, button, .deck-slot, .skill-card, .contact-card, .theme-btn, input, textarea');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('hover-active');
        if (cursorDot) {
          cursorDot.style.width = '14px';
          cursorDot.style.height = '14px';
        }
        window.playAlertSound(480, 'sine', 0.05, 0.02);
      });
      el.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('hover-active');
        if (cursorDot) {
          cursorDot.style.width = '8px';
          cursorDot.style.height = '8px';
        }
      });
    });
  }
  setupHoverEffects();

  // Custom click effect
  document.addEventListener('mousedown', () => {
    if (cursorRing) cursorRing.classList.add('click-active');
  });
  document.addEventListener('mouseup', () => {
    if (cursorRing) cursorRing.classList.remove('click-active');
  });

  // Custom terminal cursor modifier
  window.setCursorTerminalMode = function(isTerminal) {
    if (cursorRing) {
      if (isTerminal) {
        cursorRing.classList.add('terminal-active');
      } else {
        cursorRing.classList.remove('terminal-active');
      }
    }
  };

  // --- THREE.JS PARTICLE ENGINE SETUP ---
  let scene, camera, renderer, particles;
  let particleCount = 1200;
  let points;
  let targetRotationX = 0, targetRotationY = 0;
  let currentRotationX = 0, currentRotationY = 0;

  function initThreeParticles() {
    const container = document.getElementById('canvas3d');
    if (!container) return;

    // Detect screen width; lower particles for performance on mobile
    if (window.innerWidth < 768) {
      particleCount = 500;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const primaryColorHex = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#00ff66';
    const color = new THREE.Color(primaryColorHex);

    for (let i = 0; i < particleCount; i++) {
      // Create a particle sphere constellation
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 160 + Math.random() * 70; // radius range

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // Dynamic rotation on mouse move
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetRotationX = y * 0.4;
      targetRotationY = x * 0.4;
    });

    // Handle Scroll reactivity
    window.addEventListener('scroll', () => {
      const scrollFraction = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (points) {
        points.rotation.y = scrollFraction * Math.PI * 1.5;
      }
      
      // Update LED status to active on scrolling
      const led = document.getElementById('status-led');
      if (led) {
        led.classList.remove('standby');
        clearTimeout(window.ledTimeout);
        window.ledTimeout = setTimeout(() => {
          led.classList.add('standby');
        }, 1000);
      }
    });

    animateThree();
  }

  function animateThree() {
    requestAnimationFrame(animateThree);

    // Smooth transition for rotation
    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;

    if (points) {
      points.rotation.x = currentRotationX;
      // Combine manual mouse rotation with constant slow orbit rotation
      points.rotation.y += 0.0006;
      points.rotation.y += (targetRotationY - points.rotation.y) * 0.01;
    }

    renderer.render(scene, camera);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Init Three.js
  initThreeParticles();

  // Update particle colors dynamically on theme switch
  function updateParticleColors(hexColor) {
    if (!points) return;
    const color = new THREE.Color(hexColor);
    const colorsAttr = points.geometry.attributes.color;
    for (let i = 0; i < particleCount; i++) {
      colorsAttr.setXYZ(i, color.r, color.g, color.b);
    }
    colorsAttr.needsUpdate = true;
  }

  // --- THEME SWITCHER LOGIC ---
  const themeButtons = document.querySelectorAll('.theme-btn');
  const rootElement = document.documentElement;

  // Theme variable colors mapping to update particles dynamically
  const themeColors = {
    emerald: '#00ff66',
    amber: '#ffb000',
    cyberpink: '#ff007f',
    neoncyan: '#00f0ff'
  };

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Reset active class
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let selectedTheme = 'emerald';
      if (btn.classList.contains('t-amber')) selectedTheme = 'amber';
      else if (btn.classList.contains('t-cyberpink')) selectedTheme = 'cyberpink';
      else if (btn.classList.contains('t-neoncyan')) selectedTheme = 'neoncyan';

      // Set dataset theme attribute
      if (selectedTheme === 'emerald') {
        rootElement.removeAttribute('data-theme');
      } else {
        rootElement.setAttribute('data-theme', selectedTheme);
      }

      // Save preference
      localStorage.setItem('ys-portfolio-theme', selectedTheme);
      
      // Update visual engine colors
      updateParticleColors(themeColors[selectedTheme]);

      // Sound chirp feedback
      window.playAlertSound(700, 'sine', 0.1, 0.06);
    });
  });

  // Load saved theme preference
  const savedTheme = localStorage.getItem('ys-portfolio-theme');
  if (savedTheme && savedTheme !== 'emerald') {
    const activeBtn = document.querySelector(`.t-${savedTheme}`);
    if (activeBtn) {
      activeBtn.click();
    }
  }

  // --- AUDIO MUTING TOGGLE LOGIC ---
  let bootPlayed = false;
  const audioToggle = document.getElementById('audio-toggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      if (isAudioMuted) {
        audioToggle.textContent = '🔊 AUDIO: OFF';
        window.playAlertSound(300, 'sine', 0.15);
      } else {
        audioToggle.textContent = '🔊 AUDIO: ON';
        initAudioContext();
        if (!bootPlayed) {
          playBootArpeggio();
          bootPlayed = true;
        } else {
          window.playAlertSound(600, 'sine', 0.15);
        }
      }
    });
  }

  // Trigger boot on first page interaction if not muted
  document.addEventListener('click', () => {
    if (!isAudioMuted && !bootPlayed) {
      playBootArpeggio();
      bootPlayed = true;
    }
  }, { once: true });

  // --- CYBER DECK PROJECTS CONSOLE CONTROLLER ---
  // Specific data for each project console loading
  const projectsData = {
    scansure: {
      title: 'ScanSure',
      visual: 'assets/scansure.jpg',
      meta1: 'AI safety scoring / node.js / render api',
      meta2: '94% confidence score / database triggers',
      desc: 'An AI-powered chemical ingredient scanner designed to analyze consumer products in real time. It parses lists of chemicals, looks up toxicological profiles, and returns detailed safety indicators, risk grades, confidence parameters, and summaries.',
      tags: ['Node.js', 'Express', 'JavaScript', 'MongoDB', 'AI Risk API', 'EJS Templating'],
      liveLink: 'https://scansure.onrender.com',
      sourceLink: 'https://github.com/yash191stack/Scan-Sure'
    },
    govalid: {
      title: 'GoValid',
      visual: 'assets/govalid.jpg',
      meta1: 'django framework / python / swot engines',
      meta2: 'full business scoring reports / dynamic pdfs',
      desc: 'An AI business model analyst and validator built for startups and entrepreneurs. The application receives a startup idea description, runs a multidimensional evaluation sequence, and produces SWOT analyses, monetization plans, and dynamic PDF reports.',
      tags: ['Django', 'Python', 'Bootstrap 5', 'SWOT Evaluator', 'PDF Generator Engine'],
      liveLink: 'https://govalid.onrender.com/',
      sourceLink: 'https://github.com/yash191stack/GoValid'
    },
    teraaz: {
      title: 'Teraaz AI',
      visual: 'assets/teraaz.jpg',
      meta1: 'ai legal gen / consumer petitions',
      meta2: 'automated rtis / police complaint forms',
      desc: 'A social impact legal technology platform designed to democratize legal aid. The application guides citizens through consumer court petitions, auto-fills police complaint drafts (FIRs), and outputs ready-to-mail Right to Information (RTI) petitions.',
      tags: ['Django', 'React.js', 'AI Legal Draft Model', 'RTIs Creator', 'Tailwind CSS'],
      liveLink: 'https://teraaz-ai.vercel.app/',
      sourceLink: 'https://github.com/yash191stack'
    }
  };

  const deckSlots = document.querySelectorAll('.deck-slot');
  const consoleDisplay = document.getElementById('console-display');

  deckSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      // Ignore if already active
      if (slot.classList.contains('active')) return;

      // Reset slot statuses
      deckSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');

      const projectId = slot.dataset.project;
      const data = projectsData[projectId];
      
      if (!data) return;

      // Play sweep drive mounting noise
      playMountSound();

      // Animate console content load using GSAP
      gsap.to(consoleDisplay, { opacity: 0, y: 10, duration: 0.15, onComplete: () => {
        // Update DOM contents
        document.getElementById('console-proj-title').textContent = data.title;
        document.getElementById('console-img').src = data.visual;
        document.getElementById('console-img').alt = `${data.title} Visual HUD`;
        document.getElementById('console-meta-1').textContent = data.meta1;
        document.getElementById('console-meta-2').textContent = data.meta2;
        document.getElementById('console-desc-text').textContent = data.desc;
        
        // Update Tags
        const tagsContainer = document.getElementById('console-tags-container');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'console-tag';
          span.textContent = tag;
          tagsContainer.appendChild(span);
        });

        // Update action links
        const liveBtn = document.getElementById('console-live-btn');
        const srcBtn = document.getElementById('console-src-btn');

        if (data.liveLink === '#') {
          liveBtn.style.opacity = '0.3';
          liveBtn.style.cursor = 'not-allowed';
          liveBtn.setAttribute('title', 'Coming Soon / Under NDA');
          liveBtn.removeAttribute('href');
          liveBtn.removeAttribute('target');
        } else {
          liveBtn.style.opacity = '1';
          liveBtn.style.cursor = 'none';
          liveBtn.setAttribute('href', data.liveLink);
          liveBtn.setAttribute('target', '_blank');
          liveBtn.removeAttribute('title');
        }

        srcBtn.setAttribute('href', data.sourceLink);

        // Reset hover styles for dynamically loaded buttons
        setupHoverEffects();

        // Fade back in
        gsap.to(consoleDisplay, { opacity: 1, y: 0, duration: 0.25 });
      }});
    });
  });

  // --- HUG / CONTACT FORM CLIENT VALIDATION & FORMSPREE TRANSMISSION ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        formFeedback.textContent = '❌ CRITICAL: ALL TELEMETRY FIELDS REQUIRED.';
        formFeedback.className = 'form-feedback error';
        window.playAlertSound(200, 'sawtooth', 0.2, 0.08); // Error tone
        return;
      }

      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.textContent = '❌ CRITICAL: SYSTEM DECRYPT ERROR - INVALID EMAIL ADDR.';
        formFeedback.className = 'form-feedback error';
        window.playAlertSound(200, 'sawtooth', 0.2, 0.08); // Error tone
        return;
      }

      // Dynamic Loader Simulation
      formFeedback.textContent = '📡 UPLINK PORT INITIALIZING...';
      formFeedback.className = 'form-feedback success';
      formFeedback.style.display = 'block';
      window.playAlertSound(440, 'triangle', 0.1, 0.05);

      const actionUrl = contactForm.getAttribute('action');
      const isPlaceholder = actionUrl.includes('your_form_id_here');

      let currentStep = 0;
      const steps = [
        '📡 CONNECTING SECURE GATEWAY...',
        '📡 ENCRYPTING PACKET LOAD...',
        '📡 TRANSMITTING PACKETS TO NEXUS NODE...'
      ];

      function runLoader(callback) {
        if (currentStep < steps.length) {
          formFeedback.textContent = steps[currentStep];
          window.playAlertSound(500 + currentStep * 100, 'sine', 0.05, 0.03);
          currentStep++;
          setTimeout(() => runLoader(callback), 600);
        } else {
          callback();
        }
      }

      runLoader(() => {
        if (isPlaceholder) {
          // Simulation mode
          formFeedback.textContent = '📡 TRANSMISSION SECURED! (PREVIEW SUCCESS: HOOK UP ACTION ID TO DELIVER EMAIL).';
          formFeedback.className = 'form-feedback success';
          window.playAlertSound(880, 'sine', 0.35, 0.15); // Success chime
          contactForm.reset();
        } else {
          // Real formspree fetch POST
          const formData = new FormData(contactForm);
          fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              formFeedback.textContent = '📡 SECURE TRANSMISSION COMPLETED! EMAIL DISPATCHED TO YASH.';
              formFeedback.className = 'form-feedback success';
              window.playAlertSound(880, 'sine', 0.35, 0.15); // Success chime
              contactForm.reset();
            } else {
              throw new Error('Server error');
            }
          })
          .catch(error => {
            formFeedback.textContent = '❌ TRANSMISSION ERROR: FAILED TO DELIVER PACKETS.';
            formFeedback.className = 'form-feedback error';
            window.playAlertSound(200, 'sawtooth', 0.2, 0.08); // Error tone
          });
        }
      });
    });
  }

  // --- HACKER TEXT DECRYPTION SCRAMBLE EFFECT ---
  function scrambleText(element, finalString, duration = 1000) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let start = null;
    const originalText = finalString;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      let currentString = "";
      const revealIndex = Math.floor(progress * originalText.length);
      
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === " " || originalText[i] === "\n") {
          currentString += originalText[i];
          continue;
        }
        if (i < revealIndex) {
          currentString += originalText[i];
        } else {
          currentString += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      element.textContent = currentString;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = originalText;
      }
    }
    requestAnimationFrame(step);
  }

  // Observe headings and trigger scramble once
  const scrambleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        scrambleText(el, text);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.panel-title, .hero-glitch-name').forEach(el => {
    scrambleObserver.observe(el);
  });

  // --- MOBILE BURGER MENU CONTROLLER ---
  const burgerBtn = document.getElementById('hud-burger');
  const mobileMenu = document.getElementById('hud-mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      
      // Play toggle click
      window.playAlertSound(550, 'sine', 0.08, 0.04);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
});
