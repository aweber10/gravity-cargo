# Mobile Text Display - Kritische Fixes

## Problem
Im Mobile-Modus sind zwei kritische Textprobleme aufgetreten:
1. **"GRAVITY CARGO"** auf dem Startscreen: G und O sind nicht sichtbar
2. **"LEVEL COMPLETE!"**: Das L wird abgeschnitten

## Minimal-invasive Lösung

### 1. Problem-Analyse
- Beide Texte verwenden fixe Pixel-Größen die für Mobile-Screens zu groß sind
- `renderMenu()`: "GRAVITY CARGO" mit `bold 64px "Courier New"`
- Level Complete: "LEVEL COMPLETE!" mit `48px "Courier New"`

### 2. Einfache Lösung
Reduzierung der Schriftgrößen für Mobile ohne komplexe responsive Logik:

```javascript
// Für "GRAVITY CARGO" im renderMenu():
const titleFontSize = isMobile ? "bold 36px" : "bold 64px";
ctx.font = `${titleFontSize} "Courier New"`;

// Für "LEVEL COMPLETE!":
const completeFontSize = isMobile ? "32px" : "48px";
ctx.font = `${completeFontSize} "Courier New"`;
```

### 3. Implementierungs-Schritte
1. **game.js Zeile ~956**: Titel-Font für Mobile anpassen
2. **game.js Zeile ~1021**: Level-Complete-Font für Mobile anpassen
3. **Test**: Beide Texte vollständig sichtbar auf Mobile

### 4. Vorteile
- ✅ Minimal-invasiv - nur 2 Zeilen ändern
- ✅ Nutzt bereits vorhandene `isMobile` Variable
- ✅ Keine komplexe responsive Logik nötig
- ✅ Sofortige Lösung der kritischen Probleme

## Umsetzung
Die Lösung kann direkt im Code-Modus implementiert werden.