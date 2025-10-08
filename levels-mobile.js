// Mobile-optimized levels for Gravity Cargo
// Designed for touch controls with wider passages and more forgiving geometry

export const levelTemplates = [
    // Level 1: "Gentle Start"
    {
        levelNumber: 1,
        name: "Gentle Start",
        fuel: 100,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Einzelnes breites Hindernis
            { points: [[320, 280], [480, 280], [480, 300], [320, 300]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 500], width: 120, startingCargo: null },
            { id: "BETA", position: [340, 200], width: 120, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [600, 450], width: 120, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 2: "Wide Corridor"
    {
        levelNumber: 2,
        name: "Wide Corridor",
        fuel: 130,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Breiter vertikaler Korridor (120px breit)
            { points: [[280, 100], [300, 100], [300, 500], [280, 500]], filled: true },
            { points: [[500, 100], [520, 100], [520, 500], [500, 500]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 500], width: 120, startingCargo: null },
            { id: "BETA", position: [150, 80], width: 100, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [570, 80], width: 100, startingCargo: "ALPHA" },
            { id: "DELTA", position: [600, 500], width: 120, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 3: "Step by Step"
    {
        levelNumber: 3,
        name: "Step by Step",
        fuel: 140,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Treppen-Design mit großen Stufen
            { points: [[220, 380], [280, 380], [280, 400], [220, 400]], filled: true },
            { points: [[340, 280], [400, 280], [400, 300], [340, 300]], filled: true },
            { points: [[460, 180], [520, 180], [520, 200], [460, 200]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 500], width: 120, startingCargo: null },
            { id: "BETA", position: [130, 330], width: 80, startingCargo: "DELTA" },
            { id: "GAMMA", position: [290, 230], width: 80, startingCargo: "EPSILON" },
            { id: "DELTA", position: [410, 130], width: 80, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [570, 450], width: 120, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 4: "The Split"
    {
        levelNumber: 4,
        name: "The Split",
        fuel: 150,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Y-förmige Verzweigung mit breiten Gängen
            { points: [[380, 100], [420, 100], [420, 300], [380, 300]], filled: true },
            { points: [[180, 250], [220, 250], [220, 450], [180, 450]], filled: true },
            { points: [[580, 250], [620, 250], [620, 450], [580, 450]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 520], width: 120, startingCargo: null },
            { id: "BETA", position: [240, 400], width: 100, startingCargo: "DELTA" },
            { id: "GAMMA", position: [300, 80], width: 100, startingCargo: "EPSILON" },
            { id: "DELTA", position: [460, 400], width: 100, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [640, 520], width: 120, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 5: "Over and Under"
    {
        levelNumber: 5,
        name: "Over and Under",
        fuel: 160,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Abwechselnd hohe und niedrige Hindernisse
            { points: [[220, 200], [280, 200], [280, 420], [220, 420]], filled: true },
            { points: [[420, 180], [480, 180], [480, 400], [420, 400]], filled: true },
            { points: [[620, 200], [680, 200], [680, 420], [620, 420]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 500], width: 110, startingCargo: null },
            { id: "BETA", position: [140, 150], width: 70, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [330, 450], width: 80, startingCargo: "DELTA" },
            { id: "DELTA", position: [520, 130], width: 80, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [690, 500], width: 90, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 6: "The Chamber"
    {
        levelNumber: 6,
        name: "The Chamber",
        fuel: 180,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Kammerstruktur mit breiten Durchgängen (110px)
            { points: [[150, 150], [180, 150], [180, 450], [150, 450]], filled: true },
            { points: [[350, 250], [380, 250], [380, 450], [350, 450]], filled: true },
            { points: [[550, 150], [580, 150], [580, 450], [550, 450]], filled: true },
            // Horizontale Verbindungen
            { points: [[180, 200], [350, 200], [350, 230], [180, 230]], filled: true },
            { points: [[380, 370], [550, 370], [550, 400], [380, 400]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [60, 500], width: 80, startingCargo: null },
            { id: "BETA", position: [200, 470], width: 90, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [260, 150], width: 80, startingCargo: "ZETA" },
            { id: "DELTA", position: [400, 320], width: 80, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [600, 500], width: 90, startingCargo: null },
            { id: "ZETA", position: [650, 200], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 7: "Winding Path"
    {
        levelNumber: 7,
        name: "Winding Path",
        fuel: 200,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // S-Kurve mit breiten Durchgängen
            { points: [[250, 150], [280, 150], [280, 300], [250, 300]], filled: true },
            { points: [[450, 200], [480, 200], [480, 350], [450, 350]], filled: true },
            { points: [[200, 320], [230, 320], [230, 480], [200, 480]], filled: true },
            { points: [[500, 270], [530, 270], [530, 430], [500, 430]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 520], width: 100, startingCargo: null },
            { id: "BETA", position: [140, 270], width: 90, startingCargo: "DELTA" },
            { id: "GAMMA", position: [320, 170], width: 90, startingCargo: "EPSILON" },
            { id: "DELTA", position: [370, 370], width: 70, startingCargo: "ZETA" },
            { id: "EPSILON", position: [550, 240], width: 80, startingCargo: "ALPHA" },
            { id: "ZETA", position: [640, 480], width: 100, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 8: "Double Helix"
    {
        levelNumber: 8,
        name: "Double Helix",
        fuel: 190,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Zwei spiralförmige Pfade (großzügig)
            { points: [[180, 120], [220, 120], [220, 280], [180, 280]], filled: true },
            { points: [[320, 200], [360, 200], [360, 360], [320, 360]], filled: true },
            { points: [[460, 120], [500, 120], [500, 280], [460, 280]], filled: true },
            { points: [[600, 200], [640, 200], [640, 360], [600, 360]], filled: true },
            // Horizontale Verbindungen
            { points: [[220, 400], [320, 400], [320, 430], [220, 430]], filled: true },
            { points: [[500, 380], [600, 380], [600, 410], [500, 410]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [60, 520], width: 100, startingCargo: null },
            { id: "BETA", position: [240, 350], width: 70, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [120, 90], width: 70, startingCargo: "ZETA" },
            { id: "DELTA", position: [380, 170], width: 70, startingCargo: "THETA" },
            { id: "EPSILON", position: [520, 350], width: 70, startingCargo: "ALPHA" },
            { id: "ZETA", position: [400, 520], width: 80, startingCargo: null },
            { id: "THETA", position: [660, 480], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 9: "Pyramid"
    {
        levelNumber: 9,
        name: "Pyramid",
        fuel: 200,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Pyramiden-Struktur (breite Stufen 110px)
            { points: [[290, 420], [320, 420], [320, 560], [290, 560]], filled: true },
            { points: [[480, 420], [510, 420], [510, 560], [480, 560]], filled: true },
            { points: [[240, 280], [270, 280], [270, 390], [240, 390]], filled: true },
            { points: [[530, 280], [560, 280], [560, 390], [530, 390]], filled: true },
            { points: [[340, 140], [370, 140], [370, 250], [340, 250]], filled: true },
            { points: [[430, 140], [460, 140], [460, 250], [430, 250]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [80, 520], width: 100, startingCargo: null },
            { id: "BETA", position: [340, 470], width: 90, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [170, 330], width: 80, startingCargo: "ZETA" },
            { id: "DELTA", position: [380, 200], width: 90, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [570, 330], width: 80, startingCargo: null },
            { id: "ZETA", position: [640, 520], width: 100, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },
    
    // Level 10: "Grand Finale"
    {
        levelNumber: 10,
        name: "Grand Finale",
        fuel: 240,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [800, 0], [800, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 600], [0, 600]], filled: true },
            { points: [[780, 0], [800, 0], [800, 600], [780, 600]], filled: true },
            { points: [[0, 580], [800, 580], [800, 600], [0, 600]], filled: true },
            // Komplexes Labyrinth mit breiten Durchgängen (100-110px)
            { points: [[200, 150], [230, 150], [230, 350], [200, 350]], filled: true },
            { points: [[340, 200], [370, 200], [370, 400], [340, 400]], filled: true },
            { points: [[480, 150], [510, 150], [510, 350], [480, 350]], filled: true },
            { points: [[620, 200], [650, 200], [650, 400], [620, 400]], filled: true },
            // Horizontale Hindernisse
            { points: [[120, 280], [200, 280], [200, 310], [120, 310]], filled: true },
            { points: [[230, 180], [340, 180], [340, 210], [230, 210]], filled: true },
            { points: [[370, 330], [480, 330], [480, 360], [370, 360]], filled: true },
            { points: [[510, 230], [620, 230], [620, 260], [510, 260]], filled: true },
            { points: [[650, 350], [730, 350], [730, 380], [650, 380]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [60, 520], width: 90, startingCargo: null },
            { id: "BETA", position: [110, 230], width: 70, startingCargo: "THETA" },
            { id: "GAMMA", position: [250, 130], width: 70, startingCargo: "ZETA" },
            { id: "DELTA", position: [250, 420], width: 70, startingCargo: "ETA" },
            { id: "EPSILON", position: [390, 280], width: 70, startingCargo: "ALPHA" },
            { id: "ZETA", position: [530, 380], width: 70, startingCargo: null },
            { id: "ETA", position: [530, 180], width: 70, startingCargo: null },
            { id: "THETA", position: [670, 450], width: 90, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    }
];