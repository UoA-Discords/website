export interface Settings {
    /** Endpoint for the UoA Discords API. */
    serverUrl: string;
    rateLimitBypassToken?: string;

    discordClientId: string;

    redirectURI: string;
}
