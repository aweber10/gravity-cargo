// src/pointer-controls.js
// Touch and click handling for canvas-rendered controls

import { gameState } from './game-state.js';
import { setTouchState, getTouchState } from './ship-physics.js';
import { screenToWorld } from './camera.js';
import { togglePause, handleMenuSelection, handlePauseMenuSelection, handleLevelSelect, exitLevelSelectMode } from './game-flow.js';
import { menu, pauseMenu, levelSelectMenu } from './ui-state.js';
import {
    getLevelSelectOptionAtPosition,
    getMenuOptionAtPosition,
    getPauseMenuOptionAtPosition
} from './ui-hit-testing.js';

export function setupTouchControls({ initMenu }) {
    const canvas = document.getElementById('gameCanvas');
    const pauseButton = document.getElementById('mobile-pause');

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();

        if (gameState.state === 'menu') {
            handleMenuTouch(e, canvas);
            return;
        }

        if (gameState.state === 'paused') {
            handlePauseMenuTouch(e, canvas);
            return;
        }

        if (gameState.state === 'levelselect') {
            handleLevelSelectTouch(e, canvas);
            return;
        }

        if (gameState.state === 'playing') {
            const touchPosition = getGameplayTouchPosition(e, canvas);
            setTouchState(true, touchPosition.x, touchPosition.y);
        }
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();

        if (gameState.state === 'playing' && getTouchState().active) {
            const touchPosition = getGameplayTouchPosition(e, canvas);
            setTouchState(true, touchPosition.x, touchPosition.y);
        }
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTouchState(false);
    });

    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        setTouchState(false);
    });

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

export function setupClickControls({ initMenu }) {
    const canvas = document.getElementById('gameCanvas');

    canvas.addEventListener('click', (e) => {
        if (gameState.state === 'menu') {
            handleMenuClick(e, canvas);
            return;
        }

        if (gameState.state === 'paused') {
            handlePauseMenuClick(e, canvas);
            return;
        }

        if (gameState.state === 'levelselect') {
            handleLevelSelectClick(e, canvas);
            return;
        }

        if (gameState.state === 'gamewon') {
            initMenu();
        }
    });
}

function handleMenuTouch(e, canvas) {
    const touchPosition = getTouchPosition(e, canvas);
    selectMenuOptionAtPosition(touchPosition.x, touchPosition.y);
}

function handlePauseMenuTouch(e, canvas) {
    const touchPosition = getTouchPosition(e, canvas);
    selectPauseMenuOptionAtPosition(touchPosition.x, touchPosition.y);
}

function handleLevelSelectTouch(e, canvas) {
    const touchPosition = getTouchPosition(e, canvas);
    selectLevelAtPosition(touchPosition.x, touchPosition.y);
}

function handleMenuClick(e, canvas) {
    const clickPosition = getPointerPosition(e, canvas);
    selectMenuOptionAtPosition(clickPosition.x, clickPosition.y);
}

function handlePauseMenuClick(e, canvas) {
    const clickPosition = getPointerPosition(e, canvas);
    selectPauseMenuOptionAtPosition(clickPosition.x, clickPosition.y);
}

function handleLevelSelectClick(e, canvas) {
    const clickPosition = getPointerPosition(e, canvas);
    selectLevelAtPosition(clickPosition.x, clickPosition.y);
}

function selectMenuOptionAtPosition(x, y) {
    const selectedOption = getMenuOptionAtPosition(menu, x, y);
    if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
        menu.selectedOption = selectedOption;
        handleMenuSelection();
    }
}

function selectPauseMenuOptionAtPosition(x, y) {
    const selectedOption = getPauseMenuOptionAtPosition(pauseMenu, x, y);
    if (selectedOption !== -1) {
        pauseMenu.selectedOption = selectedOption;
        handlePauseMenuSelection();
    }
}

function selectLevelAtPosition(x, y) {
    const selectedLevel = getLevelSelectOptionAtPosition(x, y);
    if (selectedLevel > 0) {
        levelSelectMenu.selectedLevel = selectedLevel;
        handleLevelSelect(levelSelectMenu.selectedLevel);
    } else if (selectedLevel === -1) {
        // Zurück button
        exitLevelSelectMode();
    }
}

function getTouchPosition(e, canvas) {
    const touch = e.touches[0];
    return getClientPosition(touch, canvas);
}

function getGameplayTouchPosition(e, canvas) {
    const screenPosition = getTouchPosition(e, canvas);
    return screenToWorld(screenPosition.x, screenPosition.y);
}

function getPointerPosition(e, canvas) {
    return getClientPosition(e, canvas);
}

function getClientPosition(source, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: source.clientX - rect.left,
        y: source.clientY - rect.top
    };
}
