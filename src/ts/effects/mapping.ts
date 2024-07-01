import { DND5E_EFFECTS } from "./dnd5e.ts";

const EFFECTS_MAP: Record<string, Record<number, ActiveEffect<null>[]>> = {
    dnd5e: DND5E_EFFECTS,
    sw5e: DND5E_EFFECTS,
};

export { EFFECTS_MAP };
