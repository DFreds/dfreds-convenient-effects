import Constants from '../constants.js';
import Settings from '../settings.js';

export default class Migrations {
	constructor() {
		this._settings = new Settings();
	}
	/* Migrates the description of Custom Convenient Effects to use the ActiveEffect5e#description field instead of the legacy flags.
	 *
	 * @param {string} id - the ID of the custom effects item
	 * @returns {Promise} a promise that resolves when all the Item's ActiveEffects descriptions have migrated
	 */
	async _migrateCustomEffectsItemEffectDescriptions(id, migration) {
		const item = this._settings._findCustomEffectsItem(id);
		const updates = [];
		const effects = item.effects.filter((effect) =>
			effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.HAS_MIGRATED)
		);
		for (const effect of effects) {
			const effectDescription = effect.description;
			const flagDescription = effect.getFlag(
				Constants.MODULE_ID,
				Constants.FLAGS.DESCRIPTION
			);
			const legacyDescription =
				effect.flags.convenientDescription ??
				effect.flags.customEffectDescription;
			const description =
				!!effectDescription &&
				![
					'Applies Custom Effect',
					'Applies custom effects',
					'test',
				].some((d) => d === effectDescription)
					? effectDescription
					: !!flagDescription &&
					  ![
							'Applies Custom Effect',
							'Applies custom effects',
							'test',
					  ].some((d) => d === flagDescription)
					? flagDescription
					: !!legacyDescription &&
					  ![
							'Applies Custom Effect',
							'Applies custom effects',
							'test',
					  ].some((d) => d === legacyDescription)
					? legacyDescription
					: '';
			updates.push({
				_id: effect.id,
				description,
				[`flags.${Constants.MODULE_ID}.${Constants.FLAGS.IS_CONVENIENT}`]: true,
				[`flags.${Constants.MODULE_ID}.${Constants.FLAGS.HAS_MIGRATED}`]:
					migration,
				['flags.-=isConvenient']: null, //remove remnants flags
				['flags.-=isCustomConvenient']: null,
				['flags.-=convenientDescription']: null,
				['flags.-=customEffectDescription']: null,
				[`flags.${Constants.MODULE_ID}.-=${Constants.FLAGS.DESCRIPTION}`]: null,    //removes the 'flags.dfreds-convenient-effects.description'
			});
		}
        if (!updates.length) return true;
        ui.notifications.info(`${Constants.MODULE_NAME}: Migrating Custom Effects descriptions to post ${Constants.MIGRATION_EFFECTS_DESCRIPTIONS}`)
		const results = await item.updateEmbeddedDocuments(
			'ActiveEffect',
			updates
        );
        ui.notifications.info(`${Constants.MODULE_NAME}: Migration Complete!`)
		console.warn(
			`${Constants.MODULE_NAME} || Migrated Custom Effects (${
				Constants.MIGRATION_EFFECTS_DESCRIPTIONS
			}): || ${results.map((r) => r.name)}`
        );
        return results;    //not sure is that would be needed, or just true or return the console.warn above.
	}
}
