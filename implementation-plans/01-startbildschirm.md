# Implementierungsplan: Startbildschirm

**Feature-ID:** 01  
**Priorität:** 🔴 KRITISCH  
**Aufwand:** ~2-3 Stunden  
**Status:** Geplant  
**Datum:** 2025-10-06

---

## 1. Übersicht

### Ziel
Implementierung eines vollständigen Startbildschirms gemäß Spezifikation Sektion 9.2, der beim Laden des Spiels angezeigt wird und dem Spieler Optionen zum Starten eines neuen Spiels oder Fortsetzen bietet.

### Referenz zur Hauptspezifikation
- **Sektion 9.2:** Screens - Startbildschirm
- **Sektion 10.1:** Visuelles Design - Farbschema
- **Sektion 11.1:** Audio-Design - UI-Navigation Sound

### Aktueller Zustand
- ❌ Kein Startbildschirm vorhanden
- ❌ Spiel startet sofort bei Seitenaufruf
- ❌ Keine Möglichkeit zum Neustart ohne Seiten-Reload

---

## 2. Anforderungen

### 2.1 Funktionale Anforderungen

#### Visuelle Elemente
- **Titel "GRAVITY CARGO"**
  - Großflächig dargestellt
  - Retro-Font (Courier New)
  - Zentral positioniert
  - Farbe: Weiß (#fff) auf schwarzem Hintergrund

#### Menu-Optionen
1. **"NEUES SPIEL" Button**
   - Startet Level 1 mit 0 Punkten
   - Setzt alle Spielstände zurück
   - Immer verfügbar

2. **"FORTSETZEN" Button**
   - Lädt gespeicherten Spielstand (Level + Score)
   - Nur sichtbar wenn Spielstand vorhanden
   - Grau ausgegraut wenn nicht verfügbar

3. **"OPTIONEN" Button** (Optional für Version 1)
   - Öffnet Optionen-Screen
   - Sound Ein/Aus Toggle
   - Kann zunächst weggelassen werden

#### Interaktion
- **Desktop:** 
  - Tastatur-Navigation (Pfeiltasten Hoch/Runter)
  - Enter zum Bestätigen
  - ODER Mausklick auf Button
  
- **Mobile:**
  - Tap auf Button

#### Audio
- Dezentes Klick-Geräusch bei Menu-Navigation
- Bestätigungs-Sound beim Start

---

### 2.2 Technische Anforderungen

#### Game States
Neuer State erforderlich: `'menu'`

```javascript
game.state = 'menu' | 'playing' | 'paused' | 'exploding' | 'levelcomplete' | 'gameover' | 'gamewon'
```

#### Datenstruktur für Menu
```javascript
const menu = {
    currentScreen: 'main',  // 'main', 'options'
    selectedOption: 0,      // Index des ausgewählten Menu-Eintrags
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true },
        { id: 'continue', label: 'FORTSETZEN', enabled: false },
        // { id: 'options', label: 'OPTIONEN', enabled: true }  // Optional
    ]
};
```

#### Speicher-Integration
- Prüfung ob Spielstand in localStorage vorhanden
- Key: `'gravityCargo_saveData'`
- Format: `{ level: number, score: number }`

---

## 3. Implementierungs-Schritte

### Phase 1: Game State Management

#### 3.1.1 Game State hinzufügen
```javascript
// In game.js - Zeile ~42
const game = {
    state: 'menu',  // ← Ändern von 'playing' zu 'menu'
    // ... rest bleibt gleich
};
```

#### 3.1.2 Menu-Datenstruktur erstellen
```javascript
// Nach game-Objekt hinzufügen
const menu = {
    currentScreen: 'main',
    selectedOption: 0,
    options: [
        { id: 'newgame', label: 'NEUES SPIEL', enabled: true },
        { id: 'continue', label: 'FORTSETZEN', enabled: false }
    ]
};
```

#### 3.1.3 Initialisierungs-Funktion
```javascript
function initMenu() {
    // Prüfe ob Spielstand vorhanden
    const saveData = loadGameState();
    if (saveData) {
        menu.options[1].enabled = true;
    }
    game.state = 'menu';
}
```

---

### Phase 2: Speichersystem (Basis)

#### 3.2.1 Save-Funktionen erstellen
```javascript
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
```

---

### Phase 3: Input-Handling für Menu

#### 3.3.1 Keyboard-Navigation
```javascript
// In keydown Event-Handler ergänzen
document.addEventListener('keydown', (e) => {
    if (game.state === 'menu') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            menu.selectedOption = Math.max(0, menu.selectedOption - 1);
            playSound('menuMove');
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            const enabledOptions = menu.options.filter(o => o.enabled);
            menu.selectedOption = Math.min(enabledOptions.length - 1, menu.selectedOption + 1);
            playSound('menuMove');
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMenuSelection();
        }
        return;
    }
    
    // Bestehender Code für Spiel-Steuerung...
});
```

#### 3.3.2 Maus/Touch-Input
```javascript
canvas.addEventListener('click', (e) => {
    if (game.state === 'menu') {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Berechne welcher Button geklickt wurde
        const selectedOption = getMenuOptionAtPosition(clickX, clickY);
        if (selectedOption !== -1 && menu.options[selectedOption].enabled) {
            menu.selectedOption = selectedOption;
            handleMenuSelection();
        }
    }
});

function getMenuOptionAtPosition(x, y) {
    // Wird in Render-Phase implementiert
    // Gibt Index des geklickten Buttons zurück oder -1
}
```

---

### Phase 4: Menu-Aktionen

#### 3.4.1 Selection Handler
```javascript
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
        case 'options':
            // Für später
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
```

---

### Phase 5: Rendering

#### 3.5.1 Menu-Render-Funktion
```javascript
function renderMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Titel
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRAVITY CARGO', canvas.width / 2, canvas.height / 3);
    
    // Untertitel (optional)
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('A Retro Physics Puzzler', canvas.width / 2, canvas.height / 3 + 60);
    
    // Menu-Optionen
    const startY = canvas.height / 2 + 20;
    const spacing = 60;
    
    menu.options.forEach((option, index) => {
        const y = startY + index * spacing;
        
        // Button-Hintergrund
        const isSelected = index === menu.selectedOption;
        const buttonWidth = 300;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;
        
        // Highlight für ausgewählten Button
        if (isSelected && option.enabled) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
        
        // Button-Border
        ctx.strokeStyle = option.enabled ? '#fff' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button-Text
        ctx.font = '24px "Courier New"';
        ctx.fillStyle = option.enabled ? '#fff' : '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);
        
        // Speichere Button-Position für Click-Detection
        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });
    
    // Footer mit Credits (klein)
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Idee: Andreas Weber | Spec: Claude Sonnet 4.5 | Code: Claude Code', 
                 canvas.width / 2, canvas.height - 30);
}
```

#### 3.5.2 getMenuOptionAtPosition implementieren
```javascript
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
```

#### 3.5.3 Render-Funktion anpassen
```javascript
function render() {
    if (game.state === 'menu') {
        renderMenu();
        return;
    }
    
    // Bestehender Rendering-Code für Gameplay...
}
```

---

### Phase 6: Audio-Erweiterung

#### 3.6.1 Menu-Sounds hinzufügen
```javascript
function playSound(type) {
    // Bestehende Sounds...
    
    if (type === 'menuMove') {
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
```

---

### Phase 7: Integration & Auto-Save

#### 3.7.1 Auto-Save bei Level-Complete
```javascript
function levelComplete() {
    game.state = 'levelcomplete';
    game.level++;
    
    // Auto-Save hinzufügen
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
```

#### 3.7.2 Zurück zum Menu bei Game Over
```javascript
function explode() {
    playSound('explosion');
    createExplosion(ship.x, ship.y);
    game.state = 'exploding';
    game.explosionTime = 1000;
    
    setTimeout(() => {
        game.lives--;
        if (game.lives <= 0) {
            game.state = 'gameover';
            // Spielstand löschen bei Game Over
            clearGameState();
        } else {
            respawn();
            game.state = 'playing';
        }
    }, 1000);
}
```

#### 3.7.3 Game Over Screen mit Zurück-Option
```javascript
// In render() - Game Over Teil erweitern
if (game.state === 'gameover') {
    ctx.fillStyle = '#fff';
    ctx.font = '48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px "Courier New"';
    ctx.fillText(`LEVEL: ${game.level}`, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText(`SCORE: ${game.score}`, canvas.width / 2, canvas.height / 2 + 85);
    
    // Zurück zum Menu
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('ENTER für Hauptmenü', canvas.width / 2, canvas.height / 2 + 140);
    return;
}

// In keydown Handler
if (game.state === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    initMenu();
}
```

---

## 4. Testing-Checkliste

### Funktionale Tests
- [ ] Menu erscheint beim Laden
- [ ] "NEUES SPIEL" startet Level 1 mit 0 Punkten
- [ ] "FORTSETZEN" ist deaktiviert ohne Spielstand
- [ ] "FORTSETZEN" ist aktiviert mit Spielstand
- [ ] "FORTSETZEN" lädt korrekten Level und Score
- [ ] Keyboard-Navigation funktioniert (Hoch/Runter/Enter)
- [ ] Maus-Klick auf Button funktioniert
- [ ] Touch-Tap auf Button funktioniert (Mobile)
- [ ] Auto-Save nach Level-Abschluss
- [ ] Spielstand wird gelöscht bei Game Over
- [ ] Zurück zum Menu nach Game Over

### Visuelle Tests
- [ ] Titel ist gut lesbar
- [ ] Buttons sind zentriert
- [ ] Ausgewählter Button ist hervorgehoben
- [ ] Deaktivierte Buttons sind grau
- [ ] Credits im Footer sichtbar
- [ ] Responsive auf verschiedenen Bildschirmgrößen

### Audio Tests
- [ ] Menu-Navigation Sound hörbar
- [ ] Menu-Auswahl Sound hörbar
- [ ] Sounds nicht zu laut

---

## 5. Bekannte Einschränkungen

### Version 1.0
- Kein Optionen-Menu (wird später hinzugefügt)
- Keine Animationen beim Menu-Übergang
- Keine Hintergrund-Partikel im Menu

### Mögliche Erweiterungen für später
- Animierter Titel (pulsierend)
- Sternenfeld im Hintergrund
- Highscore-Anzeige im Menu
- Level-Select nach Durchspielen

---

## 6. Dateien die geändert werden

### game.js
- Game State Management erweitern
- Menu-Datenstruktur hinzufügen
- Input-Handler erweitern
- Render-Funktion erweitern
- Speicher-Funktionen hinzufügen
- Menu-Render-Funktion hinzufügen
- Audio-Funktionen erweitern

### Geschätzte Änderungen
- **Neue Zeilen:** ~250 Zeilen
- **Geänderte Zeilen:** ~20 Zeilen
- **Neue Funktionen:** 10+

---

## 7. Abhängigkeiten

### Voraussetzungen
- ✅ Bestehende Game-Loop vorhanden
- ✅ Audio-System vorhanden
- ✅ Render-System vorhanden

### Blockiert durch
- Keine

### Blockiert folgende Features
- Pause-Menu (braucht ähnliche Menu-Struktur)
- Optionen-Screen (nutzt gleiche Menu-Basis)

---

## 8. Rollout-Plan

### Entwicklung
1. Phase 1-2: State & Speicher (~30 min)
2. Phase 3-4: Input & Logik (~45 min)
3. Phase 5: Rendering (~45 min)
4. Phase 6-7: Audio & Integration (~30 min)
5. Testing & Bugfixes (~30 min)

### Deployment
- Commit nach jeder abgeschlossenen Phase
- Final Testing auf Desktop + Mobile
- Deployment auf Production

---

## 9. Erfolgs-Kriterien

✅ **Feature ist erfolgreich wenn:**
- Menu erscheint beim Spielstart
- Neues Spiel kann gestartet werden
- Spielstand wird gespeichert und kann fortgesetzt werden
- Alle Inputs funktionieren (Keyboard + Mouse + Touch)
- Keine Regression in bestehendem Gameplay
- Visuals entsprechen Retro-Stil
- Performance bleibt bei 60 FPS

---

**Erstellt:** 2025-10-06  
**Autor:** Claude Code  
**Review:** Ausstehend  
**Nächster Schritt:** Implementation starten
