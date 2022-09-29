import { useMemo } from 'react';
import { TooltipProps, Typography } from '@mui/material';
import DarkTooltip from './DarkTooltip';
import LightTooltip from './LightTooltip';
import './Tooltips.css';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export interface TimestampTooltipProps {
    /** The date to display the relative time to, as well as in the tooltip. */
    timestamp: string;
    /** The date that the {@link TimestampTooltipProps["timestamp"] timestamp } is relative to, defaults to now. */
    from?: string;
    /** String to display before the relative time. */
    prefixString?: string;
    /** String to display after the relative time. */
    suffixString?: string;
    /** Additional props for the tooltip, excluding `title` and `children` since this element generates those. */
    tooltipProps?: Omit<TooltipProps, `title` | `children`>;
    /** Whether to use a {@link LightTooltip light} or {@link DarkTooltip dark} tooltip. */
    theme: `light` | `dark`;
}

/**
 * A span that displays the time since a specified date, and the date itself
 * when hovered over.
 */
const TimestampTooltip = ({
    timestamp,
    from,
    prefixString,
    suffixString,
    tooltipProps,
    theme,
}: TimestampTooltipProps) => {
    const innerText = useMemo(() => {
        if (from !== undefined) {
            return `after ${dayjs(timestamp).from(from, true)}`;
        }
        return dayjs(timestamp).fromNow();
    }, [from, timestamp]);

    const finalTooltipProps: Omit<TooltipProps, `children`> = {
        placement: `right`,
        ...tooltipProps,
        title: (
            <Typography>
                {new Date(timestamp).toLocaleString(`en-NZ`, { dateStyle: `medium`, timeStyle: `short` })}
            </Typography>
        ),
    };

    const displayText = (
        <span style={{ cursor: `help` }} className="timestampTooltip">
            {prefixString}
            {innerText}
            {suffixString}
        </span>
    );

    if (theme === `light`) {
        return <LightTooltip {...finalTooltipProps}>{displayText}</LightTooltip>;
    }

    return <DarkTooltip {...finalTooltipProps}>{displayText}</DarkTooltip>;
};

export default TimestampTooltip;
