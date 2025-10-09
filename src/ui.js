// src/ui.js
// Handles user interface components, menu systems, and event handling

import { gameState } from './game-state.js';
import { getShip, setKeyState, setTouchState, getTouchState } from './ship-physics.js';
import { togglePause, handleMenuSelection, handlePauseMenuSelection } from './game-flow.js';

// Device detection
export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0);

// Menu state
export const menu = {
    currentScreen: 'main',
    selectedOption: 0,
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true, bounds: null },
        { id: 'continue', label: 'FORTSETZEN', enabled: false, bounds: null }
    ]
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
    // Update score
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `SCORE: ${gameState.score.toString().padStart(2, '0')}`;
    }
    
    // Update lives
    const livesContainer = document.getElementById('lives');
    if (livesContainer) {
        livesContainer.innerHTML = '';
        for (let i = 0; i < gameState.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            livesContainer.appendChild(lifeIcon);
        }
    }
    
    // Update fuel bar
    const fuelBar = document.getElementById('fuel-bar');
    if (fuelBar) {
        const fuelPercent = (gameState.fuel / gameState.maxFuel) * 100;
        fuelBar.style.width = fuelPercent + '%';
        
        fuelBar.classList.remove('low', 'critical');
        if (fuelPercent < 20) {
            fuelBar.classList.add('critical');
        } else if (fuelPercent < 50) {
            fuelBar.classList.add('low');
        }
    }
    
    // Update target platform
    const targetText = gameState.currentCargo ? `TARGET: ${gameState.currentCargo}` : 'TARGET: --';
    const targetElement = document.getElementById('target-platform');
    if (targetElement) {
        targetElement.textContent = targetText;
    }
}

// Initialize menu
export function initMenu() {
    // Check for saved game state
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        const saveData = data ? JSON.parse(data) : null;
        menu.options[1].enabled = !!saveData;
    } catch (e) {
        console.error('Load failed:', e);
        menu.options[1].enabled = false;
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
            }
        });
    }
}

// Handle menu touch events
function handleMenuTouch(e) {
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