// src/main.js
// Main entry point for the game

import { gameState } from './game-state.js';
import { initLevel } from './level-manager.js';
import { getShip, updateShipRotation, updateShipThrust, applyPhysics, updateShipSettling, updateShipPosition, updateTouchControls } from './ship-physics.js';
import { checkCollisions } from './collision.js';
import { initCanvas, render } from './renderer.js';
import { updateUI, setupKeyboardControls, setupTouchControls, setupClickControls, initMenu } from './ui.js';
import { initGame } from './game-flow.js';

// Game loop variables
let lastTime = 0;

// Update function
function update(dt) {
    // Update particles (this should be in a separate module, but keeping it here for now)
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const p = gameState.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.2;
        if (p.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
    
    if (gameState.state === 'paused') return;
    if (gameState.state !== 'playing') return;
    
    updateTouchControls(dt);
    updateShipSettling(dt);
    updateShipRotation(dt);
    updateShipThrust(dt);
    applyPhysics(dt, gameState.gravity);
    updateShipPosition(dt);
    checkCollisions();
    updateUI();
}

// Game loop
function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    
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