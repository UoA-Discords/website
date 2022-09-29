import { Tooltip, TooltipProps, Paper, Link } from '@mui/material';
import { BasicUserInfo } from '../../shared/Types/User';
import ProfilePicture from '../ProfilePicture';
import UserInfoCard from '../UserInfoCard';
import './Tooltips.css';

/** Inline text of a user's name and profile picture, that displays a {@link UserInfoCard} on hover. */
const InfoCardTooltip = ({
    user,
    children,
    tooltipProps,
}: {
    /** The user who's data is being displayed. */
    user: BasicUserInfo;
    /** Replacement to the default inline text of name and profile picture. */
    children?: TooltipProps[`children`];
    /** Additional props for the tooltip, excluding `title` and `children` since this element generates those. */
    tooltipProps?: Omit<TooltipProps, `title` | `children`>;
}) => {
    return (
        <Tooltip
            enterDelay={0}
            TransitionProps={{ timeout: 0 }}
            components={{ Tooltip: Paper }}
            {...tooltipProps}
            title={<UserInfoCard user={user} />}
        >
            {children ?? (
                <Link underline="none" sx={{ cursor: `help` }} component="span" className="infoCardTooltip">
                    <ProfilePicture user={user} height={20} width={20} style={{ marginBottom: `-4px` }} />
                    {` `}
                    {user.username}
                </Link>
            )}
        </Tooltip>
    );
};

export default InfoCardTooltip;
