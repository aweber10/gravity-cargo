import test from 'node:test';
import assert from 'node:assert/strict';

import {
    SCORE_ATTACK_LEVEL_NAMES,
    SCORE_ATTACK_STORAGE_KEY,
    finishScoreAttackRun,
    getScoreAttackLevelPool,
    getScoreAttackResult,
    shuffleLevels
} from '../src/score-attack.js';

test('score attack pool contains the selected desktop and mobile levels', () => {
    const pool = getScoreAttackLevelPool();

    assert.equal(pool.length, SCORE_ATTACK_LEVEL_NAMES.desktop.length + SCORE_ATTACK_LEVEL_NAMES.mobile.length);
    assert.deepEqual(
        pool.filter(level => level.source === 'desktop').map(level => level.name),
        SCORE_ATTACK_LEVEL_NAMES.desktop
    );
    assert.deepEqual(
        pool.filter(level => level.source === 'mobile').map(level => level.name),
        SCORE_ATTACK_LEVEL_NAMES.mobile
    );
});

test('score attack shuffle keeps every level exactly once', () => {
    const pool = getScoreAttackLevelPool();
    const shuffled = shuffleLevels(pool, () => 0.5);

    assert.equal(shuffled.length, pool.length);
    assert.deepEqual(
        new Set(shuffled.map(level => `${level.source}:${level.name}`)),
        new Set(pool.map(level => `${level.source}:${level.name}`))
    );
});

test('score attack high score only updates when current score is higher', () => {
    const storage = new Map([[SCORE_ATTACK_STORAGE_KEY, '5']]);
    globalThis.localStorage = {
        getItem: key => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value)
    };

    finishScoreAttackRun(3);
    assert.deepEqual(getScoreAttackResult(), {
        score: 3,
        highScore: 5,
        isNewHighScore: false
    });
    assert.equal(storage.get(SCORE_ATTACK_STORAGE_KEY), '5');

    finishScoreAttackRun(8);
    assert.deepEqual(getScoreAttackResult(), {
        score: 8,
        highScore: 8,
        isNewHighScore: true
    });
    assert.equal(storage.get(SCORE_ATTACK_STORAGE_KEY), '8');

    delete globalThis.localStorage;
});
