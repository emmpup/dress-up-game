// Get DOM elements
const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const ground = document.getElementById("ground");

// Player properties
const playerState = {
    x: 100,
    y: 100,
    width: 40,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 15,
    isJumping: false,
    gravity: 0.8,
    friction: 0.8,
};

// Define platforms
const platforms = [
    { x: 10, y: 75, width: 20, height: 5 },
    { x: 40, y: 65, width: 15, height: 5 },
    { x: 60, y: 80, width: 15, height: 5 },
    { x: 30, y: 55, width: 10, height: 5 },
    { x: 50, y: 50, width: 20, height: 5 },
    { x: 80, y: 40, width: 10, height: 5 },
    { x: 90, y: 30, width: 10, height: 5 },
    { x: 30, y: 20, width: 5, height: 5 },
    { x: 50, y: 20, width: 10, height: 5 },
    { x: 10, y: 15, width: 10, height: 5 },
    { x: 70, y: 10, width: 15, height: 5 },
    { x: 15, y: 40, width: 10, height: 5 },
];

// Create platform elements
platforms.forEach((platform, index) => {
    const platformElement = document.createElement("div");
    platformElement.className = "platform";

    // Calculate positions and sizes relative to gameArea
    platformElement.style.left =
        (platform.x / 100) * gameArea.clientWidth + "px";
    platformElement.style.top =
        (platform.y / 100) * gameArea.clientHeight + "px";
    platformElement.style.width =
        (platform.width / 100) * gameArea.clientWidth + "px";
    platformElement.style.height =
        (platform.height / 100) * gameArea.clientHeight + "px";

    gameArea.appendChild(platformElement);
});

// Keys state
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Space: false,
};

// Event listeners for key presses
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.ArrowLeft = true;
    if (e.key === "ArrowRight") keys.ArrowRight = true;
    if (e.key === "ArrowUp") keys.ArrowUp = true;
    if (e.key === " ") keys.Space = true;

    // Prevent scrolling with arrow keys and space
    if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    ) {
        e.preventDefault();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.ArrowLeft = false;
    if (e.key === "ArrowRight") keys.ArrowRight = false;
    if (e.key === "ArrowUp") keys.ArrowUp = false;
    if (e.key === " ") keys.Space = false;
});

// Check collisions with platforms
function checkPlatformCollisions() {
    let onPlatform = false;

    // Check ground collision
    if (
        playerState.y + playerState.height >
        gameArea.clientHeight - ground.clientHeight
    ) {
        playerState.y =
            gameArea.clientHeight - ground.clientHeight - playerState.height;
        playerState.velocityY = 0;
        playerState.isJumping = false;
        onPlatform = true;
    }

    // Check platform collisions
    platforms.forEach((platform) => {
        const platformX = (platform.x / 100) * gameArea.clientWidth;
        const platformY = (platform.y / 100) * gameArea.clientHeight;
        const platformWidth = (platform.width / 100) * gameArea.clientWidth;
        const platformHeight = (platform.height / 100) * gameArea.clientHeight;

        // If player is above the platform and falling
        if (
            playerState.velocityY > 0 &&
            playerState.y + playerState.height <= platformY + platformHeight &&
            playerState.y + playerState.height + playerState.velocityY >=
                platformY &&
            playerState.x + playerState.width > platformX &&
            playerState.x < platformX + platformWidth
        ) {
            playerState.y = platformY - playerState.height;
            playerState.velocityY = 0;
            playerState.isJumping = false;
            onPlatform = true;
        }

        // Side collisions (optional, simplified)
        if (
            playerState.y + playerState.height > platformY &&
            playerState.y < platformY + platformHeight
        ) {
            // Left collision
            if (
                playerState.x + playerState.width >= platformX &&
                playerState.x + playerState.width <= platformX + 10
            ) {
                playerState.x = platformX - playerState.width;
            }

            // Right collision
            if (
                playerState.x <= platformX + platformWidth &&
                playerState.x >= platformX + platformWidth - 10
            ) {
                playerState.x = platformX + platformWidth;
            }
        }
    });

    return onPlatform;
}

// Game loop
function update() {
    // Horizontal movement
    if (keys.ArrowLeft) {
        playerState.velocityX = -playerState.speed;
    } else if (keys.ArrowRight) {
        playerState.velocityX = playerState.speed;
    } else {
        playerState.velocityX *= playerState.friction;
    }

    // Apply friction
    if (Math.abs(playerState.velocityX) < 0.2) {
        playerState.velocityX = 0;
    }

    // Apply gravity
    playerState.velocityY += playerState.gravity;

    // Jump if on ground or platform
    const onPlatform = checkPlatformCollisions();
    if ((keys.ArrowUp || keys.Space) && !playerState.isJumping && onPlatform) {
        playerState.velocityY = -playerState.jumpPower;
        playerState.isJumping = true;
    }

    // Update position
    playerState.x += playerState.velocityX;
    playerState.y += playerState.velocityY;

    // Boundary checking
    if (playerState.x < 0) {
        playerState.x = 0;
    }
    if (playerState.x + playerState.width > gameArea.clientWidth) {
        playerState.x = gameArea.clientWidth - playerState.width;
    }

    // Update player position
    player.style.left = playerState.x + "px";
    player.style.top = playerState.y + "px";

    // Continue the game loop
    requestAnimationFrame(update);
}

// Start the game
update();
