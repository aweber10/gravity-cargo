# Verfeinerter Implementierungsplan: Mobile Touch-Steuerung

Dieser Plan baut direkt auf der ursprünglichen Vorarbeit auf und ergänzt sie um konkrete Referenzen zum bestehenden Code in `game.js`.

## Übersicht des neuen Kontrollflusses

Das folgende Diagramm visualisiert die geplante Logik:

```mermaid
graph TD
    subgraph "1. User-Interaktion (Event Handler)"
        A[Finger berührt Bildschirm] --> B[handleTouchStart];
        B --> C{touchState.active = true};
        C --> D[Position speichern];

        E[Finger bewegt sich] --> F[handleTouchMove];
        F --> G[Position aktualisieren];

        H[Finger wird angehoben] --> I[handleTouchEnd];
        I --> J{touchState.active = false};
    end

    subgraph "2. Game Loop (pro Frame)"
        K[update-Funktion] --> L[updateTouchControls];
        L -- "touchState.active = true?" --> M[Ja];
        M --> N[Winkel zum Finger berechnen & ship.angle setzen];
        N --> O[Schub aktivieren (keys.up = true)];

        L -- "touchState.active = false?" --> P[Nein];
        P --> Q[Schub deaktivieren (keys.up = false)];
    end

    subgraph "3. Rendering (pro Frame)"
        R[render-Funktion] --> S{touchState.active?};
        S -- Ja --> T[renderTouchIndicator];
        T --> U[Linie vom Schiff zum Finger zeichnen];
        S -- Nein --> V[Nichts tun];
    end

    A & E & H --> K;
    K --> R;
```

## Schritt 1: Globale Variablen und Konfiguration (`game.js`)

1.  **`touchState`-Objekt hinzufügen:** Eine neue globale Variable wird hinzugefügt, um den Zustand der Berührung zu speichern.
2.  **`isMobile`-Erkennung verbessern:** Die bestehende Erkennung wird durch eine robustere Variante ersetzt.

## Schritt 2: Event-Handler überarbeiten (`game.js`)

1.  **Alte Listener entfernen:**
    *   `touchstart`-Listener für den `thrustButton` (`game.js:308`).
    *   `touchend`-Listener für den `thrustButton` (`game.js:312`).
    *   `touchstart`-Listener auf dem `canvas` (`game.js:325`).
2.  **Neue Listener hinzufügen:** Registrierung der neuen, zentralen Handler für `touchstart`, `touchmove`, `touchend` und `touchcancel`.
3.  **Neue Handler-Funktionen implementieren:** Hinzufügen der Funktionen `handleTouchStart`, `handleTouchMove` und `handleTouchEnd`. `handleTouchStart` wird dabei die bestehende Logik zur Menü-Bedienung per Touch integrieren.

## Schritt 3: Spiellogik in `update` anpassen (`game.js`)

1.  **`updateTouchControls`-Funktion erstellen:** Diese Funktion enthält die Logik zur Berechnung des Winkels und zur Aktivierung des Schubs, inklusive einer "Deadzone".
2.  **`update`-Funktion erweitern:** Aufruf von `updateTouchControls()` am Anfang der `update`-Funktion (`game.js:535`).
3.  **Konflikte vermeiden:** Anpassung von `updateShipRotation` (`game.js:461`), damit die Desktop-Steuerung (Pfeiltasten) nicht mit der neuen Touch-Steuerung in Konflikt gerät (z.B. durch eine `if (isMobile) return;` Anweisung).

## Schritt 4: Visuelles Feedback im `render` hinzufügen (`game.js`)

1.  **`renderTouchIndicator`-Funktion erstellen:** Diese Funktion zeichnet eine Linie vom Schiff zum Berührungspunkt.
2.  **`render`-Funktion erweitern:** Ein bedingter Aufruf zu `renderTouchIndicator()` wird in der `render`-Funktion (`game.js:891`) hinzugefügt.

## Schritt 5: UI-Anpassungen (`styles.css`)

1.  **Thrust-Button ausblenden:** Die CSS-Regel `display: none !important;` wird für die ID `#mobile-thrust` hinzugefügt, um den nicht mehr benötigten Button zu verbergen.