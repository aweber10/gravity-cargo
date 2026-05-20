import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getVisibleWorldBounds,
    resetCamera,
    screenToWorld,
    updateCamera,
    worldToScreen
} from '../src/camera.js';

const levelBounds = {
    left: 0,
    top: 0,
    right: 800,
    bottom: 600,
    width: 800,
    height: 600
};

const mobileCanvas = {
    width: 390,
    height: 844
};

test('mobile desktop-scroll camera scales level height to viewport height', () => {
    const camera = updateCamera({ x: 100, y: 300 }, levelBounds, mobileCanvas, true);

    assert.equal(camera.active, true);
    assert.equal(camera.scale, mobileCanvas.height / levelBounds.height);
    assert.equal(camera.visibleWorldWidth, mobileCanvas.width / camera.scale);
});

test('mobile desktop-scroll camera clamps to left and right bounds', () => {
    const leftCamera = updateCamera({ x: 20, y: 300 }, levelBounds, mobileCanvas, true);
    assert.equal(leftCamera.x, 0);

    const rightCamera = updateCamera({ x: 790, y: 300 }, levelBounds, mobileCanvas, true);
    assert.equal(rightCamera.x, levelBounds.right - rightCamera.visibleWorldWidth);
});

test('mobile desktop-scroll camera centers ship when possible', () => {
    const camera = updateCamera({ x: 400, y: 300 }, levelBounds, mobileCanvas, true);
    assert.equal(camera.x, 400 - camera.visibleWorldWidth / 2);
});

test('screen and world transforms round-trip with active camera', () => {
    updateCamera({ x: 400, y: 300 }, levelBounds, mobileCanvas, true);

    const screenPoint = worldToScreen(420, 310);
    const worldPoint = screenToWorld(screenPoint.x, screenPoint.y);

    assert.equal(Math.round(worldPoint.x), 420);
    assert.equal(Math.round(worldPoint.y), 310);
});

test('inactive camera uses identity transforms and full level bounds', () => {
    resetCamera();
    updateCamera({ x: 400, y: 300 }, levelBounds, { width: 800, height: 600 }, false);

    assert.deepEqual(screenToWorld(120, 140), { x: 120, y: 140 });
    assert.deepEqual(worldToScreen(120, 140), { x: 120, y: 140 });
    assert.deepEqual(getVisibleWorldBounds(), levelBounds);
});

test('contain camera scales level proportionally and centers it', () => {
    const camera = updateCamera(
        { x: 100, y: 300 },
        { left: 0, top: 0, right: 375, bottom: 667, width: 375, height: 667 },
        { width: 768, height: 1024 },
        'contain'
    );

    const expectedScale = 1024 / 667;
    const expectedRenderedWidth = 375 * expectedScale;

    assert.equal(camera.active, true);
    assert.equal(camera.mode, 'contain');
    assert.equal(camera.scale, expectedScale);
    assert.equal(camera.offsetX, (768 - expectedRenderedWidth) / 2);
    assert.equal(camera.offsetY, 0);
});

test('contain camera screen and world transforms round-trip with offsets', () => {
    updateCamera(
        { x: 100, y: 300 },
        { left: 0, top: 0, right: 375, bottom: 667, width: 375, height: 667 },
        { width: 768, height: 1024 },
        'contain'
    );

    const screenPoint = worldToScreen(187.5, 333.5);
    const worldPoint = screenToWorld(screenPoint.x, screenPoint.y);

    assert.equal(Math.round(worldPoint.x * 10) / 10, 187.5);
    assert.equal(Math.round(worldPoint.y * 10) / 10, 333.5);
});
