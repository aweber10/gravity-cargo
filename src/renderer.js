// src/renderer.js
// Handles all rendering operations for the game

import { gameState } from './game-state.js';
import { getShip, getTouchState } from './ship-physics.js';
import { getWalls, getPlatforms, getMaxScore, getLevelTemplates } from './level-manager.js';
import { isMobile, menu, pauseMenu } from './ui.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas based on device
export function resizeCanvas() {
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

// Initialize canvas
export function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Get canvas context
export function getCanvas() {
    return canvas;
}

export function getContext() {
    return ctx;
}

// Render game elements
export function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameState.state === 'menu') {
        renderMenu();
        return;
    }
    
    if (gameState.state === 'gamewon') {
        renderGameWon();
        return;
    }
    
    if (gameState.state === 'levelcomplete') {
        renderLevelComplete();
        return;
    }
    
    if (gameState.state === 'gameover') {
        renderGameOver();
        return;
    }
    
    ctx.save();
    
    // Render walls
    const walls = getWalls();
    for (const wall of walls) {
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.moveTo(wall.points[0][0], wall.points[0][1]);
        for (let i = 1; i < wall.points.length; i++) {
            ctx.lineTo(wall.points[i][0], wall.points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    // Render platforms
    const platforms = getPlatforms();
    for (const platform of platforms) {
        const isTarget = gameState.currentCargo === platform.id;
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
    
    // Render ship (except during explosion)
    if (gameState.state !== 'exploding') {
        ctx.save();
        ctx.translate(getShip().x, getShip().y);
        ctx.rotate(getShip().angle);
        
        // Render thrust
        if (getShip().thrusting) {
            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(-6, getShip().size / 2);
            ctx.lineTo(0, getShip().size / 2 + 15);
            ctx.lineTo(6, getShip().size / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        // Render ship body
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -getShip().size / 2);
        ctx.lineTo(-getShip().size / 2, getShip().size / 2);
        ctx.lineTo(getShip().size / 2, getShip().size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Render particles
    for (const particle of gameState.particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    
    // Render touch indicator
    if (gameState.state === 'playing') {
        renderTouchIndicator();
    }
    
    ctx.restore();
    
    // Render pause screen
    if (gameState.state === 'paused') {
        renderPauseScreen();
    }
}

// Render menu screen
function renderMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#fff';
    const titleFontSize = isMobile ? 'bold 36px' : 'bold 64px';
    ctx.font = `${titleFontSize} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRAVITY CARGO', canvas.width / 2, canvas.height * 0.25);
    
    // Subtitle
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('A Retro Physics Puzzler', canvas.width / 2, canvas.height * 0.25 + 40);
    
    // Menu options
    const startY = canvas.height * 0.5;
    const spacing = Math.min(70, canvas.height * 0.15); // Scale spacing with screen height
    const buttonWidth = Math.min(300, canvas.width * 0.8);
    const buttonHeight = 50;
    
    menu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === menu.selectedOption;
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
    
    // Footer
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Idee: Andreas Weber | Spec: Claude Sonnet 4.5 | Code: Claude Code',
                 canvas.width / 2, canvas.height - 20);
}

// Render pause screen
function renderPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height * 0.2);

    // Level indicator to show current progress
    const totalLevels = getLevelTemplates().length;
    ctx.font = '24px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText(`LEVEL ${gameState.level} / ${totalLevels}`, canvas.width / 2, canvas.height * 0.2 + 50);
    ctx.fillStyle = '#fff';
    
    // Menu options
    const startY = canvas.height * 0.45;
    const spacing = Math.min(70, canvas.height * 0.15);
    const buttonWidth = Math.min(280, canvas.width * 0.7);
    const buttonHeight = 50;
    
    pauseMenu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === pauseMenu.selectedOption;
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
    
    // Instructions
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('ESC/P zum Fortsetzen', canvas.width / 2, canvas.height - 30);
}

// Render level complete screen
function renderLevelComplete() {
    ctx.fillStyle = '#fff';
    const completeFontSize = isMobile ? '32px' : '48px';
    ctx.font = `${completeFontSize} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height * 0.45);

    // Show how far the player is through the campaign
    const totalLevels = getLevelTemplates().length;
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText(`LEVEL ${gameState.level} / ${totalLevels}`, canvas.width / 2, canvas.height * 0.45 + 30);
    ctx.fillStyle = '#fff';

    ctx.font = '24px "Courier New"';
    ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height * 0.45 + 80);
}

// Render game over screen
function renderGameOver() {
    ctx.fillStyle = '#fff';
    ctx.font = '48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height * 0.4);
    ctx.font = '24px "Courier New"';
    ctx.fillText(`LEVEL: ${gameState.level}`, canvas.width / 2, canvas.height * 0.4 + 35);
    ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height * 0.4 + 70);
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height * 0.4 + 120);
}

// Render game won screen
function renderGameWon() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title - MOBILE OPTIMIERT
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GLÜCKWUNSCH!', canvas.width / 2, canvas.height / 6);
    
    ctx.font = '18px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ALLE LEVEL', canvas.width / 2, canvas.height / 6 + 50);
    ctx.fillText('ABGESCHLOSSEN', canvas.width / 2, canvas.height / 6 + 72);
    
    // Score - MOBILE OPTIMIERT
    const maxScore = getMaxScore();
    const percentage = Math.round((gameState.score / maxScore) * 100);
    const scoreY = canvas.height / 2 - 50;
    
    ctx.font = '28px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`DEIN SCORE: ${gameState.score}`, canvas.width / 2, scoreY);
    
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.fillText(`Maximal möglich: ${maxScore}`, canvas.width / 2, scoreY + 35);
    
    ctx.font = '22px "Courier New"';
    ctx.fillStyle = percentage === 100 ? '#0f0' : '#ff0';
    ctx.fillText(`${percentage}% erreicht`, canvas.width / 2, scoreY + 65);
    
    if (percentage === 100) {
        ctx.font = '18px "Courier New"';
        ctx.fillStyle = '#0f0';
        ctx.fillText('★ PERFEKT ★', canvas.width / 2, scoreY + 95);
    }
    
    // Credits - MOBILE OPTIMIERT
    const creditsY = canvas.height - 180;
    
    ctx.font = 'bold 16px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText('CREDITS', canvas.width / 2, creditsY);
    
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = '#aaa';
    const lineHeight = 18;
    let line = 0;
    
    ctx.fillText('Autor: Andreas Weber', canvas.width / 2, creditsY + 30 + (line++ * lineHeight));
    line++; // Empty line
    ctx.fillText('Entwickelt mit:', canvas.width / 2, creditsY + 30 + (line++ * lineHeight));
    ctx.fillText('Claude Sonnet 4.5', canvas.width / 2, creditsY + 30 + (line++ * lineHeight));
    ctx.fillText('Claude Code', canvas.width / 2, creditsY + 30 + (line++ * lineHeight));
    ctx.fillText('Roo Code', canvas.width / 2, creditsY + 30 + (line++ * lineHeight));
    
    // Instructions - MOBILE OPTIMIERT
    ctx.font = '14px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height - 30);
}

// Render touch indicator for mobile
function renderTouchIndicator() {
    const touchState = getTouchState();
    if (touchState.active) {
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(getShip().x, getShip().y);
        ctx.lineTo(touchState.x, touchState.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }
}
