// src/renderer.js
// Handles all rendering operations for the game

import { gameState } from './game-state.js';
import { getShip } from './ship-physics.js';
import { getCurrentLevel, getWalls, getPlatforms } from './level-manager.js';
import { isMobile } from './ui.js';

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
}

// Render level complete screen
function renderLevelComplete() {
    ctx.fillStyle = '#fff';
    const completeFontSize = isMobile ? '32px' : '48px';
    ctx.font = `${completeFontSize} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height * 0.45);
    ctx.font = '24px "Courier New"';
    ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height * 0.45 + 40);
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
    
    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 56px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GLÜCKWUNSCH!', canvas.width / 2, canvas.height / 5);
    
    ctx.font = '32px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ALLE LEVEL ABGESCHLOSSEN', canvas.width / 2, canvas.height / 5 + 70);
    
    // Score
    const maxScore = 10; // This should come from level-manager.js
    const percentage = Math.round((gameState.score / maxScore) * 100);
    const scoreY = canvas.height / 2 - 40;
    
    ctx.font = '36px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`DEIN SCORE: ${gameState.score}`, canvas.width / 2, scoreY);
    
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
    
    // Credits
    const creditsY = canvas.height - 200;
    
    ctx.font = 'bold 20px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText('CREDITS', canvas.width / 2, creditsY);
    
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#aaa';
    const lineHeight = 25;
    let line = 0;
    
    ctx.fillText('Autor: Andreas Weber', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    line++; // Empty line
    ctx.fillText('Entwickelt mit:', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Claude Sonnet 4.5', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Claude Code', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Roo Code', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    
    // Instructions
    ctx.font = '18px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height - 40);
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