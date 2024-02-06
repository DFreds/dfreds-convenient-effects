import ConvenientEffectsApp from '../app/convenient-effects-app.js';
import EffectHelpers from '../effects/effect-helpers.js';
import FoundryHelpers from '../util/foundry-helpers.js';
import Settings from '../settings.js';

/**
 * Handles setting up the controls for the module
 */
export default class Controls {
  constructor() {
    this._effectHelpers = new EffectHelpers();
    this._foundryHelpers = new FoundryHelpers();
    this._settings = new Settings();
  }

  /**
   * Adds the convenient effect buttons to the token controls
   *
   * @param {Object[]} controls - the default controls provided by foundry
   * @returns
   */
  initializeControls(controls) {
    const tokenButton = controls.find((control) => control.name === 'token');

    if (!tokenButton) return;

    tokenButton.tools.push(this._convenientEffectsAppButton);
  }

  get _convenientEffectsAppButton() {
    return {
      name: 'convenient-effects',
      title: 'DFreds Convenient Effects',
      icon: 'fas fa-hand-sparkles',
      toolclip: {
        src: 'modules/dfreds-convenient-effects/images/toolclip-ce.webm',
        heading: 'DFreds Convenient Effects',
        items: [
          {
            heading: 'Convenient Effects',
            reference: 'CONTROLS.Click',
          },
          {
            heading: 'Update Effects',
            reference: 'CONTROLS.ShiftClick',
          },
        ],
      },
      button: true,
      visible: this._userAppControlsPermission,
      onClick: () => {
        if (!event.shiftKey) {
          this._handleConvenientEffectsClick();
        } else {
          this._handleUpdateEffectsClick();
        }
      },
    };
  }

  _handleConvenientEffectsClick() {
    new ConvenientEffectsApp().render(true);
  }

  async _handleUpdateEffectsClick() {
    const effectsByActorMappings = this._effectHelpers.effectsByActorMappings;

    if (effectsByActorMappings.length === 0) {
      ui.notifications.warn(
        'A token with an active effect must be selected to update effects'
      );
      return;
    }

    const selections = await this._getSelectionsFromUpdateDialog();
    const { effectData, operation } = selections;

    for (const [actorUuid, effectIds] of effectData) {
      const actor = this._foundryHelpers.getActorByUuid(actorUuid);
      if (operation === 'toggle') {
        const updates = effectIds.map((id) => {
          return { _id: id, disabled: !actor.effects.get(id).disabled };
        });
        await actor.updateEmbeddedDocuments('ActiveEffect', updates);
      } else if (operation === 'remove')
        await actor.deleteEmbeddedDocuments('ActiveEffect', effectIds);
    }
  }

  _getSelectionsFromUpdateDialog() {
    return new Promise(async (resolve, reject) => {
      const dialog = await this._getUpdateDialog(resolve, reject);
      dialog.render(true);
    });
  }

  async _getUpdateDialog(resolve, reject) {
    const effectsByActorMappings = this._effectHelpers.effectsByActorMappings;
    for (const i of effectsByActorMappings) {
      for (const e of i.effects) {
        if (!!e.disabled && !e.name.includes('(Disabled'))
          e.name = `${e.name} (Disabled)`;
      }
    }
    const content = await renderTemplate(
      'modules/dfreds-convenient-effects/templates/update-effects-dialog.hbs',
      { effectsByActorMappings }
    );
    return new Dialog(
      {
        title: 'Update Effects',
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

              resolve({
                effectData: new Map(Object.entries(checkedData)),
                operation: 'remove',
              });
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

              resolve({
                effectData: new Map(Object.entries(checkedData)),
                operation: 'toggle',
              });
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel',
            callback: (html) => {
              resolve({
                effectData: new Map(),
                operation: 'cancel',
              });
            },
          },
        },
        default: 'cancel',
      },
      {
        width: 300,
        id: 'convenient-effects-update-effects',
        height: 'auto',
        resizable: true,
      }
    );
  }

  get _userAppControlsPermission() {
    return game.user.role >= this._settings.appControlsPermission;
  }
}
