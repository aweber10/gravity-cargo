// src/main.js
// Main entry point for the game

import { gameState } from './game-state.js';
import { initLevel } from './level-manager.js';
import { getShip, updateShipRotation, updateShipThrust, applyPhysics, updateShipSettling, updateShipPosition, updateTouchControls } from './ship-physics.js';
import { checkCollisions } from './collision.js';
import { initCanvas, render } from './renderer.js';
import { updateUI, setupKeyboardControls, setupTouchControls, setupClickControls, initMenu } from './ui.js';
import { initGame } from './game-flow.js';
import { PHYSICS } from './config.js?v=12';
import { asteroidManager } from './asteroid-manager.js';
import { updateTimer } from './time-attack.js';

let lastTime = 0;

// Shared performance timestamp for frame-based operations to reduce performance.now() calls
let sharedFrameTime = 0;

// Export shared frame time for other modules
export function getSharedFrameTime() {
    return sharedFrameTime;
}

// Update function
function update(dt) {
    // Update particles with optimized swap-and-pop removal for better performance
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const p = gameState.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.2;
        if (p.life <= 0) {
            // Swap with last element and pop (more efficient than splice)
            gameState.particles[i] = gameState.particles[gameState.particles.length - 1];
            gameState.particles.pop();
        }
    }
    
    if (gameState.state === 'paused') return;
    if (gameState.state !== 'playing') return;
    
    updateTouchControls(dt);
    
    // Update asteroids
    asteroidManager.update(dt * 1000); // Convert to milliseconds
    
    // Update time attack timer
    if (gameState.mode === 'timeattack') {
        updateTimer();
    }
    
    updateShipSettling(dt);
    updateShipRotation(dt);
    updateShipThrust(dt);
    applyPhysics(dt, PHYSICS.gravity);
    updateShipPosition(dt);
    checkCollisions();
    updateUI();
}

// Game loop
function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    // Update shared frame time for performance optimization
    sharedFrameTime = performance.now();
    
    if (dt > 0) {
        update(dt);
    }
    render();
    
    requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {
    // Initialize all systems
    initGame();
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game when loaded
window.addEventListener('load', init);