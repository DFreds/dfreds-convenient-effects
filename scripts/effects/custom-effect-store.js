export default class CustomEffectStore {
  static inProgressEffects = {};

  static addInProgressEffect(itemId, activeEffect) {
    if (CustomEffectStore.inProgressEffects[itemId]) {
      console.log('updating in progress');
      CustomEffectStore.inProgressEffects[itemId].effect = activeEffect;
    } else {
      console.log('adding in progress');
      CustomEffectStore.inProgressEffects[itemId] = { effect: activeEffect };
    }
  }

  static deleteInProgressEffect(itemId) {
    console.log('deleting');
    delete CustomEffectStore.inProgressEffects[itemId];
  }

  static setAsCreate(itemId) {
    if (CustomEffectStore.inProgressEffects[itemId]) {
      console.log('updating creation to true');
      CustomEffectStore.inProgressEffects[itemId].create = true;
    } else {
      console.log('adding creation to true');
      CustomEffectStore.inProgressEffects[itemId] = { create: true };
    }
  }

  static isCreate(itemId) {
    return CustomEffectStore.inProgressEffects[itemId]?.create;
  }

  static createCustomEffect(itemId) {
    console.log('creating effect');
    console.log(CustomEffectStore.inProgressEffects[itemId]);
  }
}
