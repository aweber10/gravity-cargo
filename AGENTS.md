# AGENTS.md for Gravity Cargo

## Project Overview
Gravity Cargo is a physics-based 2D space game where the player navigates a spacecraft to transport cargo between platforms while managing fuel and gravity. The game is implemented as a web app using vanilla JavaScript with HTML5 Canvas.

## Development Setup

### Local Development Server
Run one of these commands from the project root:
```bash
npx serve .
# or
python -m http.server 8000
```

## Project Structure
- `/src/` - Game code modules
  - `main.js` - Entry point and game loop
  - `game-state.js` - Global game state
  - `level-manager.js` - Level loading and initialization
  - `ship-physics.js` - Spacecraft movement and physics
  - `renderer.js` - Canvas rendering
  - `collision.js` - Collision detection
  - `ui.js` - User interface and controls
- `/implementation-plans/` - Detailed specs for feature implementation and testing

## Development Workflow

### Implementation Process
1. Features are planned and documented in `/implementation-plans/` before coding
2. Each feature has a detailed plan (`.md`) and test checklist (`-TEST.md`)
3. When implementing a feature, follow steps in the implementation plan
4. Verify changes against the test checklist

### Level Design Rules
- Level corridors must be at least 40px wide (2x ship width)
- Platforms need at least 40px clearance above them (2x ship height)
- Platforms should be 70-110px wide for landing
- Keep 10px minimum distance between platforms and obstacles
- See `LEVEL_DESIGN_REGELN.md` for complete rules

## Important Code Paths
- Game initialization: `src/main.js` → `initGame()` in `game-flow.js`
- Game loop: `update()` → `render()` in `main.js`
- Physics update sequence: rotation → thrust → gravity → position → collision
- UI and controls: `setupKeyboardControls()`, `setupTouchControls()` in `ui.js`

## Mobile Support
The game supports both desktop (keyboard) and touch controls, with specific UI adjustments for mobile devices.