const v9 = {
    BardicInspiration: 'systems/dnd5e/icons/skills/yellow_08.jpg',
    ChannelDivinity: {
        SacredWeapon: 'systems/dnd5e/icons/skills/light_05.jpg',
        TurnUndead: 'systems/dnd5e/icons/skills/yellow_19.jpg'
    },
    Rage: 'systems/dnd5e/icons/skills/red_10.jpg',
    RecklessAttack: 'systems/dnd5e/icons/skills/weapon_34.jpg',
    GreatWeaponMaster: 'systems/dnd5e/icons/skills/red_05.jpg',
    Sharpshooter: 'systems/dnd5e/icons/skills/green_01.jpg',
};

const v10 = {
    BardicInspiration: 'icons/skills/melee/unarmed-punch-fist.webp',
    ChannelDivinity: {
        SacredWeapon: 'icons/skills/melee/weapons-crossed-swords-yellow-teal.webp',
        TurnUndead: 'icons/magic/fire/flame-burning-creature-skeleton.webp'
    },
    Rage: 'icons/creatures/abilities/mouth-teeth-human.webp',
    RecklessAttack: 'icons/skills/melee/blade-tips-triple-bent-white.webp',
    GreatWeaponMaster: 'icons/skills/melee/strike-sword-steel-yellow.webp',
    Sharpshooter: 'icons/weapons/bows/shortbow-recurve-yellow.webp',
};

export default (version) => version >= 10 ? v10 : v9;