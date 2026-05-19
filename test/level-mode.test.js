import test from 'node:test';
import assert from 'node:assert/strict';

import {
    MOBILE_LEVEL_MODES,
    getLevelModeStorageSuffix,
    isMobileDesktopScrollMode,
    resetMobileLevelMode,
    setMobileLevelMode
} from '../src/level-mode.js';

test('mobile level mode defaults to mobile levels', () => {
    resetMobileLevelMode();

    assert.equal(isMobileDesktopScrollMode(true), false);
    assert.equal(getLevelModeStorageSuffix(true), 'mobile');
    assert.equal(getLevelModeStorageSuffix(false), 'desktop');
});

test('desktop-scroll mode is only active on mobile devices', () => {
    setMobileLevelMode(MOBILE_LEVEL_MODES.DESKTOP_SCROLL);

    assert.equal(isMobileDesktopScrollMode(true), true);
    assert.equal(isMobileDesktopScrollMode(false), false);
    assert.equal(getLevelModeStorageSuffix(true), 'mobile-desktop-scroll');

    resetMobileLevelMode();
});
