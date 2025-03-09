/**
 * Create a Macro from a Convenient Effect drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 *
 * @param data - The dropped data
 * @param slot - The hotbar slot to use
 */

import { Flags } from "../utils/flags.ts";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function createMacro(
    effect: ActiveEffect<any>,
    slot?: number | string,
): Promise<void> {
    const name = `${game.i18n.localize(EN_JSON.ConvenientEffects.ToggleConvenientEffect)} - ${effect.name}`;
    const id = Flags.getCeEffectId(effect);
    const command = `game.dfreds.effectInterface.toggleEffect({ effectId: "${id}" })`;

    let macro = game.macros.find(
        (macro) => macro.name === name && macro.command === command,
    );

    if (!macro) {
        macro = await Macro.create({
            name,
            type: "script",
            img: effect.img,
            command,
        });
    }

    if (macro) {
        game.user.assignHotbarMacro(macro, slot);
    }
}

export { createMacro };
