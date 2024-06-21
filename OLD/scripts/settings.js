import Constants from './constants.js';

/**
 * Handle setting and fetching all settings in the module
 */
export default class Settings {
  // Config setting keys
  static ALLOW_PLAYER_CUSTOM_EFFECTS = 'allowPlayerCustomEffects';
  static APP_CONTROLS_PERMISSION = 'controlsPermission';
  static CHAT_MESSAGE_PERMISSION = 'chatMessagePermission';
  static INTEGRATE_WITH_ATE = 'integrateWithAtl';
  static INTEGRATE_WITH_TOKEN_MAGIC = 'integrateWithTokenMagic';
  static MODIFY_STATUS_EFFECTS = 'modifyStatusEffects';
  static PRIORITIZE_TARGETS = 'prioritizeTargets';
  static SEND_CHAT_TO_ACTOR_OWNER = 'sendChatToActorOwner';
  static SHOW_CHAT_MESSAGE_EFFECT_DESCRIPTION = 'chatMessageEffectDescription';
  static SHOW_NESTED_EFFECTS = 'showNestedEffects';
  static STATUS_EFFECTS_SORT_ORDER = 'statusEffectsSortOrder';
  static ADD_CHAT_BUTTON = 'addChatButton';

  // Non-config setting keys
  static CUSTOM_EFFECTS_ITEM_ID = 'customEffectsItemId';
  static EXPANDED_FOLDERS = 'expandedFolders';
  static FAVORITE_EFFECT_NAMES = 'favoriteEffectNames';
  static STATUS_EFFECT_NAMES = 'statusEffectNames';

  /**
   * Register all the settings for the module
   */
  registerSettings() {
    this._registerConfigSettings();
    this._registerNonConfigSettings();
  }

  _registerConfigSettings() {
    const userRoles = {};
    userRoles[CONST.USER_ROLES.PLAYER] = 'Player';
    userRoles[CONST.USER_ROLES.TRUSTED] = 'Trusted Player';
    userRoles[CONST.USER_ROLES.ASSISTANT] = 'Assistant GM';
    userRoles[CONST.USER_ROLES.GAMEMASTER] = 'Game Master';
    userRoles[5] = 'None';

    game.settings.register(
      Constants.MODULE_ID,
      Settings.APP_CONTROLS_PERMISSION,
      {
        name: 'App Controls Permission',
        hint: 'This defines the minimum permission level to see and apply Convenient Effects through the application via the button on token controls. Setting this to None will disable the button entirely.',
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
        name: 'Modify Status Effects',
        hint: 'This is how status effects on the token HUD will be modified. Replacing them means all other status effects will be removed in favor of the conditions provided by Convenient Effects. Adding them means they are appended to the end of the existing status effects. Requires a Foundry reload on change.',
        scope: 'world',
        config: true,
        default: 'none',
        choices: {
          none: 'None',
          replace: 'Replace',
          add: 'Add',
        },
        type: String,
        requiresReload: true,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.STATUS_EFFECTS_SORT_ORDER,
      {
        name: 'Status Effects Sort Order',
        hint: 'This is how status effects are sorted in the token HUD. Requires a Foundry reload on change.',
        scope: 'world',
        config: true,
        default: 'none',
        choices: {
          byOrderAdded: 'By Order Added',
          alphabetical: 'Alphabetical',
        },
        type: String,
        requiresReload: true,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.CHAT_MESSAGE_PERMISSION,
      {
        name: 'Chat Message Permission',
        hint: 'This defines the minimum permission level to see chat messages when effects are applied, removed, or expire. Setting this to None will never show chat messages.',
        scope: 'world',
        config: true,
        default: CONST.USER_ROLES.GAMEMASTER,
        choices: userRoles,
        type: String,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.SHOW_CHAT_MESSAGE_EFFECT_DESCRIPTION,
      {
        name: 'Show Chat Message Effect Description',
        hint: 'This is when effect descriptions are shown on chat messages.',
        scope: 'world',
        config: true,
        default: 'onAddOrRemove',
        choices: {
          onAddOrRemove: 'On Add or Remove',
          onAddOnly: 'On Add Only',
          never: 'Never',
        },
        type: String,
      }
    );

    game.settings.register(
      Constants.MODULE_ID,
      Settings.SEND_CHAT_TO_ACTOR_OWNER,
      {
        name: 'Send Chat to Actor Owner',
        hint: 'If enabled, this will also send effect chat messages to the users that own the affected actor.',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
      }
    );

    game.settings.register(Constants.MODULE_ID, Settings.ADD_CHAT_BUTTON, {
      name: 'Add Button to Chat',
      hint: 'If enabled, add a button to item chat cards to add the matching convenient effect by name.',
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    game.settings.register(
      Constants.MODULE_ID,
      Settings.ALLOW_PLAYER_CUSTOM_EFFECTS,
      {
        name: 'Allow Player Custom Effects',
        hint: 'If enabled, players will be allowed to create, duplicate, edit, and delete all custom effects.',
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
      name: 'Integrate with ATE',
      hint: 'If enabled, certain effects will also change light emitted from tokens or the size of a token via Active Token Effects.',
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    game.settings.register(
      Constants.MODULE_ID,
      Settings.INTEGRATE_WITH_TOKEN_MAGIC,
      {
        name: 'Integrate with Token Magic',
        hint: 'If enabled, certain effects will also apply a token magic filter to tokens via Token Magic.',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
      }
    );

    game.settings.register(Constants.MODULE_ID, Settings.PRIORITIZE_TARGETS, {
      name: 'Prioritize Targets',
      hint: 'If enabled, effects will be applied to any targeted tokens instead of selected tokens.',
      scope: 'client',
      config: true,
      default: false,
      type: Boolean,
    });

    game.settings.register(Constants.MODULE_ID, Settings.SHOW_NESTED_EFFECTS, {
      name: 'Show Nested Effects',
      hint: 'If enabled, nested effects will be shown in the application.',
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
        name: 'Favorite Effect Names',
        scope: 'client',
        config: false,
        default: '',
        type: Array,
      }
    );

    game.settings.register(Constants.MODULE_ID, Settings.STATUS_EFFECT_NAMES, {
      name: 'Status Effect Names',
      scope: 'world',
      config: false,
      default: this._defaultStatusEffectNames,
      type: Array,
    });

    game.settings.register(Constants.MODULE_ID, Settings.EXPANDED_FOLDERS, {
      name: 'Expanded Folders',
      scope: 'client',
      config: false,
      default: 'Favorites',
      type: Array,
    });

    game.settings.register(
      Constants.MODULE_ID,
      Settings.CUSTOM_EFFECTS_ITEM_ID,
      {
        name: 'Custom Effects Item ID',
        scope: 'world',
        config: false,
        default: '',
        type: String,
      }
    );
  }

  get _defaultStatusEffectNames() {
    return [
      'Blinded',
      'Charmed',
      'Concentrating',
      'Dead',
      'Deafened',
      'Exhaustion 1',
      'Exhaustion 2',
      'Exhaustion 3',
      'Exhaustion 4',
      'Exhaustion 5',
      'Frightened',
      'Grappled',
      'Incapacitated',
      'Invisible',
      'Paralyzed',
      'Petrified',
      'Poisoned',
      'Prone',
      'Restrained',
      'Stunned',
      'Unconscious',
      'Wounded',
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
   * Returns the game setting for sending chats to the owner of the actor
   *
   * @returns {boolean} true if chat messages are sent to the owner of the actor
   */
  get sendChatToActorOwner() {
    return game.settings.get(
      Constants.MODULE_ID,
      Settings.SEND_CHAT_TO_ACTOR_OWNER
    );
  }

  /**
   * Returns the game setting for adding a button to chat messages to apply the
   * matching convenient effect.
   *
   * @returns {boolean} true if the button should be added
   */
  get addChatButton() {
    return game.settings.get(Constants.MODULE_ID, Settings.ADD_CHAT_BUTTON);
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
