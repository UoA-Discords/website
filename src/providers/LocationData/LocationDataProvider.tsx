import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { ILocationDataContext, LocationDataContext } from '../../contexts';

export const LocationDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState<ILocationDataContext['title']>('');

    const [description, setDescription] = useState<ILocationDataContext['description']>('');

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
