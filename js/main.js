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

  /* ── NAV SHADOW + SCROLL PROGRESS + BACK TO TOP ── */
  const nav             = document.getElementById('nav');
  const progressFill    = document.querySelector('.scroll-progress__fill');
  const backToTopBtn    = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    nav.classList.toggle('nav--scrolled', scrollTop > 40);
    progressFill.style.width = pct + '%';
    backToTopBtn.classList.toggle('visible', scrollTop > 320);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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

  /* ── LIGHTBOX CONSEILS ── */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML =
    '<div class="lightbox__inner">' +
      '<button class="lightbox__close" aria-label="Fermer">✕</button>' +
      '<img class="lightbox__img" src="" alt="">' +
      '<span class="lightbox__hint">🔍 Molette pour zoomer · Glisser pour naviguer · Double-clic pour réinitialiser</span>' +
    '</div>';
  document.body.appendChild(lightbox);

  const lbImg  = lightbox.querySelector('.lightbox__img');
  const lbClose = lightbox.querySelector('.lightbox__close');
  const lbHint  = lightbox.querySelector('.lightbox__hint');
  let lbHintTimer;

  // État zoom / pan
  let lbScale = 1, lbTX = 0, lbTY = 0;
  let isPanning = false, panStartX, panStartY;

  function lbApply(animated) {
    lbImg.style.transition = animated ? 'transform 0.2s ease' : 'none';
    lbImg.style.transform  = `translate(${lbTX}px, ${lbTY}px) scale(${lbScale})`;
    lbImg.style.cursor     = lbScale > 1 ? 'grab' : 'zoom-in';
  }

  function lbReset(animated) {
    lbScale = 1; lbTX = 0; lbTY = 0;
    lbApply(animated !== false);
  }

  function openLightbox(src, alt) {
    lbReset(false);
    lbImg.src = src;
    lbImg.alt = alt;
    lbImg.style.transition = 'transform 0.22s ease';
    lbImg.style.transform  = 'scale(0.94)';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lbImg.style.transform = 'scale(1)';
    }));
    lbHint.style.opacity = '1';
    clearTimeout(lbHintTimer);
    lbHintTimer = setTimeout(() => { lbHint.style.opacity = '0'; }, 3000);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbReset(false);
  }

  // Zoom molette
  lbImg.addEventListener('wheel', e => {
    e.preventDefault();
    const factor   = e.deltaY < 0 ? 1.25 : 1 / 1.25;
    const rect     = lbImg.getBoundingClientRect();
    const ox       = e.clientX - (rect.left + rect.width  / 2);
    const oy       = e.clientY - (rect.top  + rect.height / 2);
    const newScale = Math.min(Math.max(lbScale * factor, 1), 8);
    lbTX = lbTX - ox * (newScale / lbScale - 1);
    lbTY = lbTY - oy * (newScale / lbScale - 1);
    lbScale = newScale;
    if (lbScale <= 1) { lbScale = 1; lbTX = 0; lbTY = 0; }
    lbApply(false);
  }, { passive: false });

  // Double-clic : zoom rapide / réinitialiser
  lbImg.addEventListener('dblclick', e => {
    if (lbScale > 1) {
      lbReset(true);
    } else {
      const rect = lbImg.getBoundingClientRect();
      const ox   = e.clientX - (rect.left + rect.width  / 2);
      const oy   = e.clientY - (rect.top  + rect.height / 2);
      lbScale = 2.5;
      lbTX = -ox * (lbScale - 1);
      lbTY = -oy * (lbScale - 1);
      lbApply(true);
    }
  });

  // Glisser pour naviguer
  function onLbMouseMove(e) {
    lbTX = e.clientX - panStartX;
    lbTY = e.clientY - panStartY;
    lbApply(false);
  }
  function onLbMouseUp() {
    isPanning = false;
    lbImg.style.cursor = lbScale > 1 ? 'grab' : 'zoom-in';
    document.removeEventListener('mousemove', onLbMouseMove);
    document.removeEventListener('mouseup', onLbMouseUp);
  }
  lbImg.addEventListener('mousedown', e => {
    if (lbScale <= 1) return;
    isPanning  = true;
    panStartX  = e.clientX - lbTX;
    panStartY  = e.clientY - lbTY;
    lbImg.style.cursor = 'grabbing';
    e.preventDefault();
    document.addEventListener('mousemove', onLbMouseMove);
    document.addEventListener('mouseup', onLbMouseUp);
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  lbClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

  /* ── MARQUEE AVIS — pause au tap sur mobile ── */
  const marqueeTrack = document.querySelector('.avis-marquee__track');
  if (marqueeTrack) {
    let marqueePaused = false;
    document.querySelector('.avis-marquee').addEventListener('touchstart', () => {
      marqueePaused = !marqueePaused;
      marqueeTrack.style.animationPlayState = marqueePaused ? 'paused' : 'running';
    }, { passive: true });
  }

  /* ── CAROUSEL GALERIE ── */
  const carouselEl = document.querySelector('.carousel');
  if (carouselEl) {
    if (window.innerWidth < 768) {
      carouselEl.querySelectorAll('[data-mobile-hidden]').forEach(el => el.remove());
    }
    const track   = carouselEl.querySelector('.carousel__track');
    const slides  = carouselEl.querySelectorAll('.carousel__slide');
    const btnPrev = carouselEl.querySelector('.carousel__btn--prev');
    const btnNext = carouselEl.querySelector('.carousel__btn--next');
    const dotsEl  = carouselEl.querySelector('.carousel__dots');
    const total   = slides.length;
    let current   = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Transformation ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dotsEl.querySelectorAll('.carousel__dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    // Keyboard
    carouselEl.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch swipe
    let touchX = 0;
    carouselEl.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    carouselEl.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Pause on hover
    carouselEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carouselEl.addEventListener('mouseleave', resetAuto);

    resetAuto();
  }

  /* ── CAROUSEL CONSEILS (flashcards) ── */
  const conseilsEl = document.querySelector('.conseils__carousel');
  if (conseilsEl) {
    const cTrack    = conseilsEl.querySelector('.conseils__track');
    const cCards    = conseilsEl.querySelectorAll('.conseil-card');
    const cBtnPrev  = conseilsEl.querySelector('.conseils__btn--prev');
    const cBtnNext  = conseilsEl.querySelector('.conseils__btn--next');
    const cDotsEl   = conseilsEl.querySelector('.conseils__dots');
    const cTotal    = cCards.length;
    let cCurrent    = 0;
    let cAutoTimer;

    cCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'conseils__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Conseil ' + (i + 1));
      dot.addEventListener('click', () => cGoTo(i));
      cDotsEl.appendChild(dot);
    });

    function cGoTo(idx) {
      const prev = cCards[cCurrent];
      prev.classList.remove('is-flipped');
      prev.style.height = '';
      cCurrent = (idx + cTotal) % cTotal;
      cTrack.style.transform = 'translateX(-' + cCurrent * 100 + '%)';
      cDotsEl.querySelectorAll('.conseils__dot').forEach((d, i) => {
        d.classList.toggle('active', i === cCurrent);
      });
      cResetAuto();
    }

    function cResetAuto() {
      clearInterval(cAutoTimer);
      cAutoTimer = setInterval(() => cGoTo(cCurrent + 1), 6000);
    }

    cBtnPrev.addEventListener('click', () => cGoTo(cCurrent - 1));
    cBtnNext.addEventListener('click', () => cGoTo(cCurrent + 1));

    cCards.forEach(card => {
      const backImg = card.querySelector('.conseil-card__back img');

      function flipOpen() {
        if (backImg.naturalWidth > 0) {
          const ratio = backImg.naturalHeight / backImg.naturalWidth;
          card.style.height = Math.round(card.offsetWidth * ratio) + 'px';
        }
        card.classList.add('is-flipped');
      }

      card.addEventListener('click', () => {
        if (card.classList.contains('is-flipped')) {
          openLightbox(backImg.src, card.querySelector('.conseil-card__back-overlay').textContent.trim());
        } else if (backImg.complete && backImg.naturalWidth > 0) {
          flipOpen();
        } else {
          backImg.addEventListener('load', flipOpen, { once: true });
          card.classList.add('is-flipped');
        }
      });
    });

    let cTouchX = 0;
    conseilsEl.addEventListener('touchstart', e => { cTouchX = e.touches[0].clientX; }, { passive: true });
    conseilsEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - cTouchX;
      if (Math.abs(dx) > 40) cGoTo(cCurrent + (dx < 0 ? 1 : -1));
    }, { passive: true });

    conseilsEl.addEventListener('mouseenter', () => clearInterval(cAutoTimer));
    conseilsEl.addEventListener('mouseleave', cResetAuto);
    conseilsEl.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  cGoTo(cCurrent - 1);
      if (e.key === 'ArrowRight') cGoTo(cCurrent + 1);
    });

    cResetAuto();
  }

});
