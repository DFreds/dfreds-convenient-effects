export default class Effect {
  constructor({
    name,
    description,
    icon,
    seconds,
    turns,
    flags = {},
    effects = [],
  }) {
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.seconds = seconds;
    this.turns = turns;
    this.flags = flags;
    this.effects = effects;
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
      flags: this.flags,
      changes: this.effects,
    };
  }

  _getDurationData() {
    if (game.combat) {
      return {
        startRound: game.combat.round,
        rounds: this.turns > 0 ? 0 : this.seconds ? this.seconds / 6 : 0,
        turns: this.turns ? this.turns : 0
      }
    } else {
      return {
        startTime: game.time.worldTime,
        seconds: this.seconds ? this.seconds : 0,
      }
    }
  }
}
