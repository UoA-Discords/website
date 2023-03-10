import { Link } from '@mui/material';
import { FC } from 'react';
import { ExternalLink, ExternalLinkProps } from './ExternalLink';

export const ExternalLinkStyled: FC<ExternalLinkProps> = ({ children, ...props }) => (
    <ExternalLink {...props}>
        <Link component="span" underline="hover">
            {children}
        </Link>
    </ExternalLink>
);
