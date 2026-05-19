// src/renderer-layout.js
// Pure layout calculations used by canvas and DOM HUD rendering

export function shouldRenderGameplayHUD(gameState) {
    return gameState.state === 'playing';
}

export function shouldRenderTimeAttackTimer(gameState) {
    return shouldRenderGameplayHUD(gameState) && gameState.mode === 'timeattack';
}

export function createGameplayHUDLayout(bounds, isMobileDevice) {
    const margin = isMobileDevice ? 25 : 30;

    return {
        scoreX: bounds.left + margin,
        scoreY: bounds.top + margin,
        timerX: bounds.right - margin,
        timerY: bounds.top + margin
    };
}

export function createLevelScreenRect(bounds, canvasRect, containerRect, canvasSize) {
    const scaleX = canvasRect.width / canvasSize.width;
    const scaleY = canvasRect.height / canvasSize.height;

    return {
        left: canvasRect.left - containerRect.left + bounds.left * scaleX,
        top: canvasRect.top - containerRect.top + bounds.top * scaleY,
        right: canvasRect.left - containerRect.left + bounds.right * scaleX,
        bottom: canvasRect.top - containerRect.top + bounds.bottom * scaleY,
        width: bounds.width * scaleX,
        height: bounds.height * scaleY
    };
}

export function hasEnoughSpaceBelowLevel(levelScreenRect, viewportSize, isMobileDevice) {
    const gap = isMobileDevice ? 8 : 12;
    const bottomHudHeight = isMobileDevice ? 34 : 42;
    return viewportSize.height - levelScreenRect.bottom >= bottomHudHeight + gap;
}

export function createDOMHUDLayout(levelScreenRect, viewportSize, isMobileDevice) {
    const margin = isMobileDevice ? 20 : 30;
    const gap = isMobileDevice ? 8 : 12;
    const fallbackTopOffset = isMobileDevice ? 56 : 62;
    const left = levelScreenRect.left + margin;
    const right = viewportSize.width - levelScreenRect.right + margin;

    if (hasEnoughSpaceBelowLevel(levelScreenRect, viewportSize, isMobileDevice)) {
        return {
            left,
            right,
            bottom: 'auto',
            top: levelScreenRect.bottom + gap,
            placement: 'below-level'
        };
    }

    return {
        left,
        right,
        bottom: 'auto',
        top: levelScreenRect.top + fallbackTopOffset,
        placement: 'inside-top'
    };
}
