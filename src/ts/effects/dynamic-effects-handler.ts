import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { Settings } from "../settings.ts";

abstract class DynamicEffectsHandler {
    protected settings: Settings;

    abstract systemId: string;

    constructor() {
        this.settings = new Settings();
    }

    abstract handleDynamicEffects(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
    ): Promise<void> | void;
}

export { DynamicEffectsHandler };
