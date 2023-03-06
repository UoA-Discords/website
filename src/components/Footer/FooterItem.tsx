import React from 'react';
import { Grid, Link } from '@mui/material';
import { ExternalLink, InternalLink } from '../Links';
import { FooterItemProps } from './FooterItemProps';

const _FooterItem: React.FC<FooterItemProps> = (props) => {
    const { type, href, icon, label } = props;

    return (
        <Grid item xs={6} sm={3} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {type === 'external' ? (
                <ExternalLink
                    href={href}
                    style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', justifyContent: 'center' }}
                    title={props.title}
                    {...props.additionalLinkProps}
                >
                    {icon}&nbsp;
                    <Link underline="hover" color="gray" component="span">
                        {label}
                    </Link>
                </ExternalLink>
            ) : (
                <InternalLink
                    to={href}
                    style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                    {icon}&nbsp;
                    <Link underline="hover" color="gray" component="span">
                        {label}
                    </Link>
                </InternalLink>
            )}
        </Grid>
    );
};

export const FooterItem = React.memo(_FooterItem);
