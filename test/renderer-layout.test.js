import test from 'node:test';
import assert from 'node:assert/strict';

import {
    createDOMHUDLayout,
    createGameplayHUDLayout,
    createLevelScreenRect,
    shouldRenderGameplayHUD,
    shouldRenderTimeAttackTimer
} from '../src/renderer-layout.js';

test('gameplay HUD is only visible while playing', () => {
    assert.equal(shouldRenderGameplayHUD({ state: 'playing' }), true);
    assert.equal(shouldRenderGameplayHUD({ state: 'menu' }), false);
    assert.equal(shouldRenderGameplayHUD({ state: 'gameover' }), false);
});

test('time attack timer is only visible during time attack gameplay', () => {
    assert.equal(shouldRenderTimeAttackTimer({ state: 'playing', mode: 'timeattack' }), true);
    assert.equal(shouldRenderTimeAttackTimer({ state: 'playing', mode: 'normal' }), false);
    assert.equal(shouldRenderTimeAttackTimer({ state: 'gameover', mode: 'timeattack' }), false);
});

test('gameplay HUD anchors to level bounds', () => {
    const layout = createGameplayHUDLayout({
        left: 0,
        top: 0,
        right: 800,
        bottom: 600,
        width: 800,
        height: 600
    }, false);

    assert.deepEqual(layout, {
        scoreX: 30,
        scoreY: 30,
        timerX: 770,
        timerY: 30
    });
});

test('level screen rect maps world bounds into container coordinates', () => {
    const rect = createLevelScreenRect(
        { left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 },
        { left: 100, top: 50, width: 1280, height: 720 },
        { left: 0, top: 0 },
        { width: 1280, height: 720 }
    );

    assert.deepEqual(rect, {
        left: 100,
        top: 50,
        right: 900,
        bottom: 650,
        width: 800,
        height: 600
    });
});

test('DOM HUD layout places fuel below the level when space is available', () => {
    const layout = createDOMHUDLayout(
        { left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 },
        { width: 1280, height: 720 },
        false
    );

    assert.deepEqual(layout, {
        left: 30,
        right: 510,
        bottom: 'auto',
        top: 612
    });
});

test('DOM HUD layout falls back above lower platforms when space is tight', () => {
    const layout = createDOMHUDLayout(
        { left: 0, top: 0, right: 375, bottom: 667, width: 375, height: 667 },
        { width: 375, height: 667 },
        true
    );

    assert.deepEqual(layout, {
        left: 20,
        right: 20,
        bottom: 'auto',
        top: 56
    });
});
