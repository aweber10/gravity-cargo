# Implementierungsplan: Pause-Funktion

**Feature-ID:** 02  
**Priorität:** 🔴 KRITISCH  
**Aufwand:** ~1-2 Stunden  
**Status:** Geplant  
**Datum:** 2025-10-06

---

## 1. Übersicht

### Ziel
Implementierung einer vollständigen Pause-Funktion mit Pause-Screen und Optionen gemäß Spezifikation Sektion 3.2 und 9.2.

### Referenz zur Hauptspezifikation
- **Sektion 3.2:** Steuerung Desktop - Pause: ESC oder P-Taste
- **Sektion 3.3:** Steuerung Mobile - Pause-Button auf Screen
- **Sektion 9.2:** Screens - Pause-Screen

### Aktueller Zustand
- ❌ Keine Pause-Funktion vorhanden
- ❌ ESC/P-Taste nicht implementiert
- ⚠️ Pause-Button im HTML vorhanden aber nicht funktional
- ❌ Kein Pause-Screen

---

## 2. Anforderungen

### 2.1 Funktionale Anforderungen

#### Pause aktivieren
- **Desktop:** ESC oder P-Taste
- **Mobile:** Pause-Button (bereits im HTML als `#mobile-pause`)
- **Spiel einfrieren:** Alle Bewegungen stoppen, Update-Loop pausieren
- **Sound:** Alle Sounds pausieren

#### Pause-Screen
- **Overlay:** Halbtransparentes Overlay über gefrorenem Spiel
- **Text:** "PAUSED" zentral angezeigt
- **Optionen:**
  1. "FORTSETZEN" - Spiel weiterspielen
  2. "NEUSTART LEVEL" - Aktuelles Level neu starten
  3. "HAUPTMENÜ" - Zurück zum Startbildschirm

#### Navigation im Pause-Screen
- **Desktop:** 
  - Pfeiltasten/WASD: Navigation zwischen Optionen
  - Enter/Leertaste: Auswahl bestätigen
  - ESC/P: Direkt fortsetzen (Toggle)
- **Mobile:**
  - Tap auf Option
  - Pause-Button: Direkt fortsetzen (Toggle)

#### Pause beenden
- "FORTSETZEN" auswählen
- ESC/P erneut drücken (Toggle-Funktion)
- Pause-Button erneut tippen (Mobile)

---

### 2.2 Technische Anforderungen

#### Game State
Neuer State: `'paused'`

```javascript
game.state = 'menu' | 'playing' | 'paused' | 'exploding' | 'levelcomplete' | 'gameover' | 'gamewon'
```

#### Pause-Menu Datenstruktur
```javascript
const pauseMenu = {
    selectedOption: 0,
    options: [
        { id: 'resume', label: 'FORTSETZEN' },
        { id: 'restart', label: 'NEUSTART LEVEL' },
        { id: 'mainmenu', label: 'HAUPTMENÜ' }
    ]
};
```

---

## 3. Implementierungs-Schritte

### Phase 1: Pause-State und Toggle

#### 3.1.1 Pause-Datenstruktur
```javascript
// Nach menu-Objekt hinzufügen
const pauseMenu = {
    selectedOption: 0,
    options: [
        { id: 'resume', label: 'FORTSETZEN', bounds: null },
        { id: 'restart', label: 'NEUSTART LEVEL', bounds: null },
        { id: 'mainmenu', label: 'HAUPTMENÜ', bounds: null }
    ]
};
```

#### 3.1.2 Pause-Toggle Funktion
```javascript
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
```

---

### Phase 2: Input-Handling

#### 3.2.1 Keyboard - Pause aktivieren/deaktivieren
```javascript
// In keydown Handler ergänzen
if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && 
    (game.state === 'playing' || game.state === 'paused')) {
    e.preventDefault();
    togglePause();
    return;
}
```

#### 3.2.2 Keyboard - Navigation im Pause-Menu
```javascript
// In keydown Handler ergänzen
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
```

#### 3.2.3 Mobile Pause-Button
```javascript
// Pause-Button Event-Listener
const pauseButton = document.getElementById('mobile-pause');
pauseButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (game.state === 'playing' || game.state === 'paused') {
        togglePause();
    }
});
```

#### 3.2.4 Canvas Click/Touch für Pause-Menu
```javascript
// In canvas.click Handler ergänzen
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

// Entsprechend für touchstart
```

---

### Phase 3: Menu-Aktionen

#### 3.3.1 Position-Detection
```javascript
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
```

#### 3.3.2 Selection Handler
```javascript
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
            saveGameState(); // Optional: Stand vor Hauptmenü-Rückkehr speichern
            initMenu();
            break;
    }
}

function restartLevel() {
    game.lives = 3;
    game.currentCargo = null;
    game.deliveredCargo = 0;
    initLevel();
    game.state = 'playing';
}
```

---

### Phase 4: Rendering

#### 3.4.1 Pause-Screen Render-Funktion
```javascript
function renderPauseScreen() {
    // Spiel im Hintergrund (bereits gerendert)
    
    // Halbtransparentes Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // "PAUSED" Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 4);
    
    // Menu-Optionen
    const startY = canvas.height / 2;
    const spacing = 70;
    
    pauseMenu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        const isSelected = index === pauseMenu.selectedOption;
        const buttonWidth = 280;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;
        
        // Highlight für ausgewählten Button
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
        
        // Button-Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button-Text
        ctx.font = '22px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);
        
        // Speichere Button-Position für Click-Detection
        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });
    
    // Hinweis unten
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('ESC/P zum Fortsetzen', canvas.width / 2, canvas.height - 40);
}
```

#### 3.4.2 Render-Funktion erweitern
```javascript
function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (game.state === 'menu') {
        renderMenu();
        return;
    }
    
    // Normales Gameplay-Rendering
    // ... (bestehender Code)
    
    // Pause-Overlay NACH normalem Rendering
    if (game.state === 'paused') {
        renderPauseScreen();
        return;
    }
    
    // ... rest des Codes
}
```

---

### Phase 5: Update-Loop anpassen

#### 3.5.1 Update nur wenn nicht pausiert
```javascript
function update(dt) {
    // Partikel immer updaten (auch im Pause)
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.2;
        if (p.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
    
    // Wenn pausiert, stoppe hier
    if (game.state === 'paused') return;
    
    if (game.state !== 'playing') return;
    
    // ... restlicher Update-Code
}
```

---

## 4. Testing

### Funktionstests
- [ ] ESC pausiert das Spiel während Gameplay
- [ ] P-Taste pausiert das Spiel während Gameplay
- [ ] Pause-Button funktioniert (Mobile)
- [ ] Spiel friert ein (Raumschiff bewegt sich nicht)
- [ ] Pause-Screen wird angezeigt
- [ ] Navigation im Pause-Menu funktioniert
- [ ] "FORTSETZEN" setzt Spiel fort
- [ ] "NEUSTART LEVEL" startet Level neu
- [ ] "HAUPTMENÜ" führt zum Startbildschirm
- [ ] ESC/P im Pause-Menu setzt direkt fort (Toggle)
- [ ] Maus/Touch auf Optionen funktioniert
- [ ] Sounds pausieren korrekt

### Visuelle Tests
- [ ] Overlay ist halbtransparent
- [ ] Spiel im Hintergrund sichtbar
- [ ] Buttons korrekt positioniert
- [ ] Ausgewählter Button hervorgehoben
- [ ] Text gut lesbar

---

## 5. Dateien die geändert werden

### game.js
- Pause-Datenstruktur hinzufügen
- `togglePause()` Funktion
- `handlePauseMenuSelection()` Funktion
- `getPauseMenuOptionAtPosition()` Funktion
- `restartLevel()` Funktion
- `renderPauseScreen()` Funktion
- Input-Handler erweitern
- Update-Loop anpassen
- Render-Funktion erweitern

### Geschätzte Änderungen
- **Neue Zeilen:** ~150 Zeilen
- **Geänderte Zeilen:** ~10 Zeilen
- **Neue Funktionen:** 5

---

## 6. Abhängigkeiten

### Voraussetzungen
- ✅ Menu-System aus Feature #01 vorhanden
- ✅ Game State Management funktioniert
- ✅ Sound-System vorhanden

### Blockiert durch
- Keine

### Ermöglicht folgende Features
- Optionen-Screen (kann vom Pause-Menu erreichbar sein)
- Tutorial-Overlays (nutzt ähnliche Pause-Mechanik)

---

## 7. Bekannte Einschränkungen

### Version 1.0
- Keine Animation beim Ein-/Ausblenden des Pause-Screens
- Keine Sound-Lautstärke-Anpassung während Pause
- Keine Gameplay-Statistiken im Pause-Screen

### Mögliche Erweiterungen
- Fade-In/Out Animation
- Level-Fortschritt im Pause-Screen anzeigen
- Tastenkürzel-Übersicht im Pause-Screen
- Screenshot-Funktion aus Pause heraus

---

## 8. Erfolgs-Kriterien

✅ **Feature ist erfolgreich wenn:**
- Pause kann jederzeit aktiviert/deaktiviert werden
- Spiel friert vollständig ein während Pause
- Alle drei Optionen funktionieren korrekt
- Navigation funktioniert mit Keyboard, Maus und Touch
- Keine Regression in bestehendem Gameplay
- Visuelles Design passt zum Retro-Stil
- Performance bleibt bei 60 FPS

---

**Erstellt:** 2025-10-06  
**Status:** Bereit zur Implementierung  
**Geschätzter Aufwand:** 1-2 Stunden
