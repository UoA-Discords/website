import TestFailIcon from '@mui/icons-material/Cancel';
import TestSuccessIcon from '@mui/icons-material/CheckCircle';
import TestValueIcon from '@mui/icons-material/CheckCircleOutline';
import ResetToDefaultIcon from '@mui/icons-material/RestartAlt';
import ShowPasswordIcon from '@mui/icons-material/Visibility';
import HidePasswordIcon from '@mui/icons-material/VisibilityOff';
import {
    BaseTextFieldProps,
    Grid,
    TextField,
    InputAdornment,
    Fade,
    IconButton,
    CircularProgress,
    Typography,
} from '@mui/material';
import React, { FC, HTMLAttributes, memo } from 'react';

export enum SettingsItemTestState {
    Available,
    InProgress,
    Failed,
    Succeeded,
}

export interface SettingsItemTest {
    state: SettingsItemTestState;
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    title: string;
}

export interface SettingsItemProps {
    label: string;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleReset: (e: React.MouseEvent<HTMLButtonElement>) => void;
    title: string;
    isDefault: boolean;
    inputMode?: HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>['inputMode'];
    test?: SettingsItemTest;
    hide?: { hidden: boolean; setHidden: (newHidden: boolean) => void };
}

const _SettingsItem: FC<SettingsItemProps> = (props) => {
    const { label, value, handleChange, handleReset, title, isDefault, inputMode, test, hide } = props;

    let color: Exclude<BaseTextFieldProps['color'], undefined>;

    if (test === undefined) {
        color = 'secondary';
    } else {
        switch (test.state) {
            case SettingsItemTestState.Succeeded:
                color = 'success';
                break;
            case SettingsItemTestState.Failed:
                color = 'error';
                break;
            case SettingsItemTestState.InProgress:
                color = 'info';
                break;
            case SettingsItemTestState.Available:
                color = 'secondary';
                break;
        }
    }

    return (
        <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <TextField
                color={color}
                error={color === 'error'}
                variant="outlined"
                label={label}
                value={value}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Fade in={!isDefault}>
                                <IconButton title="Reset to default" onClick={handleReset}>
                                    <ResetToDefaultIcon color="warning" />
                                </IconButton>
                            </Fade>
                            {test !== undefined && (
                                <Fade in={value !== ''}>
                                    <IconButton title={test.title} onClick={test.handleClick}>
                                        {test.state === SettingsItemTestState.Succeeded ? (
                                            <TestSuccessIcon color={color} />
                                        ) : test.state === SettingsItemTestState.Available ? (
                                            <TestValueIcon color={color} />
                                        ) : test.state === SettingsItemTestState.Failed ? (
                                            <TestFailIcon color={color} />
                                        ) : (
                                            <CircularProgress size={20} color={color} />
                                        )}
                                    </IconButton>
                                </Fade>
                            )}
                            {hide !== undefined && (
                                <IconButton
                                    onClick={(e) => {
                                        e.preventDefault();
                                        hide.setHidden(!hide.hidden);
                                    }}
                                    title={hide.hidden ? 'Show' : 'Hide'}
                                >
                                    {hide.hidden ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                }}
                inputProps={{ inputMode }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                type={hide?.hidden === true ? 'password' : 'text'}
            />
            <Typography variant="body2" color="gray" sx={{ ml: 1 }}>
                {title}
            </Typography>
            {test !== undefined ? (
                <Fade in={test.state !== SettingsItemTestState.Available}>
                    <Typography variant="body2" color="gray" sx={{ ml: 1 }}>
                        {test.title}
                    </Typography>
                </Fade>
            ) : (
                <br />
            )}
        </Grid>
    );
};

export const SettingsItem = memo(_SettingsItem);
