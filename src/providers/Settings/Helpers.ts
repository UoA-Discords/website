import { Settings, defaultSettings, SettingsSessionData } from '../../contexts';

const KEY_SETTINGS = 'UOA_DISCORDS.Settings';
const KEY_SETTINGS_STATE = 'UOA_DISCORDS.Settings.State';

/**
 * Retrieves existing settings values (if they exist) from {@link localStorage}.
 *
 * If a value doesn't exist, the {@link defaultSettings default value} is used as a fallback.
 */
export function getLocalSettings(): Settings {
    const existing = localStorage.getItem(KEY_SETTINGS);

    if (existing === null) return { ...defaultSettings };

    return { ...defaultSettings, ...JSON.parse(existing) };
}

/** Saves all the current settings values to {@link localStorage}. */
export function saveLocalSettings(s: Settings): void {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(s));
}

/**
 * Retrieves the current sessions random state from {@link sessionStorage}.
 *
 * If a random state doesn't exist, a new one is generated and saved to {@link sessionStorage}.
 */
export function generateSessionData(discordApplicationId: string, redirectUri: string): SettingsSessionData {
    let state = sessionStorage.getItem(KEY_SETTINGS_STATE);

    if (state === null) {
        // generate new pseudorandom state
        // not cryptographically secure, but better than nothing
        state = new Array(32)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
        sessionStorage.setItem(KEY_SETTINGS_STATE, state);
    }

    const linkParams = new URLSearchParams([
        ['response_type', 'code'],
        ['client_id', discordApplicationId],
        ['state', state],
        ['redirect_uri', redirectUri],
        ['prompt', 'consent'],
        ['scope', 'identify'],
    ]);

    const oAuthLink = `https://discord.com/api/v10/oauth2/authorize?${linkParams.toString()}`;

    return { state, oAuthLink };
}
