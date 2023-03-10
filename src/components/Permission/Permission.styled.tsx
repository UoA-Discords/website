import { ListItemButton, ListItemIcon, styled } from '@mui/material';

export const PermissionItem = styled(ListItemButton)(({ theme }) => ({
    padding: theme.spacing(0.5, 1),
    flexGrow: 'unset',
}));

export const PermissionIcon = styled(ListItemIcon)(({ theme }) => ({
    minWidth: 'unset',
    paddingRight: theme.spacing(0.5),
}));

export const PermissionText = styled('span')(() => ({
    color: 'gray',
    fontSize: '12px',
    whiteSpace: 'nowrap',
}));
