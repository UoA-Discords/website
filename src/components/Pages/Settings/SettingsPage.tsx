import { Container, Typography, TextField, IconButton, Fade } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings, resetSettings, setSettings } from '../../../redux/slices/main';

import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { defaultSettings as getDefaultSettings } from '../../../helpers/settingsHelper';
import { useState } from 'react';
import LightTooltip from '../../Tooltips/LightTooltip';
import { Stack } from '@mui/system';
import ServerURLChecker from './ServerURLChecker';
import RateLimitTokenChecker from './RateLimitTokenChecker';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const settings = useSelector(getSettings);

    const [defaultSettings] = useState(getDefaultSettings());

    return (
        <Container id="app" sx={{ mt: 2 }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <Stack direction="column" spacing={4}>
                <div>
                    <Stack direction="row" alignItems="flex-end" maxWidth="sm">
                        <TextField
                            fullWidth
                            variant="standard"
                            value={settings.serverUrl}
                            label="Server URL"
                            onChange={(e) =>
                                dispatch(setSettings({ ...settings, serverUrl: e.target.value || settings.serverUrl }))
                            }
                        />
                        <ServerURLChecker />
                        <Fade in={settings.serverUrl !== defaultSettings.serverUrl}>
                            <span>
                                <LightTooltip placement="top" title={<Typography>Reset to Default</Typography>}>
                                    <IconButton onClick={() => dispatch(resetSettings(`serverUrl`))}>
                                        <RestartAltIcon />
                                    </IconButton>
                                </LightTooltip>
                            </span>
                        </Fade>
                    </Stack>
                    <Typography color="gray" maxWidth="sm">
                        The root path of the UoA Discords API you wish to use, use this to switch between development
                        and production endpoints.
                    </Typography>
                </div>
                <div>
                    <Stack direction="row" alignItems="flex-end">
                        <TextField
                            variant="standard"
                            value={settings.rateLimitBypassToken || `None`}
                            label="Ratelimit Bypass Token"
                            onChange={(e) => {
                                if (e.target.value.length > 0)
                                    dispatch(setSettings({ ...settings, rateLimitBypassToken: e.target.value }));
                                else {
                                    const newSettings = { ...settings };
                                    delete newSettings.rateLimitBypassToken;
                                    dispatch(setSettings({ ...settings }));
                                }
                            }}
                        />
                        <RateLimitTokenChecker />
                        <Fade in={settings.rateLimitBypassToken !== defaultSettings.rateLimitBypassToken}>
                            <span>
                                <LightTooltip placement="top" title={<Typography>Reset to Default</Typography>}>
                                    <IconButton onClick={() => dispatch(resetSettings(`rateLimitBypassToken`))}>
                                        <RestartAltIcon />
                                    </IconButton>
                                </LightTooltip>
                            </span>
                        </Fade>
                    </Stack>
                    <Typography color="gray" maxWidth="sm">
                        Token to include in the 'RateLimit-Bypass-Token' header of all API requests. Use this during
                        development to avoid getting ratelimited.
                    </Typography>
                </div>
                <div>
                    <Stack direction="row" alignItems="flex-end">
                        <TextField
                            variant="standard"
                            value={settings.discordClientId}
                            label="Discord Client ID"
                            onChange={(e) =>
                                dispatch(
                                    setSettings({
                                        ...settings,
                                        discordClientId: e.target.value || settings.discordClientId,
                                    }),
                                )
                            }
                        />
                        <Fade in={settings.discordClientId !== defaultSettings.discordClientId}>
                            <span>
                                <LightTooltip placement="top" title={<Typography>Reset to Default</Typography>}>
                                    <IconButton onClick={() => dispatch(resetSettings(`discordClientId`))}>
                                        <RestartAltIcon />
                                    </IconButton>
                                </LightTooltip>
                            </span>
                        </Fade>
                    </Stack>
                    <Typography color="gray" maxWidth="sm">
                        Client ID of the Discord application, this is used to generate a Discord OAuth2 URL for logging
                        in.
                    </Typography>
                </div>
                <div>
                    <Stack direction="row" alignItems="flex-end" maxWidth="sm">
                        <TextField
                            fullWidth
                            variant="standard"
                            value={settings.redirectURI}
                            label="Discord Redirect URI"
                            onChange={(e) =>
                                dispatch(
                                    setSettings({
                                        ...settings,
                                        redirectURI: e.target.value || settings.redirectURI,
                                    }),
                                )
                            }
                        />
                        <Fade in={settings.redirectURI !== defaultSettings.redirectURI}>
                            <span>
                                <LightTooltip placement="top" title={<Typography>Reset to Default</Typography>}>
                                    <IconButton onClick={() => dispatch(resetSettings(`redirectURI`))}>
                                        <RestartAltIcon />
                                    </IconButton>
                                </LightTooltip>
                            </span>
                        </Fade>
                    </Stack>
                    <Typography color="gray" maxWidth="sm">
                        URI to redirect to upon authorizing a Discord OAuth2 session, must be one of the allowed
                        redirects configured in your application.
                    </Typography>
                </div>
            </Stack>
        </Container>
    );
};

export default SettingsPage;
