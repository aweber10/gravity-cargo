# Implementierungsplan: Desktop-Level auf Mobile mit Sidescrolling

**Feature-ID:** 08  
**Priorität:** 🟡 Mittel  
**Aufwand:** ~6-10 Stunden  
**Status:** Geplant  
**Datum:** 2026-05-18

## 1. Übersicht

Desktop-Level sollen optional auch auf Mobilgeräten spielbar werden. Die Desktop-Level behalten ihre Weltkoordinaten, typischerweise `800x600`. Auf Mobile wird die Levelhöhe auf die mobile Spielfeldhöhe skaliert. Da die Breite dadurch größer als der sichtbare Bildschirm ist, wird die Levelwelt horizontal per Kamera/Sidescrolling spielbar gemacht.

Das ist machbar, aber kein reines Rendering-Thema. Der Kern ist die Einführung einer sauberen Kamera-/Viewport-Schicht, weil aktuell viele Stellen implizit annehmen: Canvas-Koordinate entspricht Weltkoordinate.

## 2. Zielverhalten

- Mobile kann Desktop-Level statt `levels-mobile.js` spielen.
- Desktop-Level werden auf Mobile proportional skaliert:
  - `scale = mobilePlayableHeight / desktopLevelBounds.height`
  - sichtbare Weltbreite = `canvas.width / scale`
- Die Kamera scrollt horizontal und folgt dem Schiff.
- Die Kamera wird geklemmt:
  - `camera.x >= levelBounds.left`
  - `camera.x <= levelBounds.right - visibleWorldWidth`
- Physik und Kollision bleiben in Weltkoordinaten.
- Rendering der Levelszene nutzt Kamera-Transformation.
- HUD, Menüs, Pause, Gameover und Endscreens bleiben screen-space und scrollen nicht mit.
- Touch-Input wird von Screen-Koordinaten zurück in Weltkoordinaten transformiert.

## 3. Wichtigste Änderungen

### Level-Auswahl

Aktuell wählt `level-manager.js` abhängig von `isMobile` zwischen `levels.js` und `levels-mobile.js`.

Geplante Änderung:
- Neue Konfiguration einführen, z.B. `MOBILE_LEVEL_MODE`.
- Unterstützte Werte:
  - `mobile`: heutiges Verhalten, Mobile nutzt `levels-mobile.js`.
  - `desktop-scroll`: Mobile nutzt `levels.js` mit Kamera/Sidescrolling.
- Default bleibt zunächst `mobile`, um Regressionen zu vermeiden.
- `desktop-scroll` wird als expliziter Modus aktiviert.

### Kamera-/Viewport-Modul

Neues Modul, z.B. `camera.js`.

Aufgaben:
- Level-Bounds lesen.
- Mobile Scale berechnen.
- sichtbaren Weltbereich berechnen.
- Kamera-X anhand Schiffposition aktualisieren.
- Kamera an Levelgrenzen klemmen.
- Screen-zu-Welt und Welt-zu-Screen Transformation bereitstellen.

Benötigte API:

```js
getCameraState()
updateCamera(ship, levelBounds, canvas, isMobileDesktopScrollMode)
getSceneTransform()
screenToWorld(x, y)
worldToScreen(x, y)
```

### Rendering

`scene-renderer.js` rendert aktuell Weltkoordinaten direkt ins Canvas.

Geplante Änderung:
- Vor dem Rendern der Levelszene:
  - `ctx.save()`
  - `ctx.scale(scale, scale)`
  - `ctx.translate(-camera.x, -camera.y)`
- Danach:
  - Wände, Plattformen, Schiff, Partikel, Asteroiden wie bisher rendern.
  - `ctx.restore()`
- HUD und Touch-Indikator bewusst separat behandeln:
  - HUD bleibt screen-space.
  - Touch-Indikator entweder screen-space zeichnen oder Weltpunkte korrekt transformieren.

### Input

`pointer-controls.js` speichert Touchpositionen aktuell in Canvas-Koordinaten. `ship-physics.js` vergleicht diese direkt mit `ship.x/y`.

Geplante Änderung:
- Touch- und Pointerpositionen für Gameplay durch `screenToWorld()` transformieren.
- `touchState.x/y` bleiben Weltkoordinaten.
- Menü-/Pause-/Levelselect-Klicks bleiben screen-space.
- Nur `gameState.state === 'playing'` nutzt Kamera-Transformation.

### HUD und DOM-HUD

HUD-Layout hängt derzeit an `getLevelBounds()` und Canvas/Viewport-Mapping.

Geplante Änderung:
- Für scrollende Mobile-Desktop-Level unterscheidet HUD zwischen:
  - vollständigen Level-Bounds
  - sichtbarem Level-Viewport
- Score/Timer sollen am sichtbaren Spielfeldrand bleiben, nicht am rechten Rand der gesamten Desktop-Levelbreite.
- Fuel/Target bleiben unterhalb des sichtbaren Spielfelds, sofern Platz vorhanden ist.
- Fallback oben bleibt erhalten, falls kein Platz unterhalb vorhanden ist.

## 4. Riskante Aspekte

### Risiko: Canvas-Koordinaten und Weltkoordinaten vermischen sich

Viele Stellen nutzen derzeit dieselben Zahlen für Canvas und Welt. Mit Kamera gilt das nicht mehr.

Betroffene Bereiche:
- Touch-Input
- Touch-Indikator
- HUD-Layout
- Rendering
- Partikel
- Asteroiden
- Debug-/Bounds-Logik

Gegenmaßnahme:
- Klare Benennung:
  - `screenX/screenY`
  - `worldX/worldY`
  - `camera.x`
  - `scale`
- Transformation nur im Kamera-Modul.
- Tests für `screenToWorld()` und `worldToScreen()`.

### Risiko: Physik verändert sich unbeabsichtigt

Wenn Levelgeometrie direkt skaliert würde, würden Landegeschwindigkeit, Gravitation, Schiffgröße und Kollisionen anders wirken.

Entscheidung:
- Physik bleibt vollständig in Desktop-Weltkoordinaten.
- Nur Rendering und Input werden transformiert.
- Keine Skalierung der Leveldaten selbst.

### Risiko: Touch-Steuerung fühlt sich falsch an

Wenn Touchpositionen nicht in Weltkoordinaten umgerechnet werden, dreht das Schiff zur falschen Position, besonders bei gescrollter Kamera.

Gegenmaßnahme:
- Gameplay-Touchposition immer per `screenToWorld()` speichern.
- Menü- und UI-Klicks nie transformieren.
- Manuell testen:
  - Kamera links
  - Kamera mittig
  - Kamera rechts
  - Finger links/rechts vom Schiff

### Risiko: Kamera folgt zu aggressiv oder zu spät

Eine harte Zentrierung kann auf Mobile unruhig wirken. Zu spätes Scrollen kann das Ziel verdecken.

Entscheidung für erste Version:
- Kamera zentriert Schiff horizontal, mit Clamp an Levelgrenzen.
- Kein Smooth-Damping in v1.
- Falls ruckelig: Damping später ergänzen.

### Risiko: Levelränder und HUD-Bereiche werden falsch berechnet

Desktop-Levelhöhe `600` wird auf mobile Spielfeldhöhe skaliert. Wenn HUD-Bereiche vom Canvas abgezogen werden, muss klar sein, was "mobilePlayableHeight" bedeutet.

Entscheidung:
- Für v1 ist `mobilePlayableHeight = canvas.height`.
- DOM-HUD darf wie bisher über/unter dem Level liegen, aber Gameplay-Skalierung nutzt volle Canvas-Höhe.
- Falls Fuel/Target Levelinhalt verdeckt, wird das bestehende HUD-Fallback verwendet.

### Risiko: Desktop-Level sind auf Touch unfair

Desktop-Level wurden nicht für Touch und kleine Screens entworfen. Enge Passagen können spielbar, aber schwer sein.

Gegenmaßnahme:
- Feature zunächst optional machen.
- Mobile-Level bleiben Default.
- Desktop-scroll-Modus wird separat getestet.
- Kein Anspruch, alle Desktop-Level sofort touch-fair zu machen.

### Risiko: Asteroiden despawnen falsch

`asteroid-manager.js` nutzt harte Offscreen-Grenzen wie `x < -100 || x > 900 || y > 800`. Bei Kamera/Sidescrolling sind diese Werte nicht mehr verlässlich.

Gegenmaßnahme:
- Asteroid-Offscreen-Logik auf Level-Bounds plus Puffer umstellen.
- Für v1:
  - `left = levelBounds.left - 100`
  - `right = levelBounds.right + 100`
  - `top = levelBounds.top - 100`
  - `bottom = levelBounds.bottom + 100`
- Nicht an sichtbaren Kameraausschnitt koppeln, sonst verschwinden Asteroiden beim Scrollen.

### Risiko: Partikel/Explosionen rendern an falscher Stelle

Partikel liegen in Weltkoordinaten. Wenn sie innerhalb der Levelszene gerendert werden, ist das korrekt. Wenn später Screen-space-Effekte dazukommen, müssen sie getrennt werden.

Entscheidung:
- Gameplay-Partikel bleiben Weltkoordinaten und werden mit Kamera transformiert.
- Fireworks bleiben Endscreen-screen-space und unverändert.

### Risiko: Level-Bounds aus Walls reichen nicht für alle Inhalte

`getLevelBounds()` leitet Bounds aus Wänden ab. Falls spätere Level Objekte außerhalb der Wände enthalten, könnte Kamera falsch klemmen.

Gegenmaßnahme:
- V1 nutzt vorhandene Wall-Bounds.
- Optional später explizites `bounds` Feld in Leveldaten.
- Test: alle Desktop-Level prüfen, ob Wall-Bounds `800x600` ergeben.

### Risiko: Savegames und Bestzeiten vermischen Mobile-Desktop-Scroll mit Mobile-Level

`time-attack.js` trennt aktuell nach Plattform `mobile` vs `desktop`. Mobile mit Desktop-Leveln wäre aber eine dritte Variante.

Entscheidung:
- Neuer Storage-Key-Suffix für Modus:
  - `mobile`
  - `desktop`
  - `mobile-desktop-scroll`
- Savegames ebenfalls mit Levelmodus kennzeichnen.
- Alte Saves bleiben kompatibel.

### Risiko: Menüs/Levelselect zeigen falsche Levelanzahl

Wenn Mobile optional Desktop-Level verwendet, muss Levelselect dieselbe Quelle nutzen wie das Spiel.

Gegenmaßnahme:
- `getLevelTemplates()` bleibt einzige Quelle für Levelselect.
- Moduswahl erfolgt vor Levelselect/Spielstart.
- Tests: Levelselect zeigt Desktop-Levelanzahl im Desktop-scroll-Modus.

## 5. Implementierungsphasen

### Phase 1: Kamera-Grundlage

- Neues `camera.js` mit rein berechnenden Funktionen.
- Tests für:
  - Scale-Berechnung
  - sichtbare Weltbreite
  - Kamera-Clamping links/mittig/rechts
  - `screenToWorld()`
  - `worldToScreen()`
- Noch keine aktive Nutzung im Spiel.

### Phase 2: Modus für Desktop-Level auf Mobile

- Level-Auswahl um Modus erweitern.
- Default bleibt heutiges Mobile-Levelverhalten.
- Desktop-scroll-Modus lädt `levels.js` auch auf Mobile.
- `getMaxScore()` nutzt passenden Levelsatz.
- Time-Attack/Save-Keys um Modus unterscheiden.

### Phase 3: Rendering transformieren

- `renderer.js` aktualisiert Kamera pro Frame vor Levelscene.
- `scene-renderer.js` rendert Gameplay-Szene durch Kamera-Transform.
- Background bleibt screen-space oder bekommt bewusst eigene Behandlung.
- HUD bleibt screen-space.
- Tests: Syntax + manuelles Rendering bei Kamera links/mittig/rechts.

### Phase 4: Input transformieren

- Gameplay-Touchpositionen in `pointer-controls.js` per `screenToWorld()` transformieren.
- `touchState` bleibt Weltkoordinaten.
- Touch-Indikator korrekt zeichnen:
  - entweder Weltlinie innerhalb Kamera-Transform
  - oder Screenlinie via `worldToScreen(ship)` und Original-Touchscreenposition
- Empfehlung v1: Touch-Indikator als screen-space Linie zeichnen, weil Fingerposition screen-space ist.

### Phase 5: Asteroiden und Bounds härten

- Asteroid-Offscreen-Logik von harten Zahlen auf Level-Bounds umstellen.
- Reset/Spawn unverändert in Weltkoordinaten.
- Tests für Offscreen-Entscheidung mit Desktop-Bounds.

### Phase 6: Manuelle Validierung und Feinschliff

- Desktop-Level 1-3 auf Mobile-Viewport testen.
- Kamera-Clamping an linker und rechter Levelkante prüfen.
- Touch-Steuerung bei scrollender Kamera prüfen.
- HUD-Positionen prüfen.
- Zeitrennen starten/abschließen prüfen.
- Save/Continue prüfen.

## 6. Test-Checkliste

### Automatisierte Tests

- Kamera:
  - `scale = viewportHeight / levelHeight`
  - `visibleWorldWidth = viewportWidth / scale`
  - Kamera clamp links
  - Kamera clamp rechts
  - Kamera zentriert Schiff in der Mitte
  - `screenToWorld(worldToScreen(point))` ergibt ursprünglichen Punkt
- Level-Modus:
  - Mobile default lädt mobile Level.
  - Mobile desktop-scroll lädt Desktop-Level.
  - Desktop lädt weiterhin Desktop-Level.
- HUD:
  - Gameplay-HUD nutzt sichtbaren Viewport, nicht gesamte Levelbreite.
- Asteroiden:
  - Offscreen-Bounds folgen Level-Bounds.

### Manuelle Tests

- Mobile Portrait:
  - Desktop-Level 1 startet.
  - Schiff sichtbar auf Startplattform.
  - Kamera links am Levelanfang geklemmt.
  - Kamera folgt Schiff nach rechts.
  - Kamera stoppt am rechten Levelende.
  - Plattformen rechts im Level sind erreichbar.
  - Touch-Steuerung dreht zum Finger, auch wenn Kamera gescrollt ist.
  - Fuel/Target verdecken keine unteren Plattformen unnötig.
- Desktop:
  - Normales Desktop-Spiel unverändert.
  - Desktop-Level ohne Kamera-Regression.
- Mobile Default:
  - Bestehende Mobile-Level funktionieren unverändert.
  - Mobile-Level werden nicht versehentlich durch Desktop-Level ersetzt.

## 7. Dateien die voraussichtlich geändert werden

- `src/camera.js` neu
- `src/renderer.js`
- `src/scene-renderer.js`
- `src/pointer-controls.js`
- `src/level-manager.js`
- `src/time-attack.js`
- `src/asteroid-manager.js`
- `src/renderer-layout.js`
- Tests unter `test/`

## 8. Erfolgs-Kriterien

- Mobile kann im neuen Modus Desktop-Level vollständig horizontal erscrollen.
- Physik/Kollisionen bleiben konsistent mit Desktop-Leveldaten.
- Touch-Steuerung funktioniert bei jeder Kameraposition korrekt.
- HUD bleibt stabil screen-space.
- Bestehendes Mobile-Level-Verhalten bleibt Default und unverändert.
- `npm test` grün.
- `node --check` über alle `src/*.js` grün.
- Keine Vermischung alter Mobile-Time-Attack-Bestzeiten mit Mobile-Desktop-Scroll-Bestzeiten.

## 9. Annahmen

- Desktop-Levelhöhe ist `600` und wird aus `getLevelBounds()` abgeleitet.
- Desktop-Levelbreite ist typischerweise `800`, aber Implementierung verwendet Bounds statt harte Werte.
- V1 nutzt harte Kamera-Zentrierung ohne Smooth-Damping.
- V1 skaliert Rendering/Input, nicht Leveldaten oder Physik.
- Mobile-Level bleiben Standard; Desktop-Level auf Mobile ist ein separater Modus.
