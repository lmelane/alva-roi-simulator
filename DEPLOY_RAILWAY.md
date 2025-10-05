# 🚂 Déploiement sur Railway - Guide Complet

Guide pas à pas pour déployer l'API du simulateur ROI sur Railway.

---

## 🎯 Pourquoi Railway ?

- ✅ **Gratuit** : 500h/mois + $5 de crédit gratuit
- ✅ **Simple** : Déploiement en 1 clic depuis GitHub
- ✅ **Rapide** : Build et déploiement automatique
- ✅ **MongoDB intégré** : Plugin MongoDB gratuit
- ✅ **HTTPS automatique** : Certificat SSL inclus
- ✅ **Logs en temps réel** : Monitoring intégré

---

## 📋 Prérequis

- [ ] Compte GitHub
- [ ] Compte Railway (gratuit)
- [ ] Code pushé sur GitHub

---

## 🚀 Étape 1 : Créer un Compte Railway

1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur **"Start a New Project"**
3. Se connecter avec GitHub
4. Autoriser Railway à accéder à tes repos

---

## 📦 Étape 2 : Pousser le Code sur GitHub

```bash
# 1. Initialiser Git (si pas déjà fait)
cd "/Users/loicmelane/CascadeProjects/roi sumulator"
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Commit
git commit -m "Initial commit - ROI Simulator API"

# 4. Créer un repo sur GitHub
# Aller sur github.com → New Repository → "roi-simulator"

# 5. Ajouter le remote
git remote add origin https://github.com/TON-USERNAME/roi-simulator.git

# 6. Push
git branch -M main
git push -u origin main
```

---

## 🎨 Étape 3 : Déployer sur Railway

### **Option A : Depuis GitHub (Recommandé)**

1. Sur Railway, cliquer **"New Project"**
2. Choisir **"Deploy from GitHub repo"**
3. Sélectionner ton repo **"roi-simulator"**
4. Railway détecte automatiquement Node.js
5. Cliquer **"Deploy Now"**

### **Option B : Depuis CLI**

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Se connecter
railway login

# 3. Initialiser le projet
cd api
railway init

# 4. Déployer
railway up
```

---

## ⚙️ Étape 4 : Configurer les Variables d'Environnement

1. Dans Railway, aller dans ton projet
2. Cliquer sur l'onglet **"Variables"**
3. Ajouter ces variables :

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://alva-ai.webflow.io,https://www.alva-ai.com
```

**Note :** Railway définit automatiquement `PORT`, mais on le met par sécurité.

---

## 🗄️ Étape 5 : Ajouter MongoDB

### **Option A : Plugin MongoDB Railway (Recommandé)**

1. Dans ton projet Railway, cliquer **"New"** → **"Database"** → **"Add MongoDB"**
2. Railway crée automatiquement une instance MongoDB
3. La variable `MONGODB_URI` est automatiquement ajoutée
4. **C'est tout !** 🎉

### **Option B : MongoDB Atlas (Externe)**

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Récupérer l'URI de connexion
4. Dans Railway, ajouter la variable :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roi-simulator
   ```

---

## 🌐 Étape 6 : Obtenir l'URL de l'API

1. Dans Railway, aller dans **"Settings"**
2. Section **"Domains"**
3. Cliquer **"Generate Domain"**
4. Railway génère une URL : `https://roi-simulator-production.up.railway.app`

**C'est ton URL d'API !** 🎯

---

## ✅ Étape 7 : Tester l'API

```bash
# Health check
curl https://roi-simulator-production.up.railway.app/health

# Calculer un ROI
curl -X POST https://roi-simulator-production.up.railway.app/api/simulator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "sector": "finance",
    "employees": 250,
    "processes": 3,
    "timePerTask": 2,
    "mode": "simple"
  }'
```

**Si tu vois un JSON en réponse, c'est bon !** ✅

---

## 🔧 Étape 8 : Configurer le Domaine Personnalisé (Optionnel)

1. Dans Railway → **Settings** → **Domains**
2. Cliquer **"Custom Domain"**
3. Entrer ton domaine : `api.alva-ai.com`
4. Ajouter un enregistrement CNAME chez ton registrar :
   ```
   CNAME api.alva-ai.com → roi-simulator-production.up.railway.app
   ```
5. Attendre la propagation DNS (5-30 min)

---

## 🔄 Déploiement Automatique

Railway redéploie automatiquement à chaque push sur `main` :

```bash
# Faire des modifications
git add .
git commit -m "Update API"
git push origin main

# Railway redéploie automatiquement ! 🚀
```

---

## 📊 Monitoring & Logs

### **Voir les Logs en Temps Réel**

1. Dans Railway, aller dans **"Deployments"**
2. Cliquer sur le dernier déploiement
3. Onglet **"Logs"**

### **Depuis la CLI**

```bash
railway logs
```

### **Métriques**

Railway affiche automatiquement :
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🐛 Troubleshooting

### **Erreur : Application failed to respond**

**Cause :** Le serveur ne démarre pas sur le bon port.

**Solution :** Railway définit automatiquement `PORT`. Vérifier dans `server.js` :

```javascript
const PORT = process.env.PORT || 3000;
```

### **Erreur : MongoDB connection failed**

**Vérifier :**
```bash
railway variables
```

La variable `MONGODB_URI` doit être présente.

### **Erreur CORS**

**Ajouter ton domaine Webflow dans les variables :**
```
ALLOWED_ORIGINS=https://alva-ai.webflow.io
```

### **Logs ne s'affichent pas**

```bash
# Forcer le redéploiement
railway up --detach
```

---

## 💰 Pricing Railway

### **Plan Gratuit**
- 500 heures d'exécution/mois
- $5 de crédit gratuit/mois
- 1 GB RAM
- 1 GB stockage

**Largement suffisant pour démarrer !**

### **Plan Hobby ($5/mois)**
- Exécution illimitée
- 8 GB RAM
- 100 GB stockage

---

## 🔐 Sécurité

### **Variables d'Environnement**

Railway chiffre automatiquement toutes les variables.

### **HTTPS**

Railway fournit automatiquement un certificat SSL.

### **Secrets**

Pour les clés sensibles :
```bash
railway variables set API_KEY=your-secret-key
```

---

## 📱 Intégration Webflow

Une fois déployé, utiliser l'URL Railway dans Webflow :

```javascript
// Dans Webflow Custom Code
const API_URL = 'https://roi-simulator-production.up.railway.app';

async function calculateROI() {
  const response = await fetch(`${API_URL}/api/simulator/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ /* ... */ })
  });
  
  const data = await response.json();
  displayResults(data.data.results);
}
```

---

## 🎯 Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] Projet créé sur Railway
- [ ] Variables d'environnement configurées
- [ ] MongoDB ajouté (plugin ou Atlas)
- [ ] Domaine généré
- [ ] API testée avec curl
- [ ] CORS configuré avec domaine Webflow
- [ ] Logs vérifiés
- [ ] Intégration Webflow testée

---

## 📞 Commandes Utiles

```bash
# Voir les variables
railway variables

# Voir les logs
railway logs

# Redéployer
railway up

# Ouvrir le dashboard
railway open

# Voir le statut
railway status

# Se connecter à MongoDB
railway connect mongodb
```

---

## 🚀 Prochaines Étapes

1. ✅ Déployer l'API sur Railway
2. ✅ Tester les endpoints
3. ✅ Configurer CORS avec ton domaine Webflow
4. ✅ Intégrer dans Webflow (voir `INTEGRATION_WEBFLOW.md`)
5. ✅ Tester le formulaire complet
6. ✅ Monitorer les premiers leads

---

## 📚 Ressources

- [Railway Docs](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

---

**Temps estimé de déploiement : 10 minutes** ⏱️

**L'API sera accessible en HTTPS avec un domaine gratuit !** 🎉

---

**Besoin d'aide ?** Consulte les logs Railway ou contacte le support.
