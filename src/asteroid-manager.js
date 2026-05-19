// asteroid-manager.js - Asteroid movement and management system

// Generate irregular asteroid shape
export function isAsteroidOffscreenPosition(x, y, levelBounds, buffer = 100) {
    const bounds = levelBounds || { left: 0, top: 0, right: 800, bottom: 700 };
    return x < bounds.left - buffer ||
        x > bounds.right + buffer ||
        y < bounds.top - buffer ||
        y > bounds.bottom + buffer;
}

function generateIrregularPolygon(baseSize) {
    const points = [];
    const numPoints = 8 + Math.floor(Math.random() * 4); // 8-11 points
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // Vary radius between 70% and 100% of base size
        const radiusVariation = 0.7 + Math.random() * 0.3;
        const radius = baseSize * radiusVariation;
        
        points.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        });
    }
    
    return points;
}

class Asteroid {
    constructor(config, levelBounds) {
        this.spawn = config.spawn;
        this.x = config.spawn[0];
        this.y = config.spawn[1];
        this.vx = config.velocity[0];
        this.vy = config.velocity[1];
        this.size = config.size;
        this.delay = config.delay;
        this.shape = generateIrregularPolygon(config.size);
        this.active = false;
        this.spawnTime = performance.now() + config.delay;
        this.levelBounds = levelBounds;
    }
    
    update(dt) {
        // Check if it's time to spawn this asteroid
        if (!this.active && performance.now() >= this.spawnTime) {
            this.active = true;
        }
        
        if (this.active) {
            // Update position based on velocity
            this.x += this.vx * dt / 1000;
            this.y += this.vy * dt / 1000;
            
            // Despawn when asteroid moves off screen with buffer
            if (this.isOffscreen()) {
                this.active = false;
            }
        }
    }
    
    isOffscreen() {
        return isAsteroidOffscreenPosition(this.x, this.y, this.levelBounds);
    }
}

// Asteroid Manager - handles all asteroid lifecycle including cyclic patterns
export const asteroidManager = {
    asteroids: [],
    asteroidPattern: [],
    patternIndex: 0,
    cycleStartTime: 0,
    maxActiveAsteroids: 2,
    usesCyclicPattern: false,
    levelBounds: null,
    
    // Initialize asteroids for a level
    initLevel(levelData, levelBounds = null) {
        this.asteroids = [];
        this.patternIndex = 0;
        this.cycleStartTime = performance.now();
        this.levelBounds = levelBounds;
        
        // Check if level uses new cyclic asteroid patterns
        if (levelData.asteroidPattern) {
            this.usesCyclicPattern = true;
            this.asteroidPattern = levelData.asteroidPattern;
            this.maxActiveAsteroids = levelData.maxActiveAsteroids || 2;
        } else if (levelData.asteroids) {
            // Fallback to old single-spawn system
            this.usesCyclicPattern = false;
            this.asteroids = levelData.asteroids.map(config => new Asteroid(config, this.levelBounds));
        }
    },
    
    // Update all asteroids
    update(dt) {
        if (this.usesCyclicPattern) {
            this._updateCyclicPattern();
        }
        
        // Update all active asteroids
        this.asteroids.forEach(asteroid => {
            asteroid.update(dt);
        });
        
        // Clean up despawned asteroids in cyclic mode
        if (this.usesCyclicPattern) {
            this.asteroids = this.asteroids.filter(asteroid => 
                asteroid.active || !asteroid.isOffscreen()
            );
        }
    },
    
    // Handle cyclic pattern spawning
    _updateCyclicPattern() {
        const currentTime = performance.now();
        const activeCount = this.getActiveAsteroids().length;
        
        // Check if it's time to spawn the next asteroid in pattern
        const patternConfig = this.asteroidPattern[this.patternIndex];
        if (!patternConfig) return;
        
        const spawnTime = this.cycleStartTime + patternConfig.delay;
        
        if (currentTime >= spawnTime) {
            // Skip spawning dummy cycle-end entries or if at max capacity
            if (patternConfig.size > 0 && activeCount < this.maxActiveAsteroids) {
                // Spawn asteroid
                const newAsteroid = new Asteroid({
                    spawn: patternConfig.spawn,
                    velocity: patternConfig.velocity,
                    size: patternConfig.size,
                    delay: 0 // Spawn immediately since timing is handled here
                }, this.levelBounds);
                newAsteroid.active = true;
                this.asteroids.push(newAsteroid);
            }
            
            // Move to next pattern
            this.patternIndex++;
            
            // Check if we've completed the cycle
            if (this.patternIndex >= this.asteroidPattern.length) {
                this.patternIndex = 0;
                this.cycleStartTime = currentTime + (patternConfig.cycleDelay || 3000);
            }
        }
    },
    
    // Get asteroids that are currently active and visible
    getActiveAsteroids() {
        return this.asteroids.filter(asteroid => asteroid.active);
    },
    
    // Reset all asteroids (for level restart)
    reset() {
        this.asteroids.forEach(asteroid => {
            asteroid.active = false;
            asteroid.x = asteroid.spawn[0];
            asteroid.y = asteroid.spawn[1];
            if (!this.usesCyclicPattern) {
                asteroid.spawnTime = performance.now() + asteroid.delay;
            }
        });
        
        if (this.usesCyclicPattern) {
            this.asteroids = [];
            this.patternIndex = 0;
            this.cycleStartTime = performance.now();
        }
    },
    
    // Check if level has asteroids
    hasAsteroids() {
        return this.asteroids.length > 0 || this.usesCyclicPattern;
    },
    
    // Debug info for asteroid patterns
    getDebugInfo() {
        if (!this.usesCyclicPattern) return null;
        
        return {
            patternIndex: this.patternIndex,
            cycleStartTime: this.cycleStartTime,
            currentTime: performance.now(),
            activeCount: this.getActiveAsteroids().length,
            maxActive: this.maxActiveAsteroids,
            nextSpawn: this.asteroidPattern[this.patternIndex] ? 
                this.cycleStartTime + this.asteroidPattern[this.patternIndex].delay : null
        };
    }
};
