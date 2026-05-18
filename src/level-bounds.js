// src/level-bounds.js
// Pure helpers for deriving playable level bounds from level geometry

export function getDefaultLevelSize(isMobileDevice) {
    return {
        width: isMobileDevice ? 375 : 800,
        height: isMobileDevice ? 667 : 600
    };
}

export function createDefaultLevelBounds(isMobileDevice) {
    const { width, height } = getDefaultLevelSize(isMobileDevice);

    return {
        left: 0,
        top: 0,
        right: width,
        bottom: height,
        width,
        height
    };
}

export function calculateLevelBounds(level, isMobileDevice) {
    const fallbackBounds = createDefaultLevelBounds(isMobileDevice);
    if (!level || !level.walls || level.walls.length === 0) {
        return fallbackBounds;
    }

    const points = level.walls.flatMap(wall => wall.points || []);
    if (points.length === 0) {
        return fallbackBounds;
    }

    const xs = points.map(point => point[0]);
    const ys = points.map(point => point[1]);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const right = Math.max(...xs);
    const bottom = Math.max(...ys);

    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top
    };
}
