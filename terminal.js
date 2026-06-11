/* ==========================================
   TERMINAL EMULATOR: SHELL LOGIC & COMMANDS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const matrixOverlay = document.getElementById('matrix-overlay');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const exitMatrixBtn = document.getElementById('exit-matrix-btn');
  
  if (!terminalInput) return;

  // Command History tracking
  let commandHistory = [];
  let historyIndex = -1;

  // Available Commands list
  const commands = {
    help: 'List all available core terminal protocols.',
    about: 'Display developer profile information.',
    skills: 'Scan available technology stack & competencies.',
    projects: 'Inspect deployed applications & project specifications.',
    hackathons: 'Fetch credentials from hackathons & achievements.',
    contact: 'Retrieve communication channels (Email, GitHub, LinkedIn).',
    hire: 'Initiate hiring sequence & download system credentials.',
    system: 'Scan current hardware configuration & uptime.',
    matrix: 'Initiate fullscreen Matrix digital code rain sequence.',
    clear: 'Flush terminal logs & clear screen.'
  };

  // Keyboard listeners for input
  terminalInput.addEventListener('keydown', (e) => {
    // Play keystroke sound if audio synthesizer is active
    if (window.playTerminalBeep && e.key !== 'Tab') {
      window.playTerminalBeep();
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const inputVal = terminalInput.value.trim().toLowerCase();
      if (!inputVal) return;
      const matches = Object.keys(commands).filter(c => c.startsWith(inputVal));
      if (matches.length === 1) {
        terminalInput.value = matches[0];
      } else if (matches.length > 1) {
        printLine(`Matches: ${matches.join(', ')}`, 'accent');
        scrollToBottom();
      }
    } else if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim();
      if (inputVal) {
        commandHistory.push(inputVal);
        historyIndex = commandHistory.length;
        executeCommand(inputVal);
      }
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Focus terminal input when clicking anywhere inside the terminal body
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
    if (window.setCursorTerminalMode) {
      window.setCursorTerminalMode(true);
    }
  });

  // Revert custom cursor state on leaving terminal
  terminalBody.addEventListener('mouseleave', () => {
    if (window.setCursorTerminalMode) {
      window.setCursorTerminalMode(false);
    }
  });

  // Command Executor
  function executeCommand(cmdStr) {
    const parts = cmdStr.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    // Print command prompt entry
    printLine(`yash_sharma@nexus-core:~$ ${cmdStr}`, 'terminal-history-input');

    if (!commands.hasOwnProperty(command)) {
      printLine(`Error: Protocol "${command}" not found. Type "help" to view active core commands.`, 'error');
      scrollToBottom();
      return;
    }

    // Play alert sound for successful execute
    if (window.playAlertSound) {
      window.playAlertSound(330, 'triangle', 0.1);
    }

    switch (command) {
      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'help':
        let helpText = 'ACTIVE PROTOCOLS MENU:\n=======================\n';
        for (const [key, desc] of Object.entries(commands)) {
          helpText += `${key.padEnd(12)} - ${desc}\n`;
        }
        printLine(helpText);
        break;

      case 'about':
        printLine(
          `DEVELOPER PROFILE SUMMARY:\n` +
          `==========================\n` +
          `Name:        Yash Sharma\n` +
          `Role:        Full Stack Developer\n` +
          `Location:    Aligarh, Uttar Pradesh, India\n` +
          `Education:   B.Tech in Computer Science (GLA University)\n` +
          `Uptime:      CGPA: 7.4 / 10 | Expected Graduation: 2028\n\n` +
          `Bio:\n` +
          `I am a passionate builder who goes from concept to production.\n` +
          `I specialize in designing and shipping functional, scalable digital systems.\n` +
          `I don't stop at full-stack; I have a massive hunger to master system\n` +
          `architecture, advanced AI workflows, and high-performance engineering.\n` +
          `I build, ship, and conquer. There is so much more to learn, and I learn fast.`
        );
        break;

      case 'skills':
        printLine(
          `TECHNOLOGY MATRIX SEARCH RESULTS:\n` +
          `=================================\n` +
          `[Languages]       : C, Java, Python\n` +
          `[Frontend]        : HTML5, CSS3, JavaScript (ES6+), Bootstrap, Tailwind CSS, React, Next.js, TypeScript\n` +
          `[Backend]         : Django, Node.js, Express.js\n` +
          `[Databases]       : MongoDB, Relational DBs\n` +
          `[Specializations] : Full-Stack Architecture, AI prompting & automation, Git & GitHub`
        );
        break;

      case 'projects':
        printLine(
          `DEPLOYED APPLICATIONS:\n` +
          `======================\n` +
          `01. SCANSURE [Live]\n` +
          `    - Ingredient safety scanner using real-time AI risk analysis.\n` +
          `    - Stack: Node.js, Express, JavaScript, MongoDB, EJS.\n` +
          `    - Live URL: https://scansure.onrender.com\n\n` +
          `02. GOVALID [Full-Stack]\n` +
          `    - AI-powered business ideation and validation tool (SWOT, Risk, PDF Gen).\n` +
          `    - Stack: Django, Python, Bootstrap.\n` +
          `    - Repo: https://github.com/yash191stack/GoValid\n\n` +
          `03. TERAAZ AI [Social Impact]\n` +
          `    - Legal document generation and justice democratizer platform.\n` +
          `    - Stack: Django, React, AI integrations.`
        );
        break;

      case 'hackathons':
        printLine(
          `CREDENTIALS & HACKATHONS GRID:\n` +
          `=============================\n` +
          `- Techneex 2026 (IIT BHU, Varanasi): Active team participant in major events.\n` +
          `- AI Nirmaan Hackathon (GLA University, 2026): High standing placement.\n` +
          `- Spark Hack (Sanskriti University): Secured high rankings in technical building.\n` +
          `- Hackathons Completed: Code Veda, Hack It Out (IIT BHU), Intrusion.\n` +
          `- Certifications:\n` +
          `  * MERN Stack Development (Skill Vedanth, 2026)\n` +
          `  * Django Full Stack + AI Integration (TheAngaar Batch, 2025)\n` +
          `  * Infosys Springboard Certified (HTML, CSS, JS)`
        );
        break;

      case 'contact':
        printLine(
          `COMMUNICATION PORTS:\n` +
          `====================\n` +
          `Email:      yshsharma90913@gmail.com\n` +
          `Mobile:     +91 9058139913\n` +
          `LinkedIn:   www.linkedin.com/in/yashsharma191\n` +
          `GitHub:     https://github.com/yash191stack`
        );
        break;

      case 'hire':
        printLine(`INITIATING HIRE PROTOCOL...`, 'accent');
        printLine(
          `Redirecting neural path to contact gateway.\n` +
          `Please fill out the contact form below or email me directly at\n` +
          `yshsharma90913@gmail.com. Setting status beacon to: PRIORITY 1.\n` +
          `Resume download link available in main header console. Ready for deployment.`
        );
        // Focus contact form
        setTimeout(() => {
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
            const nameInput = document.getElementById('contact-name');
            if (nameInput) nameInput.focus();
          }
        }, 1200);
        break;

      case 'system':
        const platform = navigator.platform || 'Unknown OS';
        const browser = navigator.userAgent.split(' ').pop();
        printLine(
          `SYSTEM DIAGNOSTIC SCAN:\n` +
          `=======================\n` +
          `Host Name:   YS_NEXUS_MAIN\n` +
          `CPU Core:    Google Gemini 3.5 Core Engine\n` +
          `OS Interface: ${platform}\n` +
          `Visual Dev:   Three.js (WebGL Grid Particle Engine)\n` +
          `Uptime:      ${Math.floor(performance.now() / 1000)} seconds\n` +
          `Network:     Connected [Online]\n` +
          `Status:      Accepting recruitments... Active.`
        );
        break;

      case 'matrix':
        launchMatrixRain();
        break;
    }

    scrollToBottom();
  }

  // Print helper
  function printLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-history-item ${className}`;
    
    // Convert newlines to breaks or preserve pre-wrap
    const p = document.createElement('p');
    p.className = 'terminal-history-output';
    p.textContent = text;
    
    // Add colors if needed
    if (className === 'error') p.classList.add('error');
    if (className === 'accent') p.classList.add('accent');
    
    div.appendChild(p);
    terminalOutput.appendChild(div);
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Auto-typing simulator on load
  let welcomeSeq = [
    { text: 'initialize portfolio_nexus.sys', delay: 400 },
    { text: 'loading visual kernel & graphics card config...', delay: 800, response: 'Success: Graphics active. WebGL particles loaded.' },
    { text: 'loading terminal commands shell v1.0.3...', delay: 1400, response: 'Success: Shell active. 10 core command modules operational.' },
    { text: 'run diagnostics --quick', delay: 2000, response: 'Status: ONLINE | Candidate: Yash Sharma | Available for Hire.' },
    { text: 'help', delay: 2700, run: true }
  ];

  welcomeSeq.forEach(step => {
    setTimeout(() => {
      if (step.run) {
        executeCommand(step.text);
      } else {
        printLine(`yash_sharma@nexus-core:~$ ${step.text}`, 'terminal-history-input');
        if (step.response) {
          setTimeout(() => {
            printLine(step.response);
            scrollToBottom();
          }, 300);
        }
        scrollToBottom();
      }
    }, step.delay);
  });

  // ==========================================
  // FULLSCREEN MATRIX DIGITAL RAIN COMPONENT
  // ==========================================
  let matrixInterval = null;
  
  function launchMatrixRain() {
    matrixOverlay.style.display = 'block';
    const ctx = matrixCanvas.getContext('2d');
    
    // Resize canvas
    function resizeCanvas() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const alphabet = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ⚡";
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#00ff66';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    }

    matrixInterval = setInterval(draw, 30);
  }

  function exitMatrix() {
    matrixOverlay.style.display = 'none';
    if (matrixInterval) {
      clearInterval(matrixInterval);
    }
    terminalInput.focus();
  }

  exitMatrixBtn.addEventListener('click', exitMatrix);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && matrixOverlay.style.display === 'block') {
      exitMatrix();
    }
  });
});
