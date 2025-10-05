// Configuration API
const API_URL = 'https://alva-roi-simulator-production.up.railway.app';

// État de l'application
let calcTimeout = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    attachEventListeners();
    
    // Afficher des résultats par défaut immédiatement
    displayDefaultResults();
    
    // Puis calculer avec l'API
    calculateROI();
});

// Afficher des résultats par défaut
function displayDefaultResults() {
    // Résultats basés sur : Finance, 250 employés, 3 processus, 2h/jour
    const defaultResults = {
        roiPercentage: -16,
        yearlySavings: 26168,
        paybackWeeks: 30,
        timeSaved: 24,
        errorReduction: 85,
        productivityGain: 32
    };
    
    // Afficher immédiatement sans animation
    document.getElementById('result-roi').textContent = 
        (defaultResults.roiPercentage >= 0 ? '+' : '') + defaultResults.roiPercentage + '%';
    document.getElementById('result-savings').textContent = 
        defaultResults.yearlySavings.toLocaleString('fr-FR') + ' €';
    document.getElementById('result-payback').textContent = 
        defaultResults.paybackWeeks + ' sem';
    document.getElementById('result-time').textContent = 
        defaultResults.timeSaved + 'h';
    document.getElementById('result-errors').textContent = 
        '-' + defaultResults.errorReduction + '%';
    document.getElementById('result-productivity').textContent = 
        '+' + defaultResults.productivityGain + '%';
    
    // Afficher la section résultats
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.style.display = 'block';
}

// Initialiser les sliders avec affichage de valeur
function initializeSliders() {
    const sliders = ['employees', 'processes', 'timePerTask', 'hourlyCost', 'currentAutomation', 'targetAutomation'];
    
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        const display = document.getElementById(`${id}-value`);
        
        if (slider && display) {
            // Afficher la valeur initiale
            display.textContent = slider.value;
            
            // Mettre à jour lors du changement
            slider.addEventListener('input', (e) => {
                display.textContent = e.target.value;
            });
        }
    });
}

// Attacher les event listeners
function attachEventListeners() {
    const fields = [
        'sector',
        'employees',
        'processes',
        'timePerTask',
        'maturity',
        'hourlyCost',
        'currentAutomation',
        'targetAutomation'
    ];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const eventType = field.tagName === 'SELECT' ? 'change' : 'input';
            
            field.addEventListener(eventType, function() {
                // Debounce pour éviter trop d'appels API
                clearTimeout(calcTimeout);
                calcTimeout = setTimeout(() => {
                    calculateROI();
                }, 500);
            });
        }
    });
}

// Fonction principale de calcul
async function calculateROI() {
    // Récupérer les valeurs
    const sector = document.getElementById('sector').value;
    const employees = parseInt(document.getElementById('employees').value);
    const processes = parseInt(document.getElementById('processes').value);
    const timePerTask = parseFloat(document.getElementById('timePerTask').value);
    const maturity = document.getElementById('maturity').value;
    const hourlyCost = parseFloat(document.getElementById('hourlyCost').value);
    const currentAutomation = parseInt(document.getElementById('currentAutomation').value);
    const targetAutomation = parseInt(document.getElementById('targetAutomation').value);

    // Validation
    if (!sector || !employees || !processes || !timePerTask) {
        return;
    }

    // Afficher le loading
    showLoading();

    try {
        const response = await fetch(`${API_URL}/api/simulator/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sector,
                employees,
                processes,
                timePerTask,
                maturity,
                hourlyCost,
                currentAutomation,
                targetAutomation
            })
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.data.results);
        } else {
            showError('Erreur lors du calcul');
        }

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion à l\'API');
    } finally {
        hideLoading();
    }
}

// Afficher les résultats
function displayResults(results) {
    // Masquer erreur
    document.getElementById('error').style.display = 'none';

    // Afficher la grille de résultats
    document.getElementById('results-grid').style.display = 'grid';

    // Animer les valeurs
    animateValue('result-roi', results.roiPercentage, '%', results.roiPercentage >= 0 ? '+' : '');
    animateValue('result-savings', results.yearlySavings, ' €', '', true);
    animateValue('result-payback', results.paybackWeeks, ' sem');
    animateValue('result-time', results.timeSaved, 'h');
    animateValue('result-errors', results.errorReduction, '%', '-');
    animateValue('result-productivity', results.productivityGain, '%', '+');
}

// Animation des chiffres
function animateValue(elementId, targetValue, suffix = '', prefix = '', formatNumber = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const startValue = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuad = progress * (2 - progress);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuad);
        
        const displayValue = formatNumber 
            ? currentValue.toLocaleString('fr-FR') 
            : currentValue;
        
        element.textContent = prefix + displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Gestion du loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-grid').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('results-grid').style.display = 'none';
}
