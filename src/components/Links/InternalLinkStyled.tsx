import { Link } from '@mui/material';
import { FC } from 'react';
import { LinkProps } from 'react-router-dom';
import { InternalLink } from './InternalLink';

export const InternalLinkStyled: FC<LinkProps> = ({ children, ...props }) => (
    <InternalLink {...props}>
        <Link component="span" underline="hover">
            {children}
        </Link>
    </InternalLink>
);
