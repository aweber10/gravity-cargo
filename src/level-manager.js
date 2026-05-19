// src/level-manager.js
// Manages level loading, initialization, and progression

import { gameState } from './game-state.js';
import { PHYSICS } from './config.js?v=12';
import { levelTemplates as desktopLevels, calculateMaxScore as calculateDesktopMaxScore } from './levels.js?v=12';
import { levelTemplates as mobileLevels, calculateMaxScore as calculateMobileMaxScore } from './levels-mobile.js?v=12';
import { playSound } from './audio.js?v=12';
import { isMobile } from "./device-detection.js";
import { asteroidManager } from './asteroid-manager.js';
import { calculateLevelBounds } from './level-bounds.js';
import { isMobileDesktopScrollMode } from './level-mode.js';

const LEVEL_SOURCES = {
    DESKTOP: 'desktop',
    MOBILE: 'mobile'
};

// Get maximum level count dynamically
export function getMaxLevelCount() {
    return getLevelTemplates().length;
}

// Current level data
let currentLevel = null;
let currentLevelSource = null;

// Exported functions
export function getCurrentLevel() {
    return currentLevel;
}

export function getCurrentLevelSource() {
    return currentLevelSource;
}

export function getLevelBounds() {
    return calculateLevelBounds(currentLevel, shouldUseMobileLevelFallback());
}

export function getLevelTemplates() {
    return getActiveLevelTemplates();
}

export function isCurrentLevelComplete() {
    if (!currentLevel) return false;
    
    const totalCargo = currentLevel.platforms.filter(p => p.startingCargo !== null).length + gameState.deliveredCargo;
    return gameState.deliveredCargo >= totalCargo;
}

export function getMaxScore() {
    return shouldUseMobileLevels() ? calculateMobileMaxScore() : calculateDesktopMaxScore();
}

export function initLevel(options = {}) {
    const levelIndex = gameState.level - 1;
    const levelTemplates = getLevelTemplates();
    currentLevelSource = shouldUseMobileLevels() ? LEVEL_SOURCES.MOBILE : LEVEL_SOURCES.DESKTOP;
    if (levelIndex >= levelTemplates.length) {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelTemplates.length - 1]));
    } else {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelIndex]));
    }

    return initializeCurrentLevel(options);
}

export function initSpecificLevel(levelEntry, options = {}) {
    const levelTemplates = getLevelTemplatesForSource(levelEntry.source);
    const template = levelTemplates.find(level => level.levelNumber === levelEntry.levelNumber);
    if (!template) {
        throw new Error(`Level ${levelEntry.source}:${levelEntry.levelNumber} not found`);
    }

    currentLevelSource = levelEntry.source;
    currentLevel = JSON.parse(JSON.stringify(template));
    gameState.level = currentLevel.levelNumber;

    return initializeCurrentLevel(options);
}

export function getStartPlatformId() {
    if (!currentLevel) return null;
    return currentLevel.startPlatform;
}

export function getPlatformById(id) {
    if (!currentLevel) return null;
    return currentLevel.platforms.find(p => p.id === id);
}

export function getWalls() {
    if (!currentLevel) return [];
    return currentLevel.walls;
}

export function getPlatforms() {
    if (!currentLevel) return [];
    return currentLevel.platforms;
}

export function getFuel() {
    return currentLevel ? currentLevel.fuel : 100;
}

export function getGravity() {
    return currentLevel ? currentLevel.gravity : PHYSICS.gravity;
}

export function getScrollDirection() {
    return currentLevel ? currentLevel.scrollDirection : null;
}

export function shouldUseSideScrollingForCurrentLevel() {
    return isMobile && currentLevelSource === LEVEL_SOURCES.DESKTOP;
}

function initializeCurrentLevel({ preserveLives = false } = {}) {
    gameState.fuel = currentLevel.fuel;
    gameState.maxFuel = currentLevel.fuel;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    if (!preserveLives) {
        gameState.lives = 3;
    }
    gameState.levelStartScore = gameState.score;

    asteroidManager.initLevel(currentLevel, getLevelBounds());

    const startPlatform = currentLevel.platforms.find(p => p.id === currentLevel.startPlatform);
    if (!startPlatform) {
        throw new Error(`Start platform ${currentLevel.startPlatform} not found in level ${gameState.level}`);
    }

    gameState.lastLandedPlatform = startPlatform.id;

    return {
        x: startPlatform.position[0] + startPlatform.width / 2,
        y: startPlatform.position[1] - 20,
        angle: 0
    };
}

function getActiveLevelTemplates() {
    return shouldUseMobileLevels() ? mobileLevels : desktopLevels;
}

function getLevelTemplatesForSource(source) {
    return source === LEVEL_SOURCES.MOBILE ? mobileLevels : desktopLevels;
}

function shouldUseMobileLevels() {
    return isMobile && !isMobileDesktopScrollMode(isMobile);
}

function shouldUseMobileLevelFallback() {
    if (currentLevelSource) {
        return currentLevelSource === LEVEL_SOURCES.MOBILE;
    }
    return shouldUseMobileLevels();
}
