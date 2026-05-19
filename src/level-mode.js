// src/level-mode.js
// Runtime level-source mode for optional mobile desktop-level testing

export const MOBILE_LEVEL_MODES = {
    MOBILE: 'mobile',
    DESKTOP_SCROLL: 'desktop-scroll'
};

let mobileLevelMode = MOBILE_LEVEL_MODES.MOBILE;

export function setMobileLevelMode(mode) {
    if (!Object.values(MOBILE_LEVEL_MODES).includes(mode)) {
        throw new Error(`Unknown mobile level mode: ${mode}`);
    }
    mobileLevelMode = mode;
}

export function resetMobileLevelMode() {
    mobileLevelMode = MOBILE_LEVEL_MODES.MOBILE;
}

export function getMobileLevelMode() {
    return mobileLevelMode;
}

export function isMobileDesktopScrollMode(isMobileDevice) {
    return isMobileDevice && mobileLevelMode === MOBILE_LEVEL_MODES.DESKTOP_SCROLL;
}

export function getLevelModeStorageSuffix(isMobileDevice) {
    if (isMobileDesktopScrollMode(isMobileDevice)) return 'mobile-desktop-scroll';
    return isMobileDevice ? 'mobile' : 'desktop';
}
