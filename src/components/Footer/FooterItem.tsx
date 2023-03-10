import { Grid, Link } from '@mui/material';
import { CSSProperties, FC, memo, ReactNode } from 'react';
import { ExternalLink, ExternalLinkProps, InternalLink } from '../Links';

export interface FooterItemProps<T extends 'external' | 'internal' = 'external' | 'internal'> {
    type: T;
    href: string;
    icon: ReactNode;
    label: string;
    additionalLinkProps?: T extends 'external' ? Partial<ExternalLinkProps> : undefined;
}

const footerItemStyles: CSSProperties = {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    justifyContent: 'center',
};

const _FooterItem: FC<FooterItemProps> = (props) => {
    const { type, href, icon, label, additionalLinkProps } = props;

    return (
        <Grid item xs={6} sm={3} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {type === 'external' ? (
                <ExternalLink href={href} style={footerItemStyles} {...additionalLinkProps}>
                    {icon}&nbsp;
                    <Link underline="hover" color="gray" component="span">
                        {label}
                    </Link>
                </ExternalLink>
            ) : (
                <InternalLink to={href} style={footerItemStyles}>
                    {icon}&nbsp;
                    <Link underline="hover" color="gray" component="span">
                        {label}
                    </Link>
                </InternalLink>
            )}
        </Grid>
    );
};

export const FooterItem = memo(_FooterItem);
