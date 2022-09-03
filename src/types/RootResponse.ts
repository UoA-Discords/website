import { GuildVerificationLevel } from 'discord-api-types/payloads/v10/guild';

/** Shape of object returned by root of API (e.g. `GET https://api.uoa-discords.com/`). */
export interface RootResponse {
    version: string;
    startedAt: string;
    entryStats: {
        pending: number;
        approved: number;
        featured: number;
        denied: number;
        optOut: number;
    };
    users: number;
    applyRequirements: {
        memberCount: number;
        verificationLevel: GuildVerificationLevel;
    };
}
