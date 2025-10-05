# 🎨 Guide d'Intégration Webflow avec l'API

Guide complet pour intégrer le simulateur ROI dans Webflow en utilisant l'API backend.

---

## 📋 Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Webflow       │  HTTPS  │   API REST      │  CRUD   │   MongoDB       │
│   (Frontend)    │ ◄─────► │   (Backend)     │ ◄─────► │   (Database)    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 🚀 Étape 1 : Déployer l'API

### Option A : Heroku (Recommandé pour débuter)

```bash
# 1. Créer un compte Heroku
https://signup.heroku.com/

# 2. Installer Heroku CLI
brew install heroku/brew/heroku

# 3. Se connecter
heroku login

# 4. Créer l'app
cd api
heroku create alva-roi-simulator-api

# 5. Ajouter MongoDB
heroku addons:create mongolab:sandbox

# 6. Configurer les variables
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://alva-ai.webflow.io,https://www.alva-ai.com

# 7. Déployer
git init
git add .
git commit -m "Initial API"
git push heroku main

# 8. Vérifier
heroku logs --tail
```

**URL de l'API :** `https://alva-roi-simulator-api.herokuapp.com`

### Option B : Vercel (Serverless)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
cd api
vercel --prod

# 4. Configurer les variables d'environnement
vercel env add MONGODB_URI
vercel env add ALLOWED_ORIGINS
```

---

## 🎨 Étape 2 : Créer le Formulaire dans Webflow

### Structure HTML

Dans Webflow Designer, créer cette structure :

```
Section "ROI Simulator"
├── Container
│   ├── Heading "Estimez votre ROI IA"
│   ├── Form "simulator-form"
│   │   ├── Select "sector" (Secteur)
│   │   ├── Slider "employees" (Employés)
│   │   ├── Slider "processes" (Processus)
│   │   ├── Slider "timePerTask" (Temps)
│   │   └── Button "Calculer le ROI"
│   └── Div "results" (masqué par défaut)
│       ├── Div "result-time-saved"
│       ├── Div "result-monthly-savings"
│       ├── Div "result-roi"
│       └── Button "Demander un audit"
```

### Ajouter les IDs et Classes

**Sélecteur de secteur :**
- ID : `sector`
- Class : `select-input`

**Sliders :**
- ID : `employees`, `processes`, `timePerTask`
- Class : `range-input`

**Bouton calcul :**
- ID : `calculate-btn`
- Class : `btn-primary`

**Zone de résultats :**
- ID : `results-section`
- Class : `results hidden` (masqué par défaut)

---

## 💻 Étape 3 : Ajouter le JavaScript

Dans Webflow : **Page Settings** → **Custom Code** → **Before </body> tag**

```html
<script>
// Configuration
const API_URL = 'https://alva-roi-simulator-api.herokuapp.com';

// Éléments du DOM
const form = document.getElementById('simulator-form');
const calculateBtn = document.getElementById('calculate-btn');
const resultsSection = document.getElementById('results-section');

// Sliders avec affichage de valeur
const sliders = ['employees', 'processes', 'timePerTask'];
sliders.forEach(id => {
  const slider = document.getElementById(id);
  const display = document.getElementById(`${id}-value`);
  
  if (slider && display) {
    slider.addEventListener('input', (e) => {
      display.textContent = e.target.value;
    });
  }
});

// Calculer le ROI
calculateBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  // Afficher un loader
  calculateBtn.textContent = 'Calcul en cours...';
  calculateBtn.disabled = true;
  
  try {
    // Récupérer les valeurs
    const formData = {
      sector: document.getElementById('sector').value,
      employees: parseInt(document.getElementById('employees').value),
      processes: parseInt(document.getElementById('processes').value),
      timePerTask: parseFloat(document.getElementById('timePerTask').value),
      mode: 'simple'
    };
    
    // Appeler l'API
    const response = await fetch(`${API_URL}/api/simulator/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayResults(data.data.results);
      
      // Sauvegarder pour le CTA
      window.simulationData = {
        inputs: data.data.inputs,
        results: data.data.results
      };
    } else {
      alert('Erreur lors du calcul. Veuillez réessayer.');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur de connexion. Veuillez réessayer.');
  } finally {
    calculateBtn.textContent = 'Calculer le ROI';
    calculateBtn.disabled = false;
  }
});

// Afficher les résultats
function displayResults(results) {
  // Afficher la section
  resultsSection.classList.remove('hidden');
  
  // Animer les chiffres
  animateValue('result-time-saved', results.timeSaved, ' heures');
  animateValue('result-monthly-savings', results.monthlySavings, ' €');
  animateValue('result-roi', results.roiPercentage, '%', '+');
  
  // Scroll vers les résultats
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Animation des chiffres
function animateValue(elementId, targetValue, suffix = '', prefix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const duration = 1000;
  const startValue = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
    element.textContent = prefix + currentValue.toLocaleString('fr-FR') + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// CTA : Demander un audit
const auditBtn = document.getElementById('audit-btn');
if (auditBtn) {
  auditBtn.addEventListener('click', () => {
    // Rediriger vers formulaire de contact avec données
    const params = new URLSearchParams({
      sector: window.simulationData?.inputs?.sectorName || '',
      roi: window.simulationData?.results?.roiPercentage || 0,
      savings: window.simulationData?.results?.yearlySavings || 0
    });
    
    window.location.href = `/contact?${params.toString()}`;
  });
}
</script>
```

---

## 📧 Étape 4 : Formulaire de Contact (Capture de Lead)

### Dans Webflow

Créer un formulaire de contact avec :
- Email (requis)
- Nom
- Entreprise
- Téléphone

### JavaScript pour Envoyer à l'API

```html
<script>
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    email: document.getElementById('email').value,
    name: document.getElementById('name').value,
    company: document.getElementById('company').value,
    phone: document.getElementById('phone').value,
    simulation: window.simulationData?.results || {},
    source: 'webflow',
    utmParams: {
      source: new URLSearchParams(window.location.search).get('utm_source'),
      medium: new URLSearchParams(window.location.search).get('utm_medium'),
      campaign: new URLSearchParams(window.location.search).get('utm_campaign')
    }
  };
  
  try {
    const response = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Rediriger vers page de remerciement
      window.location.href = '/merci';
    } else {
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur de connexion. Veuillez réessayer.');
  }
});
</script>
```

---

## 🎨 Étape 5 : Styles CSS

Dans Webflow : **Page Settings** → **Custom Code** → **Head Code**

```html
<style>
/* Simulateur */
.simulator-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.select-input, .range-input {
  width: 100%;
  margin-bottom: 1.5rem;
}

.range-input {
  -webkit-appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #E5E7EB;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0066FF;
  cursor: pointer;
}

/* Résultats */
.results {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
}

.results.hidden {
  display: none;
}

.result-card {
  background: rgba(255,255,255,0.1);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.result-value {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: 'SF Mono', monospace;
}

/* Boutons */
.btn-primary {
  background: #0066FF;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #0052CC;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

---

## 🔗 Étape 6 : Webhooks Webflow (Optionnel)

Si tu veux que Webflow envoie automatiquement les soumissions de formulaire à ton API :

1. Dans Webflow : **Project Settings** → **Integrations** → **Webhooks**
2. Ajouter un webhook :
   - **Trigger** : Form Submission
   - **URL** : `https://alva-roi-simulator-api.herokuapp.com/api/leads`
   - **Method** : POST

---

## 📊 Étape 7 : Tableau de Bord Admin

### Créer une Page Admin dans Webflow

```html
<!-- Liste des leads -->
<div id="leads-list"></div>

<script>
async function loadLeads() {
  const response = await fetch(`${API_URL}/api/leads?page=1&limit=50`);
  const data = await response.json();
  
  if (data.success) {
    const leadsHTML = data.data.leads.map(lead => `
      <div class="lead-card">
        <h3>${lead.company || lead.email}</h3>
        <p>ROI: ${lead.simulation.roiPercentage}%</p>
        <p>Économies: ${lead.simulation.yearlySavings.toLocaleString('fr-FR')} €</p>
        <p>Statut: ${lead.status}</p>
        <button onclick="updateStatus('${lead._id}', 'contacted')">
          Marquer comme contacté
        </button>
      </div>
    `).join('');
    
    document.getElementById('leads-list').innerHTML = leadsHTML;
  }
}

async function updateStatus(leadId, status) {
  await fetch(`${API_URL}/api/leads/${leadId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  
  loadLeads(); // Recharger
}

loadLeads();
</script>
```

---

## ✅ Checklist de Déploiement

- [ ] API déployée sur Heroku/Vercel
- [ ] MongoDB configuré (Atlas ou local)
- [ ] Variables d'environnement configurées
- [ ] CORS configuré avec domaine Webflow
- [ ] Formulaire créé dans Webflow
- [ ] JavaScript ajouté (Custom Code)
- [ ] Styles CSS ajoutés
- [ ] Test du calcul ROI
- [ ] Test de création de lead
- [ ] Page de remerciement créée
- [ ] Tracking analytics configuré

---

## 🐛 Troubleshooting

### Erreur CORS

**Problème :** `Access to fetch has been blocked by CORS policy`

**Solution :**
```bash
heroku config:set ALLOWED_ORIGINS=https://votre-domaine.webflow.io
```

### API ne répond pas

**Vérifier :**
```bash
# Logs Heroku
heroku logs --tail

# Tester l'API directement
curl https://alva-roi-simulator-api.herokuapp.com/health
```

### Données non sauvegardées

**Vérifier MongoDB :**
```bash
heroku config:get MONGODB_URI
```

---

## 📞 Support

Pour toute question :
- Documentation API : `/api/README.md`
- Email : dev@alva-ai.com

---

**Version** : 1.0  
**Dernière mise à jour** : 5 octobre 2025
