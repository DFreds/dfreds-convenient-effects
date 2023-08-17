import EffectHelpers from './effect-helpers.js';
import FoundryHelpers from '../foundry-helpers.js';

/**
 * Handles the removal of specific effects via a dialog
 */
export default class RemoveEffectsHandler {
  constructor() {
    this._effectHelpers = new EffectHelpers();
    this._foundryHelpers = new FoundryHelpers();
  }

  /**
   * Handler function for when a user clicks the remove effects button
   */
  async handle() {
    const effectsByActorMappings = this._effectsByActorMappings;

    if (effectsByActorMappings.length === 0) {
      ui.notifications.warn(
        'A token with an active convenient effect must be selected to remove effects'
      );
      return;
    }

    const selections = await this._getSelectionsFromDialog();
    const {effectData,todo} = selections;
    for (const [actorUuid,effectIds] of effectData) {
      const actor = this._foundryHelpers.getActorByUuid(actorUuid);
      if (selections?.todo === 'toggle') {
        const updates = effectIds.map((id)=>{return {_id:id,disabled:!actor.effects.get(id).disabled}});
        await actor.updateEmbeddedDocuments('ActiveEffect',updates);
      }
      else if (selections?.todo === 'remove')
        await actor.deleteEmbeddedDocuments('ActiveEffect', effectIds);
    }
  }

  get _effectsByActorMappings() {
    return canvas.tokens.controlled
      .filter((token) => {
        const effects = token.actor.effects.filter(
          (activeEffect) => activeEffect.isTemporary
        );
        return effects.length > 0;
      })
      .map((token) => {
        const actor = token.actor;
        const effects = token.actor.effects.filter(
          (activeEffect) => activeEffect.isTemporary
        );

        return { actor, effects };
      });
  }

  _getSelectionsFromDialog() {
    return new Promise(async (resolve, reject) => {
      const dialog = await this._getDialog(resolve, reject);
      dialog.render(true);
    });
  }

  async _getDialog(resolve, _reject) {
    const content = await renderTemplate(
      'modules/dfreds-convenient-effects/templates/remove-effects-dialog.hbs',
      { effectsByActorMappings: this._effectsByActorMappings }
    );
    return new Dialog(
      {
        title: 'Remove Effects',
        content: content,
        buttons: {
          remove: {
            icon: '<i class="fas fa-trash"></i>',
            label: 'Remove',
            callback: (html) => {
              const checkedData = html
                .find('input:checked')
                .map((idx, ele) => {
                  const data = $(ele).data();
                  return {
                    actorUuid: data?.actorUuid,
                    effectId: data?.effectId,
                  };
                })
                .get()
                .reduce((result, currentValue) => {
                  // If an array already present for key, push it to the array. Else create an array and push the object
                  (result[currentValue['actorUuid']] =
                    result[currentValue['actorUuid']] || []).push(
                    currentValue.effectId
                  );
                  // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                  return result;
                }, {});

              resolve({effectData:new Map(Object.entries(checkedData)),todo:'remove'});
            },
          },
          toggle: {
            icon: '<i class="fas fa-toggle-off"></i>',
            label: 'Toggle',
            callback: (html) => {
              const checkedData = html
                .find('input:checked')
                .map((idx, ele) => {
                  const data = $(ele).data();
                  return {
                    actorUuid: data?.actorUuid,
                    effectId: data?.effectId,
                  };
                })
                .get()
                .reduce((result, currentValue) => {
                  // If an array already present for key, push it to the array. Else create an array and push the object
                  (result[currentValue['actorUuid']] =
                    result[currentValue['actorUuid']] || []).push(
                    currentValue.effectId
                  );
                  // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                  return result;
                }, {});

              resolve({effectData:new Map(Object.entries(checkedData)),todo:'toggle'});
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel',
            callback: (html) => {
              resolve(null);
            },
          },
        },
        default: 'cancel',
      },
      { width: 300, id:'DFredsCE-removeEffects',height: "auto", resizable: true }
    );
  }
}
