// src/ui-hit-testing.js
// Hit testing for canvas-rendered menu controls

export function getMenuOptionAtPosition(menu, x, y) {
    return getOptionIndexAtPosition(menu.options, x, y);
}

export function getPauseMenuOptionAtPosition(pauseMenu, x, y) {
    return getOptionIndexAtPosition(pauseMenu.options, x, y);
}

export function getLevelSelectOptionAtPosition(x, y) {
    // This will be populated by the renderer when drawing level select
    if (typeof window.levelSelectBounds !== 'undefined') {
        for (let i = 0; i < window.levelSelectBounds.length; i++) {
            const bounds = window.levelSelectBounds[i];
            if (isPointInsideBounds(x, y, bounds)) {
                return bounds.level;
            }
        }
    }
    return 0; // No selection
}

function getOptionIndexAtPosition(options, x, y) {
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.bounds && isPointInsideBounds(x, y, option.bounds)) {
            return i;
        }
    }
    return -1;
}

function isPointInsideBounds(x, y, bounds) {
    return x >= bounds.x && x <= bounds.x + bounds.width &&
        y >= bounds.y && y <= bounds.y + bounds.height;
}
