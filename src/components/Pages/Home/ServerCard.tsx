import { Button, Card, CardActionArea, CardContent, Grow, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import LikedIcon from '@mui/icons-material/Favorite';

import { useSiteLogin } from '../../../hooks/useSiteLogin';
import { UserPermissionLevels } from '../../../shared/Types/User';
import axios, { AxiosRequestConfig } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLikedEntry } from '../../../redux/slices/entryManager';
import { digestRateLimitResponse } from '../../../helpers/digestRateLimitResponse';
import { getSettings, setRateLimit } from '../../../redux/slices/main';
import FacultyTag from '../../TagSelector/FacultyTag';
import GuildIcon from '../../GuildIcon';
import ServerFoundModal from '../../Modals/FocusedServer/ServerFound';

const ServerCard = ({
    server,
    index,
}: {
    server: FullEntry<EntryStates.Approved | EntryStates.Featured>;
    index: number;
}) => {
    const dispatch = useDispatch();
    const [shouldFadeIn, setShouldFadeIn] = useState(false);
    const { loginResponse, setUserData } = useSiteLogin();
    const settings = useSelector(getSettings);

    const likeIndex = useMemo<number>(
        () => loginResponse?.userData.likes.indexOf(server.id) ?? -1,
        [loginResponse?.userData.likes, server.id],
    );

    const handleLike = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            if (loginResponse === undefined) return;
            const controller = new AbortController();

            const requestObject: AxiosRequestConfig = {
                method: `patch`,
                baseURL: settings.serverUrl,
                url: `/entries/${server.id}/likes`,
                signal: controller.signal,
                data: {
                    like: likeIndex === -1,
                },
                headers: {
                    Authorization: `Bearer ${loginResponse.siteAuth}`,
                },
            };

            if (settings.rateLimitBypassToken !== undefined) {
                requestObject.headers![`RateLimit-Bypass-Token`] = settings.rateLimitBypassToken;
            }

            axios
                .request<void>(requestObject)
                .then(() => {
                    if (likeIndex === -1) loginResponse.userData.likes.push(server.id);
                    else loginResponse.userData.likes.splice(likeIndex, 1);

                    dispatch(setLikedEntry({ id: server.id, like: likeIndex === -1 }));
                    setUserData({ ...loginResponse });
                })
                .catch((e) => {
                    const r = digestRateLimitResponse(e);
                    if (r !== null) {
                        dispatch(setRateLimit(r));
                    } else {
                        console.error(e);
                    }
                });

            return () => controller.abort();
        },
        [dispatch, likeIndex, loginResponse, server.id, setUserData, settings.rateLimitBypassToken, settings.serverUrl],
    );

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShouldFadeIn(true), index * 40);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <Grow in={shouldFadeIn}>
            <Card sx={{ position: `relative`, zIndex: 1, height: `100%` }}>
                <CardActionArea
                    disableRipple
                    sx={{ display: `flex`, justifyContent: `flex-start`, height: `100%` }}
                    onClick={() => setOpen(true)}
                >
                    <GuildIcon server={server} />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5">{server.guildData.name}</Typography>
                        <Typography color="text.secondary">
                            {server.memberCountHistory.at(-1)?.[1] ?? `?`} Members (
                            {server.memberCountHistory.at(-1)?.[0] ?? `?`} Online)
                        </Typography>
                        <Stack direction="row" gap={1} mt={0.5}>
                            {server.facultyTags.map((tag, i) => (
                                <FacultyTag tag={tag} key={i} />
                            ))}
                        </Stack>
                    </CardContent>
                    <Button
                        component="span"
                        onClick={handleLike}
                        disabled={
                            loginResponse === undefined ||
                            loginResponse.userData.permissionLevel < UserPermissionLevels.Like
                        }
                        endIcon={likeIndex !== -1 ? <LikedIcon /> : <LikeIcon />}
                        sx={{
                            position: `absolute`,
                            right: 0,
                            bottom: 0,
                            color: likeIndex !== -1 ? `#ed4245` : `#a3a6aa`,
                        }}
                    >
                        {server.likes}
                    </Button>
                </CardActionArea>
                <ServerFoundModal entry={server} open={open} onClose={() => setOpen(false)} />
            </Card>
        </Grow>
    );
};

export default ServerCard;
