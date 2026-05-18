// src/keyboard-controls.js
// Keyboard input and menu navigation

import { gameState } from './game-state.js';
import { setKeyState } from './ship-physics.js';
import { togglePause, handleMenuSelection, handlePauseMenuSelection, handleTrainingLevelSelect, exitTrainingMode } from './game-flow.js';
import { getMaxLevelCount } from './level-manager.js';
import { menu, pauseMenu, levelSelectMenu } from './ui-state.js';

export function setupKeyboardControls({ initMenu }) {
    document.addEventListener('keydown', (e) => {
        if (isPauseKey(e) && isPausableState()) {
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

        if (gameState.state === 'gameover' && isConfirmKey(e)) {
            e.preventDefault();
            initMenu();
            return;
        }

        if (gameState.state === 'gamewon' && isConfirmKey(e)) {
            e.preventDefault();
            initMenu();
            return;
        }

        if (gameState.state === 'gamewon' && isNewRunKey(e)) {
            e.preventDefault();
            gameState.level = 1;
            gameState.score = 0;
            gameState.lives = 3;
            try {
                localStorage.removeItem('gravityCargo_saveData');
            } catch (error) {
                console.error('Clear save failed:', error);
            }
            // Level initialization will be handled by the main game loop
            gameState.state = 'playing';
            return;
        }

        // Ship controls
        if (isLeftKey(e)) setKeyState('left', true);
        if (isRightKey(e)) setKeyState('right', true);
        if (isThrustKey(e)) setKeyState('up', true);
    });

    document.addEventListener('keyup', (e) => {
        if (isLeftKey(e)) setKeyState('left', false);
        if (isRightKey(e)) setKeyState('right', false);
        if (isThrustKey(e)) setKeyState('up', false);
    });
}

function handleMenuNavigation(e) {
    if (isUpKey(e)) {
        e.preventDefault();
        const enabledIndices = getEnabledMenuOptionIndices();
        const currentPos = enabledIndices.indexOf(menu.selectedOption);
        if (currentPos > 0) {
            menu.selectedOption = enabledIndices[currentPos - 1];
        }
    }
    if (isDownKey(e)) {
        e.preventDefault();
        const enabledIndices = getEnabledMenuOptionIndices();
        const currentPos = enabledIndices.indexOf(menu.selectedOption);
        if (currentPos < enabledIndices.length - 1) {
            menu.selectedOption = enabledIndices[currentPos + 1];
        }
    }
    if (isConfirmKey(e)) {
        e.preventDefault();
        handleMenuSelection();
    }
}

function handlePauseMenuNavigation(e) {
    if (isUpKey(e)) {
        e.preventDefault();
        pauseMenu.selectedOption = Math.max(0, pauseMenu.selectedOption - 1);
    }
    if (isDownKey(e)) {
        e.preventDefault();
        pauseMenu.selectedOption = Math.min(pauseMenu.options.length - 1, pauseMenu.selectedOption + 1);
    }
    if (isConfirmKey(e)) {
        e.preventDefault();
        handlePauseMenuSelection();
    }
}

function handleLevelSelectNavigation(e) {
    if (isUpKey(e)) {
        e.preventDefault();
        levelSelectMenu.selectedLevel = Math.max(1, levelSelectMenu.selectedLevel - 1);
    }
    if (isDownKey(e)) {
        e.preventDefault();
        levelSelectMenu.selectedLevel = Math.min(getMaxLevelCount(), levelSelectMenu.selectedLevel + 1);
    }
    if (isConfirmKey(e)) {
        e.preventDefault();
        handleLevelSelectSelection();
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        // Zurück zum Hauptmenü
        exitTrainingMode();
    }
}

function handleLevelSelectSelection() {
    handleTrainingLevelSelect(levelSelectMenu.selectedLevel);
}

function getEnabledMenuOptionIndices() {
    return menu.options
        .map((option, index) => option.enabled ? index : -1)
        .filter(index => index >= 0);
}

function isPausableState() {
    return gameState.state === 'playing' || gameState.state === 'paused';
}

function isPauseKey(e) {
    return e.key === 'Escape' || e.key === 'p' || e.key === 'P';
}

function isConfirmKey(e) {
    return e.key === 'Enter' || e.key === ' ';
}

function isNewRunKey(e) {
    return e.key === 'n' || e.key === 'N';
}

function isUpKey(e) {
    return e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W';
}

function isDownKey(e) {
    return e.key === 'ArrowDown' || e.key === 's' || e.key === 'S';
}

function isLeftKey(e) {
    return e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A';
}

function isRightKey(e) {
    return e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D';
}

function isThrustKey(e) {
    return e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W';
}
