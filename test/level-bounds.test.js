import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateLevelBounds } from '../src/level-bounds.js';

test('calculateLevelBounds derives desktop bounds from wall points', () => {
    const level = {
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]] },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]] }
        ]
    };

    assert.deepEqual(calculateLevelBounds(level, false), {
        left: 0,
        top: 0,
        right: 800,
        bottom: 600,
        width: 800,
        height: 600
    });
});

test('calculateLevelBounds falls back to mobile level size without geometry', () => {
    assert.deepEqual(calculateLevelBounds(null, true), {
        left: 0,
        top: 0,
        right: 375,
        bottom: 667,
        width: 375,
        height: 667
    });
});
