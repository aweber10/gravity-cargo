// src/ui-dom.js
// DOM-backed gameplay UI updates

let uiElementCache = {
    lives: null,
    fuelBar: null,
    targetPlatform: null,
    mobilePause: null
};

let lastLivesCount = -1;
let lastFuelPercent = -1;
let lastTargetText = '';

function cacheUIElements() {
    if (!uiElementCache.lives) uiElementCache.lives = document.getElementById('lives');
    if (!uiElementCache.fuelBar) uiElementCache.fuelBar = document.getElementById('fuel-bar');
    if (!uiElementCache.targetPlatform) uiElementCache.targetPlatform = document.getElementById('target-platform');
    if (!uiElementCache.mobilePause) uiElementCache.mobilePause = document.getElementById('mobile-pause');
}

export function updateDOMUI(gameState) {
    cacheUIElements();
    updateLives(gameState);
    updateFuelBar(gameState);
    updateTargetPlatform(gameState);
}

export function showMobilePauseButtonIfNeeded(isMobile) {
    if (!isMobile) return;

    cacheUIElements();
    if (uiElementCache.mobilePause) {
        uiElementCache.mobilePause.style.display = 'block';
    }
}

function updateLives(gameState) {
    if (gameState.lives !== lastLivesCount && uiElementCache.lives) {
        uiElementCache.lives.innerHTML = '';
        for (let i = 0; i < gameState.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            uiElementCache.lives.appendChild(lifeIcon);
        }
        lastLivesCount = gameState.lives;
    }
}

function updateFuelBar(gameState) {
    if (!uiElementCache.fuelBar) return;

    const fuelPercent = Math.round((gameState.fuel / gameState.maxFuel) * 100);
    if (fuelPercent !== lastFuelPercent) {
        uiElementCache.fuelBar.style.width = fuelPercent + '%';

        uiElementCache.fuelBar.classList.remove('low', 'critical');
        if (fuelPercent < 20) {
            uiElementCache.fuelBar.classList.add('critical');
        } else if (fuelPercent < 50) {
            uiElementCache.fuelBar.classList.add('low');
        }
        lastFuelPercent = fuelPercent;
    }
}

function updateTargetPlatform(gameState) {
    const targetText = gameState.currentCargo ? `TARGET: ${gameState.currentCargo}` : 'TARGET: --';
    if (targetText !== lastTargetText && uiElementCache.targetPlatform) {
        uiElementCache.targetPlatform.textContent = targetText;
        lastTargetText = targetText;
    }
}
