/* ==========================================================================
   INTERACTIVE APPLICATION ENGINE - KALI_PREM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Menu Toggler
    // ----------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. Typewriter Effect
    // ----------------------------------------------------------------------
    const words = [
        "secure architectures.",
        "scalable full-stack apps.",
        "optimized algorithms.",
        "AI-ML roadmaps."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function type() {
        if (!typewriterElement) return;

        const currentWord = words[wordIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = 100;
        if (isDeleting) {
            typingSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);

    // ----------------------------------------------------------------------
    // 3. ScrollSpy (Active Navigation Highlighting)
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === currentSectionId) {
                item.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 4. Skills Tabs Filter
    // ----------------------------------------------------------------------
    const skillTabs = document.querySelectorAll('.skills-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            skillCards.forEach(card => {
                card.classList.remove('active');
                if (card.getAttribute('data-cat') === category) {
                    // Trigger reflow for animations to re-run
                    card.offsetHeight;
                    card.classList.add('active');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 5. Projects Filter Engine
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const groups = JSON.parse(card.getAttribute('data-groups') || '[]');
                
                if (filter === 'all' || groups.includes(filter)) {
                    card.style.display = 'flex';
                    // Re-run simple scale fade in
                    card.style.opacity = 0;
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 6. Interactive Virtual Terminal CLI
    // ----------------------------------------------------------------------
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const terminalOutput = document.getElementById('terminal-output-area');
    const inputGhost = document.getElementById('input-ghost');

    let commandHistory = [];
    let historyIndex = -1;

    const availableCommands = ['help', 'about', 'skills', 'projects', 'hack', 'clear'];

    // Autocomplete Ghost Text helper
    if (terminalInput && inputGhost) {
        terminalInput.addEventListener('input', () => {
            const val = terminalInput.value.toLowerCase().trim();
            if (!val) {
                inputGhost.textContent = '';
                return;
            }

            const match = availableCommands.find(c => c.startsWith(val));
            if (match && match !== val) {
                // Keep cursor casing but show completion in ghost
                const diff = match.slice(val.length);
                inputGhost.textContent = terminalInput.value + diff;
            } else {
                inputGhost.textContent = '';
            }
        });

        // Tab/ArrowRight completion trigger
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'ArrowRight') {
                const ghost = inputGhost.textContent;
                if (ghost) {
                    e.preventDefault();
                    terminalInput.value = ghost;
                    inputGhost.textContent = '';
                }
            }
        });
    }

    // Keep terminal focused on body click
    if (terminalBody && terminalInput) {
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Process Terminal Commands
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmdText = terminalInput.value.trim();
                const cleanCmd = cmdText.toLowerCase();

                if (cmdText) {
                    commandHistory.push(cmdText);
                    historyIndex = commandHistory.length;
                }

                // Render Input Command Line to screen
                printLine(`guest@kali-prem:~$ ${cmdText}`, 'user-typed');

                // Parser
                if (cleanCmd) {
                    executeCommand(cleanCmd);
                }

                // Reset inputs
                terminalInput.value = '';
                if (inputGhost) inputGhost.textContent = '';
                
                // Scroll down
                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            } else if (e.key === 'ArrowUp') {
                // Command history cycling up
                if (commandHistory.length > 0) {
                    e.preventDefault();
                    if (historyIndex > 0) historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                    if (inputGhost) inputGhost.textContent = '';
                }
            } else if (e.key === 'ArrowDown') {
                // Command history cycling down
                if (commandHistory.length > 0) {
                    e.preventDefault();
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        terminalInput.value = commandHistory[historyIndex];
                    } else {
                        historyIndex = commandHistory.length;
                        terminalInput.value = '';
                    }
                    if (inputGhost) inputGhost.textContent = '';
                }
            }
        });
    }

    function printLine(text, className = '') {
        const div = document.createElement('div');
        div.className = `terminal-line ${className}`;
        
        if (text.startsWith('<pre') || text.includes('term-res-grid') || text.includes('term-bar-container')) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }
        
        terminalOutput.appendChild(div);
    }

    function executeCommand(cmd) {
        switch (cmd) {
            case 'help':
                printLine(`Available Commands:
  about    - Inquire about Prem's background & tech DNA
  skills   - View categorized skills with terminal graphs
  projects - Detailed catalog of core open-source repositories
  hack     - Execute safe cyber-security lab scanner emulation
  clear    - Clear current terminal memory log
  help     - Display this system command panel`, 'text-cyan');
                break;
                
            case 'about':
                printLine(`PROFILE SUMMARY // PREM KUMAR (KALI-PREM):
  Identity: Software Developer & Security Enthusiast
  Interests: High-efficiency code design, defensive system architectures, network scanning configurations.
  Goal: Build high-performance applications with native security integrations.`, 'text-cyan');
                break;
                
            case 'skills':
                printLine(`WEAPONRY METADATA:`, 'text-cyan');
                printLine(`
<div class="term-bar-container">
  <span class="term-bar-label">Java Core / DSA:</span>
  <div class="term-bar-track"><div class="term-bar-fill t-fill-purple" style="width: 92%"></div></div>
  <span>92%</span>
</div>
<div class="term-bar-container">
  <span class="term-bar-label">React / Web Tech:</span>
  <div class="term-bar-track"><div class="term-bar-fill t-fill-cyan" style="width: 85%"></div></div>
  <span>85%</span>
</div>
<div class="term-bar-container">
  <span class="term-bar-label">Kali Linux / Bash:</span>
  <div class="term-bar-track"><div class="term-bar-fill t-fill-red" style="width: 85%"></div></div>
  <span>85%</span>
</div>
<div class="term-bar-container">
  <span class="term-bar-label">SecOps/Packet Recon:</span>
  <div class="term-bar-track"><div class="term-bar-fill t-fill-red" style="width: 80%"></div></div>
  <span>80%</span>
</div>
                `);
                break;

            case 'projects':
                printLine(`FEATURED REPOSITORIES (github.com/Kali-Prem):`, 'text-cyan');
                printLine(`
<div class="term-res-grid">
  <span class="term-res-label">[TeamUp-Ai]</span>
  <span class="term-res-val">AI hackathon classmate finder platform. Built with React + TypeScript.</span>
</div>
<div class="term-res-grid">
  <span class="term-res-label">[Java-DSA]</span>
  <span class="term-res-val">Complete data structure interview patterns &amp; OOP codebases.</span>
</div>
<div class="term-res-grid">
  <span class="term-res-label">[Hacking-Lab]</span>
  <span class="term-res-val">Cybersecurity roadmaps, port scanner configurations, and notes.</span>
</div>
<div class="term-res-grid">
  <span class="term-res-label">[500-DSA-P]</span>
  <span class="term-res-val">Classification study tracking 500 algorithm practice problems.</span>
</div>
<div class="term-res-grid">
  <span class="term-res-label">[AI-ML-Road]</span>
  <span class="term-res-val">Core mathematical roadmaps covering ML regression patterns.</span>
</div>
                `);
                break;

            case 'hack':
                executeBreachSimulation();
                break;

            case 'clear':
                terminalOutput.innerHTML = '';
                break;

            default:
                printLine(`shell: command not found: "${cmd}". Type 'help' for instructions.`, 'text-red');
        }
    }

    function executeBreachSimulation() {
        printLine(`[!] INITIATING SECURE SOCKET SCANNING EMULATION ON SUBNET 192.168.1.0/24`, 'text-red');
        terminalInput.disabled = true;

        const steps = [
            { text: `[*] Launching port scanning engine (Nmap emulation)...`, delay: 600, color: 'text-muted' },
            { text: `[+] Scanning node 192.168.1.1 [Router Gateway] -> PORT 80, 443 OPEN`, delay: 1200, color: 'text-green' },
            { text: `[+] Scanning node 192.168.1.45 [AI-Model-Server] -> PORT 8080 (REST API) VULNERABLE`, delay: 1800, color: 'text-purple' },
            { text: `[*] Deploying decryption sequence payload...`, delay: 2400, color: 'text-muted' },
            { text: `[!] DECRYPTING SYSTEM METRICS...`, delay: 3000, color: 'text-red' },
            { text: `
<pre class="ascii-banner text-green" style="font-size: 0.6rem; line-height: 1.1;">
███████ ███████  ██████ ██    ██ ██████  ███████
██      ██      ██      ██    ██ ██   ██ ██
███████ █████   ██      ██    ██ ██████  █████
     ██ ██      ██      ██    ██ ██   ██ ██
███████ ███████  ██████  ██████  ██   ██ ███████
</pre>
            `, delay: 3500 },
            { text: `[+] DECRYPTION COMPLETE. SYSTEM SHIELD INTEGRITY AUDITED SUCCESSFULLY. ALL IS WELL.`, delay: 4200, color: 'text-green' }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                printLine(step.text, step.color || '');
                terminalBody.scrollTop = terminalBody.scrollHeight;
                
                // Final step triggers enabling input
                if (step.delay === 4200) {
                    terminalInput.disabled = false;
                    terminalInput.focus();
                }
            }, step.delay);
        });
    }

    // ----------------------------------------------------------------------
    // 7. Contact Form Secure Telemetry Dispatcher (Simulated CLI Overlay)
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formOverlay = document.getElementById('form-terminal-overlay');
    const formOutput = document.getElementById('form-terminal-output');

    if (contactForm && formOverlay && formOutput) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Open secure terminal overlay
            formOverlay.style.display = 'block';
            formOutput.innerHTML = ''; // Reset

            const logLine = (text, className = '') => {
                const p = document.createElement('p');
                p.className = `f-term-log ${className}`;
                p.textContent = text;
                formOutput.appendChild(p);
                formOutput.scrollTop = formOutput.scrollHeight;
            };

            // Custom simulated packaging and encrypted email sending sequence
            const sequences = [
                { text: `[system] Packaging message telemetry packets...`, delay: 200, color: 'text-muted' },
                { text: `[system] Alias: "${name}" // Route: "${email}"`, delay: 600, color: 'text-cyan' },
                { text: `[system] Loading asymmetric cryptography signatures (RSA-4096)...`, delay: 1100, color: 'text-muted' },
                { text: `[system] Encrypting content buffer... SUCCESS.`, delay: 1600, color: 'text-green' },
                { text: `[system] Attempting remote SMTP tunnel link on ssl://smtp.kali-prem.dev:465...`, delay: 2100, color: 'text-muted' },
                { text: `[system] Secured link established! Dispatching encrypted packets...`, delay: 2600, color: 'text-green' },
                { text: `[system] Transmission SUCCESSFUL. Signal securely routed.`, delay: 3200, color: 'text-cyan' },
                { text: `[!] Terminating secure session and returning in 3 seconds...`, delay: 3800, color: 'text-red' }
            ];

            sequences.forEach(seq => {
                setTimeout(() => {
                    logLine(seq.text, seq.color);
                }, seq.delay);
            });

            // Close overlay and reset form
            setTimeout(() => {
                formOverlay.style.display = 'none';
                contactForm.reset();
            }, 7000);
        });
    }
});

// ----------------------------------------------------------------------
// 8. Dynamic Detailed Project Modal Injections
// ----------------------------------------------------------------------
const projectData = {
    teamup: {
        title: "TeamUp-Ai",
        cat: "AI Matching Platforms // Full-Stack Software",
        desc: "TeamUp-Ai resolves typical hackathon team matching bottlenecks. By comparing developers' structural expertise, programming frameworks, and project goals, it identifies natural collaborative fits using a customized profile matching architecture.",
        bullets: [
            "Programmed modular matching systems using React frontend routers and state trees.",
            "Integrated responsive Tailwind CSS interface grids mapping user skills profiles.",
            "Optimized search querying algorithms to scan team needs in low-latency runtime.",
            "Drafted visual state layouts supporting real-time secure messaging handshakes."
        ],
        tech: ["React.js", "TypeScript", "Tailwind CSS", "Algorithm Design", "NodeJS"]
    },
    javadsa: {
        title: "Java-DSA-Learning",
        cat: "Structures & Algorithms // Logical Foundations",
        desc: "A highly comprehensive codebase focusing on Data Structures and Algorithms in Java. Demonstrates optimal space-time complexities, solid OOP architecture principles, and robust code designs.",
        bullets: [
            "Constructed customized implementations for LinkedLists, HashTables, Tries, and Graphs.",
            "Formulated interview-ready recursion trees and sorting algorithm variants.",
            "Maintained strict OOP design standards (encapsulation, abstraction, SOLID).",
            "Structured systematic test cases to profile space-time complexities (Big-O analysis)."
        ],
        tech: ["Java Core", "DSA", "Complexity Testing", "OOPs", "Design Patterns"]
    },
    hacking: {
        title: "Hacking-Learning",
        cat: "Penetration Testing // Cybersecurity Labs",
        desc: "A defensive cybersecurity repository mapping networking concepts, scanning payloads, and Linux bash structures. Details hands-on virtual security sandboxing setups.",
        bullets: [
            "Configured isolated virtual machines (VirtualBox/VMware) running Kali Linux environments.",
            "Structured system scanner scripts using Nmap ports and service-version flags.",
            "Reviewed network packets inside Wireshark to audit vulnerabilities and plain-text flows.",
            "Compiled detailed secure-coding logs analyzing common OWASP Top 10 web vulnerabilities."
        ],
        tech: ["Kali Linux", "Cyber Security", "Bash Scripting", "Nmap Scanner", "Wireshark"]
    },
    patterns: {
        title: "500-DSA-Pattern-Problems",
        cat: "Algorithm Classification // Interview Practice",
        desc: "A master class database systematizing problem-solving. Groups hundreds of challenging coding problems into structural pattern types to simplify pattern-recognition in engineering interviews.",
        bullets: [
            "Classified algorithms into clean patterns: Sliding Window, Two-Pointers, BFS/DFS, Backtracking.",
            "Drafted highly optimized solutions reducing Time Complexity from O(N^2) to O(N).",
            "Demonstrated optimized spatial allocations, limiting stack footprint in recursive nodes.",
            "Linked analytical patterns across diverse binary tree and graph routing layouts."
        ],
        tech: ["Java", "Algorithm Patterns", "Time Complexity", "Dynamic Programming"]
    },
    aiml: {
        title: "AI-ML-Learning",
        cat: "Mathematical Roadmaps // Data Modeling",
        desc: "An educational mapping framework studying the foundation lines of Machine Learning, starting from core linear equations to deep neural architecture configurations.",
        bullets: [
            "Documented regression algorithms and loss functions (MSE, cross-entropy models).",
            "Formulated core Python implementations calculating gradient descent slopes.",
            "Created structural maps charting artificial neural network layers (weights/biases).",
            "Maintained deep mathematical study roadmaps to build data processing models."
        ],
        tech: ["Python", "ML Foundations", "Neural Architectures", "Mathematical Modeling"]
    }
};

function openModal(projKey) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('modal-body-content');
    const data = projectData[projKey];

    if (!modal || !content || !data) return;

    // Compile dynamic markup
    let techMarkup = '';
    data.tech.forEach(t => {
        techMarkup += `<span>${t}</span>`;
    });

    let bulletMarkup = '';
    data.bullets.forEach(b => {
        bulletMarkup += `<li>${b}</li>`;
    });

    content.innerHTML = `
        <div class="modal-hdr">
            <h3 class="modal-title">${data.title}</h3>
            <span class="modal-cat">${data.cat}</span>
        </div>
        <p class="modal-desc">${data.desc}</p>
        
        <h4 class="modal-subtitle">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            <span>Key Contributions</span>
        </h4>
        <ul class="modal-bullets">
            ${bulletMarkup}
        </ul>
        
        <h4 class="modal-subtitle" style="margin-top: 30px;">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span>Tech Stack &amp; Skills</span>
        </h4>
        <div class="modal-tech-stack">
            ${techMarkup}
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Unlock background scroll
    }
}

// Close modal clicking backdrop
window.addEventListener('click', (e) => {
    const modal = document.getElementById('detail-modal');
    if (e.target === modal) {
        closeModal();
    }
});
