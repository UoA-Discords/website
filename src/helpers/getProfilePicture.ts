import { BasicUserInfo } from '../shared/Types/User';

import discordIcon from '../images/discordIcon.svg';

export function getProfilePicture(user: BasicUserInfo): { src: string; alt: string } {
    if (user.avatar !== null) {
        return {
            src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            alt: `${user.username}'s Discord profile`,
        };
    }

    return { src: discordIcon, alt: `Discord logo` };
}
