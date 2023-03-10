import { ListItemButtonProps } from '@mui/material';
import { FC, useMemo } from 'react';
import { badgeIconMap } from '../../helpers/badgeIconMap';
import { UserPermissions } from '../../types/User/UserPermissions';
import { PermissionIcon, PermissionItem, PermissionText } from './Permission.styled';

export interface PermissionProps extends ListItemButtonProps {
    value: UserPermissions;
}

export const Permission: FC<PermissionProps> = ({ value, ...rest }) => {
    const { icon, label, title } = useMemo(() => badgeIconMap[value], [value]);

    return (
        <PermissionItem title={title} disableGutters dense disableRipple key={value} {...rest}>
            <PermissionIcon>{icon}</PermissionIcon>
            <PermissionText>{label}</PermissionText>
        </PermissionItem>
    );
};
