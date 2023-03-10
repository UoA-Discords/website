import { CSSProperties, FC, useContext, useMemo, useState } from 'react';
import { UserSessionContext } from '../../contexts';
import { AnyDiscordUserReference, useDiscordUserData } from '../../hooks/useDiscordUserData';
import { DiscordIcon } from '../../images';

export interface ProfilePictureProps {
    /** The width and height of the `<img />` element, default is 64. */
    size?: number;

    /** Optional additional CSS to give the `<img />` element. */
    style?: CSSProperties;

    /** The user to display the profile picture of. */
    user: AnyDiscordUserReference;
}

/** An inline-image of a Discord user's profile picture. */
export const ProfilePicture: FC<ProfilePictureProps> = ({ user, size = 64, style }) => {
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
