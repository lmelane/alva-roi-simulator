// =============================================
// CUSTOM SLIDER WEBFLOW (Pure JS)
// Contrôle .custom-dot-container et .input-fill
// =============================================

(function() {
  'use strict';

  const ready = (fn) => document.readyState !== 'loading' 
    ? fn() 
    : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    // Configuration par ID
    const CONFIG = {
      employees: { min: 1, max: 10000, step: 1, start: 250 },
      processes: { min: 1, max: 10, step: 1, start: 3 },
      timePerTask: { min: 0.1, max: 8, step: 0.1, start: 2 },
      hourlyCost: { min: 20, max: 150, step: 1, start: 40 },
      currentAutomation: { min: 0, max: 100, step: 1, start: 15 },
      targetAutomation: { min: 0, max: 100, step: 1, start: 60 }
    };

    document.querySelectorAll('.range-wrapper').forEach((wrapper) => {
      const fillWrapper = wrapper.querySelector('.fill-wrapper');
      const fillEl = wrapper.querySelector('.input-fill');
      const dotEl = wrapper.querySelector('.custom-dot-container');
      const inputEl = wrapper.querySelector('input.number');

      if (!fillWrapper || !inputEl) return;

      // Config
      const inputId = inputEl.id || inputEl.name || '';
      const config = CONFIG[inputId] || { min: 0, max: 100, step: 1, start: 50 };

      let isDragging = false;
      let currentValue = config.start;

      // Mettre à jour l'UI
      const updateUI = (value) => {
        currentValue = Math.max(config.min, Math.min(config.max, value));
        const percent = ((currentValue - config.min) / (config.max - config.min)) * 100;

        if (fillEl) fillEl.style.width = percent + '%';
        if (dotEl) dotEl.style.left = percent + '%';
        
        const decimals = config.step < 1 ? 1 : 0;
        inputEl.value = currentValue.toFixed(decimals);
        wrapper.setAttribute('data-value', currentValue);
      };

      // Calculer valeur depuis position X
      const getValueFromX = (clientX) => {
        const rect = fillWrapper.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = config.min + percent * (config.max - config.min);
        const steppedValue = Math.round(rawValue / config.step) * config.step;
        return Math.max(config.min, Math.min(config.max, steppedValue));
      };

      // Events
      const onPointerDown = (e) => {
        isDragging = true;
        document.body.style.userSelect = 'none';
        updateUI(getValueFromX(e.clientX));
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;
        updateUI(getValueFromX(e.clientX));
      };

      const onPointerUp = () => {
        isDragging = false;
        document.body.style.userSelect = '';
      };

      // Attacher events
      fillWrapper.addEventListener('pointerdown', onPointerDown);
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);

      // Click direct
      fillWrapper.addEventListener('click', (e) => {
        updateUI(getValueFromX(e.clientX));
      });

      // Sync input → slider
      inputEl.addEventListener('change', function() {
        updateUI(parseFloat(this.value) || config.start);
      });

      // Style
      wrapper.style.cursor = 'pointer';
      wrapper.style.position = 'relative';
      if (fillWrapper) fillWrapper.style.position = 'relative';
      if (dotEl) {
        dotEl.style.position = 'absolute';
        dotEl.style.transform = 'translateX(-50%)';
      }

      // Initialiser
      updateUI(config.start);
    });

    console.log('✅ Custom sliders Webflow initialisés');
  });
})();
