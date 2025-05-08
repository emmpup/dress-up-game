// Get DOM elements
const dressUpBox = document.getElementById("dressUpBox");
const gameOverlay = document.getElementById("gameOverlay");
const closeOverlayBtn = document.getElementById("closeOverlay");
const dressUpFrame = document.getElementById("dressUpFrame");

// Open overlay when clicking the dress-up box
dressUpBox.addEventListener("click", () => {
    // Show the overlay first
    gameOverlay.classList.add("active");

    // Pause the game's main loop
    if (window.gameLoopPaused !== undefined) {
        window.gameLoopPaused = true;
    }
});

// Close overlay when clicking the close button
closeOverlayBtn.addEventListener("click", () => {
    gameOverlay.classList.remove("active");

    // Resume the game's main loop
    if (window.gameLoopPaused !== undefined) {
        window.gameLoopPaused = false;
    }
});

// Listen for messages from the iframe (for saving outfits, etc.)
window.addEventListener("message", (event) => {
    if (event.data.type === "outfitSaved") {
        createSavedCharacter(event.data.outfit);
        // Close the overlay after saving
        gameOverlay.classList.remove("active");
        if (window.gameLoopPaused !== undefined) {
            window.gameLoopPaused = false;
        }
    }
});

// Create a new saved character
function createSavedCharacter(outfit) {
    // Create a new saved character element
    const savedCharacter = document.createElement("div");
    savedCharacter.className = "savedCharacter";

    // Position it at the player's current position
    const player = document.getElementById("player");
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = window.gameArea.getBoundingClientRect();

    savedCharacter.style.left = playerRect.left - gameAreaRect.left + "px";
    savedCharacter.style.bottom = "12px"; // Just above the ground

    // Create a container for the outfit display
    const display = document.createElement("div");
    display.style.position = "relative";
    display.style.width = "100%";
    display.style.height = "100%";
    display.style.overflow = "hidden";

    // Function to add a layer to the display
    function addLayer(src) {
        if (src) {
            const img = document.createElement("img");
            img.src = src;
            img.style.position = "absolute";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            img.style.imageRendering = "pixelated";
            display.appendChild(img);
        }
    }

    // Add all layers in the correct order
    addLayer("dressUp/images/body.png");
    addLayer(outfit.outfits?.image);
    addLayer(outfit.shoes?.image);
    outfit.accessories.forEach((acc) => addLayer(acc.image));
    addLayer(outfit.hair?.image);
    addLayer(outfit.eyes?.image);

    // Add the display to the saved character
    savedCharacter.appendChild(display);

    // Add the saved character to the game area
    window.gameArea.appendChild(savedCharacter);
}

// Keep the dress-up box simple with just the icon and text
dressUpBox.innerHTML = `
    <span>👕</span>
    <div>Dress Up!</div>
`;

// Ensure the iframe is loaded before showing it
dressUpFrame.addEventListener("load", () => {
    // The iframe is now fully loaded
});
