import React from 'react';
import { Link, LinkProps, Typography } from '@mui/material';
import { InternalLink } from '../Links';
import { ProfilePicture } from '../ProfilePicture';
import { AnyDiscordUserReference, useDiscordUserData } from '../../hooks/useDiscordUserData';

export interface InlineUserProps extends LinkProps {
    user: AnyDiscordUserReference;
}

const _InlineUser: React.FC<InlineUserProps> = ({ user, ...rest }) => {
    const { id, username, discriminator } = useDiscordUserData(user);

    return (
        <InternalLink
            to={`/users/${id}`}
            title={username === null ? 'User could not be found' : `${username}'s profile`}
            style={{ display: 'inline-block' }}
        >
            <Typography style={{ display: 'flex', alignItems: 'center' }} whiteSpace="nowrap" component="span">
                <ProfilePicture user={user} size={24} />
                &nbsp;
                <Link underline="hover" component="span" {...rest}>
                    {username === null ? id : `${username}#${discriminator}`}
                </Link>
            </Typography>
        </InternalLink>
    );
};

export const InlineUser = React.memo(_InlineUser);
