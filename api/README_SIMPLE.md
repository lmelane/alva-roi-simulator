# 🚀 API Simulateur ROI IA - Alva

API REST **stateless** pour le calcul de retour sur investissement IA.

**Caractéristiques :**
- ✅ Aucune base de données
- ✅ Calcul pur sans sauvegarde
- ✅ CORS ouvert (toutes origines)
- ✅ Déploiement ultra simple

---

## 🔧 Installation

```bash
# 1. Installer les dépendances
cd api
npm install

# 2. Démarrer le serveur
npm start
```

Le serveur démarre sur `http://localhost:3000`

**Aucune configuration nécessaire !**

---

## 📡 Endpoints

### Health Check

**GET** `/health`

```bash
curl https://votre-api.com/health
```

**Réponse :**
```json
{
  "status": "OK",
  "timestamp": "2025-10-05T17:08:00.000Z",
  "environment": "production"
}
```

---

### Calculer le ROI

**POST** `/api/simulator/calculate`

**Paramètres obligatoires :**
- `sector` : Secteur d'activité
- `employees` : Nombre d'employés
- `processes` : Nombre de processus à automatiser
- `timePerTask` : Temps moyen par processus (h/jour)

**Paramètres optionnels :**
- `hourlyCost` : Coût horaire (€/h)
- `currentAutomation` : Automatisation actuelle (%)
- `targetAutomation` : Objectif d'automatisation (%)
- `maturity` : Maturité digitale (low/medium/high)

**Exemple :**
```bash
curl -X POST https://votre-api.com/api/simulator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "sector": "finance",
    "employees": 250,
    "processes": 3,
    "timePerTask": 2
  }'
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
      "maturity": "medium"
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
      "calculatedAt": "2025-10-05T17:08:00.000Z",
      "sizeCategory": "medium",
      "efficiencyFactor": 0.75
    }
  }
}
```

---

### Récupérer les Benchmarks

**GET** `/api/simulator/benchmarks`

Retourne tous les coefficients sectoriels.

---

### Liste des Secteurs

**GET** `/api/simulator/sectors`

Liste tous les secteurs disponibles.

---

## 💻 Intégration JavaScript

```javascript
async function calculateROI() {
  const response = await fetch('https://votre-api.com/api/simulator/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sector: 'finance',
      employees: 250,
      processes: 3,
      timePerTask: 2
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('ROI:', data.data.results.roiPercentage + '%');
    console.log('Économies annuelles:', data.data.results.yearlySavings + '€');
  }
}
```

---

## 🚀 Déploiement Railway

```bash
# 1. Push sur GitHub
git add .
git commit -m "API ROI Simulator"
git push origin main

# 2. Sur Railway
# → New Project
# → Deploy from GitHub repo
# → Sélectionner le repo
# → Railway détecte Node.js automatiquement
# → Deploy !
```

**Variables d'environnement (optionnelles) :**
```env
NODE_ENV=production
PORT=3000
```

**C'est tout !** Pas de base de données à configurer.

---

## 📊 Secteurs Disponibles

- `general` : Multi-fonctions / Général
- `finance` : Finance & Comptabilité
- `hr` : Ressources Humaines
- `operations` : Opérations & Logistique
- `sales` : Commercial & Ventes
- `support` : Support Client & Service
- `marketing` : Marketing & Communication
- `it` : IT & Développement
- `legal` : Juridique & Compliance

---

## 🔒 Sécurité

- ✅ Helmet.js (headers sécurisés)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS ouvert (configurable)
- ✅ Validation des inputs
- ✅ HTTPS automatique (Railway)

---

## 📞 Support

Pour toute question :
- Documentation complète : `/api/README.md`
- Email : dev@alva-ai.com

---

**Version** : 2.0  
**Dernière mise à jour** : 5 octobre 2025  
**Stateless** : Aucune donnée sauvegardée
