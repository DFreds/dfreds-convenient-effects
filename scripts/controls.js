import ConvenientEffectsApp from './app/convenient-effects-app.js';
import RemoveEffectsHandler from './effects/remove-effects-handler.js';
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
    tokenButton.tools.push(this._removeEffectsButton);
  }

  get _convenientEffectsButton() {
    return {
      name: 'convenient-effects',
      title: 'Add Convenient Effects',
      icon: 'fas fa-hand-sparkles',
      button: true,
      visible: game.user.role >= this._settings.controlsPermission,
      onClick: this._handleConvenientEffectsClick,
    };
  }

  _handleConvenientEffectsClick() {
    new ConvenientEffectsApp().render(true);
  }

  get _removeEffectsButton() {
    return {
      name: 'remove-convenient-effects',
      title: 'Remove Convenient Effects',
      icon: 'fas fa-trash-alt',
      button: true,
      visible: game.user.role >= this._settings.controlsPermission,
      onClick: this._handleRemoveEffectsClick,
    };
  }

  async _handleRemoveEffectsClick() {
    const removeEffectsHandler = new RemoveEffectsHandler();
    return removeEffectsHandler.handle();
  }
}
