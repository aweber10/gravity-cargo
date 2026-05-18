// src/renderer.js
// Handles all rendering operations for the game

import { gameState, isShowLevelSelect } from './game-state.js';
import { getShip, getTouchState } from './ship-physics.js';
import { getWalls, getPlatforms, getMaxScore, getLevelTemplates, getCurrentLevel, getLevelBounds } from './level-manager.js';
import { isMobile, menu, pauseMenu, levelSelectMenu } from './ui.js';
import { asteroidManager } from './asteroid-manager.js';
import { renderGameplayHUD, triggerScoreUpdate as triggerHUDScoreUpdate } from './hud-renderer.js';
import {
    renderGameOver,
    renderGameWon,
    renderLevelComplete,
    resetFireworks as resetEndScreenFireworks
} from './end-screen-renderer.js';
import {
    renderLevelSelect as renderLevelSelectScreen,
    renderMenu as renderMainMenu,
    renderPauseScreen as renderPauseMenuScreen
} from './menu-renderer.js';
import {
    generateSpaceStars,
    renderBackgroundForCurrentLevel,
    renderLevelScene as renderPlayableLevelScene,
    renderTouchIndicator
} from './scene-renderer.js';
import {
    createDOMHUDLayout,
    createGameplayHUDLayout,
    createLevelScreenRect,
    shouldRenderGameplayHUD
} from './renderer-layout.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function resetFireworks() {
    resetEndScreenFireworks();
}

// Trigger score re-render when score changes
export function triggerScoreUpdate() {
    triggerHUDScoreUpdate();
}

// Generate static star field for space levels
let spaceStars = [];

// Resize canvas based on device
export function resizeCanvas() {
    if (isMobile) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        const aspectRatio = 16 / 9;
        const maxWidth = Math.min(window.innerWidth * 0.95, 1280);
        const maxHeight = Math.min(window.innerHeight * 0.95, 720);
        
        if (maxWidth / maxHeight > aspectRatio) {
            canvas.height = maxHeight;
            canvas.width = maxHeight * aspectRatio;
        } else {
            canvas.width = maxWidth;
            canvas.height = maxWidth / aspectRatio;
        }
    }

    updateDOMHUDLayout();
}

// Initialize canvas
export function initCanvas() {
    resizeCanvas();
    spaceStars = generateSpaceStars(isMobile);
    window.addEventListener('resize', resizeCanvas);
}

// Get canvas context
export function getCanvas() {
    return canvas;
}

export function getContext() {
    return ctx;
}

function getGameplayHUDLayout() {
    return createGameplayHUDLayout(getLevelBounds(), isMobile);
}

function getLevelScreenRect() {
    const bounds = getLevelBounds();
    const canvasRect = canvas.getBoundingClientRect();
    const container = document.getElementById('game-container');
    const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
    return createLevelScreenRect(bounds, canvasRect, containerRect, {
        width: canvas.width,
        height: canvas.height
    });
}

function updateDOMHUDLayout() {
    const topBar = document.getElementById('top-bar');
    const bottomBar = document.getElementById('bottom-bar');
    if (!topBar && !bottomBar) return;

    const showGameplayHUD = shouldRenderGameplayHUD(gameState);
    if (topBar) {
        topBar.style.display = showGameplayHUD ? 'flex' : 'none';
    }
    if (bottomBar) {
        bottomBar.style.display = showGameplayHUD ? 'flex' : 'none';
    }
    if (!showGameplayHUD) return;

    const rect = getLevelScreenRect();
    const domHUDLayout = createDOMHUDLayout(rect, {
        width: window.innerWidth,
        height: window.innerHeight
    }, isMobile);

    if (topBar) {
        topBar.style.left = `${domHUDLayout.left}px`;
        topBar.style.right = `${domHUDLayout.right}px`;
    }

    if (bottomBar) {
        bottomBar.style.left = `${domHUDLayout.left}px`;
        bottomBar.style.right = `${domHUDLayout.right}px`;
        bottomBar.style.bottom = domHUDLayout.bottom;
        bottomBar.style.top = `${domHUDLayout.top}px`;
    }
}

// Render game elements
export function render() {
    const currentLevel = getCurrentLevel();
    const isSpaceLevel = currentLevel && currentLevel.backgroundType === 'space';
    updateDOMHUDLayout();

    renderBackgroundForCurrentLevel({ ctx, canvas, isSpaceLevel, spaceStars });
    if (renderBlockingScreenIfNeeded()) return;

    renderLevelScene(isSpaceLevel);
    renderPauseOverlayIfNeeded();
}

function renderBlockingScreenIfNeeded() {
    if (gameState.state === 'menu') {
        renderMainMenu({ ctx, canvas, isMobile, menu });
        return true;
    }

    if (gameState.state === 'levelselect' && isShowLevelSelect()) {
        renderLevelSelectScreen({
            ctx,
            canvas,
            isMobile,
            levelSelectMenu,
            levelTemplates: getLevelTemplates()
        });
        return true;
    }

    if (gameState.state === 'gamewon') {
        renderGameWon({ ctx, canvas, gameState, isMobile, maxScore: getMaxScore() });
        return true;
    }

    if (gameState.state === 'levelcomplete') {
        renderLevelComplete({
            ctx,
            canvas,
            gameState,
            isMobile,
            levelTemplates: getLevelTemplates()
        });
        return true;
    }

    if (gameState.state === 'gameover') {
        renderGameOver({ ctx, canvas, gameState, isMobile });
        return true;
    }

    return false;
}

function renderLevelScene(isSpaceLevel) {
    renderPlayableLevelScene({
        ctx,
        gameState,
        isSpaceLevel,
        walls: getWalls(),
        platforms: getPlatforms(),
        ship: getShip(),
        activeAsteroids: asteroidManager.getActiveAsteroids()
    });
    renderGameplayOverlay();
}

function renderGameplayOverlay() {
    // Render HUD elements during gameplay
    if (shouldRenderGameplayHUD(gameState)) {
        renderGameplayHUD({
            ctx,
            gameState,
            isMobile,
            hudLayout: getGameplayHUDLayout()
        });

        // Render touch indicator
        renderTouchIndicator({
            ctx,
            ship: getShip(),
            touchState: getTouchState()
        });
    }
}

function renderPauseOverlayIfNeeded() {
    // Render pause screen
    if (gameState.state === 'paused') {
        renderPauseMenuScreen({
            ctx,
            canvas,
            gameState,
            pauseMenu,
            levelTemplates: getLevelTemplates()
        });
    }
}
