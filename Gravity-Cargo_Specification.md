# Gravity Cargo - Game Specification

## 1. Projektübersicht

### 1.1 Spielkonzept
Gravity Cargo ist ein physikbasiertes 2D-Raumschiff-Spiel im Retro-Stil, inspiriert von klassischen Titeln wie Gravity Force, Space Taxi und XPilot. Der Spieler steuert ein kleines Raumschiff und muss Fracht zwischen nummerierten Plattformen in komplexen Höhlensystemen transportieren, wobei Gravitation, Trägheit und begrenzter Treibstoff eine zentrale Rolle spielen.

### 1.2 Zielplattform
- Progressive Web App (PWA) für Browser und iOS
- Primäre Zielgeräte: iPhone 13, 14, 16
- Führendes Design: iPhone 13

---

## 2. Kern-Gameplay

### 2.1 Spielziel
Transport aller Frachten im Level zu ihren jeweiligen Zielplattformen unter Beachtung des Treibstoffverbrauchs und der Physik.

### 2.2 Spielablauf
1. Level startet mit Raumschiff auf einer Startplattform
2. Spieler fliegt zu Plattformen mit Fracht
3. Automatische Frachtaufnahme bei erfolgreicher Landung
4. Transport der Fracht zur Zielplattform
5. Automatische Ablieferung bei erfolgreicher Landung
6. Wiederholung bis alle Frachten transportiert sind
7. Level-Abschluss führt zum nächsten Level

### 2.3 Frachtsystem
- **Aufnahme:** Automatisch beim Landen auf Plattform mit Fracht
- **Transport:** Nur eine Fracht gleichzeitig möglich
- **Ablieferung:** Automatisch beim Landen auf korrekter Zielplattform
- **Freie Reihenfolge:** Spieler wählt, welche Fracht zuerst transportiert wird
- **Jede Fracht hat feste Zielplattform:** Zuordnung ist vordefiniert
- **Falsche Plattform:** Keine Reaktion bei Landung auf falscher Plattform
- **Leere Plattformen:** Zielplattformen haben zu Beginn keine Fracht
- **Plattform-Freigabe:** Plattform wird erst Zielplattform, wenn eigene Fracht abtransportiert wurde

---

## 3. Raumschiff-Steuerung & Physik

### 3.1 Raumschiff-Design
- **Form:** Dreieck/Pfeilspitze
- **Farbe:** Metallisch hellgrau
- **Orientierung:** Spitze zeigt Flugrichtung

### 3.2 Steuerung Desktop
- **Pfeiltasten ODER WASD:**
  - Links/A: Drehung gegen Uhrzeigersinn
  - Rechts/D: Drehung im Uhrzeigersinn
  - Hoch/W: Schub in Blickrichtung
  - Runter/S: (nicht verwendet)
- **Pause:** ESC oder P-Taste

### 3.3 Steuerung Mobile (iPhone)
- **Tap auf Screen:** Raumschiff richtet Nase zur Tap-Position aus
- **Schub-Button:** Kontinuierlicher Schub bei gedrücktem Button
- **Pause-Button:** Auf dem Screen platziert

### 3.4 Physik-Parameter

#### Drehung
- **360° Rotation in 3 Sekunden** (120°/Sekunde)
- **Sofortige Reaktion:** Keine Rotationsträgheit
- **Präzise Steuerung:** Ermöglicht genaue Ausrichtung für Landungen

#### Schub & Beschleunigung
- **Nur Vorwärtsschub:** In Blickrichtung der Spitze
- **Kontinuierlich:** Beschleunigung solange Taste gedrückt
- **Träge aber nicht langweilig:** Spieler muss vorausschauend planen
- **Bremswege beachten:** Zu wilde Beschleunigung erschwert rechtzeitiges Abbremsen

#### Gravitation
- **Schwache aber konstante Gravitation:** Immer nach unten gerichtet
- **Permanente Herausforderung:** Muss ständig berücksichtigt werden
- **Typisches Flugverhalten:** Meist Schub nach unten zum Gegenhalten

#### Trägheit
- **Volle lineare Trägheit:** Raumschiff behält Geschwindigkeit bei
- **Leichte Reibung:** Geschwindigkeit wird graduell reduziert (z.B. 0.98x pro Frame)
- **Gameplay-Erleichterung:** Erleichtert Kontrolle und Landungen ohne aktiven Gegenschub
- **Vektoren addieren sich:** Schub und Gravitation wirken zusammen

### 3.5 Landung
- **Ausrichtung:** Basis des Raumschiffs muss parallel zur Plattform sein
- **Spitze unten:** Landung nicht möglich
- **Geschwindigkeit:** Langsame Annäherung erforderlich (spezifischer Grenzwert)
- **Zu schnell:** Explosion auch bei korrekter Ausrichtung
- **Zu schräg:** Explosion auch bei niedriger Geschwindigkeit

---

## 4. Treibstoff-System

### 4.1 Mechanik
- **Verbrauch:** Nur bei aktivem Schub
- **Keine Regeneration:** Treibstoff kann nicht nachgetankt werden
- **Level-Start:** Jedes Level beginnt mit voller Tankfüllung
- **Nicht übertragbar:** Überschuss geht beim Level-Wechsel verloren

### 4.2 Tankgröße-Progression
- **Moderat steigend:** Mit höheren Levels größere Tanks
- **Nicht linear:** Steigerung geringer als Fracht-Anzahl
- **Strategischer Druck:** Spieler muss effizient fliegen

### 4.3 Treibstoff leer
- **Kein Schub mehr:** Steuerung deaktiviert
- **Drift:** Raumschiff treibt mit aktueller Geschwindigkeit
- **Gravitation wirkt:** Unkontrollierter Fall möglich
- **Wand-Kollision:** Führt zur Explosion
- **Glücks-Landung:** Aufrechte, langsame Landung auf Plattform
  - Spiel endet
  - Erreichte Punkte werden prominent angezeigt
  - Kein Level-Erfolg

---

## 5. Level-Design

### 5.1 Geometrie
- **Aufbau:** Linien und Polygone
- **Wände:** Gefüllte Polygone in kontrastierender Farbe
- **Plattformen:** Horizontale Linien (Landeflächen)
- **Kein Terrain-Übergang:** Keine Graustufen zwischen begehbar/tödlich

### 5.2 Scrolling
- **Ein-dimensionaler Scroll:** Pro Level entweder horizontal ODER vertikal
- **Raumschiff zentriert:** Bei scrollenden Levels immer in Bildmitte
- **Unsichtbare Grenzen:** Raumschiff kann nicht aus sichtbarem Bereich fliegen
- **Nicht-scrollende Levels:** Level passt komplett auf einen Bildschirm

### 5.3 Plattformen
- **Visuell einheitlich:** Alle Plattformen gleich gestaltet
- **Sci-Fi Namen:** Kurze Fantasy-Bezeichnungen (z.B. "ALPHA", "NEXUS")
- **Alternativ:** Nummerierung bei zu vielen Plattformen
- **Kennzeichnung sichtbar:** Namen/Nummern direkt an Plattform
- **Ziel-Highlighting:** Aktuelle Zielplattform ist heller dargestellt

### 5.4 Hindernisse (Version 1)
- **Nur statische Wände:** Keine beweglichen Objekte
- **Jede Berührung tödlich:** Keine Toleranz für Wandkontakt
- **Enge Passagen:** In höheren Levels präzises Fliegen erforderlich

### 5.5 Fracht-Darstellung
- **Visuell als Box:** Sichtbar wenn auf Plattform stehend
- **Verschwindet beim Aufnehmen:** Nicht am Raumschiff sichtbar während Transport
- **Wiedererscheint bei Ablieferung:** (optional, falls Zielplattform visualisiert werden soll)

---

## 6. Schwierigkeits-Progression

### 6.1 Level-Anzahl
- **10 Level:** Für erste Version

### 6.2 Level 1
- **Sehr einfach:** Keine Vorkenntnisse erforderlich
- **Tutorial-Funktion:** Spieler lernt durch Spielen
- **Großzügige Passagen:** Viel Platz für Fehler
- **Wenige Frachten:** 2-3 Transportaufgaben

### 6.3 Schwierigkeits-Steigerung
- **Fracht-Anzahl:** Moderat steigend (nicht linear)
- **Treibstoff:** Wächst langsamer als Aufgaben
- **Engere Höhlen:** Zunehmend enge Passagen
- **Komplexere Layouts:** Verschachtelte Wegführungen
- **Gravitations-Stärke:** Bleibt konstant über alle Level

### 6.4 Verschnaufpausen
- **Bei neuen Elementen:** Wenn erstmals enge Passage eingeführt wird
- **Moderatere Zwischenlevel:** Nach schweren Levels kurze Erholung
- **Lernkurve:** Neue Herausforderungen werden graduell eingeführt

---

## 7. Leben & Game Over

### 7.1 Leben-System
- **3 Leben pro Level:** Bei Level-Start zurückgesetzt
- **Verlust bei:** Wand-Kollision oder zu harte Landung
- **Leben übertragbar:** Nicht auf nächstes Level

### 7.2 Explosion
- **Animation:** Partikel-basierte Explosion (ca. 1 Sekunde)
- **Sound-Effekt:** Explosions-Sound
- **Freeze:** Kurze Pause während Animation

### 7.3 Respawn
- **Position:** An letzter Plattform wo gelandet wurde
- **Fortschritt bleibt:** Bereits transportierte Frachten bleiben geliefert
- **Aktuelle Fracht:** Verloren, zurück auf ursprünglicher Plattform
- **Treibstoff:** Zurückgesetzt auf Level-Start-Menge

### 7.4 Game Over
- **Bedingung:** Alle 3 Leben in einem Level verloren
- **Game Over Screen:** Anzeige der Gesamt-Punktzahl
- **Neustart-Option:** Nur komplett von Level 1
- **Kein Level-Select:** Nach Game Over kein Fortsetzen möglich

---

## 8. Punktesystem

### 8.1 Punkte-Vergabe
- **Pro Fracht:** 1 Punkt
- **Nur bei Ablieferung:** Keine Punkte für Aufnahme oder Teilstrecken
- **Keine Boni:** Keine zusätzlichen Punkte für Zeit oder Treibstoff

### 8.2 Punkte-Tracking
- **Level-übergreifend:** Summe über alle gespielten Level
- **Anzeige:** Permanent im UI sichtbar
- **Bei Game Over:** Prominent auf Game Over Screen
- **Kein Highscore-System:** (in Version 1)

---

## 9. User Interface

### 9.1 HUD (Head-Up Display)

#### Desktop & Mobile
- **Treibstoff-Balken:**
  - Position: Unterer Bildschirmrand
  - Visuell: Horizontaler Balken
  - Farbe: Grün → Gelb → Rot (bei <20%)
  
- **Zielplattform-Anzeige:**
  - Position: Unterer Bildschirmrand, neben Treibstoff
  - Inhalt: Name/Nummer der aktuellen Zielplattform
  - Update: Bei Fracht-Aufnahme

- **Punkte-Anzeige:**
  - Position: Oberer Bildschirmrand
  - Format: "SCORE: 00"

- **Leben-Anzeige:**
  - Position: Oberer Bildschirmrand
  - Format: 3 Symbole (Raumschiff-Icons oder Herzen)

#### Zusätzlich Mobile
- **Schub-Button:**
  - Position: Rechts unten (Daumen-erreichbar)
  - Visuell: Deutlich sichtbares Button-Design
  - Feedback: Visuell gedrückt während Schub

- **Pause-Button:**
  - Position: Rechts oben
  - Symbol: Pause-Icon

### 9.2 Screens

#### Startbildschirm
- **Titel:** "GRAVITY CARGO" (großflächig, Retro-Font)
- **Optionen:**
  - "NEUES SPIEL" → Startet Level 1
  - "FORTSETZEN" → Lädt gespeicherten Stand (wenn vorhanden)
  - (Optional: "OPTIONEN" für Sound Ein/Aus)
- **Bedienung:**
  - Desktop: Tastatur-Navigation oder Mausklick
  - Mobile: Tap auf Buttons

#### Level-Abschluss Screen
- **Anzeige:**
  - "LEVEL X ABGESCHLOSSEN"
  - Statistik:
    - Frachten transportiert: X
    - Punkte gesamt: XX
    - Übrig gebliebener Treibstoff: XX%
- **Weiter:** Beliebiger Tastendruck/Tap startet nächstes Level

#### Game Over Screen
- **Anzeige:**
  - "GAME OVER"
  - Erreichtes Level: X
  - Gesamt-Punkte: XX (prominent)
- **Option:** "NEUSTART" → Zurück zu Level 1

#### Pause-Screen
- **Overlay:** Spiel im Hintergrund eingefroren
- **Anzeige:** "PAUSED"
- **Optionen:**
  - "FORTSETZEN"
  - "NEUSTART LEVEL"
  - "HAUPTMENÜ"

#### End-Screen (nach Level 10)
- **Gratulation:**
  - "GLÜCKWUNSCH!"
  - "ALLE LEVEL ABGESCHLOSSEN"
  - Gesamt-Punkte: XX
- **Credits:**
  - Idee: Andreas Weber
  - Spec-Engineering: Claude Sonnet 4.5
  - Implementierung: Claude Code
- **Option:** "NEUSTART" → Zurück zum Hauptmenü

---

## 10. Visuelles Design

### 10.1 Farbschema
- **Stil:** Klassisch-Retro
- **Hintergrund:** Schwarz oder sehr dunkles Blau
- **Vordergrund:** Helle, kontrastreiche Farben
- **Wände:** Helles Cyan oder Weiß (gefüllte Polygone)
- **Plattformen:** Grün oder Gelb (Linien)
- **Ziel-Plattform:** Heller/Blinkend
- **Raumschiff:** Metallisch hellgrau mit weißen Konturen

### 10.2 Spezial-Effekte

#### Triebwerk
- **Flammen-Effekt:**
  - Position: An Basis des Dreiecks
  - Visuell: Animierte Flamme/Partikel
  - Farbe: Orange-Gelb
  - Nur sichtbar bei aktivem Schub
  - Länge proportional zur Schubstärke (optional)

#### Explosion
- **Partikel-System:**
  - Ausbreitung: Radial vom Kollisionspunkt
  - Anzahl: 15-25 Partikel
  - Farbe: Orange, Gelb, Rot
  - Dauer: ~1 Sekunde
  - Fade-Out: Partikel verblassen

### 10.3 Animationen
- **Fracht-Aufnahme:**
  - Box verschwindet (Fade oder Pop)
  - (Optional: Kurzes Aufleuchten)

- **Fracht-Ablieferung:**
  - (Optional: Kurzes Aufleuchten der Plattform)

- **Landung:**
  - (Optional: Kleiner "Staub"-Effekt bei Aufsetzen)

---

## 11. Audio-Design

### 11.1 Sound-Effekte

| Ereignis | Beschreibung | Charakter |
|----------|--------------|-----------|
| **Triebwerk** | Kontinuierlich während Schub | Rauschen, Düsen-Sound |
| **Landung (erfolgreich)** | Bei sanfter Landung | Kurzes "Thud", mechanisch |
| **Fracht-Aufnahme** | Beim Aufnehmen | Positives "Bleep", bestätigend |
| **Fracht-Ablieferung** | Beim Abliefern | Höheres "Bleep", erfolgreicher |
| **Explosion** | Bei Kollision | Lauter Boom, dramatisch |
| **Zu harte Landung** | Bei zu schneller Landung | Kürzerer Boom |
| **Treibstoff leer** | Wenn Tank leer | Stotterndes Triebwerk, dann Stille |
| **UI-Navigation** | Menu-Auswahl | Dezentes Klick-Geräusch |

### 11.2 Musik
- **Keine Hintergrundmusik**
- Fokus auf Sound-Effekte und Spielgeräusche

### 11.3 Audio-Einstellungen
- (Optional) Master-Volume-Regler im Options-Menu
- (Optional) Sound Ein/Aus Toggle

---

## 12. Technische Anforderungen

### 12.1 Plattform
- **Progressive Web App (PWA)**
  - Offline-Fähigkeit
  - Installierbar auf Home-Screen
  - Responsive Design

### 12.2 Browser-Support
- **iOS Safari:** 13+ (iPhone 13 als Referenz)
- **Chrome:** Neueste Version
- **Firefox:** Neueste Version
- **Edge:** Neueste Version

### 12.3 Auflösungen
- **iPhone 13:** 1170 x 2532 (Referenz)
- **iPhone 14:** 1170 x 2532
- **iPhone 16:** (spezifische Auflösung je nach Modell)
- **Desktop:** Mindestens 1280 x 720, skalierbar

### 12.4 Performance
- **Framerate:** 60 FPS angestrebt
- **Touch-Latenz:** <50ms auf Mobile
- **Load-Zeit:** <3 Sekunden auf schneller Verbindung

### 12.5 Speicherung
- **Browser Local Storage:**
  - Aktuelles Level
  - Gesamt-Punkte
  - Einstellungen (Sound, etc.)
- **Keine Cloud-Speicherung in Version 1**

---

## 13. Gameplay-Mechaniken Details

### 13.1 Kollisions-Erkennung
- **Präzise Polygon-Kollision:** Zwischen Raumschiff und Wänden
- **Plattform-Erkennung:**
  - Basis des Dreiecks muss über Plattform sein
  - Winkel-Check: Raumschiff-Ausrichtung vs. Plattform-Horizontale
  - Geschwindigkeits-Check: Vertikale Geschwindigkeit unter Grenzwert
  
### 13.2 Physik-Update-Loop
- **Fixed Timestep:** 60 Updates pro Sekunde
- **Berechnungsreihenfolge:**
  1. User-Input verarbeiten
  2. Rotation anwenden
  3. Schub-Vektor berechnen
  4. Gravitations-Vektor addieren
  5. Geschwindigkeit aktualisieren
  6. Position aktualisieren
  7. Kollisionserkennung
  8. Treibstoff-Verbrauch

### 13.3 Kamera (bei scrollenden Levels)
- **Smooth Follow:** Kamera folgt Raumschiff mit leichter Verzögerung
- **Deadzone:** Kleiner Bereich in der Mitte ohne Kamera-Bewegung
- **Boundaries:** Kamera stoppt an Level-Grenzen

---

## 14. Level-Daten-Struktur

### 14.1 Level-Definition Format
```javascript
{
  "levelNumber": 1,
  "name": "Easy Start",
  "fuel": 100,
  "gravity": 0.05,
  "scrollDirection": null, // "horizontal", "vertical", or null
  "walls": [
    { "points": [[x1,y1], [x2,y2], [x3,y3]], "filled": true }
  ],
  "platforms": [
    {
      "id": "ALPHA",
      "position": [x, y],
      "width": 100,
      "startingCargo": null // or "BETA" (destination)
    }
  ],
  "startPlatform": "ALPHA"
}
```

### 14.2 Fracht-Definition
- Implizit durch `startingCargo` Eigenschaft der Plattformen
- Ziel ist der Wert von `startingCargo`

---

## 15. Implementierungs-Prioritäten

### 15.1 Phase 1 - Core Gameplay (MVP)
1. Raumschiff-Physik (Schub, Rotation, Gravitation, Trägheit)
2. Kollisionserkennung (Wände, Plattformen)
3. Treibstoff-System
4. Ein einfaches Test-Level
5. Basis-UI (Treibstoff, Leben)
6. Desktop-Steuerung

### 15.2 Phase 2 - Gameplay-Loop
1. Fracht-System (Aufnahme, Transport, Ablieferung)
2. Leben-System
3. Level-Progression (3 Test-Levels)
4. Punkte-System
5. Level-Abschluss und Game Over Screens

### 15.3 Phase 3 - Polish & Content
1. Alle 10 Level
2. Sound-Effekte
3. Visuelle Effekte (Explosion, Triebwerk)
4. Mobile Touch-Steuerung
5. Pause-Funktion

### 15.4 Phase 4 - PWA & Final
1. PWA-Funktionalität
2. Speicher-System
3. Startbildschirm und Menüs
4. End-Screen mit Credits
5. Testing und Balancing

---

## 16. Offene Fragen für Implementierung

### 16.1 Präzise Werte (benötigt für Umsetzung)
- Exakte Gravitations-Stärke (z.B. 0.05 Pixel/Frame²)
- Exakte Schub-Stärke (z.B. 0.15 Pixel/Frame²)
- Reibungs-Faktor (z.B. 0.98 pro Frame, entspricht 2% Geschwindigkeitsverlust)
- Maximale Landegeschwindigkeit (z.B. 2 Pixel/Frame)
- Maximaler Lande-Winkel (z.B. 15° Abweichung)
- Treibstoff-Verbrauchsrate (z.B. 0.5 Einheiten/Frame bei Schub)
- Raumschiff-Größe (z.B. 20x20 Pixel Dreieck)

### 16.2 Level-Design
- Konkrete Layouts für alle 10 Level
- Plattform-Namen/Nummern-Schema
- Fracht-Zuordnungen pro Level

### 16.3 Technische Details
- Bevorzugtes Framework (z.B. Phaser, PixiJS, Canvas-API)
- Asset-Generierung oder handgezeichnet
- Audio-Format und -Generierung

---

## 17. Erfolgs-Kriterien

### 17.1 Gameplay
- ✓ Intuitive Steuerung innerhalb 30 Sekunden erlernbar
- ✓ Erstes Level lösbar ohne Vorwissen
- ✓ Level 10 bietet spürbare Herausforderung
- ✓ Physik fühlt sich fair und vorhersehbar an

### 17.2 Technisch
- ✓ Läuft flüssig (55+ FPS) auf iPhone 13
- ✓ Keine spürbaren Lags bei Inputs
- ✓ Installierbar als PWA
- ✓ Speicherstand bleibt erhalten

### 17.3 User Experience
- ✓ Klare visuelle Feedback-Mechanismen
- ✓ Verständliche UI ohne Tutorial
- ✓ Befriedigende Sound-Effekte
- ✓ Frustration durch faire Checkpoints minimiert

---

## Anhang: Inspirations-Referenzen

### Gravity Force (1989)
- Präzise Physik-Steuerung
- Zweispielermodus mit Waffensystem (nicht in unserer Version)
- Enge Höhlensysteme

### Space Taxi (1984)
- Fracht-Transport zwischen Plattformen
- Treibstoff-Management
- Sanfte Lande-Mechanik

### XPilot (1991)
- Trägheitsbasierte Steuerung
- Multiplayer-Fokus (nicht in unserer Version)
- Schnelles, reaktives Gameplay

### Lunar Lander (1979)
- Klassische Lande-Physik
- Treibstoff-Management
- Minimalistisches Design

---

**Version:** 1.0  
**Datum:** 2025-10-05  
**Status:** Finalisiert für Implementierung
