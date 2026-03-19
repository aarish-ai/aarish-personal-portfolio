/* ═══════════════════════════════════════════════════════════
   AARISH PORTFOLIO — script.js
   • Enhanced Generative Islamic Geometry (Scroll + Seed)
   • Nav Palette Controller (Track + Toggle)
   • Skills Animation (Intersection Observer)
   • D3 Interactive Project Timeline
   • Monaco Editor + Pyodide Playground
   • Copy to Clipboard Utility
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────── */
/* 1. GLOBAL UTILS & FOOTER                       */
/* ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

// Simple seedable random for consistent variation per session
const SESSION_SEED = Math.random();
function seededRandom(offset = 0) {
    const x = Math.sin(SESSION_SEED + offset) * 10000;
    return x - Math.floor(x);
}

/* ─────────────────────────────────────────────── */
/* 2. ENHANCED GENERATIVE ISLAMIC GEOMETRY         */
/* ─────────────────────────────────────────────── */
(function initEnhancedGeo() {
    const canvas = document.getElementById('geo-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, scrollFraction = 0;

    // Randomized parameters for this visit
    // symmetryBase: 6, 8, 10, or 12
    const symmetryBase = [6, 8, 10, 12][Math.floor(seededRandom(1) * 4)];
    const rotationBaseDir = seededRandom(2) > 0.5 ? 1 : -1;
    const rotationSpeed = (0.1 + seededRandom(3) * 0.2) * rotationBaseDir; // Faster, guaranteed motion
    const complexitySeed = seededRandom(4);
    const startTime = Date.now();

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollFraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    });

    function drawPattern() {
        ctx.clearRect(0, 0, W, H);
        
        const t = scrollFraction;
        const time = (Date.now() - startTime) * 0.001; // Cumulative time in seconds
        
        // Dynamic stats based on scroll
        const currentSymmetry = Math.round(symmetryBase + t * 6); 
        const rings = Math.round(3 + t * 5); 
        const baseR = Math.min(W, H) * (0.12 + t * 0.04);

        ctx.save();
        ctx.translate(W / 2, H / 2);
        
        // Moderate rotation
        ctx.rotate(time * rotationSpeed * 0.4);

        for (let ring = 1; ring <= rings; ring++) {
            const r = baseR * ring * 0.85;
            const alpha = 0.05 + (ring / rings) * 0.07 + (t * 0.1);
            
            ctx.save();
            // Counter-rotation for alternate rings adds many-layered feel
            ctx.rotate(time * rotationSpeed * (ring % 2 === 0 ? 0.4 : -0.4));
            
            ctx.strokeStyle = `rgba(34,139,34,${alpha})`;
            ctx.lineWidth = 1 + t;

            for (let i = 0; i < currentSymmetry; i++) {
                const angle = (i / currentSymmetry) * Math.PI * 2;
                const x1 = Math.cos(angle) * r;
                const y1 = Math.sin(angle) * r;
                
                // Lines to center
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(x1, y1);
                ctx.stroke();

                // Interconnecting chords (jump by 2 for star pattern)
                const step = 2; 
                const angle2 = ((i + step) / currentSymmetry) * Math.PI * 2;
                const x2 = Math.cos(angle2) * r;
                const y2 = Math.sin(angle2) * r;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // Extra complexity: secondary chords on deep scroll
                if (t > 0.35) {
                    const angle3 = ((i + 3) / currentSymmetry) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(Math.cos(angle3) * r, Math.sin(angle3) * r);
                    ctx.strokeStyle = `rgba(46,204,64,${alpha * 0.6})`;
                    ctx.stroke();
                }

                // Decorative nodes
                if (ring > 1) {
                    ctx.beginPath();
                    ctx.arc(x1, y1, 1.5 + t * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(46,204,64,${alpha * 1.8})`;
                    ctx.fill();
                }
            }
            ctx.restore();
        }

        ctx.restore();
        requestAnimationFrame(drawPattern);
    }

    drawPattern();
})();

/* ─────────────────────────────────────────────── */
/* 3. NAV PALETTE CONTROLLER                       */
/* ─────────────────────────────────────────────── */
(function initNavPalette() {
    const palette = document.getElementById('nav-palette');
    const links = document.querySelectorAll('.nav-link');
    const toggle = document.getElementById('nav-toggle');
    const sections = document.querySelectorAll('section');

    // Mobile Toggle
    toggle.addEventListener('click', () => {
        palette.classList.toggle('open');
        const expanded = palette.classList.contains('open');
        toggle.setAttribute('aria-expanded', expanded);
        toggle.textContent = expanded ? '✕' : '☰';
    });

    // Close on link click (mobile)
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                palette.classList.remove('open');
                toggle.textContent = '☰';
            }
        });
    });

    // Active State Tracking
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    });
})();

/* ─────────────────────────────────────────────── */
/* 4. SKILLS ANIMATION                             */
/* ─────────────────────────────────────────────── */
(function initSkills() {
    const skillsList = document.getElementById('skills-list');
    const skills = [
        { label: "HTML / CSS", value: 90 },
        { label: "JavaScript", value: 85 },
        { label: "Python", value: 80 },
        { label: "UI / UX", value: 70 },
        { label: "Problem Solving", value: 88 },
        { label: "AI / ML", value: 75 }
    ];

    // Inject skills
    skills.forEach(s => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <div class="skill-info">
                <span>${s.label}</span>
                <span>${s.value}%</span>
            </div>
            <div class="skill-bar-bg">
                <div class="skill-bar-fill" data-percent="${s.value}"></div>
            </div>
        `;
        skillsList.appendChild(item);
    });

    // Intersection Observer for animation
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-bar-fill');
                fills.forEach(bar => {
                    bar.style.width = bar.dataset.percent + '%';
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    obs.observe(skillsList);
})();

/* ─────────────────────────────────────────────── */
/* 5. CONTACT UTILS (COPY EMAIL)                   */
/* ─────────────────────────────────────────────── */
(function initContact() {
    const copyBtn = document.getElementById('copy-email-btn');
    const email = document.getElementById('contact-email');
    const toast = document.getElementById('copy-toast');

    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const text = email.textContent;
        navigator.clipboard.writeText(text).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
    });
})();

/* ─────────────────────────────────────────────── */
/* 6. SCROLL REVEAL (EXISTING)                     */
/* ─────────────────────────────────────────────── */
(function initReveal() {
    const items = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    items.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────────── */
/* 7. D3 INTERACTIVE TIMELINE (PRESERVED)          */
/* ─────────────────────────────────────────────── */
async function initTimeline() {
    const container = document.getElementById('timeline-container');
    const detail = document.getElementById('timeline-detail');

    let data;
    try {
        const res = await fetch('./timeline.json');
        data = await res.json();
    } catch (e) {
        container.innerHTML = '<p style="color:#ff6b6b; padding:10px;">Could not load timeline data.</p>';
        return;
    }

    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const margin = { top: 30, right: 40, bottom: 50, left: 40 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 150;

    const svg = d3.select('#timeline-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([20, width - 20]);

    g.append('g')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.timeFormat('%Y')))
        .call(ax => {
            ax.select('.domain').attr('stroke', 'rgba(34,139,34,0.4)');
            ax.selectAll('.tick line').attr('stroke', 'rgba(34,139,34,0.3)').attr('y1', -6).attr('y2', 6);
            ax.selectAll('.tick text').attr('fill', '#8fbc8f').attr('font-size', '11px').attr('dy', '1.4em');
        });

    g.append('line')
        .attr('x1', 20).attr('x2', width - 20)
        .attr('y1', height / 2).attr('y2', height / 2)
        .attr('stroke', 'rgba(34,139,34,0.35)')
        .attr('stroke-width', 1.5);

    const nodes = g.selectAll('.tl-node-g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'tl-node-g')
        .attr('transform', d => `translate(${x(new Date(d.date))},${height / 2})`)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
            d3.select(this).select('circle').transition().duration(200).attr('r', 14).attr('fill', '#2ecc40');
        })
        .on('mouseleave', function (event, d) {
            d3.select(this).select('circle').transition().duration(200).attr('r', 10).attr('fill', '#228B22');
        })
        .on('click', function (event, d) {
            const alreadyOpen = !detail.classList.contains('hidden') && detail.dataset.id === d.id;
            if (alreadyOpen) { detail.classList.add('hidden'); detail.dataset.id = ''; return; }
            detail.dataset.id = d.id;
            detail.classList.remove('hidden');
            detail.innerHTML = `<h3>${d.title}</h3><div class="tl-tags">${(d.tags || []).map(t => `<span class="tl-tag">${t}</span>`).join('')}</div><div>${d.longHtml}</div><a class="tl-link" href="${d.github}" target="_blank" rel="noopener">→ View on GitHub</a>`;
        });

    nodes.append('circle').attr('r', 10).attr('fill', '#228B22').attr('stroke', 'rgba(46,204,64,0.5)').attr('stroke-width', 3);
    nodes.append('text').text(d => d.title.length > 16 ? d.title.substring(0, 14) + '…' : d.title).attr('text-anchor', 'middle').attr('dy', -20).attr('fill', '#cde8cd').attr('font-size', '10px');
}

if (typeof d3 !== 'undefined') { initTimeline(); } else { window.addEventListener('load', initTimeline); }

/* ─────────────────────────────────────────────── */
/* 8. MONACO EDITOR + PYODIDE (PRESERVED)          */
/* ─────────────────────────────────────────────── */
(function initPlayground() {
    const runBtn = document.getElementById('py-run-btn');
    const clearBtn = document.getElementById('py-clear-btn');
    const statusEl = document.getElementById('py-status');
    const consoleEl = document.getElementById('py-console');
    let editor, pyWorker, workerReady = false;
    const TIMEOUT_MS = 15000;
    let killTimer;

    const STARTER_CODE = ['# Welcome to the live Python Playground!', '# Click ▶ Run to execute.', '', 'def fibonacci(n):', '    a, b = 0, 1', '    for _ in range(n):', '        a, b = b, a + b', '    return a', '', 'for i in range(10):', '    print(f"fib({i}) = {fibonacci(i)}")',].join('\n');

    function loadMonaco() {
        if (!window.require) return;
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: STARTER_CODE, language: 'python', theme: 'vs-dark', fontSize: 13, minimap: { enabled: false }, automaticLayout: true, fontFamily: "'Fira Code', monospace", scrollBeyondLastLine: false,
            });
        });
    }
    loadMonaco();

    function spawnWorker() {
        pyWorker = new Worker('./pyodide-worker.js');
        pyWorker.onmessage = (e) => {
            if (e.data.status === 'ready') { workerReady = true; statusEl.textContent = 'Ready'; statusEl.className = 'py-status ok'; runBtn.disabled = false; return; }
            clearTimeout(killTimer);
            runBtn.disabled = false;
            if (e.data.error) { appendConsole(e.data.error, 'err'); } else { if (e.data.stdout) appendConsole(e.data.stdout, 'out'); if (e.data.stderr) appendConsole(e.data.stderr, 'err'); }
            statusEl.textContent = 'Done'; statusEl.className = 'py-status ok';
        };
    }
    spawnWorker();

    function appendConsole(text, type) {
        const span = document.createElement('span');
        span.style.color = type === 'err' ? '#ff6b6b' : '#b5f5b5';
        span.textContent = text;
        consoleEl.innerHTML = ''; consoleEl.appendChild(span);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    runBtn.addEventListener('click', () => {
        if (!editor || !workerReady) return;
        const code = editor.getValue();
        runBtn.disabled = true; statusEl.textContent = 'Running…'; statusEl.className = 'py-status';
        consoleEl.textContent = '▶ Executing…\n';
        pyWorker.postMessage({ id: Date.now(), code });
        killTimer = setTimeout(() => {
            pyWorker.terminate();
            consoleEl.innerHTML += '<span style="color:#ff6b6b">\n[KILLED] Script exceeded 15 s timeout. Reopen section to restart.</span>';
            statusEl.textContent = 'Killed'; statusEl.className = 'py-status err';
            workerReady = false; runBtn.disabled = true;
        }, TIMEOUT_MS);
    });

    clearBtn.addEventListener('click', () => { consoleEl.textContent = ''; });
})();
