/* ═════════════════════════════════════════════
   AARISH PORTFOLIO — script.js
   ═════════════════════════════════════════════ */

// 1. UPDATE DYNAMIC YEARS
document.querySelectorAll('.dynamic-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

// 2. SPA NAVIGATION & THEME CONSTRAINTS
const tabs = document.querySelectorAll('.nav-tab');
const pages = document.querySelectorAll('.page-container');

function switchPage(targetId) {
    tabs.forEach(tab => {
        if (tab.dataset.target === targetId) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    pages.forEach(page => {
        if (page.id === targetId) {
            page.classList.add('active');
            setTimeout(() => page.classList.add('fade-in'), 10);

            if (targetId === 'page-about') {
                setTimeout(triggerAboutReveals, 100);
            }
        } else {
            page.classList.remove('fade-in');
            setTimeout(() => {
                if (!page.classList.contains('fade-in')) page.classList.remove('active');
            }, 500);
        }
    });

    forceThemeUpdate(targetId);
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        if (!tab.classList.contains('active')) {
            switchPage(tab.dataset.target);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});
setTimeout(() => { document.getElementById('page-work').classList.add('fade-in'); forceThemeUpdate('page-work'); }, 100);

// 3. COLOR INTERPOLATION (White to Black on scroll)
const bgLayer = document.getElementById('bg-layer');
const geoCanvas = document.getElementById('geo-canvas');
const heroTitle = document.getElementById('hero-title');
const heroSub = document.getElementById('hero-sub');
const miniNav = document.querySelector('.mini-nav');
const navTabs = document.querySelectorAll('.nav-tab');
const quranBanner = document.querySelector('.quran-banner');
const darkCta = document.querySelector('.dark-cta');

function forceThemeUpdate(activePageId) {
    if (activePageId === 'page-about') {
        if (bgLayer) bgLayer.style.backgroundColor = 'rgb(4, 9, 11)';
        if (geoCanvas) geoCanvas.style.opacity = 1;
        if (miniNav) {
            miniNav.style.background = 'rgba(5, 10, 5, 0.8)';
            miniNav.style.borderColor = 'rgba(255,255,255,0.1)';
        }
        navTabs.forEach(t => { if (!t.classList.contains('active')) t.style.color = '#ffffff'; else { t.style.background = '#ffffff'; t.style.color = '#000000'; } });
        if (quranBanner) {
            quranBanner.classList.add('hidden');
        }
    } else {
        navTabs.forEach(t => { t.style.background = ''; t.style.color = ''; });
        if (quranBanner) {
            quranBanner.classList.remove('hidden');
        }
        handleScrollTheme();
    }
}

function handleScrollTheme() {
    const activePage = document.querySelector('.page-container.active');
    if (!activePage || activePage.id !== 'page-work') return;

    const scrollY = window.scrollY;
    // Fade starts at 100px, ends at 500px scroll depth
    const start = 100;
    const end = 500;
    let progress = 0;

    if (scrollY > start) progress = Math.min(1, (scrollY - start) / (end - start));

    // Background Interpolate (255,255,255 -> 4,9,11)
    const rBg = Math.round(255 - progress * (255 - 4));
    const gBg = Math.round(255 - progress * (255 - 9));
    const bBg = Math.round(255 - progress * (255 - 11));
    if (bgLayer) bgLayer.style.backgroundColor = `rgb(${rBg}, ${gBg}, ${bBg})`;

    // Canvas Fade In
    if (geoCanvas) geoCanvas.style.opacity = progress;

    // Text Interpolate (0,0,0 -> 255,255,255)
    if (heroTitle && heroSub) {
        const textLum = Math.round(0 + progress * 255);
        heroTitle.style.color = `rgb(${textLum}, ${textLum}, ${textLum})`;
        heroSub.style.color = `rgba(${textLum}, ${textLum}, ${textLum}, ${0.8 + progress * 0.2})`;
    }

    // Mini Nav Theme Shift
    if (miniNav) {
        miniNav.style.background = `rgba(${rBg}, ${gBg}, ${bBg}, 0.8)`;
        miniNav.style.borderColor = `rgba(${textLum}, ${textLum}, ${textLum}, 0.1)`;
    }
    navTabs.forEach(t => {
        if (!t.classList.contains('active')) {
            // Force strict contrast inversion for visibility on dark backgrounds
            t.style.setProperty('color', progress > 0.5 ? '#ffffff' : '#000000', 'important');
        } else {
            t.style.background = `rgb(${textLum}, ${textLum}, ${textLum})`;
            t.style.color = `rgb(${rBg}, ${gBg}, ${bBg})`;
        }
    });

    // CTA
    if (darkCta) {
        darkCta.style.background = `rgb(${textLum}, ${textLum}, ${textLum})`;
        darkCta.style.color = `rgb(${rBg}, ${gBg}, ${bBg})`;
        darkCta.style.borderColor = `rgb(${textLum}, ${textLum}, ${textLum})`;
    }
}

window.addEventListener('scroll', handleScrollTheme);

// 4. SCROLL PROGRESS BAR
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + "%";
});

// 5. ANIMATION OBSERVER
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.mask-reveal').forEach(el => {
    revealObserver.observe(el);
});

function triggerAboutReveals() {
    document.querySelectorAll('#page-about .mask-reveal').forEach(el => el.classList.add('visible'));
}

// 6. MODALS
const contactBtn = document.getElementById('btn-contact-me');
const contactModal = document.getElementById('contact-modal');
const projectModal = document.getElementById('project-modal');
const modals = [contactModal, projectModal];

function openModal(m, originRect = null) {
    if (originRect) {
        const content = m.querySelector('.modal-content');
        if (content) {
            const ox = ((originRect.left + originRect.width / 2) / window.innerWidth) * 100;
            const oy = ((originRect.top + originRect.height / 2) / window.innerHeight) * 100;
            content.style.transformOrigin = `${ox}% ${oy}%`;
        }
    }
    m.classList.add('open');
}
function closeModal(m) { m.classList.remove('open'); }

if (contactBtn) contactBtn.addEventListener('click', () => openModal(contactModal));

document.addEventListener('click', (e) => {
    if (e.target.closest('.modal-close')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal) closeModal(modal);
    }
    modals.forEach(m => { if (e.target === m) closeModal(m); });
});
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') modals.forEach(m => closeModal(m)); });

// 7. COPY EMAIL
// ... basic logic preserved ...
const copyBtn = document.getElementById('copy-email-btn');
const emailVal = document.getElementById('contact-email-val');
const copyToast = document.getElementById('copy-toast');
if (copyBtn && emailVal && copyToast) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailVal.textContent).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        });
    });
}

// 8. HERO GEOMETRY (0s and 1s)
(function initHeroCanvas() {
    const section = document.getElementById('home');
    if (!section) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    section.style.position = 'relative';
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H;
    let gridPoints = [];

    let mouseX = -1000, mouseY = -1000;
    let targetMouseX = -1000, targetMouseY = -1000;

    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
    });

    const S = 35;

    function buildPoints() {
        gridPoints = [];
        const cols = Math.ceil(W / S) + 2;
        const rows = Math.ceil(H / S) + 2;

        for (let c = -1; c < cols; c++) {
            for (let r = -1; r < rows; r++) {
                gridPoints.push({
                    x: c * S,
                    bx: c * S,
                    y: r * S,
                    by: r * S,
                    val: Math.random() > 0.5 ? '1' : '0'
                });
            }
        }
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        W = section.clientWidth;
        H = section.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildPoints();
    }

    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, W, H);
        time += 0.02;

        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;

        ctx.font = '14px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxShift = 50;
        const effectRadius = 250;

        for (let i = 0; i < gridPoints.length; i++) {
            const pt = gridPoints[i];

            const waveY = Math.sin(pt.bx * 0.005 + time) * 30 + Math.cos(pt.bx * 0.01 - time * 1.5) * 15;
            let targetY = pt.by + waveY;
            let drawX = pt.bx;
            let drawY = targetY;

            const dx = drawX - mouseX;
            const dy = drawY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < effectRadius) {
                const force = Math.pow(1 - dist / effectRadius, 2) * maxShift;
                drawX += (dx / dist) * force;
                drawY += (dy / dist) * force;
                if (Math.random() > 0.95) pt.val = pt.val === '1' ? '0' : '1';
            } else {
                if (Math.random() > 0.999) pt.val = pt.val === '1' ? '0' : '1';
            }

            const alpha = 0.1 + ((waveY + 45) / 90) * 0.3;
            ctx.fillStyle = `rgba(0, 230, 118, ${alpha})`;
            if (dist < effectRadius) {
                ctx.fillStyle = `rgba(0, 180, 216, ${Math.min(0.8, alpha + 0.3)})`;
            }

            ctx.fillText(pt.val, drawX, drawY);
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// 8.5 SPOTLIGHT TEXT INTERACTION
document.querySelectorAll('.spotlight-text').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
        if (!el.classList.contains('active')) el.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        el.classList.remove('active');
    });
});

// 9. DATA FETCH & BOTTOM GEOMETRIC RENDERER
(async function initGeometricPortfolio() {
    const canvas = document.getElementById('portfolio-geometry-canvas');
    const nodesContainer = document.getElementById('project-nodes-container');
    const section = document.getElementById('projects-section');
    if (!canvas || !nodesContainer || !section) return;

    let projects = [];
    try {
        const res = await fetch('projects.json');
        if (res.ok) {
            projects = await res.json();
            projects.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            console.error('Failed to load projects.json');
        }
    } catch (err) {
        console.error('Error fetching projects.json:', err);
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H, dpr;
    let scrollProgress = 0; // 0 to 1 based on section scroll

    const nodeElements = [];
    const ideaElements = [];
    let segments = [];
    let horizontalSegments = [];

    // Add Central Name
    const centerName = document.createElement('div');
    centerName.className = 'geo-center-name';
    centerName.textContent = 'Projects';
    centerName.style.opacity = '0';
    centerName.style.transform = 'translate(-50%, -50%) scale(0.8)';
    centerName.style.transition = 'opacity 0.3s, transform 0.3s';
    nodesContainer.appendChild(centerName);

    // Add Central Ideas Title
    const centerIdeasName = document.createElement('div');
    centerIdeasName.className = 'geo-center-name';
    centerIdeasName.textContent = 'Ideas';
    centerIdeasName.style.opacity = '0';
    centerIdeasName.style.transform = 'translate(-50%, -50%) scale(0.8)';
    centerIdeasName.style.color = '#ffffff'; // explicitly white like Projects
    centerIdeasName.style.transition = 'opacity 0.3s, transform 0.3s';
    nodesContainer.appendChild(centerIdeasName);

    // Create DOM nodes for projects
    projects.forEach((proj, idx) => {
        const node = document.createElement('div');
        node.className = 'geo-project-node';
        node.innerHTML = `
            <div class="node-label">${proj.title}</div>
        `;

        node.addEventListener('click', () => {
            const modalContent = document.getElementById('project-modal-content');
            const tagsHtml = (proj.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('');
            const linkHtml = proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" class="proj-link">View Project →</a>` : '';
            modalContent.innerHTML = `
                <button class="modal-close" aria-label="Close modal">✕</button>
                <h2 class="minimal-title" style="margin-bottom:15px; font-size: 2rem;">${proj.title}</h2>
                <div class="proj-tags">${tagsHtml}</div>
                <div class="proj-desc">${proj.longHtml}</div>
                ${linkHtml}
            `;
            const rect = node.getBoundingClientRect();
            openModal(projectModal, rect);
        });

        nodesContainer.appendChild(node);

        let ring = 1;
        let indexInRing = idx;
        let ringCap = 4;
        let totalSoFar = 4;

        while (idx >= totalSoFar) {
            ring++;
            ringCap = ring * 4;
            indexInRing = idx - totalSoFar;
            totalSoFar += ringCap;
        }

        const angle = (indexInRing / ringCap) * Math.PI * 2;
        nodeElements.push({ el: node, ring: ring, angle: angle });
    });

    // Fetch DOM nodes for Ideas
    let ideasData = [];
    try {
        const res = await fetch('ideas.json');
        if (res.ok) {
            ideasData = await res.json();
        } else {
            console.error('Failed to load ideas.json');
        }
    } catch (err) {
        console.error('Error fetching ideas.json:', err);
    }

    ideasData.forEach((idea, idx) => {
        // Build nodes matching glassy ui
        const node = document.createElement('div');
        node.className = 'geo-project-node';
        node.style.borderColor = 'hsl(200, 100%, 75%)';
        node.style.boxShadow = '0 0 15px rgba(0, 180, 216, 0.4)';
        node.innerHTML = `
            <div class="node-label" style="color: hsl(200, 100%, 85%); text-shadow: 0 0 5px rgba(0, 180, 216, 0.8);">${idea.title}</div>
        `;

        node.addEventListener('click', () => {
            const modalContent = document.getElementById('project-modal-content');
            modalContent.innerHTML = `
                <button class="modal-close" aria-label="Close modal">✕</button>
                <h2 class="minimal-title" style="margin-bottom:15px; font-size: 2.5rem; color: hsl(200, 100%, 75%);">${idea.title}</h2>
                <div class="proj-desc" style="font-size: 1.25rem;">${idea.desc}</div>
            `;
            const rect = node.getBoundingClientRect();
            openModal(projectModal, rect);
        });

        nodesContainer.appendChild(node);
        
        // Spread evenly across horizontal band (0 is -280, 1 is 280, 2 is -560, 3 is 560 for up to 6 nodes)
        let txOffset = (idx === 0) ? -320 : (idx === 1) ? 320 : (idx === 2) ? -640 : 640;
        ideaElements.push({ el: node, data: idea, txOffset: txOffset });
    });

    function generateSegments() {
        segments = [];
        horizontalSegments = [];
        const cx = W / 2;
        const cy = H / 2;
        // maxRadius dynamically calculated from the diagonal to cover all extreme edges
        const maxRadius = Math.max(Math.hypot(W / 2, H / 2) * 1.1, Math.min(W, H) * 0.8);
        const symmetry = 12; // Increased symmetry for more complexity

        // 6 deep Rings to ensure it spans to the corners on any screen format
        const numRings = 6;
        const rings = [];
        for (let i = 1; i <= numRings; i++) {
            rings.push(maxRadius * (i / numRings));
        }

        function pushSeg(r1, a1, r2, a2) {
            const p1 = { x: cx + Math.cos(a1) * r1, y: cy + Math.sin(a1) * r1 };
            const p2 = { x: cx + Math.cos(a2) * r2, y: cy + Math.sin(a2) * r2 };
            // Record distance to center so segments are naturally drawn outwards
            const d1 = Math.hypot(p1.x - cx, p1.y - cy);
            const d2 = Math.hypot(p2.x - cx, p2.y - cy);

            if (d1 < d2) {
                segments.push({ start: p1, end: p2, rStart: d1, rEnd: d2 });
            } else {
                segments.push({ start: p2, end: p1, rStart: d2, rEnd: d1 });
            }
        }

        // Web spokes (straight lines from center cutting all rings)
        for (let i = 0; i < symmetry * 2; i++) {
            const angle = (i * Math.PI) / symmetry;
            pushSeg(0, angle, rings[numRings - 1], angle);
        }

        // Interlocking Stars and Rings
        rings.forEach((R, idx) => {
            const innerR = R * 0.45;
            const midR = R * 0.75;

            // Star inner polygon teeth and complex weaves
            for (let i = 0; i < symmetry * 2; i++) {
                const angle1 = (i * Math.PI) / symmetry;
                const angle2 = ((i + 1) * Math.PI) / symmetry;

                // Primary zigzag / star teeth
                const rad1 = (i % 2 === 0) ? R : innerR;
                const rad2 = ((i + 1) % 2 === 0) ? R : innerR;
                pushSeg(rad1, angle1, rad2, angle2);

                // Secondary overlapping weaves to add depth and complexity
                const mRad1 = (i % 2 === 0) ? midR : innerR * 1.3;
                const mRad2 = ((i + 1) % 2 === 0) ? midR : innerR * 1.3;
                pushSeg(mRad1, angle1, mRad2, angle2);
            }

            // Outer connecting polygon around current ring
            for (let i = 0; i < symmetry; i++) {
                // Outer ring shifted polygon
                const angle1 = (i * Math.PI * 2) / symmetry + (Math.PI / symmetry);
                const angle2 = ((i + 1) * Math.PI * 2) / symmetry + (Math.PI / symmetry);
                pushSeg(R * 0.85, angle1, R * 0.85, angle2);

                // Inner ring strict polygon (creates overlapping 12-point shapes)
                const angle3 = (i * Math.PI * 2) / symmetry;
                const angle4 = ((i + 1) * Math.PI * 2) / symmetry;
                pushSeg(R * 0.95, angle3, R * 0.95, angle4);
            }
        });

        // Finalize segments order by radial start offset
        segments.sort((a, b) => a.rStart - b.rStart);


        // --- IDEAS: GENERATE HORIZONTAL ISLAMIC PATTERN ---
        const D = 320; // Distance between horizontal tile centers
        const starRadius = 140;
        
        function pushHSeg(x1, y1, x2, y2, type="base") {
            const d1 = Math.abs(x1 - cx);
            const d2 = Math.abs(x2 - cx);
            if (d1 < d2) {
                horizontalSegments.push({ start: {x:x1, y:y1}, end: {x:x2, y:y2}, rStart: d1, rEnd: d2, type: type });
            } else {
                horizontalSegments.push({ start: {x:x2, y:y2}, end: {x:x1, y:y1}, rStart: d2, rEnd: d1, type: type });
            }
        }

        // Generate tiles wide enough to comfortably cover ultrawide screens scaling symmetrically from center
        const numTiles = Math.ceil((1.5 * W) / D); 
        for (let t = -numTiles; t <= numTiles; t++) {
            let tx = cx + t * D;
            let ty = cy;

            // Draw 8-point stars at each tile center
            for (let i = 0; i < 8; i++) {
                const a1 = (i * Math.PI) / 4;
                const a2 = ((i + 1) * Math.PI) / 4;
                const rInner = starRadius * 0.45;
                
                // Outer star spikes alternating colors for that 20% accent hue requirement
                const isAccent = (i % 2 !== 0);
                const type = isAccent ? "accent" : "base";
                
                pushHSeg(tx + Math.cos(a1)*starRadius, ty + Math.sin(a1)*starRadius, 
                         tx + Math.cos((a1+a2)/2)*rInner, ty + Math.sin((a1+a2)/2)*rInner, type);
                pushHSeg(tx + Math.cos(a2)*starRadius, ty + Math.sin(a2)*starRadius, 
                         tx + Math.cos((a1+a2)/2)*rInner, ty + Math.sin((a1+a2)/2)*rInner, type);
                         
                // Inner weaves spanning out toward the edges
                pushHSeg(tx, ty, tx + Math.cos(a1)*starRadius, ty + Math.sin(a1)*starRadius, "base");
            }

            // Connecting outer weaves crossing between sequential tiles forming geometric nets
            if (t < numTiles) {
                pushHSeg(tx + starRadius, ty, tx + D - starRadius, ty, "accent");
                pushHSeg(tx + starRadius*Math.cos(Math.PI/4), ty + starRadius*Math.sin(Math.PI/4),
                         tx + D - starRadius*Math.cos(Math.PI/4), ty + starRadius*Math.sin(Math.PI/4), "base");
                pushHSeg(tx + starRadius*Math.cos(-Math.PI/4), ty + starRadius*Math.sin(-Math.PI/4),
                         tx + D - starRadius*Math.cos(-Math.PI/4), ty + starRadius*Math.sin(-Math.PI/4), "base");
            }
        }

        horizontalSegments.sort((a, b) => a.rStart - b.rStart);
    }

    function resize() {
        dpr = window.devicePixelRatio || 1;
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        generateSegments();
        render();
    }
    window.addEventListener('resize', resize);

    function updateScroll() {
        const rect = section.getBoundingClientRect();
        const distance = rect.height - window.innerHeight;

        if (distance <= 0) {
            scrollProgress = 1;
        } else {
            let p = -rect.top / distance;
            scrollProgress = Math.max(0, Math.min(1, p));
        }

        render();
    }
    window.addEventListener('scroll', updateScroll);

    function render() {
        ctx.clearRect(0, 0, W, H);
        if (!W || !H || segments.length === 0) return;

        const cx = W / 2;
        const cy = H / 2;
        const maxRadius = Math.max(Math.hypot(W / 2, H / 2) * 1.1, Math.min(W, H) * 0.8);
        const numRings = 6;
        const baseHue = 160; 

        // Expand drawing sequence linearly across the 2000vh map!
        // Scroll states: 0 to 0.4 = Form radial. 0.4 to 0.5 = Hold. 0.5 to 0.6 = Collapse radial. 0.6 to 1.0 = Form Horizontal.
        
        let p1Progress = 0;
        if (scrollProgress <= 0.4) {
            p1Progress = scrollProgress / 0.4;
        } else if (scrollProgress <= 0.5) {
            p1Progress = 1.0;
        } else if (scrollProgress <= 0.65) {
            p1Progress = 1 - ((scrollProgress - 0.5) / 0.15); 
        }
        p1Progress = Math.max(0, Math.min(1, p1Progress));
        
        // Horizontal Ideas pattern starts drawing at scrollProgress 0.6
        let p2Progress = scrollProgress <= 0.6 ? 0 : ((scrollProgress - 0.6) / 0.4);
        p2Progress = Math.max(0, Math.min(1, p2Progress));

        const drawRadius = p1Progress * (maxRadius * 1.05);
        const horizontalRadius = p2Progress * Math.max(W/2 + 300, 1600); // Ensures it sweeps off entire screen horizontally

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // --- PHASE 1: RADIAL PROJECTS GEOMETRY ---
        if (p1Progress > 0) {
            if (drawRadius > 0) {
                ctx.beginPath();
                ctx.arc(cx, cy, 50, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${baseHue}, 90%, 55%, ${Math.min(0.5, drawRadius / 100)})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(cx, cy, 65, 0, Math.PI * 2);
                ctx.setLineDash([4, 10]);
                ctx.strokeStyle = `hsla(${baseHue + 20}, 90%, 65%, ${Math.min(0.3, drawRadius / 100)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.setLineDash([]);
            }

            segments.forEach(seg => {
                let dStart = seg.rStart;
                let dEnd = seg.rEnd;

                if (dEnd - dStart < 40) dEnd = dStart + 80;
                if (drawRadius < dStart) return;

                let ratio = (drawRadius - dStart) / (dEnd - dStart);
                if (ratio > 1) ratio = 1;

                const drawX = seg.start.x + (seg.end.x - seg.start.x) * ratio;
                const drawY = seg.start.y + (seg.end.y - seg.start.y) * ratio;

                ctx.beginPath();
                ctx.moveTo(seg.start.x, seg.start.y);
                ctx.lineTo(drawX, drawY);

                const grad = ctx.createLinearGradient(seg.start.x, seg.start.y, seg.end.x, seg.end.y);
                const hueProgress = seg.rStart / maxRadius;
                const finalHue1 = baseHue + hueProgress * 80; 
                const finalHue2 = finalHue1 + 35;
                const finalHue3 = finalHue1 + 70;

                grad.addColorStop(0, `hsla(${finalHue1}, 95%, 60%, 0.25)`);
                grad.addColorStop(0.5, `hsla(${finalHue2}, 95%, 65%, 0.35)`);
                grad.addColorStop(1, `hsla(${finalHue3}, 100%, 75%, 0.45)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1 + (1 - (seg.rStart / maxRadius)) * 1.5;

                if (ratio > 0.4) {
                    ctx.shadowColor = `hsla(${finalHue2}, 100%, 65%, 0.3)`;
                    ctx.shadowBlur = 8;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.stroke();
                ctx.shadowBlur = 0; // reset

                // Tip glow
                if (ratio > 0.05 && ratio < 0.99) {
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${finalHue3}, 100%, 85%, 0.6)`;
                    ctx.shadowColor = `hsla(${finalHue3}, 100%, 75%, 0.5)`;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            if (drawRadius > 80) {
                ctx.beginPath();
                ctx.arc(cx, cy, Math.min(drawRadius, maxRadius * 0.15), 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${baseHue + 15}, 80%, 45%, 0.08)`;
                ctx.lineWidth = 12;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(cx, cy, Math.min(drawRadius, maxRadius * 0.28), 0, Math.PI * 2);
                ctx.setLineDash([8, 16]);
                ctx.strokeStyle = `hsla(${baseHue + 40}, 90%, 55%, 0.15)`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }


        // --- PHASE 2: HORIZONTAL IDEAS GEOMETRY ---
        if (p2Progress > 0) {
            horizontalSegments.forEach(seg => {
                let dStart = seg.rStart;
                let dEnd = seg.rEnd;

                if (dEnd - dStart < 40) dEnd = dStart + 80;
                if (horizontalRadius < dStart) return;

                let ratio = (horizontalRadius - dStart) / (dEnd - dStart);
                if (ratio > 1) ratio = 1;

                const drawX = seg.start.x + (seg.end.x - seg.start.x) * ratio;
                const drawY = seg.start.y + (seg.end.y - seg.start.y) * ratio;

                ctx.beginPath();
                ctx.moveTo(seg.start.x, seg.start.y);
                ctx.lineTo(drawX, drawY);

                const grad = ctx.createLinearGradient(seg.start.x, seg.start.y, seg.end.x, seg.end.y);
                const isAccent = seg.type === "accent";
                
                // 80% geometry theme (Teal/Blue), 20% accent theme (Brighter Neon Green variants)
                const hue1 = isAccent ? baseHue - 20 : baseHue + 30;
                const hue2 = isAccent ? baseHue + 10 : baseHue + 60;
                const hue3 = isAccent ? baseHue + 40 : baseHue + 90;

                grad.addColorStop(0, `hsla(${hue1}, 95%, 60%, 0.25)`);
                grad.addColorStop(0.5, `hsla(${hue2}, 95%, 65%, 0.35)`);
                grad.addColorStop(1, `hsla(${hue3}, 100%, 75%, 0.45)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = isAccent ? 2.5 : 1 + (1 - (seg.rStart / 1000)) * 1.5;

                ctx.shadowColor = `hsla(${hue2}, 100%, 65%, 0.4)`;
                ctx.shadowBlur = ratio > 0.4 ? 12 : 0;
                ctx.stroke();
                ctx.shadowBlur = 0; 

                if (ratio > 0.05 && ratio < 0.99) {
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, isAccent ? 3 : 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue3}, 100%, 85%, 0.8)`;
                    ctx.shadowColor = `hsla(${hue3}, 100%, 75%, 0.8)`;
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });
            
            // Central horizontal glowing beam running through the heart of the new lattice
            if (horizontalRadius > 20) {
                ctx.beginPath();
                ctx.moveTo(cx - (horizontalRadius - 20), cy);
                ctx.lineTo(cx + (horizontalRadius - 20), cy);
                ctx.strokeStyle = `hsla(${baseHue + 40}, 100%, 60%, 0.08)`;
                ctx.lineWidth = 15;
                ctx.stroke();
            }
        }


        // --- HANDLE DOM NODES UI LAYER ---
        const ringRadii = [];
        for (let i = 1; i <= numRings; i++) ringRadii.push(maxRadius * (i / numRings));

        nodeElements.forEach(item => {
            const nodeDist = ringRadii[item.ring - 1] || maxRadius;
            let nodeScale = 0;

            if (p1Progress > 0 && drawRadius > nodeDist - 20) {
                let localP = Math.min(1, (drawRadius - nodeDist + 20) / 100);
                const bounce = Math.sin(localP * Math.PI) * 0.3;
                nodeScale = Math.pow(localP, 0.4) + bounce;
            }

            const targetX = cx + Math.cos(item.angle) * nodeDist;
            const targetY = cy + Math.sin(item.angle) * nodeDist;

            item.el.style.left = `${targetX}px`;
            item.el.style.top = `${targetY}px`;

            if (nodeScale > 0) {
                item.el.classList.add('visible');
                item.el.style.transform = `translate(-50%, -50%) scale(${Math.max(0, nodeScale)})`;
            } else {
                item.el.classList.remove('visible');
                item.el.style.transform = `translate(-50%, -50%) scale(0)`;
            }
        });

        ideaElements.forEach(item => {
            let nodeScale = 0;
            const nodeDist = Math.abs(item.txOffset);

            if (p2Progress > 0 && horizontalRadius > nodeDist - 20) {
                let localP = Math.min(1, (horizontalRadius - nodeDist + 20) / 100);
                const bounce = Math.sin(localP * Math.PI) * 0.3;
                nodeScale = Math.pow(localP, 0.4) + bounce;
            }

            const targetX = cx + item.txOffset;
            const targetY = cy;

            item.el.style.left = `${targetX}px`;
            item.el.style.top = `${targetY}px`;

            if (nodeScale > 0) {
                item.el.classList.add('visible');
                item.el.style.transform = `translate(-50%, -50%) scale(${Math.max(0, nodeScale)})`;
            } else {
                item.el.classList.remove('visible');
                item.el.style.transform = `translate(-50%, -50%) scale(0)`;
            }
        });

        // Center Labels cross-fading based on their phases
        const appearThreshold = ringRadii[0] * 0.5;
        if (p1Progress > 0 && drawRadius > appearThreshold) {
            let nameOpacity = Math.min(1, (drawRadius - appearThreshold) / 200);
            centerName.style.opacity = nameOpacity;
            centerName.style.visibility = 'visible';
            centerName.style.transform = `translate(-50%, -50%) scale(${0.8 + nameOpacity * 0.2})`;
        } else {
            centerName.style.opacity = '0';
            centerName.style.visibility = 'hidden';
            centerName.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
        
        if (p2Progress > 0 && horizontalRadius > 50) {
            let nameOpacity = Math.min(1, (horizontalRadius - 50) / 200);
            centerIdeasName.style.opacity = nameOpacity;
            centerIdeasName.style.visibility = 'visible';
            centerIdeasName.style.transform = `translate(-50%, -50%) scale(${0.8 + nameOpacity * 0.2})`;
        } else {
            centerIdeasName.style.opacity = '0';
            centerIdeasName.style.visibility = 'hidden';
            centerIdeasName.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
    }

    resize();
    updateScroll();
})();

// 10. IDEAS GRID INJECTION
(function initIdeasGrid() {
    // Features migrated to main architectural project canvas.
})();
