// src/level-manager.js
// Manages level loading, initialization, and progression

import { gameState } from './game-state.js';
import { PHYSICS } from './config.js?v=12';
import { levelTemplates as desktopLevels, calculateMaxScore } from './levels.js?v=12';
import { levelTemplates as mobileLevels } from './levels-mobile.js?v=12';
import { playSound } from './audio.js?v=12';
import { isMobile } from "./device-detection.js";

// Select appropriate level templates based on device
const levelTemplates = isMobile ? mobileLevels : desktopLevels;

// TODO: TESTPHASE - Nach Tests auf 'false' setzen um Level 11 nur durch normale Progression erreichbar zu machen
const LEVEL_11_TEST_MODE = true;

// Get maximum level count dynamically
export function getMaxLevelCount() {
    const baseCount = levelTemplates.length;
    
    // Console warning für aktiven Test-Modus
    if (LEVEL_11_TEST_MODE && baseCount > 10 && isMobile) {
        console.log('⚠️  LEVEL 11 TEST MODE AKTIV - Level 11 ist in Training verfügbar');
    }
    
    // Während Testphase: Level 11 in Training verfügbar
    // Nach Tests: Level 11 nur durch normale Progression erreichbar
    if (!LEVEL_11_TEST_MODE && baseCount > 10 && isMobile) {
        return 10; // Versteckt Level 11 aus Training-Menü (nur Mobile hat Level 11)
    }
    
    return baseCount;
}

// Current level data
let currentLevel = null;

// Exported functions
export function getCurrentLevel() {
    return currentLevel;
}

export function getLevelTemplates() {
    return levelTemplates;
}

export function isCurrentLevelComplete() {
    if (!currentLevel) return false;
    
    const totalCargo = currentLevel.platforms.filter(p => p.startingCargo !== null).length + gameState.deliveredCargo;
    return gameState.deliveredCargo >= totalCargo;
}

export function getMaxScore() {
    return calculateMaxScore();
}

export function initLevel() {
    const levelIndex = gameState.level - 1;
    if (levelIndex >= levelTemplates.length) {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelTemplates.length - 1]));
    } else {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelIndex]));
    }
    
    gameState.fuel = currentLevel.fuel;
    gameState.maxFuel = currentLevel.fuel;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.lives = 3;
    gameState.levelStartScore = gameState.score;
    
    const startPlatform = currentLevel.platforms.find(p => p.id === currentLevel.startPlatform);
    if (!startPlatform) {
        throw new Error(`Start platform ${currentLevel.startPlatform} not found in level ${gameState.level}`);
    }
    
    return {
        x: startPlatform.position[0] + startPlatform.width / 2,
        y: startPlatform.position[1] - 20,
        angle: 0
    };
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