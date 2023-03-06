import React, { useContext, useMemo, useState } from 'react';
import { APIUser } from 'discord-api-types/v10';
import { DiscordIcon } from '../../images';
import { UserSessionContext } from '../../contexts';
import { ProfilePictureProps } from './ProfilePictureProps';

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ type, user, size = 64, style }) => {
    const { loggedInUser } = useContext(UserSessionContext);

    const [errored, setErrored] = useState(false);

    const { id, avatar, username } = useMemo<Pick<APIUser, 'id' | 'username' | 'discriminator' | 'avatar'>>(() => {
        if (type === 'full') return { id: user._id, ...user.discord };
        return user;
    }, [type, user]);

    const isSelf = useMemo(() => loggedInUser?.user._id === id, [id, loggedInUser?.user._id]);

    if (avatar !== null && !errored) {
        return (
            <img
                width={size}
                height={size}
                src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`}
                alt={isSelf ? 'Your Discord profile' : `Discord profile of ${username}`}
                style={{ borderRadius: '50%', ...style }}
                loading="lazy"
                onError={(e) => {
                    e.preventDefault();
                    setErrored(true);
                }}
            />
        );
    }

    return <DiscordIcon width={size} height={size} style={style} fill={style?.color ?? 'white'} />;
};
