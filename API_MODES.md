# 🎯 Documentation API Simulateur ROI

L'API du simulateur ROI propose **un seul endpoint** avec des paramètres optionnels.

---

## 📊 Fonctionnement

| Paramètres | Comportement |
|------------|--------------|
| **Sans contact** | Calcul anonyme, résultats retournés, aucune donnée sauvegardée |
| **Avec contact** | Calcul + lead créé en base, résultats retournés + `leadId` |

---

## 🟢 Calcul Anonyme (Sans Contact)

### **Utilisation**

Permet à un visiteur de **calculer son ROI sans donner ses coordonnées**.

### **Requête**

```bash
POST /api/simulator/calculate
Content-Type: application/json

{
  "sector": "finance",
  "employees": 250,
  "processes": 3,
  "timePerTask": 2
}
```

### **Réponse**

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
      "calculatedAt": "2025-10-05T16:54:00.000Z",
      "sizeCategory": "medium",
      "efficiencyFactor": 0.75
    }
  }
}
```

### **Caractéristiques**

- ✅ **Aucune donnée personnelle** requise
- ✅ Calcul instantané
- ✅ Résultats complets
- ❌ Pas de lead créé en base
- ❌ Pas de suivi commercial

---

## 🔵 Calcul Avec Contact (Lead Créé)

### **Utilisation**

Le visiteur **fournit ses coordonnées** en plus des paramètres de simulation. Un **lead est automatiquement créé** en base de données.

### **Requête**

```bash
POST /api/simulator/calculate
Content-Type: application/json

{
  "sector": "finance",
  "employees": 250,
  "processes": 3,
  "timePerTask": 2,
  "contact": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@entreprise.com",
    "role": "Directeur Financier",
    "company": "Entreprise SAS",
    "phone": "+33 6 12 34 56 78"
  }
}
```

### **Champs Contact (Tous Optionnels)**

| Champ | Type | Description |
|-------|------|-------------|
| `firstName` | String | Prénom |
| `lastName` | String | Nom |
| `email` | String | Email (si fourni, lead créé) |
| `role` | String | Fonction (ex: CFO, DG, DAF) |
| `company` | String | Nom de l'entreprise |
| `phone` | String | Téléphone |

### **Réponse**

```json
{
  "success": true,
  "data": {
    "inputs": { ... },
    "results": {
      "timeSaved": 1980,
      "monthlySavings": 138600,
      "roiPercentage": 7421,
      ...
    },
    "metadata": { ... },
    "leadId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### **Caractéristiques**

- ✅ **Lead créé automatiquement** si email fourni
- ✅ **Résultats retournés** immédiatement
- ✅ **Données sauvegardées** en base PostgreSQL
- ✅ `leadId` inclus dans la réponse
- ✅ Suivi commercial possible
- ⚠️ Si l'email existe déjà, lead non créé mais calcul effectué

---

## 🔄 Gestion des Doublons

### **Comportement**

Si un email existe déjà en base :
- ✅ Le calcul ROI est effectué normalement
- ✅ Les résultats sont retournés
- ❌ Aucun nouveau lead n'est créé
- ❌ Pas de `leadId` dans la réponse

### **Exemple**

```json
// 1ère requête avec jean.dupont@entreprise.com
{
  "success": true,
  "data": {
    "results": { ... },
    "leadId": "550e8400-..."
  }
}

// 2ème requête avec le même email
{
  "success": true,
  "data": {
    "results": { ... }
    // Pas de leadId
  }
}
```

---

## 💻 Exemples d'Intégration Webflow

### **Calcul Anonyme**

```javascript
// Formulaire sans coordonnées
async function calculateAnonymous() {
  const response = await fetch('https://api.alva.com/api/simulator/calculate', {
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
  
  if (data.success) {
    // Afficher les résultats
    displayResults(data.data.results);
    
    // Proposer de sauvegarder avec coordonnées
    showContactFormButton();
  }
}
```

### **Calcul Avec Contact**

```javascript
// Formulaire avec coordonnées
async function calculateWithContact() {
  const response = await fetch('https://api.alva.com/api/simulator/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sector: document.getElementById('sector').value,
      employees: parseInt(document.getElementById('employees').value),
      processes: parseInt(document.getElementById('processes').value),
      timePerTask: parseFloat(document.getElementById('timePerTask').value),
      contact: {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value
      }
    })
  });

  const data = await response.json();
  
  if (data.success) {
    // Afficher les résultats
    displayResults(data.data.results);
    
    // Afficher confirmation si lead créé
    if (data.data.leadId) {
      showSuccessMessage('Merci ! Nous vous contacterons sous 24h.');
    }
    
    // Rediriger vers page de remerciement
    setTimeout(() => {
      window.location.href = '/merci';
    }, 2000);
  }
}
```

---

## 🎨 UX Recommandée

### **Parcours Utilisateur**

```
1. Visiteur arrive sur la landing page
   ↓
2. Voit le simulateur en MODE SIMPLE
   ↓
3. Remplit 4 champs (secteur, employés, processus, temps)
   ↓
4. Obtient les résultats instantanément
   ↓
5. CTA : "Obtenir un audit personnalisé"
   ↓
6. Formulaire MODE AVANCÉ apparaît
   ↓
7. Remplit ses coordonnées (prénom, nom, email, fonction)
   ↓
8. Soumet → Lead créé → Redirection page merci
```

### **Exemple de CTA**

```html
<!-- Après affichage des résultats en mode simple -->
<div class="cta-advanced">
  <h3>🎯 Transformez cette estimation en plan d'action</h3>
  <p>Obtenez un audit IA personnalisé avec nos experts</p>
  <button onclick="showAdvancedForm()">
    Demander un audit gratuit
  </button>
</div>

<!-- Formulaire mode avancé (masqué par défaut) -->
<div id="advanced-form" style="display: none;">
  <input type="text" id="firstName" placeholder="Prénom *" required>
  <input type="text" id="lastName" placeholder="Nom *" required>
  <input type="email" id="email" placeholder="Email professionnel *" required>
  <input type="text" id="role" placeholder="Fonction *" required>
  <input type="text" id="company" placeholder="Entreprise">
  <input type="tel" id="phone" placeholder="Téléphone">
  <button onclick="calculateAdvanced()">
    Obtenir mon audit personnalisé
  </button>
</div>
```

---

## 🔒 Validation des Erreurs

### **Mode Simple - Erreur**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid value",
      "param": "sector",
      "location": "body"
    }
  ]
}
```

### **Mode Avancé - Coordonnées Manquantes**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid value",
      "param": "contact.firstName",
      "location": "body"
    },
    {
      "msg": "Invalid value",
      "param": "contact.email",
      "location": "body"
    }
  ]
}
```

---

## 📊 Statistiques des Leads (Mode Avancé)

### **Récupérer les Leads**

```bash
GET /api/leads?page=1&limit=20&source=api-advanced
```

### **Filtrer par Source**

Les leads créés via le mode avancé ont automatiquement :
```json
{
  "source": "api-advanced"
}
```

---

## ✅ Checklist d'Intégration

### **Mode Simple**
- [ ] Formulaire avec 4 champs (secteur, employés, processus, temps)
- [ ] Bouton "Calculer le ROI"
- [ ] Affichage des résultats
- [ ] CTA vers mode avancé

### **Mode Avancé**
- [ ] Formulaire avec coordonnées (prénom, nom, email, fonction)
- [ ] Validation côté client
- [ ] Bouton "Demander un audit"
- [ ] Page de remerciement
- [ ] Email de confirmation (optionnel)

---

## 🎯 Résumé

| Paramètres | Lead Créé | Résultats | Usage |
|------------|-----------|-----------|-------|
| **Sans contact** | ❌ Non | ✅ Retournés | Découverte rapide |
| **Avec contact** | ✅ Oui (si email fourni) | ✅ Retournés + `leadId` | Demande d'audit |

**Un seul endpoint, comportement adaptatif selon les paramètres fournis.**

---

**Version** : 2.0  
**Dernière mise à jour** : 5 octobre 2025
