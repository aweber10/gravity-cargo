// config.js - Spiel-Konstanten und Konfiguration

export const PHYSICS = {
    gravity: 0.05,
    thrust: 0.15,
    rotationSpeed: Math.PI * 2 / 3,
    friction: 0.98,
    maxLandingSpeed: 2,
    maxLandingAngle: Math.PI / 12,
    fuelConsumption: 0.1,
    // Landing settling physics (Aufrichtungs-Physik)
    settlingRotationDamping: 0.15, // Wie schnell sich das Schiff aufrichtet (0-1)
    settlingMinAngle: 0.01 // Minimaler Winkel, unter dem settling stoppt
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
