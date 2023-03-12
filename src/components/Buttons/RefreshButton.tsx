import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Slide, SxProps, Theme } from '@mui/material';
import { FC, RefObject, useCallback, useMemo } from 'react';
import './RefreshButton.css';

export interface RefreshButtonProps {
    /**
     * Whether the intial data to refresh has been fetched for the first time.
     *
     * If false, the button will not be visible.
     */
    doneInitialFetch: boolean;

    /** Whether a refresh is in process. */
    active: boolean;

    onClick: () => void;

    containerRef: RefObject<HTMLDivElement>;

    sx?: SxProps<Theme>;
}

export const RefreshButton: FC<RefreshButtonProps> = ({ doneInitialFetch, active, onClick, containerRef, sx }) => {
    const [text, color, iconClass] = useMemo<[string, 'primary' | 'secondary', string]>(() => {
        if (active) return ['Loading...', 'secondary', 'refreshIcon active'];
        return ['Refresh', 'primary', 'refreshIcon'];
    }, [active]);

    const handleClick = useCallback(() => {
        if (!doneInitialFetch || active) return;
        onClick();
    }, [active, doneInitialFetch, onClick]);

    return (
        <Slide direction="down" in={doneInitialFetch} container={containerRef.current}>
            <Button
                variant="outlined"
                startIcon={<RefreshIcon className={iconClass} />}
                sx={{ textTransform: 'none', ...sx }}
                color={color}
                size="small"
                onClick={handleClick}
            >
                {text}
            </Button>
        </Slide>
    );
};
