import { Button } from '@mui/material';
import { FC } from 'react';
import { User } from '../../types/User';
import { InternalLink } from '../Links';
import { ProfilePicture } from '../ProfilePicture';

/** A button that internally links to the profile page of the currently logged in user (`/users/:id`). */
export const ProfileButton: FC<{ user: User<'ShowIP'> }> = ({ user }) => (
    <InternalLink to="/me">
        <Button variant="outlined" startIcon={<ProfilePicture user={user} />}>
            Profile
        </Button>
    </InternalLink>
);
