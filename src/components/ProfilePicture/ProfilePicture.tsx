import React from 'react';
import { BasicUserInfo } from '../../shared/Types/User';
import discordIcon from '../../images/discordIcon.svg';

const ProfilePicture = ({ user, width, height }: { user: BasicUserInfo; width?: number; height?: number }) => {
    if (user.avatar !== null) {
        return (
            <img
                width={width ?? 64}
                height={height ?? 64}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt={`${user.username}'s Discord profile`}
                className="discordProfilePicture"
            />
        );
    }

    return (
        <img
            width={width ?? 64}
            height={height ?? 64}
            style={{ padding: `0.5em` }}
            src={discordIcon}
            alt="Discord logo"
            className="discordProfilePicture"
        />
    );
};

export default ProfilePicture;
