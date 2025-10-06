  // =============================================
  // ANIMATION SPLIT TEXT (ScrollTrigger)
  // =============================================
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function() {
    try {
      gsap.registerPlugin(ScrollTrigger);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const targets = document.querySelectorAll('[animation="animation"]');

      if (!targets.length) return;

      // Fonction pour spliter les mots (robuste et préserve le HTML)
      function splitWordsDeep(root) {
        if (root.dataset.gsapSplit === "1") return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const text = (node.nodeValue || "").replace(/\s+/g, ' ');
            return text.trim().length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        });

        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);

        textNodes.forEach(node => {
          const text = node.nodeValue.replace(/\s+/g, ' ');
          const frag = document.createDocumentFragment();
          const words = text.split(' ');

          words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'gsap-word';
            span.textContent = word;
            frag.appendChild(span);
            if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
          });

          node.parentNode.replaceChild(frag, node);
        });

        root.dataset.gsapSplit = "1";
      }

      // Initialisation des animations
      targets.forEach(el => {
        splitWordsDeep(el);
        const words = el.querySelectorAll('.gsap-word');

        if (reduceMotion) {
          gsap.set(words, { opacity: 1, yPercent: 0, rotateX: 0 });
          el.style.visibility = 'visible';
          return;
        }

        // Animation par défaut
        gsap.set(words, { opacity: 0, yPercent: 120, rotateX: 40, transformOrigin: '0% 100%' });
        const tl = gsap.timeline({ paused: true })
          .to(words, {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            ease: 'expo.out',
            duration: 0.9,
            stagger: { each: 0.04, from: 'start' },
          }, 0);

        el.style.visibility = 'visible';

        // Déclenchement au scroll
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => tl.restart(true),
          onEnterBack: () => tl.restart(true),
          onLeave: () => gsap.set(words, { opacity: 0, yPercent: 120, rotateX: 40 }),
          once: false,
        });
      });

    } catch(err) {
      console.error('GSAP Text Animation error:', err);
    }
  });