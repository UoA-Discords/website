import { ReactNode } from 'react';
import { ExternalLinkProps } from '../Links';

interface FooterItemPropsBase {
    type: 'external' | 'internal';
    href: string;
    icon: ReactNode;
    label: string;
}

interface FooterItemPropsExternal extends FooterItemPropsBase {
    type: 'external';
    title: string;
    additionalLinkProps?: Partial<ExternalLinkProps>;
}

interface FooterItemPropsInternal extends FooterItemPropsBase {
    type: 'internal';
}

export type FooterItemProps = FooterItemPropsExternal | FooterItemPropsInternal;
