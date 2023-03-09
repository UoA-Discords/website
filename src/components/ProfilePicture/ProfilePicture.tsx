import React, { useContext, useMemo, useState } from 'react';
import { DiscordIcon } from '../../images';
import { UserSessionContext } from '../../contexts';
import { AnyDiscordUserReference, useDiscordUserData } from '../../hooks/useDiscordUserData';

export interface ProfilePictureProps {
    size?: number;
    style?: React.CSSProperties;
    user: AnyDiscordUserReference;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, size = 64, style }) => {
    const { loggedInUser } = useContext(UserSessionContext);

    const [errored, setErrored] = useState(false);

    const { id, username, avatar } = useDiscordUserData(user);

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
