// src/time-attack.js
// Zeitrennen-Modus: Timer-System und Bestzeit-Management

import { getMaxLevelCount } from './level-manager.js';
import { isMobile } from './device-detection.js';

// Zeitrennen State
export const timeAttackState = {
    isActive: false,
    currentRun: {
        levelStartTime: null,
        displayTime: 0,
        isCountdown: false,
        personalBest: null,
        isOvertime: false,
        pausedTime: 0
    },
    levelTimes: {},
    lastResult: {
        levelTime: null,
        personalBest: null,
        isNewRecord: false,
        message: ""
    },
    // Session tracking for overview screens
    sessionRecords: new Set(),        // Level-Nummern mit Session-Rekorden
    sessionLevelsCompleted: new Set(), // Erfolgreich abgeschlossene Level dieser Session
    sessionStartLevel: 1,             // Start-Level dieser Session
    sessionTimes: {},                 // Level → Zeit Mapping dieser Session
    sessionCompletions: {}            // Level → Prozent mapping (Cargo-Completion-Percentage)
};

// Storage-Key basierend auf Plattform
function getStorageKey() {
    const platform = isMobile ? 'mobile' : 'desktop';
    return `gravityCargoTimeAttack_${platform}`;
}

// Timer-Management
export function startLevelTimer(level) {
    if (!timeAttackState.isActive) return;
    
    // Reset current run state completely to prevent timer bugs
    resetCurrentRun();
    
    timeAttackState.currentRun.levelStartTime = performance.now();
    timeAttackState.currentRun.personalBest = getBestTime(level);
    timeAttackState.currentRun.isCountdown = !!timeAttackState.currentRun.personalBest;
    timeAttackState.currentRun.isOvertime = false;
    timeAttackState.currentRun.displayTime = timeAttackState.currentRun.personalBest || 0;
}

export function stopLevelTimer() {
    if (!timeAttackState.isActive || !timeAttackState.currentRun.levelStartTime) return null;
    
    const endTime = performance.now();
    const levelTime = (endTime - timeAttackState.currentRun.levelStartTime) / 1000;
    
    timeAttackState.currentRun.levelStartTime = null;
    return levelTime;
}

export function updateTimer() {
    if (!timeAttackState.isActive || !timeAttackState.currentRun.levelStartTime) return;
    
    const elapsed = (performance.now() - timeAttackState.currentRun.levelStartTime - timeAttackState.currentRun.pausedTime) / 1000;
    
    if (timeAttackState.currentRun.isCountdown) {
        const remaining = timeAttackState.currentRun.personalBest - elapsed;
        if (remaining <= 0) {
            timeAttackState.currentRun.isOvertime = true;
            timeAttackState.currentRun.displayTime = Math.abs(remaining);
        } else {
            timeAttackState.currentRun.isOvertime = false;
            timeAttackState.currentRun.displayTime = remaining;
        }
    } else {
        timeAttackState.currentRun.displayTime = elapsed;
    }
}

export function getDisplayTime() {
    return timeAttackState.currentRun.displayTime;
}

export function isCountdownMode() {
    return timeAttackState.currentRun.isCountdown;
}

export function isOvertime() {
    return timeAttackState.currentRun.isOvertime;
}

// Bestzeit-Management
export function loadBestTimes() {
    try {
        const data = localStorage.getItem(getStorageKey());
        timeAttackState.levelTimes = data ? JSON.parse(data) : {};
        
        // Initialisiere für alle verfügbaren Level
        initializeTimeAttackStorage();
    } catch (e) {
        console.error('Failed to load best times:', e);
        timeAttackState.levelTimes = {};
        initializeTimeAttackStorage();
    }
}

export function saveBestTime(level, time) {
    timeAttackState.levelTimes[`level${level}`] = time;
    try {
        localStorage.setItem(getStorageKey(), JSON.stringify(timeAttackState.levelTimes));
    } catch (e) {
        console.error('Failed to save best time:', e);
    }
}

export function getBestTime(level) {
    return timeAttackState.levelTimes[`level${level}`] || null;
}

export function hasPlayedBefore(level) {
    return timeAttackState.levelTimes[`level${level}`] !== null && 
           timeAttackState.levelTimes[`level${level}`] !== undefined;
}

function initializeTimeAttackStorage() {
    const maxLevel = getMaxLevelCount();
    let hasChanges = false;
    
    for (let i = 1; i <= maxLevel; i++) {
        const levelKey = `level${i}`;
        if (!(levelKey in timeAttackState.levelTimes)) {
            timeAttackState.levelTimes[levelKey] = null;
            hasChanges = true;
        }
    }
    
    if (hasChanges) {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(timeAttackState.levelTimes));
        } catch (e) {
            console.error('Failed to initialize time attack storage:', e);
        }
    }
}

// Bewertungslogik
export function evaluateTime(currentTime, level, completionPercentage = 100) {
    const isFullyComplete = completionPercentage === 100;
    const bestTime = getBestTime(level);
    const isFirstTime = bestTime === null;
    const isNewRecord = !isFirstTime && currentTime < bestTime;
    
    let message = "";
    
    if (isFullyComplete) {
        // Bestehende Logic für 100% Completion
        if (isFirstTime) {
            message = "";
        } else if (isNewRecord) {
            message = "Das war Spitze!";
        } else {
            const timeDifference = currentTime - bestTime;
            const percentage = (timeDifference / bestTime) * 100;
            
            if (percentage <= 10) {
                message = "Nicht übel gar nicht übel";
            } else {
                message = "Das geht auch schneller";
            }
        }
    } else {
        // Neue prozentuale Completion-Message
        message = `Level ${completionPercentage}% abgeschlossen`;
    }
    
    timeAttackState.lastResult = {
        levelTime: currentTime,
        completionPercentage: completionPercentage,
        isFullyComplete: isFullyComplete,
        personalBest: isFirstTime ? (isFullyComplete ? currentTime : null) : (isNewRecord && isFullyComplete ? currentTime : bestTime),
        isNewRecord: isNewRecord && isFullyComplete, // Nur bei vollständiger Completion
        isFirstTime: isFirstTime,
        message: message
    };
    
    // Session-Tracking für Übersichtsscreens
    trackLevelCompletion(level, currentTime, completionPercentage);
    
    // Neue Bestzeit nur bei vollständiger Cargo-Completion speichern
    if (isFullyComplete && (isFirstTime || isNewRecord)) {
        saveBestTime(level, currentTime);
    }
    
    return timeAttackState.lastResult;
}

// Time formatting cache for performance optimization
const timeFormatCache = new Map();
const compactTimeFormatCache = new Map();

// Zeit-Formatierung with caching for better performance
export function formatTime(timeInSeconds) {
    if (timeInSeconds === null || timeInSeconds === undefined) return "--:--.-";
    
    // Round to tenths for cache key consistency
    const roundedTime = Math.round(timeInSeconds * 10) / 10;
    
    if (timeFormatCache.has(roundedTime)) {
        return timeFormatCache.get(roundedTime);
    }
    
    const minutes = Math.floor(roundedTime / 60);
    const seconds = Math.floor(roundedTime % 60);
    const tenths = Math.floor((roundedTime % 1) * 10);
    
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
    
    // Cache result, but limit cache size to prevent memory leaks
    if (timeFormatCache.size > 1000) {
        timeFormatCache.clear();
    }
    timeFormatCache.set(roundedTime, formatted);
    
    return formatted;
}

// Kompakte Zeit-Formatierung für Übersichtsscreens (Sekunden mit Zehntel) with caching
export function formatCompactTime(timeInSeconds) {
    if (timeInSeconds === null || timeInSeconds === undefined) return "--.-s";
    
    // Round to tenths for cache key consistency
    const roundedTime = Math.round(timeInSeconds * 10) / 10;
    
    if (compactTimeFormatCache.has(roundedTime)) {
        return compactTimeFormatCache.get(roundedTime);
    }
    
    const formatted = `${roundedTime.toFixed(1)}s`;
    
    // Cache result, but limit cache size to prevent memory leaks
    if (compactTimeFormatCache.size > 1000) {
        compactTimeFormatCache.clear();
    }
    compactTimeFormatCache.set(roundedTime, formatted);
    
    return formatted;
}

// Zeitrennen-Modus Aktivierung
export function activateTimeAttack() {
    timeAttackState.isActive = true;
    startNewSession();
    loadBestTimes();
}

export function deactivateTimeAttack() {
    timeAttackState.isActive = false;
    timeAttackState.currentRun.levelStartTime = null;
}

export function isTimeAttackActive() {
    return timeAttackState.isActive;
}

// Utilities
export function getLastResult() {
    return timeAttackState.lastResult;
}

export function resetCurrentRun() {
    timeAttackState.currentRun = {
        levelStartTime: null,
        displayTime: 0,
        isCountdown: false,
        personalBest: null,
        isOvertime: false,
        pausedTime: 0
    };
}

// Session Management Functions
export function startNewSession(startLevel = 1) {
    timeAttackState.sessionRecords.clear();
    timeAttackState.sessionLevelsCompleted.clear();
    timeAttackState.sessionStartLevel = startLevel;
    timeAttackState.sessionTimes = {};
    timeAttackState.sessionCompletions = {}; // Reset completion percentages
}

export function trackLevelCompletion(level, time, completionPercentage = 100) {
    timeAttackState.sessionLevelsCompleted.add(level);
    timeAttackState.sessionTimes[level] = time;
    timeAttackState.sessionCompletions[level] = completionPercentage;
    
    // Nur 100% Completions als Session-Records tracken
    const previousBest = getBestTime(level);
    const isFullyComplete = completionPercentage === 100;
    if (isFullyComplete && (previousBest === null || time < previousBest)) {
        timeAttackState.sessionRecords.add(level);
    }
}

export function isSessionRecord(level) {
    return timeAttackState.sessionRecords.has(level);
}

export function getSessionCompletions() {
    return Array.from(timeAttackState.sessionLevelsCompleted).sort((a, b) => a - b);
}

export function getSessionRecordCount() {
    return timeAttackState.sessionRecords.size;
}

export function getCompactOverviewData(maxLevel = null) {
    const completedLevels = getSessionCompletions();
    const levelsToShow = maxLevel ? completedLevels.filter(level => level <= maxLevel) : completedLevels;
    
    // Handle edge case: no completed levels
    if (levelsToShow.length === 0) {
        return {
            levels: [],
            summary: {
                totalLevels: 0,
                totalTime: 0,
                formattedTotal: "0.0s",
                sessionRecords: 0,
                isComplete: false
            }
        };
    }
    
    // Build level data
    const levels = levelsToShow.map(level => ({
        number: level,
        time: timeAttackState.sessionTimes[level],
        formatted: formatCompactTime(timeAttackState.sessionTimes[level]),
        completionPercentage: timeAttackState.sessionCompletions[level] || 100, // Default 100 for backward compatibility
        isSessionRecord: isSessionRecord(level),
        isFullyComplete: (timeAttackState.sessionCompletions[level] || 100) === 100,
        wasCompleted: true
    }));
    
    // Calculate total time
    const totalTime = levelsToShow.reduce((sum, level) => {
        return sum + (timeAttackState.sessionTimes[level] || 0);
    }, 0);
    
    // Build summary
    const summary = {
        totalLevels: levelsToShow.length,
        totalTime: totalTime,
        formattedTotal: formatCompactTime(totalTime),
        sessionRecords: levelsToShow.filter(level => isSessionRecord(level)).length,
        isComplete: maxLevel === null && levelsToShow.length === getMaxLevelCount()
    };
    
    return {
        levels: levels,
        summary: summary
    };
}

// Pause handling
let pauseStartTime = null;

export function pauseTimer() {
    if (!timeAttackState.isActive || !timeAttackState.currentRun.levelStartTime) return;
    pauseStartTime = performance.now();
}

export function resumeTimer() {
    if (!timeAttackState.isActive || !pauseStartTime) return;
    const pauseDuration = performance.now() - pauseStartTime;
    timeAttackState.currentRun.pausedTime += pauseDuration;
    pauseStartTime = null;
}