# 🚀 API Simulateur ROI IA - Alva

API REST **stateless** pour le calcul de retour sur investissement IA.

## 🎯 Caractéristiques

- ✅ **Stateless** : Aucune base de données
- ✅ **Calculs validés** : Basés sur McKinsey, PwC, Deloitte, BCG, Gartner
- ✅ **9 secteurs** : Coefficients spécifiques par industrie
- ✅ **CORS ouvert** : Prêt pour Webflow
- ✅ **Déploiement simple** : Railway en 1 clic

---

## 📡 Endpoints

### Health Check
```bash
GET /health
```

### Calculer le ROI
```bash
POST /api/simulator/calculate

{
  "sector": "finance",
  "employees": 250,
  "processes": 3,
  "timePerTask": 2
}
```

### Liste des secteurs
```bash
GET /api/simulator/sectors
```

---

## 🔧 Installation Locale

```bash
cd api
npm install
npm start
```

L'API démarre sur `http://localhost:3000`

---

## 🚀 Déploiement Railway

1. **Push sur GitHub** ✅
2. Aller sur [railway.app](https://railway.app)
3. **New Project** → **Deploy from GitHub repo**
4. Sélectionner `lmelane/alva-roi-simulator`
5. **Deploy !**

**Aucune configuration nécessaire !**

---

## 💻 Intégration Webflow

```javascript
const API_URL = 'https://alva-roi-simulator-production.up.railway.app';

async function calculateROI() {
  const response = await fetch(`${API_URL}/api/simulator/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sector: document.getElementById('sector').value,
      employees: parseInt(document.getElementById('employees').value),
      processes: parseInt(document.getElementById('processes').value),
      timePerTask: parseFloat(document.getElementById('timePerTask').value)
    })
  });

  const data = await response.json();
  document.getElementById('result-roi').textContent = data.data.results.roiPercentage + '%';
}
```

---

## 📊 Secteurs Disponibles

1. Finance & Comptabilité - 35% automatisable
2. Support Client - 45% automatisable
3. Opérations & Logistique - 40% automatisable
4. IT & Développement - 38% automatisable
5. Ressources Humaines - 30% automatisable
6. Commercial & Ventes - 25% automatisable
7. Marketing - 33% automatisable
8. Juridique - 28% automatisable
9. Général - 30% automatisable

---

## 📚 Documentation

- `api/README.md` - Documentation API complète
- `DEPLOY_RAILWAY.md` - Guide de déploiement

---

**Version** : 2.0 - API Backend Only  
**GitHub** : https://github.com/lmelane/alva-roi-simulator
