# 🎯 Code JavaScript pour Webflow - Version Compatible

## 📋 Instructions

**Copie ce code dans Webflow :**
- **Page Settings** → **Custom Code** → **Before </body> tag**

---

## 💻 Code à Copier-Coller

```html
<script>
// ============================================
// SIMULATEUR ROI - WEBFLOW COMPATIBLE
// ============================================

const API_URL = 'https://alva-roi-simulator-production.up.railway.app';
let calcTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Simulateur ROI initialisé');
    displayDefaultResults();
    attachWebflowListeners();
    setTimeout(() => calculateROI(), 500);
});

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

function getValue(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    
    if (el.tagName === 'SELECT') {
        return el.options[el.selectedIndex]?.value || el.value;
    }
    
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
}

// Debug
window.debugSimulator = function() {
    console.log('=== DEBUG ===');
    console.log('sector:', getValue('sector'));
    console.log('employees:', getValue('employees'));
    console.log('processes:', getValue('processes'));
    console.log('timePerTask:', getValue('timePerTask'));
};

console.log('💡 Tape debugSimulator() pour débugger');
</script>
```

---

## ✨ Améliorations Webflow

### **1. Multiple Event Listeners**
```javascript
['change', 'input', 'blur', 'keyup'].forEach(eventType => {
    field.addEventListener(eventType, ...);
});
```
Écoute **4 types d'événements** pour compatibilité maximale

### **2. getValue() Amélioré**
```javascript
return el.value || el.getAttribute('value') || el.getAttribute('data-value');
```
Récupère la valeur même si l'input est `disabled` ou utilise `data-value`

### **3. Form Submit Blocker**
```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();
    return false;
});
```
Empêche Webflow de soumettre le formulaire

### **4. Debounce Réduit**
```javascript
setTimeout(() => calculateROI(), 300); // 300ms au lieu de 500ms
```
Plus réactif pour Webflow

---

## 🧪 Test

**Après avoir copié le code, ouvre la console (F12) et tape :**

```javascript
debugSimulator()
```

Tu verras toutes les valeurs des champs.

---

## 🎯 Checklist

- [ ] Copier le code dans **Before </body> tag**
- [ ] Publier le site Webflow
- [ ] Ouvrir la console (F12)
- [ ] Vérifier "🚀 Simulateur ROI initialisé"
- [ ] Changer un champ
- [ ] Vérifier "📊 Recalcul: [nom du champ]"
- [ ] Voir les résultats se mettre à jour

---

## 🔧 Debug

Si ça ne marche pas :

1. **Console (F12)**
2. Tape : `debugSimulator()`
3. Vérifie les valeurs affichées
4. Envoie-moi le résultat

---

**Ce code est 100% compatible Webflow !** 🎯
