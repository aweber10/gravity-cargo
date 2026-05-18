// src/menu-renderer.js
// Rendering for menus and pause overlay

export function renderMenu({ ctx, canvas, isMobile, menu }) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#fff';
    const titleFontSize = isMobile ? 'bold 36px' : 'bold 64px';
    ctx.font = `${titleFontSize} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRAVITY CARGO', canvas.width / 2, canvas.height * 0.25);

    // Subtitle
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('A Retro Physics Puzzler', canvas.width / 2, canvas.height * 0.25 + 40);

    // Menu options
    const startY = canvas.height * 0.5;
    const spacing = Math.min(70, canvas.height * 0.15); // Scale spacing with screen height
    const buttonWidth = Math.min(300, canvas.width * 0.8);
    const buttonHeight = 50;

    menu.options.forEach((option, index) => {
        const y = startY + index * spacing;

        const isSelected = index === menu.selectedOption;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;

        if (isSelected && option.enabled) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }

        ctx.strokeStyle = option.enabled ? '#fff' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        ctx.font = '24px "Courier New"';
        ctx.fillStyle = option.enabled ? '#fff' : '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);

        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });

    // Footer
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Idee: Andreas Weber | Spec: Claude Sonnet 4.5 | Code: Claude Code',
        canvas.width / 2, canvas.height - 20);
}

export function renderLevelSelect({ ctx, canvas, isMobile, levelSelectMenu, levelTemplates }) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#fff';
    const titleFontSize = isMobile ? 'bold 32px' : 'bold 48px';
    ctx.font = `${titleFontSize} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LEVEL AUSWÄHLEN', canvas.width / 2, canvas.height * 0.15);

    // Initialize bounds array for touch/click detection
    window.levelSelectBounds = [];

    // Level list
    const startY = canvas.height * 0.3;
    const spacing = Math.min(45, canvas.height * 0.055); // Slightly smaller for more levels
    const buttonWidth = Math.min(350, canvas.width * 0.85);
    const buttonHeight = 35; // Slightly smaller buttons
    const maxVisibleLevels = Math.min(10, Math.floor((canvas.height * 0.55) / spacing)); // Allow more space

    // Calculate scroll offset to keep selected level visible
    const totalLevels = levelTemplates.length;
    if (levelSelectMenu.selectedLevel < levelSelectMenu.scrollOffset + 1) {
        levelSelectMenu.scrollOffset = Math.max(0, levelSelectMenu.selectedLevel - 1);
    } else if (levelSelectMenu.selectedLevel > levelSelectMenu.scrollOffset + maxVisibleLevels) {
        levelSelectMenu.scrollOffset = Math.min(totalLevels - maxVisibleLevels, levelSelectMenu.selectedLevel - maxVisibleLevels);
    }

    // Ensure scroll offset is within bounds
    levelSelectMenu.scrollOffset = Math.max(0, Math.min(totalLevels - maxVisibleLevels, levelSelectMenu.scrollOffset));

    // Render visible levels
    for (let i = 0; i < Math.min(maxVisibleLevels, levelTemplates.length); i++) {
        const levelIndex = i + levelSelectMenu.scrollOffset;
        if (levelIndex >= levelTemplates.length) break;

        const level = levelTemplates[levelIndex];
        const y = startY + i * spacing;
        const isSelected = (levelIndex + 1) === levelSelectMenu.selectedLevel;

        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;

        // Highlight selected level
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }

        // Button border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Level text
        ctx.font = isMobile ? '18px "Courier New"' : '22px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const levelText = `${level.levelNumber} - ${level.name}`;
        ctx.fillText(levelText, canvas.width / 2, y);

        // Store bounds for touch/click detection
        window.levelSelectBounds.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            level: level.levelNumber
        });
    }

    // Back button
    const backY = canvas.height * 0.85;
    const backButtonWidth = Math.min(200, canvas.width * 0.6);
    const backButtonHeight = 50;
    const backButtonX = canvas.width / 2 - backButtonWidth / 2;
    const backButtonY = backY - backButtonHeight / 2;

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.strokeRect(backButtonX, backButtonY, backButtonWidth, backButtonHeight);

    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ZURÜCK', canvas.width / 2, backY);

    // Store back button bounds
    window.levelSelectBounds.push({
        x: backButtonX,
        y: backButtonY,
        width: backButtonWidth,
        height: backButtonHeight,
        level: -1 // Special value for back button
    });

    // Scroll indicators
    if (totalLevels > maxVisibleLevels) {
        ctx.font = '14px "Courier New"';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';

        if (levelSelectMenu.scrollOffset > 0) {
            ctx.fillText('↑ Mehr Level oben', canvas.width / 2, startY - 20);
        }
        if (levelSelectMenu.scrollOffset + maxVisibleLevels < totalLevels) {
            ctx.fillText('↓ Mehr Level unten', canvas.width / 2, backY - 60);
        }

        // Show current position
        const currentRange = `${levelSelectMenu.scrollOffset + 1}-${Math.min(levelSelectMenu.scrollOffset + maxVisibleLevels, totalLevels)} von ${totalLevels}`;
        ctx.fillStyle = '#888';
        ctx.fillText(currentRange, canvas.width / 2, backY - 40);
    }

    // Instructions
    ctx.font = isMobile ? '14px "Courier New"' : '16px "Courier New"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText(isMobile ? 'Tap zum Auswählen' : 'Pfeiltasten zum Scrollen, Enter zum Auswählen',
        canvas.width / 2, canvas.height - 20);
}

export function renderPauseScreen({ ctx, canvas, gameState, pauseMenu, levelTemplates }) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height * 0.2);

    // Level indicator to show current progress
    const pauseTotalLevels = levelTemplates.length;
    ctx.font = '24px "Courier New"';
    ctx.fillStyle = '#0ff';
    ctx.fillText(`LEVEL ${gameState.level} / ${pauseTotalLevels}`, canvas.width / 2, canvas.height * 0.2 + 50);
    ctx.fillStyle = '#fff';

    // Menu options
    const startY = canvas.height * 0.45;
    const spacing = Math.min(70, canvas.height * 0.15);
    const buttonWidth = Math.min(280, canvas.width * 0.7);
    const buttonHeight = 50;

    pauseMenu.options.forEach((option, index) => {
        const y = startY + index * spacing;

        const isSelected = index === pauseMenu.selectedOption;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;

        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        ctx.font = '22px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(option.label, canvas.width / 2, y);

        option.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    });

    // Instructions
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('ESC/P zum Fortsetzen', canvas.width / 2, canvas.height - 30);
}
