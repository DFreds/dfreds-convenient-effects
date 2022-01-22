import Constants from '../constants.js';

/**
 * Handles adding dynamic effects for certain effects
 */
export default class DynamicEffectsAdder {
  /**
   * Adds dynamic effects for specific effects
   *
   * @param {Effect} effect - the effect to handle
   * @param {Actor5e} actor - the effected actor
   */
  async addDynamicEffects(effect, actor) {
    switch (effect.name.toLowerCase()) {
      case 'encumbered':
        this._addLowerMovementEffects({ effect, actor, value: 10 });
        break;
      case 'enlarge':
        this._addEnlargeEffects(effect, actor);
        break;
      case 'heavily encumbered':
        this._addLowerMovementEffects({ effect, actor, value: 20 });
        break;
      case 'longstrider':
        this._addLongstriderEffects(effect, actor);
        break;
      case 'rage':
        this._addRageEffects(effect, actor);
        break;
      case 'ray of frost':
        this._addLowerMovementEffects({ effect, actor, value: 10 });
        break;
      case 'reduce':
        this._addReduceEffects(effect, actor);
        break;
    }
  }

  _addLowerMovementEffects({ effect, actor, value }) {
    const movement = actor.data.data.attributes.movement;

    effect.changes.push({
      key: 'data.attributes.movement.burrow',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: movement.burrow > value ? `-${value}` : `-${movement.burrow}`,
    });

    effect.changes.push({
      key: 'data.attributes.movement.climb',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: movement.climb > value ? `-${value}` : `-${movement.climb}`,
    });

    effect.changes.push({
      key: 'data.attributes.movement.fly',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: movement.fly > value ? `-${value}` : `-${movement.fly}`,
    });

    effect.changes.push({
      key: 'data.attributes.movement.swim',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: movement.swim > value ? `-${value}` : `-${movement.swim}`,
    });

    effect.changes.push({
      key: 'data.attributes.movement.walk',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: movement.walk > value ? `-${value}` : `-${movement.walk}`,
    });
  }

  _addEnlargeEffects(effect, actor) {
    const size = actor.data.data.traits.size;
    const index = Constants.SIZES_ORDERED.indexOf(size);
    
    this._addSizeChangeEffects(effect, Math.min(Constants.SIZES_ORDERED.length - 1, index + 1));
  }

  _addReduceEffects(effect, actor) {
    const size = actor.data.data.traits.size;
    const index = Constants.SIZES_ORDERED.indexOf(size);

    this._addSizeChangeEffects(effect, Math.max(0, index - 1));
  }

  _addSizeChangeEffects(effect, sizeIndex) {
    const size = Constants.SIZES_ORDERED[sizeIndex];
    const tokenSize = game.dnd5e.config.tokenSizes[size];

    effect.changes.push({
      key: 'data.traits.size',
      mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
      value: size,
    });

    effect.atlChanges.push(
      ...[
        {
          key: 'ATL.width',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: tokenSize,
        },
        {
          key: 'ATL.height',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: tokenSize,
        },
      ]
    );
  }

  _addLongstriderEffects(effect, actor) {
    const movement = actor.data.data.attributes.movement;

    if (movement.burrow > 0) {
      effect.changes.push({
        key: 'data.attributes.movement.burrow',
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: '+10',
      });
    }

    if (movement.climb > 0) {
      effect.changes.push({
        key: 'data.attributes.movement.climb',
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: '+10',
      });
    }

    if (movement.fly > 0) {
      effect.changes.push({
        key: 'data.attributes.movement.fly',
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: '+10',
      });
    }

    if (movement.swim > 0) {
      effect.changes.push({
        key: 'data.attributes.movement.swim',
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: '+10',
      });
    }
  }

  _addRageEffects(effect, actor) {
    const barbarianClass = actor.data.items.find(
      (item) => item.type === 'class' && item.name === 'Barbarian'
    );

    if (!barbarianClass) {
      ui.notifications.warn('Selected actor is not a Barbarian');
      return;
    }

    this._determineRageBonusDamage(effect, barbarianClass);
    this._addResistancesIfTotemWarrior(effect, barbarianClass);
    this._determineIfPersistantRage(effect, barbarianClass);
  }

  _determineRageBonusDamage(effect, barbarianClass) {
    let rageDamage = '+2';

    if (barbarianClass.data.data.levels > 15) {
      rageDamage = '+4';
    } else if (barbarianClass.data.data.levels > 8) {
      rageDamage = '+3';
    }

    effect.changes.push({
      key: 'data.bonuses.mwak.damage',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: rageDamage,
    });
  }

  _addResistancesIfTotemWarrior(effect, barbarianClass) {
    if (
      barbarianClass.data.data.subclass?.toLowerCase() ===
      'path of the totem warrior'
    ) {
      effect.changes.push(
        ...[
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'acid',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'cold',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'fire',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'force',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'lightning',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'necrotic',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'poison',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'physical',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'radiant',
          },
          {
            key: 'data.traits.dr.value',
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: 'thunder',
          },
        ]
      );
    }
  }

  _determineIfPersistantRage(effect, barbarianClass) {
    if (barbarianClass.data.data.levels > 14) {
      effect.seconds = undefined;
    }
  }
}
