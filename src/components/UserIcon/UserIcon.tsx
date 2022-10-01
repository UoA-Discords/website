import React, { useState } from 'react';
import { BasicUserInfo } from '../../shared/Types/User';
import discordIcon from '../../images/discordIcon.svg';

const UserIcon = ({
    user,
    width,
    height,
    style,
}: {
    user: BasicUserInfo;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}) => {
    const [avatar, setAvatar] = useState(user.avatar);

    if (avatar !== null) {
        return (
            <img
                width={width ?? 64}
                height={height ?? 64}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt={`${user.username}'s Discord profile`}
                style={{ borderRadius: `50%`, ...style }}
                onError={() => setAvatar(null)}
            />
        );
    }

    return (
        <img
            width={width ?? 64}
            height={height ?? 64}
            style={{ padding: `0.2em`, ...style }}
            src={discordIcon}
            alt="Discord logo"
        />
    );
};

export default UserIcon;
