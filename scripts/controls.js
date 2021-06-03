import ConvenientEffectsApp from './convenient-effects-app.js';
import Settings from './settings.js';

export default class Controls {
  constructor() {
    this._settings = new Settings();
  }

  initializeControls(controls) {
    const tokenButton = controls.find((control) => control.name === 'token');

    if (!tokenButton) return;

    tokenButton.tools.push(this._convenientEffectsButton);
    tokenButton.tools.push(this.removeAllButton);
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

  get removeAllButton() {
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
