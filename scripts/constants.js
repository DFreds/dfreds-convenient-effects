/**
 * Contains any constants for the application
 */
export default class Constants {
  static MODULE_ID = 'dfreds-convenient-effects';
  static FLAGS = {
    DESCRIPTION: 'description',
    IS_CONVENIENT: 'isConvenient',
    IS_DYNAMIC: 'isDynamic',
    IS_VIEWABLE: 'isViewable',
    NESTED_EFFECTS: 'nestedEffects',
    SUB_EFFECTS: 'subEffects',
  };

  static COLORS = {
    COLD_FIRE: '#389888',
    FIRE: '#f98026',
    WHITE: '#ffffff',
  };

  static SECONDS = {
    IN_ONE_MINUTE: 60,
    IN_TEN_MINUTES: 600,
    IN_ONE_HOUR: 3600,
    IN_SIX_HOURS: 21600,
    IN_EIGHT_HOURS: 28800,
    IN_ONE_DAY: 86400,
    IN_ONE_WEEK: 604800,
  };

  static SIZES_ORDERED = ['tiny', 'sm', 'med', 'lg', 'huge', 'grg'];
}
