// src/game-flow.js
// Handles game state transitions, menu systems, and high-level game flow

import { gameState } from './game-state.js';
import { initMenu as uiInitMenu } from './ui.js';
import { initCanvas } from './renderer.js';

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
    // Level initialization will be handled by the main game loop
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
    try {
        localStorage.removeItem('gravityCargo_saveData');
    } catch (e) {
        console.error('Clear save failed:', e);
    }
    // Level initialization will be handled by the main game loop
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
            // Level initialization will be handled by the main game loop
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
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // This will be handled by ui.js
}