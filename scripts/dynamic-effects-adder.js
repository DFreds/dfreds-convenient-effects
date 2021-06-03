export default class DynamicEffectsAdder {
  addDynamicEffects(effect, actor) {
    switch (effect.name.toLowerCase()) {
      case 'rage':
        this._addRageEffects(effect, actor);
        break;
      case 'mage armor':
        this._addMageArmorEffects(effect, actor);
        break;
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

    let rageDamage = 'CONST.ACTIVE_EFFECT_MODES.ADD';

    if (barbarianClass.data.data.levels > 15) {
      rageDamage = '4';
    } else if (barbarianClass.data.data.levels > 8) {
      rageDamage = '3';
    }

    effect.effects.push({
      key: 'data.bonuses.mwak.damage',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: rageDamage,
    });

    if (
      barbarianClass.data.data.subclass.toLowerCase() ===
      'path of the totem warrior'
    ) {
      effect.effects.push(
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

  _addMageArmorEffects(effect, actor) {
    const armorClass = 13 + actor.data.data.abilities.dex.mod;

    effect.effects.push({
      key: 'data.attributes.ac.value',
      mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
      value: armorClass,
    });
  }
}
