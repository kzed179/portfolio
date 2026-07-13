// ---------- cursor spotlight on grid background ----------
const spotlight = document.getElementById('spotlight');
window.addEventListener('mousemove', (e) => {
  spotlight.style.setProperty('--mx', e.clientX + 'px');
  spotlight.style.setProperty('--my', e.clientY + 'px');
});

// ---------- typing animation for role text in sidebar ----------
const roles = ["AI & Data Science Student", "Aspiring ML Engineer", "Data Analyst"];
const roleEl = document.getElementById('role-text');
let ri = 0, ci = 0, deleting = false;

function typeLoop(){
  const current = roles[ri];
  if(!deleting){
    ci++;
    roleEl.textContent = current.slice(0, ci);
    if(ci === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    ci--;
    roleEl.textContent = current.slice(0, ci);
    if(ci === 0){ deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// ---------- scroll reveal (pops sections in as you scroll to them) ----------
const revealEls = document.querySelectorAll('.reveal:not(.in)');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- animated counting stats ----------
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const decimals = parseInt(el.getAttribute('data-decimal') || '0');
      const duration = 1200;
      const startTime = performance.now();

      function step(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const val = target * progress;
        el.textContent = val.toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterIO.observe(el));

document.querySelectorAll('[data-static]').forEach(el => {
  el.textContent = el.getAttribute('data-static');
});

// ---------- active nav highlighting ----------
const navLinks = document.querySelectorAll('.sb-nav a, .mobile-nav a');
const navSections = document.querySelectorAll('main section[id], main header[id]');

function updateActiveNav(){
  // pick a reference line about 40% down the viewport
  const scrollLine = window.scrollY + window.innerHeight * 0.4;

  let current = navSections[0];
  navSections.forEach(sec => {
    if (sec.offsetTop <= scrollLine) current = sec;
  });

  navLinks.forEach(l => l.classList.remove('active'));
  const match = document.querySelector(`.sb-nav a[href="#${current.id}"]`);
  if (match) match.classList.add('active');
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('resize', updateActiveNav);
updateActiveNav(); // run once on load

// ---------- 3D cursor-tilt on project cards ----------
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const rx = ((py / rect.height) - 0.5) * -6;
    const ry = ((px / rect.width) - 0.5) * 6;

    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    card.style.setProperty('--px', px + 'px');
    card.style.setProperty('--py', py + 'px');
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});