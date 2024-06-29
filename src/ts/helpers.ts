/**
 * Gets all UUIDs for selected or targeted tokens
 *
 * @param isPrioritizeTargets If true, will grab actor UUIDs by target instead of by controlled
 * @returns list of actor UUIDs for selected or targeted tokens
 */
function getActorUuids(isPrioritizeTargets: boolean): ActorUUID[] {
    if (isPrioritizeTargets && game.user.targets.size !== 0) {
        // Start with targets if prioritized
        return Array.from(game.user.targets).map(
            (target) => target.actor!.uuid,
        );
    } else if (canvas.tokens.controlled.length !== 0) {
        // Use controlled tokens if targets aren't prioritized
        return canvas.tokens.controlled.map((token) => token.actor!.uuid);
    } else if (game.user.targets.size !== 0) {
        // Use targets if not prioritized and no controlled tokens
        return Array.from(game.user.targets).map((token) => token.actor!.uuid);
    } else if (game.user.character) {
        // Use the default character for the user
        return [game.user.character.uuid];
    } else {
        return [];
    }
}

/**
 * Gets the actor object by the actor UUID
 *
 * @param uuid The actor UUID
 * @returns the actor that was found via the UUID or undefined if not found
 */
function getActorByUuid(
    uuid: string,
): Actor<TokenDocument<any> | null> | undefined {
    const actorToken = fromUuidSync(uuid);

    const actor = game.actors.find((actor) => actor.uuid === uuid);

    if (!actorToken) return undefined;

    if (actorToken instanceof TokenDocument) {
        return actorToken.actor ?? undefined;
    } else if (actorToken instanceof Actor) {
        return actorToken;
    }

    return undefined;
}
/**
 * Re-renders the Convenient Effects application if it's open
 */
function renderConvenientEffectsAppIfOpen(): void {
    const openApps = Object.values(ui.windows);
    const ceApp = openApps.find((app) => app instanceof ConvenientEffectsApp);

    if (ceApp) {
        ceApp.render();
    }
}

export { getActorUuids, getActorByUuid, renderConvenientEffectsAppIfOpen };
