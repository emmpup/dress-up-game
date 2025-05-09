/**
 * Dress Up Game - Main Script
 * Handles the dress-up game functionality including outfit management,
 * category selection, and pixel art styling.
 */

// Constants and Configuration
const PIXEL_SIZE_SMALL = 2;
const PIXEL_SIZE_LARGE = 4;
const BORDER_COLOR = "#000";
const SLOTS_VISIBLE = 4;

// Determine if we're in an iframe (overlay mode)
const isOverlay = window !== window.parent;

// Adjust paths based on context
const imagePath = isOverlay ? "../dressUp/images/" : "dressUp/images/";

/**
 * Game Categories Configuration
 * Defines the available categories and their properties
 */
const categories = [
    { id: "outfits", name: "Outfits", icon: "👗" },
    { id: "shoes", name: "Shoes", icon: "👠" },
    { id: "accessories", name: "Accessories", icon: "👜" },
    { id: "hair", name: "Hair", icon: "💇" },
    { id: "eyes", name: "Eyes", icon: "👁️" },
];

/**
 * Items Configuration
 * Defines all available items by category
 */
const itemsByCategory = {
    outfits: [
        { id: "o1", image: `${imagePath}outfit1.png` },
        { id: "o2", image: `${imagePath}outfit2_Dress.png` },
        { id: "o3", image: `${imagePath}outfit3.png` },
        { id: "o4", image: `${imagePath}outfit4.png` },
        { id: "o5", image: `${imagePath}outfit5.png` },
        { id: "o6", image: `${imagePath}outfit6.png` },
    ],
    shoes: [
        { id: "s1", image: `${imagePath}outfit2_Shoes.png` },
        { id: "s2", image: `${imagePath}shoes2.png` },
        { id: "s3", image: `${imagePath}shoes3.png` },
        { id: "s4", image: `${imagePath}shoes4.png` },
    ],
    accessories: [
        { id: "h1", image: `${imagePath}outfit2_Headband.png` },
        { id: "h2", image: `${imagePath}bag.png` },
        { id: "h3", image: `${imagePath}hat.png` },
        { id: "h4", image: `${imagePath}headband.png` },
        { id: "h5", image: `${imagePath}flower.png` },
    ],
    hair: [
        { id: "ha1", image: `${imagePath}hair1.png` },
        { id: "ha2", image: `${imagePath}hair2.png` },
        { id: "ha3", image: `${imagePath}hair3.png` },
        { id: "ha4", image: `${imagePath}hair4.png` },
    ],
    eyes: [
        { id: "e1", image: `${imagePath}eyes1.png` },
        { id: "e2", image: `${imagePath}eyes2.png` },
        { id: "e3", image: `${imagePath}eyes3.png` },
        { id: "e4", image: `${imagePath}eyes4.png` },
    ],
};

// Initialize game state
const outfit = {
    outfits: itemsByCategory.outfits[0],
    shoes: null,
    accessories: [],
    hair: itemsByCategory.hair[0],
    eyes: itemsByCategory.eyes[0],
};

let activeCategory = "outfits";
let currentSlotStartIndex = 0;

/**
 * Category Button Mapping
 * Maps button IDs to their corresponding categories
 */
const categoryButtonMap = [
    { btnId: "outfits-btn", category: "outfits" },
    { btnId: "eyes-btn", category: "eyes" },
    { btnId: "tops-btn", category: "hair" },
    { btnId: "accessories-btn", category: "accessories" },
    { btnId: "shoes-btn", category: "shoes" },
];

/**
 * Sets the active category and updates the UI accordingly
 * @param {string} catId - The category ID to set as active
 */
function setActiveCategory(catId) {
    activeCategory = catId;
    currentSlotStartIndex = 0;
    updateCategoryButtonStates();
    renderItems();
}

/**
 * Updates the visual state of category buttons
 */
function updateCategoryButtonStates() {
    categoryButtonMap.forEach(({ btnId, category }) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.style.opacity = activeCategory === category ? "1" : "0.5";
            btn.style.filter =
                activeCategory === category ? "none" : "grayscale(1)";
        }
    });
}

/**
 * Renders the items for the current category
 */
function renderItems() {
    const slotsContainer = document.getElementById("empty-slots");
    if (!slotsContainer) return;

    slotsContainer.innerHTML = "";
    const items = itemsByCategory[activeCategory] || [];

    // Clamp start index
    currentSlotStartIndex = Math.max(
        0,
        Math.min(currentSlotStartIndex, items.length - SLOTS_VISIBLE)
    );

    // Show visible items
    const visibleItems = items.slice(
        currentSlotStartIndex,
        currentSlotStartIndex + SLOTS_VISIBLE
    );

    visibleItems.forEach((item) => {
        const slot = document.createElement("div");
        slot.className = "slot";

        const img = document.createElement("img");
        img.className = "slot-item-img";
        img.src = item.image;
        slot.appendChild(img);

        slot.onclick = () => handleItemClick(item);

        if (isItemSelected(item)) {
            slot.classList.add("selected");
            const border = document.createElement("img");
            border.className = "selected-border";
            border.src = "dressUp/images/item-selected-border-ui-v2.png";
            slot.appendChild(border);
        }

        slotsContainer.appendChild(slot);
    });

    // Update arrow states
    updateArrowStates(items.length);
}

/**
 * Updates the state of navigation arrows
 * @param {number} totalItems - Total number of items in current category
 */
function updateArrowStates(totalItems) {
    const arrowUp = document.getElementById("arrow-up");
    const arrowDown = document.getElementById("arrow-down");

    if (arrowUp) {
        arrowUp.classList.toggle("disabled-arrow", currentSlotStartIndex === 0);
    }
    if (arrowDown) {
        arrowDown.classList.toggle(
            "disabled-arrow",
            currentSlotStartIndex + SLOTS_VISIBLE >= totalItems
        );
    }
}

/**
 * Handles item selection
 * @param {Object} item - The selected item
 */
function handleItemClick(item) {
    if (activeCategory === "accessories") {
        const index = outfit.accessories.findIndex(
            (accessory) => accessory.id === item.id
        );
        if (index > -1) {
            outfit.accessories.splice(index, 1);
        } else {
            outfit.accessories.push(item);
        }
    } else {
        outfit[activeCategory] =
            outfit[activeCategory]?.id === item.id ? null : item;
    }
    renderOutfit();
    renderItems();
}

/**
 * Checks if an item is currently selected
 * @param {Object} item - The item to check
 * @returns {boolean} Whether the item is selected
 */
function isItemSelected(item) {
    return (
        (activeCategory === "accessories" &&
            outfit.accessories.some((accessory) => accessory.id === item.id)) ||
        outfit[activeCategory]?.id === item.id
    );
}

/**
 * Renders the current outfit
 */
function renderOutfit() {
    const layers = {
        outfit: { element: "outfit-layer", item: outfit.outfits, zIndex: 3 },
        shoes: { element: "shoes-layer", item: outfit.shoes, zIndex: 2 },
        hair: { element: "hair-layer", item: outfit.hair, zIndex: 4 },
        eyes: { element: "eyes-layer", item: outfit.eyes, zIndex: 5 },
    };

    // Apply z-index to each layer
    Object.entries(layers).forEach(([key, { element, zIndex }]) => {
        const layer = document.getElementById(element);
        if (layer) {
            layer.style.zIndex = zIndex;
        }
    });

    // Render individual layers
    Object.entries(layers).forEach(([key, { element, item }]) => {
        const layer = document.getElementById(element);
        if (!layer) {
            console.error(`Layer element not found: ${element}`);
            return;
        }

        if (item) {
            layer.src = item.image;
            layer.style.display = "block";
        } else {
            layer.src = "";
            layer.style.display = "none";
        }
    });

    // Render accessories
    const accessoryContainer = document.getElementById("accessory-container");
    if (accessoryContainer) {
        accessoryContainer.innerHTML = "";
        outfit.accessories.forEach((accessory) => {
            const img = document.createElement("img");
            img.src = accessory.image;
            img.className = "layer accessory-layer";
            img.alt = "accessory";
            accessoryContainer.appendChild(img);
        });
    }
}

/**
 * Resets the outfit to default state
 */
function handleReset() {
    outfit.outfits = itemsByCategory.outfits[0];
    outfit.shoes = null;
    outfit.accessories = [];
    outfit.hair = itemsByCategory.hair[0];
    outfit.eyes = itemsByCategory.eyes[0];
    renderOutfit();
    renderItems();
}

/**
 * Handles saving the current outfit
 */
function handleSaveOutfit() {
    try {
        // Create a deep copy of the current outfit state
        const savedOutfit = {
            outfits: outfit.outfits ? { ...outfit.outfits } : null,
            shoes: outfit.shoes ? { ...outfit.shoes } : null,
            accessories: outfit.accessories.map((acc) => ({ ...acc })),
            hair: outfit.hair ? { ...outfit.hair } : null,
            eyes: outfit.eyes ? { ...outfit.eyes } : null,
        };

        // Send the saved outfit data to the parent window
        if (isOverlay) {
            window.parent.postMessage(
                {
                    type: "outfitSaved",
                    outfit: savedOutfit,
                },
                "*"
            );
        } else {
            // If not in overlay, save to localStorage
            localStorage.setItem("savedOutfit", JSON.stringify(savedOutfit));
        }

        // Reset to default state
        handleReset();

        // Show success message
        console.log("Outfit saved successfully!");
    } catch (error) {
        console.error("Error saving outfit:", error);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners for category buttons
    categoryButtonMap.forEach(({ btnId, category }) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => setActiveCategory(category);
        }
    });

    // Save button
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) {
        saveBtn.onclick = handleSaveOutfit;
    }

    // Arrow navigation
    const arrowUp = document.getElementById("arrow-up");
    const arrowDown = document.getElementById("arrow-down");

    if (arrowUp) {
        arrowUp.onclick = () => {
            if (!arrowUp.classList.contains("disabled-arrow")) {
                currentSlotStartIndex = Math.max(0, currentSlotStartIndex - 1);
                renderItems();
            }
        };
    }

    if (arrowDown) {
        arrowDown.onclick = () => {
            if (!arrowDown.classList.contains("disabled-arrow")) {
                const items = itemsByCategory[activeCategory] || [];
                if (currentSlotStartIndex + SLOTS_VISIBLE < items.length) {
                    currentSlotStartIndex++;
                    renderItems();
                }
            }
        };
    }

    // Initial state
    setActiveCategory("outfits");
    renderOutfit();
});
