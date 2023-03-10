import { DiscordIdString, ISOString } from '../Utility';
import { ServerStatusAction } from './ServerStatusAction';

/** Information about a change in status of a server. */
export interface ServerChangeRecord {
    verb: ServerStatusAction;

    by: DiscordIdString;

    at: ISOString;

    reason: string | null;
}
