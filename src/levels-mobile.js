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
            { id: "GAMMA", position: [60, 180], width: 100, startingCargo: "ALPHA" }
        ],
        startPlatform: "ALPHA"
    },

    // Level 3: "Serpent Corridor" – überarbeitet mit breiteren, geschwungenen Passagen
    {
        levelNumber: 3,
        name: "Serpent Corridor",
        fuel: 115,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },
            // Geschwungene Korridor-Begrenzungen mit mindestens doppelter Schiffsbreite
            { points: [[40, 520], [140, 500], [190, 540], [190, 600], [120, 620], [40, 640]], filled: true },
            { points: [[120, 190], [190, 160], [230, 210], [230, 300], [150, 330], [120, 300]], filled: true },
            { points: [[300, 420], [350, 400], [355, 440], [355, 647], [300, 647]], filled: true },
            { points: [[260, 120], [355, 100], [355, 320], [300, 360], [260, 310]], filled: true }
        ],
        platforms: [
            { id: "ALPHA", position: [200, 600], width: 90, startingCargo: null },
            { id: "BETA", position: [220, 405], width: 80, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [40, 480], width: 80, startingCargo: "EPSILON" },
            { id: "EPSILON", position: [180, 140], width: 80, startingCargo: "ALPHA" }
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
            // Kaminstruktur 
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
        fuel: 145,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            // Rahmen
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },

            // Obere linke Wandmasse – kürzer und weicher
            {
                points: [
                    [20, 105],
                    [68, 96],
                    [95, 122],
                    [109, 162],
                    [101, 205],
                    [76, 241],
                    [20, 258]
                ],
                filled: true
            },

            // Obere rechte Wandmasse – asymmetrisch, aber offen
            {
                points: [
                    [355, 106],
                    [309, 96],
                    [281, 118],
                    [264, 156],
                    [271, 202],
                    [299, 238],
                    [355, 252]
                ],
                filled: true
            },

            // Linke mittlere Engstelle – deutlich entschärft
            {
                points: [
                    [20, 315],
                    [62, 300],
                    [84, 318],
                    [90, 353],
                    [78, 385],
                    [20, 403]
                ],
                filled: true
            },

            // Rechte mittlere Engstelle – ebenfalls weicher
            {
                points: [
                    [355, 300],
                    [320, 291],
                    [294, 309],
                    [285, 342],
                    [293, 375],
                    [320, 398],
                    [355, 406]
                ],
                filled: true
            },

            // Untere linke Außenkurve – offen für BETA-Anflug
            {
                points: [
                    [20, 432],
                    [58, 421],
                    [84, 442],
                    [91, 501],
                    [69, 554],
                    [20, 573]
                ],
                filled: true
            },

            // Untere rechte Außenkurve – offen für GAMMA-Anflug
            {
                points: [
                    [355, 434],
                    [321, 422],
                    [294, 444],
                    [287, 500],
                    [307, 552],
                    [355, 565]
                ],
                filled: true
            }
        ],
        platforms: [
            { id: "ALPHA", position: [245, 620], width: 70, startingCargo: null },
            { id: "BETA", position: [40, 590], width: 75, startingCargo: "EPSILON" },
            { id: "GAMMA", position: [265, 430], width: 75, startingCargo: "ZETA" },
            { id: "DELTA", position: [76, 420], width: 65, startingCargo: "ALPHA" },
            { id: "EPSILON", position: [50, 290], width: 85, startingCargo: null },
            { id: "ZETA", position: [245, 250], width: 85, startingCargo: null },
            { id: "THETA", position: [155, 105], width: 75, startingCargo: null }
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
            { id: "GAMMA", position: [110, 430], width: 70, startingCargo: "THETA" },
            { id: "DELTA", position: [285, 420], width: 65, startingCargo: "EPSILON" },
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

    // Level 10: "Organic Vertical Maze"
    {
        levelNumber: 10,
        name: "Organic Vertical Maze",
        fuel: 240,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            // Rahmen
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },

            // Obere linke Spiralformation
            {
                points: [
                    [20, 90],
                    [55, 75],
                    [85, 95],
                    [105, 135],
                    [95, 175],
                    [65, 195],
                    [35, 185],
                    [25, 150],
                    [35, 115],
                    [20, 105]
                ],
                filled: true
            },

            // Obere rechte Zackenwand
            {
                points: [
                    [355, 85],
                    [320, 70],
                    [285, 90],
                    [270, 130],
                    [280, 170],
                    [305, 190],
                    [330, 185],
                    [350, 155],
                    [355, 120]
                ],
                filled: true
            },

            // Mittlere linke Serpentine mit Höhle
            {
                points: [
                    [20, 260],
                    [75, 245],
                    [110, 265],
                    [125, 305],
                    [115, 345],
                    [85, 370],
                    [50, 375],
                    [25, 355],
                    [20, 320],
                    [30, 285]
                ],
                filled: true
            },

            // Mittlere rechte Wellenformation
            {
                points: [
                    [355, 250],
                    [310, 235],
                    [275, 255],
                    [260, 295],
                    [275, 335],
                    [310, 355],
                    [340, 350],
                    [355, 315],
                    [345, 275]
                ],
                filled: true
            },

            // Mittlere Verbindungsbrücke
            {
                points: [
                    [125, 310],
                    [165, 300],
                    [205, 315],
                    [220, 330],
                    [205, 345],
                    [165, 350],
                    [125, 335]
                ],
                filled: true
            },

            // Untere linke Höhlenwand mit schräger Öffnung
            {
                points: [
                    [20, 430],
                    [65, 415],
                    [95, 435],
                    [110, 465],
                    [105, 505],
                    [85, 535],
                    [55, 545],
                    [25, 535],
                    [20, 500],
                    [25, 465]
                ],
                filled: true
            },

            // Untere rechte Stalaktiten-Cluster
            {
                points: [
                    [330, 440],
                    [300, 425],
                    [280, 445],
                    [270, 485],
                    [285, 525],
                    [310, 535],
                    [335, 520],
                    [345, 480],
                    [340, 455]
                ],
                filled: true
            },

            // Finale untere Barriere - organisch
            {
                points: [
                    [20, 570],
                    [85, 565],
                    [110, 575],
                    [120, 590],
                    [110, 605],
                    [20, 615]
                ],
                filled: true
            },
            {
                points: [
                    [255, 570],
                    [320, 565],
                    [345, 575],
                    [355, 590],
                    [345, 605],
                    [255, 615]
                ],
                filled: true
            }
        ],
        platforms: [
            { id: "ALPHA", position: [175, 630], width: 85, startingCargo: null },
            { id: "BETA", position: [50, 220], width: 55, startingCargo: "ETA" },
            { id: "GAMMA", position: [200, 130], width: 50, startingCargo: "THETA" },
            { id: "DELTA", position: [315, 230], width: 60, startingCargo: null },
            { id: "EPSILON", position: [70, 415], width: 45, startingCargo: "ZETA" },
            { id: "ZETA", position: [280, 395], width: 55, startingCargo: "ALPHA" },
            { id: "ETA", position: [185, 480], width: 50, startingCargo: null },
            { id: "THETA", position: [155, 540], width: 60, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    },

    // Level 11: "Bio Tunnel Labyrinth"
    {
        levelNumber: 11,
        name: "Bio Tunnel Labyrinth",
        fuel: 280,
        gravity: 0.05,
        scrollDirection: null,
        walls: [
            // Rahmen
            { points: [[0, 0], [375, 0], [375, 20], [0, 20]], filled: true },
            { points: [[0, 0], [20, 0], [20, 667], [0, 667]], filled: true },
            { points: [[355, 0], [375, 0], [375, 667], [355, 667]], filled: true },
            { points: [[0, 647], [375, 647], [375, 667], [0, 667]], filled: true },

            // Kammer 1: Einstiegshöhle (oben links)
            {
                points: [
                    [20, 80], [85, 70], [115, 95], [125, 135],
                    [120, 175], [105, 205], [80, 225], [50, 235],
                    [25, 225], [20, 190], [25, 150], [35, 115]
                ],
                filled: true
            },

            // Kammer 2: Spiraltunnel (oben rechts)
            {
                points: [
                    [355, 90], [315, 80], [280, 100], [265, 140],
                    [270, 180], [285, 215], [310, 240], [335, 245],
                    [355, 235], [350, 200], [340, 165], [345, 130]
                ],
                filled: true
            },

            // Horizontale Verbindung Kammer 1 → 2 (obere Begrenzung)
            {
                points: [
                    [125, 220], [265, 210], [265, 230], [125, 230]
                ],
                filled: true
            },
            // Horizontale Verbindung Kammer 1 → 2 (untere Begrenzung für 40px Korridor)
            {
                points: [
                    [125, 270], [265, 270], [265, 290], [125, 290]
                ],
                filled: true
            },

            // Kammer 3: Zentrale Kaverne (mitte-unten links)
            {
                points: [
                    [20, 320], [75, 310], [125, 325], [160, 355],
                    [175, 395], [165, 435], [145, 465], [115, 485],
                    [80, 495], [45, 490], [20, 470], [25, 430],
                    [30, 390], [25, 350]
                ],
                filled: true
            },

            // Vertikale Verbindung Kammer 1 → 3 (linke Begrenzung)
            {
                points: [
                    [75, 270], [85, 270], [85, 320], [75, 320]
                ],
                filled: true
            },
            // Vertikale Verbindung Kammer 1 → 3 (rechte Begrenzung für 41px Korridor)
            {
                points: [
                    [126, 270], [136, 270], [136, 320], [126, 320]
                ],
                filled: true
            },

            // Kammer 4: S-Tunnel Finale (unten rechts)
            {
                points: [
                    [200, 440], [235, 435], [265, 450], [285, 480],
                    [295, 515], [290, 545], [275, 570], [245, 580],
                    [215, 575], [200, 550], [205, 515], [215, 485],
                    [225, 460]
                ],
                filled: true
            },

            // Diagonale Verbindung Kammer 3 → 4 (organischer 40px Tunnel)
            {
                points: [
                    [165, 420], [185, 410], [210, 415], [230, 430],
                    [245, 450], [230, 470], [205, 465], [180, 450]
                ],
                filled: true
            },
            {
                points: [
                    [185, 450], [205, 440], [230, 445], [250, 460],
                    [265, 480], [250, 500], [225, 495], [200, 480]
                ],
                filled: true
            }
        ],
        platforms: [
            { id: "ALPHA", position: [40, 75], width: 40, startingCargo: null },
            { id: "BETA", position: [34, 312], width: 40, startingCargo: "THETA" },
            { id: "GAMMA", position: [290, 75], width: 40, startingCargo: "IOTA" },
            { id: "DELTA", position: [200, 200], width: 41, startingCargo: "ETA" },
            { id: "EPSILON", position: [65, 600], width: 45, startingCargo: "GAMMA" },
            { id: "ZETA", position: [190, 410], width: 43, startingCargo: "ALPHA" },
            { id: "ETA", position: [86, 318], width: 40, startingCargo: null },
            { id: "THETA", position: [180, 340], width: 40, startingCargo: "DELTA" },
            { id: "IOTA", position: [160, 500], width: 41, startingCargo: null }
        ],
        startPlatform: "ALPHA"
    }
];
