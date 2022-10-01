import { TooltipProps } from '@mui/material/Tooltip';
import DarkTooltip from './DarkTooltip';

const CloseTooltip = (props: TooltipProps) => {
    return (
        <DarkTooltip
            placement="right"
            {...props}
            PopperProps={{
                modifiers: [
                    {
                        name: `offset`,
                        options: {
                            offset: [0, -10],
                        },
                    },
                ],
            }}
        />
    );
};

export default CloseTooltip;
