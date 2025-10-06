// =============================================
// CUSTOM SLIDER avec noUiSlider
// Dépendances : noUiSlider + wNumb doivent être chargés avant
// =============================================

(function initSlider(){
  const ready = (fn) => window.Webflow ? window.Webflow.push(fn)
    : (document.readyState !== 'loading' ? fn()
      : document.addEventListener('DOMContentLoaded', fn));

  ready(() => {
    // Vérifier que noUiSlider est chargé
    if (typeof noUiSlider === 'undefined') {
      console.error('noUiSlider not loaded! Please include noUiSlider before this script.');
      return;
    }

    const DEFAULT_MIN = 0, DEFAULT_MAX = 400, DEFAULT_STEP = 1;

    // Configuration par ID
    const SLIDER_CONFIG = {
      employees: {
        min: 1,
        max: 10000,
        step: 1,
        start: 250,
        format: wNumb({ decimals: 0 })
      },
      processes: {
        min: 1,
        max: 10,
        step: 1,
        start: 3,
        format: wNumb({ decimals: 0 })
      },
      timePerTask: {
        min: 0.1,
        max: 8,
        step: 0.1,
        start: 2,
        format: wNumb({ decimals: 1 })
      },
      hourlyCost: {
        min: 20,
        max: 150,
        step: 1,
        start: 40,
        format: wNumb({ decimals: 0 })
      },
      currentAutomation: {
        min: 0,
        max: 100,
        step: 1,
        start: 15,
        format: wNumb({ decimals: 0 })
      },
      targetAutomation: {
        min: 0,
        max: 100,
        step: 1,
        start: 60,
        format: wNumb({ decimals: 0 })
      }
    };

    // Initialiser tous les sliders
    document.querySelectorAll('.range-wrapper').forEach((wrapper) => {
      const sliderEl = wrapper.querySelector('.slider-element');
      const inputEl = wrapper.querySelector('input.number');
      
      if (!sliderEl || !inputEl) return;

      // Déterminer la config
      const sliderId = inputEl.id || inputEl.name || '';
      const config = SLIDER_CONFIG[sliderId] || {
        min: DEFAULT_MIN,
        max: DEFAULT_MAX,
        step: DEFAULT_STEP,
        start: DEFAULT_MIN,
        format: wNumb({ decimals: 0 })
      };

      // Créer le slider noUiSlider
      try {
        noUiSlider.create(sliderEl, {
          start: config.start,
          connect: [true, false],
          range: {
            min: config.min,
            max: config.max
          },
          step: config.step,
          format: config.format,
          animate: true,
          animationDuration: 600
        });

        // Sync slider → input
        sliderEl.noUiSlider.on('update', function(values, handle) {
          inputEl.value = values[handle];
          wrapper.setAttribute('data-value', values[handle]);
        });

        // Sync input → slider (si l'input change)
        inputEl.addEventListener('change', function() {
          sliderEl.noUiSlider.set(this.value);
        });

        console.log(`✅ Slider initialisé: ${sliderId}`);

      } catch (error) {
        console.error(`❌ Erreur slider ${sliderId}:`, error);
      }
    });

    console.log('✅ Custom sliders initialisés avec noUiSlider');
  });
})();
