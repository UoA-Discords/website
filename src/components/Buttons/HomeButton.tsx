import HomeIcon from '@mui/icons-material/Home';
import { Button, ButtonProps } from '@mui/material';
import { FC } from 'react';
import { InternalLink } from '../Links';

/** A button that internally links to the home page (`/`). */
export const HomeButton: FC<ButtonProps> = (props) => (
    <InternalLink to="/">
        <Button variant="outlined" startIcon={<HomeIcon />} {...props}>
            Home
        </Button>
    </InternalLink>
);
