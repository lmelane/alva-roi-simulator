// Benchmarks sectoriels - Identique à data-sources.js
// Pour utilisation côté serveur

const SECTOR_BENCHMARKS = {
    finance: {
        name: "Finance & Comptabilité",
        automationPotential: 0.35,
        errorReduction: 0.85,
        costReduction: 0.28,
        productivityGain: 0.32,
        timeToValue: 12
    },
    hr: {
        name: "Ressources Humaines",
        automationPotential: 0.30,
        errorReduction: 0.75,
        costReduction: 0.25,
        productivityGain: 0.28,
        timeToValue: 10
    },
    operations: {
        name: "Opérations & Logistique",
        automationPotential: 0.40,
        errorReduction: 0.90,
        costReduction: 0.35,
        productivityGain: 0.38,
        timeToValue: 14
    },
    sales: {
        name: "Commercial & Ventes",
        automationPotential: 0.25,
        errorReduction: 0.65,
        costReduction: 0.20,
        productivityGain: 0.35,
        timeToValue: 8
    },
    support: {
        name: "Support Client & Service",
        automationPotential: 0.45,
        errorReduction: 0.80,
        costReduction: 0.32,
        productivityGain: 0.42,
        timeToValue: 6
    },
    marketing: {
        name: "Marketing & Communication",
        automationPotential: 0.33,
        errorReduction: 0.70,
        costReduction: 0.22,
        productivityGain: 0.40,
        timeToValue: 10
    },
    it: {
        name: "IT & Développement",
        automationPotential: 0.38,
        errorReduction: 0.82,
        costReduction: 0.30,
        productivityGain: 0.55,
        timeToValue: 4
    },
    legal: {
        name: "Juridique & Compliance",
        automationPotential: 0.28,
        errorReduction: 0.88,
        costReduction: 0.26,
        productivityGain: 0.30,
        timeToValue: 16
    },
    general: {
        name: "Multi-fonctions / Général",
        automationPotential: 0.30,
        errorReduction: 0.75,
        costReduction: 0.25,
        productivityGain: 0.35,
        timeToValue: 12
    }
};

const MATURITY_FACTORS = {
    low: {
        name: "Faible maturité digitale",
        efficiencyFactor: 0.60,
        implementationRisk: 0.30,
        timeMultiplier: 1.5
    },
    medium: {
        name: "Maturité digitale moyenne",
        efficiencyFactor: 0.75,
        implementationRisk: 0.15,
        timeMultiplier: 1.0
    },
    high: {
        name: "Forte maturité digitale",
        efficiencyFactor: 0.90,
        implementationRisk: 0.05,
        timeMultiplier: 0.7
    }
};

const PRICING_BY_SIZE = {
    small: {
        name: "PME (1-50 employés)",
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

module.exports = {
    SECTOR_BENCHMARKS,
    MATURITY_FACTORS,
    PRICING_BY_SIZE
};
