export default class I18nHelperEffects {


  constructor() {
    // If midi-qol module is present and active
    this.useMidiQol = game.modules.get('midi-qol')?.active;
    // If combat-utility-belt module is present and active
    this.useCombatUtilityBelt = game.modules.get('combat-utility-belt')?.active && game.cub;
  }

  i18nFormatFromKey(key, data = {}){
    const label = game.i18n.format(key, data);
    return prepareI18n(label);
  }

  i18nFromKey(key){
    const label = game.i18n.localize(key);
    return prepareI18n(label);
  }

  i18nFromEffect(effect){
    const label = game.i18n.localize(effect.customId ? effect.customId : effect.name);
    return prepareI18n(label);
  }

  i18nFormatFromEffect(effect, data = {}){
    const label = game.i18n.format((effect.customId ? effect.customId : effect.name), data);
    return prepareI18n(label);
  }

  prepareI18n(label){

    // Priority to cub because midi-qol do that

    if(this.useCombatUtilityBelt){
      // TODO manage other stuff here or we can remove this ?
      const concentrationName = game.i18n.localize(game.settings.get('combat-utility-belt', 'concentratorConditionName'));
      if(label === concentrationName){
        return concentrationName;
      }
    }
    if(this.useMidiQol){
      // TODO manage other stuff here or we can remove this ?
      const concentrationName = game.i18n.localize('midi-qol.Concentrating');
      if(label === concentrationName){
        return concentrationName;
      }
    }

    // this is the label property of the Effect class,
    // the name property should be enough to synchronize with midi and cub
    return label;

  }
}
