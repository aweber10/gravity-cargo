// src/device-detection.js
// Centralized device detection for consistent mobile/desktop behavior

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                        ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0);