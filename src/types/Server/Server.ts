import { APIUser, GuildVerificationLevel } from 'discord-api-types/v10';
import { DiscordIdString, ISOString } from '../Utility';
import { ServerChangeRecord } from './ServerChangeRecord';
import { ServerStatus } from './ServerStatus';
import { ServerTags } from './ServerTags';

/** A Discord server in our database. */
export interface Server {
    /** This is underscored to show that it is used as a document index in MongoDB. */
    _id: DiscordIdString;

    status: ServerStatus;

    /**
     * The accompanying invite code this server was registered with, without the `discord.gg/` prefix.
     *
     * Note that it may no longer be valid, in which case it should be withdrawn.
     */
    inviteCode: string;

    /** The {@link APIUser user} who created this invite. */
    inviteCreatedBy: Pick<APIUser, 'id' | 'username' | 'discriminator' | 'avatar'>;

    guildData: {
        name: string;

        icon: string | null;

        splash: string | null;

        banner: string | null;

        description: string | null;

        verificationLevel: GuildVerificationLevel;
    };

    created: {
        by: DiscordIdString;

        at: ISOString;
    };

    serverTags: ServerTags;

    /** Ordered from newest to oldest. */
    statusLog: ServerChangeRecord[];

    /** Approximate values of the server's online and total member count. */
    size: {
        online: number;
        total: number;
        lastUpdated: ISOString;
    };

    /** Number of users who have favourited this server. */
    numFavourited: number;
}
