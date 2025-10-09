// src/collision.js
// Handles collision detection and response

import { gameState } from './game-state.js';
import { getShip, setShipPosition, setShipVelocity, setShipAngle, setShipSettling } from './ship-physics.js';
import { getCurrentLevel, getWalls, getPlatforms, initLevel } from './level-manager.js';
import { playSound } from '../audio.js?v=11';
import { PHYSICS } from '../config.js?v=11';

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
    
    // Check platform collisions
    const platforms = getPlatforms();
    for (const platform of platforms) {
        const px = platform.position[0];
        const py = platform.position[1];
        const pw = platform.width;
        
        if (ship.x > px && ship.x < px + pw && 
            ship.y > py - ship.size && ship.y < py + 5) {
            
            const normalizedAngle = ((ship.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const isUpright = normalizedAngle < PHYSICS.maxLandingAngle || 
                            normalizedAngle > Math.PI * 2 - PHYSICS.maxLandingAngle;
            
            const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
            
            if (isUpright && speed < PHYSICS.maxLandingSpeed) {
                land(platform);
            } else {
                explode();
            }
            return;
        }
    }
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
    const normalizedAngle = ((ship.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let angleFromVertical = normalizedAngle;
    if (angleFromVertical > Math.PI) {
        angleFromVertical = Math.PI * 2 - angleFromVertical;
    }
    
    if (angleFromVertical > PHYSICS.settlingMinAngle) {
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

// Handle ship explosion
export function explode() {
    playSound('explosion');
    createExplosion(getShip().x, getShip().y);
    gameState.state = 'exploding';
    gameState.explosionTime = 1000;
    
    setTimeout(() => {
        gameState.lives--;
        if (gameState.lives <= 0) {
            gameState.state = 'gameover';
        } else {
            respawn();
            gameState.state = 'playing';
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

// Handle level completion
function levelComplete() {
    gameState.state = 'levelcomplete';
    gameState.level++;
    
    // Save game state
    try {
        const saveData = {
            level: gameState.level,
            score: gameState.score,
            timestamp: Date.now()
        };
        localStorage.setItem('gravityCargo_saveData', JSON.stringify(saveData));
    } catch (e) {
        console.error('Save failed:', e);
    }
    
    setTimeout(() => {
        if (gameState.level <= 10) {
            // Initialize new level and set ship position
            const startPos = initLevel();
            const ship = getShip();
            setShipPosition(startPos.x, startPos.y);
            setShipVelocity(0, 0);
            setShipAngle(startPos.angle);
            setShipSettling(false);
            
            gameState.state = 'playing';
        } else {
            gameState.state = 'gamewon';
            try {
                localStorage.removeItem('gravityCargo_saveData');
            } catch (e) {
                console.error('Clear save failed:', e);
            }
        }
    }, 2000);
}