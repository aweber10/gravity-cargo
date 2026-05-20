// src/renderer.js
// Handles all rendering operations for the game

import { gameState, isShowLevelSelect } from './game-state.js';
import { getShip, getTouchState } from './ship-physics.js';
import { getWalls, getPlatforms, getMaxScore, getLevelTemplates, getCurrentLevel, getLevelBounds, shouldFitCurrentLevelToViewport, shouldUseSideScrollingForCurrentLevel } from './level-manager.js';
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
import { getCameraState, getSceneTransform, resetCamera, updateCamera, worldToScreen } from './camera.js';

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

const hudElements = {
    topBar: null,
    bottomBar: null,
    container: null
};

let domHUDLayoutDirty = true;
let lastDOMHUDLayout = {
    visible: null,
    left: null,
    right: null,
    top: null,
    bottom: null,
    placement: null
};
let lastAdaptiveHUDState = {
    insidePlayfield: null,
    shipNearHUD: null
};
let lastRenderedState = null;
let lastRenderedLevel = null;
let lastCanvasWidth = 0;
let lastCanvasHeight = 0;
let canvasEventsRegistered = false;

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

    markDOMHUDLayoutDirty();
    updateDOMHUDLayoutIfNeeded();
}

// Initialize canvas
export function initCanvas() {
    cacheDOMHUDElements();
    resizeCanvas();
    spaceStars = generateSpaceStars(isMobile);
    if (!canvasEventsRegistered) {
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('orientationchange', markDOMHUDLayoutDirty);
        canvasEventsRegistered = true;
    }
}

// Get canvas context
export function getCanvas() {
    return canvas;
}

export function getContext() {
    return ctx;
}

function getGameplayHUDLayout() {
    const sceneTransform = getCameraState();
    if (sceneTransform.active) {
        return createGameplayHUDLayout({
            left: 0,
            top: 0,
            right: canvas.width,
            bottom: canvas.height,
            width: canvas.width,
            height: canvas.height
        }, isMobile);
    }

    return createGameplayHUDLayout(getLevelBounds(), isMobile);
}

function getLevelScreenRect() {
    const sceneTransform = getCameraState();
    if (sceneTransform.active) {
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = hudElements.container
            ? hudElements.container.getBoundingClientRect()
            : { left: 0, top: 0 };

        return {
            left: canvasRect.left - containerRect.left,
            top: canvasRect.top - containerRect.top,
            right: canvasRect.left - containerRect.left + canvasRect.width,
            bottom: canvasRect.top - containerRect.top + canvasRect.height,
            width: canvasRect.width,
            height: canvasRect.height
        };
    }

    const bounds = getLevelBounds();
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = hudElements.container
        ? hudElements.container.getBoundingClientRect()
        : { left: 0, top: 0 };
    return createLevelScreenRect(bounds, canvasRect, containerRect, {
        width: canvas.width,
        height: canvas.height
    });
}

function cacheDOMHUDElements() {
    hudElements.topBar = document.getElementById('top-bar');
    hudElements.bottomBar = document.getElementById('bottom-bar');
    hudElements.container = document.getElementById('game-container');
}

function markDOMHUDLayoutDirty() {
    domHUDLayoutDirty = true;
}

function setStyleIfChanged(element, property, value) {
    if (element.style[property] !== value) {
        element.style[property] = value;
    }
}

function updateDOMHUDVisibility(topBar, bottomBar, visible) {
    const display = visible ? 'flex' : 'none';
    if (topBar) setStyleIfChanged(topBar, 'display', display);
    if (bottomBar) setStyleIfChanged(bottomBar, 'display', display);
}

function setClassIfChanged(element, className, enabled) {
    if (element.classList.contains(className) !== enabled) {
        element.classList.toggle(className, enabled);
    }
}

function updateDOMHUDLayoutIfNeeded() {
    const currentState = gameState.state;
    const currentLevel = gameState.level;
    const canvasSizeChanged = canvas.width !== lastCanvasWidth || canvas.height !== lastCanvasHeight;

    if (currentState !== lastRenderedState || currentLevel !== lastRenderedLevel || canvasSizeChanged) {
        domHUDLayoutDirty = true;
    }

    lastRenderedState = currentState;
    lastRenderedLevel = currentLevel;
    lastCanvasWidth = canvas.width;
    lastCanvasHeight = canvas.height;

    if (!domHUDLayoutDirty) return;

    updateDOMHUDLayout();
    domHUDLayoutDirty = false;
}

function updateDOMHUDLayout() {
    const { topBar, bottomBar } = hudElements;
    if (!topBar && !bottomBar) return;

    const showGameplayHUD = shouldRenderGameplayHUD(gameState);
    if (lastDOMHUDLayout.visible !== showGameplayHUD) {
        updateDOMHUDVisibility(topBar, bottomBar, showGameplayHUD);
        lastDOMHUDLayout.visible = showGameplayHUD;
    }
    if (!showGameplayHUD) {
        updateAdaptiveDOMHUDState(false, false);
        return;
    }

    const rect = getLevelScreenRect();
    const domHUDLayout = createDOMHUDLayout(rect, {
        width: window.innerWidth,
        height: window.innerHeight
    }, isMobile);

    const nextLayout = {
        left: `${domHUDLayout.left}px`,
        right: `${domHUDLayout.right}px`,
        bottom: domHUDLayout.bottom,
        top: `${domHUDLayout.top}px`,
        placement: domHUDLayout.placement
    };

    if (topBar) {
        if (lastDOMHUDLayout.left !== nextLayout.left) setStyleIfChanged(topBar, 'left', nextLayout.left);
        if (lastDOMHUDLayout.right !== nextLayout.right) setStyleIfChanged(topBar, 'right', nextLayout.right);
    }

    if (bottomBar) {
        if (lastDOMHUDLayout.left !== nextLayout.left) setStyleIfChanged(bottomBar, 'left', nextLayout.left);
        if (lastDOMHUDLayout.right !== nextLayout.right) setStyleIfChanged(bottomBar, 'right', nextLayout.right);
        if (lastDOMHUDLayout.bottom !== nextLayout.bottom) setStyleIfChanged(bottomBar, 'bottom', nextLayout.bottom);
        if (lastDOMHUDLayout.top !== nextLayout.top) setStyleIfChanged(bottomBar, 'top', nextLayout.top);
    }

    lastDOMHUDLayout = {
        visible: showGameplayHUD,
        ...nextLayout
    };

    updateAdaptiveDOMHUDForCurrentFrame();
}

function updateAdaptiveDOMHUDForCurrentFrame() {
    const insidePlayfield = shouldRenderGameplayHUD(gameState) &&
        lastDOMHUDLayout.placement === 'inside-top';
    const shipNearHUD = insidePlayfield && isShipNearTopHUD();
    updateAdaptiveDOMHUDState(insidePlayfield, shipNearHUD);
}

function updateAdaptiveDOMHUDState(insidePlayfield, shipNearHUD) {
    const { bottomBar } = hudElements;
    if (!bottomBar) return;

    if (lastAdaptiveHUDState.insidePlayfield !== insidePlayfield) {
        setClassIfChanged(bottomBar, 'hud-inside-playfield', insidePlayfield);
        lastAdaptiveHUDState.insidePlayfield = insidePlayfield;
    }

    if (lastAdaptiveHUDState.shipNearHUD !== shipNearHUD) {
        setClassIfChanged(bottomBar, 'ship-near-hud', shipNearHUD);
        lastAdaptiveHUDState.shipNearHUD = shipNearHUD;
    }
}

function isShipNearTopHUD() {
    const ship = getShip();
    const shipScreenPosition = worldToScreen(ship.x, ship.y, getSceneTransform());
    return shipScreenPosition.y < 150;
}

// Render game elements
export function render() {
    const currentLevel = getCurrentLevel();
    const isSpaceLevel = currentLevel && currentLevel.backgroundType === 'space';
    updateSceneCameraIfNeeded(currentLevel);
    updateDOMHUDLayoutIfNeeded();
    updateAdaptiveDOMHUDForCurrentFrame();

    renderBackgroundForCurrentLevel({ ctx, canvas, isSpaceLevel, spaceStars });
    if (renderBlockingScreenIfNeeded()) return;

    renderLevelScene(isSpaceLevel);
    renderPauseOverlayIfNeeded();
}

function updateSceneCameraIfNeeded(currentLevel) {
    if (!currentLevel || !shouldRenderLevelSceneForState()) {
        resetCamera();
        return;
    }

    updateCamera(getShip(), getLevelBounds(), canvas, getCameraModeForCurrentLevel());
}

function shouldRenderLevelSceneForState() {
    return gameState.state === 'playing' ||
        gameState.state === 'paused' ||
        gameState.state === 'exploding';
}

function getCameraModeForCurrentLevel() {
    if (shouldUseSideScrollingForCurrentLevel()) return 'side-scroll';
    if (shouldFitCurrentLevelToViewport()) return 'contain';
    return 'none';
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
        activeAsteroids: asteroidManager.getActiveAsteroids(),
        sceneTransform: getSceneTransform()
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
            touchState: getTouchState(),
            sceneTransform: getSceneTransform()
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
