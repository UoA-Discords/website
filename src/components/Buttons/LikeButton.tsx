import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { SxProps, Button, Theme } from '@mui/material';
import { useSiteLogin } from '../../hooks/useSiteLogin';
import { UserPermissionLevels } from '../../shared/Types/User';

import useDebounce from '../../hooks/useDebounce';
import axios, { AxiosRequestConfig } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings, setRateLimit } from '../../redux/slices/main';
import { digestRateLimitResponse } from '../../helpers/digestRateLimitResponse';

// icons
import LikeIcon from '@mui/icons-material/FavoriteBorder';
import AlreadyLikedIcon from '@mui/icons-material/Favorite';

const LikeButton = ({ entryId, entryLikes, sx }: { entryId: string; entryLikes: number; sx?: SxProps<Theme> }) => {
    const dispatch = useDispatch();
    const { loginResponse, setUserData } = useSiteLogin();
    const settings = useSelector(getSettings);

    /** Whether the user can like/dislike in general. */
    const canInteractWith = useMemo(() => {
        // must be logged in
        if (loginResponse === undefined) return false;

        // must have permission
        if (loginResponse.userData.permissionLevel < UserPermissionLevels.Like) return false;

        // otherwise all good!
        return true;
    }, [loginResponse]);

    /** The true like state of this entry. */
    const trueLikeIndex = useMemo(
        () => loginResponse?.userData.likes.indexOf(entryId) ?? -1,
        [entryId, loginResponse?.userData.likes],
    );

    /**
     * The false like state of this entry, is initially equal to the true state,
     * but can temporarily become different since the true like state takes time to
     * update.
     */
    const [wantsToLike, setWantsToLike] = useState(trueLikeIndex !== -1);

    const debouncedWantsToLike = useDebounce(wantsToLike, 1000);

    /** Update the false like state whenever the true like state changes. */
    useEffect(() => {
        setWantsToLike(trueLikeIndex !== -1);
    }, [trueLikeIndex]);

    const [originallyLiked] = useState(trueLikeIndex !== -1);

    /** Companion to the false state to instantly reflect changes in the number of likes. */
    const likeModifier = useMemo(() => {
        if (originallyLiked) {
            // restoring our original like
            if (wantsToLike) return 0;
            // otherwise, removing our original like
            return -1;
        }

        // adding a new like
        if (wantsToLike) return 1;

        return 0;
    }, [originallyLiked, wantsToLike]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // clicking the button should invert the desired state
            setWantsToLike(!wantsToLike);
        },
        [wantsToLike],
    );

    useEffect(() => {
        // guard clause, identical to `canInteractWith`
        if (loginResponse === undefined || loginResponse.userData.permissionLevel < UserPermissionLevels.Like) return;

        // already in desired like state
        if (debouncedWantsToLike === (trueLikeIndex !== -1)) return;

        const headers: Record<string, string> = {
            Authorization: `Bearer ${loginResponse.siteAuth}`,
        };

        if (settings.rateLimitBypassToken !== undefined) {
            headers[`RateLimit-Bypass-Token`] = settings.rateLimitBypassToken;
        }

        const requestObject: AxiosRequestConfig = {
            method: `patch`,
            baseURL: settings.serverUrl,
            url: `/entries/${entryId}/likes`,
            data: { like: debouncedWantsToLike },
            headers,
        };

        axios
            .request<void>(requestObject)
            .then(() => {
                if (trueLikeIndex === -1) {
                    loginResponse.userData.likes.push(entryId);
                } else {
                    loginResponse.userData.likes.splice(trueLikeIndex, 1);
                }

                setUserData({ ...loginResponse });
                // we intentionally don't modify the entry to avoid a reshuffle
                // (since entries are sorted by likes)
            })
            .catch((reason) => {
                const rateLimitInfo = digestRateLimitResponse(reason);
                if (rateLimitInfo !== null) {
                    dispatch(setRateLimit(rateLimitInfo));
                } else {
                    console.error(`error ${trueLikeIndex === -1 ? `liking` : `unliking`} server ${entryId}`, reason);
                }
            });
    }, [
        debouncedWantsToLike,
        dispatch,
        entryId,
        entryLikes,
        loginResponse,
        setUserData,
        settings.rateLimitBypassToken,
        settings.serverUrl,
        trueLikeIndex,
    ]);

    return (
        <Button
            sx={{ color: wantsToLike ? `#ed4245` : `#a3a6aa`, ...sx }}
            component="span"
            onClick={handleClick}
            disabled={!canInteractWith}
            endIcon={wantsToLike ? <AlreadyLikedIcon /> : <LikeIcon />}
        >
            {entryLikes + likeModifier}
        </Button>
    );
};

export default LikeButton;
