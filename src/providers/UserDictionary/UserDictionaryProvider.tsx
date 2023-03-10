import { FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../../api';
import { IUserDictionaryContext, SettingsContext, UserDictionaryContext, UserSessionContext } from '../../contexts';
import { User } from '../../types/User';
import { DiscordIdString } from '../../types/Utility';

export const UserDictionaryProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const { loggedInUser, updateUser } = useContext(UserSessionContext);

    const [encounteredUsers, setEncounteredUsers] = useState<Record<DiscordIdString, User<'HideIP' | 'ShowIP'>>>({});

    const addIdsToDictionary = useCallback<IUserDictionaryContext['addIdsToDictionary']>(
        async (userIds) => {
            const relevantUserIds = new Set<DiscordIdString>();

            for (const id of userIds) {
                if (encounteredUsers[id] !== undefined) continue;
                relevantUserIds.add(id);
            }

            if (loggedInUser?.user._id !== undefined) relevantUserIds.delete(loggedInUser.user._id);

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

    const addUsersToDictionary = useCallback<IUserDictionaryContext['addUsersToDictionary']>(
        (users) => {
            if (users.every((e) => encounteredUsers[e._id] !== undefined)) return;

            setEncounteredUsers({
                ...encounteredUsers,
                ...users.reduce((newDict, user) => ({ ...newDict, [user._id]: user }), {}),
            });
        },
        [encounteredUsers],
    );

    const updateUserInDictionary = useCallback<IUserDictionaryContext['updateUserInDictionary']>(
        (updatedUser) => {
            if (updatedUser._id === loggedInUser?.user._id) {
                return updateUser(updatedUser);
            }

            setEncounteredUsers({
                ...encounteredUsers,
                [updatedUser._id]: updatedUser,
            });
        },
        [encounteredUsers, loggedInUser?.user._id, updateUser],
    );

    const getUser = useCallback<IUserDictionaryContext['getUser']>(
        (id) => {
            if (id === loggedInUser?.user._id) return loggedInUser.user;

            return encounteredUsers[id] ?? null;
        },
        [encounteredUsers, loggedInUser?.user],
    );

    const finalValue = useMemo<IUserDictionaryContext>(
        () => ({ addIdsToDictionary, addUsersToDictionary, updateUserInDictionary, getUser }),
        [addIdsToDictionary, addUsersToDictionary, getUser, updateUserInDictionary],
    );

    return <UserDictionaryContext.Provider value={finalValue}>{children}</UserDictionaryContext.Provider>;
};
