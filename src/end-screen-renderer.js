// src/end-screen-renderer.js
// Rendering for level-complete, game-over, and game-won screens

import { formatTime, formatCompactTime, getLastResult, getCompactOverviewData } from './time-attack.js';

// Fireworks system for GameWon screen
let fireworksState = {
    active: false,
    startTime: 0,
    particles: [],
    explosions: []
};

class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.gravity = 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        this.vx *= 0.99; // air resistance
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

export function resetFireworks() {
    fireworksState.active = false;
    fireworksState.hasStarted = false;
    fireworksState.particles = [];
    fireworksState.explosions = [];
}

export function renderLevelComplete({ ctx, canvas, gameState, isMobile, levelTemplates }) {
    ctx.fillStyle = '#fff';
    const completeFontSize = isMobile ? '32px' : '48px';
    ctx.font = `${completeFontSize} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height * 0.45);

    // Show how far the player is through the campaign
    const completeTotalLevels = levelTemplates.length;
    const completedLevel = gameState.lastCompletedLevel || Math.max(1, gameState.level - 1);
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText(`LEVEL ${completedLevel} / ${completeTotalLevels}`, canvas.width / 2, canvas.height * 0.45 + 30);
    ctx.fillStyle = '#fff';

    let yOffset = 80;

    // Render time attack specific info
    if (gameState.mode === 'timeattack') {
        const result = getLastResult();

        // Current time
        ctx.font = '24px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.fillText(`DEINE ZEIT: ${formatTime(result.levelTime)}`, canvas.width / 2, canvas.height * 0.45 + yOffset);
        yOffset += 35;

        // Personal best (if exists and different)
        if (result.personalBest && !result.isNewRecord) {
            ctx.font = '18px "Courier New"';
            ctx.fillStyle = '#888';
            ctx.fillText(`BESTZEIT: ${formatTime(result.personalBest)}`, canvas.width / 2, canvas.height * 0.45 + yOffset);
            yOffset += 25;
        }

        // Performance message (nur wenn vorhanden)
        if (result.message) {
            ctx.font = '20px "Courier New"';
            if (result.isNewRecord) {
                ctx.fillStyle = '#0f0'; // Green for new record
            } else if (result.message === "Nicht übel gar nicht übel") {
                ctx.fillStyle = '#ff0'; // Yellow for close time
            } else if (result.message.includes("% abgeschlossen")) {
                ctx.fillStyle = '#f80'; // Orange for incomplete cargo (percentage)
            } else {
                ctx.fillStyle = '#f80'; // Orange for slower time
            }
            ctx.fillText(result.message, canvas.width / 2, canvas.height * 0.45 + yOffset);
            yOffset += 40;
        }
    } else {
        // Normal mode: show score
        ctx.font = '24px "Courier New"';
        ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height * 0.45 + yOffset);
        yOffset += 40;
    }
}

export function renderGameOver({ ctx, canvas, gameState, isMobile }) {
    ctx.fillStyle = '#fff';
    ctx.font = isMobile ? '36px' : '48px';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height * 0.3);

    ctx.font = isMobile ? '18px' : '24px';
    ctx.fillText(`LEVEL: ${gameState.level}`, canvas.width / 2, canvas.height * 0.3 + (isMobile ? 50 : 60));

    if (gameState.mode === 'timeattack') {
        renderTimeAttackGameOverDetails({ ctx, canvas, gameState, isMobile });
    } else {
        // Normal mode: show score
        ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height * 0.3 + (isMobile ? 80 : 100));
    }

    ctx.font = isMobile ? '16px' : '20px';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height - (isMobile ? 40 : 60));
}

function renderTimeAttackGameOverDetails({ ctx, canvas, gameState, isMobile }) {
    const result = getLastResult();
    if (!result || !result.levelTime) return;

    // Zeit anzeigen (immer, gleiche Position wie Success-Screen)
    ctx.font = isMobile ? '18px' : '24px';
    ctx.fillStyle = '#fff';
    ctx.fillText(`DEINE ZEIT: ${formatTime(result.levelTime)}`, canvas.width / 2, canvas.height * 0.3 + (isMobile ? 120 : 140));

    let yOffset = isMobile ? 145 : 170;

    // Bestzeit und Message (conditional)
    if (result.isFullyComplete) {
        if (result.personalBest && !result.isNewRecord) {
            ctx.font = isMobile ? '14px' : '18px';
            ctx.fillStyle = '#888';
            ctx.fillText(`BESTZEIT: ${formatTime(result.personalBest)}`, canvas.width / 2, canvas.height * 0.3 + yOffset);
            yOffset += isMobile ? 25 : 30;
        }
        if (result.message) {
            ctx.font = isMobile ? '16px' : '20px';
            ctx.fillStyle = result.isNewRecord ? '#0f0' : '#ff0';
            ctx.fillText(result.message, canvas.width / 2, canvas.height * 0.3 + yOffset);
            yOffset += isMobile ? 25 : 30;
        }
    } else {
        // Prozentuale Completion-Message
        ctx.font = isMobile ? '16px' : '20px';
        ctx.fillStyle = '#f80'; // Orange für partielle Completion
        ctx.fillText(result.message, canvas.width / 2, canvas.height * 0.3 + yOffset);
        yOffset += isMobile ? 25 : 30;
    }

    // Show completed levels from current session
    if (gameState.level > 1) {
        const overviewData = getCompactOverviewData(gameState.level - 1);
        const completedLevels = overviewData.levels.filter(data => data.isFullyComplete);

        if (completedLevels.length > 0) {
            yOffset += isMobile ? 10 : 15;
            ctx.font = isMobile ? '14px' : '16px';
            ctx.fillStyle = '#aaa';
            ctx.fillText('ABGESCHLOSSENE LEVEL:', canvas.width / 2, canvas.height * 0.3 + yOffset);
            yOffset += isMobile ? 20 : 25;

            // Create compact list of completed levels
            const levelTexts = completedLevels.map(data =>
                `Level ${data.number}: ${formatCompactTime(data.time)}`
            );

            // Split into lines if too many levels
            const maxPerLine = isMobile ? 2 : 3;
            for (let i = 0; i < levelTexts.length; i += maxPerLine) {
                const lineTexts = levelTexts.slice(i, i + maxPerLine);
                const lineText = lineTexts.join(', ');

                ctx.font = isMobile ? '12px' : '14px';
                ctx.fillStyle = '#0ff';
                ctx.fillText(lineText, canvas.width / 2, canvas.height * 0.3 + yOffset);
                yOffset += isMobile ? 18 : 22;
            }
        }
    }
}

export function renderGameWon({ ctx, canvas, gameState, isMobile, maxScore }) {
    // Start fireworks animation on first render
    if (!fireworksState.active && !fireworksState.hasStarted) {
        startFireworks(canvas, isMobile);
        fireworksState.hasStarted = true;
    }

    // Update fireworks
    updateFireworks();

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

    if (gameState.mode === 'timeattack') {
        // Show time attack overview for all levels
        renderTimeAttackOverview({ ctx, canvas, gameState, isMobile, mode: 'complete', startY: canvas.height / 6 + 110 });
    } else {
        // Score - MOBILE OPTIMIERT
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

    // Render fireworks animation on top
    renderFireworks(ctx);
}

function startFireworks(canvas, isMobile) {
    fireworksState.active = true;
    fireworksState.startTime = Date.now();
    fireworksState.particles = [];
    fireworksState.explosions = [
        { time: 0, x: canvas.width * 0.3, y: canvas.height * 0.4 },
        { time: 500, x: canvas.width * 0.7, y: canvas.height * 0.3 },
        { time: 1000, x: canvas.width * 0.5, y: canvas.height * 0.35 },
        { time: 1500, x: canvas.width * 0.2, y: canvas.height * 0.45 },
        { time: 2000, x: canvas.width * 0.8, y: canvas.height * 0.4 }
    ];
    fireworksState.isMobile = isMobile;
}

function createExplosion(x, y) {
    const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff', '#ff00ff'];
    const particleCount = fireworksState.isMobile ? 15 : 25;

    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const life = 60 + Math.random() * 40;

        fireworksState.particles.push(new Particle(x, y, vx, vy, color, life));
    }
}

function updateFireworks() {
    if (!fireworksState.active) return;

    const elapsed = Date.now() - fireworksState.startTime;

    // Check for new explosions
    fireworksState.explosions.forEach(explosion => {
        if (!explosion.triggered && elapsed >= explosion.time) {
            createExplosion(explosion.x, explosion.y);
            explosion.triggered = true;
        }
    });

    // Update particles with optimized removal for better performance
    for (let i = fireworksState.particles.length - 1; i >= 0; i--) {
        const particle = fireworksState.particles[i];
        particle.update();

        if (particle.isDead()) {
            // Swap with last element and pop (more efficient than filter)
            fireworksState.particles[i] = fireworksState.particles[fireworksState.particles.length - 1];
            fireworksState.particles.pop();
        }
    }

    // End fireworks after 3 seconds or when no particles left
    if (elapsed > 3000 || fireworksState.particles.length === 0) {
        fireworksState.active = false;
    }
}

function renderFireworks(ctx) {
    if (!fireworksState.active) return;

    fireworksState.particles.forEach(particle => particle.render(ctx));
}

function renderTimeAttackOverview({ ctx, canvas, gameState, isMobile, mode, startY }) {
    const maxLevel = mode === 'partial' ? gameState.level - 1 : null;
    const overviewData = getCompactOverviewData(maxLevel);

    if (overviewData.levels.length === 0) {
        // Show fallback message for no data
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = isMobile ? '14px' : '16px';
        ctx.fillStyle = '#888';
        ctx.fillText('Keine Zeitdaten verfügbar', canvas.width / 2, startY + 40);
        ctx.restore();
        return;
    }

    ctx.save();
    ctx.textAlign = 'center';

    // Title
    ctx.font = isMobile ? '14px' : '16px';
    ctx.fillStyle = '#0ff';
    const title = mode === 'partial' ? 'ERREICHTE ZEITEN' : 'ZEITÜBERSICHT';
    ctx.fillText(title, canvas.width / 2, startY);

    // Calculate responsive grid layout
    const levelsPerRow = isMobile ? 2 : Math.min(4, overviewData.levels.length);
    const rows = Math.ceil(overviewData.levels.length / levelsPerRow);
    const rowHeight = isMobile ? 18 : 20;
    const gridStartY = startY + 25;

    // Adjust for very small mobile screens
    const isVerySmallScreen = isMobile && canvas.height < 600;
    const adjustedRowHeight = isVerySmallScreen ? 16 : rowHeight;
    const adjustedFontSize = isVerySmallScreen ? '12px' : (isMobile ? '13px' : '15px');

    // Draw semi-transparent background box
    const boxPadding = 15;
    const boxHeight = rows * adjustedRowHeight + 50; // Extra space for summary
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(
        canvas.width * 0.05,
        gridStartY - 10,
        canvas.width * 0.9,
        boxHeight
    );

    // Render level times in grid
    ctx.font = adjustedFontSize;
    ctx.textAlign = 'left';

    for (let i = 0; i < overviewData.levels.length; i++) {
        const level = overviewData.levels[i];
        const row = Math.floor(i / levelsPerRow);
        const col = i % levelsPerRow;

        // Calculate position with better spacing
        const gridWidth = canvas.width * 0.8;
        const cellWidth = gridWidth / levelsPerRow;
        const x = (canvas.width - gridWidth) / 2 + col * cellWidth;
        const y = gridStartY + row * adjustedRowHeight;

        // Render level entry
        const levelText = `L${level.number}: ${level.formatted}`;

        // Completion-Display für partielle Completions
        const completionDisplay = level.completionPercentage < 100
            ? `(${level.completionPercentage}%)`
            : '';

        // Marker für Session-Records (nur bei 100%)
        const marker = level.isSessionRecord && level.isFullyComplete ? '*' : '';

        const displayText = levelText + completionDisplay + marker;

        // Farbkodierung
        if (level.isSessionRecord && level.isFullyComplete) {
            ctx.fillStyle = '#0f0'; // Grün für echte Rekorde
        } else if (!level.isFullyComplete) {
            ctx.fillStyle = '#f80'; // Orange für partielle Completion
        } else {
            ctx.fillStyle = '#fff'; // Weiß für normale vollständige Zeiten
        }

        ctx.fillText(displayText, x, y);
    }

    // Summary line
    const summaryY = gridStartY + rows * adjustedRowHeight + 20;
    ctx.textAlign = 'center';
    ctx.font = adjustedFontSize;

    let summaryText = `${overviewData.summary.totalLevels} Level`;
    if (overviewData.summary.sessionRecords > 0) {
        summaryText += ` | ${overviewData.summary.sessionRecords} Rekorde *`;
    }
    summaryText += ` | ${overviewData.summary.formattedTotal}`;

    ctx.fillStyle = '#ff0';
    ctx.fillText(summaryText, canvas.width / 2, summaryY);

    ctx.restore();
}
