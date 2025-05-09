// Get DOM elements
const player = document.getElementById("player");
window.gameArea = document.getElementById("gameArea");
const ground = document.getElementById("ground");

// Player properties
const playerState = {
    x: 100,
    y: 100,
    width: 50,
    height: 32,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 15,
    isJumping: false,
    gravity: 0.8,
    friction: 0.8,
    lastDirection: "right", // Track the last direction ("left" or "right")
};

// Define platforms
const platforms = [
    { x: 4, y: 495, width: 333, height: 12, image: "platform1.png" },
    { x: 4, y: 379, width: 206, height: 16, image: "platform2.png" },
    { x: 292, y: 374, width: 95, height: 17, image: "platform3.png" },
    { x: 4, y: 278, width: 121, height: 16, image: "platform4.png" },
    { x: 4, y: 158, width: 337, height: 16, image: "platform5.png" },
    { x: 241, y: 274, width: 104, height: 16, image: "platform6.png" },
    { x: 396, y: 220, width: 60, height: 16, image: "platform7.png" },
    { x: 481, y: 189, width: 58, height: 16, image: "platform8.png" },
    { x: 566, y: 155, width: 58, height: 16, image: "platform9.png" },
    { x: 648, y: 117, width: 58, height: 16, image: "platform10.png" },
    { x: 747, y: 165, width: 130, height: 12, image: "platform11.png" },
    { x: 1072, y: 209, width: 100, height: 12, image: "platform12.png" },
    { x: 1261, y: 281, width: 67, height: 16, image: "platform13.png" },
    { x: 1380, y: 131, width: 69, height: 12, image: "platform14.png" },
    { x: 1431, y: 306, width: 146, height: 13, image: "platform15.png" },
    { x: 1404, y: 422, width: 203, height: 12, image: "platform16.png" },
    { x: 1602, y: 124, width: 140, height: 16, image: "platform17.png" },
    { x: 1701, y: 203, width: 143, height: 16, image: "platform18.png" },
    { x: 1804, y: 278, width: 141, height: 16, image: "platform19.png" },
    { x: 1679, y: 350, width: 71, height: 17, image: "platform20.png" },
    { x: 1967, y: 350, width: 71, height: 17, image: "platform21.png" },
    { x: 1888, y: 431, width: 128, height: 12, image: "platform22.png" },
    { x: 1849, y: 485, width: 85, height: 12, image: "platform23.png" },
    { x: 688, y: 487, width: 287, height: 41, image: "cushon.png" },
    { x: 998, y: 508, width: 105, height: 13, image: "table.png" },
    { x: 327, y: 507, width: 54, height: 26, image: "top-stair.png" },
    { x: 327, y: 531, width: 100, height: 25, image: "mid-stair.png" },
    { x: 327, y: 555, width: 145, height: 25, image: "btm-stair.png" },
];

// Create platform elements
platforms.forEach((platform) => {
    const platformElement = document.createElement("div");
    platformElement.className = "platform";

    // Set positions and sizes in pixels
    platformElement.style.left = platform.x + "px";
    platformElement.style.top = platform.y + "px";
    platformElement.style.width = platform.width + "px";
    platformElement.style.height = platform.height + "px";

    // Set the background image for each platform with the correct path
    platformElement.style.backgroundImage = `url("platformer/images/platforms/${platform.image}")`;

    gameArea.appendChild(platformElement);
});

// Keys state
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Space: false,
    KeyA: false, // A key
    KeyD: false, // D key
    KeyW: false, // W key
};

// Add near the top of the file after other variable declarations:
window.gameLoopPaused = false;

// Event listeners for key presses
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        keys.ArrowLeft = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        keys.ArrowRight = true;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W")
        keys.ArrowUp = true;
    if (e.key === " ") keys.Space = true;

    // Prevent scrolling with arrow keys, WASD and space
    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "w",
            "W",
            "a",
            "A",
            "d",
            "D",
            " ",
        ].includes(e.key)
    ) {
        e.preventDefault();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        keys.ArrowLeft = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        keys.ArrowRight = false;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W")
        keys.ArrowUp = false;
    if (e.key === " ") keys.Space = false;
});

// Check collisions with platforms
function checkPlatformCollisions() {
    let onPlatform = false;

    // Check ground collision
    if (
        playerState.velocityY > 0 &&
        playerState.y + playerState.height <=
            gameArea.clientHeight - ground.clientHeight &&
        playerState.y + playerState.height + playerState.velocityY >=
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
        const platformX = platform.x;
        const platformY = platform.y;
        const platformWidth = platform.width;
        const platformHeight = platform.height;

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

// Update player animation
function updatePlayerAnimation() {
    if (playerState.velocityY < 0 || playerState.isJumping) {
        // Jump animation
        player.className = "jump";

        // Flip the sprite if moving left while jumping
        if (keys.ArrowLeft) {
            player.classList.add("flip");
            playerState.lastDirection = "left";
        } else if (keys.ArrowRight) {
            player.classList.remove("flip");
            playerState.lastDirection = "right";
        }
    } else if (keys.ArrowLeft || keys.ArrowRight) {
        // Run animation
        player.className = "run";

        // Flip the sprite if moving left
        if (keys.ArrowLeft) {
            player.classList.add("flip");
            playerState.lastDirection = "left";
        } else if (keys.ArrowRight) {
            player.classList.remove("flip");
            playerState.lastDirection = "right";
        }
    } else {
        // Idle animation
        player.className = "idle";

        // Apply the flip class based on the last direction
        if (playerState.lastDirection === "left") {
            player.classList.add("flip");
        } else {
            player.classList.remove("flip");
        }
    }
}

// Update camera position
function updateCamera() {
    const cameraContainer = document.getElementById("cameraContainer");

    // Get the dimensions of the camera and game area
    const cameraWidth = cameraContainer.clientWidth;
    const cameraHeight = cameraContainer.clientHeight;
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    // Calculate the camera's target position to center the player
    let offsetX = playerState.x + playerState.width / 2 - cameraWidth / 2;
    let offsetY = playerState.y + playerState.height / 2 - cameraHeight / 2;

    // Position player slightly above center for better visibility ahead
    offsetY -= 100;

    // Clamp the camera position to prevent showing outside the game area
    offsetX = Math.max(0, Math.min(offsetX, gameAreaWidth - cameraWidth));
    offsetY = Math.max(0, Math.min(offsetY, gameAreaHeight - cameraHeight));

    // Apply the transform to the game area - force integer values to avoid blurry rendering
    gameArea.style.transform = `translate(${-Math.floor(
        offsetX
    )}px, ${-Math.floor(offsetY)}px)`;
}

// Game loop
function update() {
    // Skip updates if game is paused
    if (window.gameLoopPaused) {
        requestAnimationFrame(update);
        return;
    }

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
    player.style.left = Math.round(playerState.x) + "px";
    player.style.top = Math.round(playerState.y) + "px";

    // Update the camera position (must be after player position update)
    updateCamera();

    // Update animation
    updatePlayerAnimation();

    // Continue the game loop
    requestAnimationFrame(update);
}

// Start the game
update();
