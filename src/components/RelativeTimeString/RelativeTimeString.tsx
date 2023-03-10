import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CSSProperties, FC, useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export interface RelativeTimeStringProps extends CSSProperties {
    /** The ISO string or timestamp of the time to display relative to now. */
    time: string | number;

    /** If true, displays relative time without suffix, e.g. "2 days" instead of "2 days ago". */
    withoutSuffix?: boolean;

    /** Interval between re-renders in milliseconds, default 1000. */
    intervalMs?: number;

    /** Whether to wrap the relative time in brackets. */
    inBrackets?: boolean;
}

/** Displays relative time parsed using {@link https://day.js.org/ dayjs}, updating it every X milliseconds. */
export const RelativeTimeString: FC<RelativeTimeStringProps> = (props) => {
    const { time, withoutSuffix, intervalMs = 1_000, inBrackets, ...style } = props;

    const [relativeTime, setRelativeTime] = useState(dayjs(time).fromNow(withoutSuffix));

    useEffect(() => {
        // updating the time every {intervalMs}

        const interval = setInterval(() => setRelativeTime(dayjs(time).fromNow(withoutSuffix)), intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [intervalMs, time, withoutSuffix]);

    return (
        <span style={style}>
            {inBrackets && '('}
            {relativeTime}
            {inBrackets && ')'}
        </span>
    );
};
