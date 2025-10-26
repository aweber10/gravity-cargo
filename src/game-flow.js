// src/game-flow.js
// Handles game state transitions, menu systems, and high-level game flow

import { gameState } from './game-state.js';
import { menu, pauseMenu, initMenu as uiInitMenu, setupKeyboardControls, setupTouchControls, setupClickControls } from './ui.js';
import { initCanvas } from './renderer.js';
import { initLevel } from './level-manager.js';
import { setShipPosition, setShipVelocity, setShipAngle, setShipSettling } from './ship-physics.js';

// Toggle pause state
export function togglePause() {
    if (gameState.state === 'playing') {
        gameState.state = 'paused';
    } else if (gameState.state === 'paused') {
        gameState.state = 'playing';
    }
}

// Handle pause menu selection
export function handlePauseMenuSelection() {
    const selectedOption = pauseMenu.options[pauseMenu.selectedOption];
    
    switch (selectedOption.id) {
        case 'resume':
            gameState.state = 'playing';
            break;
        case 'restart':
            restartLevel();
            break;
        case 'mainmenu':
            saveGameState();
            uiInitMenu();
            break;
    }
}

// Restart current level
export function restartLevel() {
    gameState.score = gameState.levelStartScore;
    gameState.lives = 3;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    
    // Re-initialize level and set ship position
    const startPos = initLevel();
    setShipPosition(startPos.x, startPos.y);
    setShipVelocity(0, 0);
    setShipAngle(startPos.angle);
    setShipSettling(false);
    
    gameState.state = 'playing';
}

// Handle menu selection
export function handleMenuSelection() {
    const selectedOption = menu.options[menu.selectedOption];
    
    if (!selectedOption.enabled) return;
    
    switch (selectedOption.id) {
        case 'newgame':
            startNewGame();
            break;
        case 'continue':
            continueGame();
            break;
    }
}

// Start a new game
export function startNewGame() {
    gameState.level = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.lastCompletedLevel = 0;
    try {
        localStorage.removeItem('gravityCargo_saveData');
    } catch (e) {
        console.error('Clear save failed:', e);
    }
    
    // Initialize level and set ship position
    const startPos = initLevel();
    setShipPosition(startPos.x, startPos.y);
    setShipVelocity(0, 0);
    setShipAngle(startPos.angle);
    setShipSettling(false);
    
    gameState.state = 'playing';
}

// Continue saved game
export function continueGame() {
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        const saveData = data ? JSON.parse(data) : null;
        if (saveData) {
            gameState.level = saveData.level;
            gameState.score = saveData.score;
            gameState.lastCompletedLevel = typeof saveData.lastCompletedLevel === 'number'
                ? saveData.lastCompletedLevel
                : Math.max(0, saveData.level - 1);
            
            // Initialize level and set ship position
            const startPos = initLevel();
            setShipPosition(startPos.x, startPos.y);
            setShipVelocity(0, 0);
            setShipAngle(startPos.angle);
            setShipSettling(false);
            
            gameState.state = 'playing';
        }
    } catch (e) {
        console.error('Load failed:', e);
    }
}

// Save game state
export function saveGameState() {
    try {
        const saveData = {
            level: gameState.level,
            score: gameState.score,
            lastCompletedLevel: gameState.lastCompletedLevel,
            timestamp: Date.now()
        };
        localStorage.setItem('gravityCargo_saveData', JSON.stringify(saveData));
        return true;
    } catch (e) {
        console.error('Save failed:', e);
        return false;
    }
}

// Initialize the game
export function initGame() {
    // Initialize canvas
    initCanvas();
    
    // Initialize UI
    uiInitMenu();
    
    // Setup event listeners
    setupKeyboardControls();
    setupTouchControls();
    setupClickControls();
}
