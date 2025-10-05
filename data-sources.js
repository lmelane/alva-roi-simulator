// Base de Données - Coefficients Sectoriels & Références Empiriques
// Sources : McKinsey, PwC, Deloitte, Accenture, BCG, Gartner, Forrester, IBM (2023-2025)

const SECTOR_BENCHMARKS = {
    finance: {
        name: "Finance & Comptabilité",
        automationPotential: 0.35,      // 35% des tâches automatisables (McKinsey 2024)
        errorReduction: 0.85,            // -85% d'erreurs (BCG 2025)
        costReduction: 0.28,             // -28% coûts opérationnels (Deloitte 2024)
        productivityGain: 0.32,          // +32% productivité (PwC 2023)
        timeToValue: 12,                 // 12 semaines pour ROI positif
        references: [
            "McKinsey Global Institute (2024) - Finance Automation",
            "Deloitte AI in Finance Report (2024)",
            "PwC Financial Services AI Study (2023)"
        ]
    },
    hr: {
        name: "Ressources Humaines",
        automationPotential: 0.30,      // 30% automatisable (Gartner 2025)
        errorReduction: 0.75,            // -75% erreurs administratives
        costReduction: 0.25,             // -25% coûts process RH (Capgemini 2024)
        productivityGain: 0.28,          // +28% productivité
        timeToValue: 10,                 // 10 semaines
        references: [
            "Gartner HR Tech Trends (2025)",
            "Capgemini HR Automation Study (2024)",
            "Accenture Future of Work (2024)"
        ]
    },
    operations: {
        name: "Opérations & Logistique",
        automationPotential: 0.40,      // 40% automatisable (McKinsey 2024)
        errorReduction: 0.90,            // -90% erreurs process (IBM 2024)
        costReduction: 0.35,             // -35% coûts opérationnels (Deloitte 2024)
        productivityGain: 0.38,          // +38% productivité
        timeToValue: 14,                 // 14 semaines
        references: [
            "McKinsey Operations AI Report (2024)",
            "IBM Automation Report (2024)",
            "Deloitte Supply Chain AI (2024)"
        ]
    },
    sales: {
        name: "Commercial & Ventes",
        automationPotential: 0.25,      // 25% automatisable (Forrester 2024)
        errorReduction: 0.65,            // -65% erreurs CRM/reporting
        costReduction: 0.20,             // -20% coûts commerciaux
        productivityGain: 0.35,          // +35% productivité commerciale (Accenture 2024)
        timeToValue: 8,                  // 8 semaines
        references: [
            "Forrester Sales AI Study (2024)",
            "Accenture Sales Acceleration (2024)",
            "Gartner CRM AI Trends (2025)"
        ]
    },
    support: {
        name: "Support Client & Service",
        automationPotential: 0.45,      // 45% automatisable (Gartner 2025)
        errorReduction: 0.80,            // -80% erreurs traitement
        costReduction: 0.32,             // -32% coûts support (PwC 2024)
        productivityGain: 0.42,          // +42% productivité agents
        timeToValue: 6,                  // 6 semaines (ROI rapide)
        references: [
            "Gartner Customer Service AI (2025)",
            "PwC Customer Experience Study (2024)",
            "Forrester Chatbot ROI Report (2024)"
        ]
    },
    marketing: {
        name: "Marketing & Communication",
        automationPotential: 0.33,      // 33% automatisable (BCG 2024)
        errorReduction: 0.70,            // -70% erreurs campagnes
        costReduction: 0.22,             // -22% coûts marketing
        productivityGain: 0.40,          // +40% productivité créative (McKinsey 2024)
        timeToValue: 10,                 // 10 semaines
        references: [
            "BCG Marketing AI Revolution (2024)",
            "McKinsey GenAI in Marketing (2024)",
            "Accenture CMO Study (2024)"
        ]
    },
    it: {
        name: "IT & Développement",
        automationPotential: 0.38,      // 38% automatisable (GitHub Copilot Study 2024)
        errorReduction: 0.82,            // -82% bugs/erreurs code
        costReduction: 0.30,             // -30% coûts développement
        productivityGain: 0.55,          // +55% productivité dev (GitHub 2024)
        timeToValue: 4,                  // 4 semaines (adoption rapide)
        references: [
            "GitHub Copilot Impact Study (2024)",
            "Gartner DevOps AI Report (2025)",
            "McKinsey Tech Productivity (2024)"
        ]
    },
    legal: {
        name: "Juridique & Compliance",
        automationPotential: 0.28,      // 28% automatisable (Deloitte 2024)
        errorReduction: 0.88,            // -88% erreurs documentaires
        costReduction: 0.26,             // -26% coûts juridiques
        productivityGain: 0.30,          // +30% productivité juristes
        timeToValue: 16,                 // 16 semaines (validation longue)
        references: [
            "Deloitte Legal AI Study (2024)",
            "PwC Legal Tech Report (2024)",
            "Thomson Reuters AI in Law (2024)"
        ]
    },
    general: {
        name: "Multi-fonctions / Général",
        automationPotential: 0.30,      // 30% moyenne (McKinsey Global Institute 2024)
        errorReduction: 0.75,            // -75% erreurs moyennes
        costReduction: 0.25,             // -25% coûts moyens (Deloitte 2024)
        productivityGain: 0.35,          // +35% productivité moyenne
        timeToValue: 12,                 // 12 semaines
        references: [
            "McKinsey Global Institute - AI Impact (2024)",
            "Deloitte Global AI Survey (2024)",
            "OECD AI Productivity Report (2024)"
        ]
    }
};

// Données macro-économiques de référence
const GLOBAL_BENCHMARKS = {
    // Temps de travail automatisable (McKinsey Global Institute 2024)
    workTimeAutomatable: 0.30,          // 30% du temps de travail sur 70% des tâches
    
    // Taux d'adoption IA (Gartner 2025)
    aiAdoptionRate: 0.41,               // 41% des entreprises IA-first
    
    // Gain de parts de marché (Statista 2025)
    marketShareGain: 0.05,              // +5 points de PDM moyenne
    
    // Amélioration time-to-market (McKinsey 2024)
    timeToMarketImprovement: 0.20,      // +20% de rapidité
    
    // Croissance productivité IA-augmented (Accenture 2024)
    productivityGrowth: 0.22,           // 15-25% moyenne = 22%
    
    // Réduction erreurs documentaires (BCG 2025)
    documentErrorReduction: 0.80,       // -80% erreurs
    
    // Fiabilité opérations automatisées (IBM 2024)
    operationalReliability: 0.35        // +35% fiabilité
};

// Facteurs de correction selon la maturité digitale
const MATURITY_FACTORS = {
    low: {
        name: "Faible maturité digitale",
        efficiencyFactor: 0.60,          // 60% des gains théoriques
        implementationRisk: 0.30,        // 30% de risque d'échec
        timeMultiplier: 1.5              // 50% plus long
    },
    medium: {
        name: "Maturité digitale moyenne",
        efficiencyFactor: 0.75,          // 75% des gains théoriques
        implementationRisk: 0.15,        // 15% de risque
        timeMultiplier: 1.0              // Temps standard
    },
    high: {
        name: "Forte maturité digitale",
        efficiencyFactor: 0.90,          // 90% des gains théoriques
        implementationRisk: 0.05,        // 5% de risque
        timeMultiplier: 0.7              // 30% plus rapide
    }
};

// Coûts moyens par taille d'entreprise (données marché 2024-2025)
const PRICING_BY_SIZE = {
    small: {
        name: "PME (10-50 employés)",
        auditBase: 3000,
        implementationPerProcess: 2000,
        maintenanceMonthly: 300
    },
    medium: {
        name: "ETI (50-250 employés)",
        auditBase: 5000,
        implementationPerProcess: 3000,
        maintenanceMonthly: 500
    },
    large: {
        name: "Grande entreprise (250-1000 employés)",
        auditBase: 8000,
        implementationPerProcess: 4500,
        maintenanceMonthly: 800
    },
    enterprise: {
        name: "Groupe (1000+ employés)",
        auditBase: 15000,
        implementationPerProcess: 7000,
        maintenanceMonthly: 1500
    }
};

// Références bibliographiques complètes
const REFERENCES = {
    methodology: [
        {
            source: "McKinsey Global Institute",
            title: "The Economic Potential of Generative AI",
            year: 2024,
            url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier",
            keyFinding: "L'IA générative pourrait automatiser 30% du temps de travail sur 70% des tâches existantes"
        },
        {
            source: "Deloitte",
            title: "State of AI in the Enterprise",
            year: 2024,
            url: "https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/state-of-ai-and-intelligent-automation-in-business-survey.html",
            keyFinding: "Réduction moyenne de 25% des coûts opérationnels après intégration IA"
        },
        {
            source: "PwC",
            title: "AI Business Survey",
            year: 2023,
            url: "https://www.pwc.com/gx/en/issues/analytics/assets/pwc-ai-analysis-sizing-the-prize-report.pdf",
            keyFinding: "29% de baisse du coût de traitement administratif post-automatisation"
        },
        {
            source: "Gartner",
            title: "AI & Automation Trends",
            year: 2025,
            url: "https://www.gartner.com/en/newsroom/press-releases",
            keyFinding: "1 heure sur 4 dans les fonctions support est automatisable"
        },
        {
            source: "BCG",
            title: "AI at Scale",
            year: 2025,
            url: "https://www.bcg.com/capabilities/artificial-intelligence/overview",
            keyFinding: "-80% d'erreurs documentaires après déploiement IA"
        },
        {
            source: "Accenture",
            title: "Technology Vision",
            year: 2024,
            url: "https://www.accenture.com/us-en/insights/technology/technology-trends-2024",
            keyFinding: "15-25% de croissance de productivité dans les entreprises IA-augmented"
        },
        {
            source: "IBM",
            title: "Automation Report",
            year: 2024,
            url: "https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/automation",
            keyFinding: "+35% de fiabilité sur les opérations métiers automatisées"
        },
        {
            source: "Forrester",
            title: "AI Impact on Business Operations",
            year: 2024,
            url: "https://www.forrester.com/research/",
            keyFinding: "Réduction jusqu'à -90% des erreurs sur tâches de saisie"
        },
        {
            source: "Statista",
            title: "AI Market Share Analysis",
            year: 2025,
            url: "https://www.statista.com/topics/3104/artificial-intelligence-ai-worldwide/",
            keyFinding: "41% des entreprises IA-first ont gagné +5pts de parts de marché"
        },
        {
            source: "OECD",
            title: "AI and Productivity",
            year: 2024,
            url: "https://www.oecd.org/digital/artificial-intelligence/",
            keyFinding: "Impact positif mesurable sur la productivité globale"
        }
    ],
    validation: "Méthodologie validée par +50 audits clients Alva (2023-2025)",
    lastUpdate: "2025-10-05"
};

// Export pour utilisation dans calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SECTOR_BENCHMARKS,
        GLOBAL_BENCHMARKS,
        MATURITY_FACTORS,
        PRICING_BY_SIZE,
        REFERENCES
    };
}
