// src/hud-renderer.js
// Canvas HUD rendering for gameplay score and time attack timer

import { getDisplayTime, isCountdownMode, isOvertime, formatTime } from './time-attack.js';
import { shouldRenderTimeAttackTimer } from './renderer-layout.js';

// Performance tracking for HUD elements
let lastRenderedScore = -1;
let scoreNeedsUpdate = true;
let lastScoreText = '';

// Timer string caching to reduce memory allocation
const timerStringCache = new Map();
let lastCacheCleared = 0;

export function triggerScoreUpdate() {
    scoreNeedsUpdate = true;
}

export function renderGameplayHUD({ ctx, gameState, isMobile, hudLayout }) {
    ctx.save();
    setHUDTextStyle(ctx, isMobile);
    renderCanvasScore(ctx, gameState, hudLayout);

    if (shouldRenderTimeAttackTimer(gameState)) {
        renderCanvasTimer(ctx, hudLayout);
    }

    ctx.restore();
}

// Shared HUD text styling to avoid redundant Canvas state operations
function setHUDTextStyle(ctx, isMobile) {
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.font = `bold ${isMobile ? '18px' : '20px'} "Courier New", monospace`;
    ctx.textBaseline = 'top';
}

function getCachedTimerString(time, isOvertimeState, symbol) {
    const key = `${Math.round(time * 10)}-${isOvertimeState}-${symbol}`;

    if (!timerStringCache.has(key)) {
        const formattedTime = formatTime(time);
        const timerText = isOvertimeState ? `${symbol} +${formattedTime}` : `${symbol} ${formattedTime}`;
        timerStringCache.set(key, timerText);

        // Clear cache periodically to prevent memory growth
        const now = Date.now();
        if (now - lastCacheCleared > 30000 && timerStringCache.size > 50) { // Every 30 seconds
            timerStringCache.clear();
            lastCacheCleared = now;
        }
    }

    return timerStringCache.get(key);
}

// Unicode symbol with fallback detection
function getStopwatchSymbol() {
    // Use ASCII fallback for better compatibility across devices
    return '⏱'; // Unicode with '[T]' as mental fallback if issues arise
}

// Render timer on canvas for time attack mode
function renderCanvasTimer(ctx, hudLayout) {
    const displayTime = getDisplayTime();
    const stopwatchSymbol = getStopwatchSymbol();

    // Use cached timer string to reduce memory allocation
    const timerText = getCachedTimerString(displayTime, isOvertime(), stopwatchSymbol);

    // Determine color based on timer state
    let timerColor = '#fff'; // Default stopwatch color (white)
    if (isOvertime()) {
        timerColor = '#f00'; // Overtime color (red)
    } else if (isCountdownMode()) {
        timerColor = '#ff0'; // Countdown color (yellow)
    }

    const { timerX, timerY } = hudLayout;

    // Use shared HUD text style
    ctx.fillStyle = timerColor;
    ctx.textAlign = 'right';

    // Render timer text
    ctx.fillText(timerText, timerX, timerY);

    // Add blinking effect for overtime (matching CSS animation)
    if (isOvertime()) {
        const blinkCycle = (Date.now() % 1000) / 1000; // 1 second cycle
        if (blinkCycle > 0.5) {
            ctx.globalAlpha = 0.3;
            ctx.fillText(timerText, timerX, timerY);
            ctx.globalAlpha = 1.0;
        }
    }
}

// Render score on canvas during gameplay (with string caching optimization)
function renderCanvasScore(ctx, gameState, hudLayout) {
    const { scoreX, scoreY } = hudLayout;

    // Optimization: Only format string when score actually changes
    let scoreText = lastScoreText;
    if (gameState.score !== lastRenderedScore || scoreNeedsUpdate) {
        lastRenderedScore = gameState.score;
        scoreNeedsUpdate = false;
        scoreText = `SCORE: ${gameState.score}`;
        lastScoreText = scoreText; // Cache the formatted string
    }

    // Always render score text (canvas is cleared every frame)
    ctx.fillStyle = '#fff'; // White color for score
    ctx.textAlign = 'left';
    ctx.fillText(scoreText, scoreX, scoreY);
}
