# 🎯 Guide d'Intégration Webflow - Simulateur ROI IA

Guide pas à pas pour intégrer le simulateur dans votre landing page Webflow.

## 🚀 Méthode Rapide (5 minutes)

### Étape 1 : Préparer la Section

1. Ouvrir votre projet Webflow
2. Naviguer vers la page où vous souhaitez intégrer le simulateur
3. Ajouter une nouvelle **Section** (ou utiliser une existante)
4. Donner un nom à la section : `roi-simulator-section`

### Étape 2 : Ajouter le Code HTML

1. Dans la section, ajouter un élément **Embed** (icône `</>`)
2. Copier **tout le contenu** entre `<body>` et `</body>` du fichier `index.html`
3. Coller dans l'élément Embed
4. Cliquer sur "Save & Close"

### Étape 3 : Ajouter les Styles CSS

1. Cliquer sur l'icône **Settings** (⚙️) de la page
2. Aller dans l'onglet **Custom Code**
3. Dans **Head Code**, ajouter :

```html
<style>
/* Coller ICI tout le contenu de styles.css */
</style>
```

4. Sauvegarder

### Étape 4 : Ajouter le JavaScript

1. Toujours dans **Custom Code**
2. Dans **Before </body> tag**, ajouter :

```html
<script>
// Coller ICI tout le contenu de calculator.js
</script>
```

3. Sauvegarder

### Étape 5 : Publier

1. Cliquer sur **Publish** en haut à droite
2. Tester le simulateur sur votre site live
3. Vérifier que les sliders fonctionnent et que les calculs se mettent à jour

---

## 🎨 Méthode Avancée (Fichiers Externes)

Pour une meilleure organisation et réutilisation sur plusieurs pages.

### Étape 1 : Héberger les Fichiers

**Option A : GitHub Pages (Gratuit)**

1. Créer un repo GitHub public
2. Uploader `calculator.js` et `styles.css`
3. Activer GitHub Pages dans Settings
4. Récupérer les URLs :
   - `https://votre-username.github.io/repo-name/calculator.js`
   - `https://votre-username.github.io/repo-name/styles.css`

**Option B : Webflow Assets**

1. Dans Webflow, aller dans **Assets**
2. Uploader `calculator.js` (renommer en `.txt` si nécessaire)
3. Uploader `styles.css`
4. Copier les URLs générées

**Option C : CDN Cloudflare/jsDelivr**

Pour une performance optimale, utiliser un CDN.

### Étape 2 : Lier les Fichiers dans Webflow

1. **Page Settings** → **Custom Code** → **Head Code** :

```html
<link rel="stylesheet" href="https://VOTRE-URL/styles.css">
```

2. **Before </body> tag** :

```html
<script src="https://VOTRE-URL/calculator.js"></script>
```

### Étape 3 : Ajouter le HTML

1. Créer un élément **Embed**
2. Coller uniquement la structure HTML (sans `<head>` ni scripts)
3. Publier

---

## 🎯 Personnalisation Webflow

### Adapter aux Couleurs de Votre Marque

Dans `styles.css`, modifier les variables CSS :

```css
:root {
    --primary: #VOTRE_COULEUR_PRIMAIRE;
    --secondary: #VOTRE_COULEUR_SECONDAIRE;
    --accent: #VOTRE_COULEUR_ACCENT;
}
```

**Astuce Webflow** : Utiliser les couleurs de votre Style Guide Webflow.

### Utiliser les Fonts Webflow

Si vous utilisez des fonts personnalisées dans Webflow :

```css
:root {
    --font-sans: 'Votre Font Webflow', -apple-system, sans-serif;
}
```

### Ajuster l'Espacement

Pour matcher votre design system :

```css
:root {
    --spacing-xl: 3rem;  /* Ajuster selon votre grille */
    --spacing-lg: 2rem;
    --spacing-md: 1.5rem;
}
```

---

## 🔗 Connecter au Formulaire Webflow

### Méthode 1 : Redirection avec Paramètres

Dans `calculator.js`, modifier `handleCTAClick()` :

```javascript
handleCTAClick() {
    const params = new URLSearchParams({
        employees: this.inputs.employees,
        roi: Math.round(roiPercentage),
        savings: Math.round(monthlySavings)
    });
    
    // Rediriger vers votre page de contact Webflow
    window.location.href = `/contact?${params.toString()}`;
}
```

Puis dans votre formulaire Webflow, ajouter des champs cachés :

```html
<input type="hidden" name="employees" id="employees-hidden">
<input type="hidden" name="roi" id="roi-hidden">
<input type="hidden" name="savings" id="savings-hidden">
```

Et un script pour pré-remplir :

```javascript
// Sur la page de contact
const urlParams = new URLSearchParams(window.location.search);
document.getElementById('employees-hidden').value = urlParams.get('employees');
document.getElementById('roi-hidden').value = urlParams.get('roi');
document.getElementById('savings-hidden').value = urlParams.get('savings');
```

### Méthode 2 : Modal Webflow

1. Créer une modal avec un formulaire dans Webflow
2. Lui donner l'ID `contact-modal`
3. Dans `calculator.js` :

```javascript
handleCTAClick() {
    // Ouvrir la modal Webflow
    document.getElementById('contact-modal').style.display = 'flex';
    
    // Pré-remplir les champs
    document.getElementById('form-roi').value = this.calculateROI();
}
```

### Méthode 3 : Intégration Directe

Ajouter un formulaire Webflow directement dans le simulateur :

```html
<!-- Dans index.html, remplacer le bouton CTA par : -->
<form data-name="ROI Audit Request" name="roi-audit" class="cta-form">
    <input type="hidden" name="roi-data" id="roi-data">
    <input type="email" name="email" placeholder="Votre email" required>
    <button type="submit" class="cta-button">
        Recevoir mon audit personnalisé
    </button>
</form>
```

Et dans `calculator.js` :

```javascript
// Avant la soumission du formulaire
document.querySelector('form[name="roi-audit"]').addEventListener('submit', (e) => {
    document.getElementById('roi-data').value = JSON.stringify({
        ...this.inputs,
        results: this.getResults()
    });
});
```

---

## 📊 Tracking Analytics

### Google Analytics 4

Ajouter dans `calculator.js` :

```javascript
handleInputChange(key, value) {
    // ... code existant ...
    
    // Tracking GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'roi_simulator_interaction', {
            'parameter_name': key,
            'parameter_value': value,
            'event_category': 'engagement'
        });
    }
}

handleCTAClick() {
    // Tracking conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            'event_category': 'roi_simulator',
            'event_label': 'audit_request',
            'value': this.calculateROI()
        });
    }
    
    // ... reste du code ...
}
```

### Facebook Pixel

```javascript
handleCTAClick() {
    // Tracking FB Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'ROI Simulator',
            value: this.calculateROI(),
            currency: 'EUR'
        });
    }
}
```

### Webflow Analytics

Les interactions seront automatiquement trackées si vous utilisez Webflow Analytics.

---

## 🔧 Résolution de Problèmes

### Le simulateur ne s'affiche pas

**Vérifier :**
1. Le code est bien dans un élément **Embed**
2. Les styles CSS sont dans **Head Code**
3. Le JavaScript est dans **Before </body> tag**
4. Pas d'erreurs dans la console (F12)

**Solution :** Publier la page et vider le cache du navigateur (Cmd+Shift+R)

### Les sliders ne fonctionnent pas

**Cause probable :** Conflit avec un autre script Webflow

**Solution :**
```javascript
// Ajouter au début de calculator.js
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que Webflow soit chargé
    setTimeout(() => {
        new ROICalculator();
    }, 100);
});
```

### Les calculs ne se mettent pas à jour

**Vérifier :**
1. Les IDs des éléments HTML correspondent à ceux dans le JS
2. Pas d'erreurs JavaScript dans la console
3. Le script est bien chargé (vérifier dans l'onglet Network)

**Debug :**
```javascript
// Ajouter en haut de calculator.js
const DEBUG = true;

// Dans calculate()
if (DEBUG) console.log('Calculating ROI...', this.inputs);
```

### Problèmes de style

**Cause :** Conflit avec les styles Webflow

**Solution :** Ajouter `!important` aux styles critiques :

```css
.simulator-wrapper {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
}
```

Ou encapsuler dans un namespace :

```css
.roi-simulator-section .simulator-wrapper {
    /* styles */
}
```

---

## 📱 Optimisation Mobile

### Tester sur Mobile

1. Dans Webflow Designer, utiliser les breakpoints (icônes en haut)
2. Tester sur : Desktop → Tablet → Mobile Landscape → Mobile Portrait

### Ajustements Recommandés

Si le simulateur est trop compact sur mobile, ajouter dans `styles.css` :

```css
@media (max-width: 768px) {
    .simulator-form,
    .simulator-results {
        padding: 1rem !important;
    }
    
    .result-value {
        font-size: 1.5rem !important;
    }
    
    .form-group {
        margin-bottom: 1rem !important;
    }
}
```

---

## 🚀 Optimisations Performance

### Lazy Loading

Pour ne charger le simulateur que quand visible :

```javascript
// Ajouter avant new ROICalculator()
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            new ROICalculator();
            observer.disconnect();
        }
    });
});

observer.observe(document.querySelector('.simulator-wrapper'));
```

### Minification

Pour réduire la taille des fichiers :

1. Utiliser [CSS Minifier](https://cssminifier.com/) pour `styles.css`
2. Utiliser [JavaScript Minifier](https://javascript-minifier.com/) pour `calculator.js`
3. Remplacer les fichiers dans Webflow par les versions minifiées

---

## ✅ Checklist de Déploiement

- [ ] Code HTML ajouté dans un élément Embed
- [ ] CSS ajouté dans Head Code
- [ ] JavaScript ajouté dans Before </body> tag
- [ ] Couleurs adaptées à la marque
- [ ] Formule de prix personnalisée
- [ ] CTA connecté au formulaire/page de contact
- [ ] Tracking analytics configuré
- [ ] Testé sur Desktop
- [ ] Testé sur Tablet
- [ ] Testé sur Mobile
- [ ] Publié et testé en production
- [ ] Cache navigateur vidé pour test final

---

## 🎓 Ressources Webflow

- [Custom Code Guide](https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags)
- [Embed Element](https://university.webflow.com/lesson/embed-element)
- [Form Submissions](https://university.webflow.com/lesson/forms)
- [Webflow API](https://developers.webflow.com/)

---

**Besoin d'aide ?** Consultez la [documentation complète](README.md) ou testez en local avec `index.html`.
