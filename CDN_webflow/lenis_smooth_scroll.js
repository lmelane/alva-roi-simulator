// =============================================
// LENIS SMOOTH SCROLL - WEBFLOW COMPATIBLE
// =============================================

(function() {
  'use strict';

  // Attendre que Lenis soit chargé
  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.error('Lenis library not loaded. Please include Lenis before this script.');
      return;
    }

    // Configuration Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Exposer globalement
    window.lenis = lenis;

    // Anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          lenis.scrollTo(target, {
            offset: 0,
            duration: 1.2
          });
        }
      });
    });

    // Stop/Start avec attributs data
    document.querySelectorAll('[data-lenis-stop]').forEach(el => {
      el.addEventListener('click', () => lenis.stop());
    });

    document.querySelectorAll('[data-lenis-start]').forEach(el => {
      el.addEventListener('click', () => lenis.start());
    });

    document.querySelectorAll('[data-lenis-toggle]').forEach(el => {
      el.addEventListener('click', () => {
        lenis.options.smoothWheel ? lenis.stop() : lenis.start();
      });
    });

    console.log('✅ Lenis Smooth Scroll initialized');
  }

  // Initialiser au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    initLenis();
  }

})();
