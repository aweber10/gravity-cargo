// src/game-flow.js
// Handles game state transitions, menu systems, and high-level game flow

import { gameState, setGameMode } from './game-state.js';
import { menu, pauseMenu, levelSelectMenu, initMenu as uiInitMenu, setupKeyboardControls, setupTouchControls, setupClickControls } from './ui.js';
import { initCanvas } from './renderer.js';
import { initLevel, initSpecificLevel } from './level-manager.js';
import { setShipPosition, setShipVelocity, setShipAngle, setShipSettling } from './ship-physics.js';
import { activateTimeAttack, deactivateTimeAttack, startLevelTimer, resetCurrentRun, pauseTimer, resumeTimer } from './time-attack.js';
import { MOBILE_LEVEL_MODES, resetMobileLevelMode, setMobileLevelMode } from './level-mode.js';
import { finishScoreAttackRun, getNextScoreAttackLevel, isScoreAttackMode, startScoreAttackRun } from './score-attack.js';

// Toggle pause state
export function togglePause() {
    if (gameState.state === 'playing') {
        gameState.state = 'paused';
        if (gameState.mode === 'timeattack') {
            pauseTimer();
        }
    } else if (gameState.state === 'paused') {
        gameState.state = 'playing';
        if (gameState.mode === 'timeattack') {
            resumeTimer();
        }
    }
}

// Handle pause menu selection
export function handlePauseMenuSelection() {
    const selectedOption = pauseMenu.options[pauseMenu.selectedOption];
    
    switch (selectedOption.id) {
        case 'resume':
            gameState.state = 'playing';
            if (gameState.mode === 'timeattack') {
                resumeTimer();
            }
            break;
        case 'restart':
            if (!isScoreAttackMode(gameState)) {
                restartLevel();
            }
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
    
    // Restart timer for time attack mode
    if (gameState.mode === 'timeattack') {
        startLevelTimer(gameState.level);
    }
    
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
        case 'timeattack':
            startTimeAttack();
            break;
        case 'training':
            startTrainingMode();
            break;
        case 'mobile-desktop-levels':
            startMobileDesktopLevelTestMode();
            break;
        case 'scoreattack':
            startScoreAttack();
            break;
        case 'continue':
            continueGame();
            break;
    }
}

// Start a new game
export function startNewGame() {
    resetLevelSelectModes();
    resetMobileLevelMode();
    setGameMode('normal');
    gameState.scoreAttackMode = false;
    deactivateTimeAttack();
    // Timer cache reset no longer needed (timer moved to Canvas)
    
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

// Start time attack mode
export function startTimeAttack() {
    resetLevelSelectModes();
    resetMobileLevelMode();
    setGameMode('timeattack');
    gameState.scoreAttackMode = false;
    activateTimeAttack();
    // Timer cache reset no longer needed (timer moved to Canvas)
    
    gameState.level = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.lastCompletedLevel = 0;
    
    // Initialize level and set ship position
    const startPos = initLevel();
    setShipPosition(startPos.x, startPos.y);
    setShipVelocity(0, 0);
    setShipAngle(startPos.angle);
    setShipSettling(false);
    
    // Start timer for first level
    startLevelTimer(gameState.level);
    
    gameState.state = 'playing';
}

// Continue saved game
export function continueGame() {
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        const saveData = data ? JSON.parse(data) : null;
        if (saveData) {
            setGameMode('normal');
            gameState.scoreAttackMode = false;
            resetLevelSelectModes();
            resetMobileLevelMode();
            deactivateTimeAttack();
            // Timer cache reset no longer needed (timer moved to Canvas)
            
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
    if (gameState.mobileDesktopLevelTestMode || isScoreAttackMode(gameState)) {
        return false;
    }

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

// Training mode functions
export function startTrainingMode() {
    resetMobileLevelMode();
    setGameMode('training');
    deactivateTimeAttack();
    // Timer cache reset no longer needed (timer moved to Canvas)
    
    gameState.state = 'levelselect';
    gameState.trainingMode = true;
    gameState.mobileDesktopLevelTestMode = false;
    gameState.scoreAttackMode = false;
    gameState.levelSelectMode = 'training';
    gameState.showLevelSelect = true;
    resetLevelSelectMenu();
}

export function startMobileDesktopLevelTestMode() {
    setMobileLevelMode(MOBILE_LEVEL_MODES.DESKTOP_SCROLL);
    setGameMode('normal');
    deactivateTimeAttack();

    gameState.state = 'levelselect';
    gameState.trainingMode = false;
    gameState.mobileDesktopLevelTestMode = true;
    gameState.scoreAttackMode = false;
    gameState.levelSelectMode = 'mobile-desktop';
    gameState.showLevelSelect = true;
    resetLevelSelectMenu();
}

export function startScoreAttack() {
    resetMobileLevelMode();
    resetLevelSelectModes();
    setGameMode('scoreattack');
    deactivateTimeAttack();
    startScoreAttackRun();

    gameState.scoreAttackMode = true;
    gameState.level = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.lastCompletedLevel = 0;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.lastLandedPlatform = null;
    gameState.particles = [];

    startNextScoreAttackLevel();
}

export function startNextScoreAttackLevel() {
    const nextLevel = getNextScoreAttackLevel();
    const startPos = initSpecificLevel(nextLevel, { preserveLives: true });
    setShipPosition(startPos.x, startPos.y);
    setShipVelocity(0, 0);
    setShipAngle(startPos.angle);
    setShipSettling(false);

    gameState.state = 'playing';
}

export function finishScoreAttack() {
    finishScoreAttackRun(gameState.score);
    gameState.state = 'gameover';
}

export function handleLevelSelect(levelNumber) {
    if (gameState.levelSelectMode === 'mobile-desktop') {
        handleMobileDesktopLevelSelect(levelNumber);
        return;
    }

    handleTrainingLevelSelect(levelNumber);
}

export function handleTrainingLevelSelect(levelNumber) {
    // Set training mode state
    gameState.trainingMode = true;
    gameState.mobileDesktopLevelTestMode = false;
    gameState.scoreAttackMode = false;
    gameState.levelSelectMode = 'training';
    gameState.trainingLevel = levelNumber;
    gameState.level = levelNumber;
    gameState.lives = 1; // Only one life in training
    gameState.score = 0; // Reset score for training
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.lastLandedPlatform = null;
    gameState.particles = [];
    gameState.showLevelSelect = false; // Reset level select when starting a level
    
    // Initialize level and set ship position
    const startPos = initLevel();
    setShipPosition(startPos.x, startPos.y);
    setShipVelocity(0, 0);
    setShipAngle(startPos.angle);
    setShipSettling(false);
    
    gameState.state = 'playing';
}

function handleMobileDesktopLevelSelect(levelNumber) {
    gameState.trainingMode = false;
    gameState.mobileDesktopLevelTestMode = true;
    gameState.scoreAttackMode = false;
    gameState.levelSelectMode = 'mobile-desktop';
    gameState.level = levelNumber;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.lastLandedPlatform = null;
    gameState.particles = [];
    gameState.showLevelSelect = false;
    gameState.lastCompletedLevel = 0;

    const startPos = initLevel();
    setShipPosition(startPos.x, startPos.y);
    setShipVelocity(0, 0);
    setShipAngle(startPos.angle);
    setShipSettling(false);

    gameState.state = 'playing';
}

export function exitTrainingMode() {
    exitLevelSelectMode();
}

export function exitLevelSelectMode() {
    // Reset training mode completely
    gameState.trainingMode = false;
    gameState.mobileDesktopLevelTestMode = false;
    gameState.scoreAttackMode = false;
    gameState.trainingLevel = 1;
    gameState.levelSelectMode = null;
    gameState.showLevelSelect = false;
    resetMobileLevelMode();
    
    // Reset level to avoid confusion with normal game
    gameState.level = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.particles = [];
    
    // Return to main menu
    uiInitMenu();
}

function resetLevelSelectModes() {
    gameState.trainingMode = false;
    gameState.mobileDesktopLevelTestMode = false;
    gameState.scoreAttackMode = false;
    gameState.levelSelectMode = null;
    gameState.showLevelSelect = false;
}

function resetLevelSelectMenu() {
    levelSelectMenu.selectedLevel = 1;
    levelSelectMenu.scrollOffset = 0;
}
