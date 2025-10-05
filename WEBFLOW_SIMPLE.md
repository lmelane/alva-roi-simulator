# 🎨 Intégration Webflow - Guide Simple

Guide ultra-simple pour intégrer le simulateur ROI dans Webflow.

---

## 📋 Étape 1 : Créer les Champs dans Webflow

### **IDs à Utiliser**

Dans Webflow, crée ces éléments avec les IDs suivants :

| Élément | Type | ID | Valeurs |
|---------|------|----|---------| 
| Secteur | Select | `sector` | Voir options ci-dessous |
| Employés | Input Number | `employees` | Min: 1, Max: 1000 |
| Processus | Input Number | `processes` | Min: 1, Max: 10 |
| Temps/processus | Input Number | `timePerTask` | Min: 0.5, Max: 8 |
| Maturité | Select | `maturity` | low/medium/high |
| Coût horaire | Input Number | `hourlyCost` | Min: 20, Max: 150 |
| Auto actuelle | Input Number | `currentAutomation` | Min: 0, Max: 100 |
| Auto cible | Input Number | `targetAutomation` | Min: 0, Max: 100 |

### **Options du Select "Secteur"**

```
Value: general | Label: Multi-fonctions / Général
Value: finance | Label: Finance & Comptabilité
Value: hr | Label: Ressources Humaines
Value: operations | Label: Opérations & Logistique
Value: sales | Label: Commercial & Ventes
Value: support | Label: Support Client & Service
Value: marketing | Label: Marketing & Communication
Value: it | Label: IT & Développement
Value: legal | Label: Juridique & Compliance
```

### **Options du Select "Maturité"**

```
Value: low | Label: Faible (peu d'outils digitaux)
Value: medium | Label: Moyenne (outils standards)
Value: high | Label: Élevée (organisation data-driven)
```

---

## 📊 Étape 2 : Créer les Zones de Résultats

### **IDs pour les Résultats**

Crée ces éléments Text pour afficher les résultats :

| Résultat | ID | Format |
|----------|----|---------| 
| ROI | `result-roi` | Exemple: +128% |
| Économies annuelles | `result-savings` | Exemple: 59 321 € |
| Temps de retour | `result-payback` | Exemple: 18 sem |
| Temps gagné/mois | `result-time` | Exemple: 99h |
| Réduction erreurs | `result-errors` | Exemple: -80% |
| Gain productivité | `result-productivity` | Exemple: +42% |

### **Zones Spéciales**

| Zone | ID | Usage |
|------|----|---------| 
| Section résultats | `results-section` | Container des résultats |
| Loading | `loading` | Message "Calcul en cours..." |
| Erreur | `error` | Message d'erreur |

---

## 💻 Étape 3 : Copier le Code JavaScript

### **Dans Webflow : Page Settings → Custom Code → Before </body> tag**

Copie-colle ce code :

```javascript
<script>
// Configuration API
const API_URL = 'https://alva-roi-simulator-production.up.railway.app';
let calcTimeout = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Afficher des résultats par défaut immédiatement
    displayDefaultResults();
    
    attachEventListeners();
    calculateROI(); // Calcul avec l'API
});

// Afficher des résultats par défaut
function displayDefaultResults() {
    const defaultResults = {
        roiPercentage: -16,
        yearlySavings: 26168,
        paybackWeeks: 30,
        timeSaved: 24,
        errorReduction: 85,
        productivityGain: 32
    };
    
    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    setValue('result-roi', (defaultResults.roiPercentage >= 0 ? '+' : '') + defaultResults.roiPercentage + '%');
    setValue('result-savings', defaultResults.yearlySavings.toLocaleString('fr-FR') + ' €');
    setValue('result-payback', defaultResults.paybackWeeks + ' sem');
    setValue('result-time', defaultResults.timeSaved + 'h');
    setValue('result-errors', '-' + defaultResults.errorReduction + '%');
    setValue('result-productivity', '+' + defaultResults.productivityGain + '%');
    
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.style.display = 'block';
}

// Attacher les event listeners
function attachEventListeners() {
    const fields = [
        'sector', 'employees', 'processes', 'timePerTask',
        'maturity', 'hourlyCost', 'currentAutomation', 'targetAutomation'
    ];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const eventType = field.tagName === 'SELECT' ? 'change' : 'input';
            
            field.addEventListener(eventType, function() {
                clearTimeout(calcTimeout);
                calcTimeout = setTimeout(() => {
                    calculateROI();
                }, 500);
            });
        }
    });
}

// Fonction principale de calcul
async function calculateROI() {
    // Récupérer les valeurs
    const sector = document.getElementById('sector')?.value;
    const employees = parseInt(document.getElementById('employees')?.value);
    const processes = parseInt(document.getElementById('processes')?.value);
    const timePerTask = parseFloat(document.getElementById('timePerTask')?.value);
    
    // Paramètres optionnels
    const maturity = document.getElementById('maturity')?.value || 'medium';
    const hourlyCost = parseFloat(document.getElementById('hourlyCost')?.value) || null;
    const currentAutomation = parseInt(document.getElementById('currentAutomation')?.value) || null;
    const targetAutomation = parseInt(document.getElementById('targetAutomation')?.value) || null;

    // Validation
    if (!sector || !employees || !processes || !timePerTask) {
        return;
    }

    // Afficher le loading
    showLoading();

    try {
        // Préparer les données
        const requestData = {
            sector,
            employees,
            processes,
            timePerTask,
            maturity
        };

        // Ajouter les paramètres optionnels s'ils existent
        if (hourlyCost) requestData.hourlyCost = hourlyCost;
        if (currentAutomation !== null) requestData.currentAutomation = currentAutomation;
        if (targetAutomation !== null) requestData.targetAutomation = targetAutomation;

        const response = await fetch(`${API_URL}/api/simulator/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.data.results);
        } else {
            showError('Erreur lors du calcul');
        }

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion à l\'API');
    } finally {
        hideLoading();
    }
}

// Afficher les résultats
function displayResults(results) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) errorDiv.style.display = 'none';

    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.style.display = 'block';

    // Animer les valeurs
    animateValue('result-roi', results.roiPercentage, '%', results.roiPercentage >= 0 ? '+' : '');
    animateValue('result-savings', results.yearlySavings, ' €', '', true);
    animateValue('result-payback', results.paybackWeeks, ' sem');
    animateValue('result-time', results.timeSaved, 'h');
    animateValue('result-errors', results.errorReduction, '%', '-');
    animateValue('result-productivity', results.productivityGain, '%', '+');
}

// Animation des chiffres
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

// Gestion du loading
function showLoading() {
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const error = document.getElementById('error');
    
    if (loading) loading.style.display = 'block';
    if (resultsSection) resultsSection.style.display = 'none';
    if (error) error.style.display = 'none';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const resultsSection = document.getElementById('results-section');
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    if (resultsSection) resultsSection.style.display = 'none';
}
</script>
```

---

## 🎨 Étape 4 : CSS Optionnel

### **Dans Webflow : Page Settings → Custom Code → Head Code**

```html
<style>
/* Loading spinner */
#loading {
    text-align: center;
    padding: 2rem;
}

#loading::before {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0066FF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Erreur */
#error {
    background: #fee;
    color: #c00;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
}

/* Résultats */
#results-section {
    margin-top: 2rem;
}
</style>
```

---

## ✅ Checklist

- [ ] Créer les 8 champs avec les bons IDs
- [ ] Créer les 6 zones de résultats avec les bons IDs
- [ ] Créer les zones loading, error, results-section
- [ ] Copier le JavaScript dans Custom Code
- [ ] (Optionnel) Copier le CSS
- [ ] Publier et tester

---

## 🧪 Test Rapide

1. Ouvre la console (F12)
2. Tape : `calculateROI()`
3. Vérifie que les résultats s'affichent

---

## 🎯 Résumé des IDs

### **Inputs (8)**
```
sector
employees
processes
timePerTask
maturity
hourlyCost
currentAutomation
targetAutomation
```

### **Outputs (6)**
```
result-roi
result-savings
result-payback
result-time
result-errors
result-productivity
```

### **Zones (3)**
```
results-section
loading
error
```

---

## 📞 Support

**API URL :** `https://alva-roi-simulator-production.up.railway.app`

**Test API :**
```javascript
fetch('https://alva-roi-simulator-production.up.railway.app/health')
  .then(r => r.json())
  .then(d => console.log(d));
```

---

**Version :** 1.0  
**Dernière mise à jour :** 5 octobre 2025
