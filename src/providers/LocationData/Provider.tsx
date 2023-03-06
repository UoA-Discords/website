import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { ILocationDataContext, LocationDataContext } from '../../contexts/LocationData';

export const LocationDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState<ReactNode>('');
    const [description, setDescription] = useState<string | { text: string; to: string }[]>('');

    const setLocationData = useCallback<ILocationDataContext['setLocationData']>((title, description) => {
        setTitle(title);
        setDescription(typeof description === 'string' ? description : [{ text: 'Home', to: '/' }, ...description]);
    }, []);

    const finalValue = useMemo<ILocationDataContext>(
        () => ({
            title,
            description,
            setLocationData,
        }),
        [description, setLocationData, title],
    );

    return <LocationDataContext.Provider value={finalValue}>{children}</LocationDataContext.Provider>;
};
