// Imports
import { PHYSICS } from './config.js?v=8';
import { levelTemplates as desktopLevels, calculateMaxScore } from './levels.js?v=8';
import { levelTemplates as mobileLevels } from './levels-mobile.js?v=8';
import { playSound } from './audio.js?v=8';

// Device detection for level selection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);

// Select appropriate level templates based on device
const levelTemplates = isMobile ? mobileLevels : desktopLevels;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// isMobile is defined below after importing mobile levels

// Touch State für neue Ein-Finger-Steuerung
const touchState = {
    active: false,
    x: 0,
    y: 0
};

function resizeCanvas() {
    if (isMobile) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        const aspectRatio = 16 / 9;
        const maxWidth = Math.min(window.innerWidth * 0.95, 1280);
        const maxHeight = Math.min(window.innerHeight * 0.95, 720);
        
        if (maxWidth / maxHeight > aspectRatio) {
            canvas.height = maxHeight;
            canvas.width = maxHeight * aspectRatio;
        } else {
            canvas.width = maxWidth;
            canvas.height = maxWidth / aspectRatio;
        }
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game State
const game = {
    state: 'menu',
    score: 0,
    lives: 3,
    level: 1,
    fuel: 100,
    maxFuel: 100,
    currentCargo: null,
    deliveredCargo: 0,
    lastLandedPlatform: null,
    particles: [],
    explosionTime: 0,
    levelStartScore: 0
};

const menu = {
    currentScreen: 'main',
    selectedOption: 0,
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true, bounds: null },
        { id: 'continue', label: 'FORTSETZEN', enabled: false, bounds: null }
    ]
};

const pauseMenu = {
    selectedOption: 0,
    options: [
        { id: 'resume', label: 'FORTSETZEN', bounds: null },
        { id: 'restart', label: 'NEUSTART LEVEL', bounds: null },
        { id: 'mainmenu', label: 'HAUPTMENÜ', bounds: null }
    ]
};

// Storage Functions
function saveGameState() {
    const saveData = {
        level: game.level,
        score: game.score,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem('gravityCargo_saveData', JSON.stringify(saveData));
        return true;
    } catch (e) {
        console.error('Speichern fehlgeschlagen:', e);
        return false;
    }
}

function loadGameState() {
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Laden fehlgeschlagen:', e);
        return null;
    }
}

function clearGameState() {
    try {
        localStorage.removeItem('gravityCargo_saveData');
        return true;
    } catch (e) {
        console.error('Löschen fehlgeschlagen:', e);
        return false;
    }
}

// Menu Functions
function initMenu() {
    const saveData = loadGameState();
    if (saveData) {
        menu.options[1].enabled = true;
    } else {
        menu.options[1].enabled = false;
    }
    game.state = 'menu';
    
    // Setze selectedOption auf ersten aktivierten Eintrag
    menu.selectedOption = menu.options.findIndex(o => o.enabled);
    if (menu.selectedOption === -1) menu.selectedOption = 0;
}

function togglePause() {
    if (game.state === 'playing') {
        game.state = 'paused';
        pauseMenu.selectedOption = 0;
        playSound('menuSelect');
    } else if (game.state === 'paused') {
        game.state = 'playing';
        playSound('menuSelect');
    }
}

function handlePauseMenuSelection() {
    const selectedOption = pauseMenu.options[pauseMenu.selectedOption];
    
    playSound('menuSelect');
    
    switch (selectedOption.id) {
        case 'resume':
            game.state = 'playing';
            break;
        case 'restart':
            restartLevel();
            break;
        case 'mainmenu':
            saveGameState();
            initMenu();
            break;
    }
}

function restartLevel() {
    game.score = game.levelStartScore;
    game.lives = 3;
    game.currentCargo = null;
    game.deliveredCargo = 0;
    initLevel();
    game.state = 'playing';
}

function getPauseMenuOptionAtPosition(x, y) {
    for (let i = 0; i < pauseMenu.options.length; i++) {
        const option = pauseMenu.options[i];
        if (option.bounds) {
            const b = option.bounds;
            if (x >= b.x && x <= b.x + b.width && 
                y >= b.y && y <= b.y + b.height) {
                return i;
            }
        }
    }
    return -1;
}

// Ship and Controls
const ship = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    size: 20,
    thrusting: false,
    settling: false // true wenn das Schiff sich gerade aufrichtet
};

const keys = {
    left: false,
    right: false,
    up: false,
    space: false
};

// Level Management
let currentLevel = null;

function initLevel() {
    const levelIndex = game.level - 1;
    if (levelIndex >= levelTemplates.length) {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelTemplates.length - 1]));
    } else {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelIndex]));
    }
    
    game.fuel = currentLevel.fuel;
    game.maxFuel = currentLevel.fuel;
    game.currentCargo = null;
    game.deliveredCargo = 0;
    game.lives = 3;
    game.levelStartScore = game.score;
    
    const startPlatform = currentLevel.platforms.find(p => p.id === currentLevel.startPlatform);
    ship.x = startPlatform.position[0] + startPlatform.width / 2;
    ship.y = startPlatform.position[1] - ship.size;
    ship.vx = 0;
    ship.vy = 0;
    ship.angle = 0;
    ship.settling = false;
    
    game.lastLandedPlatform = currentLevel.startPlatform;
}

// Event Handlers
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && 
        (game.state === 'playing' || game.state === 'paused')) {
        e.preventDefault();
        togglePause();
        return;
    }
    
    if (game.state === 'paused') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            pauseMenu.selectedOption = Math.max(0, pauseMenu.selectedOption - 1);
            playSound('menuMove');
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            pauseMenu.selectedOption = Math.min(pauseMenu.options.length - 1, pauseMenu.selectedOption + 1);
            playSound('menuMove');
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePauseMenuSelection();
        }
        return;
    }
    
    if (game.state === 'menu') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            const enabledIndices = menu.options.map((o, i) => o.enabled ? i : -1).filter(i => i >= 0);
            const currentPos = enabledIndices.indexOf(menu.selectedOption);
            if (currentPos > 0) {
                menu.selectedOption = enabledIndices[currentPos - 1];
                playSound('menuMove');
            }
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            const enabledIndices = menu.options.map((o, i) => o.enabled ? i : -1).filter(i => i >= 0);
            const currentPos = enabledIndices.indexOf(menu.selectedOption);
            if (currentPos < enabledIndices.length - 1) {
                menu.selectedOption = enabledIndices[currentPos + 1];
                playSound('menuMove');
            }
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMenuSelection();
        }
        return;
    }
    
    if (game.state === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        initMenu();
        return;
    }
    
    if (game.state === 'gamewon' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        clearGameState();
        initMenu();
        return;
    }
    
    if (game.state === 'gamewon' && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        game.level = 1;
        game.score = 0;
        game.lives = 3;
        clearGameState();
        initLevel();
        game.state = 'playing';
        return;
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
});


// Mobile pause button is handled by the canvas click handler

// Neue Touch Event Handler
function handleTouchStart(e) {
    e.preventDefault();
    
    if (game.state === 'menu') {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        const selectedOption = getMenuOptionAtPosition(touchX, touchY);
        if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
            menu.selectedOption = selectedOption;
            handleMenuSelection();
        }
        return;
    }
    
    if (game.state === 'paused') {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        const selectedOption = getPauseMenuOptionAtPosition(touchX, touchY);
        if (selectedOption !== -1) {
            pauseMenu.selectedOption = selectedOption;
            handlePauseMenuSelection();
        }
        return;
    }
    
    if (game.state === 'playing' && isMobile) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchState.x = touch.clientX - rect.left;
        touchState.y = touch.clientY - rect.top;
        touchState.active = true;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (touchState.active && game.state === 'playing') {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchState.x = touch.clientX - rect.left;
        touchState.y = touch.clientY - rect.top;
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    touchState.active = false;
}

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchcancel', handleTouchEnd);

canvas.addEventListener('click', (e) => {
    if (game.state === 'menu') {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const selectedOption = getMenuOptionAtPosition(clickX, clickY);
        if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
            menu.selectedOption = selectedOption;
            handleMenuSelection();
        }
    }
    
    if (game.state === 'paused') {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const selectedOption = getPauseMenuOptionAtPosition(clickX, clickY);
        if (selectedOption !== -1) {
            pauseMenu.selectedOption = selectedOption;
            handlePauseMenuSelection();
        }
    }
    
    if (game.state === 'gamewon') {
        clearGameState();
        initMenu();
    }
});

function getMenuOptionAtPosition(x, y) {
    for (let i = 0; i < menu.options.length; i++) {
        const option = menu.options[i];
        if (option.bounds) {
            const b = option.bounds;
            if (x >= b.x && x <= b.x + b.width && 
                y >= b.y && y <= b.y + b.height) {
                return i;
            }
        }
    }
    return -1;
}

function handleMenuSelection() {
    const selectedOption = menu.options[menu.selectedOption];
    
    if (!selectedOption.enabled) return;
    
    playSound('menuSelect');
    
    switch (selectedOption.id) {
        case 'newgame':
            startNewGame();
            break;
        case 'continue':
            continueGame();
            break;
    }
}

function startNewGame() {
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    clearGameState();
    initLevel();
    game.state = 'playing';
}

function continueGame() {
    const saveData = loadGameState();
    if (saveData) {
        game.level = saveData.level;
        game.score = saveData.score;
        initLevel();
        game.state = 'playing';
    }
}

// Game Update Logic (refactored with SLA)
function updateParticles(dt) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.2;
        if (p.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
}

function updateShipRotation(dt) {
    // Wenn das Schiff sich aufrichtet, keine manuelle Steuerung
    if (ship.settling) {
        return;
    }
    
    // Touch-Steuerung setzt keys.left/right, also keine Sonderbehandlung nötig
    
    if (keys.left) {
        ship.angle -= PHYSICS.rotationSpeed * dt;
    }
    if (keys.right) {
        ship.angle += PHYSICS.rotationSpeed * dt;
    }
}

function updateShipThrust(dt) {
    ship.thrusting = false;
    
    // Kein Schub während settling
    if (ship.settling) {
        return;
    }
    
    if (keys.up && game.fuel > 0) {
        ship.thrusting = true;
        playSound('thrust');
        
        const thrustX = Math.sin(ship.angle) * PHYSICS.thrust;
        const thrustY = -Math.cos(ship.angle) * PHYSICS.thrust;
        
        ship.vx += thrustX;
        ship.vy += thrustY;
        
        game.fuel -= PHYSICS.fuelConsumption;
        if (game.fuel < 0) game.fuel = 0;
    }
}

function applyPhysics(dt) {
    ship.vy += PHYSICS.gravity;
    ship.vx *= PHYSICS.friction;
    ship.vy *= PHYSICS.friction;
}

function updateShipSettling(dt) {
    if (!ship.settling) {
        return;
    }
    
    // Normalisiere den Winkel auf -PI bis PI
    let normalizedAngle = ship.angle % (Math.PI * 2);
    if (normalizedAngle > Math.PI) {
        normalizedAngle -= Math.PI * 2;
    } else if (normalizedAngle < -Math.PI) {
        normalizedAngle += Math.PI * 2;
    }
    
    // Prüfe ob wir schon fast aufrecht sind
    if (Math.abs(normalizedAngle) < PHYSICS.settlingMinAngle) {
        ship.angle = 0;
        ship.settling = false;
        return;
    }
    
    // Drehe sanft in Richtung 0
    // Die Rotation ist schneller, je weiter das Schiff geneigt ist (physikalisch realistisch)
    const rotationSpeed = normalizedAngle * PHYSICS.settlingRotationDamping;
    ship.angle -= rotationSpeed;
}

function updateShipPosition(dt) {
    ship.x += ship.vx;
    ship.y += ship.vy;
}

function updateTouchControls(dt) {
    if (touchState.active && isMobile && !ship.settling) {
        const dx = touchState.x - ship.x;
        const dy = touchState.y - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Deadzone um das Schiff - nur bei ausreichender Entfernung reagieren
        if (distance > 30) {
            // Berechne Zielwinkel - invertiere dy für korrekte Richtung im Canvas-Koordinatensystem
            const targetAngle = Math.atan2(dx, -dy);
            
            // Normalisiere aktuellen Winkel auf -PI bis PI
            let currentAngle = ship.angle % (Math.PI * 2);
            if (currentAngle > Math.PI) currentAngle -= Math.PI * 2;
            else if (currentAngle < -Math.PI) currentAngle += Math.PI * 2;
            
            let normalizedTarget = targetAngle % (Math.PI * 2);
            if (normalizedTarget > Math.PI) normalizedTarget -= Math.PI * 2;
            else if (normalizedTarget < -Math.PI) normalizedTarget += Math.PI * 2;
            
            // Berechne kürzesten Weg zum Zielwinkel
            let angleDiff = normalizedTarget - currentAngle;
            if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            // DEBUG
            console.log('Touch:', touchState.x.toFixed(0), touchState.y.toFixed(0), 
                        'Ship:', ship.x.toFixed(0), ship.y.toFixed(0),
                        'dx:', dx.toFixed(1), 'dy:', dy.toFixed(1),
                        'Target:', (targetAngle * 180 / Math.PI).toFixed(1) + '°',
                        'Current:', (currentAngle * 180 / Math.PI).toFixed(1) + '°',
                        'Diff:', (angleDiff * 180 / Math.PI).toFixed(1) + '°');
            
            // Setze keys basierend auf der Differenz - genau wie Tastatur-Steuerung
            keys.left = false;
            keys.right = false;
            
            const tolerance = 0.1; // ~6 Grad Toleranz
            if (angleDiff > tolerance) {
                keys.right = true;
                console.log('→ RIGHT');
            } else if (angleDiff < -tolerance) {
                keys.left = true;
                console.log('← LEFT');
            } else {
                console.log('✓ ON TARGET');
            }
            
            keys.up = true;
        } else {
            keys.up = false;
            keys.left = false;
            keys.right = false;
        }
    } else if (isMobile && !touchState.active) {
        keys.up = false;
        keys.left = false;
        keys.right = false;
    }
}

function update(dt) {
    updateParticles(dt);
    
    if (game.state === 'paused') return;
    if (game.state !== 'playing') return;
    
    updateTouchControls(dt);
    updateShipSettling(dt);
    updateShipRotation(dt);
    updateShipThrust(dt);
    applyPhysics(dt);
    updateShipPosition(dt);
    checkCollisions();
    updateUI();
}

// Collision Detection
function checkCollisions() {
    for (const wall of currentLevel.walls) {
        if (polygonContainsPoint(wall.points, ship.x, ship.y)) {
            explode();
            return;
        }
    }
    
    for (const platform of currentLevel.platforms) {
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

function land(platform) {
    ship.vx = 0;
    ship.vy = 0;
    ship.y = platform.position[1] - ship.size;
    game.lastLandedPlatform = platform.id;
    playSound('land');
    
    // Aktiviere Settling wenn das Schiff nicht perfekt aufrecht ist
    const normalizedAngle = ((ship.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let angleFromVertical = normalizedAngle;
    if (angleFromVertical > Math.PI) {
        angleFromVertical = Math.PI * 2 - angleFromVertical;
    }
    
    if (angleFromVertical > PHYSICS.settlingMinAngle) {
        ship.settling = true;
    }
    
    if (game.currentCargo === null && platform.startingCargo !== null) {
        game.currentCargo = platform.startingCargo;
        platform.startingCargo = null;
        playSound('pickup');
    } else if (game.currentCargo !== null && game.currentCargo === platform.id) {
        game.score++;
        game.deliveredCargo++;
        game.currentCargo = null;
        playSound('delivery');
        
        const totalCargo = currentLevel.platforms.filter(p => p.startingCargo !== null).length + game.deliveredCargo;
        if (game.deliveredCargo >= totalCargo) {
            levelComplete();
        }
    }
}

function levelComplete() {
    game.state = 'levelcomplete';
    game.level++;
    saveGameState();
    setTimeout(() => {
        if (game.level <= 10) {
            initLevel();
            game.state = 'playing';
        } else {
            game.state = 'gamewon';
            clearGameState();
        }
    }, 2000);
}

function explode() {
    playSound('explosion');
    createExplosion(ship.x, ship.y);
    game.state = 'exploding';
    game.explosionTime = 1000;
    
    setTimeout(() => {
        game.lives--;
        if (game.lives <= 0) {
            game.state = 'gameover';
            clearGameState();
        } else {
            respawn();
            game.state = 'playing';
        }
    }, 1000);
}

function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        game.particles.push({
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

function respawn() {
    const respawnPlatform = currentLevel.platforms.find(p => p.id === game.lastLandedPlatform);
    ship.x = respawnPlatform.position[0] + respawnPlatform.width / 2;
    ship.y = respawnPlatform.position[1] - ship.size;
    ship.vx = 0;
    ship.vy = 0;
    ship.angle = 0;
    ship.settling = false;
    game.fuel = game.maxFuel;
    game.currentCargo = null;
}

function updateUI() {
    document.getElementById('score').textContent = `SCORE: ${game.score.toString().padStart(2, '0')}`;
    
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < game.lives; i++) {
        const lifeIcon = document.createElement('div');
        lifeIcon.className = 'life-icon';
        livesContainer.appendChild(lifeIcon);
    }
    
    const fuelBar = document.getElementById('fuel-bar');
    const fuelPercent = (game.fuel / game.maxFuel) * 100;
    fuelBar.style.width = fuelPercent + '%';
    
    fuelBar.classList.remove('low', 'critical');
    if (fuelPercent < 20) {
        fuelBar.classList.add('critical');
    } else if (fuelPercent < 50) {
        fuelBar.classList.add('low');
    }
    
    const targetText = game.currentCargo ? `TARGET: ${game.currentCargo}` : 'TARGET: --';
    document.getElementById('target-platform').textContent = targetText;
}

// Rendering Functions (refactored with SLA)
function renderPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 4);
    
    const startY = canvas.height / 2;
    const spacing = 70;
    
    pauseMenu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === pauseMenu.selectedOption;
        const buttonWidth = 280;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;
        
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.font = '22px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);
        
        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });
    
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('ESC/P zum Fortsetzen', canvas.width / 2, canvas.height - 40);
}

function renderGameWonBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderGameWonTitle() {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 56px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GLÜCKWUNSCH!', canvas.width / 2, canvas.height / 5);
    
    ctx.font = '32px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ALLE LEVEL ABGESCHLOSSEN', canvas.width / 2, canvas.height / 5 + 70);
}

function renderGameWonScore() {
    const maxScore = calculateMaxScore();
    const percentage = Math.round((game.score / maxScore) * 100);
    const scoreY = canvas.height / 2 - 40;
    
    ctx.font = '36px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`DEIN SCORE: ${game.score}`, canvas.width / 2, scoreY);
    
    ctx.font = '24px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.fillText(`Maximal möglich: ${maxScore}`, canvas.width / 2, scoreY + 45);
    
    ctx.font = '28px "Courier New"';
    ctx.fillStyle = percentage === 100 ? '#0f0' : '#ff0';
    ctx.fillText(`${percentage}% erreicht`, canvas.width / 2, scoreY + 90);
    
    if (percentage === 100) {
        ctx.font = '20px "Courier New"';
        ctx.fillStyle = '#0f0';
        ctx.fillText('★ PERFEKT ★', canvas.width / 2, scoreY + 130);
    }
}

function renderGameWonCredits() {
    const creditsY = canvas.height - 200;
    
    ctx.font = 'bold 20px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText('CREDITS', canvas.width / 2, creditsY);
    
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#aaa';
    const lineHeight = 25;
    let line = 0;
    
    ctx.fillText('Autor: Andreas Weber', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    line++; // Leerzeile
    ctx.fillText('Entwickelt mit:', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Claude Sonnet 4.5', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Claude Code', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Roo Code', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
}

function renderGameWonInstructions() {
    ctx.font = '18px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height - 40);
}

function renderTouchIndicator() {
    if (touchState.active && isMobile) {
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(touchState.x, touchState.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }
}

function renderGameWon() {
    renderGameWonBackground();
    renderGameWonTitle();
    renderGameWonScore();
    renderGameWonCredits();
    renderGameWonInstructions();
}

function renderMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRAVITY CARGO', canvas.width / 2, canvas.height / 3);
    
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('A Retro Physics Puzzler', canvas.width / 2, canvas.height / 3 + 60);
    
    const startY = canvas.height / 2 + 20;
    const spacing = 70;
    
    menu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === menu.selectedOption;
        const buttonWidth = 300;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;
        
        if (isSelected && option.enabled) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
        
        ctx.strokeStyle = option.enabled ? '#fff' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.font = '24px "Courier New"';
        ctx.fillStyle = option.enabled ? '#fff' : '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);
        
        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });
    
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Idee: Andreas Weber | Spec: Claude Sonnet 4.5 | Code: Claude Code', 
                 canvas.width / 2, canvas.height - 30);
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (game.state === 'menu') {
        renderMenu();
        return;
    }
    
    if (game.state === 'gamewon') {
        renderGameWon();
        return;
    }
    
    if (game.state === 'levelcomplete') {
        ctx.fillStyle = '#fff';
        ctx.font = '48px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px "Courier New"';
        ctx.fillText(`SCORE: ${game.score}`, canvas.width / 2, canvas.height / 2 + 50);
        return;
    }
    
    if (game.state === 'gameover') {
        ctx.fillStyle = '#fff';
        ctx.font = '48px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px "Courier New"';
        ctx.fillText(`LEVEL: ${game.level}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText(`SCORE: ${game.score}`, canvas.width / 2, canvas.height / 2 + 85);
        ctx.font = '20px "Courier New"';
        ctx.fillStyle = '#0ff';
        ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height / 2 + 140);
        return;
    }
    
    ctx.save();
    
    for (const wall of currentLevel.walls) {
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.moveTo(wall.points[0][0], wall.points[0][1]);
        for (let i = 1; i < wall.points.length; i++) {
            ctx.lineTo(wall.points[i][0], wall.points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    for (const platform of currentLevel.platforms) {
        const isTarget = game.currentCargo === platform.id;
        ctx.strokeStyle = isTarget ? '#fff' : '#0f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(platform.position[0], platform.position[1]);
        ctx.lineTo(platform.position[0] + platform.width, platform.position[1]);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px "Courier New"';
        ctx.fillText(platform.id, platform.position[0] + 5, platform.position[1] - 5);
        
        if (platform.startingCargo) {
            ctx.fillStyle = '#ff0';
            ctx.fillRect(
                platform.position[0] + platform.width / 2 - 8,
                platform.position[1] - 20,
                16,
                16
            );
        }
    }
    
    if (game.state !== 'exploding') {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        
        if (ship.thrusting) {
            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(-6, ship.size / 2);
            ctx.lineTo(0, ship.size / 2 + 15);
            ctx.lineTo(6, ship.size / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -ship.size / 2);
        ctx.lineTo(-ship.size / 2, ship.size / 2);
        ctx.lineTo(ship.size / 2, ship.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    for (const particle of game.particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    
    // Touch-Feedback anzeigen
    if (game.state === 'playing') {
        renderTouchIndicator();
    }
    
    ctx.restore();
    
    if (game.state === 'paused') {
        renderPauseScreen();
    }
}

// Game Loop
let lastTime = 0;
function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    
    if (dt > 0) {
        update(dt);
    }
    render();
    
    requestAnimationFrame(gameLoop);
}

initMenu();
requestAnimationFrame(gameLoop);
