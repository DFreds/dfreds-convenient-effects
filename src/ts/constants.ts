import moduleData from "@static/module.json" assert { type: "json" };

export const MODULE_ID = moduleData.id;

export const DEBUG = false;

export const COLORS = {
    COLD_FIRE: "#389888",
    FIRE: "#f98026",
    WHITE: "#ffffff",
};

export const MODULE_IDS = {
    ATE: "ATL",
    MIDI: "midi-qol",
    TOKEN_MAGIC: "tokenmagic",
    STATUS_EFFECTS: "dfreds-status-effects",
};

export const SECONDS = {
    IN_ONE_ROUND_DND5E: 6,
    IN_ONE_MINUTE: 60,
    IN_TEN_MINUTES: 600,
    IN_ONE_HOUR: 3600,
    IN_SIX_HOURS: 21600,
    IN_EIGHT_HOURS: 28800,
    IN_ONE_DAY: 86400,
    IN_ONE_WEEK: 604800,
};

export const SIZES_ORDERED = ["tiny", "sm", "med", "lg", "huge", "grg"];
