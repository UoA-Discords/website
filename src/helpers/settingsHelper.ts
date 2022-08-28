import { Settings } from '../types/Settings';

const KEY = `uoaDiscordsSiteSettings`;

export function defaultSettings(): Settings {
    return {
        serverUrl:
            window.location.host === `localhost:3000`
                ? `http://localhost:3001`
                : window.location.host === `ntgc.ddns.net:3000`
                ? `http://ntgc.ddns.net:3001`
                : `https://api.uoa-discords.com`,
        discordClientId: `958568584349618227`,
        redirectURI: window.location.origin + `/login`,
    };
}

export function getLocalSettings(): Settings {
    const existing = localStorage.getItem(KEY);
    if (existing !== null) return JSON.parse(existing) as Settings;
    return defaultSettings();
}

export function saveLocalSettings(s: Settings): void {
    localStorage.setItem(KEY, JSON.stringify(s));
}
