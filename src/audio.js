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
