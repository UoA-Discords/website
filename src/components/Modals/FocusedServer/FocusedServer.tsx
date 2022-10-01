import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllEntries, getDoneInitialLoad } from '../../../redux/slices/entryManager';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';
import SelectedServerDialog from '../../Dialogs/SelectedServer';
import ServerNotFoundModal from './ServerNotFound';

enum FocusedServerStates {
    /** A server was not found in the URL query string (`?server=someId`). */
    NotSpecified,
    /** A server was specified in the URL query string, but we haven't loaded entries yet. */
    Loading,
    /** A specified server was not found among the loaded entries. */
    NotFound,
    /** A specified server was found among the loaded entries. */
    Found,
}

interface FocusedServerNotSpecified {
    state: FocusedServerStates.NotSpecified;
}

interface FocusedServerLoadingOrNotFound {
    state: FocusedServerStates.Loading | FocusedServerStates.NotFound;
    id: string;
}

interface FocusedServerFound {
    state: FocusedServerStates.Found;
    payload: FullEntry<EntryStates.Approved | EntryStates.Featured>;
}

type FocusedServer = FocusedServerNotSpecified | FocusedServerLoadingOrNotFound | FocusedServerFound;

function getServerIdFromUrl(): string | null {
    const keyIndex = window.location.search.indexOf(`?server=`);
    if (keyIndex === -1) return null;

    const matchedIds = new RegExp(/[0-9]{1,}/).exec(window.location.search.slice(keyIndex + `?server=`.length));
    return matchedIds?.at(0) ?? null;
}

const FocusedServerModal = () => {
    const allEntries = useSelector(getAllEntries);
    const doneInitialLoad = useSelector(getDoneInitialLoad);

    const requestedServerId = useMemo(() => getServerIdFromUrl(), []);

    const [focusedServer, setFocusedServer] = useState<FocusedServer>({
        state: FocusedServerStates.NotSpecified,
    });

    useEffect(() => {
        if (focusedServer.state >= FocusedServerStates.NotFound) return;

        if (requestedServerId === null) setFocusedServer({ state: FocusedServerStates.NotSpecified });
        else if (!doneInitialLoad) setFocusedServer({ state: FocusedServerStates.Loading, id: requestedServerId });
        else {
            const entry = allEntries[requestedServerId];
            if (entry === undefined) setFocusedServer({ state: FocusedServerStates.NotFound, id: requestedServerId });
            else {
                setFocusedServer({ state: FocusedServerStates.Found, payload: entry });
                setOpen(true);
            }
        }
    }, [allEntries, doneInitialLoad, focusedServer.state, requestedServerId]);

    const [open, setOpen] = useState(false);

    switch (focusedServer.state) {
        case FocusedServerStates.NotSpecified:
        case FocusedServerStates.Loading:
            return <></>;
        case FocusedServerStates.NotFound:
            return <ServerNotFoundModal id={focusedServer.id} />;
        default:
            return <SelectedServerDialog entry={focusedServer.payload} open={open} onClose={() => setOpen(false)} />;
    }
};

export default FocusedServerModal;
