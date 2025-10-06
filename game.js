const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function resizeCanvas() {
    if (isMobile) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        const aspectRatio = 16 / 9;
        const maxWidth = Math.min(window.innerWidth * 0.95, 1280);
        const maxHeight = Math.min(window.innerHeight * 0.95, 720);
        
        if (maxWidth / maxHeight > aspectRatio) {
            canvas.height = maxHeight;
            canvas.width = maxHeight * aspectRatio;
        } else {
            canvas.width = maxWidth;
            canvas.height = maxWidth / aspectRatio;
        }
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PHYSICS = {
    gravity: 0.05,
    thrust: 0.15,
    rotationSpeed: Math.PI * 2 / 3,
    friction: 0.98,
    maxLandingSpeed: 2,
    maxLandingAngle: Math.PI / 12,
    fuelConsumption: 0.1
};

const game = {
    state: 'menu',
    score: 0,
    lives: 3,
    level: 1,
    fuel: 100,
    maxFuel: 100,
    currentCargo: null,
    deliveredCargo: 0,
    lastLandedPlatform: null,
    particles: [],
    explosionTime: 0,
    levelStartScore: 0
};

const menu = {
    currentScreen: 'main',
    selectedOption: 0,
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true, bounds: null },
        { id: 'continue', label: 'FORTSETZEN', enabled: false, bounds: null }
    ]
};

const pauseMenu = {
    selectedOption: 0,
    options: [
        { id: 'resume', label: 'FORTSETZEN', bounds: null },
        { id: 'restart', label: 'NEUSTART LEVEL', bounds: null },
        { id: 'mainmenu', label: 'HAUPTMENÜ', bounds: null }
    ]
};

function saveGameState() {
    const saveData = {
        level: game.level,
        score: game.score,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem('gravityCargo_saveData', JSON.stringify(saveData));
        return true;
    } catch (e) {
        console.error('Speichern fehlgeschlagen:', e);
        return false;
    }
}

function loadGameState() {
    try {
        const data = localStorage.getItem('gravityCargo_saveData');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Laden fehlgeschlagen:', e);
        return null;
    }
}

function clearGameState() {
    try {
        localStorage.removeItem('gravityCargo_saveData');
        return true;
    } catch (e) {
        console.error('Löschen fehlgeschlagen:', e);
        return false;
    }
}

function initMenu() {
    const saveData = loadGameState();
    if (saveData) {
        menu.options[1].enabled = true;
    } else {
        menu.options[1].enabled = false;
    }
    game.state = 'menu';
    
    // Setze selectedOption auf ersten aktivierten Eintrag
    menu.selectedOption = menu.options.findIndex(o => o.enabled);
    if (menu.selectedOption === -1) menu.selectedOption = 0;
}

function togglePause() {
    if (game.state === 'playing') {
        game.state = 'paused';
        pauseMenu.selectedOption = 0;
        playSound('menuSelect');
    } else if (game.state === 'paused') {
        game.state = 'playing';
        playSound('menuSelect');
    }
}

function handlePauseMenuSelection() {
    const selectedOption = pauseMenu.options[pauseMenu.selectedOption];
    
    playSound('menuSelect');
    
    switch (selectedOption.id) {
        case 'resume':
            game.state = 'playing';
            break;
        case 'restart':
            restartLevel();
            break;
        case 'mainmenu':
            saveGameState();
            initMenu();
            break;
    }
}

function restartLevel() {
    game.score = game.levelStartScore;
    game.lives = 3;
    game.currentCargo = null;
    game.deliveredCargo = 0;
    initLevel();
    game.state = 'playing';
}

function getPauseMenuOptionAtPosition(x, y) {
    for (let i = 0; i < pauseMenu.options.length; i++) {
        const option = pauseMenu.options[i];
        if (option.bounds) {
            const b = option.bounds;
            if (x >= b.x && x <= b.x + b.width && 
                y >= b.y && y <= b.y + b.height) {
                return i;
            }
        }
    }
    return -1;
}

const ship = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    size: 20,
    thrusting: false
};

const keys = {
    left: false,
    right: false,
    up: false,
    space: false
};

const levelTemplates = [
    {
        levelNumber: 1,
        name: "Easy Start",
        fuel: 100,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[300, 300], [500, 300], [500, 320], [300, 320]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 100, startingCargo: null },
            { id: "BETA", position: [300, 200], width: 100, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [600, 400], width: 100, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 2,
        name: "The U-Turn",
        fuel: 140,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[250, 100], [270, 100], [270, 500], [250, 500]], filled: true },
            { points: [[530, 100], [550, 100], [550, 500], [530, 500]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 80, startingCargo: null },
            { id: "BETA", position: [100, 80], width: 80, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [620, 80], width: 80, startingCargo: "ALPHA" },
            { id: "DELTA", position: [620, 500], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 3,
        name: "Narrow Passage",
        fuel: 130,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[350, 200], [370, 200], [370, 280], [350, 280]], filled: true },
            { points: [[430, 320], [450, 320], [450, 400], [430, 400]], filled: true },
            { points: [[200, 350], [340, 350], [340, 370], [200, 370]], filled: true },
            { points: [[460, 230], [600, 230], [600, 250], [460, 250]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 90, startingCargo: null },
            { id: "BETA", position: [220, 300], width: 80, startingCargo: "DELTA" },
            { id: "GAMMA", position: [500, 180], width: 80, startingCargo: "ALPHA" },
            { id: "DELTA", position: [650, 450], width: 90, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 4,
        name: "The Maze",
        fuel: 180,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[200, 150], [220, 150], [220, 350], [200, 350]], filled: true },
            { points: [[380, 250], [400, 250], [400, 450], [380, 450]], filled: true },
            { points: [[560, 150], [580, 150], [580, 350], [560, 350]], filled: true },
            { points: [[100, 300], [200, 300], [200, 320], [100, 320]], filled: true },
            { points: [[220, 200], [380, 200], [380, 220], [220, 220]], filled: true },
            { points: [[400, 300], [560, 300], [560, 320], [400, 320]], filled: true },
            { points: [[580, 200], [700, 200], [700, 220], [580, 220]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 80, startingCargo: null },
            { id: "BETA", position: [120, 250], width: 70, startingCargo: "DELTA" },
            { id: "GAMMA", position: [300, 150], width: 70, startingCargo: "EPSILON" },
            { id: "DELTA", position: [490, 250], width: 60, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [650, 450], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 5,
        name: "Tight Spots",
        fuel: 150,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[150, 200], [250, 200], [250, 400], [150, 400]], filled: true },
            { points: [[550, 200], [650, 200], [650, 400], [550, 400]], filled: true },
            { points: [[280, 120], [350, 120], [350, 180], [280, 180]], filled: true },
            { points: [[450, 420], [520, 420], [520, 480], [450, 480]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [70, 450], width: 70, startingCargo: null },
            { id: "BETA", position: [280, 70], width: 60, startingCargo: "DELTA" },
            { id: "GAMMA", position: [450, 530], width: 60, startingCargo: "ALPHA" },
            { id: "DELTA", position: [660, 450], width: 70, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 6,
        name: "The Tower",
        fuel: 170,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[320, 480], [340, 480], [340, 560], [320, 560]], filled: true },
            { points: [[460, 480], [480, 480], [480, 560], [460, 560]], filled: true },
            { points: [[320, 360], [340, 360], [340, 440], [320, 440]], filled: true },
            { points: [[460, 360], [480, 360], [480, 440], [460, 440]], filled: true },
            { points: [[320, 240], [340, 240], [340, 320], [320, 320]], filled: true },
            { points: [[460, 240], [480, 240], [480, 320], [460, 320]], filled: true },
            { points: [[320, 120], [340, 120], [340, 200], [320, 200]], filled: true },
            { points: [[460, 120], [480, 120], [480, 200], [460, 200]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 520], width: 80, startingCargo: null },
            { id: "BETA", position: [350, 440], width: 100, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [350, 320], width: 100, startingCargo: "ZETA" },
            { id: "DELTA", position: [350, 200], width: 100, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [620, 400], width: 80, startingCargo: null },
            { id: "ZETA", position: [620, 280], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 7,
        name: "Crossroads",
        fuel: 200,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[100, 280], [300, 280], [300, 300], [100, 300]], filled: true },
            { points: [[500, 280], [700, 280], [700, 300], [500, 300]], filled: true },
            { points: [[380, 100], [400, 100], [400, 500], [380, 500]], filled: true },
            { points: [[180, 150], [200, 150], [200, 280], [180, 280]], filled: true },
            { points: [[600, 300], [620, 300], [620, 450], [600, 450]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [50, 520], width: 80, startingCargo: null },
            { id: "BETA", position: [100, 230], width: 70, startingCargo: "DELTA" },
            { id: "GAMMA", position: [300, 80], width: 70, startingCargo: "EPSILON" },
            { id: "DELTA", position: [510, 230], width: 70, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [640, 500], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 8,
        name: "The Cavern",
        fuel: 190,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[150, 150], [300, 180], [280, 350], [200, 320]], filled: true },
            { points: [[500, 180], [650, 150], [600, 320], [520, 350]], filled: true },
            { points: [[320, 380], [350, 450], [280, 520], [250, 440]], filled: true },
            { points: [[450, 450], [480, 380], [550, 440], [520, 520]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 80, startingCargo: null },
            { id: "BETA", position: [320, 150], width: 70, startingCargo: "DELTA" },
            { id: "GAMMA", position: [410, 150], width: 70, startingCargo: "EPSILON" },
            { id: "DELTA", position: [360, 350], width: 60, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [650, 500], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 9,
        name: "Precision",
        fuel: 160,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[250, 200], [265, 200], [265, 500], [250, 500]], filled: true },
            { points: [[335, 200], [350, 200], [350, 500], [335, 500]], filled: true },
            { points: [[450, 100], [465, 100], [465, 400], [450, 400]], filled: true },
            { points: [[535, 100], [550, 100], [550, 400], [535, 400]], filled: true },
            { points: [[100, 320], [250, 320], [250, 335], [100, 335]], filled: true },
            { points: [[350, 320], [450, 320], [450, 335], [350, 335]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 70, startingCargo: null },
            { id: "BETA", position: [270, 450], width: 60, startingCargo: "DELTA" },
            { id: "GAMMA", position: [270, 150], width: 60, startingCargo: "EPSILON" },
            { id: "DELTA", position: [470, 350], width: 60, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [650, 500], width: 70, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    {
        levelNumber: 10,
        name: "Final Challenge",
        fuel: 220,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            { points: [[180, 150], [200, 150], [200, 300], [180, 300]], filled: true },
            { points: [[280, 250], [300, 250], [300, 400], [280, 400]], filled: true },
            { points: [[380, 150], [400, 150], [400, 300], [380, 300]], filled: true },
            { points: [[480, 250], [500, 250], [500, 400], [480, 400]], filled: true },
            { points: [[580, 150], [600, 150], [600, 300], [580, 300]], filled: true },
            { points: [[100, 350], [280, 350], [280, 370], [100, 370]], filled: true },
            { points: [[300, 200], [380, 200], [380, 220], [300, 220]], filled: true },
            { points: [[400, 350], [480, 350], [480, 370], [400, 370]], filled: true },
            { points: [[500, 200], [680, 200], [680, 220], [500, 220]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [50, 520], width: 80, startingCargo: null },
            { id: "BETA", position: [120, 300], width: 50, startingCargo: "ZETA" },
            { id: "GAMMA", position: [220, 200], width: 50, startingCargo: "EPSILON" },
            { id: "DELTA", position: [320, 300], width: 50, startingCargo: "THETA" },
            { id: "EPSILON", position: [420, 200], width: 50, startingCargo: "ALPHA" },
            { id: "ZETA", position: [620, 450], width: 70, startingCargo: null },
            { id: "THETA", position: [700, 350], width: 70, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    }
];

let currentLevel = null;

function initLevel() {
    const levelIndex = game.level - 1;
    if (levelIndex >= levelTemplates.length) {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelTemplates.length - 1]));
    } else {
        currentLevel = JSON.parse(JSON.stringify(levelTemplates[levelIndex]));
    }
    
    game.fuel = currentLevel.fuel;
    game.maxFuel = currentLevel.fuel;
    game.currentCargo = null;
    game.deliveredCargo = 0;
    game.lives = 3;
    game.levelStartScore = game.score;
    
    const startPlatform = currentLevel.platforms.find(p => p.id === currentLevel.startPlatform);
    ship.x = startPlatform.position[0] + startPlatform.width / 2;
    ship.y = startPlatform.position[1] - ship.size;
    ship.vx = 0;
    ship.vy = 0;
    ship.angle = 0;
    
    game.lastLandedPlatform = currentLevel.startPlatform;
}

document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && 
        (game.state === 'playing' || game.state === 'paused')) {
        e.preventDefault();
        togglePause();
        return;
    }
    
    if (game.state === 'paused') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            pauseMenu.selectedOption = Math.max(0, pauseMenu.selectedOption - 1);
            playSound('menuMove');
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            pauseMenu.selectedOption = Math.min(pauseMenu.options.length - 1, pauseMenu.selectedOption + 1);
            playSound('menuMove');
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePauseMenuSelection();
        }
        return;
    }
    
    if (game.state === 'menu') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            const enabledIndices = menu.options.map((o, i) => o.enabled ? i : -1).filter(i => i >= 0);
            const currentPos = enabledIndices.indexOf(menu.selectedOption);
            if (currentPos > 0) {
                menu.selectedOption = enabledIndices[currentPos - 1];
                playSound('menuMove');
            }
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            const enabledIndices = menu.options.map((o, i) => o.enabled ? i : -1).filter(i => i >= 0);
            const currentPos = enabledIndices.indexOf(menu.selectedOption);
            if (currentPos < enabledIndices.length - 1) {
                menu.selectedOption = enabledIndices[currentPos + 1];
                playSound('menuMove');
            }
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMenuSelection();
        }
        return;
    }
    
    if (game.state === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        initMenu();
        return;
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
});

const thrustButton = document.getElementById('mobile-thrust');
thrustButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.up = true;
});
thrustButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.up = false;
});

const pauseButton = document.getElementById('mobile-pause');
pauseButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (game.state === 'playing' || game.state === 'paused') {
        togglePause();
    }
});

canvas.addEventListener('touchstart', (e) => {
    if (game.state === 'menu') {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        const selectedOption = getMenuOptionAtPosition(touchX, touchY);
        if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
            menu.selectedOption = selectedOption;
            handleMenuSelection();
        }
        return;
    }
    
    if (game.state === 'paused') {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        const selectedOption = getPauseMenuOptionAtPosition(touchX, touchY);
        if (selectedOption !== -1) {
            pauseMenu.selectedOption = selectedOption;
            handlePauseMenuSelection();
        }
        return;
    }
    
    if (e.target === canvas) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        const dx = touchX - ship.x;
        const dy = touchY - ship.y;
        const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
        ship.angle = targetAngle;
    }
});

canvas.addEventListener('click', (e) => {
    if (game.state === 'menu') {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const selectedOption = getMenuOptionAtPosition(clickX, clickY);
        if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
            menu.selectedOption = selectedOption;
            handleMenuSelection();
        }
    }
    
    if (game.state === 'paused') {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const selectedOption = getPauseMenuOptionAtPosition(clickX, clickY);
        if (selectedOption !== -1) {
            pauseMenu.selectedOption = selectedOption;
            handlePauseMenuSelection();
        }
    }
});

function getMenuOptionAtPosition(x, y) {
    for (let i = 0; i < menu.options.length; i++) {
        const option = menu.options[i];
        if (option.bounds) {
            const b = option.bounds;
            if (x >= b.x && x <= b.x + b.width && 
                y >= b.y && y <= b.y + b.height) {
                return i;
            }
        }
    }
    return -1;
}

function handleMenuSelection() {
    const selectedOption = menu.options[menu.selectedOption];
    
    if (!selectedOption.enabled) return;
    
    playSound('menuSelect');
    
    switch (selectedOption.id) {
        case 'newgame':
            startNewGame();
            break;
        case 'continue':
            continueGame();
            break;
    }
}

function startNewGame() {
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    clearGameState();
    initLevel();
    game.state = 'playing';
}

function continueGame() {
    const saveData = loadGameState();
    if (saveData) {
        game.level = saveData.level;
        game.score = saveData.score;
        initLevel();
        game.state = 'playing';
    }
}

function update(dt) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.2;
        if (p.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
    
    if (game.state === 'paused') return;
    
    if (game.state !== 'playing') return;
    
    if (keys.left) {
        ship.angle -= PHYSICS.rotationSpeed * dt;
    }
    if (keys.right) {
        ship.angle += PHYSICS.rotationSpeed * dt;
    }
    
    ship.thrusting = false;
    if (keys.up && game.fuel > 0) {
        ship.thrusting = true;
        playSound('thrust');
        const thrustX = Math.sin(ship.angle) * PHYSICS.thrust;
        const thrustY = -Math.cos(ship.angle) * PHYSICS.thrust;
        ship.vx += thrustX;
        ship.vy += thrustY;
        game.fuel -= PHYSICS.fuelConsumption;
        if (game.fuel < 0) game.fuel = 0;
    }
    
    ship.vy += PHYSICS.gravity;
    
    ship.vx *= PHYSICS.friction;
    ship.vy *= PHYSICS.friction;
    
    ship.x += ship.vx;
    ship.y += ship.vy;
    
    checkCollisions();
    updateUI();
}

function checkCollisions() {
    for (const wall of currentLevel.walls) {
        if (polygonContainsPoint(wall.points, ship.x, ship.y)) {
            explode();
            return;
        }
    }
    
    for (const platform of currentLevel.platforms) {
        const px = platform.position[0];
        const py = platform.position[1];
        const pw = platform.width;
        
        if (ship.x > px && ship.x < px + pw && 
            ship.y > py - ship.size && ship.y < py + 5) {
            
            const normalizedAngle = ((ship.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const isUpright = normalizedAngle < PHYSICS.maxLandingAngle || 
                            normalizedAngle > Math.PI * 2 - PHYSICS.maxLandingAngle;
            
            const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
            
            if (isUpright && speed < PHYSICS.maxLandingSpeed) {
                land(platform);
            } else {
                explode();
            }
            return;
        }
    }
}

function polygonContainsPoint(points, x, y) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i][0], yi = points[i][1];
        const xj = points[j][0], yj = points[j][1];
        
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function land(platform) {
    ship.vx = 0;
    ship.vy = 0;
    ship.y = platform.position[1] - ship.size;
    game.lastLandedPlatform = platform.id;
    playSound('land');
    
    if (game.currentCargo === null && platform.startingCargo !== null) {
        game.currentCargo = platform.startingCargo;
        platform.startingCargo = null;
        playSound('pickup');
    } else if (game.currentCargo !== null && game.currentCargo === platform.id) {
        game.score++;
        game.deliveredCargo++;
        game.currentCargo = null;
        playSound('delivery');
        
        const totalCargo = currentLevel.platforms.filter(p => p.startingCargo !== null).length + game.deliveredCargo;
        if (game.deliveredCargo >= totalCargo) {
            levelComplete();
        }
    }
}

function levelComplete() {
    game.state = 'levelcomplete';
    game.level++;
    saveGameState();
    setTimeout(() => {
        if (game.level <= 10) {
            initLevel();
            game.state = 'playing';
        } else {
            game.state = 'gamewon';
        }
    }, 2000);
}

function explode() {
    playSound('explosion');
    createExplosion(ship.x, ship.y);
    game.state = 'exploding';
    game.explosionTime = 1000;
    
    setTimeout(() => {
        game.lives--;
        if (game.lives <= 0) {
            game.state = 'gameover';
            clearGameState();
        } else {
            respawn();
            game.state = 'playing';
        }
    }, 1000);
}

function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        game.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            size: 3 + Math.random() * 4,
            color: ['#ff6600', '#ff9900', '#ff0000', '#ffff00'][Math.floor(Math.random() * 4)]
        });
    }
}

function respawn() {
    const respawnPlatform = currentLevel.platforms.find(p => p.id === game.lastLandedPlatform);
    ship.x = respawnPlatform.position[0] + respawnPlatform.width / 2;
    ship.y = respawnPlatform.position[1] - ship.size;
    ship.vx = 0;
    ship.vy = 0;
    ship.angle = 0;
    game.fuel = game.maxFuel;
    game.currentCargo = null;
}

function updateUI() {
    document.getElementById('score').textContent = `SCORE: ${game.score.toString().padStart(2, '0')}`;
    
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < game.lives; i++) {
        const lifeIcon = document.createElement('div');
        lifeIcon.className = 'life-icon';
        livesContainer.appendChild(lifeIcon);
    }
    
    const fuelBar = document.getElementById('fuel-bar');
    const fuelPercent = (game.fuel / game.maxFuel) * 100;
    fuelBar.style.width = fuelPercent + '%';
    
    fuelBar.classList.remove('low', 'critical');
    if (fuelPercent < 20) {
        fuelBar.classList.add('critical');
    } else if (fuelPercent < 50) {
        fuelBar.classList.add('low');
    }
    
    const targetText = game.currentCargo ? `TARGET: ${game.currentCargo}` : 'TARGET: --';
    document.getElementById('target-platform').textContent = targetText;
}

function renderPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 4);
    
    const startY = canvas.height / 2;
    const spacing = 70;
    
    pauseMenu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === pauseMenu.selectedOption;
        const buttonWidth = 280;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;
        
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.font = '22px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);
        
        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });
    
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('ESC/P zum Fortsetzen', canvas.width / 2, canvas.height - 40);
}

function renderMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRAVITY CARGO', canvas.width / 2, canvas.height / 3);
    
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('A Retro Physics Puzzler', canvas.width / 2, canvas.height / 3 + 60);
    
    const startY = canvas.height / 2 + 20;
    const spacing = 70;
    
    menu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === menu.selectedOption;
        const buttonWidth = 300;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;
        
        if (isSelected && option.enabled) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
        
        ctx.strokeStyle = option.enabled ? '#fff' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.font = '24px "Courier New"';
        ctx.fillStyle = option.enabled ? '#fff' : '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);
        
        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });
    
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Idee: Andreas Weber | Spec: Claude Sonnet 4.5 | Code: Claude Code', 
                 canvas.width / 2, canvas.height - 30);
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (game.state === 'menu') {
        renderMenu();
        return;
    }
    
    if (game.state === 'levelcomplete') {
        ctx.fillStyle = '#fff';
        ctx.font = '48px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px "Courier New"';
        ctx.fillText(`SCORE: ${game.score}`, canvas.width / 2, canvas.height / 2 + 50);
        return;
    }
    
    if (game.state === 'gameover') {
        ctx.fillStyle = '#fff';
        ctx.font = '48px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px "Courier New"';
        ctx.fillText(`LEVEL: ${game.level}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText(`SCORE: ${game.score}`, canvas.width / 2, canvas.height / 2 + 85);
        ctx.font = '20px "Courier New"';
        ctx.fillStyle = '#0ff';
        ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height / 2 + 140);
        return;
    }
    
    ctx.save();
    
    for (const wall of currentLevel.walls) {
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.moveTo(wall.points[0][0], wall.points[0][1]);
        for (let i = 1; i < wall.points.length; i++) {
            ctx.lineTo(wall.points[i][0], wall.points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    for (const platform of currentLevel.platforms) {
        const isTarget = game.currentCargo === platform.id;
        ctx.strokeStyle = isTarget ? '#fff' : '#0f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(platform.position[0], platform.position[1]);
        ctx.lineTo(platform.position[0] + platform.width, platform.position[1]);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px "Courier New"';
        ctx.fillText(platform.id, platform.position[0] + 5, platform.position[1] - 5);
        
        if (platform.startingCargo) {
            ctx.fillStyle = '#ff0';
            ctx.fillRect(
                platform.position[0] + platform.width / 2 - 8,
                platform.position[1] - 20,
                16,
                16
            );
        }
    }
    
    if (game.state !== 'exploding') {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        
        if (ship.thrusting) {
            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(-6, ship.size / 2);
            ctx.lineTo(0, ship.size / 2 + 15);
            ctx.lineTo(6, ship.size / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -ship.size / 2);
        ctx.lineTo(-ship.size / 2, ship.size / 2);
        ctx.lineTo(ship.size / 2, ship.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    for (const particle of game.particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    
    ctx.restore();
    
    if (game.state === 'paused') {
        renderPauseScreen();
    }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {
    thrust: null,
    explosion: null,
    land: null,
    pickup: null,
    delivery: null
};

let thrustSoundPlaying = false;

function playSound(type) {
    if (type === 'thrust') {
        if (!thrustSoundPlaying) {
            thrustSoundPlaying = true;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 80;
            oscillator.type = 'sawtooth';
            gainNode.gain.value = 0.05;
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                thrustSoundPlaying = false;
            }, 100);
        }
    } else if (type === 'explosion') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 100;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'land') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 200;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'pickup') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
        oscillator.type = 'square';
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'delivery') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1046, audioContext.currentTime + 0.15);
        oscillator.type = 'square';
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'menuMove') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.05;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
    } else if (type === 'menuSelect') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1046, audioContext.currentTime + 0.1);
        oscillator.type = 'square';
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

let lastTime = 0;
function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    
    if (dt > 0) {
        update(dt);
    }
    render();
    
    requestAnimationFrame(gameLoop);
}

initMenu();
requestAnimationFrame(gameLoop);
