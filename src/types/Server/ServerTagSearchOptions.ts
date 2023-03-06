import { ServerTags } from './ServerTags';

/** Shape of searches for servers with only certain tags. */
export interface ServerTagSearchOptions {
    tags: ServerTags;
    /** Whether to return servers that have any of the provided tags ('or'), or all of the provided tags ('and'). */
    type: 'or' | 'and';
}
