/* ═══════════════════════════════════════════════════════════
   AARISH PORTFOLIO — script.js
   • Islamic Geometry Canvas (scroll-reactive)
   • D3 Interactive Project Timeline
   • Monaco Editor + Pyodide Playground
   • Scroll Reveal Animations
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────── */
/* 1. FOOTER YEAR                                  */
/* ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─────────────────────────────────────────────── */
/* 2. ISLAMIC GEOMETRY CANVAS                      */
/* ─────────────────────────────────────────────── */
(function initGeo() {
    const canvas = document.getElementById('geo-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, scrollFraction = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track scroll fraction (0 = top, 1 = bottom)
    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollFraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    });

    function drawGeo() {
        ctx.clearRect(0, 0, W, H);

        // Scroll drives key parameters
        const t = scrollFraction;            // 0 → 1 as page scrolls
        const n = Math.round(6 + t * 14);   // symmetry order: 6 → 20
        const rings = Math.round(2 + t * 5);   // concentric rings: 2 → 7
        const baseR = Math.min(W, H) * (0.18 - t * 0.06); // ring radius shrinks

        // Subtle time animation layered on top of scroll
        const time = Date.now() * 0.0003;

        ctx.save();
        ctx.translate(W / 2, H / 2);

        for (let ring = 1; ring <= rings; ring++) {
            const r = baseR * ring;
            const alpha = 0.06 + (ring / rings) * 0.08;

            ctx.strokeStyle = `rgba(34,139,34,${alpha})`;
            ctx.lineWidth = 0.8;

            // Outer guiding circle
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();

            // N-fold star lines from centre to circle rim
            for (let i = 0; i < n; i++) {
                const angle = (i / n) * Math.PI * 2 + time * (ring % 2 === 0 ? 1 : -1);
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;

                // Line from origin to point
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Connecting chords between adjacent rim points
                const nextAngle = ((i + 1) / n) * Math.PI * 2 + time * (ring % 2 === 0 ? 1 : -1);
                const nx = Math.cos(nextAngle) * r;
                const ny = Math.sin(nextAngle) * r;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nx, ny);
                ctx.stroke();

                // Small decorative circles at each rim point
                ctx.beginPath();
                ctx.arc(x, y, 2 + ring * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(46,204,64,${alpha * 1.2})`;
                ctx.fill();
            }

            // Interlaced inner petal arcs (adds depth when scrolled)
            if (t > 0.2) {
                const petalAlpha = (t - 0.2) * 0.15;
                ctx.strokeStyle = `rgba(46,204,64,${petalAlpha})`;
                for (let i = 0; i < n; i++) {
                    const a1 = (i / n) * Math.PI * 2 + time;
                    const a2 = ((i + 2) / n) * Math.PI * 2 + time;
                    const mx = Math.cos((a1 + a2) / 2) * r * 0.6;
                    const my = Math.sin((a1 + a2) / 2) * r * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
                    ctx.quadraticCurveTo(mx, my, Math.cos(a2) * r, Math.sin(a2) * r);
                    ctx.stroke();
                }
            }
        }

        ctx.restore();
        requestAnimationFrame(drawGeo);
    }

    drawGeo();
})();


/* ─────────────────────────────────────────────── */
/* 3. SCROLL REVEAL                                */
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
/* 4. D3 INTERACTIVE TIMELINE                      */
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

    // Sort by date
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

    // Axis
    g.append('g')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.timeFormat('%Y')))
        .call(ax => {
            ax.select('.domain').attr('stroke', 'rgba(34,139,34,0.4)');
            ax.selectAll('.tick line').attr('stroke', 'rgba(34,139,34,0.3)').attr('y1', -6).attr('y2', 6);
            ax.selectAll('.tick text')
                .attr('fill', '#8fbc8f')
                .attr('font-size', '11px')
                .attr('dy', '1.4em');
        });

    // Horizontal line
    g.append('line')
        .attr('x1', 20).attr('x2', width - 20)
        .attr('y1', height / 2).attr('y2', height / 2)
        .attr('stroke', 'rgba(34,139,34,0.35)')
        .attr('stroke-width', 1.5);

    // Node groups
    const nodes = g.selectAll('.tl-node-g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'tl-node-g')
        .attr('transform', d => `translate(${x(new Date(d.date))},${height / 2})`)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
            d3.select(this).select('circle')
                .transition().duration(200)
                .attr('r', 14)
                .attr('fill', '#2ecc40');
        })
        .on('mouseleave', function (event, d) {
            d3.select(this).select('circle')
                .transition().duration(200)
                .attr('r', 10)
                .attr('fill', '#228B22');
        })
        .on('click', function (event, d) {
            // Toggle if same node clicked
            const alreadyOpen = !detail.classList.contains('hidden') && detail.dataset.id === d.id;
            if (alreadyOpen) {
                detail.classList.add('hidden');
                detail.dataset.id = '';
                return;
            }
            detail.dataset.id = d.id;
            detail.classList.remove('hidden');
            detail.innerHTML = `
                <h3>${d.title}</h3>
                <div class="tl-tags">${(d.tags || []).map(t => `<span class="tl-tag">${t}</span>`).join('')}</div>
                <div>${d.longHtml}</div>
                <a class="tl-link" href="${d.github}" target="_blank" rel="noopener">→ View on GitHub</a>
            `;
        });

    nodes.append('circle')
        .attr('r', 10)
        .attr('fill', '#228B22')
        .attr('stroke', 'rgba(46,204,64,0.5)')
        .attr('stroke-width', 3);

    nodes.append('text')
        .text(d => d.title.length > 16 ? d.title.substring(0, 14) + '…' : d.title)
        .attr('text-anchor', 'middle')
        .attr('dy', -20)
        .attr('fill', '#cde8cd')
        .attr('font-size', '10px');
}

if (typeof d3 !== 'undefined') {
    initTimeline();
} else {
    window.addEventListener('load', initTimeline);
}


/* ─────────────────────────────────────────────── */
/* 5. MONACO EDITOR + PYODIDE PLAYGROUND           */
/* ─────────────────────────────────────────────── */
(function initPlayground() {
    const runBtn = document.getElementById('py-run-btn');
    const clearBtn = document.getElementById('py-clear-btn');
    const statusEl = document.getElementById('py-status');
    const consoleEl = document.getElementById('py-console');
    let editor, pyWorker, workerReady = false;
    const TIMEOUT_MS = 15000;
    let killTimer;

    const STARTER_CODE = [
        '# Welcome to the live Python Playground!',
        '# Click ▶ Run to execute.',
        '',
        'x = "This is Crazy!"',
        'for i in x:',
        '   print(i)'
    ].join('\n');

    // ── Monaco ──
    function loadMonaco() {
        if (!window.require) return;
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: STARTER_CODE,
                language: 'python',
                theme: 'vs-dark',
                fontSize: 13,
                minimap: { enabled: false },
                automaticLayout: true,
                fontFamily: "'Fira Code', monospace",
                scrollBeyondLastLine: false,
            });
        });
    }
    loadMonaco();

    // ── Pyodide Worker ──
    function spawnWorker() {
        pyWorker = new Worker('./pyodide-worker.js');
        pyWorker.onmessage = (e) => {
            if (e.data.status === 'ready') {
                workerReady = true;
                statusEl.textContent = 'Ready';
                statusEl.className = 'py-status ok';
                runBtn.disabled = false;
                return;
            }
            clearTimeout(killTimer);
            runBtn.disabled = false;

            if (e.data.error) {
                appendConsole(e.data.error, 'err');
            } else {
                if (e.data.stdout) appendConsole(e.data.stdout, 'out');
                if (e.data.stderr) appendConsole(e.data.stderr, 'err');
            }
            statusEl.textContent = 'Done';
            statusEl.className = 'py-status ok';
        };
    }
    spawnWorker();

    // ── Helpers ──
    function appendConsole(text, type) {
        const span = document.createElement('span');
        span.style.color = type === 'err' ? '#ff6b6b' : '#b5f5b5';
        span.textContent = text;
        consoleEl.innerHTML = '';
        consoleEl.appendChild(span);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
    }

    // ── Run ──
    runBtn.addEventListener('click', () => {
        if (!editor || !workerReady) return;
        const code = editor.getValue();
        runBtn.disabled = true;
        statusEl.textContent = 'Running…';
        statusEl.className = 'py-status';
        consoleEl.textContent = '▶ Executing…\n';

        pyWorker.postMessage({ id: Date.now(), code });

        killTimer = setTimeout(() => {
            pyWorker.terminate();
            consoleEl.innerHTML += '<span style="color:#ff6b6b">\n[KILLED] Script exceeded 15 s timeout. Reopen section to restart.</span>';
            statusEl.textContent = 'Killed';
            statusEl.className = 'py-status err';
            workerReady = false;
            runBtn.disabled = true;
        }, TIMEOUT_MS);
    });

    clearBtn.addEventListener('click', () => {
        consoleEl.textContent = '';
    });
})();
