// src/camera.js
// Camera and viewport transforms for mobile desktop-level side scrolling

const cameraState = {
    active: false,
    mode: 'none',
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    visibleWorldWidth: 0,
    visibleWorldHeight: 0,
    levelBounds: null
};

export function getCameraState() {
    return { ...cameraState, levelBounds: cameraState.levelBounds ? { ...cameraState.levelBounds } : null };
}

export function updateCamera(ship, levelBounds, canvas, modeOrIsMobileDesktopScrollMode) {
    if (!levelBounds || !canvas) {
        resetCamera();
        return getCameraState();
    }

    const mode = normalizeCameraMode(modeOrIsMobileDesktopScrollMode);

    if (mode === 'none') {
        cameraState.active = false;
        cameraState.mode = 'none';
        cameraState.x = levelBounds.left;
        cameraState.y = levelBounds.top;
        cameraState.offsetX = 0;
        cameraState.offsetY = 0;
        cameraState.scale = 1;
        cameraState.visibleWorldWidth = canvas.width;
        cameraState.visibleWorldHeight = canvas.height;
        cameraState.levelBounds = { ...levelBounds };
        return getCameraState();
    }

    if (mode === 'contain') {
        const scale = Math.min(canvas.width / levelBounds.width, canvas.height / levelBounds.height);
        const renderedWidth = levelBounds.width * scale;
        const renderedHeight = levelBounds.height * scale;

        cameraState.active = true;
        cameraState.mode = 'contain';
        cameraState.x = levelBounds.left;
        cameraState.y = levelBounds.top;
        cameraState.offsetX = (canvas.width - renderedWidth) / 2;
        cameraState.offsetY = (canvas.height - renderedHeight) / 2;
        cameraState.scale = scale;
        cameraState.visibleWorldWidth = levelBounds.width;
        cameraState.visibleWorldHeight = levelBounds.height;
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
    cameraState.mode = 'side-scroll';
    cameraState.x = clamp(targetX, minX, maxX);
    cameraState.y = levelBounds.top;
    cameraState.offsetX = 0;
    cameraState.offsetY = 0;
    cameraState.scale = scale;
    cameraState.visibleWorldWidth = visibleWorldWidth;
    cameraState.visibleWorldHeight = visibleWorldHeight;
    cameraState.levelBounds = { ...levelBounds };

    return getCameraState();
}

export function resetCamera() {
    cameraState.active = false;
    cameraState.mode = 'none';
    cameraState.x = 0;
    cameraState.y = 0;
    cameraState.offsetX = 0;
    cameraState.offsetY = 0;
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
        x: (x - state.offsetX) / state.scale + state.x,
        y: (y - state.offsetY) / state.scale + state.y
    };
}

export function worldToScreen(x, y, state = cameraState) {
    if (!state.active) return { x, y };
    return {
        x: (x - state.x) * state.scale + state.offsetX,
        y: (y - state.y) * state.scale + state.offsetY
    };
}

function normalizeCameraMode(modeOrIsMobileDesktopScrollMode) {
    if (modeOrIsMobileDesktopScrollMode === true) return 'side-scroll';
    if (modeOrIsMobileDesktopScrollMode === 'side-scroll') return 'side-scroll';
    if (modeOrIsMobileDesktopScrollMode === 'contain') return 'contain';
    return 'none';
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
