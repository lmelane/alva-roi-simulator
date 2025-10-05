// Routes pour le simulateur ROI
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { SECTOR_BENCHMARKS, MATURITY_FACTORS, PRICING_BY_SIZE } = require('../data/benchmarks');

// ============================================
// POST /api/simulator/calculate
// Calcule le ROI basé sur les paramètres
// Calcul anonyme uniquement
// ============================================

router.post('/calculate', [
  // Validation des paramètres de simulation (obligatoires)
  body('sector').isIn(['general', 'finance', 'hr', 'operations', 'sales', 'support', 'marketing', 'it', 'legal']),
  body('employees').isInt({ min: 1, max: 10000 }),
  body('processes').isInt({ min: 1, max: 50 }),
  body('timePerTask').isFloat({ min: 0.1, max: 24 }),
  
  // Paramètres optionnels
  body('hourlyCost').optional().isFloat({ min: 10, max: 500 }),
  body('currentAutomation').optional().isInt({ min: 0, max: 100 }),
  body('targetAutomation').optional().isInt({ min: 0, max: 100 }),
  body('maturity').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const {
      sector,
      employees,
      processes,
      timePerTask
    } = req.body;

    // Auto-calculer les valeurs si non fournies
    let { hourlyCost, currentAutomation, targetAutomation, maturity } = req.body;

    if (!hourlyCost) {
      // Coût horaire selon secteur
      const hourlyCostBySector = {
        finance: 70,
        support: 35,
        operations: 50,
        it: 90,
        hr: 55,
        sales: 60,
        marketing: 55,
        legal: 120,
        general: 50
      };
      hourlyCost = hourlyCostBySector[sector] || 50;
    }

    if (!maturity) {
      // Maturité selon taille
      if (employees < 50) maturity = 'low';
      else if (employees >= 50 && employees < 250) maturity = 'medium';
      else maturity = 'high';
    }

    if (!currentAutomation) {
      currentAutomation = 15;
    }

    if (!targetAutomation) {
      const sectorData = SECTOR_BENCHMARKS[sector] || SECTOR_BENCHMARKS.general;
      targetAutomation = Math.round(sectorData.automationPotential * 100);
    }

    // Récupérer les benchmarks
    const sectorData = SECTOR_BENCHMARKS[sector] || SECTOR_BENCHMARKS.general;
    const maturityData = MATURITY_FACTORS[maturity] || MATURITY_FACTORS.medium;

    // Calculs ROI
    const automationGain = Math.max(0, targetAutomation - currentAutomation);
    const effectiveAutomationGain = Math.min(automationGain, sectorData.automationPotential * 100);
    const efficiencyFactor = maturityData.efficiencyFactor;

    // Heures économisées
    const dailyHoursSaved = (processes * timePerTask * (effectiveAutomationGain / 100)) * efficiencyFactor;
    const monthlyHoursSaved = dailyHoursSaved * 22;

    // Économies productivité
    const monthlySavings = monthlyHoursSaved * hourlyCost;

    // Réduction coûts opérationnels
    const monthlyProcessCost = processes * timePerTask * 22 * hourlyCost;
    const costReductionSavings = monthlyProcessCost * sectorData.costReduction * (effectiveAutomationGain / 100);

    // Total économies
    const totalMonthlySavings = monthlySavings + costReductionSavings;
    const yearlySavings = totalMonthlySavings * 12;

    // Investissement
    let sizeCategory = 'medium';
    if (employees < 50) sizeCategory = 'small';
    else if (employees >= 50 && employees < 250) sizeCategory = 'medium';
    else if (employees >= 250 && employees < 1000) sizeCategory = 'large';
    else sizeCategory = 'enterprise';

    const pricing = PRICING_BY_SIZE[sizeCategory];
    const implementationCost = pricing.auditBase + (processes * pricing.implementationPerProcess);
    const yearlyMaintenance = pricing.maintenanceMonthly * 12;
    const totalInvestment = implementationCost + yearlyMaintenance;

    // ROI
    const netYearlyGains = yearlySavings - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? ((netYearlyGains / totalInvestment) * 100) : 0;

    // Payback
    const basePaybackWeeks = totalMonthlySavings > 0 ? (implementationCost / totalMonthlySavings) * 4.33 : 0;
    const paybackWeeks = Math.ceil(basePaybackWeeks * maturityData.timeMultiplier);

    // Retourner les résultats complets
    res.json({
      success: true,
      data: {
        inputs: {
          sector,
          sectorName: sectorData.name,
          employees,
          processes,
          timePerTask,
          hourlyCost,
          currentAutomation,
          targetAutomation,
          maturity
        },
        results: {
          timeSaved: Math.round(monthlyHoursSaved),
          monthlySavings: Math.round(totalMonthlySavings),
          yearlySavings: Math.round(yearlySavings),
          roiPercentage: Math.round(roiPercentage),
          paybackWeeks,
          automationGain: Math.round(effectiveAutomationGain),
          dailyHours: dailyHoursSaved.toFixed(1),
          investment: Math.round(totalInvestment),
          netGains: Math.round(netYearlyGains),
          errorReduction: Math.round(sectorData.errorReduction * 100),
          productivityGain: Math.round(sectorData.productivityGain * 100)
        },
        metadata: {
          calculatedAt: new Date().toISOString(),
          sizeCategory,
          efficiencyFactor: maturityData.efficiencyFactor
        }
      }
    });

  } catch (error) {
    console.error('Erreur calcul ROI:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du calcul du ROI'
    });
  }
});

// ============================================
// GET /api/simulator/benchmarks
// Retourne les benchmarks sectoriels
// ============================================

router.get('/benchmarks', (req, res) => {
  res.json({
    success: true,
    data: {
      sectors: SECTOR_BENCHMARKS,
      maturityFactors: MATURITY_FACTORS,
      pricing: PRICING_BY_SIZE
    }
  });
});

// ============================================
// GET /api/simulator/sectors
// Liste des secteurs disponibles
// ============================================

router.get('/sectors', (req, res) => {
  const sectors = Object.keys(SECTOR_BENCHMARKS).map(key => ({
    id: key,
    name: SECTOR_BENCHMARKS[key].name,
    automationPotential: SECTOR_BENCHMARKS[key].automationPotential,
    productivityGain: SECTOR_BENCHMARKS[key].productivityGain
  }));

  res.json({
    success: true,
    data: sectors
  });
});

module.exports = router;
