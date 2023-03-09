import { APIUser } from 'discord-api-types/v10';
import { User } from '../../types/User';

interface ProfilePicturePropsBase {
    type: 'partial' | 'full';
    size?: number;
    style?: React.CSSProperties;
    user: User<'HideIP' | 'ShowIP'> | Pick<APIUser, 'id' | 'username' | 'discriminator' | 'avatar'>;
}

interface ProfilePicturePropsFull extends ProfilePicturePropsBase {
    type: 'full';
    user: User<'HideIP' | 'ShowIP'>;
}

interface ProfilePicturePropsPartial extends ProfilePicturePropsBase {
    type: 'partial';
    user: Pick<APIUser, 'id' | 'username' | 'discriminator' | 'avatar'>;
}

export type ProfilePictureProps = ProfilePicturePropsFull | ProfilePicturePropsPartial;
