import Controls from './controls.js';
import EffectDefinitions from './effect-definitions.js';
import Helper from './helper-lang.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
});

Hooks.once('ready', async function () {
	// Do anything once the module is ready
	// if (!game.modules.get("lib-wrapper")?.active && game.user.isGM){
	// 	ui.notifications.error(`The '${MODULE_NAME}' module requires to install and activate the 'libWrapper' module.`);
	// 	return;
	// }
  Helper.initLangEffect();

});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});
