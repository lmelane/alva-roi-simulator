(function initSlider(){
  const ready = (fn) => window.Webflow ? window.Webflow.push(fn)
    : (document.readyState !== 'loading' ? fn()
      : document.addEventListener('DOMContentLoaded', fn));

  ready(() => {
    const DEFAULT_MIN=0, DEFAULT_MAX=400, DEFAULT_STEP=1;

    const OVERRIDES = {
      employees:         {min:1,   max:10000, step:1},
      processes:         {min:1,   max:50,    step:1},
      timePerTask:       {min:0.1, max:24,    step:0.1},
      hourlyCost:        {min:20,  max:500,   step:1},
      currentAutomation: {min:0,   max:100,   step:1},
      targetAutomation:  {min:0,   max:100,   step:1},
    };

    // Timing & easing
    const SMOOTH_MS = 600; // Animation fluide mais pas trop lente
    const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'; // ease-in-out standard
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clamp01 = (x)=> Math.max(0, Math.min(1, x));
    const roundToStep = (v, step, min)=> Math.round((v-min)/step)*step + min;

    // verrouille un input pour le rendre totalement inerte
    const hardDisable = (el) => {
      if (!el) return;
      el.disabled = true;
      el.setAttribute('disabled','');
      el.setAttribute('tabindex','-1');
      el.setAttribute('aria-disabled','true');
      el.style.pointerEvents = 'none';
      el.style.userSelect = 'none';
      el.style.background = 'transparent';
      el.style.border = 'none';
      el.style.opacity = '1';
    };

    // transitions via transform (meilleure perf)
    const applySmoothTransition = (el, props) => {
      if (!el) return;
      const base = REDUCED ? '0ms linear' : `${SMOOTH_MS}ms ${EASE}`;
      el.style.transition = (props || ['transform']).map(p => `${p} ${base}`).join(', ');
      el.style.willChange = (props || ['transform']).join(', ');
    };
    const removeTransition = (el) => { if(el){ el.style.transition = 'none'; el.style.willChange = 'auto'; } };

    // Accessibilité: applique les attributs ARIA sur le wrapper
    const applyAria = (wrapper, {min, max, step, value}) => {
      wrapper.setAttribute('role','slider');
      wrapper.setAttribute('tabindex','0'); // focus clavier
      wrapper.setAttribute('aria-valuemin', String(min));
      wrapper.setAttribute('aria-valuemax', String(max));
      wrapper.setAttribute('aria-valuenow', String(value));
      wrapper.setAttribute('aria-valuetext', String(value));
    };

    document.querySelectorAll('.range-wrapper').forEach((wrapper) => {
      const fillWrapper = wrapper.querySelector('.fill-wrapper');
      const fillEl = wrapper.querySelector('.input-fill') || fillWrapper;
      const dotEl  = wrapper.querySelector('.custom-dot-container');
      const inputEl = wrapper.querySelector('input.number');

      // style de base pour scale/translate
      if (fillEl) {
        fillEl.style.transformOrigin = 'left center';
        // évite clash si CSS externe force width; on bascule sur scaleX
        fillEl.style.width = '100%';
      }
      if (dotEl) {
        dotEl.style.transform = 'translateX(0%)';
      }

      const key =
        (wrapper.id && wrapper.id.trim()) ||
        (inputEl && inputEl.id && inputEl.id.trim()) ||
        (inputEl && inputEl.name && inputEl.name.trim()) || '';

      let min  = Number(wrapper.getAttribute('data-min')  || DEFAULT_MIN);
      let max  = Number(wrapper.getAttribute('data-max')  || DEFAULT_MAX);
      let step = Number(wrapper.getAttribute('data-step') || DEFAULT_STEP);

      if (key && OVERRIDES[key]) {
        const o = OVERRIDES[key];
        if (typeof o.min  === 'number') min  = o.min;
        if (typeof o.max  === 'number') max  = o.max;
        if (typeof o.step === 'number') step = o.step;
      }

      // input hidden miroir pour la soumission
      let mirror = wrapper.querySelector('input.mirror[type="hidden"]');
      if (!mirror) {
        mirror = document.createElement('input');
        mirror.type = 'hidden';
        mirror.className = 'mirror';
        const baseName = (inputEl && inputEl.name) ? (inputEl.name + '_value') : 'slider_value';
        mirror.name = baseName;
        (inputEl && inputEl.parentElement ? inputEl.parentElement : wrapper).appendChild(mirror);
      }

      // input visible inerte
      hardDisable(inputEl);

      // Interactions
      wrapper.style.touchAction = wrapper.style.touchAction || 'none';
      [wrapper, fillWrapper, dotEl].forEach(el => { if (el) el.style.pointerEvents = 'auto'; });

      // transitions smooth par défaut
      applySmoothTransition(fillEl, ['transform']);
      applySmoothTransition(dotEl,  ['transform']);

      // Helpers valeurs
      let value = 0;
      const decimals = (String(step).split('.')[1] || '').length;

      const setValue = (v, animate=true) => {
        value = Math.max(min, Math.min(max, Number(v)));
        const p = (value - min) / (max - min);
        // animation
        if (!animate || REDUCED) {
          removeTransition(fillEl); removeTransition(dotEl);
        } else {
          applySmoothTransition(fillEl, ['transform']);
          applySmoothTransition(dotEl,  ['transform']);
        }
        if (fillEl) fillEl.style.transform = `scaleX(${p})`;
        if (dotEl)  dotEl.style.transform  = `translateX(${p*100}%)`;
        if (inputEl) inputEl.value = String(value.toFixed(decimals));
        if (mirror)  mirror.value   = String(value.toFixed(decimals));
        wrapper.setAttribute('data-value', String(value));
        // ARIA live values
        wrapper.setAttribute('aria-valuenow', String(value));
        wrapper.setAttribute('aria-valuetext', String(value));
      };

      const valueFromX = (clientX) => {
        const rect = wrapper.getBoundingClientRect();
        const frac = clamp01((clientX - rect.left) / rect.width);
        const raw  = min + frac * (max - min);
        const snapped = Math.max(min, Math.min(max, roundToStep(raw, step, min)));
        return Number(snapped.toFixed(decimals));
      };

      let dragging = false;
      let hasMoved = false;

      const onDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        dragging = true;
        hasMoved = false;
        wrapper.setPointerCapture?.(e.pointerId);
        document.body.style.userSelect = 'none';
        // pendant le drag → pas de transition pour suivre le curseur
        removeTransition(fillEl);
        removeTransition(dotEl);
        setValue(valueFromX(e.clientX), /*animate*/false);
      };
      const onMove = (e) => {
        if (!dragging) return;
        hasMoved = true;
        setValue(valueFromX(e.clientX), /*animate*/false);
      };
      const onUp = () => {
        const wasDragging = dragging;
        dragging = false;
        document.body.style.userSelect = '';
        // Réactiver les transitions après un drag
        if (wasDragging && hasMoved) {
          applySmoothTransition(fillEl, ['transform']);
          applySmoothTransition(dotEl,  ['transform']);
        }
      };

      [wrapper, fillWrapper, dotEl].forEach(el => {
        if (el) el.addEventListener('pointerdown', onDown, {passive:true});
      });
      wrapper.addEventListener('pointermove', onMove, {passive:true});
      wrapper.addEventListener('pointerup', onUp, {passive:true});
      wrapper.addEventListener('pointercancel', onUp);

      // Click simple (sans drag) → animation smooth
      wrapper.addEventListener('click', (e) => {
        if (!hasMoved && (e.button === 0 || e.button === undefined)) {
          setValue(valueFromX(e.clientX), /*animate*/true);
        }
        hasMoved = false; // Reset pour le prochain click
      });

      // Clavier (accessibilité)
      wrapper.addEventListener('keydown', (e) => {
        const big = Math.max(step, (max-min)/10);
        let delta = 0;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = +step;
        else if (e.key === 'PageDown') delta = -big;
        else if (e.key === 'PageUp')   delta = +big;
        else if (e.key === 'Home')     { setValue(min, true); e.preventDefault(); return; }
        else if (e.key === 'End')      { setValue(max, true); e.preventDefault(); return; }
        if (delta !== 0) {
          setValue(roundToStep(value + delta, step, min), true);
          e.preventDefault();
        }
      });

      // Valeur initiale
      const initial = Number((inputEl && inputEl.value) || wrapper.getAttribute('data-value'));
      const startVal = Number.isFinite(initial) ? Math.max(min, Math.min(max, initial)) : min;
      setValue(startVal, /*animate*/false);
      applyAria(wrapper, {min, max, step, value:startVal});

      // Recalage au resize (sans animation, puis on remettra la transition au prochain click)
      window.addEventListener('resize', () => {
        const v = Number(wrapper.getAttribute('data-value')) || min;
        setValue(v, /*animate*/false);
      });
    });

    // Si Webflow recharge dynamiquement des blocs
    const mo = new MutationObserver(() => {
      document.querySelectorAll('input.number:not([disabled])').forEach(el => {
        el && el.tagName === 'INPUT' && hardDisable(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });
})();