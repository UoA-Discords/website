import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { LoginOrSignupResponse } from '../types/Auth/LoginOrSignupResponse';
import { WithPagination } from '../types/Page';
import { BaseRequestProps } from '../types/Requests';
import { GetAllServersParams } from '../types/Searching/GetAllServersParams';
import { GetAllUsersParams } from '../types/Searching/GetAllUsersParams';
import { Server } from '../types/Server';
import { ServerStatus } from '../types/Server/ServerStatus';
import { ServerTags } from '../types/Server/ServerTags';
import { User } from '../types/User';
import { UserPermissions } from '../types/User/UserPermissions';
import { ISOString, DiscordIdString } from '../types/Utility';

export function makeRequestConfig<T = never>(
    props: BaseRequestProps<boolean, boolean | 'optional'>,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT',
    url?: string,
    data?: T,
    extraHeaders?: Record<string, string>,
): AxiosRequestConfig {
    const { baseURL, controller, rateLimitBypassToken, siteToken } = props;

    const headers = new AxiosHeaders();

    if (rateLimitBypassToken !== undefined && rateLimitBypassToken !== '') {
        headers.set('RateLimit-Bypass-Token', rateLimitBypassToken);
    }

    if (siteToken !== undefined) headers.set('Authorization', `Bearer ${siteToken}`);
    if (extraHeaders !== undefined) {
        for (const headerName of Object.keys(extraHeaders)) {
            headers.set(headerName, extraHeaders[headerName]);
        }
    }

    const config: AxiosRequestConfig = {
        baseURL,
        // cloudflare pages build dies without this assertion
        headers: headers as Exclude<AxiosRequestConfig['headers'], undefined>,
        method,
        data,
    };

    if (url !== undefined) config.url = url;

    if (controller !== undefined) config.signal = controller.signal;

    return config;
}

export async function checkRateLimitResponse(props: BaseRequestProps<true, false>): Promise<void> {
    const config = makeRequestConfig(props, 'GET');

    const { headers } = await axios.request(config);

    if (headers['ratelimit-bypass-response'] !== 'Valid') throw new Error('Invalid rate limit bypass token.');
}

export async function postRoot(props: BaseRequestProps<true, false>): Promise<{
    startTime: ISOString;
    version: string;
    receivedRequest: ISOString;
    numUsers: number;
    numServers: number;
    numPendingServers: number;
}> {
    const config = makeRequestConfig(props, 'POST');

    const { data } = await axios.request(config);
    return data;
}

export async function postLogin(
    props: BaseRequestProps<true, false>,
    code: string,
    redirectUri: string,
): Promise<LoginOrSignupResponse> {
    const config = makeRequestConfig(props, 'POST', '/login', { code, redirect_uri: redirectUri });

    const { data } = await axios.request(config);
    return data;
}

export async function getRefresh(props: BaseRequestProps<true, true>): Promise<LoginOrSignupResponse> {
    const config = makeRequestConfig(props, 'GET', '/refresh');

    const { data } = await axios.request(config);
    return data;
}

export async function getLogout(props: BaseRequestProps<true, true>): Promise<void> {
    const config = makeRequestConfig(props, 'GET', '/logout');

    await axios.request(config);
}

export async function getSelf(props: BaseRequestProps<true, true>): Promise<User> {
    const config = makeRequestConfig(props, 'GET', '/@me');

    const { data } = await axios.request(config);
    return data;
}

export async function getUserById(
    props: BaseRequestProps<true, 'optional'>,
    userId: DiscordIdString,
): Promise<User<'HideIP' | 'ShowIP'>> {
    const config = makeRequestConfig(props, 'GET', `/users/${userId}`);

    const { data } = await axios.request(config);
    return data;
}

export async function patchUserById(
    props: BaseRequestProps<true, true>,
    userId: DiscordIdString,
    newPermissions: UserPermissions,
    reason: string,
): Promise<User<'HideIP' | 'ShowIP'>> {
    const config = makeRequestConfig(props, 'PATCH', `/users/${userId}`, { newPermissions, reason });

    const { data } = await axios.request(config);
    return data;
}

export async function getServerById(
    props: BaseRequestProps<true, 'optional'>,
    serverId: DiscordIdString,
): Promise<Server> {
    const config = makeRequestConfig(props, 'GET', `/servers/${serverId}`);

    const { data } = await axios.request(config);
    return data;
}

export async function patchServerStatusById(
    props: BaseRequestProps<true, true>,
    serverId: DiscordIdString,
    newStatus: ServerStatus,
    reason: string,
): Promise<Server> {
    const config = makeRequestConfig(props, 'PATCH', `/servers/${serverId}/status`, { newStatus, reason });

    const { data } = await axios.request(config);
    return data;
}

export async function patchServerTagsById(
    props: BaseRequestProps<true, true>,
    serverId: DiscordIdString,
    newTags: ServerTags,
): Promise<Server> {
    const config = makeRequestConfig(props, 'PATCH', `/servers/${serverId}/tags`, { newTags });

    const { data } = await axios.request(config);
    return data;
}

export async function searchServers(
    props: BaseRequestProps<true, 'optional'>,
    params: GetAllServersParams,
): Promise<WithPagination<Server>> {
    const config = makeRequestConfig(props, 'POST', '/search/servers', params);

    const { data } = await axios.request(config);
    return data;
}

export async function searchUsers(
    props: BaseRequestProps<true, 'optional'>,
    params: GetAllUsersParams,
): Promise<WithPagination<User<'HideIP' | 'ShowIP'>>> {
    const config = makeRequestConfig(props, 'POST', '/search/users', params);

    const { data } = await axios.request(config);
    return data;
}

export async function putServers(
    props: BaseRequestProps<true, true>,
    inviteCode: string,
    tags: ServerTags,
): Promise<Server> {
    const config = makeRequestConfig(props, 'PUT', '/servers', { inviteCode, tags });

    const { data } = await axios.request(config);
    return data;
}
