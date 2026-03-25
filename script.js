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
        if (bgLayer) bgLayer.style.backgroundColor = 'rgb(5, 10, 5)';
        if (geoCanvas) geoCanvas.style.opacity = 1;
        if (miniNav) {
            miniNav.style.background = 'rgba(5, 10, 5, 0.8)';
            miniNav.style.borderColor = 'rgba(255,255,255,0.1)';
        }
        navTabs.forEach(t => { if (!t.classList.contains('active')) t.style.color = '#a0a0a0'; else { t.style.background = '#ffffff'; t.style.color = '#000000'; } });
        if (quranBanner) {
            quranBanner.style.background = 'rgba(5,10,5,0.9)';
            quranBanner.style.color = '#2ecc40';
        }
    } else {
        navTabs.forEach(t => { t.style.background = ''; t.style.color = ''; });
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

    // Background Interpolate (255,255,255 -> 5,10,5)
    const rBg = Math.round(255 - progress * (255 - 5));
    const gBg = Math.round(255 - progress * (255 - 10));
    const bBg = Math.round(255 - progress * (255 - 5));
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
            t.style.color = `rgb(${textLum * 0.6}, ${textLum * 0.6}, ${textLum * 0.6})`;
        } else {
            t.style.background = `rgb(${textLum}, ${textLum}, ${textLum})`;
            t.style.color = `rgb(${rBg}, ${gBg}, ${bBg})`;
        }
    });

    // Quran Banner
    if (quranBanner) {
        quranBanner.style.background = `rgba(${rBg}, ${gBg}, ${bBg}, 0.9)`;
        const rQ = Math.round(0 + progress * (46 - 0));
        const gQ = Math.round(0 + progress * (204 - 0));
        const bQ = Math.round(0 + progress * (64 - 0));
        quranBanner.style.color = `rgb(${rQ}, ${gQ}, ${bQ})`;
    }

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
function triggerAboutReveals() {
    document.querySelectorAll('.mask-reveal').forEach(el => el.classList.add('visible'));
}

// 6. MODALS
const contactBtn = document.getElementById('btn-contact-me');
const contactModal = document.getElementById('contact-modal');
const projectModal = document.getElementById('project-modal');
const modals = [contactModal, projectModal];

function openModal(m) { m.classList.add('open'); }
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

// 8. DATA FETCH
async function loadProjects() {
    const container = document.getElementById('projects-bubble-container');
    if (!container) return;
    try {
        const res = await fetch('./timeline.json');
        const data = await res.json();
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        const positions = ['bubble-pos-large', 'bubble-pos-medium', 'bubble-pos-small'];

        data.forEach((proj, index) => {
            const posClass = positions[index % positions.length];
            const bubble = document.createElement('div');
            bubble.className = `project-bubble ${posClass}`;
            bubble.innerHTML = `
                <h3 class="bubble-title">${proj.title}</h3>
                <p class="bubble-short">${proj.short}</p>
            `;
            bubble.addEventListener('click', () => {
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
                openModal(projectModal);
            });
            container.appendChild(bubble);
        });
    } catch (e) { }
}
loadProjects();

// 9. NEW MINIMAL GEO CANVAS
(function initNewGeo() {
    const canvas = document.getElementById('geo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H, dpr, scrollY = 0;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

    const config = { symmetry: 8, speed: 0.00008 };

    function drawStar(cx, cy, radius, rotation, alpha) {
        ctx.beginPath();
        for (let i = 0; i < config.symmetry * 2; i++) {
            const angle = (i * Math.PI) / config.symmetry + rotation;
            const r = (i % 2 === 0) ? radius : radius * 0.5;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(34, 139, 34, ${alpha})`;
        ctx.lineWidth = 1; ctx.stroke();
    }

    function render(time) {
        ctx.clearRect(0, 0, W, H);
        const cx = W / 2;
        const cy = (H / 2) - (scrollY * 0.15);
        const rBase = Math.min(W, H) * 0.4;

        for (let i = 1; i <= 5; i++) {
            const r = rBase * (i * 0.4);
            const rot = time * config.speed * (i % 2 === 0 ? 1 : -1) + (i * Math.PI / 16);
            const alpha = 0.15 - (i * 0.025);
            if (alpha > 0) {
                drawStar(cx, cy, r, rot, alpha);
                ctx.beginPath();
                ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(34, 139, 34, ${alpha * 0.3})`;
                ctx.stroke();
            }
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})();
