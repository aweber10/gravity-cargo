// levels.js - Level-Definitionen

export const levelTemplates = [
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
        name: "Platform Hopper",
        fuel: 150,
        gravity: 0.05,
        scrollDirection: null,
        walls: [],
        platforms: [
            { id: "ALPHA", position: [350, 500], width: 100, startingCargo: null },
            { id: "BETA", position: [150, 150], width: 80, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [600, 150], width: 80, startingCargo: "BETA" },
            { id: "DELTA", position: [150, 450], width: 80, startingCargo: "GAMMA" },
            { id: "EPSILON", position: [600, 450], width: 80, startingCargo: "DELTA" }
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

export function calculateMaxScore() {
    return levelTemplates.reduce((sum, level) => {
        return sum + level.platforms.filter(p => p.startingCargo !== null).length;
    }, 0);
}
