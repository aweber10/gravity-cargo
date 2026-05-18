// src/ui-state.js
// Shared state for menu-style UI screens

export const menu = {
    currentScreen: 'main',
    selectedOption: 0,
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true, bounds: null },
        { id: 'timeattack', label: 'ZEITRENNEN', enabled: true, bounds: null },
        { id: 'training', label: 'TRAINING', enabled: true, bounds: null },
        { id: 'continue', label: 'FORTSETZEN', enabled: false, bounds: null }
    ]
};

export const levelSelectMenu = {
    selectedLevel: 1,
    scrollOffset: 0
};

export const pauseMenu = {
    selectedOption: 0,
    options: [
        { id: 'resume', label: 'FORTSETZEN', bounds: null },
        { id: 'restart', label: 'NEUSTART LEVEL', bounds: null },
        { id: 'mainmenu', label: 'HAUPTMENÜ', bounds: null }
    ]
};
