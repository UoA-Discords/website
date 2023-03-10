import { Stack, styled } from '@mui/material';
import { Permission } from '../Permission/Permission';

export const PermissionLogStack = styled(Stack)(({ theme }) => ({
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
}));

export const PermissionAdded = styled(Permission)(({ theme }) => ({
    backgroundColor: 'rgba(144, 238, 144, 0.1)',
    padding: theme.spacing(1),
    flexGrow: 'unset',
}));

export const PermissionRemoved = styled(Permission)(({ theme }) => ({
    backgroundColor: 'rgba(240, 128, 128, 0.1)',
    padding: theme.spacing(1),
    flexGrow: 'unset',
}));
