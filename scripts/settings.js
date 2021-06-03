export default class Settings {
  static PACKAGE_NAME = 'dfreds-convenient-effects';

  // Settings keys
  static ALLOW_FOR_PLAYERS = 'allowForPlayers';
  static FAVORITE_EFFECT_NAMES = 'favoriteEffectNames';
  static EXPANDED_FOLDERS = 'expandedFolders';

  /**
   * Register all the settings for the module
   */
  registerSettings() {
    game.settings.register(Settings.PACKAGE_NAME, Settings.ALLOW_FOR_PLAYERS, {
      name: 'Players Can See',
      hint: 'If enabled, players can see the effects and toggle them on or off.',
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
      onChange: () => window.location.reload(),
    });

    game.settings.register(
      Settings.PACKAGE_NAME,
      Settings.FAVORITE_EFFECT_NAMES,
      {
        name: 'Favorite Effect Names',
        scope: 'client',
        config: false,
        default: '',
        type: String,
      }
    );

    game.settings.register(
      Settings.PACKAGE_NAME,
      Settings.EXPANDED_FOLDERS,
      {
        name: 'Expanded Folders',
        scope: 'client',
        config: false,
        default: 'Favorites',
        type: String,
      }
    );
  }

  /**
   * Returns the game setting for allow for players
   *
   * @returns {Boolean} true if players can use the effects
   */
  get allowForPlayers() {
    return game.settings.get(Settings.PACKAGE_NAME, Settings.ALLOW_FOR_PLAYERS);
  }

  /**
   * Returns the game setting for the favorite effect names
   *
   * @returns {Array} the names of all the favorite effects
   */
  get favoriteEffectNames() {
    return game.settings.get(Settings.PACKAGE_NAME, Settings.FAVORITE_EFFECT_NAMES).split(';').filter(name => name.trim());
  }

  addFavoriteEffect(name) {
    let favoriteEffectsArray = this.favoriteEffectNames;
    favoriteEffectsArray.push(name);

    favoriteEffectsArray = [...new Set(favoriteEffectsArray)]; // remove duplicates

    game.settings.set(Settings.PACKAGE_NAME, Settings.FAVORITE_EFFECT_NAMES, favoriteEffectsArray.join(';'));
  }

  removeFavoriteEffect(name) {
    let favoriteEffectsArray = this.favoriteEffectNames.filter(favoriteEffect => favoriteEffect !== name);
    game.settings.set(Settings.PACKAGE_NAME, Settings.FAVORITE_EFFECT_NAMES, favoriteEffectsArray.join(';'));
  }

  get expandedFolders() {
    return game.settings.get(Settings.PACKAGE_NAME, Settings.EXPANDED_FOLDERS).split(';').filter(name => name.trim());
  }

  addExpandedFolder(name) {
    let expandedFolderArray = this.expandedFolders;
    expandedFolderArray.push(name);

    expandedFolderArray = [...new Set(expandedFolderArray)]; // remove duplicates

    game.settings.set(Settings.PACKAGE_NAME, Settings.EXPANDED_FOLDERS, expandedFolderArray.join(';'));
  }

  removeExpandedFolder(name) {
    let expandedFolderArray = this.expandedFolders.filter(expandedFolder => expandedFolder !== name);
    game.settings.set(Settings.PACKAGE_NAME, Settings.EXPANDED_FOLDERS, expandedFolderArray.join(';'));
  }
}
