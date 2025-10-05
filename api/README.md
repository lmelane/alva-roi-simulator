# 🚀 API Simulateur ROI IA - Alva

API REST **stateless** pour le calcul de retour sur investissement IA.

**Caractéristiques :**
- ✅ Aucune base de données
- ✅ Calcul pur sans sauvegarde
- ✅ CORS ouvert
- ✅ Déploiement ultra simple

## 📋 Table des Matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Exemples d'Utilisation](#exemples-dutilisation)
- [Déploiement](#déploiement)

---

## 🔧 Installation

### Prérequis

- Node.js >= 18.0.0
- npm ou yarn

### Étapes

```bash
# 1. Installer les dépendances
cd api
npm install

# 2. Démarrer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

**Aucune configuration nécessaire !** L'API est stateless.

---

## 📡 Endpoints

### 1. Health Check

**GET** `/health`

Vérifier que l'API fonctionne.

**Réponse :**
```json
{
  "status": "OK",
  "timestamp": "2025-10-05T16:43:00.000Z",
  "environment": "development"
}
```

---

### 2. Calculer le ROI

**POST** `/api/simulator/calculate`

Calcule le ROI basé sur les paramètres fournis.

**Body (Mode Simple) :**
```json
{
  "sector": "finance",
  "employees": 250,
  "processes": 3,
  "timePerTask": 2,
  "mode": "simple"
}
```

**Body (Mode Expert) :**
```json
{
  "sector": "finance",
  "employees": 250,
  "processes": 3,
  "timePerTask": 2,
  "hourlyCost": 70,
  "currentAutomation": 15,
  "targetAutomation": 35,
  "maturity": "medium",
  "mode": "expert"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "inputs": {
      "sector": "finance",
      "sectorName": "Finance & Comptabilité",
      "employees": 250,
      "processes": 3,
      "timePerTask": 2,
      "hourlyCost": 70,
      "currentAutomation": 15,
      "targetAutomation": 35,
      "maturity": "medium",
      "mode": "simple"
    },
    "results": {
      "timeSaved": 1980,
      "monthlySavings": 138600,
      "yearlySavings": 1663200,
      "roiPercentage": 7421,
      "paybackWeeks": 4,
      "automationGain": 20,
      "dailyHours": "90.0",
      "investment": 20000,
      "netGains": 1643200,
      "errorReduction": 85,
      "productivityGain": 32
    },
    "metadata": {
      "calculatedAt": "2025-10-05T16:43:00.000Z",
      "sizeCategory": "medium",
      "efficiencyFactor": 0.75
    }
  }
}
```

---

### 3. Récupérer les Benchmarks

**GET** `/api/simulator/benchmarks`

Retourne tous les coefficients sectoriels.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "sectors": { ... },
    "maturityFactors": { ... },
    "pricing": { ... }
  }
}
```

---

### 4. Liste des Secteurs

**GET** `/api/simulator/sectors`

Liste tous les secteurs disponibles.

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "finance",
      "name": "Finance & Comptabilité",
      "automationPotential": 0.35,
      "productivityGain": 0.32
    },
    ...
  ]
}
```

---

### 5. Créer un Lead

**POST** `/api/leads`

Enregistre un lead avec sa simulation.

**Body :**
```json
{
  "email": "contact@entreprise.com",
  "company": "Entreprise SAS",
  "name": "Jean Dupont",
  "phone": "+33 6 12 34 56 78",
  "simulation": {
    "sector": "finance",
    "employees": 250,
    "roiPercentage": 7421,
    "yearlySavings": 1663200
  },
  "source": "webflow",
  "utmParams": {
    "source": "google",
    "medium": "cpc",
    "campaign": "roi-simulator"
  }
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "leadId": "507f1f77bcf86cd799439011",
    "message": "Lead créé avec succès"
  }
}
```

---

### 6. Récupérer un Lead

**GET** `/api/leads/:id`

Récupère les détails d'un lead.

---

### 7. Liste des Leads

**GET** `/api/leads?page=1&limit=20&sector=finance`

Liste paginée des leads avec filtres optionnels.

**Query Params :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre par page (défaut: 20)
- `sector` : Filtrer par secteur
- `source` : Filtrer par source

---

### 8. Mettre à Jour le Statut

**PUT** `/api/leads/:id/status`

Change le statut d'un lead.

**Body :**
```json
{
  "status": "qualified"
}
```

**Statuts possibles :**
- `new` : Nouveau lead
- `contacted` : Contacté
- `qualified` : Qualifié
- `converted` : Converti en client
- `lost` : Perdu

---

### 9. Statistiques

**GET** `/api/leads/analytics/stats`

Statistiques globales des leads.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "bySector": [
      {
        "_id": "finance",
        "count": 45,
        "avgROI": 6500,
        "avgEmployees": 280
      }
    ],
    "byStatus": [
      {
        "_id": "new",
        "count": 80
      }
    ]
  }
}
```

---

## 💻 Exemples d'Utilisation

### Depuis Webflow (JavaScript)

```javascript
// Calculer le ROI
async function calculateROI(formData) {
  const response = await fetch('https://votre-api.com/api/simulator/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sector: formData.sector,
      employees: formData.employees,
      processes: formData.processes,
      timePerTask: formData.timePerTask,
      mode: 'simple'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    displayResults(data.data.results);
  }
}

// Créer un lead
async function submitLead(email, simulationData) {
  const response = await fetch('https://votre-api.com/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      simulation: simulationData,
      source: 'webflow'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Lead créé:', data.data.leadId);
  }
}
```

### Depuis cURL

```bash
# Calculer le ROI
curl -X POST https://votre-api.com/api/simulator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "sector": "finance",
    "employees": 250,
    "processes": 3,
    "timePerTask": 2,
    "mode": "simple"
  }'

# Créer un lead
curl -X POST https://votre-api.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@entreprise.com",
    "company": "Entreprise SAS",
    "simulation": {
      "sector": "finance",
      "roiPercentage": 7421
    }
  }'
```

---

## 🚀 Déploiement

### Option 1 : Heroku

```bash
# 1. Créer une app Heroku
heroku create roi-simulator-api

# 2. Ajouter MongoDB Atlas
heroku addons:create mongolab:sandbox

# 3. Configurer les variables
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://votre-domaine.webflow.io

# 4. Déployer
git push heroku main
```

### Option 2 : Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel --prod
```

### Option 3 : Railway

1. Connecter votre repo GitHub
2. Railway détecte automatiquement Node.js
3. Ajouter les variables d'environnement
4. Déployer

### Option 4 : DigitalOcean App Platform

1. Connecter votre repo
2. Configurer les variables d'environnement
3. Déployer

---

## 📊 Monitoring

### Logs

```bash
# En développement
npm run dev

# En production (Heroku)
heroku logs --tail
```

### Métriques

- Nombre de calculs ROI par jour
- Nombre de leads créés
- Taux de conversion par secteur
- Temps de réponse API

---

## 🔒 Sécurité

- ✅ Helmet.js (headers sécurisés)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ Validation des inputs
- ✅ Sanitization des données
- ✅ HTTPS obligatoire en production

---

## 📞 Support

Pour toute question :
- Email : dev@alva-ai.com
- Documentation : https://docs.alva-ai.com

---

**Version** : 1.0  
**Dernière mise à jour** : 5 octobre 2025
