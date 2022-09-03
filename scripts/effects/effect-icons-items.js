const v9 = {
    BullseyeLantern: 'systems/dnd5e/icons/items/inventory/lantern.jpg',
    Candle: 'systems/dnd5e/icons/items/inventory/candle.jpg',
    HoodedLantern: 'systems/dnd5e/icons/items/inventory/lantern.jpg',
    Lantern: 'systems/dnd5e/icons/items/inventory/lantern.jpg',
    Torch: 'systems/dnd5e/icons/items/inventory/torch.jpg'
};

const v10 = {
    BullseyeLantern: 'icons/sundries/lights/candle-lit-yellow.webp',
    Candle: 'icons/sundries/lights/candle-unlit-white.webp',
    HoodedLantern: 'icons/sundries/lights/lantern-iron-yellow.webp',
    Lantern: 'icons/sundries/lights/lantern-iron-yellow.webp',
    Torch: 'icons/sundries/lights/torch-black.webp'
};

export default (version) => version >= 10 ? v10 : v9;