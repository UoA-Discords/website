import { api } from '../../api';
import { AnyExpectedError } from '../../types/Responses';

type RootResponse = Awaited<ReturnType<typeof api.postRoot>>;

export interface IMainStateContext {
    /** The latest error received from the server registry API. */
    latestError: { recognized: true; value: AnyExpectedError } | { recognized: false; value: unknown } | null;

    /** The latest information response received from the server registry API. */
    latestServerResponse: RootResponse | null;

    /** The way the {@link latestError} should be displayed on the site. */
    globalErrorDisplayType: 'dialog' | 'inline';

    /**
     * Sets the {@link latestError} object, returns true if the error supplied is an actual error and not a
     * `CanceledError`.
     */
    setLatestError: (error: unknown) => boolean;

    setLatestServerResponse: (response: RootResponse) => void;

    setGlobalErrorDisplayType: (type: 'dialog' | 'inline') => void;
}
