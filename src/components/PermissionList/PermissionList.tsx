import { Stack, StackProps, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { splitBitfield } from '../../helpers/splitBitfield';
import { UserPermissions } from '../../types/User/UserPermissions';
import { Permission } from '../Permission/Permission';

export interface PermissionListProps extends StackProps {
    permissions: UserPermissions;
    showAll: boolean;
}

const permissionsDisplayOrder: UserPermissions[] = [
    UserPermissions.Owner,
    UserPermissions.ManageUsers,
    UserPermissions.Feature,
    UserPermissions.ManageServers,
    UserPermissions.MakeLotsOfApplications,
    UserPermissions.MakeApplications,
    UserPermissions.Favourite,
];

const hiddenPermissions = new Set<UserPermissions>([UserPermissions.MakeApplications, UserPermissions.Favourite]);

const _PermissionList: FC<PermissionListProps> = (props) => {
    const { permissions, showAll, ...rest } = props;

    const badgeStackItems = splitBitfield(permissions)
        .filter((permission) => (showAll ? true : !hiddenPermissions.has(permission)))
        .sort((a, b) => permissionsDisplayOrder.indexOf(a) - permissionsDisplayOrder.indexOf(b))
        .map((permission, i) => <Permission value={permission} key={i} />);

    return (
        <Stack direction="row" flexWrap="wrap" justifyContent="center" {...rest}>
            {badgeStackItems.length !== 0 ? (
                badgeStackItems
            ) : (
                <Typography color="gray">
                    <i>No permissions</i>
                </Typography>
            )}
        </Stack>
    );
};

export const PermissionList = memo(_PermissionList);
