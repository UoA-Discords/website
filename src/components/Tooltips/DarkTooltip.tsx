import { TooltipProps, Tooltip, tooltipClasses, styled } from '@mui/material';

const DarkTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        color: `rgba(255, 255, 255, 0.87)`,
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

export default DarkTooltip;
