export interface Settings {
    /**
     * Endpoint for the server registry API.
     * @default 'https://registry.uoa-discords.com'
     */
    serverUrl: string;

    /**
     * Rate limit bypass token for the server registry API.
     * @default ''
     */
    rateLimitBypassToken: string;

    /**
     * ID of Discord application to use in OAuth.
     * @default '958568584349618227'
     */
    discordApplicationId: string;

    /**
     * URI to redirect to after login attempt.
     * @default `${window.location.origin}/login`
     */
    redirectUri: string;

    /**
     * Will not try to refresh site token if it expires in less than this many seconds.
     * @default 30
     */
    minRefreshSeconds: number;

    /**
     * Will try to refresh site token if it expires in this many minutes or less.
     * @default 3 * 24 * 60 // 3 days
     */
    maxRefreshMinutes: number;

    /**
     * Whether all permissions will be shown in user profile pages, or just the important ones.
     *
     * @default false
     */
    showAllPermissions: boolean;

    /**
     * Maximum number of users to store in memory for ease-of-lookup.
     *
     * @default 100
     */
    maxUserDictionarySize: number;
}

export interface SettingsControllers {
    setValue<T extends keyof Settings>(key: T, value: Settings[T]): void;
    resetValue<T extends keyof Settings>(key: T): void;
}

export interface SettingsSessionData {
    state: string;
    oAuthLink: string;
}

export interface ISettingsContext {
    /** Configuration options for the website, these should be saved to {@link localStorage}. */
    settings: Settings;

    /** Functions for setting and resetting configuration options. */
    settingsControllers: SettingsControllers;

    /** Session-specific data for securely carrying out the Discord OAuth2 login process. */
    sessionData: SettingsSessionData;
}
