import Constants from './constants.js';

/**
 * Handle setting and fetching all settings in the module
 */
export default class Settings {
  // Settings keys
  static CHAT_MESSAGE_PERMISSION = 'chatMessagePermission';
  static APP_CONTROLS_PERMISSION = 'controlsPermission';
  static ALLOW_PLAYER_CUSTOM_EFFECTS = 'allowPlayerCustomEffects';
  static INTEGRATE_WITH_ATE = 'integrateWithAtl';
  static INTEGRATE_WITH_TOKEN_MAGIC = 'integrateWithTokenMagic';
  static MODIFY_STATUS_EFFECTS = 'modifyStatusEffects';
  static PRIORITIZE_TARGETS = 'prioritizeTargets';
  static REMOVE_CONTROLS_PERMISSION = 'removeControlsPermission';
  static SHOW_CHAT_MESSAGE_EFFECT_DESCRIPTION = 'chatMessageEffectDescription';
  static SHOW_NESTED_EFFECTS = 'showNestedEffects';
  static STATUS_EFFECTS_SORT_ORDER = 'statusEffectsSortOrder';

  static FAVORITE_EFFECT_NAMES = 'favoriteEffectNames';
  static STATUS_EFFECT_NAMES = 'statusEffectNames';
  static EXPANDED_FOLDERS = 'expandedFolders';
  static CUSTOM_EFFECTS_ITEM_ID = 'customEffectsItemId';

  /**
   * Register all the settings for the module
   */
  registerSettings() {
    this._registerConfigSettings();
    this._registerNonConfigSettings();
  }

  _registerConfigSettings() {
    const userRoles = {};
    userRoles[CONST.USER_ROLES.PLAYER] = game.i18n.localize("DFREDSCE.UserRolesPlayer");
    userRoles[CONST.USER_ROLES.TRUSTED] = game.i18n.localize("DFREDSCE.UserRolesTrustedPlayer");
    userRoles[CONST.USER_ROLES.ASSISTANT] = game.i18n.localize("DFREDSCE.UserRolesAssistantGM");
    userRoles[CONST.USER_ROLES.GAMEMASTER] = game.i18n.localize("DFREDSCE.UserRolesGameMaster");
    userRoles[5] = game.i18n.localize("DFREDSCE.UserRoles.None");

    game.settings.register(
      Constants.MODULE_ID,
      Settings.CHAT_MESSAGE_PERMISSION,
      {
        name: game.i18n.localize("DFREDSCE.ChatMessagePermissionName"),
        hint: game.i18n.localize("DFREDSCE.ChatMessagePermissionHint"),
        scope: 'world',
        config: true,
        default: CONST.USER_ROLES.GAMEMASTER,
        choices: userRoles,
        type: String,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.APP_CONTROLS_PERMISSION,
      {
        name: game.i18n.localize("DFREDSCE.AppControlsPermission"),
        hint: game.i18n.localize("DFREDSCE.AppControlsPermissionHint"),
        scope: 'world',
        config: true,
        default: CONST.USER_ROLES.GAMEMASTER,
        choices: userRoles,
        type: String,
        requiresReload: true,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.REMOVE_CONTROLS_PERMISSION,
      {
        name: game.i18n.localize("DFREDSCE.RemoveControlsPermission"),
        hint: game.i18n.localize("DFREDSCE.RemoveControlsPermissionHint"),
        scope: 'world',
        config: true,
        default: CONST.USER_ROLES.GAMEMASTER,
        choices: userRoles,
        type: String,
        requiresReload: true,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.MODIFY_STATUS_EFFECTS,
      {
        name: game.i18n.localize("DFREDSCE.ModifyStatusEffects"),
        hint: game.i18n.localize("DFREDSCE.ModifyStatusEffectsHint"),
        scope: 'world',
        config: true,
        default: game.i18n.localize("DFREDSCE.ModifyStatusEffectsNone"),
        choices: {
          none: game.i18n.localize("DFREDSCE.ModifyStatusEffectsNone"),
          replace: game.i18n.localize("DFREDSCE.ModifyStatusEffectsReplace"),
          add: game.i18n.localize("DFREDSCE.ModifyStatusEffectsAdd"),
        },
        type: String,
        requiresReload: true,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.SHOW_CHAT_MESSAGE_EFFECT_DESCRIPTION,
      {
        name: game.i18n.localize("DFREDSCE.ShowChatMessageEffectDescription"),
        hint: game.i18n.localize("DFREDSCE.ShowChatMessageEffectDescription"),
        scope: 'world',
        config: true,
        default: game.i18n.localize("DFREDSCE.ShowChatMessageEffectDescriptionOnAddorRemove"),
        choices: {
          onAddOrRemove: game.i18n.localize("DFREDSCE.ShowChatMessageEffectDescriptionOnAddorRemove"),
          onAddOnly: game.i18n.localize("DFREDSCE.ShowChatMessageEffectDescriptionOnAddOnly"),
          never: game.i18n.localize("DFREDSCE.ShowChatMessageEffectDescriptionNever"),
        },
        type: String,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.STATUS_EFFECTS_SORT_ORDER,
      {
        name: game.i18n.localize("DFREDSCE.StatusEffectsSortOrder"),
        hint: game.i18n.localize("DFREDSCE.StatusEffectsSortOrderHint"),
        scope: 'world',
        config: true,
        default: game.i18n.localize("DFREDSCE.StatusEffectsSortOrderNone"),
        choices: {
          byOrderAdded: game.i18n.localize("DFREDSCE.StatusEffectsSortOrderByOrderAdded"),
          alphabetical: game.i18n.localize("DFREDSCE.StatusEffectsSortOrderAlphabetical"),
        },
        type: String,
        requiresReload: true,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.ALLOW_PLAYER_CUSTOM_EFFECTS,
      {
        name: game.i18n.localize("DFREDSCE.AllowPlayerCustomEffects"),
        hint: game.i18n.localize("DFREDSCE.AllowPlayerCustomEffectsHint"),
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
        onChange: async (value) => {
          const customEffectsItem = await this._findCustomEffectsItem();

          if (!customEffectsItem) return;

          let newOwnership = duplicate(customEffectsItem.ownership);
          newOwnership.default = value ? 3 : 0;
          await customEffectsItem.update({ ownership: newOwnership });
        },
      }
    );

    game.settings.register(Constants.MODULE_ID, Settings.INTEGRATE_WITH_ATE, {
      name: game.i18n.localize("DFREDSCE.IntegratewithATE"),
      hint: game.i18n.localize("DFREDSCE.IntegratewithATEHint"),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    game.settings.register(
      Constants.MODULE_ID,
      Settings.INTEGRATE_WITH_TOKEN_MAGIC,
      {
        name: game.i18n.localize("DFREDSCE.IntegratewithTokenMagic"),
        hint: game.i18n.localize("DFREDSCE.IntegratewithTokenMagic"),
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
      }
    );

    game.settings.register(Constants.MODULE_ID, Settings.PRIORITIZE_TARGETS, {
      name: game.i18n.localize("DFREDSCE.PrioritizeTargets"),
      hint: game.i18n.localize("DFREDSCE.PrioritizeTargetsHint"),
      scope: 'client',
      config: true,
      default: false,
      type: Boolean,
    });

    game.settings.register(Constants.MODULE_ID, Settings.SHOW_NESTED_EFFECTS, {
      name: game.i18n.localize("DFREDSCE.ShowNestedEffects"),
      hint: game.i18n.localize("DFREDSCE.ShowNestedEffectsHint"),
      scope: 'client',
      config: true,
      default: false,
      type: Boolean,
    });
  }

  _registerNonConfigSettings() {
    game.settings.register(
      Constants.MODULE_ID,
      Settings.FAVORITE_EFFECT_NAMES,
      {
        name: game.i18n.localize("DFREDSCE.FavoriteEffectNames"),
        scope: 'client',
        config: false,
        default: '',
        type: Array,
      }
    );

    game.settings.register(Constants.MODULE_ID, Settings.STATUS_EFFECT_NAMES, {
      name: game.i18n.localize("DFREDSCE.SETTINGS.StatusEffectNames"),
      scope: 'world',
      config: false,
      default: this._defaultStatusEffectNames,
      type: Array,
    });

    game.settings.register(Constants.MODULE_ID, Settings.EXPANDED_FOLDERS, {
      name: game.i18n.localize("DFREDSCE.SETTINGS.ExpandedFolders"),
      scope: 'client',
      config: false,
      default: 'Favorites',
      type: Array,
    });

    game.settings.register(
      Constants.MODULE_ID,
      Settings.CUSTOM_EFFECTS_ITEM_ID,
      {
        name: game.i18n.localize("DFREDSCE.CustomEffectsItemID"),
        scope: 'world',
        config: false,
        default: '',
        type: String,
      }
    );
  }

  get _defaultStatusEffectNames() {
    return [
      game.i18n.localize("DFREDSCE.Blinded"),
      game.i18n.localize("DFREDSCE.Charmed"),
      game.i18n.localize("DFREDSCE.Concentrating"),
      game.i18n.localize("DFREDSCE.Dead"),
      game.i18n.localize("DFREDSCE.Deafened"),
      game.i18n.localize("DFREDSCE.Exhaustion1"),
      game.i18n.localize("DFREDSCE.Exhaustion2"),
      game.i18n.localize("DFREDSCE.Exhaustion3"),
      game.i18n.localize("DFREDSCE.Exhaustion4"),
      game.i18n.localize("DFREDSCE.Exhaustion5"),
      game.i18n.localize("DFREDSCE.Frightened"),
      game.i18n.localize("DFREDSCE.Grappled"),
      game.i18n.localize("DFREDSCE.Incapacitated"),
      game.i18n.localize("DFREDSCE.Invisible"),
      game.i18n.localize("DFREDSCE.Paralyzed"),
      game.i18n.localize("DFREDSCE.Petrified"),
      game.i18n.localize("DFREDSCE.Poisoned"),
      game.i18n.localize("DFREDSCE.Prone"),
      game.i18n.localize("DFREDSCE.Restrained"),
      game.i18n.localize("DFREDSCE.Stunned"),
      game.i18n.localize("DFREDSCE.Unconscious"),
    ];
  }

  /**
   * Returns the game setting for chat message permission
   *
   * @returns {number} a number representing the chosen role
   */
  get chatMessagePermission() {
    return parseInt(
      game.settings.get(Constants.MODULE_ID, Settings.CHAT_MESSAGE_PERMISSION)
    );
  }

  /**
   * Returns the game setting for app controls permission
   *
   * @returns {number} a number representing the chosen role
   */
  get appControlsPermission() {
    return parseInt(
      game.settings.get(Constants.MODULE_ID, Settings.APP_CONTROLS_PERMISSION)
    );
  }

  /**
   * Returns the game setting for allowing players to manipulate custom effects.
   *
   * @returns {boolean} true if players can manipulate custom effects
   */
  get allowPlayerCustomEffects() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.ALLOW_PLAYER_CUSTOM_EFFECTS
    );
  }

  /**
   * Returns the game setting for integrating with ATE
   *
   * @returns {boolean} true if integration with ATE is enabled
   */
  get integrateWithAte() {
    return game.settings.get(Constants.MODULE_ID, Settings.INTEGRATE_WITH_ATE);
  }

  /**
   * Returns the game setting for integrating with Token Magic
   *
   * @returns {boolean} true if integration with Token Magic is enabled
   */
  get integrateWithTokenMagic() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.INTEGRATE_WITH_TOKEN_MAGIC
    );
  }

  /**
   * Returns the game setting for status effect type
   *
   * @returns {string} a string representing the chosen status effect type
   */
  get modifyStatusEffects() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.MODIFY_STATUS_EFFECTS
    );
  }

  /**
   * Returns the game setting for prioritizing targets
   *
   * @returns {boolean} true if targets should take first priority
   */
  get prioritizeTargets() {
    return game.settings.get(Constants.MODULE_ID, Settings.PRIORITIZE_TARGETS);
  }

  /**
   * Returns the game setting for remove controls permission
   *
   * @returns {number} a number representing the chosen role
   */
  get removeControlsPermission() {
    return parseInt(
      game.settings.get(
        Constants.MODULE_ID,
        Settings.REMOVE_CONTROLS_PERMISSION
      )
    );
  }

  /**
   * Returns the game setting for the chat effect description
   *
   * @returns {string} a string representing the chosen chat effect description
   */
  get showChatMessageEffectDescription() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.SHOW_CHAT_MESSAGE_EFFECT_DESCRIPTION
    );
  }

  /**
   * Returns the game setting for showing nested effects
   *
   * @returns {boolean} true if nested effects should be shown
   */
  get showNestedEffects() {
    return game.settings.get(Constants.MODULE_ID, Settings.SHOW_NESTED_EFFECTS);
  }

  /**
   * Returns the game setting for the status effects sort order
   *
   * @returns {string} a string representing the chosen status effects sort order
   */
  get statusEffectsSortOrder() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.STATUS_EFFECTS_SORT_ORDER
    );
  }

  /**
   * Returns the game setting for the favorite effect names
   *
   * @returns {String[]} the names of all the favorite effects
   */
  get favoriteEffectNames() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.FAVORITE_EFFECT_NAMES
    );
  }

  /**
   * Adds a given effect name to the saved favorite settings
   *
   * @param {string} name - the name of the effect to add to favorites
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async addFavoriteEffect(name) {
    let favoriteEffectsArray = this.favoriteEffectNames;
    favoriteEffectsArray.push(name);

    favoriteEffectsArray = [...new Set(favoriteEffectsArray)]; // remove duplicates

    return game.settings.set(
      Constants.MODULE_ID,
      Settings.FAVORITE_EFFECT_NAMES,
      favoriteEffectsArray
    );
  }

  /**
   * Removes a given effect name from the saved favorite settings
   *
   * @param {string} name - the name of the effect to remove from favorites
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async removeFavoriteEffect(name) {
    let favoriteEffectsArray = this.favoriteEffectNames.filter(
      (favoriteEffect) => favoriteEffect !== name
    );
    return game.settings.set(
      Constants.MODULE_ID,
      Settings.FAVORITE_EFFECT_NAMES,
      favoriteEffectsArray
    );
  }

  /**
   * Checks if the given effect name is favorited
   *
   * @param {string} name - the effect name to search for
   * @returns {boolean} true if the effect is favorited, false otherwise
   */
  isFavoritedEffect(name) {
    return this.favoriteEffectNames.includes(name);
  }

  /**
   * Returns the game setting for the status effect names
   *
   * @returns {String[]} the names of all the status effects
   */
  get statusEffectNames() {
    return game.settings.get(Constants.MODULE_ID, Settings.STATUS_EFFECT_NAMES);
  }

  /**
   * Adds a given effect name to the saved status effect settings
   *
   * @param {string} name - the name of the effect to add to status effects
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async addStatusEffect(name) {
    let statusEffectsArray = this.statusEffectNames;
    statusEffectsArray.push(name);

    statusEffectsArray = [...new Set(statusEffectsArray)]; // remove duplicates

    return game.settings.set(
      Constants.MODULE_ID,
      Settings.STATUS_EFFECT_NAMES,
      statusEffectsArray
    );
  }

  /**
   * Removes a given effect name from the saved status effect settings
   *
   * @param {string} name - the name of the effect to remove from status effects
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async removeStatusEffect(name) {
    let statusEffectsArray = this.statusEffectNames.filter(
      (statusEffect) => statusEffect !== name
    );
    return game.settings.set(
      Constants.MODULE_ID,
      Settings.STATUS_EFFECT_NAMES,
      statusEffectsArray
    );
  }

  /**
   * Reset status effects back to the original defaults
   *
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async resetStatusEffects() {
    return game.settings.set(
      Constants.MODULE_ID,
      Settings.STATUS_EFFECT_NAMES,
      this._defaultStatusEffectNames
    );
  }

  /**
   * Checks if the given effect name is a status effect
   *
   * @param {string} name - the effect name to search for
   * @returns {boolean} true if the effect is a status effect, false otherwise
   */
  isStatusEffect(name) {
    return this.statusEffectNames.includes(name);
  }

  /**
   * Returns the game setting for the saved expanded folder names
   *
   * @returns {String[]} the IDs of all of the saved expanded folders
   */
  get expandedFolders() {
    return game.settings.get(Constants.MODULE_ID, Settings.EXPANDED_FOLDERS);
  }

  /**
   * Adds a given folder ID to the saved expanded folders
   *
   * @param {string} id - the ID of the folder to add to the saved expanded folders
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async addExpandedFolder(id) {
    let expandedFolderArray = this.expandedFolders;
    expandedFolderArray.push(id);

    expandedFolderArray = [...new Set(expandedFolderArray)]; // remove duplicates

    return game.settings.set(
      Constants.MODULE_ID,
      Settings.EXPANDED_FOLDERS,
      expandedFolderArray
    );
  }

  /**
   * Removes a given folder name from the saved expanded folders
   *
   * @param {string} id - the ID of the folder to remove from the saved expanded folders
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async removeExpandedFolder(id) {
    let expandedFolderArray = this.expandedFolders.filter(
      (expandedFolder) => expandedFolder !== id
    );
    return game.settings.set(
      Constants.MODULE_ID,
      Settings.EXPANDED_FOLDERS,
      expandedFolderArray
    );
  }

  /**
   * Removes all saved expanded folders
   *
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async clearExpandedFolders() {
    return game.settings.set(
      Constants.MODULE_ID,
      Settings.EXPANDED_FOLDERS,
      []
    );
  }

  /**
   * Checks if the given folder name is expanded
   *
   * @param {string} id - the folder ID to search for
   * @returns {boolean} true if the folder is in the saved expanded folders, false otherwise
   */
  isFolderExpanded(id) {
    return this.expandedFolders.includes(id);
  }

  /**
   * Returns the game setting for the custom effects item ID
   *
   * @returns {string} the ID of the custom effects item
   */
  get customEffectsItemId() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.CUSTOM_EFFECTS_ITEM_ID
    );
  }

  /**
   * Sets the custom effects item ID
   *
   * @param {string} id - the ID of the custom effects item
   * @returns {Promise} a promise that resolves when the settings update is complete
   */
  async setCustomEffectsItemId(id) {
    return game.settings.set(
      Constants.MODULE_ID,
      Settings.CUSTOM_EFFECTS_ITEM_ID,
      id
    );
  }

  _findCustomEffectsItem() {
    return game.items.get(this.customEffectsItemId);
  }
}
