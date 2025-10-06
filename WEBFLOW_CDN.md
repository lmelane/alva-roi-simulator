# 🚀 Intégration Webflow via CDN

Guide ultra-simple : **1 seule ligne de code** à ajouter dans Webflow !

---

## ⚡ Solution CDN (Recommandée)

### **Dans Webflow : Page Settings → Custom Code → Before </body> tag**

Copie cette **unique ligne** :

```html
<script src="https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@main/webflow-cdn.js"></script>
```

**C'est tout !** 🎉

---

## ✅ Avantages du CDN

| Avant (Code copié) | Maintenant (CDN) |
|-------------------|------------------|
| ~350 lignes de code | ✅ **1 ligne** |
| Copier-coller à chaque mise à jour | ✅ **Auto-update** |
| Risque d'erreur de copie | ✅ **Toujours à jour** |
| Code dans Webflow | ✅ **Hébergé sur GitHub** |

---

## 🎯 Comment Ça Marche

### **1. Le Fichier est sur GitHub**
```
https://github.com/lmelane/alva-roi-simulator/blob/main/webflow-cdn.js
```

### **2. jsDelivr le Sert en CDN**
```
https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@main/webflow-cdn.js
```

### **3. Webflow le Charge**
```html
<script src="https://cdn.jsdelivr.net/gh/..."></script>
```

---

## 🔄 Mises à Jour Automatiques

### **Quand tu push sur GitHub :**
```bash
git push origin main
```

### **Le CDN se met à jour automatiquement** (cache ~24h)

### **Pour forcer une mise à jour immédiate :**
```html
<script src="https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@main/webflow-cdn.js?v=2"></script>
```
Change le `?v=2` en `?v=3`, `?v=4`, etc.

---

## 📋 Checklist Webflow

- [ ] Créer les inputs avec les IDs (sector, employees, processes, timePerTask)
- [ ] Créer les zones de résultats (result-roi, result-savings, etc.)
- [ ] Créer le container results-section
- [ ] Ajouter la ligne CDN dans Custom Code
- [ ] Publier
- [ ] Tester !

---

## 🧪 Test

### **1. Ouvre la Console (F12)**

Tu dois voir :
```
🚀 Simulateur ROI initialisé (CDN)
👀 Démarrage du polling des sliders
✅ Listener attaché sur: sector
✅ Listener attaché sur: employees
...
```

### **2. Change un Input**

Tu dois voir :
```
🎯 Event input sur employees, valeur: 300
📊 Recalcul déclenché par: employees
🔄 calculateROI() appelé
✅ Résultats: {...}
```

---

## 🎯 URLs CDN

### **Production (Stable)**
```html
<script src="https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@main/webflow-cdn.js"></script>
```

### **Avec Version Spécifique**
```html
<script src="https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@v1.0.0/webflow-cdn.js"></script>
```

### **Dernière Version (Toujours à jour)**
```html
<script src="https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@latest/webflow-cdn.js"></script>
```

---

## 🔧 Troubleshooting

### **Le script ne charge pas**

1. Vérifie que le fichier est bien sur GitHub
2. Vérifie l'URL : https://github.com/lmelane/alva-roi-simulator/blob/main/webflow-cdn.js
3. Attends 1-2 minutes (cache CDN)

### **Erreur 404**

Le fichier n'est pas encore sur GitHub. Push avec :
```bash
git add webflow-cdn.js
git commit -m "Add CDN version"
git push origin main
```

### **Le code ne se met pas à jour**

Vide le cache CDN :
```html
<script src="...?v=NEW_VERSION"></script>
```

---

## 💡 Comparaison

### **Méthode 1 : Code Copié (Ancien)**
```html
<script>
// 350 lignes de code...
const API_URL = '...';
function calculateROI() { ... }
// etc.
</script>
```

### **Méthode 2 : CDN (Nouveau)** ✅
```html
<script src="https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@main/webflow-cdn.js"></script>
```

**99% plus simple !** 🚀

---

## 📞 Support

**GitHub :** https://github.com/lmelane/alva-roi-simulator  
**CDN :** https://cdn.jsdelivr.net/gh/lmelane/alva-roi-simulator@main/webflow-cdn.js

---

**Version :** 1.0  
**Dernière mise à jour :** 6 octobre 2025
