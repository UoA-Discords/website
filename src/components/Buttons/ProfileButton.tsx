import React from 'react';
import { Button } from '@mui/material';
import { User } from '../../types/User';
import { InternalLink } from '../Links';
import { ProfilePicture } from '../ProfilePicture';

export const ProfileButton: React.FC<{ user: User<'ShowIP'> }> = ({ user }) => (
    <InternalLink to="/me">
        <Button variant="outlined" startIcon={<ProfilePicture user={user} />}>
            Profile
        </Button>
    </InternalLink>
);
