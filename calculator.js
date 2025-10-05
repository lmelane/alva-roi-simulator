// AI ROI Calculator - Alva
// Version 2.0 - Avec données empiriques validées (McKinsey, PwC, Deloitte, etc.)

class ROICalculator {
    constructor() {
        this.inputs = {
            sector: 'general',
            employees: 250,
            processes: 3,
            timePerTask: 2,
            hourlyCost: 40,
            currentAutomation: 15,
            targetAutomation: 60,
            maturity: 'medium'
        };

        // Chargement des benchmarks sectoriels
        this.loadBenchmarks();
        
        // Pricing dynamique selon taille entreprise
        this.updatePricing();

        this.initializeInputs();
        this.attachEventListeners();
        this.calculate();
    }

    loadBenchmarks() {
        // Si data-sources.js est chargé, utiliser les données
        if (typeof SECTOR_BENCHMARKS !== 'undefined') {
            this.sectorBenchmarks = SECTOR_BENCHMARKS;
            this.globalBenchmarks = GLOBAL_BENCHMARKS;
            this.maturityFactors = MATURITY_FACTORS;
            this.pricingBySize = PRICING_BY_SIZE;
        } else {
            // Fallback avec données inline
            this.sectorBenchmarks = this.getDefaultBenchmarks();
            this.maturityFactors = this.getDefaultMaturityFactors();
            this.pricingBySize = this.getDefaultPricing();
        }
    }

    updatePricing() {
        const employees = this.inputs.employees;
        let sizeCategory = 'small';
        
        if (employees < 50) sizeCategory = 'small';
        else if (employees >= 50 && employees < 250) sizeCategory = 'medium';
        else if (employees >= 250 && employees < 1000) sizeCategory = 'large';
        else sizeCategory = 'enterprise';

        const pricing = this.pricingBySize?.[sizeCategory] || {
            auditBase: 5000,
            implementationPerProcess: 3000,
            maintenanceMonthly: 500
        };

        this.pricing = {
            ...pricing,
            sizeCategory: sizeCategory
        };
    }

    getDefaultBenchmarks() {
        return {
            general: {
                name: "Multi-fonctions / Général",
                automationPotential: 0.30,
                errorReduction: 0.75,
                costReduction: 0.25,
                productivityGain: 0.35,
                timeToValue: 12
            },
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
            }
        };
    }

    getDefaultMaturityFactors() {
        return {
            low: { efficiencyFactor: 0.60, timeMultiplier: 1.5 },
            medium: { efficiencyFactor: 0.75, timeMultiplier: 1.0 },
            high: { efficiencyFactor: 0.90, timeMultiplier: 0.7 }
        };
    }

    getDefaultPricing() {
        return {
            small: { auditBase: 3000, implementationPerProcess: 2000, maintenanceMonthly: 300 },
            medium: { auditBase: 5000, implementationPerProcess: 3000, maintenanceMonthly: 500 },
            large: { auditBase: 8000, implementationPerProcess: 4500, maintenanceMonthly: 800 },
            enterprise: { auditBase: 15000, implementationPerProcess: 7000, maintenanceMonthly: 1500 }
        };
    }

    initializeInputs() {
        // Sync all range inputs with their display values
        Object.keys(this.inputs).forEach(key => {
            const input = document.getElementById(key);
            const display = document.getElementById(`${key}-value`);
            
            if (input && display) {
                display.textContent = this.formatInputValue(key, input.value);
            }
        });
    }

    attachEventListeners() {
        // Listen to all range inputs
        Object.keys(this.inputs).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
                input.addEventListener(eventType, (e) => this.handleInputChange(key, e.target.value));
            }
        });

        // CTA Button
        const ctaButton = document.getElementById('ctaButton');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => this.handleCTAClick());
        }

        // Show methodology button
        const methodologyBtn = document.getElementById('showMethodology');
        if (methodologyBtn) {
            methodologyBtn.addEventListener('click', () => this.showMethodology());
        }
    }


    handleInputChange(key, value) {
        // Pour les selects (sector, maturity), garder la string
        if (key === 'sector' || key === 'maturity') {
            this.inputs[key] = value;
        } else {
            this.inputs[key] = parseFloat(value);
        }
        
        // Update display value
        const display = document.getElementById(`${key}-value`);
        if (display) {
            display.textContent = this.formatInputValue(key, value);
        }

        // Si changement d'employés, mettre à jour le pricing
        if (key === 'employees') {
            this.updatePricing();
        }

        // Recalculate ROI
        this.calculate();
    }

    formatInputValue(key, value) {
        if (key === 'sector' || key === 'maturity') {
            return value;
        }
        
        const val = parseFloat(value);
        
        switch(key) {
            case 'employees':
                return val.toLocaleString('fr-FR');
            case 'processes':
                return val;
            case 'timePerTask':
                return val.toFixed(1);
            case 'hourlyCost':
                return `${val}€`;
            case 'currentAutomation':
            case 'targetAutomation':
                return `${val}%`;
            default:
                return val;
        }
    }

    calculate() {
        const {
            sector,
            employees,
            processes,
            timePerTask,
            hourlyCost,
            currentAutomation,
            targetAutomation,
            maturity
        } = this.inputs;

        // Récupérer les benchmarks sectoriels
        const sectorData = this.sectorBenchmarks?.[sector] || this.sectorBenchmarks?.general;
        const maturityData = this.maturityFactors?.[maturity] || this.maturityFactors?.medium;

        // 1. Calcul du gain d'automatisation (ajusté par le potentiel sectoriel)
        const automationGain = Math.max(0, targetAutomation - currentAutomation);
        const effectiveAutomationGain = Math.min(automationGain, sectorData.automationPotential * 100);

        // 2. Facteur d'efficacité combiné (maturité × secteur)
        const efficiencyFactor = maturityData.efficiencyFactor;

        // 3. Heures économisées par jour (formule McKinsey)
        // Temps gagné = (Heures actuelles × % automatisation) × Facteur efficacité
        const dailyHoursSaved = (processes * timePerTask * (effectiveAutomationGain / 100)) * efficiencyFactor;

        // 4. Heures économisées par mois (22 jours ouvrés)
        const monthlyHoursSaved = dailyHoursSaved * 22;

        // 5. Économies mensuelles en € (productivité)
        const monthlySavings = monthlyHoursSaved * hourlyCost;

        // 6. Réduction des coûts opérationnels (Deloitte)
        // Coût process actuel estimé
        const monthlyProcessCost = processes * timePerTask * 22 * hourlyCost;
        const costReductionSavings = monthlyProcessCost * sectorData.costReduction * (effectiveAutomationGain / 100);

        // 7. Économies totales mensuelles (productivité + réduction coûts)
        const totalMonthlySavings = monthlySavings + costReductionSavings;

        // 8. Économies annuelles
        const yearlySavings = totalMonthlySavings * 12;

        // 9. Coût de l'investissement IA (dynamique selon taille)
        const implementationCost = this.pricing.auditBase + (processes * this.pricing.implementationPerProcess);
        const yearlyMaintenance = this.pricing.maintenanceMonthly * 12;
        const totalInvestment = implementationCost + yearlyMaintenance;

        // 10. Gains nets annuels
        const netYearlyGains = yearlySavings - totalInvestment;

        // 11. ROI en pourcentage (formule standard)
        // ROI = (Gains - Investissement) / Investissement × 100
        const roiPercentage = totalInvestment > 0 ? ((netYearlyGains / totalInvestment) * 100) : 0;

        // 12. Temps de retour sur investissement (en semaines)
        // Ajusté par le multiplicateur de maturité
        const basePaybackWeeks = totalMonthlySavings > 0 ? (implementationCost / totalMonthlySavings) * 4.33 : 0;
        const paybackWeeks = Math.ceil(basePaybackWeeks * maturityData.timeMultiplier);
        // 13. Métriques additionnelles
        const errorReductionPercent = Math.round(sectorData.errorReduction * 100);
        const productivityGainPercent = Math.round(sectorData.productivityGain * 100);

        // Stocker les résultats
        this.lastResults = {
            timeSaved: Math.round(monthlyHoursSaved),
            monthlySavings: Math.round(totalMonthlySavings),
            yearlySavings: Math.round(yearlySavings),
            roiPercentage: Math.round(roiPercentage),
            paybackWeeks: paybackWeeks,
            automationGain: Math.round(effectiveAutomationGain),
            dailyHours: dailyHoursSaved.toFixed(1),
            investment: Math.round(totalInvestment),
            netGains: Math.round(netYearlyGains),
            errorReduction: errorReductionPercent,
            productivityGain: productivityGainPercent,
            sectorName: sectorData.name
        };

        // Update UI with animations
        this.updateResults(this.lastResults);
    }

    updateResults(results) {
        // Animate numbers with counter effect
        this.animateValue('timeSaved', results.timeSaved, '', ' ');
        this.animateValue('monthlySavings', results.monthlySavings, '', ' €');
        this.animateValue('yearlySavings', results.yearlySavings, '', ' €');
        this.animateValue('roiPercentage', results.roiPercentage, '+', '%');
        
        // Direct updates for breakdown
        this.updateElement('paybackWeeks', results.paybackWeeks);
        this.updateElement('automationGain', `${results.automationGain}%`);
        this.updateElement('dailyHours', `${results.dailyHours}h`);
        this.updateElement('investment', `${results.investment.toLocaleString('fr-FR')} €`);
        this.updateElement('netGains', `${results.netGains.toLocaleString('fr-FR')} €`);

        // Métriques additionnelles
        this.updateElement('errorReduction', `${results.errorReduction}%`);
        this.updateElement('productivityGain', `${results.productivityGain}%`);
        this.updateElement('sectorName', results.sectorName);

        // Add visual feedback
        this.addPulseEffect();
    }

    animateValue(elementId, targetValue, prefix = '', suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 800; // ms
        const startValue = parseInt(element.textContent.replace(/[^0-9-]/g, '')) || 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuart)
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
            element.textContent = `${prefix}${currentValue.toLocaleString('fr-FR')}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    addPulseEffect() {
        const cards = document.querySelectorAll('.result-card');
        cards.forEach(card => {
            card.classList.remove('pulse');
            // Force reflow
            void card.offsetWidth;
            card.classList.add('pulse');
        });

        // Remove class after animation
        setTimeout(() => {
            cards.forEach(card => card.classList.remove('pulse'));
        }, 600);
    }

    showMethodology() {
        const modal = document.getElementById('methodologyModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    handleCTAClick() {
        // Collect simulation data with results
        const results = this.getLastResults();
        const simulationData = {
            ...this.inputs,
            results: results,
            timestamp: new Date().toISOString(),
            sector: this.sectorBenchmarks?.[this.inputs.sector]?.name || this.inputs.sector
        };

        // Log for analytics (replace with your tracking)
        console.log('CTA Clicked - Simulation Data:', simulationData);

        // Option 1: Redirect to contact form with pre-filled data
        const params = new URLSearchParams({
            sector: simulationData.sector,
            employees: simulationData.employees,
            roi: results?.roiPercentage || 0,
            savings: results?.yearlySavings || 0
        });
        // window.location.href = `/contact?${params.toString()}`;

        // Option 2: Open modal with form
        // this.openContactModal(simulationData);

        // Option 3: Send to your API/Webflow form
        // this.sendToAPI(simulationData);

        // For demo: just show alert
        alert(`🚀 Redirection vers le formulaire d'audit personnalisé...\n\nSecteur: ${simulationData.sector}\nROI estimé: +${results?.roiPercentage || 0}%\nÉconomies annuelles: ${(results?.yearlySavings || 0).toLocaleString('fr-FR')} €`);
    }

    getLastResults() {
        // Stocker les derniers résultats pour le CTA
        return this.lastResults || {};
    }

    // Optional: Send data to your backend
    async sendToAPI(data) {
        try {
            const response = await fetch('/api/simulate-roi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Simulation saved:', result);
            }
        } catch (error) {
            console.error('Error saving simulation:', error);
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
});

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ROICalculator;
}
