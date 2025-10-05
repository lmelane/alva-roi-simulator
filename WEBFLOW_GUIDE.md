# 🎨 Guide d'Intégration Webflow

Guide complet pour intégrer l'API du simulateur ROI dans Webflow.

---

## 🚀 Prérequis

1. ✅ API déployée sur Railway
2. ✅ URL de l'API (ex: `https://alva-roi-simulator-production.up.railway.app`)
3. ✅ Projet Webflow créé

---

## 📋 Étape 1 : Créer le Formulaire dans Webflow

### **Champs Obligatoires**

1. **Secteur d'activité** (Select/Dropdown)
   - ID : `sector`
   - Options :
     ```
     general - Multi-fonctions / Général
     finance - Finance & Comptabilité
     hr - Ressources Humaines
     operations - Opérations & Logistique
     sales - Commercial & Ventes
     support - Support Client & Service
     marketing - Marketing & Communication
     it - IT & Développement
     legal - Juridique & Compliance
     ```

2. **Nombre d'employés** (Input Number ou Slider)
   - ID : `employees`
   - Min : 1
   - Max : 10000

3. **Processus à automatiser** (Input Number ou Slider)
   - ID : `processes`
   - Min : 1
   - Max : 50

4. **Temps moyen par processus** (Input Number)
   - ID : `timePerTask`
   - Min : 0.1
   - Max : 24
   - Placeholder : "En heures par jour"

### **Champs Optionnels (Mode Expert)**

5. **Coût horaire** (Input Number)
   - ID : `hourlyCost`
   - Min : 20
   - Max : 500

6. **Automatisation actuelle** (Input Number)
   - ID : `currentAutomation`
   - Min : 0
   - Max : 100

7. **Objectif d'automatisation** (Input Number)
   - ID : `targetAutomation`
   - Min : 0
   - Max : 100

8. **Maturité digitale** (Select)
   - ID : `maturity`
   - Options : `low`, `medium`, `high`

### **⚡ Calcul Automatique**
**Pas besoin de bouton !** Le calcul se fait automatiquement à chaque changement de paramètre.

Le code JavaScript écoute tous les champs et recalcule le ROI en temps réel (avec un délai de 500ms pour éviter trop d'appels API).

---

## 📊 Étape 2 : Créer la Zone de Résultats

### **Éléments à Ajouter**

```html
<!-- Zone de résultats (masquée par défaut) -->
<div id="results-section" style="display: none;">
  
  <!-- ROI Principal -->
  <div class="result-card">
    <h3>ROI</h3>
    <p id="result-roi" class="result-value">0%</p>
  </div>

  <!-- Économies Annuelles -->
  <div class="result-card">
    <h3>Économies Annuelles</h3>
    <p id="result-savings" class="result-value">0 €</p>
  </div>

  <!-- Temps de Retour -->
  <div class="result-card">
    <h3>Retour sur Investissement</h3>
    <p id="result-payback" class="result-value">0 semaines</p>
  </div>

  <!-- Temps Gagné -->
  <div class="result-card">
    <h3>Temps Gagné par Mois</h3>
    <p id="result-time" class="result-value">0 heures</p>
  </div>

  <!-- Réduction d'Erreurs -->
  <div class="result-card">
    <h3>Réduction d'Erreurs</h3>
    <p id="result-errors" class="result-value">0%</p>
  </div>

  <!-- Gain de Productivité -->
  <div class="result-card">
    <h3>Gain de Productivité</h3>
    <p id="result-productivity" class="result-value">0%</p>
  </div>

</div>

<!-- Zone de chargement -->
<div id="loading" style="display: none;">
  <p>Calcul en cours...</p>
</div>

<!-- Zone d'erreur -->
<div id="error" style="display: none;">
  <p>Une erreur est survenue. Veuillez réessayer.</p>
</div>
```

---

## 💻 Étape 3 : Ajouter le JavaScript

### **Dans Webflow : Page Settings → Custom Code → Before </body> tag**

```javascript
<script>
// ============================================
// CONFIGURATION
// ============================================
const API_URL = 'https://alva-roi-simulator-production.up.railway.app';

// ============================================
// FONCTION PRINCIPALE
// ============================================
async function calculateROI() {
  // Récupérer les valeurs du formulaire
  const sector = document.getElementById('sector').value;
  const employees = parseInt(document.getElementById('employees').value);
  const processes = parseInt(document.getElementById('processes').value);
  const timePerTask = parseFloat(document.getElementById('timePerTask').value);

  // Validation basique
  if (!sector || !employees || !processes || !timePerTask) {
    showError('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Préparer les données
  const requestData = {
    sector,
    employees,
    processes,
    timePerTask
  };

  // Ajouter les champs optionnels s'ils existent
  const hourlyCost = document.getElementById('hourlyCost');
  const currentAutomation = document.getElementById('currentAutomation');
  const targetAutomation = document.getElementById('targetAutomation');
  const maturity = document.getElementById('maturity');

  if (hourlyCost && hourlyCost.value) {
    requestData.hourlyCost = parseFloat(hourlyCost.value);
  }
  if (currentAutomation && currentAutomation.value) {
    requestData.currentAutomation = parseInt(currentAutomation.value);
  }
  if (targetAutomation && targetAutomation.value) {
    requestData.targetAutomation = parseInt(targetAutomation.value);
  }
  if (maturity && maturity.value) {
    requestData.maturity = maturity.value;
  }

  // Afficher le loader
  showLoading();

  try {
    // Appel API
    const response = await fetch(`${API_URL}/api/simulator/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    if (data.success) {
      // Afficher les résultats
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

// ============================================
// AFFICHAGE DES RÉSULTATS
// ============================================
function displayResults(results) {
  // Masquer erreur
  document.getElementById('error').style.display = 'none';

  // Afficher la section résultats
  document.getElementById('results-section').style.display = 'block';

  // Remplir les valeurs avec animation
  animateValue('result-roi', results.roiPercentage, '%', results.roiPercentage >= 0 ? '+' : '');
  animateValue('result-savings', results.yearlySavings, ' €', '', true);
  animateValue('result-payback', results.paybackWeeks, ' semaines');
  animateValue('result-time', results.timeSaved, ' heures');
  animateValue('result-errors', results.errorReduction, '%', '-');
  animateValue('result-productivity', results.productivityGain, '%', '+');

  // Scroll vers les résultats
  document.getElementById('results-section').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'nearest' 
  });
}

// ============================================
// ANIMATION DES CHIFFRES
// ============================================
function animateValue(elementId, targetValue, suffix = '', prefix = '', formatNumber = false) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const duration = 1000;
  const startValue = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
    
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

// ============================================
// GESTION LOADING & ERREURS
// ============================================
function showLoading() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  document.getElementById('results-section').style.display = 'none';
}

// ============================================
// EVENT LISTENERS - CALCUL AUTOMATIQUE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Liste des champs à surveiller
  const fields = [
    'sector',
    'employees', 
    'processes', 
    'timePerTask',
    'hourlyCost',
    'currentAutomation',
    'targetAutomation',
    'maturity'
  ];

  // Ajouter un listener sur chaque champ
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Pour les selects : 'change'
      // Pour les inputs : 'input' (temps réel)
      const eventType = field.tagName === 'SELECT' ? 'change' : 'input';
      
      field.addEventListener(eventType, function() {
        // Debounce pour éviter trop d'appels API
        clearTimeout(window.calcTimeout);
        window.calcTimeout = setTimeout(() => {
          calculateROI();
        }, 500); // Attendre 500ms après la dernière modification
      });
    }
  });

  // Calcul initial au chargement
  calculateROI();
});
</script>
```

### **⚡ Comment ça Fonctionne**

1. **Détection automatique** : Chaque champ (select, input, slider) est surveillé
2. **Debouncing** : Attente de 500ms après la dernière modification avant de calculer
3. **Temps réel** : Les résultats se mettent à jour automatiquement
4. **Pas de bouton** : L'utilisateur voit les résultats instantanément

**Exemple :** Si l'utilisateur change le nombre d'employés de 100 → 250, le ROI se recalcule automatiquement 500ms après qu'il ait arrêté de bouger le slider.

---

## 🎨 Étape 4 : Ajouter le CSS (Optionnel)

### **Dans Webflow : Page Settings → Custom Code → Head Code**

```html
<style>
/* Zone de résultats */
#results-section {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
}

.result-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.result-card h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.result-value {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: 'SF Mono', monospace;
  margin: 0;
}

/* Loading */
#loading {
  text-align: center;
  padding: 2rem;
}

/* Erreur */
#error {
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

/* Bouton */
#calculate-btn {
  background: #0066FF;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

#calculate-btn:hover {
  background: #0052CC;
  transform: translateY(-2px);
}
</style>
```

---

## 🧪 Étape 5 : Tester

### **Test 1 : Vérifier l'URL de l'API**

Dans la console du navigateur (F12) :
```javascript
fetch('https://alva-roi-simulator-production.up.railway.app/health')
  .then(r => r.json())
  .then(d => console.log(d));
```

Devrait afficher : `{status: "OK", timestamp: "...", environment: "production"}`

### **Test 2 : Tester le Formulaire**

1. Remplir les champs
2. Cliquer sur "Calculer mon ROI"
3. Vérifier que les résultats s'affichent

### **Test 3 : Vérifier les Erreurs**

Ouvrir la console (F12) pour voir les erreurs éventuelles.

---

## 🔧 Troubleshooting

### **Erreur CORS**

Si tu vois : `Access to fetch has been blocked by CORS policy`

**Solution :** L'API a déjà CORS ouvert, mais vérifie que l'URL est correcte.

### **Résultats ne s'affichent pas**

1. Vérifier les IDs des éléments HTML
2. Ouvrir la console (F12) pour voir les erreurs
3. Vérifier que l'API répond : `curl https://ton-api.railway.app/health`

### **Champs non trouvés**

Vérifier que les IDs correspondent :
- `sector`
- `employees`
- `processes`
- `timePerTask`

---

## 📱 Version Mobile

Le code JavaScript fonctionne automatiquement sur mobile. Assure-toi juste que :
- Les champs sont bien visibles
- Le bouton est cliquable
- Les résultats sont lisibles

---

## 🎯 Exemple Complet

**URL de test :**
```
https://alva-roi-simulator-production.up.railway.app
```

**Requête test :**
```javascript
{
  "sector": "finance",
  "employees": 250,
  "processes": 3,
  "timePerTask": 2
}
```

**Réponse attendue :**
```javascript
{
  "success": true,
  "data": {
    "results": {
      "roiPercentage": -16,
      "yearlySavings": 26168,
      "paybackWeeks": 30,
      "timeSaved": 24,
      "errorReduction": 85,
      "productivityGain": 32
    }
  }
}
```

---

## 📞 Support

**GitHub :** https://github.com/lmelane/alva-roi-simulator  
**Email :** dev@alva-ai.com

---

**Version :** 1.0  
**Dernière mise à jour :** 5 octobre 2025
