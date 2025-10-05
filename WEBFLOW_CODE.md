# 🎯 Code JavaScript pour Webflow - Version Compatible

## 📋 Instructions

**Copie ce code dans Webflow :**
- **Page Settings** → **Custom Code** → **Before </body> tag**

---

## 💻 Code à Copier-Coller

```html
<script>
// ============================================
// SIMULATEUR ROI - COMPATIBLE SLIDERS WEBFLOW
// ============================================

const API_URL = 'https://alva-roi-simulator-production.up.railway.app';
let calcTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Simulateur ROI initialisé (Sliders Webflow)');
    
    // Initialiser les valeurs par défaut
    initializeDefaultValues();
    
    displayDefaultResults();
    attachWebflowListeners();
    setupSliderObservers(); // Nouveau : Observer les sliders
    setTimeout(() => calculateROI(), 500);
});

// Initialiser les valeurs par défaut des inputs
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
            // Pour les inputs normaux
            if (element.tagName === 'INPUT') {
                element.value = defaults[id];
                console.log(`✅ Valeur par défaut ${id}:`, defaults[id]);
            }
            
            // Pour les sliders Webflow avec data-value
            const dataValueElement = element.querySelector('[data-value]') || 
                                    element.closest('[data-value]');
            if (dataValueElement && !dataValueElement.getAttribute('data-value')) {
                dataValueElement.setAttribute('data-value', defaults[id]);
                console.log(`✅ data-value par défaut ${id}:`, defaults[id]);
            }
        }
    });
}

// Observer les changements des sliders Webflow avec polling
let lastSliderValues = {};

function setupSliderObservers() {
    console.log('👀 Démarrage du polling des sliders');
    
    // Polling toutes les 100ms pour détecter les changements
    setInterval(() => {
        const sliderElements = document.querySelectorAll('[data-value]');
        
        sliderElements.forEach((element, index) => {
            const currentValue = element.getAttribute('data-value');
            const key = `slider_${index}`;
            
            // Si la valeur a changé
            if (lastSliderValues[key] !== currentValue) {
                console.log(`📊 Slider ${index} changé: ${lastSliderValues[key]} → ${currentValue}`);
                lastSliderValues[key] = currentValue;
                
                // Déclencher le recalcul
                clearTimeout(calcTimeout);
                calcTimeout = setTimeout(() => {
                    console.log('📊 Recalcul déclenché par slider');
                    calculateROI();
                }, 300);
            }
        });
    }, 100); // Vérifier toutes les 100ms
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
                    }, 300);
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
        
        // Ne pas bloquer les futurs appels
        return;
    }
}

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

function animateValue(elementId, targetValue, suffix = '', prefix = '', formatNumber = false) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`⚠️ Element ${elementId} non trouvé pour animation`);
            return;
        }

        const duration = 1000;
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
