export default class Helper {

  static LANG_EFFECT = {};

  static initLangEffect = function(){

  Helper.LANG_EFFECT.ButtonsSceneName = game.i18n.localize("dfreds-convenient-effects.ButtonsSceneName"),
  Helper.LANG_EFFECT.ButtonsSceneTitle = game.i18n.localize("dfreds-convenient-effects.ButtonsSceneTitle"),
  Helper.LANG_EFFECT.ButtonsSceneTitleDialog = game.i18n.localize("dfreds-convenient-effects.ButtonsSceneTitleDialog"),

  Helper.LANG_EFFECT.settingsShowForPlayersName = game.i18n.localize("dfreds-convenient-effects.settingsShowForPlayers-name"),
  Helper.LANG_EFFECT.settingsShowForPlayersHint = game.i18n.localize("dfreds-convenient-effects.settingsShowForPlayers-hint"),

  Helper.LANG_EFFECT.conditionAlmostdead = game.i18n.localize("dfreds-convenient-effects.conditionAlmostdead"),
  Helper.LANG_EFFECT.conditionBlinded = game.i18n.localize("dfreds-convenient-effects.conditionBlinded"),
  Helper.LANG_EFFECT.conditionCharmed = game.i18n.localize("dfreds-convenient-effects.conditionCharmed"),
  Helper.LANG_EFFECT.conditionConcentrating = game.i18n.localize("dfreds-convenient-effects.conditionConcentrating"),
  Helper.LANG_EFFECT.conditionDead = game.i18n.localize("dfreds-convenient-effects.conditionDead"),
  Helper.LANG_EFFECT.conditionDeafened = game.i18n.localize("dfreds-convenient-effects.conditionDeafened"),
  Helper.LANG_EFFECT.conditionDiseased = game.i18n.localize("dfreds-convenient-effects.conditionDiseased"),
  Helper.LANG_EFFECT.conditionExhausted1 = game.i18n.localize("dfreds-convenient-effects.conditionExhausted1"),
  Helper.LANG_EFFECT.conditionExhausted2 = game.i18n.localize("dfreds-convenient-effects.conditionExhausted2"),
  Helper.LANG_EFFECT.conditionExhausted3 = game.i18n.localize("dfreds-convenient-effects.conditionExhausted3"),
  Helper.LANG_EFFECT.conditionExhausted4 = game.i18n.localize("dfreds-convenient-effects.conditionExhausted4"),
  Helper.LANG_EFFECT.conditionExhausted5 = game.i18n.localize("dfreds-convenient-effects.conditionExhausted5"),
  Helper.LANG_EFFECT.conditionFrightened = game.i18n.localize("dfreds-convenient-effects.conditionFrightened"),
  Helper.LANG_EFFECT.conditionGrappled = game.i18n.localize("dfreds-convenient-effects.conditionGrappled"),
  Helper.LANG_EFFECT.conditionIncapacitated = game.i18n.localize("dfreds-convenient-effects.conditionIncapacitated"),
  Helper.LANG_EFFECT.conditionInvisible = game.i18n.localize("dfreds-convenient-effects.conditionInvisible"),
  Helper.LANG_EFFECT.conditionParalyzed = game.i18n.localize("dfreds-convenient-effects.conditionParalyzed"),
  Helper.LANG_EFFECT.conditionPetrified = game.i18n.localize("dfreds-convenient-effects.conditionPetrified"),
  Helper.LANG_EFFECT.conditionPoisoned = game.i18n.localize("dfreds-convenient-effects.conditionPoisoned"),
  Helper.LANG_EFFECT.conditionProne = game.i18n.localize("dfreds-convenient-effects.conditionProne"),
  Helper.LANG_EFFECT.conditionRestrained = game.i18n.localize("dfreds-convenient-effects.conditionRestrained"),
  Helper.LANG_EFFECT.conditionStunned = game.i18n.localize("dfreds-convenient-effects.conditionStunned"),
  Helper.LANG_EFFECT.conditionUnconscious = game.i18n.localize("dfreds-convenient-effects.conditionUnconscious"),
  Helper.LANG_EFFECT.conditionWounded = game.i18n.localize("dfreds-convenient-effects.conditionWounded"),

  Helper.LANG_EFFECT.featureFavouredEnemy = game.i18n.localize("dfreds-convenient-effects.featureFavouredEnemy"),
  Helper.LANG_EFFECT.featureGreaterFavouredEnemy = game.i18n.localize("dfreds-convenient-effects.featureGreaterFavouredEnemy"),
  Helper.LANG_EFFECT.featureRage = game.i18n.localize("dfreds-convenient-effects.featureRage"),
  Helper.LANG_EFFECT.featureRagePathOfTheTotemWarrior = game.i18n.localize("dfreds-convenient-effects.featureRagePathOfTheTotemWarrior"),

  Helper.LANG_EFFECT.spellAid = game.i18n.localize("dfreds-convenient-effects.spellAid"),
  Helper.LANG_EFFECT.spellBane = game.i18n.localize("dfreds-convenient-effects.spellBane"),
  Helper.LANG_EFFECT.spellBarkskin = game.i18n.localize("dfreds-convenient-effects.spellBarkskin"),
  Helper.LANG_EFFECT.spellBeaconOfHope = game.i18n.localize("dfreds-convenient-effects.spellBeaconOfHope"),
  Helper.LANG_EFFECT.spellBless = game.i18n.localize("dfreds-convenient-effects.spellBless"),
  Helper.LANG_EFFECT.spellDarkvision = game.i18n.localize("dfreds-convenient-effects.spellDarkvision"),
  Helper.LANG_EFFECT.spellEnlarge = game.i18n.localize("dfreds-convenient-effects.spellEnlarge"),
  Helper.LANG_EFFECT.spellFly = game.i18n.localize("dfreds-convenient-effects.spellFly"),
  Helper.LANG_EFFECT.spellFortunesFavor = game.i18n.localize("dfreds-convenient-effects.spellFortunesFavor"),
  Helper.LANG_EFFECT.spellGiftOfAlacrity = game.i18n.localize("dfreds-convenient-effects.spellGiftOfAlacrity"),
  Helper.LANG_EFFECT.spellGuidance = game.i18n.localize("dfreds-convenient-effects.spellGuidance"),
  Helper.LANG_EFFECT.spellHaste = game.i18n.localize("dfreds-convenient-effects.spellHaste"),
  Helper.LANG_EFFECT.spellHuntersMark1h = game.i18n.localize("dfreds-convenient-effects.spellHuntersMark1h"),
  Helper.LANG_EFFECT.spellHuntersMark8h = game.i18n.localize("dfreds-convenient-effects.spellHuntersMark8h"),
  Helper.LANG_EFFECT.spellHuntersMark24h = game.i18n.localize("dfreds-convenient-effects.spellHuntersMark24h"),
  Helper.LANG_EFFECT.spellLongstrider = game.i18n.localize("dfreds-convenient-effects.spellLongstrider"),
  Helper.LANG_EFFECT.spellMageArmor = game.i18n.localize("dfreds-convenient-effects.spellMageArmor"),
  Helper.LANG_EFFECT.spellPassWithoutTrace = game.i18n.localize("dfreds-convenient-effects.spellPassWithoutTrace"),

  Helper.LANG_EFFECT.spellReduce = game.i18n.localize("dfreds-convenient-effects.spellReduce"),
  Helper.LANG_EFFECT.spellShield = game.i18n.localize("dfreds-convenient-effects.spellShield"),
  Helper.LANG_EFFECT.spellShieldOfFaith = game.i18n.localize("dfreds-convenient-effects.spellShieldOfFaith"),
  Helper.LANG_EFFECT.spellSlow = game.i18n.localize("dfreds-convenient-effects.spellSlow"),
  
  Helper.LANG_EFFECT.featureSharpshooter = game.i18n.localize("dfreds-convenient-effects.featureSharpshooter"),
  Helper.LANG_EFFECT.featureGreatWeaponMaster = game.i18n.localize("dfreds-convenient-effects.featureGreatWeaponMaster"),

  Helper.LANG_EFFECT.visionDim0 = game.i18n.localize("dfreds-convenient-effects.visionDim0"),
  Helper.LANG_EFFECT.visionDim30 = game.i18n.localize("dfreds-convenient-effects.visionDim30"),
  Helper.LANG_EFFECT.visionDim60 = game.i18n.localize("dfreds-convenient-effects.visionDim60"),
  Helper.LANG_EFFECT.visionDim90 = game.i18n.localize("dfreds-convenient-effects.visionDim90"),
  Helper.LANG_EFFECT.visionDim120 = game.i18n.localize("dfreds-convenient-effects.visionDim120"),
  Helper.LANG_EFFECT.visionDim150 = game.i18n.localize("dfreds-convenient-effects.visionDim150"),
  Helper.LANG_EFFECT.visionDim180 = game.i18n.localize("dfreds-convenient-effects.visionDim180"),
  Helper.LANG_EFFECT.visionBright120 = game.i18n.localize("dfreds-convenient-effects.visionBright120"),

  Helper.LANG_EFFECT.lightNone = game.i18n.localize("dfreds-convenient-effects.lightNone"),
  Helper.LANG_EFFECT.lightCandle = game.i18n.localize("dfreds-convenient-effects.lightCandle"),
  Helper.LANG_EFFECT.lightLamp = game.i18n.localize("dfreds-convenient-effects.lightLamp"),
  Helper.LANG_EFFECT.lightBullseye = game.i18n.localize("dfreds-convenient-effects.lightBullseye"),
  Helper.LANG_EFFECT.lightHoodedDim = game.i18n.localize("dfreds-convenient-effects.lightHoodedDim"),
  Helper.LANG_EFFECT.lightHoodedBright = game.i18n.localize("dfreds-convenient-effects.lightHoodedBright"),
  Helper.LANG_EFFECT.lightLight = game.i18n.localize("dfreds-convenient-effects.lightLight"),
  Helper.LANG_EFFECT.lightTorch = game.i18n.localize("dfreds-convenient-effects.lightTorch"),
  Helper.LANG_EFFECT.lightMoonTouched = game.i18n.localize("dfreds-convenient-effects.lightMoonTouched");

  }
}
