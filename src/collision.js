// src/collision.js
// Handles collision detection and response

import { gameState } from './game-state.js';
import { getShip, setShipPosition, setShipVelocity, setShipAngle, setShipSettling } from './ship-physics.js';
import { getCurrentLevel, getWalls, getPlatforms, initLevel, getMaxLevelCount } from './level-manager.js';
import { playSound } from './audio.js?v=11';
import { PHYSICS } from './config.js?v=11';
import { exitLevelSelectMode, exitTrainingMode, finishScoreAttack, startNextScoreAttackLevel } from './game-flow.js';
import { asteroidManager } from './asteroid-manager.js';
import { stopLevelTimer, evaluateTime, startLevelTimer } from './time-attack.js';
import { isScoreAttackMode } from './score-attack.js';

// Create explosion effect
export function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        gameState.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            size: 3 + Math.random() * 4,
            color: ['#ff6600', '#ff9900', '#ff0000', '#ffff00'][Math.floor(Math.random() * 4)]
        });
    }
}

// Check for collisions with walls and platforms
export function checkCollisions() {
    const ship = getShip();
    const walls = getWalls();
    
    // Check wall collisions
    for (const wall of walls) {
        if (polygonContainsPoint(wall.points, ship.x, ship.y)) {
            explode();
            return;
        }
    }
    
    // Check asteroid collisions
    if (checkAsteroidCollisions(ship)) {
        explode();
        return;
    }
    
    // Check platform collisions
    const platforms = getPlatforms();
    for (const platform of platforms) {
        if (isShipTouchingPlatform(ship, platform)) {
            if (canShipLand(ship)) {
                land(platform);
            } else {
                explode();
            }
            return;
        }
    }
}

// Check for ship-asteroid collisions using circle collision
function checkAsteroidCollisions(ship) {
    const activeAsteroids = asteroidManager.getActiveAsteroids();
    
    for (const asteroid of activeAsteroids) {
        const dx = ship.x - asteroid.x;
        const dy = ship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Simple circle collision detection
        if (distance < (ship.size + asteroid.size)) {
            return true;
        }
    }
    
    return false;
}

function isShipTouchingPlatform(ship, platform) {
    const px = platform.position[0];
    const py = platform.position[1];
    const pw = platform.width;

    return ship.x > px && ship.x < px + pw &&
        ship.y > py - ship.size && ship.y < py + 5;
}

function canShipLand(ship) {
    return isShipUprightForLanding(ship) && getShipSpeed(ship) < PHYSICS.maxLandingSpeed;
}

function isShipUprightForLanding(ship) {
    const normalizedAngle = normalizeFullRotation(ship.angle);
    return normalizedAngle < PHYSICS.maxLandingAngle ||
        normalizedAngle > Math.PI * 2 - PHYSICS.maxLandingAngle;
}

function getShipSpeed(ship) {
    return Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
}

function normalizeFullRotation(angle) {
    return ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
}

// Check if a point is inside a polygon
function polygonContainsPoint(points, x, y) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i][0], yi = points[i][1];
        const xj = points[j][0], yj = points[j][1];
        
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Handle ship landing on a platform
export function land(platform) {
    const ship = getShip();
    ship.vx = 0;
    ship.vy = 0;
    ship.y = platform.position[1] - ship.size;
    gameState.lastLandedPlatform = platform.id;
    playSound('land');
    
    // Activate settling if the ship isn't perfectly upright
    if (shouldShipSettle(ship)) {
        ship.settling = true;
    }
    
    // Handle cargo pickup and delivery
    if (gameState.currentCargo === null && platform.startingCargo !== null) {
        gameState.currentCargo = platform.startingCargo;
        platform.startingCargo = null;
        playSound('pickup');
    } else if (gameState.currentCargo !== null && gameState.currentCargo === platform.id) {
        gameState.score++;
        gameState.deliveredCargo++;
        gameState.currentCargo = null;
        playSound('delivery');
        
        if (isCurrentLevelComplete()) {
            levelComplete();
        }
    }
}

function shouldShipSettle(ship) {
    return getAngleFromVertical(ship.angle) > PHYSICS.settlingMinAngle;
}

function getAngleFromVertical(angle) {
    const normalizedAngle = normalizeFullRotation(angle);
    return normalizedAngle > Math.PI ? Math.PI * 2 - normalizedAngle : normalizedAngle;
}

// Handle ship explosion
export function explode() {
    playSound('explosion');
    createExplosion(getShip().x, getShip().y);
    gameState.state = 'exploding';
    gameState.explosionTime = 1000;
    
    setTimeout(() => {
        if (gameState.trainingMode) {
            // In training mode: direct return to main menu
            exitTrainingMode();
        } else if (isScoreAttackMode(gameState)) {
            gameState.lives--;
            if (gameState.lives <= 0) {
                finishScoreAttack();
            } else {
                respawn();
                gameState.state = 'playing';
            }
        } else {
            // Normal game mode
            gameState.lives--;
            if (gameState.lives <= 0) {
                // Time Attack Evaluation bei Game Over
                finishTimeAttackRunIfNeeded();
                gameState.state = 'gameover';
            } else {
                respawn();
                gameState.state = 'playing';
            }
        }
    }, 1000);
}

// Respawn the ship after explosion
export function respawn() {
    const platform = getPlatforms().find(p => p.id === gameState.lastLandedPlatform);
    if (!platform) return;
    
    setShipPosition(
        platform.position[0] + platform.width / 2,
        platform.position[1] - getShip().size
    );
    setShipVelocity(0, 0);
    setShipAngle(0);
    setShipSettling(false);
    
    // Reset asteroids for this level
    asteroidManager.reset();
    
    gameState.fuel = gameState.maxFuel;
    gameState.currentCargo = null;
}

// Check if the current level is complete
function isCurrentLevelComplete() {
    const currentLevel = getCurrentLevel();
    if (!currentLevel) return false;
    
    const totalCargo = currentLevel.platforms.filter(p => p.startingCargo !== null).length + gameState.deliveredCargo;
    return gameState.deliveredCargo >= totalCargo;
}

// Check if level was completed with all cargo delivered
function checkLevelCargoCompletion() {
    const currentLevel = getCurrentLevel();
    if (!currentLevel) return false;
    
    const totalCargoInLevel = currentLevel.platforms.filter(p => p.startingCargo !== null).length;
    return gameState.deliveredCargo >= totalCargoInLevel;
}

// Calculate cargo completion percentage for current level
function calculateCompletionPercentage() {
    const currentLevel = getCurrentLevel();
    if (!currentLevel) return 0;
    
    const totalCargoInLevel = currentLevel.platforms.filter(p => p.startingCargo !== null).length;
    if (totalCargoInLevel === 0) return 100; // Edge case: Level ohne Cargo
    
    return Math.round((gameState.deliveredCargo / totalCargoInLevel) * 100);
}

// Handle level completion
function levelComplete() {
    // Handle time attack timer
    finishTimeAttackRunIfNeeded();
    
    if (gameState.trainingMode) {
        // In training mode: direct return to main menu
        setTimeout(() => {
            exitTrainingMode();
        }, 2000);
        return;
    }

    if (gameState.mobileDesktopLevelTestMode) {
        gameState.state = 'levelcomplete';
        setTimeout(() => {
            exitLevelSelectMode();
        }, 2000);
        return;
    }

    if (isScoreAttackMode(gameState)) {
        gameState.state = 'levelcomplete';
        setTimeout(() => {
            startNextScoreAttackLevel();
        }, 2000);
        return;
    }
    
    // Normal game mode
    gameState.lastCompletedLevel = gameState.level;
    gameState.state = 'levelcomplete';
    gameState.level++;
    
    // Save game state
    try {
        const saveData = {
            level: gameState.level,
            score: gameState.score,
            lastCompletedLevel: gameState.lastCompletedLevel,
            timestamp: Date.now()
        };
        localStorage.setItem('gravityCargo_saveData', JSON.stringify(saveData));
    } catch (e) {
        console.error('Save failed:', e);
    }
    
    setTimeout(() => {
        if (gameState.level <= getMaxLevelCount()) {
            // Initialize new level and set ship position
            const startPos = initLevel();
            const ship = getShip();
            setShipPosition(startPos.x, startPos.y);
            setShipVelocity(0, 0);
            setShipAngle(startPos.angle);
            setShipSettling(false);
            
            // Start timer for next level in time attack mode
            if (gameState.mode === 'timeattack') {
                startLevelTimer(gameState.level);
            }
            
            gameState.state = 'playing';
        } else {
            gameState.state = 'gamewon';
            try {
                localStorage.removeItem('gravityCargo_saveData');
            } catch (e) {
                console.error('Clear save failed:', e);
            }
        }
    }, 3000);
}

function finishTimeAttackRunIfNeeded() {
    if (gameState.mode !== 'timeattack') return;

    const levelTime = stopLevelTimer();
    if (levelTime === null) return;

    const completionPercentage = calculateCompletionPercentage();
    evaluateTime(levelTime, gameState.level, completionPercentage);
}
