import { Grid } from '@mui/material';
import { FC, memo } from 'react';
import { splitBitfield } from '../../helpers/splitBitfield';
import {
    ProfileAccordion,
    ProfileAccordionDetails,
    ProfileAccordionSummary,
} from '../../pages/Profile/ProfilePage.styled';
import { ServerTags } from '../../types/Server/ServerTags';
import { ServerTag } from './ServerTag';

export interface ServerTagSelectorProps {
    tags: ServerTags;
    onTagsChange?: (newTags: ServerTags) => void;
}

const allTags = Object.values(ServerTags).filter((e): e is ServerTags => typeof e === 'number');

const _ServerTagSelector: FC<ServerTagSelectorProps> = ({ tags, onTagsChange }) => {
    const splitTags = splitBitfield(tags);

    const tagPool = onTagsChange !== undefined ? allTags : splitTags;

    const handleClick = (tag: ServerTags) => {
        return () => {
            if (onTagsChange === undefined) return;
            if (splitTags.includes(tag)) onTagsChange(tags ^ tag);
            else onTagsChange(tags | tag);
        };
    };

    return (
        <ProfileAccordion defaultExpanded>
            <ProfileAccordionSummary>Edit Tags</ProfileAccordionSummary>
            <ProfileAccordionDetails sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                <Grid container spacing={0.5}>
                    {tagPool.map((e) => (
                        <Grid item key={e}>
                            <ServerTag key={e} value={e} selected={splitTags.includes(e)} onClick={handleClick(e)} />
                        </Grid>
                    ))}
                </Grid>
            </ProfileAccordionDetails>
        </ProfileAccordion>
    );
};

export const ServerTagSelector = memo(_ServerTagSelector);