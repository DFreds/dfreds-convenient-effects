/**
 * Data class for defining an effect
 */
export default class Effect {
  constructor({
    name,
    description,
    icon,
    seconds,
    turns,
    isDynamic = false,
    isViewable = true,
    flags = {},
    changes = [],
    atlChanges = [],
    nestedEffects = [],
  }) {
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.seconds = seconds;
    this.turns = turns;
    this.isDynamic = isDynamic;
    this.isViewable = isViewable;
    this.flags = flags;
    this.changes = changes;
    this.atlChanges = atlChanges;
    this.nestedEffects = nestedEffects;
  }

  /**
   * Converts the effect data to an active effect data object
   *
   * @returns The active effect data object for this effect
   */
  convertToActiveEffectData() {
    return {
      name: this.name,
      label: 'Convenient Effect: ' + this.name,
      icon: this.icon,
      duration: this._getDurationData(),
      flags: foundry.utils.mergeObject(this.flags, {
        core: {
          statusId: `convenient-effect-${this.name.toLowerCase()}`,
        },
      }),
      changes: this.changes,
    };
  }

  _getDurationData() {
    if (game.combat) {
      return {
        startRound: game.combat.round,
        rounds: this.seconds ? this.seconds / 6 : undefined,
        turns: this.turns,
      };
    } else {
      return {
        startTime: game.time.worldTime,
        seconds: this.seconds ? this.seconds : undefined,
      };
    }
  }
}
