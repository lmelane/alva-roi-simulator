(function initSlider(){
    const ready = (fn) => window.Webflow ? window.Webflow.push(fn)
      : (document.readyState !== 'loading' ? fn()
        : document.addEventListener('DOMContentLoaded', fn));
  
    ready(() => {
      const DEFAULT_MIN=0, DEFAULT_MAX=400, DEFAULT_STEP=1;
  
      // Overrides par ID
      const OVERRIDES = {
        employees:         {min:1,   max:10000, step:1},
        processes:         {min:1,   max:50,    step:1},
        timePerTask:       {min:0.1, max:24,    step:0.1},
        hourlyCost:        {min:20,  max:500,   step:1},
        currentAutomation: {min:0,   max:100,   step:1},
        targetAutomation:  {min:0,   max:100,   step:1},
      };
  
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
  
      // applique une transition très lente aux éléments visuels
      const SLOW_MS = 1500; // << beaucoup plus lent
      const applySlowTransition = (el) => {
        if (!el) return;
        // width pour le fill, left pour le dot
        const base = ` ${SLOW_MS}ms cubic-bezier(.25,.8,.25,1)`;
        const props = [];
        // on pose les deux au cas où (selon l'élément)
        props.push('width' + base);
        props.push('left'  + base);
        el.style.transition = props.join(', ');
        el.style.willChange = 'width, left';
      };
      const removeTransition = (el) => { if(el){ el.style.transition = 'none'; } };
  
      document.querySelectorAll('.range-wrapper').forEach((wrapper) => {
        // éléments constitutifs
        const fillWrapper = wrapper.querySelector('.fill-wrapper');
        const fillEl = wrapper.querySelector('.input-fill') || fillWrapper;
        const dotEl  = wrapper.querySelector('.custom-dot-container');
        const inputEl = wrapper.querySelector('input.number');
  
        // Détermination de la clé d’override (id du wrapper, ou id/name de l’input)
        const key =
          (wrapper.id && wrapper.id.trim()) ||
          (inputEl && inputEl.id && inputEl.id.trim()) ||
          (inputEl && inputEl.name && inputEl.name.trim()) || '';
  
        // Lecture min/max/step (data-*, sinon defaults), puis override par ID si dispo
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
  
        // Transitions lentes (au repos / sur click)
        applySlowTransition(fillEl);
        applySlowTransition(dotEl);
  
        // rendu UI
        const setUIInstant = (value) => {
          const p = (value - min) / (max - min);
          if (fillEl) fillEl.style.width = (p*100) + '%';
          if (dotEl)  dotEl.style.left  = (p*100) + '%';
          if (inputEl) inputEl.value = String(value);
          if (mirror)  mirror.value   = String(value);
          wrapper.setAttribute('data-value', String(value));
        };
  
        const setUISlow = (value) => {
          // transitions déjà en place → simple set
          setUIInstant(value);
        };
  
        const valueFromX = (clientX) => {
          const rect = wrapper.getBoundingClientRect();
          const frac = clamp01((clientX - rect.left) / rect.width);
          const raw  = min + frac * (max - min);
          const snapped = Math.max(min, Math.min(max, roundToStep(raw, step, min)));
          // éviter d'afficher trop de décimales quand step est décimal
          const decimals = (String(step).split('.')[1] || '').length;
          return Number(snapped.toFixed(decimals));
        };
  
        let dragging = false;
  
        const onDown = (e) => {
          if (e.button !== undefined && e.button !== 0) return;
          dragging = true;
          wrapper.setPointerCapture?.(e.pointerId);
          document.body.style.userSelect = 'none';
          // Pendant le drag → pas de transition pour suivre le curseur
          removeTransition(fillEl);
          removeTransition(dotEl);
          setUIInstant(valueFromX(e.clientX));
        };
        const onMove = (e) => {
          if (!dragging) return;
          setUIInstant(valueFromX(e.clientX));
        };
        const onUp = () => {
          dragging = false;
          document.body.style.userSelect = '';
          // on réactive la transition lente pour les changements futurs
          applySlowTransition(fillEl);
          applySlowTransition(dotEl);
        };
  
        [wrapper, fillWrapper, dotEl].forEach(el => {
          if (el) el.addEventListener('pointerdown', onDown);
        });
        wrapper.addEventListener('pointermove', onMove);
        wrapper.addEventListener('pointerup', onUp);
        wrapper.addEventListener('pointercancel', onUp);
  
        // Click simple (sans drag) → animation lente
        wrapper.addEventListener('click', (e) => {
          if (!dragging && (e.button === 0 || e.button === undefined)) {
            applySlowTransition(fillEl);
            applySlowTransition(dotEl);
            setUISlow(valueFromX(e.clientX));
          }
        });
  
        // Valeur initiale
        const initial = Number((inputEl && inputEl.value) || wrapper.getAttribute('data-value')) ;
        const startVal = Number.isFinite(initial) ? Math.max(min, Math.min(max, initial)) : min;
        setUIInstant(startVal); // premier paint immédiat
  
        // Recalage au resize (sans animation, puis on remet la transition)
        window.addEventListener('resize', () => {
          removeTransition(fillEl);
          removeTransition(dotEl);
          const v = Number(wrapper.getAttribute('data-value')) || min;
          setUIInstant(v);
          // petit rafraîchissement async pour réactiver la transition
          requestAnimationFrame(() => {
            applySlowTransition(fillEl);
            applySlowTransition(dotEl);
          });
        });
      });
  
      // Si Webflow recharge dynamiquement des blocs
      const mo = new MutationObserver(() => {
        document.querySelectorAll('input.number:not([disabled])').forEach(el => {
          // s'assurer que l'input reste inerte
          el && el.tagName === 'INPUT' && hardDisable(el);
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    });
  })();