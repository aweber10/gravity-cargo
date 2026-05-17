// src/game-state.js
// Manages game state, score, lives, and level progression

import { triggerScoreUpdate } from './renderer.js';

// Game State
export const gameState = {
    state: 'menu', // menu, playing, paused, levelcomplete, gameover, gamewon, levelselect
    mode: 'normal', // normal, timeattack, training
    score: 0,
    lives: 3,
    level: 1,
    lastCompletedLevel: 0,
    fuel: 100,
    maxFuel: 100,
    currentCargo: null,
    deliveredCargo: 0,
    lastLandedPlatform: null,
    particles: [],
    explosionTime: 0,
    levelStartScore: 0,
    // Training mode variables
    trainingMode: false,
    trainingLevel: 1,
    showLevelSelect: false
};

// Public API
export function updateGameState(newState) {
    Object.assign(gameState, newState);
}

export function getGameState() {
    return gameState;
}

export function resetGameState() {
    gameState.state = 'menu';
    gameState.mode = 'normal';
    gameState.score = 0;
    triggerScoreUpdate(); // Trigger score re-render on state reset
    gameState.lives = 3;
    gameState.level = 1;
    gameState.lastCompletedLevel = 0;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.lastLandedPlatform = null;
    gameState.particles = [];
    gameState.explosionTime = 0;
    gameState.levelStartScore = 0;
    gameState.trainingMode = false;
    gameState.trainingLevel = 1;
    gameState.showLevelSelect = false;
}

export function updateScore(points) {
    gameState.score += points;
    triggerScoreUpdate(); // Trigger score re-render only when changed
}

export function loseLife() {
    gameState.lives--;
    return gameState.lives > 0;
}

export function setFuel(fuel) {
    gameState.fuel = fuel;
}

export function getMaxFuel() {
    return gameState.maxFuel;
}

export function getCurrentCargo() {
    return gameState.currentCargo;
}

export function setCurrentCargo(cargo) {
    gameState.currentCargo = cargo;
}

export function incrementDeliveredCargo() {
    gameState.deliveredCargo++;
}

export function setLastLandedPlatform(platformId) {
    gameState.lastLandedPlatform = platformId;
}

export function getLevelStartScore() {
    return gameState.levelStartScore;
}

export function setLevelStartScore(score) {
    gameState.levelStartScore = score;
}

export function addParticle(particle) {
    gameState.particles.push(particle);
}

export function clearParticles() {
    gameState.particles = [];
}

export function setExplosionTime(time) {
    gameState.explosionTime = time;
}

export function getExplosionTime() {
    return gameState.explosionTime;
}

// Training mode functions
export function setTrainingMode(enabled) {
    gameState.trainingMode = enabled;
}

export function isTrainingMode() {
    return gameState.trainingMode;
}

export function setTrainingLevel(level) {
    gameState.trainingLevel = level;
}

export function getTrainingLevel() {
    return gameState.trainingLevel;
}

export function setShowLevelSelect(show) {
    gameState.showLevelSelect = show;
}

export function isShowLevelSelect() {
    return gameState.showLevelSelect;
}

// Game mode functions
export function setGameMode(mode) {
    gameState.mode = mode;
}

export function getGameMode() {
    return gameState.mode;
}

export function isTimeAttackMode() {
    return gameState.mode === 'timeattack';
}
