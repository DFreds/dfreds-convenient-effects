import Settings from './settings.js';
import ConvenientEffectsApp from './convenient-effects-app.js';
import Effects from './effects.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new Effects();
});

Hooks.on('getSceneControlButtons', (controls) => {
  const settings = new Settings();
  const tokenButton = controls.find((control) => control.name === 'token');

  if (!tokenButton) return;

  tokenButton.tools.push({
    name: 'convenient-effects',
    title: 'Convenient Effects',
    icon: 'fas fa-hat-wizard',
    button: true,
    visible: game.user.isGM || settings.allowForPlayers,
    onClick: () => {
      new ConvenientEffectsApp().render(true);
    },
  });

  tokenButton.tools.push({
    name: 'remove-all-convenient-effects',
    title: 'Remove All Convenient Effects',
    icon: 'fas fa-trash',
    button: true,
    visible: game.user.isGM || settings.allowForPlayers,
    onClick: () => {
      canvas.tokens.controlled
        .map((token) => token.actor)
        .forEach(async (actor) => {
          const effectToRemoves = actor.data.effects
            .filter((effect) =>
              effect.data.label.startsWith('Convenient Effect:')
            )
            .map((effect) => effect.id);

          if (effectToRemoves) {
            await actor.deleteEmbeddedDocuments(
              'ActiveEffect',
              effectToRemoves
            );
          }
        });
    },
  });
});
