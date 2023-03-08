import { ReactNode } from 'react';

export interface ILocationDataContext {
    /** Title to show in header. */
    title: ReactNode;

    /** Subtitle or breadcrumbs to show in header. */
    description: string | { text: string; to: string }[];

    /** Updates the title and description of the header. */
    setLocationData(title: ReactNode, description: string | { text: string; to: string }[]): void;
}
