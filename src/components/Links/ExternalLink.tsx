import { CSSProperties, FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';

export interface ExternalLinkProps {
    href: string;
    title?: string;
    target?: HTMLAttributeAnchorTarget;
    style?: CSSProperties;
    children: ReactNode;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, title, target, style, children }) => (
    <a
        rel="noopener noreferrer"
        href={href}
        title={title}
        target={target ?? '_blank'}
        style={{ color: 'inherit', textDecoration: 'inherit', ...style }}
    >
        {children}
    </a>
);
