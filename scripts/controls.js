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

    tokenButton.tools.push(this._convenientEffectsAppButton);
    if (!this._unifiedButton) tokenButton.tools.push(this._removeEffectsButton);
  }

  get _convenientEffectsAppButton() {
    const title =
      this._settings.unifiedAppButton !== 'none' &&
      game.user.role >= this._settings.removeControlsPermission
        ? `<center><b>Convenient Effects Apps</b></center><hl>
        <p style="text-align:center"><u>Left mouse click</u>: Opens Add CE</p>
        <hl><u>Shift+Left mouse click</u>: Opens Update CE`
        : `Add Convenient Effects`;
    return {
      name: 'convenient-effects',
      title,
      icon: 'fas fa-hand-sparkles',
      button: true,
      visible: this._userAppControlsPermission,
      onClick: () => {
        if (this._unifiedButton && this._userRemoveControlsPermission) {
          if (!event.shiftKey) this._handleConvenientEffectsClick();
          else this._handleRemoveEffectsClick();
        } else this._handleConvenientEffectsClick();
      },
    };
  }

  _handleConvenientEffectsClick() {
    new ConvenientEffectsApp().render(true);
  }

  async _handleRemoveEffectsClick() {
    const removeEffectsHandler = new RemoveEffectsHandler();
    return removeEffectsHandler.handle();
  }

  get _removeEffectsButton() {
    return {
      name: 'remove-convenient-effects',
      title: 'Remove Convenient Effects',
      icon: 'fas fa-trash-alt',
      button: true,
      visible: this._userRemoveControlsPermission,
      onClick: this._handleRemoveEffectsClick,
    };
  }

  get _unifiedButton() {
    return this._settings.unifiedAppButton;
  }

  get _userAppControlsPermission() {
    return game.user.role >= this._settings.appControlsPermission;
  }

  get _userRemoveControlsPermission() {
    return game.user.role >= this._settings.removeControlsPermission;
  }
}
