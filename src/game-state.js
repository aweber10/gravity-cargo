// src/game-state.js
// Manages game state, score, lives, and level progression

// Game State
export const gameState = {
    state: 'menu', // menu, playing, paused, levelcomplete, gameover, gamewon
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
    levelStartScore: 0
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
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.lastCompletedLevel = 0;
    gameState.currentCargo = null;
    gameState.deliveredCargo = 0;
    gameState.lastLandedPlatform = null;
    gameState.particles = [];
    gameState.explosionTime = 0;
    gameState.levelStartScore = 0;
}

export function updateScore(points) {
    gameState.score += points;
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
