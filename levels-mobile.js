// Mobile-optimized levels for Gravity Cargo
// Designed for touch controls with wider passages and more forgiving geometry
// Optimized for iPhone 13/14 Portrait (375×667)

export const levelTemplates = [
    // Level 1: "First Flight"
    {
        levelNumber: 1,
        name: "First Flight",
        fuel: 80,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            // Rahmen
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Einfaches mittiges Hindernis
            { points: [[140, 330], [235, 330], [235, 350], [140, 350]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [40, 580], width: 120, startingCargo: null },
            { id: "BETA", position: [130, 250], width: 115, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [210, 500], width: 120, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 2: "Up and Down"
    {
        levelNumber: 2,
        name: "Up and Down",
        fuel: 100,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Zwei horizontale Hindernisse (110px Durchgang)
            { points: [[20, 450], [160, 450], [160, 470], [20, 470]], filled: true },
            { points: [[215, 250], [355, 250], [355, 270], [215, 270]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [50, 600], width: 100, startingCargo: null },
            { id: "BETA", position: [225, 400], width: 90, startingCargo: "GAMMA" },
            { id: "GAMMA", position: [60, 180], width: 100, startingCargo: "ALPHA" },
            { id: "DELTA", position: [220, 80], width: 100, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 3: "Side to Side"
    {
        levelNumber: 3,
        name: "Side to Side",
        fuel: 110,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Vertikale Wände für Zick-Zack-Kurs (100px Durchgänge)
            { points: [[130, 500], [150, 500], [150, 620], [130, 620]], filled: true },
            { points: [[225, 350], [245, 350], [245, 480], [225, 480]], filled: true },
            { points: [[130, 200], [150, 200], [150, 330], [130, 330]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [40, 590], width: 80, startingCargo: null },
            { id: "BETA", position: [165, 540], width: 80, startingCargo: "DELTA" },
            { id: "GAMMA", position: [40, 380], width: 80, startingCargo: "EPSILON" },
            { id: "DELTA", position: [260, 290], width: 80, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [40, 150], width: 90, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 4: "The Chimney"
    {
        levelNumber: 4,
        name: "The Chimney",
        fuel: 120,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Kaminstruktur - KORRIGIERT
            // Linke Wand: Nur vom oberen Querbalken (y=290) bis unten (y=520)
            // So ist links von BETA offen
            { points: [[120, 290], [140, 290], [140, 520], [120, 520]], filled: true },
            // Rechte Wand: Nur von oben (y=150) bis zum oberen Querbalken (y=270)
            // So ist rechts von DELTA offen
            { points: [[245, 150], [265, 150], [265, 270], [245, 270]], filled: true },
            // Horizontale Querbalken (bleiben komplett unverändert)
            { points: [[140, 400], [245, 400], [245, 420], [140, 420]], filled: true },
            { points: [[120, 270], [245, 270], [245, 290], [120, 290]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [30, 590], width: 80, startingCargo: null },
            { id: "BETA", position: [155, 480], width: 80, startingCargo: "DELTA" },
            { id: "GAMMA", position: [30, 340], width: 80, startingCargo: "EPSILON" },
            { id: "DELTA", position: [155, 210], width: 80, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [275, 110], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 5: "Stairway"
    {
        levelNumber: 5,
        name: "Stairway",
        fuel: 130,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Treppenstufen
            { points: [[80, 520], [130, 520], [130, 540], [80, 540]], filled: true },
            { points: [[160, 420], [210, 420], [210, 440], [160, 440]], filled: true },
            { points: [[240, 320], [290, 320], [290, 340], [240, 340]], filled: true },
            { points: [[160, 220], [210, 220], [210, 240], [160, 240]], filled: true },
            { points: [[80, 120], [130, 120], [130, 140], [80, 140]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [35, 600], width: 100, startingCargo: null },
            { id: "BETA", position: [30, 470], width: 70, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [120, 370], width: 70, startingCargo: "ZETA" },
            { id: "DELTA", position: [200, 270], width: 70, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [110, 170], width: 70, startingCargo: null },
            { id: "ZETA", position: [240, 70], width: 90, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 6: "The Hourglass"
    {
        levelNumber: 6,
        name: "The Hourglass",
        fuel: 140,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Sanduhr-Struktur (engste Stelle 100px breit)
            { points: [[80, 150], [100, 150], [100, 280], [80, 280]], filled: true },
            { points: [[275, 150], [295, 150], [295, 280], [275, 280]], filled: true },
            { points: [[125, 310], [145, 310], [145, 360], [125, 360]], filled: true },
            { points: [[230, 310], [250, 310], [250, 360], [230, 360]], filled: true },
            { points: [[80, 390], [100, 390], [100, 520], [80, 520]], filled: true },
            { points: [[275, 390], [295, 390], [295, 520], [275, 520]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [120, 590], width: 135, startingCargo: null },
            { id: "BETA", position: [30, 440], width: 70, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [280, 440], width: 70, startingCargo: "ZETA" },
            { id: "DELTA", position: [160, 330], width: 55, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [30, 210], width: 70, startingCargo: null },
            { id: "ZETA", position: [120, 80], width: 100, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 7: "Snake Path"
    {
        levelNumber: 7,
        name: "Snake Path",
        fuel: 150,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // S-förmiger Pfad (100px Durchgänge)
            { points: [[230, 550], [250, 550], [250, 630], [230, 630]], filled: true },
            { points: [[20, 450], [200, 450], [200, 470], [20, 470]], filled: true },
            { points: [[125, 350], [145, 350], [145, 450], [125, 450]], filled: true },
            { points: [[175, 250], [355, 250], [355, 270], [175, 270]], filled: true },
            { points: [[230, 150], [250, 150], [250, 250], [230, 250]], filled: true },
            { points: [[20, 50], [200, 50], [200, 70], [20, 70]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [30, 600], width: 90, startingCargo: null },
            { id: "BETA", position: [260, 590], width: 80, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [30, 390], width: 80, startingCargo: "ZETA" },
            { id: "DELTA", position: [170, 300], width: 70, startingCargo: "THETA" },
            { id: "EPSILON", position: [265, 190], width: 80, startingCargo: "ALPHA" },
            { id: "ZETA", position: [210, 80], width: 70, startingCargo: null },
            { id: "THETA", position: [50, 590], width: 70, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 8: "Twin Towers"
    {
        levelNumber: 8,
        name: "Twin Towers",
        fuel: 160,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Linker Turm
            { points: [[70, 100], [95, 100], [95, 550], [70, 550]], filled: true },
            { points: [[45, 180], [70, 180], [70, 200], [45, 200]], filled: true },
            { points: [[45, 300], [70, 300], [70, 320], [45, 320]], filled: true },
            { points: [[45, 420], [70, 420], [70, 440], [45, 440]], filled: true },
            // Rechter Turm
            { points: [[280, 100], [305, 100], [305, 550], [280, 550]], filled: true },
            { points: [[305, 180], [330, 180], [330, 200], [305, 200]], filled: true },
            { points: [[305, 300], [330, 300], [330, 320], [305, 320]], filled: true },
            { points: [[305, 420], [330, 420], [330, 440], [305, 440]], filled: true },
            // Verbindungen (100px Durchgänge)
            { points: [[95, 260], [280, 260], [280, 280], [95, 280]], filled: true },
            { points: [[95, 380], [280, 380], [280, 400], [95, 400]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [130, 600], width: 115, startingCargo: null },
            { id: "BETA", position: [25, 470], width: 60, startingCargo: "ZETA" },
            { id: "GAMMA", position: [110, 330], width: 70, startingCargo: "THETA" },
            { id: "DELTA", position: [310, 330], width: 60, startingCargo: "EPSILON" },
            { id: "EPSILON", position: [190, 220], width: 70, startingCargo: "ALPHA" },
            { id: "ZETA", position: [110, 140], width: 70, startingCargo: null },
            { id: "THETA", position: [25, 50], width: 80, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 9: "The Gauntlet"
    {
        levelNumber: 9,
        name: "The Gauntlet",
        fuel: 180,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Verschiedene Hindernisse übereinander
            // Sektion 1: Vertikale Enge
            { points: [[130, 540], [150, 540], [150, 620], [130, 620]], filled: true },
            { points: [[225, 540], [245, 540], [245, 620], [225, 620]], filled: true },
            // Sektion 2: Horizontale Enge
            { points: [[20, 440], [140, 440], [140, 460], [20, 460]], filled: true },
            { points: [[235, 440], [355, 440], [355, 460], [235, 460]], filled: true },
            // Sektion 3: Versetzter Korridor
            { points: [[90, 320], [110, 320], [110, 420], [90, 420]], filled: true },
            { points: [[265, 320], [285, 320], [285, 420], [265, 420]], filled: true },
            // Sektion 4: Finale Passage
            { points: [[150, 180], [170, 180], [170, 300], [150, 300]], filled: true },
            { points: [[205, 180], [225, 180], [225, 300], [205, 300]], filled: true },
            { points: [[100, 100], [275, 100], [275, 120], [100, 120]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [40, 600], width: 80, startingCargo: null },
            { id: "BETA", position: [165, 580], width: 50, startingCargo: "THETA" },
            { id: "GAMMA", position: [260, 580], width: 70, startingCargo: "EPSILON" },
            { id: "DELTA", position: [160, 480], width: 60, startingCargo: "ZETA" },
            { id: "EPSILON", position: [120, 360], width: 55, startingCargo: "ETA" },
            { id: "ZETA", position: [295, 360], width: 55, startingCargo: "ALPHA" },
            { id: "ETA", position: [175, 230], width: 55, startingCargo: null },
            { id: "THETA", position: [120, 50], width: 90, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 10: "Vertical Maze"
    {
        levelNumber: 10,
        name: "Vertical Maze",
        fuel: 220,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Komplexes Labyrinth (95-100px Durchgänge)
            // Obere Sektion
            { points: [[100, 80], [120, 80], [120, 180], [100, 180]], filled: true },
            { points: [[255, 80], [275, 80], [275, 180], [255, 180]], filled: true },
            { points: [[120, 140], [255, 140], [255, 160], [120, 160]], filled: true },
            // Mittlere Sektion
            { points: [[60, 220], [80, 220], [80, 340], [60, 340]], filled: true },
            { points: [[175, 240], [195, 240], [195, 360], [175, 360]], filled: true },
            { points: [[295, 220], [315, 220], [315, 340], [295, 340]], filled: true },
            { points: [[80, 280], [175, 280], [175, 300], [80, 300]], filled: true },
            { points: [[195, 300], [295, 300], [295, 320], [195, 320]], filled: true },
            // Untere Sektion
            { points: [[130, 400], [150, 400], [150, 520], [130, 520]], filled: true },
            { points: [[225, 400], [245, 400], [245, 520], [225, 520]], filled: true },
            { points: [[80, 460], [130, 460], [130, 480], [80, 480]], filled: true },
            { points: [[245, 460], [295, 460], [295, 480], [245, 480]], filled: true },
            // Finale Barriere
            { points: [[20, 560], [120, 560], [120, 580], [20, 580]], filled: true },
            { points: [[255, 560], [355, 560], [355, 580], [255, 580]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [130, 610], width: 115, startingCargo: null },
            { id: "BETA", position: [30, 130], width: 60, startingCargo: "ETA" },
            { id: "GAMMA", position: [135, 100], width: 50, startingCargo: "THETA" },
            { id: "DELTA", position: [290, 130], width: 60, startingCargo: "IOTA" },
            { id: "EPSILON", position: [90, 360], width: 70, startingCargo: "ZETA" },
            { id: "ZETA", position: [210, 360], width: 70, startingCargo: "ALPHA" },
            { id: "ETA", position: [160, 490], width: 55, startingCargo: null },
            { id: "THETA", position: [25, 520], width: 65, startingCargo: null },
            { id: "IOTA", position: [270, 610], width: 70, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    }
];