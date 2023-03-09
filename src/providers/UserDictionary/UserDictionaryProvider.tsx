import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../../api';
import { IUserDictionaryContext, SettingsContext, UserDictionaryContext, UserSessionContext } from '../../contexts';

export const UserDictionaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);

    const [encounteredUsers, setEncounteredUsers] = useState<IUserDictionaryContext['encounteredUsers']>({});

    const addIdsToDictionary = useCallback<IUserDictionaryContext['addIdsToDictionary']>(
        async (userIds) => {
            const { items, totalItemCount } = await api.searchUsers(
                {
                    baseURL: settings.serverUrl,
                    siteToken: loggedInUser?.siteAuth,
                    rateLimitBypassToken: settings.rateLimitBypassToken,
                },
                {
                    page: 0,
                    perPage: 100,
                    withIds: userIds.slice(0, 100),
                },
            );

            const dictionarySize = Object.keys(encounteredUsers).length;

            const freeSlots = settings.maxUserDictionarySize - dictionarySize;

            const numExistingToRemove = Math.max(0, items.length - freeSlots);

            console.log(`[UserDictionary] Fetched ${items.length} new users`, {
                prompted: userIds.length,
                returned: items.length,
                returnedTotalItemCount: totalItemCount,
                dictionarySize,
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
            settings.maxUserDictionarySize,
            settings.rateLimitBypassToken,
            settings.serverUrl,
        ],
    );

    const finalValue = useMemo<IUserDictionaryContext>(
        () => ({ encounteredUsers, addIdsToDictionary }),
        [addIdsToDictionary, encounteredUsers],
    );

    return <UserDictionaryContext.Provider value={finalValue}>{children}</UserDictionaryContext.Provider>;
};
