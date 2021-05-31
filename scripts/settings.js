export default class Settings {
  static PACKAGE_NAME = 'dfreds-convenient-effects';

  // Settings keys
  static ALLOW_FOR_PLAYERS = 'allowForPlayers';

  /**
   * Register all the settings for the module
   */
  registerSettings() {
    game.settings.register(Settings.PACKAGE_NAME, Settings.ALLOW_FOR_PLAYERS, {
      name: 'Players Can See',
      hint:
        'If enabled, players can see the effects and toggle them on or off.',
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
      onChange: () => window.location.reload()
    });
  }

  /**
   * Returns the game setting for allow for players
   *
   * @returns {Boolean} true if players can use the effects
   */
  get allowForPlayers() {
    return game.settings.get(Settings.PACKAGE_NAME, Settings.ALLOW_FOR_PLAYERS);
  }
}
