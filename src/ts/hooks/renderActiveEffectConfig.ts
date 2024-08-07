import { ConvenientEffectConfig } from "../ui/convenient-effect-config.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

const RenderActiveEffectConfig: Listener = {
    listen(): void {
        Hooks.on(
            "renderActiveEffectConfig",
            (activeEffectConfig: any, html: any, configData) => {
                const config = activeEffectConfig as ActiveEffectConfig<any>;
                const $html = html as JQuery;

                const activeEffect = config.document as ActiveEffect<any>;
                if (!Flags.isConvenient(activeEffect)) return;

                const parent = activeEffect.parent;

                if (parent instanceof Item && Flags.isConvenient(parent)) {
                    ConvenientEffectConfig.init(
                        activeEffectConfig,
                        $html,
                        configData,
                    );
                }
            },
        );
    },
};

export { RenderActiveEffectConfig };
