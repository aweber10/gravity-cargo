import test from 'node:test';
import assert from 'node:assert/strict';

import { asteroidManager, isAsteroidOffscreenPosition } from '../src/asteroid-manager.js';

const bounds = {
    left: 0,
    top: 0,
    right: 800,
    bottom: 600
};

test('asteroid offscreen check follows level bounds with buffer', () => {
    assert.equal(isAsteroidOffscreenPosition(400, 300, bounds), false);
    assert.equal(isAsteroidOffscreenPosition(-99, 300, bounds), false);
    assert.equal(isAsteroidOffscreenPosition(-101, 300, bounds), true);
    assert.equal(isAsteroidOffscreenPosition(901, 300, bounds), true);
    assert.equal(isAsteroidOffscreenPosition(400, 701, bounds), true);
});

test('asteroid manager clears cyclic pattern state for levels without asteroids', () => {
    asteroidManager.initLevel({
        asteroidPattern: [
            { spawn: [0, 0], velocity: [1, 0], size: 10, delay: 100 }
        ]
    }, bounds);

    assert.equal(asteroidManager.hasAsteroids(), true);

    asteroidManager.initLevel({
        walls: [],
        platforms: []
    }, bounds);

    assert.equal(asteroidManager.hasAsteroids(), false);
    assert.deepEqual(asteroidManager.getActiveAsteroids(), []);
    assert.equal(asteroidManager.getDebugInfo(), null);
});
