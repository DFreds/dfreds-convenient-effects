import Constants from './constants.js';
import FoundryHelpers from './foundry-helpers.js';

export default class TextEnrichers {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
  }

  initialize() {
    CONFIG.TextEditor.enrichers.push({
      id: `${Constants.MODULE_ID}-toggle-effect`,
      pattern: new RegExp('@(toggleEffect)\\[([^#\\]]+)](?:{([^}]+)})?', 'g'),
      enricher: (match, options) => {
        let [method, effectName, name] = match.slice(1, 4);
        return this._createEffectLink({ method, effectName, name });
      },
    });

    this._activateListeners();
  }

  _activateListeners() {
    const body = $('body');
    body.on('click', 'a.ce-content-link', this._onClickToggleEffectContentLink);
  }

  async _onClickToggleEffectContentLink(event) {
    event.preventDefault();
    const effectName = event.currentTarget.dataset.effectName;

    if (effectName) {
      await game.dfreds.effectInterface.toggleEffect(effectName);
    }
  }

  _createEffectLink({ method, effectName, name }) {
    // Prepare replacement data
    const data = {
      cls: ['content-link', 'ce-content-link'],
      icon: 'fas fa-hand-sparkles',
      dataset: {
        uuid: 'nothing', // stops undefined error in foundry a.content-link click listener
      },
      name: name ?? effectName,
    };

    let broken = false;
    let hasEffect = !!game.dfreds.effectInterface.findEffectByName(effectName);
    if (method === 'toggleEffect' && hasEffect) {
      data.dataset.effectName = effectName;
    } else {
      broken = true;
    }

    // Flag a link as broken
    if (broken) {
      data.icon = 'fas fa-unlink';
      data.cls.push('broken');
    }

    const constructAnchor = () => {
      const a = document.createElement('a');
      a.classList.add(...data.cls);
      a.draggable = true;
      for (let [k, v] of Object.entries(data.dataset)) {
        a.dataset[k] = v;
      }
      a.innerHTML = `<i class="${data.icon}"></i>${data.name}`;
      return a;
    };

    return constructAnchor();
  }
}
