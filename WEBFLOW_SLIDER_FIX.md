# 🎯 Fix pour Sliders Webflow

## Code JavaScript Compatible avec les Sliders Webflow

Copie ce code dans **Webflow → Page Settings → Before </body> tag**

```html
<script>
// ============================================
// SIMULATEUR ROI - COMPATIBLE SLIDERS WEBFLOW
// ============================================

const API_URL = 'https://alva-roi-simulator-production.up.railway.app';
let calcTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Simulateur ROI initialisé (Sliders Webflow)');
    displayDefaultResults();
    attachWebflowListeners();
    setupSliderObservers(); // Nouveau : Observer les sliders
    setTimeout(() => calculateROI(), 500);
});

// Observer les changements des sliders Webflow
function setupSliderObservers() {
    // Trouver tous les éléments avec data-value
    const sliderElements = document.querySelectorAll('[data-value]');
    
    sliderElements.forEach(element => {
        // Observer les changements d'attribut data-value
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
                    console.log('📊 Slider changé:', element.getAttribute('data-value'));
                    clearTimeout(calcTimeout);
                    calcTimeout = setTimeout(() => calculateROI(), 300);
                }
            });
        });
        
        observer.observe(element, {
            attributes: true,
            attributeFilter: ['data-value']
        });
    });
    
    console.log('👀 Observing', sliderElements.length, 'sliders');
}

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

function attachWebflowListeners() {
    const fields = [
        'sector', 'employees', 'processes', 'timePerTask',
        'maturity', 'hourlyCost', 'currentAutomation', 'targetAutomation'
    ];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        ['change', 'input', 'blur', 'keyup'].forEach(eventType => {
            field.addEventListener(eventType, function() {
                clearTimeout(calcTimeout);
                calcTimeout = setTimeout(() => {
                    console.log('📊 Recalcul:', fieldId);
                    calculateROI();
                }, 300);
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

async function calculateROI() {
    try {
        const sector = getValue('sector') || 'general';
        const employees = parseInt(getValue('employees')) || 250;
        const processes = parseInt(getValue('processes')) || 3;
        const timePerTask = parseFloat(getValue('timePerTask')) || 2;
        const maturity = getValue('maturity') || 'medium';
        const hourlyCost = parseFloat(getValue('hourlyCost')) || null;
        const currentAutomation = parseInt(getValue('currentAutomation')) || null;
        const targetAutomation = parseInt(getValue('targetAutomation')) || null;

        if (!sector || !employees || !processes || !timePerTask) {
            console.warn('⚠️ Paramètres manquants');
            return;
        }

        console.log('📤 API:', { sector, employees, processes, timePerTask });

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
        console.error('❌ Erreur:', error);
        showError('Erreur de connexion');
    }
}

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

function animateValue(elementId, targetValue, suffix = '', prefix = '', formatNumber = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
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
    }

    requestAnimationFrame(update);
}

// Fonction getValue améliorée pour sliders Webflow
function getValue(id) {
    // 1. Essayer de trouver l'élément avec l'ID
    let el = document.getElementById(id);
    
    // 2. Si pas trouvé, chercher dans les data-name
    if (!el) {
        el = document.querySelector(`[data-name="${id}"]`);
    }
    
    if (!el) return null;
    
    // 3. Pour les selects
    if (el.tagName === 'SELECT') {
        return el.options[el.selectedIndex]?.value || el.value;
    }
    
    // 4. Chercher data-value dans l'élément ou ses enfants
    let dataValue = el.getAttribute('data-value');
    if (dataValue) return dataValue;
    
    // 5. Chercher dans les enfants
    const childWithDataValue = el.querySelector('[data-value]');
    if (childWithDataValue) {
        dataValue = childWithDataValue.getAttribute('data-value');
        if (dataValue) return dataValue;
    }
    
    // 6. Chercher dans le parent (pour les wrappers Webflow)
    const parent = el.closest('[data-value]');
    if (parent) {
        dataValue = parent.getAttribute('data-value');
        if (dataValue) return dataValue;
    }
    
    // 7. Fallback sur .value
    return el.value || el.getAttribute('value');
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
}

// Debug amélioré
window.debugSimulator = function() {
    console.log('=== DEBUG SIMULATEUR ===');
    
    // Tester chaque champ
    ['sector', 'employees', 'processes', 'timePerTask'].forEach(id => {
        const value = getValue(id);
        console.log(`${id}:`, value);
        
        // Afficher aussi l'élément trouvé
        const el = document.getElementById(id) || document.querySelector(`[data-name="${id}"]`);
        if (el) {
            console.log(`  → Element:`, el);
            console.log(`  → data-value:`, el.getAttribute('data-value'));
        }
    });
    
    // Afficher tous les éléments avec data-value
    console.log('\n=== SLIDERS WEBFLOW ===');
    document.querySelectorAll('[data-value]').forEach((el, i) => {
        console.log(`Slider ${i}:`, el.getAttribute('data-value'), el);
    });
};

console.log('💡 Tape debugSimulator() pour débugger');
</script>
```

---

## 🎯 Améliorations Clés

### **1. MutationObserver**
```javascript
observer.observe(element, {
    attributes: true,
    attributeFilter: ['data-value']
});
```
Détecte automatiquement quand Webflow change `data-value`

### **2. getValue() Ultra-Robuste**
```javascript
// Cherche dans 7 endroits différents :
1. getElementById(id)
2. querySelector([data-name="id"])
3. element.getAttribute('data-value')
4. element.querySelector('[data-value]')
5. element.closest('[data-value]')
6. element.value
7. element.getAttribute('value')
```

### **3. Debug Amélioré**
```javascript
debugSimulator()
// Affiche TOUS les sliders et leurs valeurs
```

---

## 🧪 Test

1. **Copie le nouveau code**
2. **Remplace l'ancien dans Webflow**
3. **Publie**
4. **Ouvre la console (F12)**
5. **Tape :** `debugSimulator()`

Tu verras tous les sliders et leurs valeurs !

---

**Ce code détecte automatiquement les sliders Webflow et leurs changements !** 🎯
