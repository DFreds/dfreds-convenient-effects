import ConvenientEffectsApp from './app/convenient-effects-app.js';
import Settings from './settings.js';

/**
 * Handles setting up the controls for the module
 */
export default class Controls {
  constructor() {
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

    tokenButton.tools.push(this._convenientEffectsButton);
    tokenButton.tools.push(this._removeAllButton);
  }

  get _convenientEffectsButton() {
    return {
      name: 'convenient-effects',
      title: 'Add Convenient Effects',
      icon: 'fas fa-hand-sparkles',
      button: true,
      visible: game.user.isGM || this._settings.allowForPlayers,
      onClick: this._handleConvenientEffectsClick,
    };
  }

  _handleConvenientEffectsClick() {
    new ConvenientEffectsApp().render(true);
  }

  get _removeAllButton() {
    return {
      name: 'remove-all-convenient-effects',
      title: 'Remove All Convenient Effects',
      icon: 'fas fa-trash-alt',
      button: true,
      visible: game.user.isGM || this._settings.allowForPlayers,
      onClick: this._handleRemoveAllClick,
    };
  }

  _handleRemoveAllClick() {
    canvas.tokens.controlled
      .map((token) => token.actor)
      .forEach(async (actor) => {
        const effectToRemoves = actor.data.effects
          .filter((effect) =>
            effect.data.label.startsWith('Convenient Effect:')
          )
          .map((effect) => effect.id);

        if (effectToRemoves) {
          await actor.deleteEmbeddedDocuments('ActiveEffect', effectToRemoves);
        }
      });
  }
}
