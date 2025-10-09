// src/storage.js
// Handles data persistence operations

// Save game state
export function saveGameState() {
    try {
        const saveData = {
            level: gameState.level,
            score: gameState.score,
            timestamp: Date.now()
        };
        localStorage.setItem('gravityCargo_saveData', JSON.stringify(saveData));
        return true;
    } catch (e) {
        console.error('Save failed:', e);
        return false;
    }
}

// Load game state
export function loadGameState() {
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Load failed:', e);
        return null;
    }
}

// Clear game state
export function clearGameState() {
    try {
        localStorage.removeItem('gravityCargo_saveData');
        return true;
    } catch (e) {
        console.error('Clear failed:', e);
        return false;
    }
}