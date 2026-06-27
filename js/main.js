/* ════════════════════════════════════════════
   LA PUCE À L'OREILLE — main.js
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV BURGER ── */
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Fermer le menu au clic sur un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  /* ── NAV SHADOW AU SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── FADE-UP ANIMATIONS (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));

  /* ── SMOOTH SCROLL ANCRES ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 8;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

});
