import { useState } from 'react';
import { BasicUserInfo } from '../../shared/Types/User';
import discordIcon from '../../images/discordIcon.svg';

const ProfilePicture = ({ user, width, height }: { user: BasicUserInfo; width?: number; height?: number }) => {
    const [avatar, setAvatar] = useState(user.avatar);

    if (avatar !== null) {
        return (
            <img
                width={width ?? 64}
                height={height ?? 64}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt={`${user.username}'s Discord profile`}
                style={{ borderRadius: `50%` }}
                onError={() => setAvatar(null)}
            />
        );
    }

    return (
        <img
            width={width ?? 64}
            height={height ?? 64}
            style={{ padding: `0.2em` }}
            src={discordIcon}
            alt="Discord logo"
        />
    );
};

export default ProfilePicture;
