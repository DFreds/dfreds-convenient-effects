import Effects from './effects.js';

export default class ConvenientEffectsApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'convenient-effects',
      title: 'Convenient Effects',
      popOut: true,
      width: 300,
      height: 600,
      resizable: true,
      template: 'modules/dfreds-convenient-effects/templates/convenient-effects.html'
    });
  }

  getData() {
    return {
      effects: new Effects().effects
    };
  }

  /** @override */
  activateListeners(html) {

  }

  async _handleTogglingEffect() {
    for (const actor of canvas.tokens.controlled.map(token => token.actor)) {
      const effectToRemove = actor.data.effects.find(effect => effect.data.label == toggledEffect.name);

      if (effectToRemove) {
        await actor.deleteEmbeddedDocuments('ActiveEffect', [effectToRemove.id]);
      } else {
        await actor.createEmbeddedDocuments('ActiveEffect', [toggledEffect]);
      }
    }
  }
}
