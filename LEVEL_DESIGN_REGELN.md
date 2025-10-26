## Leveldesign-Regeln für Gravity Cargo

Diese Sammlung beschreibt verbindliche Gestaltungsprinzipien für neue Desktop-Level. Ziel ist, spannende Flugkorridore zu schaffen, ohne unfaire Situationen zu erzeugen. Bezugswerte sind auf das aktuelle Spieler-Schiff mit `size = 20` Pixeln ausgelegt.

### 1. Grundsätze
- Halte den übergeordneten Level-Rahmen (Außenhülle) konsistent: Außenwände bilden immer einen geschlossenen Rahmen (20 px Dicke), damit Spieler nicht „hinausfallen“ können.
- Stelle durchgehend einsehbare Wege sicher. Wenn eine Sektion verdeckt oder sehr eng ist, sorge für visuelle Hinweise auf alternative Routen.
- Plane von Anfang an den Fuel-Wert und die benötigte Flugzeit. Ein kompletter Routenflug darf nie mehr als ~80 % des verfügbaren Treibstoffs verbrauchen.

### 2. Plattformen
- Plattformhöhen benötigen **mindestens die doppelte Schiffs­höhe** (≈40 px) freien Luftraum direkt über der Landefläche, damit Spieler sauber manövrieren können.
- Plattformbreite bestimmt den Landekomfort. Standard: 70–110 px; engere Pads nur in späten, schwierigen Leveln.
- Plattformen dürfen sich niemals mit Hindernis-Polygonen überschneiden. Belasse mindestens 10 px Puffer zur nächsten Wand.
- Positioniere Plattformbeschriftungen so, dass kein Hindernis sie verdeckt. Bei Bedarf die Plattform leicht verschieben oder verkürzen (Text liegt mittig über dem Pad).

### 3. Hindernisse & Korridore
- Engste Durchflugpassagen benötigen **mindestens die doppelte Schiffs­breite** (≈40 px). Wert gilt auch für gebogene Abschnitte.
- Bei längeren Tunneln alle 300–400 px eine kleine Ausbuchtung/Ruhezone einplanen, damit Spieler Geschwindigkeit abbauen können.
- Übergänge zwischen Kavernen sollten interessante Winkel (z. B. schräge oder geschwungene Segmente) nutzen. Reine Rechteck-Tunnel vermeiden.
- Hindernisse dürfen Plattformen wiederholt umranden, aber niemals die Start-/Landeflächen selbst berühren.

### 4. Flow & Progression
- Cargo-Kette (startingCargo) bleibt unverändert, wenn nur das Layout angepasst wird. Neue Level erhalten stets eine klar definierte Reihenfolge, die auch im HUD nachvollziehbar ist.
- Baue stets mindestens einen Abschnitt ein, in dem der Spieler bewusst durch einen längeren Korridor manövrieren muss, um Fortschritt zu erzielen (Vermeidung direkter Sichtlinie vom Start zur letzten Plattform).
- Stelle sicher, dass jeder kritische Abschnitt zwei alternative Herangehensweisen erlaubt (z. B. oben herum mit mehr Treibstoffverbrauch oder unten herum mit engerem Timing).

### 5. Testing-Checkliste
- [ ] Jede Plattform besitzt >=40 px freien Raum über sich.
- [ ] Kein Hindernis liegt näher als 10 px an einer Plattform.
- [ ] Alle Korridore, inklusive Kurven, besitzen >=40 px Breite.
- [ ] Mindestens ein langer Korridor ist Pflicht für den Levelabschluss.
- [ ] Fuel-Verbrauch beim Testflug <80 % der Levelvorgabe.
- [ ] Alle Plattformnamen sind im Spiel klar lesbar.

Halte diese Regeln ein, um konsistente, faire und gleichzeitig anspruchsvolle Level für Gravity Cargo zu gestalten. Bei Ausnahmen immer dokumentieren, warum sie nötig sind.
