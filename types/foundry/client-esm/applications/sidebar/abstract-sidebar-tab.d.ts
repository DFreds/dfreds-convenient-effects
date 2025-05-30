import type {
    ApplicationConfiguration,
    ApplicationRenderOptions,
} from "../_types.d.ts";
import type ApplicationV2 from "../api/application.js";

export default abstract class AbstractSidebarTab<
    TConfig extends ApplicationConfiguration = ApplicationConfiguration,
    TRenderOptions extends ApplicationRenderOptions = ApplicationRenderOptions,
> extends ApplicationV2<TConfig, TRenderOptions> {
    static tabName: string;

    get active(): boolean;

    get isPopout(): boolean;

    get popout(): AbstractSidebarTab | void;

    get tabName(): string;

    activate(): void;

    renderPopout(): Promise<AbstractSidebarTab>;

    _onActivate(): void;

    _onDeactivate(): void;
}
