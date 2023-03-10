import { DialogActions, DialogContent, styled } from '@mui/material';

export const ErrorDisplayerDialogContent = styled(DialogContent)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #333',
    borderTop: 'none',
    borderBottom: 'none',
}));

export const ErrorDisplayerDialogActions = styled(DialogActions)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #333',
    borderTop: 'none',
}));
