import ConvenientEffectsApp from './app/convenient-effects-app.js';
import UpdateEffectsHandler from './effects/update-effects-handler.js';
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
  }

  get _convenientEffectsAppButton() {
    const title = `<div class='toolclip'>
      <h4>DFreds Convenient Effects</h4>
        <video src="toolclips/tools/token-measure.webm"></video>
        <p>
          <strong>Convenient Effects:</strong>
          <span class='reference'>Click</span>
        </p>
        <p>
          <strong>Update Effects:</strong>
          <span class='reference'>SHIFT + Click</span>
        </p>
      </div>`;
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
    const updateEffectsHandler = new UpdateEffectsHandler();
    return updateEffectsHandler.handle();
  }

  get _userAppControlsPermission() {
    return game.user.role >= this._settings.appControlsPermission;
  }
}
