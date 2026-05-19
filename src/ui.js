// src/ui.js
// Public facade for UI state, DOM updates, and input setup

import { gameState } from './game-state.js';
import { isMobile } from './device-detection.js';
import { resetFireworks } from './renderer.js';
import { setupKeyboardControls as setupKeyboardInput } from './keyboard-controls.js';
import { setupClickControls as setupClickInput, setupTouchControls as setupTouchInput } from './pointer-controls.js';
import { updateDOMUI, showMobilePauseButtonIfNeeded } from './ui-dom.js';
import { menu } from './ui-state.js';
import { resetMobileLevelMode } from './level-mode.js';

export { isMobile };
export { menu, pauseMenu, levelSelectMenu } from './ui-state.js';

export function updateUI() {
    updateDOMUI(gameState);
}

export function initMenu() {
    // Timer cache reset no longer needed (timer moved to Canvas)
    gameState.mode = 'normal';
    gameState.trainingMode = false;
    gameState.mobileDesktopLevelTestMode = false;
    gameState.scoreAttackMode = false;
    gameState.levelSelectMode = null;
    gameState.showLevelSelect = false;
    resetMobileLevelMode();

    // Check for saved game state
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        const saveData = data ? JSON.parse(data) : null;
        getMenuOption('continue').enabled = !!saveData;
    } catch (error) {
        console.error('Load failed:', error);
        getMenuOption('continue').enabled = false;
    }

    getMenuOption('scoreattack').visible = isMobile;
    getMenuOption('scoreattack').enabled = isMobile;

    // Set selected option to first enabled entry
    menu.selectedOption = menu.options.findIndex(option => option.enabled && option.visible !== false);
    if (menu.selectedOption === -1) menu.selectedOption = 0;

    showMobilePauseButtonIfNeeded(isMobile);

    gameState.state = 'menu';
    window.levelSelectBounds = [];
    resetFireworks();
}

function getMenuOption(id) {
    return menu.options.find(option => option.id === id);
}

export function setupKeyboardControls() {
    setupKeyboardInput({ initMenu });
}

export function setupTouchControls() {
    setupTouchInput({ initMenu });
}

export function setupClickControls() {
    setupClickInput({ initMenu });
}
