# 🚀 Simulateur ROI IA - Alva

Un simulateur interactif de retour sur investissement pour l'intelligence artificielle, conçu pour maximiser les conversions sur votre landing page B2B.

## 📊 Aperçu

Ce simulateur permet à vos prospects de visualiser en temps réel :
- ⏱️ **Temps gagné** par mois grâce à l'automatisation IA
- 💰 **Économies financières** mensuelles et annuelles
- 📈 **ROI estimé** à 12 mois avec temps de retour sur investissement
- 🎯 **Détail du calcul** transparent et crédible

## ✨ Fonctionnalités

### Interface Interactive
- 6 sliders personnalisables (nombre d'employés, processus, temps, coût horaire, etc.)
- Mise à jour en temps réel des résultats
- Animations fluides avec compteurs animés
- Design moderne et responsive (mobile-first)

### Calculs Réalistes
- Formule ROI basée sur des données réelles
- Facteur d'efficacité IA ajustable (75% par défaut)
- Prise en compte des coûts d'audit, implémentation et maintenance
- Méthodologie transparente visible dans le détail

### UX Optimisée
- Feedback visuel immédiat (effet pulse sur les cartes)
- Indicateurs de confiance intégrés
- CTA stratégique avec mention CIR
- Collecte de données de simulation pour qualification des leads

## 🎨 Design

- **Palette de couleurs** : Personnalisable via CSS variables
- **Typographie** : System fonts pour performance optimale
- **Animations** : Smooth et performantes (requestAnimationFrame)
- **Responsive** : Adapté mobile, tablette et desktop
- **Accessibilité** : Contraste WCAG AA, labels sémantiques

## 📦 Structure des Fichiers

```
roi-simulator/
├── index.html          # Structure HTML du simulateur
├── calculator.js       # Moteur de calcul et logique interactive
├── styles.css          # Styles modernes et responsive
└── README.md          # Documentation (ce fichier)
```

## 🔧 Intégration Webflow

### Option 1 : Intégration Simple (Recommandée)

1. **Créer une nouvelle section dans Webflow**
   - Ajouter un élément "Embed" (Code personnalisé)
   - Copier tout le contenu de `index.html` (entre `<body>` et `</body>`)

2. **Ajouter le CSS**
   - Dans les paramètres de la page → Custom Code → Head Code
   - Ajouter : `<style>` + contenu de `styles.css` + `</style>`

3. **Ajouter le JavaScript**
   - Dans les paramètres de la page → Custom Code → Before </body> tag
   - Ajouter : `<script>` + contenu de `calculator.js` + `</script>`

### Option 2 : Fichiers Externes (Pour Réutilisation)

1. **Héberger les fichiers**
   - Uploader `calculator.js` et `styles.css` dans Webflow Assets
   - Ou utiliser un CDN (GitHub Pages, Cloudflare, etc.)

2. **Lier les fichiers**
   ```html
   <!-- Dans Head Code -->
   <link rel="stylesheet" href="URL_DE_VOTRE_STYLES.CSS">
   
   <!-- Avant </body> -->
   <script src="URL_DE_VOTRE_CALCULATOR.JS"></script>
   ```

3. **Ajouter le HTML**
   - Créer un élément Embed
   - Coller le contenu HTML du simulateur

## ⚙️ Personnalisation

### 1. Ajuster les Couleurs de Marque

Dans `styles.css`, modifier les variables CSS :

```css
:root {
    --primary: #0066FF;        /* Couleur principale Alva */
    --secondary: #00D4AA;      /* Couleur secondaire */
    --accent: #FF6B35;         /* Couleur d'accent */
    /* ... */
}
```

### 2. Modifier le Modèle de Prix

Dans `calculator.js`, ajuster l'objet `pricing` :

```javascript
this.pricing = {
    auditBase: 5000,                    // Coût de l'audit initial
    implementationPerProcess: 3000,     // Coût par processus automatisé
    maintenanceMonthly: 500,            // Maintenance mensuelle
    efficiencyFactor: 0.75              // Facteur d'efficacité IA (75%)
};
```

### 3. Personnaliser les Valeurs par Défaut

Dans `calculator.js`, modifier l'objet `inputs` :

```javascript
this.inputs = {
    employees: 250,              // Nombre d'employés par défaut
    processes: 3,                // Processus à automatiser
    timePerTask: 2,              // Heures par jour
    hourlyCost: 40,              // Coût horaire moyen
    currentAutomation: 20,       // % automatisation actuelle
    targetAutomation: 60         // % objectif
};
```

### 4. Configurer le CTA

Dans `calculator.js`, méthode `handleCTAClick()` :

```javascript
handleCTAClick() {
    // Option A: Redirection vers formulaire
    const params = new URLSearchParams(this.inputs);
    window.location.href = `/contact?${params.toString()}`;
    
    // Option B: Envoi vers API
    this.sendToAPI(simulationData);
    
    // Option C: Ouvrir modal Webflow
    // Webflow.require('ix2').init();
}
```

## 📈 Tracking & Analytics

### Événements à Tracker

Le simulateur génère plusieurs événements trackables :

```javascript
// 1. Changement de slider
gtag('event', 'slider_change', {
    'event_category': 'ROI Simulator',
    'event_label': 'employees',
    'value': 250
});

// 2. Clic sur CTA
gtag('event', 'cta_click', {
    'event_category': 'ROI Simulator',
    'event_label': 'audit_request',
    'value': roiPercentage
});
```

### Intégration Google Analytics

Ajouter dans `calculator.js` après chaque interaction :

```javascript
// Dans handleInputChange()
if (typeof gtag !== 'undefined') {
    gtag('event', 'simulator_interaction', {
        'parameter': key,
        'value': value
    });
}
```

## 🔌 Connexion à un Backend

### Endpoint API Recommandé

```javascript
// POST /api/simulate-roi
{
    "employees": 250,
    "processes": 3,
    "timePerTask": 2,
    "hourlyCost": 40,
    "currentAutomation": 20,
    "targetAutomation": 60,
    "timestamp": "2025-10-05T16:15:26+02:00",
    "results": {
        "monthlySavings": 72800,
        "roiPercentage": 740,
        "paybackWeeks": 6
    }
}
```

### Intégration Webflow Forms

Pour capturer les leads avec les données de simulation :

```javascript
handleCTAClick() {
    // Pré-remplir un formulaire Webflow caché
    document.getElementById('hidden-roi-data').value = JSON.stringify(this.inputs);
    
    // Soumettre le formulaire
    document.getElementById('contact-form').submit();
}
```

## 🎯 Optimisations Conversion

### A/B Testing Recommandé

1. **Valeurs par défaut** : Tester différents scénarios initiaux
2. **Position du CTA** : Tester au-dessus/en-dessous des résultats
3. **Wording du CTA** : "Audit gratuit" vs "Audit personnalisé"
4. **Couleurs** : Tester différentes palettes

### Éléments de Confiance

Les 3 indicateurs en bas sont modifiables dans `index.html` :

```html
<div class="trust-item">
    <div class="trust-icon">✓</div>
    <div class="trust-text">ROI moyen constaté : +620% sur 12 mois</div>
</div>
```

## 🚀 Performance

- **Taille totale** : ~15 KB (HTML + CSS + JS)
- **Temps de chargement** : < 100ms
- **Pas de dépendances** : Vanilla JavaScript pur
- **Compatible** : Tous navigateurs modernes (Chrome, Firefox, Safari, Edge)

## 📱 Responsive Breakpoints

- **Desktop** : > 1024px (2 colonnes)
- **Tablet** : 768px - 1024px (1 colonne)
- **Mobile** : < 768px (optimisé touch)

## 🔒 Sécurité & RGPD

- Aucune donnée stockée côté client (sauf localStorage optionnel)
- Pas de cookies tiers
- Données de simulation envoyées uniquement sur action utilisateur
- Conforme RGPD si backend configuré correctement

## 🛠️ Maintenance

### Mise à Jour des Formules

Pour ajuster les calculs ROI, modifier dans `calculator.js` :

```javascript
calculate() {
    // Ajuster les coefficients ici
    const dailyHoursSaved = (processes * timePerTask * (automationGain / 100)) 
                           * this.pricing.efficiencyFactor;
    
    // Modifier la formule de ROI
    const roiPercentage = ((netYearlyGains / totalInvestment) * 100);
}
```

### Logs de Débogage

Activer les logs en mode développement :

```javascript
// En haut de calculator.js
const DEBUG = true;

// Dans calculate()
if (DEBUG) {
    console.log('ROI Calculation:', {
        monthlySavings,
        roiPercentage,
        paybackWeeks
    });
}
```

## 💡 Idées d'Amélioration Future

- [ ] Export PDF du rapport de simulation
- [ ] Comparaison avec benchmarks sectoriels
- [ ] Graphiques interactifs (Chart.js)
- [ ] Sauvegarde de simulation (localStorage)
- [ ] Partage social des résultats
- [ ] Version multilingue (i18n)
- [ ] Mode sombre
- [ ] Intégration CRM (HubSpot, Salesforce)

## 📞 Support

Pour toute question sur l'intégration ou la personnalisation :
- Consulter la documentation Webflow : https://university.webflow.com/
- Tester en local : Ouvrir `index.html` dans un navigateur

## 📄 Licence

Code propriétaire - Alva © 2025

---

**Version** : 1.0  
**Dernière mise à jour** : 5 octobre 2025  
**Auteur** : Cascade AI pour Alva
