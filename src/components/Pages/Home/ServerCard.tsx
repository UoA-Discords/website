import { Button, Card, CardActionArea, CardContent, CardMedia, Grow, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApprovedEntry } from '../../../shared/Types/Entries';

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import LikedIcon from '@mui/icons-material/Favorite';

import { useSiteLogin } from '../../../hooks/useSiteLogin';
import { UserPermissionLevels } from '../../../shared/Types/User';
import axios from 'axios';
import { config } from '../../../config';
import { useDispatch } from 'react-redux';
import { setLikedEntry } from '../../../redux/slices/entryManager';
import { digestRateLimitResponse } from '../../../helpers/digestRateLimitResponse';
import { setRateLimit } from '../../../redux/slices/main';

const ServerCard = ({ server, index }: { server: ApprovedEntry; index: number }) => {
    const dispatch = useDispatch();
    const [shouldFadeIn, setShouldFadeIn] = useState(false);
    const { loginResponse, setUserData } = useSiteLogin();

    const likeIndex = useMemo<number>(
        () => loginResponse?.userData.likes.indexOf(server.id) ?? -1,
        [loginResponse?.userData.likes, server.id],
    );

    const handleLike = useCallback(() => {
        if (loginResponse === undefined) return;
        const controller = new AbortController();

        axios
            .request<void>({
                method: `patch`,
                url: `${config.serverUrl}/entries/${server.id}/likes`,
                signal: controller.signal,
                data: {
                    like: likeIndex === -1,
                },
                headers: {
                    Authorization: `Bearer ${loginResponse.siteAuth}`,
                },
            })
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
    }, [dispatch, likeIndex, loginResponse, server.id, setUserData]);

    useEffect(() => {
        const timeout = setTimeout(() => setShouldFadeIn(true), index * 40);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <Grow in={shouldFadeIn}>
            <Card sx={{ position: `relative`, zIndex: 1, height: `100%` }}>
                <CardActionArea disableRipple sx={{ display: `flex`, justifyContent: `flex-start`, height: `100%` }}>
                    <CardMedia
                        component="img"
                        image={`https://cdn.discordapp.com/icons/${server.id}/${server.guildData.icon}`}
                        sx={{ width: 128, p: 1 }}
                        className="discordProfilePicture"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5">{server.guildData.name}</Typography>
                        <Typography color="text.secondary">
                            {server.memberCountHistory.at(-1)?.[1] ?? `-`} Members (
                            {server.memberCountHistory.at(-1)?.[0] ?? `-`} Online)
                        </Typography>
                    </CardContent>
                    <Button
                        component="span"
                        onClick={handleLike}
                        disabled={
                            loginResponse === undefined ||
                            loginResponse.userData.permissionLevel < UserPermissionLevels.Like
                        }
                        endIcon={likeIndex !== -1 ? <LikedIcon /> : <LikeIcon />}
                        sx={{ position: `absolute`, right: 0, bottom: 0 }}
                    >
                        {server.likes}
                    </Button>
                </CardActionArea>
            </Card>
        </Grow>
    );

    // return (
    //     <Fade in={shouldFadeIn}>
    //         <Card sx={{ height: `100%`, width: `100%` }}>
    //             <CardActionArea disableRipple sx={{ display: `flex`, p: 1, width: `100%`, height: `100%` }}>
    //                 <CardMedia
    //                     component="img"
    //                     image={`https://cdn.discordapp.com/icons/${server.id}/${server.guildData.icon}`}
    //                     sx={{ width: 128 }}
    //                     className="discordProfilePicture"
    //                 />
    //                 <Box sx={{ display: `flex`, flexDirection: `column`, flexGrow: 1 }}>
    //                     <CardContent sx={{ flex: `1 0 auto` }}>
    //                         <Typography component="div" variant="h5">
    //                             {server.guildData.name}
    //                         </Typography>
    //                         <Typography variant="subtitle1" color="text.secondary" component="div">
    //                             {server.memberCountHistory.at(-1)?.[1] ?? `-`} Members (
    //                             {server.memberCountHistory.at(-1)?.[0] ?? `-`} Online)
    //                         </Typography>
    //                         <span style={{ color: `gray` }}>
    //                             {server.facultyTags.map((e) => tagToString(e)).join(`, `)}
    //                         </span>
    //                         <Button component="span">{server.likes}</Button>
    //                     </CardContent>
    //                 </Box>
    //             </CardActionArea>
    //         </Card>
    //     </Fade>
    // );
};

export default ServerCard;
