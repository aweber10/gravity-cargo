// src/level-manager.js
// Manages level loading, initialization, and progression

import { gameState } from './game-state.js';
import { PHYSICS } from './config.js?v=12';
import { levelTemplates as desktopLevels, calculateMaxScore as calculateDesktopMaxScore } from './levels.js?v=12';
import { levelTemplates as mobileLevels, calculateMaxScore as calculateMobileMaxScore } from './levels-mobile.js?v=12';
import { playSound } from './audio.js?v=12';
import { isMobile } from "./device-detection.js";
import { asteroidManager } from './asteroid-manager.js';

// Select appropriate level templates based on device
const levelTemplates = isMobile ? mobileLevels : desktopLevels;

// Get maximum level count dynamically
export function getMaxLevelCount() {
    return levelTemplates.length;
}

// Current level data
let currentLevel = null;

// Exported functions
export function getCurrentLevel() {
    return currentLevel;
}

export function getLevelBounds() {
    const fallbackWidth = isMobile ? 375 : 800;
    const fallbackHeight = isMobile ? 667 : 600;

    if (!currentLevel || !currentLevel.walls || currentLevel.walls.length === 0) {
        return {
            left: 0,
            top: 0,
            right: fallbackWidth,
            bottom: fallbackHeight,
            width: fallbackWidth,
            height: fallbackHeight
        };
    }

    const points = currentLevel.walls.flatMap(wall => wall.points || []);
    if (points.length === 0) {
        return {
            left: 0,
            top: 0,
            right: fallbackWidth,
            bottom: fallbackHeight,
            width: fallbackWidth,
            height: fallbackHeight
        };
    }

    const xs = points.map(point => point[0]);
    const ys = points.map(point => point[1]);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const right = Math.max(...xs);
    const bottom = Math.max(...ys);

    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top
    };
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
    return isMobile ? calculateMobileMaxScore() : calculateDesktopMaxScore();
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
    
    // Initialize asteroids for this level
    asteroidManager.initLevel(currentLevel);
    
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
