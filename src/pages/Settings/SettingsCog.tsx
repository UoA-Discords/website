import SettingsIcon from '@mui/icons-material/Settings';
import React, { FC, useCallback, useState } from 'react';
import './SettingsCog.css';

const CLICK_THRESHOLD = 10;

// nothing special going on here ;)
export const SettingsCog: FC = () => {
    const [numTimesClicked, setNumTimesClicked] = useState(0);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setNumTimesClicked(numTimesClicked + 1);
        },
        [numTimesClicked],
    );
    return (
        <span onClick={handleClick}>
            <SettingsIcon
                style={{ marginBottom: '-0.5rem' }}
                className={`settingsCog ${numTimesClicked > CLICK_THRESHOLD ? 'overloaded' : ''}`}
            />
        </span>
    );
};
