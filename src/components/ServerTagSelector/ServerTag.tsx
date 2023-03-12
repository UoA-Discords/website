import { Chip } from '@mui/material';
import { FC } from 'react';
import { serverTagMap } from '../../helpers/serverTagMap';
import { ServerTags } from '../../types/Server/ServerTags';

export interface ServerTagProps {
    value: ServerTags;
    selected: boolean;
    onClick?: () => void;
}

export const ServerTag: FC<ServerTagProps> = ({ value, selected, onClick }) => (
    <Chip
        variant="filled"
        label={serverTagMap[value].displayName}
        title={
            selected && onClick !== undefined
                ? `${serverTagMap[value].description}\nClick to remove`
                : serverTagMap[value].description
        }
        style={{
            backgroundColor: selected ? (value === ServerTags.Partnered ? 'rgb(33, 68, 192)' : '#7289da') : '#40444b',
            color: selected ? '#fff' : '#bdbec2',
            borderRadius: 0.5,
        }}
        {...(onClick !== undefined ? { onClick } : {})}
    />
);
