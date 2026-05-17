// src/ui.js
// Handles user interface components, menu systems, and event handling

import { gameState } from './game-state.js';
import { getShip, setKeyState, setTouchState, getTouchState } from './ship-physics.js';
import { togglePause, handleMenuSelection, handlePauseMenuSelection, handleTrainingLevelSelect, exitTrainingMode } from './game-flow.js';
import { getMaxLevelCount } from './level-manager.js';
import { isMobile } from "./device-detection.js";
import { getDisplayTime, isCountdownMode, isOvertime, formatTime } from './time-attack.js';
import { resetFireworks } from './renderer.js';
import { getSharedFrameTime } from './main.js';
export { isMobile };

// Comprehensive UI element caching for performance optimization
let uiElementCache = {
    timer: null,
    lives: null,
    fuelBar: null,
    targetPlatform: null,
    mobilePause: null
};

// Timer optimization: Track changes to reduce updates
let lastTimerText = '';
let lastTimerClass = '';
let lastTimerVisibility = null;

// Timer throttling: Update timer only 20fps instead of 60fps to improve performance
let lastTimerUpdate = 0;
const TIMER_UPDATE_INTERVAL = 50; // 50ms = 20fps

// UI state caching to reduce unnecessary updates
let lastLivesCount = -1;
let lastFuelPercent = -1;
let lastTargetText = '';

// Cache UI elements once to avoid repeated getElementById calls
function cacheUIElements() {
    if (!uiElementCache.timer) uiElementCache.timer = document.getElementById('timer');
    if (!uiElementCache.lives) uiElementCache.lives = document.getElementById('lives');
    if (!uiElementCache.fuelBar) uiElementCache.fuelBar = document.getElementById('fuel-bar');
    if (!uiElementCache.targetPlatform) uiElementCache.targetPlatform = document.getElementById('target-platform');
    if (!uiElementCache.mobilePause) uiElementCache.mobilePause = document.getElementById('mobile-pause');
}

// Menu state
export const menu = {
    currentScreen: 'main',
    selectedOption: 0,
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true, bounds: null },
        { id: 'timeattack', label: 'ZEITRENNEN', enabled: true, bounds: null },
        { id: 'training', label: 'TRAINING', enabled: true, bounds: null },
        { id: 'continue', label: 'FORTSETZEN', enabled: false, bounds: null }
    ]
};

// Level select menu state
export const levelSelectMenu = {
    selectedLevel: 1,
    scrollOffset: 0
};

// Pause menu state
export const pauseMenu = {
    selectedOption: 0,
    options: [
        { id: 'resume', label: 'FORTSETZEN', bounds: null },
        { id: 'restart', label: 'NEUSTART LEVEL', bounds: null },
        { id: 'mainmenu', label: 'HAUPTMENÜ', bounds: null }
    ]
};

// Update UI elements
export function updateUI() {
    // Cache UI elements on first call
    cacheUIElements();
    
    // Update timer for time attack mode (throttled to 20fps for better performance)
    const now = getSharedFrameTime();
    if (now - lastTimerUpdate >= TIMER_UPDATE_INTERVAL) {
        if (uiElementCache.timer) {
            const shouldShow = (gameState.mode === 'timeattack' && gameState.state === 'playing');
            
            if (shouldShow) {
                const displayTime = getDisplayTime();
                const timeText = formatTime(displayTime);
                
                // Build current text and class
                const currentText = isOvertime() 
                    ? `ZEIT: +${timeText}` 
                    : `ZEIT: ${timeText}`;
                    
                const currentClass = isOvertime() ? 'overtime' 
                    : isCountdownMode() ? 'countdown' 
                    : 'stopwatch';
                
                // Only update DOM when values actually change
                if (currentText !== lastTimerText) {
                    uiElementCache.timer.textContent = currentText;
                    lastTimerText = currentText;
                }
                
                if (currentClass !== lastTimerClass) {
                    uiElementCache.timer.className = currentClass;
                    lastTimerClass = currentClass;
                }
            }
            
            // Only update visibility when it changes
            if (shouldShow !== lastTimerVisibility) {
                uiElementCache.timer.style.display = shouldShow ? 'block' : 'none';
                lastTimerVisibility = shouldShow;
            }
        }
        
        lastTimerUpdate = now;
    }
    
    // Update lives (only when count changes)
    if (gameState.lives !== lastLivesCount && uiElementCache.lives) {
        uiElementCache.lives.innerHTML = '';
        for (let i = 0; i < gameState.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            uiElementCache.lives.appendChild(lifeIcon);
        }
        lastLivesCount = gameState.lives;
    }
    
    // Update fuel bar (only when percentage changes significantly)
    if (uiElementCache.fuelBar) {
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
    
    // Update target platform (only when text changes)
    const targetText = gameState.currentCargo ? `TARGET: ${gameState.currentCargo}` : 'TARGET: --';
    if (targetText !== lastTargetText && uiElementCache.targetPlatform) {
        uiElementCache.targetPlatform.textContent = targetText;
        lastTargetText = targetText;
    }
}

// Reset timer cache when switching modes to prevent stale values
export function resetTimerCache() {
    lastTimerText = '';
    lastTimerClass = '';
    lastTimerVisibility = null;
}

// Initialize menu
export function initMenu() {
    // Reset timer cache when returning to menu
    resetTimerCache();
    
    // Check for saved game state
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        const saveData = data ? JSON.parse(data) : null;
        menu.options[2].enabled = !!saveData;
    } catch (e) {
        console.error('Load failed:', e);
        menu.options[2].enabled = false;
    }
    
    // Set selected option to first enabled entry
    menu.selectedOption = menu.options.findIndex(o => o.enabled);
    if (menu.selectedOption === -1) menu.selectedOption = 0;
    
    // Show pause button on mobile devices
    if (isMobile) {
        const pauseButton = document.getElementById('mobile-pause');
        if (pauseButton) {
            pauseButton.style.display = 'block';
        }
    }
    
    gameState.state = 'menu';
    window.levelSelectBounds = [];
    resetFireworks();
}

// Handle keyboard events
export function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && 
            (gameState.state === 'playing' || gameState.state === 'paused')) {
            e.preventDefault();
            togglePause();
            return;
        }
        
        if (gameState.state === 'paused') {
            handlePauseMenuNavigation(e);
            return;
        }
        
        if (gameState.state === 'menu') {
            handleMenuNavigation(e);
            return;
        }
        
        if (gameState.state === 'levelselect') {
            handleLevelSelectNavigation(e);
            return;
        }
        
        if (gameState.state === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            initMenu();
            return;
        }
        
        if (gameState.state === 'gamewon' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            initMenu();
            return;
        }
        
        if (gameState.state === 'gamewon' && (e.key === 'n' || e.key === 'N')) {
            e.preventDefault();
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
            return;
        }
        
        // Ship controls
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setKeyState('left', true);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setKeyState('right', true);
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setKeyState('up', true);
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setKeyState('left', false);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setKeyState('right', false);
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setKeyState('up', false);
    });
}

// Handle menu navigation with keyboard
function handleMenuNavigation(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        const enabledIndices = menu.options
            .map((o, i) => o.enabled ? i : -1)
            .filter(i => i >= 0);
        const currentPos = enabledIndices.indexOf(menu.selectedOption);
        if (currentPos > 0) {
            menu.selectedOption = enabledIndices[currentPos - 1];
        }
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const enabledIndices = menu.options
            .map((o, i) => o.enabled ? i : -1)
            .filter(i => i >= 0);
        const currentPos = enabledIndices.indexOf(menu.selectedOption);
        if (currentPos < enabledIndices.length - 1) {
            menu.selectedOption = enabledIndices[currentPos + 1];
        }
    }
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMenuSelection();
    }
}

// Handle pause menu navigation with keyboard
function handlePauseMenuNavigation(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        pauseMenu.selectedOption = Math.max(0, pauseMenu.selectedOption - 1);
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        pauseMenu.selectedOption = Math.min(pauseMenu.options.length - 1, pauseMenu.selectedOption + 1);
    }
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePauseMenuSelection();
    }
}

// Handle level select navigation with keyboard
function handleLevelSelectNavigation(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        levelSelectMenu.selectedLevel = Math.max(1, levelSelectMenu.selectedLevel - 1);
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        levelSelectMenu.selectedLevel = Math.min(getMaxLevelCount(), levelSelectMenu.selectedLevel + 1);
    }
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLevelSelectSelection();
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        // Zurück zum Hauptmenü
        exitTrainingMode();
    }
}

// Handle level select selection
function handleLevelSelectSelection() {
    handleTrainingLevelSelect(levelSelectMenu.selectedLevel);
}

// Setup touch controls
export function setupTouchControls() {
    const canvas = document.getElementById('gameCanvas');
    const pauseButton = document.getElementById('mobile-pause');
    
    // Touch start handler
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        
        if (gameState.state === 'menu') {
            handleMenuTouch(e);
            return;
        }
        
        if (gameState.state === 'paused') {
            handlePauseMenuTouch(e);
            return;
        }
        
        if (gameState.state === 'levelselect') {
            handleLevelSelectTouch(e);
            return;
        }
        
        if (gameState.state === 'playing') {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            setTouchState(true, touch.clientX - rect.left, touch.clientY - rect.top);
        }
    });
    
    // Touch move handler
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (gameState.state === 'playing' && getTouchState().active) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            setTouchState(true, touch.clientX - rect.left, touch.clientY - rect.top);
        }
    });
    
    // Touch end handler
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTouchState(false);
    });
    
    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        setTouchState(false);
    });
    
    // Pause button handler
    if (pauseButton) {
        pauseButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (gameState.state === 'playing' || gameState.state === 'paused') {
                togglePause();
            } else if (gameState.state === 'gameover') {
                initMenu();
            }
        });
    }
}

// Handle menu touch events
function handleMenuTouch(e) {
    const canvas = document.getElementById('gameCanvas');
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const selectedOption = getMenuOptionAtPosition(touchX, touchY);
    if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
        menu.selectedOption = selectedOption;
        handleMenuSelection();
    }
}

// Handle pause menu touch events
function handlePauseMenuTouch(e) {
    const canvas = document.getElementById('gameCanvas');
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const selectedOption = getPauseMenuOptionAtPosition(touchX, touchY);
    if (selectedOption !== -1) {
        pauseMenu.selectedOption = selectedOption;
        handlePauseMenuSelection();
    }
}

// Handle level select touch events
function handleLevelSelectTouch(e) {
    const canvas = document.getElementById('gameCanvas');
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const selectedLevel = getLevelSelectOptionAtPosition(touchX, touchY);
    if (selectedLevel > 0) {
        levelSelectMenu.selectedLevel = selectedLevel;
        handleLevelSelectSelection();
    } else if (selectedLevel === -1) {
        // Zurück button
        exitTrainingMode();
    }
}

// Handle canvas click events
export function setupClickControls() {
    const canvas = document.getElementById('gameCanvas');
    
    canvas.addEventListener('click', (e) => {
        if (gameState.state === 'menu') {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const selectedOption = getMenuOptionAtPosition(clickX, clickY);
            if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
                menu.selectedOption = selectedOption;
                handleMenuSelection();
            }
            return;
        }
        
        if (gameState.state === 'paused') {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const selectedOption = getPauseMenuOptionAtPosition(clickX, clickY);
            if (selectedOption !== -1) {
                pauseMenu.selectedOption = selectedOption;
                handlePauseMenuSelection();
            }
            return;
        }
        
        if (gameState.state === 'levelselect') {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const selectedLevel = getLevelSelectOptionAtPosition(clickX, clickY);
            if (selectedLevel > 0) {
                levelSelectMenu.selectedLevel = selectedLevel;
                handleLevelSelectSelection();
            } else if (selectedLevel === -1) {
                // Zurück button
                exitTrainingMode();
            }
            return;
        }
        
        if (gameState.state === 'gamewon') {
            initMenu();
        }
    });
}

// Get menu option at position
function getMenuOptionAtPosition(x, y) {
    for (let i = 0; i < menu.options.length; i++) {
        const option = menu.options[i];
        if (option.bounds) {
            const b = option.bounds;
            if (x >= b.x && x <= b.x + b.width && 
                y >= b.y && y <= b.y + b.height) {
                return i;
            }
        }
    }
    return -1;
}

// Get pause menu option at position
function getPauseMenuOptionAtPosition(x, y) {
    for (let i = 0; i < pauseMenu.options.length; i++) {
        const option = pauseMenu.options[i];
        if (option.bounds) {
            const b = option.bounds;
            if (x >= b.x && x <= b.x + b.width && 
                y >= b.y && y <= b.y + b.height) {
                return i;
            }
        }
    }
    return -1;
}

// Get level select option at position
function getLevelSelectOptionAtPosition(x, y) {
    // This will be populated by the renderer when drawing level select
    if (typeof window.levelSelectBounds !== 'undefined') {
        for (let i = 0; i < window.levelSelectBounds.length; i++) {
            const bounds = window.levelSelectBounds[i];
            if (x >= bounds.x && x <= bounds.x + bounds.width && 
                y >= bounds.y && y <= bounds.y + bounds.height) {
                return bounds.level;
            }
        }
    }
    return 0; // No selection
}
