// src/camera.js
// Camera and viewport transforms for mobile desktop-level side scrolling

const cameraState = {
    active: false,
    x: 0,
    y: 0,
    scale: 1,
    visibleWorldWidth: 0,
    visibleWorldHeight: 0,
    levelBounds: null
};

export function getCameraState() {
    return { ...cameraState, levelBounds: cameraState.levelBounds ? { ...cameraState.levelBounds } : null };
}

export function updateCamera(ship, levelBounds, canvas, isMobileDesktopScrollMode) {
    if (!levelBounds || !canvas) {
        resetCamera();
        return getCameraState();
    }

    if (!isMobileDesktopScrollMode) {
        cameraState.active = false;
        cameraState.x = levelBounds.left;
        cameraState.y = levelBounds.top;
        cameraState.scale = 1;
        cameraState.visibleWorldWidth = canvas.width;
        cameraState.visibleWorldHeight = canvas.height;
        cameraState.levelBounds = { ...levelBounds };
        return getCameraState();
    }

    const scale = canvas.height / levelBounds.height;
    const visibleWorldWidth = canvas.width / scale;
    const visibleWorldHeight = canvas.height / scale;
    const minX = levelBounds.left;
    const maxX = Math.max(levelBounds.left, levelBounds.right - visibleWorldWidth);
    const targetX = ship ? ship.x - visibleWorldWidth / 2 : levelBounds.left;

    cameraState.active = true;
    cameraState.x = clamp(targetX, minX, maxX);
    cameraState.y = levelBounds.top;
    cameraState.scale = scale;
    cameraState.visibleWorldWidth = visibleWorldWidth;
    cameraState.visibleWorldHeight = visibleWorldHeight;
    cameraState.levelBounds = { ...levelBounds };

    return getCameraState();
}

export function resetCamera() {
    cameraState.active = false;
    cameraState.x = 0;
    cameraState.y = 0;
    cameraState.scale = 1;
    cameraState.visibleWorldWidth = 0;
    cameraState.visibleWorldHeight = 0;
    cameraState.levelBounds = null;
}

export function getSceneTransform() {
    return getCameraState();
}

export function getVisibleWorldBounds() {
    if (!cameraState.active || !cameraState.levelBounds) {
        return cameraState.levelBounds ? { ...cameraState.levelBounds } : null;
    }

    return {
        left: cameraState.x,
        top: cameraState.y,
        right: cameraState.x + cameraState.visibleWorldWidth,
        bottom: cameraState.y + cameraState.visibleWorldHeight,
        width: cameraState.visibleWorldWidth,
        height: cameraState.visibleWorldHeight
    };
}

export function screenToWorld(x, y, state = cameraState) {
    if (!state.active) return { x, y };
    return {
        x: x / state.scale + state.x,
        y: y / state.scale + state.y
    };
}

export function worldToScreen(x, y, state = cameraState) {
    if (!state.active) return { x, y };
    return {
        x: (x - state.x) * state.scale,
        y: (y - state.y) * state.scale
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
