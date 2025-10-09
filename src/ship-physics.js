// src/ship-physics.js
// Handles ship movement, physics, and input processing

import { gameState } from './game-state.js';
import { isMobile } from './ui.js';
import { PHYSICS } from './config.js?v=12';
import { playSound } from './audio.js?v=12';

// Ship state
const ship = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    size: 20,
    thrusting: false,
    settling: false
};

// Input state
const keys = {
    left: false,
    right: false,
    up: false,
    space: false
};

// Touch state for mobile
const touchState = {
    active: false,
    x: 0,
    y: 0
};

// Exported functions for ship state
export function getShip() {
    return ship;
}

export function setShipPosition(x, y) {
    ship.x = x;
    ship.y = y;
}

export function setShipVelocity(vx, vy) {
    ship.vx = vx;
    ship.vy = vy;
}

export function setShipAngle(angle) {
    ship.angle = angle;
}

export function setShipSettling(settling) {
    ship.settling = settling;
}

export function isShipThrusting() {
    return ship.thrusting;
}

export function setShipThrusting(thrusting) {
    ship.thrusting = thrusting;
}

// Exported functions for input state
export function setKeyState(key, state) {
    if (keys.hasOwnProperty(key)) {
        keys[key] = state;
    }
}

export function getKeyState(key) {
    return keys[key];
}

export function getKeys() {
    return keys;
}

export function getTouchState() {
    return touchState;
}

export function setTouchState(active, x, y) {
    touchState.active = active;
    if (x !== undefined) touchState.x = x;
    if (y !== undefined) touchState.y = y;
}

// Physics update functions
export function updateShipRotation(dt) {
    // If the ship is settling, no manual control
    if (ship.settling) {
        return;
    }

    if (keys.left) {
        ship.angle -= PHYSICS.rotationSpeed * dt;
    }
    if (keys.right) {
        ship.angle += PHYSICS.rotationSpeed * dt;
    }
}

export function updateShipThrust(dt) {
    ship.thrusting = false;

    // No thrust during settling
    if (ship.settling) {
        return;
    }

    if (keys.up && gameState.fuel > 0) {
        ship.thrusting = true;
        playSound('thrust');

        const thrustX = Math.sin(ship.angle) * PHYSICS.thrust;
        const thrustY = -Math.cos(ship.angle) * PHYSICS.thrust;

        ship.vx += thrustX;
        ship.vy += thrustY;

        gameState.fuel -= PHYSICS.fuelConsumption;
        if (gameState.fuel < 0) gameState.fuel = 0;
    }
}

export function applyPhysics(dt, gravity) {
    ship.vy += gravity;
    ship.vx *= PHYSICS.friction;
    ship.vy *= PHYSICS.friction;
}

export function updateShipSettling(dt) {
    if (!ship.settling) {
        return;
    }

    // Normalize the angle to -PI to PI
    let normalizedAngle = ship.angle % (Math.PI * 2);
    if (normalizedAngle > Math.PI) {
        normalizedAngle -= Math.PI * 2;
    } else if (normalizedAngle < -Math.PI) {
        normalizedAngle += Math.PI * 2;
    }

    // Check if we're already almost upright
    if (Math.abs(normalizedAngle) < PHYSICS.settlingMinAngle) {
        ship.angle = 0;
        ship.settling = false;
        return;
    }

    // Rotate gently toward 0
    // Rotation speed is faster the more tilted the ship is (physically realistic)
    const rotationSpeed = normalizedAngle * PHYSICS.settlingRotationDamping;
    ship.angle -= rotationSpeed;
}

export function updateShipPosition(dt) {
    ship.x += ship.vx;
    ship.y += ship.vy;
}

export function updateTouchControls(dt) {
    if (touchState.active && isMobile && !ship.settling) {
        const dx = touchState.x - ship.x;
        const dy = touchState.y - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Deadzone around the ship - only respond when sufficiently far away
        if (distance > 30) {
            // Calculate target angle - invert dy for correct direction in canvas coordinate system
            const targetAngle = Math.atan2(dx, -dy);

            // Normalize current angle to -PI to PI
            let currentAngle = ship.angle % (Math.PI * 2);
            if (currentAngle > Math.PI) currentAngle -= Math.PI * 2;
            else if (currentAngle < -Math.PI) currentAngle += Math.PI * 2;

            let normalizedTarget = targetAngle % (Math.PI * 2);
            if (normalizedTarget > Math.PI) normalizedTarget -= Math.PI * 2;
            else if (normalizedTarget < -Math.PI) normalizedTarget += Math.PI * 2;

            // Calculate shortest path to target angle
            let angleDiff = normalizedTarget - currentAngle;
            if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            // Set keys based on the difference - same as keyboard control
            keys.left = false;
            keys.right = false;

            const tolerance = 0.1; // ~6 degrees tolerance
            if (angleDiff > tolerance) {
                keys.right = true;
            } else if (angleDiff < -tolerance) {
                keys.left = true;
            }

            keys.up = true;
        } else {
            keys.up = false;
            keys.left = false;
            keys.right = false;
        }
    } else if (isMobile && !touchState.active) {
        // Only reset keys if mobile and not touching
        keys.up = false;
        keys.left = false;
        keys.right = false;
    }
}