export default class Settings {
  static PACKAGE_NAME = 'dfreds-convenient-effects';

  // Settings keys
  static ENABLED = 'enabled';

  /**
   * Register all the settings for the module
   */
  registerSettings() {
    game.settings.register(Settings.PACKAGE_NAME, Settings.ENABLED, {
      name: 'Enabled',
      hint:
        'If enabled, currency will be generated for tokens dropped in scenes.',
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
  }

  /**
   * Returns the game setting for enabled
   *
   * @returns {Boolean} true if currency should be generated on token drop
   */
  get enabled() {
    return game.settings.get(Settings.PACKAGE_NAME, Settings.ENABLED);
  }
}
