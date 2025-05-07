/**
 * Dress Up Game - Main Script
 * Handles the dress-up game functionality including outfit management,
 * category selection, and pixel art styling.
 */

// Constants and Configuration
const PIXEL_SIZE_SMALL = 2;
const PIXEL_SIZE_LARGE = 4;
const BORDER_COLOR = "#000";

// Determine if we're in an iframe (overlay mode)
const isOverlay = window !== window.parent;

// Adjust paths based on context
const imagePath = isOverlay ? "../dressUp/images/" : "dressUp/images/";

// Game State
const categories = [
    { id: "outfits", name: "Outfits", icon: "👗" },
    { id: "shoes", name: "Shoes", icon: "👠" },
    { id: "accessories", name: "Accessories", icon: "👜" },
    { id: "hair", name: "Hair", icon: "💇" },
    { id: "eyes", name: "Eyes", icon: "👁️" },
];

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
const SLOTS_VISIBLE = 4;

// Map button IDs to category IDs
const categoryButtonMap = [
    { btnId: "outfits-btn", category: "outfits" },
    { btnId: "eyes-btn", category: "eyes" },
    { btnId: "tops-btn", category: "hair" },
    { btnId: "accessories-btn", category: "accessories" },
    { btnId: "shoes-btn", category: "shoes" },
];

function setActiveCategory(catId) {
    activeCategory = catId;
    currentSlotStartIndex = 0;
    updateCategoryButtonStates();
    renderItems();
}

function updateCategoryButtonStates() {
    categoryButtonMap.forEach(({ btnId, category }) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            if (activeCategory === category) {
                btn.style.opacity = "1";
                btn.style.filter = "none";
            } else {
                btn.style.opacity = "0.5";
                btn.style.filter = "grayscale(1)";
            }
        }
    });
}

function renderItems() {
    const slotsContainer = document.getElementById("empty-slots");
    if (!slotsContainer) return;
    slotsContainer.innerHTML = "";
    const items = itemsByCategory[activeCategory] || [];
    // Clamp start index
    if (currentSlotStartIndex > items.length - SLOTS_VISIBLE) {
        currentSlotStartIndex = Math.max(0, items.length - SLOTS_VISIBLE);
    }
    if (currentSlotStartIndex < 0) currentSlotStartIndex = 0;
    // Only show SLOTS_VISIBLE items
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
    // Arrow logic
    const arrowUp = document.getElementById("arrow-up");
    const arrowDown = document.getElementById("arrow-down");
    if (arrowUp) {
        if (currentSlotStartIndex === 0) {
            arrowUp.classList.add("disabled-arrow");
        } else {
            arrowUp.classList.remove("disabled-arrow");
        }
    }
    if (arrowDown) {
        if (currentSlotStartIndex + SLOTS_VISIBLE >= items.length) {
            arrowDown.classList.add("disabled-arrow");
        } else {
            arrowDown.classList.remove("disabled-arrow");
        }
    }
}

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
    // Initial state
    setActiveCategory("outfits");
    renderOutfit();
    // Arrow event listeners
    const arrowUp = document.getElementById("arrow-up");
    const arrowDown = document.getElementById("arrow-down");
    if (arrowUp) {
        arrowUp.onclick = () => {
            if (arrowUp.classList.contains("disabled-arrow")) return;
            currentSlotStartIndex = Math.max(0, currentSlotStartIndex - 1);
            renderItems();
        };
    }
    if (arrowDown) {
        arrowDown.onclick = () => {
            if (arrowDown.classList.contains("disabled-arrow")) return;
            const items = itemsByCategory[activeCategory] || [];
            if (currentSlotStartIndex + SLOTS_VISIBLE < items.length) {
                currentSlotStartIndex++;
                renderItems();
            }
        };
    }
});

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

function isItemSelected(item) {
    return (
        (activeCategory === "accessories" &&
            outfit.accessories.some((accessory) => accessory.id === item.id)) ||
        outfit[activeCategory]?.id === item.id
    );
}

function renderOutfit() {
    const layers = {
        outfit: { element: "outfit-layer", item: outfit.outfits },
        shoes: { element: "shoes-layer", item: outfit.shoes },
        hair: { element: "hair-layer", item: outfit.hair },
        eyes: { element: "eyes-layer", item: outfit.eyes },
    };

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
    if (!accessoryContainer) {
        console.error("Accessory container not found");
        return;
    }

    accessoryContainer.innerHTML = "";
    outfit.accessories.forEach((accessory) => {
        const img = document.createElement("img");
        img.src = accessory.image;
        img.className = "layer accessory-layer";
        img.alt = "accessory";
        accessoryContainer.appendChild(img);
    });
}

// Event Handlers
function handleReset() {
    outfit.outfits = itemsByCategory.outfits[0];
    outfit.shoes = null;
    outfit.accessories = [];
    outfit.hair = itemsByCategory.hair[0];
    outfit.eyes = itemsByCategory.eyes[0];
    renderOutfit();
    renderItems();
}

function handleSaveOutfit() {
    const saved = {
        outfits: outfit.outfits,
        shoes: outfit.shoes,
        accessories: [...outfit.accessories],
        hair: outfit.hair,
        eyes: outfit.eyes,
    };

    // Send the saved outfit data to the parent window
    window.parent.postMessage(
        {
            type: "outfitSaved",
            outfit: saved,
        },
        "*"
    );

    // Reset to default
    outfit.outfits = itemsByCategory.outfits[0];
    outfit.shoes = null;
    outfit.accessories = [];
    outfit.hair = itemsByCategory.hair[0];
    outfit.eyes = itemsByCategory.eyes[0];

    renderOutfit();
    renderItems();
}
