// ============================================
// SIMULATEUR ROI - CODE WEBFLOW COMPATIBLE
// ============================================

const API_URL = 'https://alva-roi-simulator-production.up.railway.app';
let calcTimeout = null;

// Initialisation Webflow-compatible
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Simulateur ROI initialisé');
    
    // Afficher résultats par défaut
    displayDefaultResults();
    
    // Attacher les listeners Webflow-compatible
    attachWebflowListeners();
    
    // Calcul initial
    setTimeout(() => calculateROI(), 500);
});

// Résultats par défaut
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

// Attacher les listeners compatible Webflow
function attachWebflowListeners() {
    const fields = [
        'sector', 'employees', 'processes', 'timePerTask',
        'maturity', 'hourlyCost', 'currentAutomation', 'targetAutomation'
    ];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Multiple event types pour compatibilité Webflow
        const events = ['change', 'input', 'blur', 'keyup'];
        
        events.forEach(eventType => {
            field.addEventListener(eventType, function() {
                clearTimeout(calcTimeout);
                calcTimeout = setTimeout(() => {
                    console.log('📊 Recalcul déclenché par:', fieldId);
                    calculateROI();
                }, 300);
            });
        });
    });

    // Listener spécial pour les formulaires Webflow
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateROI();
            return false;
        });
    });
}

// Fonction de calcul principale
async function calculateROI() {
    try {
        // Récupérer les valeurs (avec fallbacks)
        const sector = getValue('sector') || 'general';
        const employees = parseInt(getValue('employees')) || 250;
        const processes = parseInt(getValue('processes')) || 3;
        const timePerTask = parseFloat(getValue('timePerTask')) || 2;
        
        // Paramètres optionnels
        const maturity = getValue('maturity') || 'medium';
        const hourlyCost = parseFloat(getValue('hourlyCost')) || null;
        const currentAutomation = parseInt(getValue('currentAutomation')) || null;
        const targetAutomation = parseInt(getValue('targetAutomation')) || null;

        // Validation
        if (!sector || !employees || !processes || !timePerTask) {
            console.warn('⚠️ Paramètres manquants');
            return;
        }

        console.log('📤 Envoi à l\'API:', { sector, employees, processes, timePerTask });

        // Préparer les données
        const requestData = {
            sector,
            employees,
            processes,
            timePerTask,
            maturity
        };

        if (hourlyCost) requestData.hourlyCost = hourlyCost;
        if (currentAutomation !== null) requestData.currentAutomation = currentAutomation;
        if (targetAutomation !== null) requestData.targetAutomation = targetAutomation;

        // Appel API
        const response = await fetch(`${API_URL}/api/simulator/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Résultats reçus:', data.data.results);
            displayResults(data.data.results);
        } else {
            console.error('❌ Erreur API:', data);
            showError('Erreur de calcul');
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
        showError('Erreur de connexion');
    }
}

// Afficher les résultats avec animation
function displayResults(results) {
    hideError();
    showResults();

    animateValue('result-roi', results.roiPercentage, '%', results.roiPercentage >= 0 ? '+' : '');
    animateValue('result-savings', results.yearlySavings, ' €', '', true);
    animateValue('result-payback', results.paybackWeeks, ' sem');
    animateValue('result-time', results.timeSaved, 'h');
    animateValue('result-errors', results.errorReduction, '%', '-');
    animateValue('result-productivity', results.productivityGain, '%', '+');
}

// Animation des valeurs
function animateValue(elementId, targetValue, suffix = '', prefix = '', formatNumber = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const startValue = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = progress * (2 - progress);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuad);
        
        const displayValue = formatNumber 
            ? currentValue.toLocaleString('fr-FR') 
            : currentValue;
        
        element.textContent = prefix + displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Utilitaires
function getValue(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    
    // Pour les selects et inputs Webflow
    if (el.tagName === 'SELECT') {
        return el.options[el.selectedIndex]?.value || el.value;
    }
    
    // Pour les inputs (même disabled)
    return el.value || el.getAttribute('value') || el.getAttribute('data-value');
}

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
    console.error('❌', message);
}

// Debug helper
window.debugSimulator = function() {
    console.log('=== DEBUG SIMULATEUR ===');
    console.log('sector:', getValue('sector'));
    console.log('employees:', getValue('employees'));
    console.log('processes:', getValue('processes'));
    console.log('timePerTask:', getValue('timePerTask'));
    console.log('result-roi:', document.getElementById('result-roi'));
    console.log('results-section:', document.getElementById('results-section'));
};

console.log('💡 Tape debugSimulator() dans la console pour débugger');
