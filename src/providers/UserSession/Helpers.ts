import { UserSession } from '../../contexts';

const KEY_USER_SESSION = 'UOA_DISCORDS.UserSession';

/** Retrieves the current user session from {@link localStorage} if it exists. */
export function getLocalUserSession(): UserSession | null {
    const existing = localStorage.getItem(KEY_USER_SESSION);

    if (existing === null) return null;

    return JSON.parse(existing);
}

/**
 * Saves the current user session to {@link localStorage}.
 *
 * Alternatively, will clear the stored user session if `null` is passed (e.g. on logout).
 */
export function saveLocalUserSession(u: UserSession | null): void {
    if (u === null) localStorage.removeItem(KEY_USER_SESSION);
    else localStorage.setItem(KEY_USER_SESSION, JSON.stringify(u));
}
