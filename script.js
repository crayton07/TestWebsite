// THEME TOGGLE (dark/light with preference + localStorage)
(() => {
  const btn = document.querySelector('.theme-toggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
  btn?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || (prefersLight.matches ? 'light' : 'dark');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
})();

// HAMBURGER MENU
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
    document.body.classList.toggle('no-scroll', !open);
  });
  // Close on link tap (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) toggle.click();
    });
  });
})();

// SMOOTH SCROLL
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();

// FADE-INS
(() => {
  const faders = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  faders.forEach(el => io.observe(el));
})();

// ACTIVE NAV HIGHLIGHT
(() => {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-55% 0px -40% 0px', threshold: 0.1 });
  sections.forEach(s => spy.observe(s));
})();

// PARALLAX (reduced on mobile & reduced motion)
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layer1 = document.querySelectorAll('.layer-1');
  const layer2 = document.querySelectorAll('.layer-2');
  const layer3 = document.querySelectorAll('.layer-3');
  const isMobile = () => window.matchMedia('(max-width: 700px)').matches;
  if (prefersReduced) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      const y = window.pageYOffset;
      const f1 = isMobile() ? -0.06 : -0.15;
      const f2 = isMobile() ?  0.03 :  0.08;
      const f3 = isMobile() ?  0.06 :  0.16;
      layer1.forEach(el => { el.style.backgroundPositionY = (y * f1) + 'px'; });
      layer2.forEach(el => { el.style.transform = 'translateY(' + (y * f2) + 'px)'; });
      layer3.forEach(el => { el.style.transform = 'translateY(' + (y * f3) + 'px)'; });
      ticking = false;
    });
    ticking = true;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

// CONTACT FORM (validation + fake submit + downloadable quote template)
(() => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const dlBtn = document.getElementById('download-quote');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.classList.remove('error');
    const fd = new FormData(form);
    const required = ['name','phone','email','message'];
    for (const key of required) {
      const val = String(fd.get(key) || '').trim();
      if (!val) {
        statusEl.textContent = 'Please complete all fields.';
        statusEl.classList.add('error');
        return;
      }
    }
    // simple email check
    const email = String(fd.get('email'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      statusEl.textContent = 'Please enter a valid email address.';
      statusEl.classList.add('error');
      return;
    }
    statusEl.textContent = 'Sending...';
    await new Promise(r => setTimeout(r, 700));
    statusEl.textContent = 'Thanks! We\'ll get back to you shortly.';
    form.reset();
  });

  // Generate a simple text-based quote request template for download
  dlBtn?.addEventListener('click', () => {
    const content = [
      'T&D Transport LLC — Quote Request',
      '---------------------------------',
      'Contact Name:',
      'Phone:',
      'Email:',
      'Pickup Address:',
      'Delivery Address:',
      'Pickup Date/Time:',
      'Delivery Date/Time:',
      'Load Description (vehicle/equipment/other):',
      'Approx. Weight & Dimensions:',
      'Special Instructions:'
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TD_Transport_Quote_Request.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  });
})();
