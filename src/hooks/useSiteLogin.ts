import { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { SiteUser } from '../shared/Types/User';

export interface LoginResponse {
    discordAuth: RESTPostOAuth2AccessTokenResult;
    siteAuth: string;
    userData: SiteUser;
    issuedAt: number;
}

export function useSiteLogin() {
    const [{ loginResponse }, setLoginResponse, removeLoginResponse] = useCookies<
        `loginResponse`,
        { loginResponse?: LoginResponse }
    >([`loginResponse`]);

    const setUserData = useCallback(
        (payload: LoginResponse) => {
            setLoginResponse(`loginResponse`, payload, { sameSite: `strict` });
        },
        [setLoginResponse],
    );

    const clearUserData = useCallback(() => {
        removeLoginResponse(`loginResponse`);
    }, [removeLoginResponse]);

    return { loginResponse, setUserData, clearUserData };
}
