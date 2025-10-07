# Implementierungsplan: Refactoring - SLA & Dateiaufteilung Phase 1

## Ziel
Verbesserung der Code-Qualität durch:
1. Anwendung von Single Level of Abstraction (SLA)
2. Aufteilung der monolithischen game.js in mehrere Module (Phase 1)

## Scope
- **SLA-Verbesserungen** in kritischen Funktionen
- **Phase 1 Aufteilung**: Extraktion von `levels.js`, `audio.js`, `config.js`

---

## Teil 1: Single Level of Abstraction (SLA)

### 1.1 Refactoring: `update()` Funktion

**Aktueller Code (gemischte Abstraktionsebenen):**
```javascript
function update(dt) {
    // Partikel-Update (Detail-Ebene)
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
    
    // Direkte Manipulation (Detail-Ebene)
    if (keys.left) {
        ship.angle -= PHYSICS.rotationSpeed * dt;
    }
    if (keys.right) {
        ship.angle += PHYSICS.rotationSpeed * dt;
    }
    
    // Komplexe Thrust-Logik (Detail-Ebene)
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
    
    // Physik-Berechnungen (Detail-Ebene)
    ship.vy += PHYSICS.gravity;
    ship.vx *= PHYSICS.friction;
    ship.vy *= PHYSICS.friction;
    ship.x += ship.vx;
    ship.y += ship.vy;
    
    // High-Level Aufrufe
    checkCollisions();
    updateUI();
}
```

**Neuer Code (konsistente Abstraktionsebene):**
```javascript
function update(dt) {
    updateParticles(dt);
    
    if (game.state === 'paused') return;
    if (game.state !== 'playing') return;
    
    updateShipRotation(dt);
    updateShipThrust(dt);
    applyPhysics(dt);
    updateShipPosition(dt);
    checkCollisions();
    updateUI();
}

function updateParticles(dt) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.2;
        if (p.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
}

function updateShipRotation(dt) {
    if (keys.left) {
        ship.angle -= PHYSICS.rotationSpeed * dt;
    }
    if (keys.right) {
        ship.angle += PHYSICS.rotationSpeed * dt;
    }
}

function updateShipThrust(dt) {
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
}

function applyPhysics(dt) {
    ship.vy += PHYSICS.gravity;
    ship.vx *= PHYSICS.friction;
    ship.vy *= PHYSICS.friction;
}

function updateShipPosition(dt) {
    ship.x += ship.vx;
    ship.y += ship.vy;
}
```

### 1.2 Refactoring: `renderGameWon()` Funktion

**Problem:** 180+ Zeilen, mischt Layout-Berechnung mit Rendering

**Lösung:** Aufteilen in separate Funktionen

```javascript
function renderGameWon() {
    renderGameWonBackground();
    renderGameWonTitle();
    renderGameWonScore();
    renderGameWonCredits();
    renderGameWonInstructions();
}

function renderGameWonBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderGameWonTitle() {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 56px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GLÜCKWUNSCH!', canvas.width / 2, canvas.height / 5);
    
    ctx.font = '32px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ALLE LEVEL ABGESCHLOSSEN', canvas.width / 2, canvas.height / 5 + 70);
}

function renderGameWonScore() {
    const maxScore = calculateMaxScore();
    const percentage = Math.round((game.score / maxScore) * 100);
    const scoreY = canvas.height / 2 - 40;
    
    ctx.font = '36px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`DEIN SCORE: ${game.score}`, canvas.width / 2, scoreY);
    
    ctx.font = '24px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.fillText(`Maximal möglich: ${maxScore}`, canvas.width / 2, scoreY + 45);
    
    ctx.font = '28px "Courier New"';
    ctx.fillStyle = percentage === 100 ? '#0f0' : '#ff0';
    ctx.fillText(`${percentage}% erreicht`, canvas.width / 2, scoreY + 90);
    
    if (percentage === 100) {
        ctx.font = '20px "Courier New"';
        ctx.fillStyle = '#0f0';
        ctx.fillText('★ PERFEKT ★', canvas.width / 2, scoreY + 130);
    }
}

function renderGameWonCredits() {
    const creditsY = canvas.height - 200;
    
    ctx.font = 'bold 20px "Courier New"';
    ctx.fillStyle = '#fff';
    ctx.fillText('CREDITS', canvas.width / 2, creditsY);
    
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#aaa';
    const lineHeight = 25;
    let line = 0;
    
    ctx.fillText('Autor: Andreas Weber', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    line++; // Leerzeile
    ctx.fillText('Entwickelt mit:', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Claude Sonnet 4.5', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Claude Code', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
    ctx.fillText('Roo Code', canvas.width / 2, creditsY + 40 + (line++ * lineHeight));
}

function renderGameWonInstructions() {
    ctx.font = '18px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height - 40);
}
```

---

## Teil 2: Dateiaufteilung Phase 1

### 2.1 Erstelle `config.js`

**Inhalt:**
```javascript
// config.js - Spiel-Konstanten und Konfiguration

export const PHYSICS = {
    gravity: 0.05,
    thrust: 0.15,
    rotationSpeed: Math.PI * 2 / 3,
    friction: 0.98,
    maxLandingSpeed: 2,
    maxLandingAngle: Math.PI / 12,
    fuelConsumption: 0.1
};

export const COLORS = {
    background: '#000',
    text: '#fff',
    accent: '#0ff',
    wall: '#0ff',
    platform: '#0f0',
    platformTarget: '#fff',
    cargo: '#ff0',
    ship: '#fff',
    shipFill: '#ccc',
    thrust: '#ff8800'
};

export const UI_CONFIG = {
    fontSize: {
        title: 'bold 64px "Courier New"',
        subtitle: '32px "Courier New"',
        normal: '24px "Courier New"',
        small: '16px "Courier New"'
    }
};
```

**Änderungen in game.js:**
- Entferne `const PHYSICS = {...}`
- Füge am Anfang hinzu: `import { PHYSICS, COLORS, UI_CONFIG } from './config.js';`

### 2.2 Erstelle `levels.js`

**Inhalt:**
```javascript
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
            // ... alle Wände
        ],
        platforms: [
            { id: "ALPHA", position: [100, 500], width: 100, startingCargo: null },
            // ... alle Plattformen
        ],
        startPlatform: "ALPHA"
    },
    // ... alle 10 Level
];

export function calculateMaxScore() {
    return levelTemplates.reduce((sum, level) => {
        return sum + level.platforms.filter(p => p.startingCargo !== null).length;
    }, 0);
}
```

**Änderungen in game.js:**
- Entferne komplettes `levelTemplates` Array (~300 Zeilen)
- Entferne `calculateMaxScore()` Funktion
- Füge am Anfang hinzu: `import { levelTemplates, calculateMaxScore } from './levels.js';`

### 2.3 Erstelle `audio.js`

**Inhalt:**
```javascript
// audio.js - Audio-System

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let thrustSoundPlaying = false;

export function playSound(type) {
    switch(type) {
        case 'thrust':
            playThrustSound();
            break;
        case 'explosion':
            playExplosionSound();
            break;
        case 'land':
            playLandSound();
            break;
        case 'pickup':
            playPickupSound();
            break;
        case 'delivery':
            playDeliverySound();
            break;
        case 'menuMove':
            playMenuMoveSound();
            break;
        case 'menuSelect':
            playMenuSelectSound();
            break;
    }
}

function playThrustSound() {
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
}

function playExplosionSound() {
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
}

function playLandSound() {
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
}

function playPickupSound() {
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
}

function playDeliverySound() {
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
}

function playMenuMoveSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 400;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.05;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

function playMenuSelectSound() {
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
```

**Änderungen in game.js:**
- Entferne komplettes Audio-System (~150 Zeilen)
- Füge am Anfang hinzu: `import { playSound } from './audio.js';`

### 2.4 Aktualisiere `index.html`

**Wichtig:** Module-System aktivieren

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gravity Cargo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="game-container">
        <canvas id="gameCanvas"></canvas>
        <div id="hud">
            <div id="score">SCORE: 00</div>
            <div id="lives"></div>
            <div id="fuel">
                <div id="fuel-label">FUEL</div>
                <div id="fuel-bar"></div>
            </div>
            <div id="target-platform">TARGET: --</div>
        </div>
        <div id="mobile-controls">
            <button id="mobile-pause">⏸</button>
            <button id="mobile-thrust">🚀</button>
        </div>
    </div>
    
    <!-- WICHTIG: type="module" hinzufügen -->
    <script type="module" src="game.js"></script>
</body>
</html>
```

---

## Implementierungsschritte

### Schritt 1: Backup erstellen
```bash
cp game.js game.js.backup
```

### Schritt 2: Neue Dateien erstellen
1. `config.js` erstellen und PHYSICS exportieren
2. `levels.js` erstellen und levelTemplates extrahieren
3. `audio.js` erstellen und Audio-System extrahieren

### Schritt 3: game.js anpassen
1. Imports am Anfang hinzufügen
2. Extrahierte Bereiche entfernen
3. SLA-Refactorings durchführen (update, renderGameWon)

### Schritt 4: index.html anpassen
```html
<script type="module" src="game.js"></script>
```

### Schritt 5: Testen
- [ ] Spiel startet im Browser
- [ ] Audio funktioniert
- [ ] Level werden geladen
- [ ] Physik funktioniert korrekt
- [ ] Menu-Navigation funktioniert
- [ ] Speichern/Laden funktioniert

---

## Erfolgskriterien

### Funktional
- ✅ Alle bisherigen Features funktionieren unverändert
- ✅ Keine Regressions-Bugs
- ✅ Performance unverändert

### Code-Qualität
- ✅ game.js reduziert auf ~900 Zeilen (von 1300)
- ✅ `update()` Funktion hat konsistente Abstraktionsebene
- ✅ `renderGameWon()` ist in 5 kleinere Funktionen aufgeteilt
- ✅ Klare Modul-Verantwortlichkeiten

### Wartbarkeit
- ✅ Level-Design kann isoliert geändert werden
- ✅ Audio-System kann unabhängig erweitert werden
- ✅ Konstanten zentral verwaltbar

---

## Geschätzte Zeiteinteilung

- **SLA Refactoring:** 30 Minuten
  - update() aufteilen: 15 min
  - renderGameWon() aufteilen: 15 min
  
- **Dateiaufteilung:** 45 Minuten
  - config.js: 10 min
  - levels.js: 15 min
  - audio.js: 15 min
  - Integration & Testing: 15 min

**Gesamt:** ca. 75 Minuten

---

## Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Module-Syntax in älteren Browsern | Niedrig | Moderne Browser unterstützen ES6 Module |
| Import-Pfad-Probleme | Mittel | Relative Pfade verwenden (`./`) |
| Scope-Probleme durch Exports | Niedrig | Sorgfältige Prüfung der Dependencies |

---

## Nächste Schritte (Phase 2)

Nach erfolgreicher Phase 1:
- Rendering-Module (menu.js, pause.js, game.js, ui.js)
- Input-Handling (input.js)
- Game-Logic Module (level.js, lifecycle.js, platform.js)
