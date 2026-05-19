// src/score-attack.js
// Mobile-only score attack mode using a shuffled pool of selected levels

import { levelTemplates as desktopLevels } from './levels.js?v=12';
import { levelTemplates as mobileLevels } from './levels-mobile.js?v=12';

export const SCORE_ATTACK_STORAGE_KEY = 'gravityCargo_scoreAttackHighScore';

export const SCORE_ATTACK_LEVEL_NAMES = {
    desktop: [
        'Curved Corridor',
        'The Maze',
        'Crossroads',
        'The Cavern',
        'Precision',
        'Organic Cathedral',
        'Asteroid Gauntlet',
        'Fuel Precision'
    ],
    mobile: [
        'Serpent Corridor',
        'The Hourglass',
        'Snake Path',
        'The Gauntlet',
        'Organic Vertical Maze',
        'Asteroid Field',
        'Cosmic Maze'
    ]
};

const scoreAttackState = {
    remainingLevels: [],
    currentLevel: null,
    lastScore: 0,
    highScore: 0,
    isNewHighScore: false
};

export function isScoreAttackMode(gameState) {
    return gameState.mode === 'scoreattack';
}

export function startScoreAttackRun() {
    scoreAttackState.remainingLevels = shuffleLevels(getScoreAttackLevelPool());
    scoreAttackState.currentLevel = null;
    scoreAttackState.lastScore = 0;
    scoreAttackState.highScore = loadScoreAttackHighScore();
    scoreAttackState.isNewHighScore = false;
}

export function getNextScoreAttackLevel() {
    if (scoreAttackState.remainingLevels.length === 0) {
        scoreAttackState.remainingLevels = shuffleLevels(getScoreAttackLevelPool());
    }

    scoreAttackState.currentLevel = scoreAttackState.remainingLevels.pop();
    return scoreAttackState.currentLevel;
}

export function finishScoreAttackRun(score) {
    const previousBest = loadScoreAttackHighScore();
    const isNewHighScore = score > previousBest;
    const highScore = isNewHighScore ? score : previousBest;

    if (isNewHighScore) {
        saveScoreAttackHighScore(score);
    }

    scoreAttackState.lastScore = score;
    scoreAttackState.highScore = highScore;
    scoreAttackState.isNewHighScore = isNewHighScore;

    return getScoreAttackResult();
}

export function getScoreAttackResult() {
    return {
        score: scoreAttackState.lastScore,
        highScore: scoreAttackState.highScore,
        isNewHighScore: scoreAttackState.isNewHighScore
    };
}

export function loadScoreAttackHighScore() {
    try {
        const value = localStorage.getItem(SCORE_ATTACK_STORAGE_KEY);
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    } catch (error) {
        console.error('Failed to load score attack high score:', error);
        return 0;
    }
}

export function saveScoreAttackHighScore(score) {
    try {
        localStorage.setItem(SCORE_ATTACK_STORAGE_KEY, String(score));
    } catch (error) {
        console.error('Failed to save score attack high score:', error);
    }
}

export function getScoreAttackLevelPool() {
    return [
        ...createPoolEntries('desktop', desktopLevels, SCORE_ATTACK_LEVEL_NAMES.desktop),
        ...createPoolEntries('mobile', mobileLevels, SCORE_ATTACK_LEVEL_NAMES.mobile)
    ];
}

export function shuffleLevels(levels, random = Math.random) {
    const shuffled = [...levels];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createPoolEntries(source, levels, names) {
    return names.map(name => {
        const level = levels.find(candidate => candidate.name === name);
        if (!level) {
            throw new Error(`Score attack level not found: ${source}:${name}`);
        }
        return {
            source,
            levelNumber: level.levelNumber,
            name: level.name
        };
    });
}
