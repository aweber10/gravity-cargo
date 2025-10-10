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
            // Kaminstruktur - ENDGÜLTIG KORRIGIERT
            // Linke Wand: von oben (y=150) bis zum unteren Querbalken (y=400)
            { points: [[120, 150], [140, 150], [140, 400], [120, 400]], filled: true },
            // Rechte Wand: vom oberen Querbalken (y=290) bis unten (y=520)
            { points: [[245, 290], [265, 290], [265, 520], [245, 520]], filled: true },
            // Horizontale Querbalken (unverändert)
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
            // S-förmiger Pfad - vereinfacht
            { points: [[230, 520], [250, 520], [250, 630], [230, 630]], filled: true },
            { points: [[20, 420], [200, 420], [200, 440], [20, 440]], filled: true },
            { points: [[125, 320], [145, 320], [145, 420], [125, 420]], filled: true },
            { points: [[175, 210], [355, 210], [355, 230], [175, 230]], filled: true },
            { points: [[230, 110], [250, 110], [250, 210], [230, 210]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [30, 600], width: 90, startingCargo: null },
            { id: "BETA", position: [260, 560], width: 80, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [30, 360], width: 80, startingCargo: "ZETA" },
            { id: "DELTA", position: [30, 150], width: 70, startingCargo: "THETA" },
            { id: "EPSILON", position: [265, 150], width: 80, startingCargo: "ALPHA" },
            { id: "ZETA", position: [150, 100], width: 70, startingCargo: null },
            { id: "THETA", position: [260, 370], width: 70, startingCargo: null }
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
            // Linker Turm - VERKÜRZT und mit mehr Öffnungen
            { points: [[70, 120], [95, 120], [95, 350], [70, 350]], filled: true },
            { points: [[70, 480], [95, 480], [95, 580], [70, 580]], filled: true },
            // Kleine Vorsprünge links - ENTFERNT für mehr Platz bei BETA
            // Rechter Turm - VERKÜRZT und mit mehr Öffnungen
            { points: [[280, 120], [305, 120], [305, 350], [280, 350]], filled: true },
            { points: [[280, 450], [305, 450], [305, 580], [280, 580]], filled: true },
            // Kleine Vorsprünge rechts - REDUZIERT
            { points: [[305, 500], [330, 500], [330, 520], [305, 520]], filled: true },
            // Mittlere Verbindung - HÖHER verschoben für mehr Platz bei GAMMA
            { points: [[95, 360], [280, 360], [280, 380], [95, 380]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [130, 600], width: 115, startingCargo: null },
            { id: "BETA", position: [25, 550], width: 70, startingCargo: "ZETA" },
            { id: "GAMMA", position: [110, 420], width: 70, startingCargo: "THETA" },
            { id: "DELTA", position: [285, 410], width: 65, startingCargo: "EPSILON" },
            { id: "EPSILON", position: [155, 290], width: 70, startingCargo: "ALPHA" },
            { id: "ZETA", position: [110, 180], width: 70, startingCargo: null },
            { id: "THETA", position: [200, 80], width: 80, startingCargo: null }
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
            // Verschiedene Hindernisse übereinander - VERBESSERT
            // Sektion 1: Vertikale Enge (unten)
            { points: [[130, 540], [150, 540], [150, 620], [130, 620]], filled: true },
            { points: [[225, 540], [245, 540], [245, 620], [225, 620]], filled: true },
            // Sektion 2: Horizontale Enge - VERKÜRZT
            { points: [[20, 440], [120, 440], [120, 460], [20, 460]], filled: true },
            { points: [[255, 440], [355, 440], [355, 460], [255, 460]], filled: true },
            // Sektion 3: Versetzter Korridor - BREITER
            { points: [[80, 320], [100, 320], [100, 420], [80, 420]], filled: true },
            { points: [[275, 320], [295, 320], [295, 420], [275, 420]], filled: true },
            // Sektion 4: Finale Passage - BREITER
            { points: [[140, 180], [160, 180], [160, 300], [140, 300]], filled: true },
            { points: [[215, 180], [235, 180], [235, 300], [215, 300]], filled: true }
            // Oberste horizontale Wand ENTFERNT für THETA
        ],
        platforms: [
            { id: "ALPHA", position: [40, 600], width: 80, startingCargo: null },
            { id: "BETA", position: [165, 580], width: 50, startingCargo: "THETA" },
            { id: "GAMMA", position: [260, 580], width: 70, startingCargo: "EPSILON" },
            { id: "DELTA", position: [160, 480], width: 60, startingCargo: "ZETA" },
            { id: "EPSILON", position: [110, 360], width: 65, startingCargo: "ETA" },
            { id: "ZETA", position: [300, 360], width: 55, startingCargo: "ALPHA" },
            { id: "ETA", position: [170, 230], width: 60, startingCargo: null },
            { id: "THETA", position: [140, 80], width: 95, startingCargo: null }
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
            // Komplexes Labyrinth - VEREINFACHT
            // Obere Sektion - BREITER
            { points: [[90, 80], [110, 80], [110, 200], [90, 200]], filled: true },
            { points: [[265, 80], [285, 80], [285, 200], [265, 200]], filled: true },
            // Horizontale Wand über GAMMA ENTFERNT für Freiraum
            // Mittlere Sektion - BREITER, linke Wand VERKÜRZT für EPSILON
            { points: [[50, 240], [70, 240], [70, 340], [50, 340]], filled: true },
            { points: [[165, 260], [185, 260], [185, 380], [165, 380]], filled: true },
            { points: [[305, 240], [325, 240], [325, 360], [305, 360]], filled: true },
            { points: [[70, 300], [165, 300], [165, 320], [70, 320]], filled: true },
            // Untere Sektion - BREITER
            { points: [[120, 420], [140, 420], [140, 540], [120, 540]], filled: true },
            { points: [[235, 420], [255, 420], [255, 540], [235, 540]], filled: true },
            // Finale Barriere - VERKÜRZT
            { points: [[20, 570], [100, 570], [100, 590], [20, 590]], filled: true },
            { points: [[275, 570], [355, 570], [355, 590], [275, 590]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [130, 615], width: 115, startingCargo: null },
            { id: "BETA", position: [25, 150], width: 70, startingCargo: "ETA" },
            { id: "GAMMA", position: [135, 110], width: 65, startingCargo: "THETA" },
            { id: "DELTA", position: [290, 150], width: 70, startingCargo: null },
            { id: "EPSILON", position: [80, 390], width: 75, startingCargo: "ZETA" },
            { id: "ZETA", position: [210, 390], width: 75, startingCargo: "ALPHA" },
            { id: "ETA", position: [155, 470], width: 65, startingCargo: null },
            { id: "THETA", position: [25, 530], width: 75, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    }
];