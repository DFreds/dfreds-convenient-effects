import Settings from './settings.js';
import ConvenientEffectsApp from './convenient-effects-app.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
});

// Hooks.on('renderSceneControls', (_controls, html) => {
//   const convenientEffectsButton = $(
//     `<li class="scene-control" title="Convenient Effects">
//       <i class="fas fa-star"></i>
//     </li>
//     `
//   );

//   html.append(convenientEffectsButton);
//   convenientEffectsButton.on('click', () => ConvenientEffects.open());
// });

Hooks.on('getSceneControlButtons', (controls) => {
  const settings = new Settings();
  const tokenButton = controls.find(control => control.name === 'token');

  if (!tokenButton) return;

  tokenButton.tools.push({
    name: 'convenient-effects',
    title: 'Convenient Effects',
    icon: 'fas fa-hat-wizard',
    visible: game.user.isGM || settings.allowForPlayers,
    onClick: () => {
      new ConvenientEffectsApp().render(true);
    }
  });

  tokenButton.tools.push({
    name: 'remove-all-convenient-effects',
    title: 'Remove All Convenient Effects',
    icon: 'fas fa-trash',
    visible: game.user.isGM || settings.allowForPlayers,
    onClick: () => {
      console.log('yay');
    }
  });
});
