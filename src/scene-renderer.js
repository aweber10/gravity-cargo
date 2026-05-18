// src/scene-renderer.js
// Rendering for the playable level scene and space background

export function generateSpaceStars(isMobile) {
    const stars = [];
    const starCount = isMobile ? 30 : 50;

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * (isMobile ? 375 : 800),
            y: Math.random() * (isMobile ? 667 : 600),
            brightness: 0.3 + Math.random() * 0.7
        });
    }

    return stars;
}

export function renderBackgroundForCurrentLevel({ ctx, canvas, isSpaceLevel, spaceStars }) {
    if (isSpaceLevel) {
        renderSpaceBackground(ctx, canvas, spaceStars);
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

export function renderLevelScene({ ctx, gameState, isSpaceLevel, walls, platforms, ship, activeAsteroids }) {
    ctx.save();

    renderWalls(ctx, walls, isSpaceLevel);
    renderAsteroidsIfNeeded(ctx, isSpaceLevel, activeAsteroids);
    renderPlatforms(ctx, gameState, platforms);
    renderShipIfVisible(ctx, gameState, ship);
    renderParticles(ctx, gameState.particles);

    ctx.restore();
}

export function renderTouchIndicator({ ctx, ship, touchState }) {
    if (touchState.active) {
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(touchState.x, touchState.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }
}

// Render walls
function renderWalls(ctx, walls, isSpaceLevel) {
    for (const wall of walls) {
        ctx.fillStyle = isSpaceLevel ? '#333' : '#0ff';
        ctx.beginPath();
        ctx.moveTo(wall.points[0][0], wall.points[0][1]);
        for (let i = 1; i < wall.points.length; i++) {
            ctx.lineTo(wall.points[i][0], wall.points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }
}

function renderAsteroidsIfNeeded(ctx, isSpaceLevel, activeAsteroids) {
    if (isSpaceLevel) {
        renderAsteroids(ctx, activeAsteroids);
    }
}

// Render platforms
function renderPlatforms(ctx, gameState, platforms) {
    for (const platform of platforms) {
        const isTarget = gameState.currentCargo === platform.id;
        ctx.strokeStyle = isTarget ? '#fff' : '#0f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(platform.position[0], platform.position[1]);
        ctx.lineTo(platform.position[0] + platform.width, platform.position[1]);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '14px "Courier New"';
        ctx.fillText(platform.id, platform.position[0] + 5, platform.position[1] - 5);

        if (platform.startingCargo) {
            ctx.fillStyle = '#ff0';
            ctx.fillRect(
                platform.position[0] + platform.width / 2 - 8,
                platform.position[1] - 20,
                16,
                16
            );
        }
    }
}

// Render ship (except during explosion)
function renderShipIfVisible(ctx, gameState, ship) {
    if (gameState.state !== 'exploding') {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);

        // Render thrust
        if (ship.thrusting) {
            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(-6, ship.size / 2);
            ctx.lineTo(0, ship.size / 2 + 15);
            ctx.lineTo(6, ship.size / 2);
            ctx.closePath();
            ctx.fill();
        }

        // Render ship body
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -ship.size / 2);
        ctx.lineTo(-ship.size / 2, ship.size / 2);
        ctx.lineTo(ship.size / 2, ship.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

// Render particles
function renderParticles(ctx, particles) {
    for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
}

// Render space background with stars
function renderSpaceBackground(ctx, canvas, spaceStars) {
    // Dark space background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render static stars
    ctx.fillStyle = '#ffffff';
    for (const star of spaceStars) {
        ctx.globalAlpha = star.brightness;
        ctx.fillRect(star.x, star.y, 1, 1);
    }
    ctx.globalAlpha = 1.0;
}

// Render asteroids for space levels
function renderAsteroids(ctx, activeAsteroids) {
    if (activeAsteroids.length === 0) return;

    ctx.strokeStyle = '#888';
    ctx.fillStyle = '#444';
    ctx.lineWidth = 1;

    for (const asteroid of activeAsteroids) {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);

        // Draw irregular asteroid polygon
        ctx.beginPath();
        for (let i = 0; i < asteroid.shape.length; i++) {
            const point = asteroid.shape[i];
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
