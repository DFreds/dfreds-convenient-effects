export default class MacroHandler {
  async createMacro(data, slot) {
    if (!data.effectName) return;

    const effect = game.dfreds.effects.all.find(
      (effect) => effect.name === data.effectName
    );

    if (!effect) return;

    const name = `Toggle Convenient Effect - ${effect.name}`;
    const command = `game.dfreds.effectInterface.toggleEffect("${effect.name}")`;

    let macro = game.macros.find(
      (macro) => macro.name === name && macro.data.command === command
    );

    if (!macro) {
      macro = await Macro.create({
        name: name,
        type: 'script',
        img: effect.icon,
        command: command,
      });
    }

    game.user.assignHotbarMacro(macro, slot);

    return false;
  }
}
