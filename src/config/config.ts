function getServerLocation() {
    switch (window.location.host) {
        case `localhost:3000`:
            return `localhost:3001`;
        case `ntgc.ddns.net:5001`:
            return `ntgc.ddns.net:5000`;
        case `uoa-discords.com`:
            return `api.uoa-discords.com`;
        default:
            return `${window.location.host}`;
    }
}

export const config = {
    /** Endpoint for the UoA Discords API. */
    serverUrl: `${window.location.protocol}//${getServerLocation()}`,

    discordClientID: `958568584349618227`,
    redirectURI: `${window.location.origin}/login`,
};
