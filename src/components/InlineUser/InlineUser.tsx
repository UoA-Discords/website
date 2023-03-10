import { Link, LinkProps, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { AnyDiscordUserReference, useDiscordUserData } from '../../hooks/useDiscordUserData';
import { InternalLink } from '../Links';
import { ProfilePicture } from '../ProfilePicture';

export interface InlineUserProps extends LinkProps {
    user: AnyDiscordUserReference;
}

const _InlineUser: FC<InlineUserProps> = ({ user, ...rest }) => {
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

export const InlineUser = memo(_InlineUser);
