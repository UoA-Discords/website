import { ReactNode } from 'react';

export interface ILocationDataContext {
    title: ReactNode;
    description: string | { text: string; to: string }[];
    setLocationData(title: ReactNode, description: string | { text: string; to: string }[]): void;
}
