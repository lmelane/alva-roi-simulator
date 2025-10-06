// ============================================
// SIMULATEUR ROI - COMPATIBLE SLIDERS WEBFLOW
// Version CDN pour Webflow
// ============================================

(function() {
    'use strict';

    const API_URL = 'https://alva-roi-simulator-production.up.railway.app';
    let calcTimeout = null;
    let lastSliderValues = {};

    // Initialisation au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🚀 Simulateur ROI initialisé (CDN)');
        initializeDefaultValues();
        displayDefaultResults();
        attachWebflowListeners();
        setupSliderObservers();
        setTimeout(() => calculateROI(), 500);
    }

    // Initialiser les valeurs par défaut
    function initializeDefaultValues() {
        const defaults = {
            employees: 250,
            processes: 3,
            timePerTask: 2,
            hourlyCost: 40,
            currentAutomation: 15,
            targetAutomation: 60
        };
        
        Object.keys(defaults).forEach(id => {
            const element = document.getElementById(id);
            if (element && !element.value) {
                if (element.tagName === 'INPUT') {
                    element.value = defaults[id];
                    console.log(`✅ Valeur par défaut ${id}:`, defaults[id]);
                }
                
                const dataValueElement = element.querySelector('[data-value]') || 
                                        element.closest('[data-value]');
                if (dataValueElement && !dataValueElement.getAttribute('data-value')) {
                    dataValueElement.setAttribute('data-value', defaults[id]);
                    console.log(`✅ data-value par défaut ${id}:`, defaults[id]);
                }
            }
        });
    }

    // Observer les sliders avec polling
    function setupSliderObservers() {
        console.log('👀 Démarrage du polling des sliders');
        
        setInterval(() => {
            const sliderElements = document.querySelectorAll('[data-value]');
            
            sliderElements.forEach((element, index) => {
                const currentValue = element.getAttribute('data-value');
                const key = `slider_${index}`;
                
                if (lastSliderValues[key] !== currentValue) {
                    console.log(`📊 Slider ${index} changé: ${lastSliderValues[key]} → ${currentValue}`);
                    lastSliderValues[key] = currentValue;
                    
                    clearTimeout(calcTimeout);
                    calcTimeout = setTimeout(() => {
                        console.log('📊 Recalcul déclenché par slider');
                        calculateROI();
                    }, 50);
                }
            });
        }, 100);
    }

    // Afficher résultats par défaut
    function displayDefaultResults() {
        const defaults = {
            roiPercentage: -16,
            yearlySavings: 26168,
            paybackWeeks: 30,
            timeSaved: 24,
            errorReduction: 85,
            productivityGain: 32
        };
        
        updateDisplay('result-roi', (defaults.roiPercentage >= 0 ? '+' : '') + defaults.roiPercentage + '%');
        updateDisplay('result-savings', defaults.yearlySavings.toLocaleString('fr-FR') + ' €');
        updateDisplay('result-payback', defaults.paybackWeeks + ' sem');
        updateDisplay('result-time', defaults.timeSaved + 'h');
        updateDisplay('result-errors', '-' + defaults.errorReduction + '%');
        updateDisplay('result-productivity', '+' + defaults.productivityGain + '%');
        showResults();
    }

    // Attacher les listeners
    function attachWebflowListeners() {
        const fields = [
            'sector', 'employees', 'processes', 'timePerTask',
            'maturity', 'hourlyCost', 'currentAutomation', 'targetAutomation'
        ];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) {
                console.warn(`⚠️ Champ ${fieldId} non trouvé`);
                return;
            }

            console.log(`✅ Listener attaché sur: ${fieldId}`);

            ['change', 'input', 'blur', 'keyup'].forEach(eventType => {
                field.addEventListener(eventType, function() {
                    try {
                        console.log(`🎯 Event ${eventType} sur ${fieldId}, valeur:`, this.value || this.getAttribute('data-value'));
                        clearTimeout(calcTimeout);
                        calcTimeout = setTimeout(() => {
                            console.log('📊 Recalcul déclenché par:', fieldId);
                            calculateROI();
                        }, 50);
                    } catch (error) {
                        console.error(`❌ Erreur event listener ${fieldId}:`, error);
                    }
                });
            });
        });

        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                calculateROI();
                return false;
            });
        });
    }

    // Calcul ROI
    async function calculateROI() {
        console.log('🔄 calculateROI() appelé');
        
        try {
            const sector = getValue('sector') || 'general';
            const employees = parseInt(getValue('employees')) || 250;
            const processes = parseInt(getValue('processes')) || 3;
            const timePerTask = parseFloat(getValue('timePerTask')) || 2;
            const maturity = getValue('maturity') || 'medium';
            const hourlyCost = parseFloat(getValue('hourlyCost')) || null;
            const currentAutomation = parseInt(getValue('currentAutomation')) || null;
            const targetAutomation = parseInt(getValue('targetAutomation')) || null;

            console.log('📊 Valeurs récupérées:', { sector, employees, processes, timePerTask });

            if (!sector || !employees || !processes || !timePerTask) {
                console.warn('⚠️ Paramètres manquants:', { sector, employees, processes, timePerTask });
                return;
            }

            console.log('📤 Envoi API:', { sector, employees, processes, timePerTask });

            const requestData = {
                sector, employees, processes, timePerTask, maturity
            };

            if (hourlyCost) requestData.hourlyCost = hourlyCost;
            if (currentAutomation !== null) requestData.currentAutomation = currentAutomation;
            if (targetAutomation !== null) requestData.targetAutomation = targetAutomation;

            const response = await fetch(`${API_URL}/api/simulator/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.success) {
                console.log('✅ Résultats:', data.data.results);
                displayResults(data.data.results);
            } else {
                showError('Erreur de calcul');
            }

        } catch (error) {
            console.error('❌ Erreur complète:', error);
            console.error('❌ Stack:', error.stack);
            showError('Erreur de connexion');
            return;
        }
    }

    // Afficher résultats
    function displayResults(results) {
        try {
            console.log('📊 displayResults appelé avec:', results);
            hideError();
            showResults();
            animateValue('result-roi', results.roiPercentage, '%', results.roiPercentage >= 0 ? '+' : '');
            animateValue('result-savings', results.yearlySavings, ' €', '', true);
            animateValue('result-payback', results.paybackWeeks, ' sem');
            animateValue('result-time', results.timeSaved, 'h');
            animateValue('result-errors', results.errorReduction, '%', '-');
            animateValue('result-productivity', results.productivityGain, '%', '+');
            console.log('✅ displayResults terminé');
        } catch (error) {
            console.error('❌ Erreur dans displayResults:', error);
            console.error('❌ Stack:', error.stack);
        }
    }

    // Animation
    function animateValue(elementId, targetValue, suffix = '', prefix = '', formatNumber = false) {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`⚠️ Element ${elementId} non trouvé pour animation`);
                return;
            }

            const duration = 400;
            const startTime = performance.now();

            function update(currentTime) {
                try {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuad = progress * (2 - progress);
                    const currentValue = Math.round(targetValue * easeOutQuad);
                    
                    const displayValue = formatNumber 
                        ? currentValue.toLocaleString('fr-FR') 
                        : currentValue;
                    
                    element.textContent = prefix + displayValue + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                } catch (error) {
                    console.error(`❌ Erreur animation ${elementId}:`, error);
                }
            }

            requestAnimationFrame(update);
        } catch (error) {
            console.error(`❌ Erreur animateValue ${elementId}:`, error);
        }
    }

    // getValue amélioré
    function getValue(id) {
        let el = document.getElementById(id);
        
        if (!el) {
            el = document.querySelector(`[data-name="${id}"]`);
        }
        
        if (!el) return null;
        
        if (el.tagName === 'SELECT') {
            return el.options[el.selectedIndex]?.value || el.value;
        }
        
        let dataValue = el.getAttribute('data-value');
        if (dataValue) return dataValue;
        
        const childWithDataValue = el.querySelector('[data-value]');
        if (childWithDataValue) {
            dataValue = childWithDataValue.getAttribute('data-value');
            if (dataValue) return dataValue;
        }
        
        const parent = el.closest('[data-value]');
        if (parent) {
            dataValue = parent.getAttribute('data-value');
            if (dataValue) return dataValue;
        }
        
        return el.value || el.getAttribute('value');
    }

    // Utilitaires
    function updateDisplay(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function showResults() {
        const section = document.getElementById('results-section');
        if (section) {
            section.style.display = 'block';
            section.style.opacity = '1';
        }
    }

    function hideError() {
        const error = document.getElementById('error');
        if (error) error.style.display = 'none';
    }

    function showError(message) {
        const error = document.getElementById('error');
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }

    // Debug
    window.debugSimulator = function() {
        console.log('=== DEBUG SIMULATEUR ===');
        
        ['sector', 'employees', 'processes', 'timePerTask'].forEach(id => {
            const value = getValue(id);
            console.log(`${id}:`, value);
            
            const el = document.getElementById(id) || document.querySelector(`[data-name="${id}"]`);
            if (el) {
                console.log(`  → Element:`, el);
                console.log(`  → data-value:`, el.getAttribute('data-value'));
            }
        });
        
        console.log('\n=== SLIDERS WEBFLOW ===');
        document.querySelectorAll('[data-value]').forEach((el, i) => {
            console.log(`Slider ${i}:`, el.getAttribute('data-value'), el);
        });
    };

    console.log('💡 Tape debugSimulator() pour débugger');

})();
