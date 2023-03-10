import { Button, Dialog, DialogTitle } from '@mui/material';
import { useContext, useEffect, useState, FC, useCallback } from 'react';
import { MainStateContext } from '../../contexts';
import { ErrorBody } from './ErrorBody';
import { ErrorDisplayerDialogActions, ErrorDisplayerDialogContent } from './ErrorDisplayer.styled';
import { ErrorTitle } from './ErrorTitle';

/**
 * Displays any errors that have been caught by the {@link MainStateContext}.
 *
 * The `inline` option can be provided to display the errors in `<div>` element instead of a dialog.
 */
export const ErrorDisplayer: FC<{ inline?: boolean }> = ({ inline = false }) => {
    const { latestError, globalErrorDisplayType } = useContext(MainStateContext);

    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        // mark as closed if the latest error doesn't exist (or has been cleared)
        if (latestError === null) return setOpen(false);

        // mark as closed if we're not supposed to display it
        if (globalErrorDisplayType === 'inline' && !inline) return setOpen(false);

        // otherwise, the error exists and we're supposed to display it, so mark as open
        setOpen(true);
    }, [globalErrorDisplayType, inline, latestError]);

    if (latestError === null) return <></>;

    if (inline) {
        return (
            <div>
                <ErrorTitle />
                <ErrorBody onClose={handleClose} />
            </div>
        );
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
            {/* we can't used a style component for the dialog title since the 'component' prop doesn't seem to exist
            on styled components :( */}
            <DialogTitle
                component="div"
                sx={{
                    bgcolor: 'background.paper',
                    border: '2px solid #333',
                    borderBottom: 'none',
                }}
                textAlign="center"
            >
                <ErrorTitle />
            </DialogTitle>
            <ErrorDisplayerDialogContent>
                <ErrorBody onClose={handleClose} />
            </ErrorDisplayerDialogContent>
            <ErrorDisplayerDialogActions>
                <Button variant="outlined" sx={{ minWidth: '100px' }} onClick={handleClose}>
                    Close
                </Button>
            </ErrorDisplayerDialogActions>
        </Dialog>
    );
};
