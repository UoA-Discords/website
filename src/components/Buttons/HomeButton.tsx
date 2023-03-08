import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { InternalLink } from '../Links';

import HomeIcon from '@mui/icons-material/Home';

export const HomeButton: React.FC<ButtonProps> = (props) => (
    <InternalLink to="/">
        <Button variant="outlined" startIcon={<HomeIcon />} {...props}>
            Home
        </Button>
    </InternalLink>
);
