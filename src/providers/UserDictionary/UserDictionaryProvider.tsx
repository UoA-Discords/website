import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../../api';
import { IUserDictionaryContext, SettingsContext, UserDictionaryContext, UserSessionContext } from '../../contexts';
import { User } from '../../types/User';
import { DiscordIdString } from '../../types/Utility';

export const UserDictionaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);

    const [encounteredUsers, setEncounteredUsers] = useState<Record<DiscordIdString, User<'HideIP' | 'ShowIP'>>>({});

    const addIdsToDictionary = useCallback<IUserDictionaryContext['addIdsToDictionary']>(
        async (userIds) => {
            const relevantUserIds = new Set<DiscordIdString>();

            for (const id of userIds) {
                if (encounteredUsers[id] !== undefined) continue;
                if (loggedInUser?.user._id === id) continue;
                relevantUserIds.add(id);
            }

            if (relevantUserIds.size === 0) return;

            const { items, totalItemCount } = await api.searchUsers(
                {
                    baseURL: settings.serverUrl,
                    siteToken: loggedInUser?.siteAuth,
                    rateLimitBypassToken: settings.rateLimitBypassToken,
                },
                {
                    page: 0,
                    perPage: 100,
                    withIds: Array.from(relevantUserIds).slice(0, 100),
                },
            );

            const dictionarySize = Object.keys(encounteredUsers).length;

            const freeSlots = settings.maxUserDictionarySize - dictionarySize;

            const numExistingToRemove = Math.max(0, items.length - freeSlots);

            console.log(`[UserDictionary] Fetched ${items.length} new users`, {
                prompted: userIds.length,
                promptedRelevant: relevantUserIds.size,
                returned: items.length,
                returnedTotalItemCount: totalItemCount,
                dictionarySize,
                maxConfiguredSize: settings.maxUserDictionarySize,
                freeSlots,
                numExistingToRemove,
            });

            for (const key of Object.keys(encounteredUsers).slice(0, numExistingToRemove)) {
                delete encounteredUsers[key];
            }

            setEncounteredUsers({
                ...encounteredUsers,
                ...items.reduce((newDict, user) => ({ ...newDict, [user._id]: user }), {}),
            });
        },
        [
            encounteredUsers,
            loggedInUser?.siteAuth,
            loggedInUser?.user._id,
            settings.maxUserDictionarySize,
            settings.rateLimitBypassToken,
            settings.serverUrl,
        ],
    );

    const getUser = useCallback<IUserDictionaryContext['getUser']>(
        (id) => {
            if (id === loggedInUser?.user._id) return loggedInUser.user;

            return encounteredUsers[id] ?? null;
        },
        [encounteredUsers, loggedInUser?.user],
    );

    const finalValue = useMemo<IUserDictionaryContext>(
        () => ({ addIdsToDictionary, getUser }),
        [addIdsToDictionary, getUser],
    );

    return <UserDictionaryContext.Provider value={finalValue}>{children}</UserDictionaryContext.Provider>;
};
