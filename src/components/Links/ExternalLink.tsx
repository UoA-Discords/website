import React, { ReactNode } from 'react';

export interface ExternalLinkProps {
    href: string;
    title: string;
    target?: React.HTMLAttributeAnchorTarget;
    style?: React.CSSProperties;
    children: ReactNode;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ href, title, target, style, children }) => (
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
