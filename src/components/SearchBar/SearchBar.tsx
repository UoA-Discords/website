import { InputUnstyled } from '@mui/base';
import { Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';
import LightTooltip from '../Tooltips/LightTooltip';
import TagSelector from '../TagSelector';
import { EntryFacultyTags, EntryStates, FullEntry } from '../../shared/Types/Entries';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEntries, setVisibleEntries } from '../../redux/slices/entryManager';

const SearchBar = () => {
    const dispatch = useDispatch();
    const allEntries = useSelector(getAllEntries);

    const [fullView, setFullView] = useState(false);

    const [searchTerm, setSearchTerm] = useState(``);

    const [selectedTags, setSelectedTags] = useState<EntryFacultyTags[]>([]);

    const doSearch = useCallback(() => {
        const finalSearchTerm = searchTerm.trim().toLowerCase();

        type SearchFunction = (e: FullEntry<EntryStates.Approved | EntryStates.Featured>) => boolean;

        const matchesText: SearchFunction = (entry) => {
            if (entry.guildData.name.toLowerCase().includes(finalSearchTerm)) return true;
            if (entry.inviteCode.toLowerCase().includes(finalSearchTerm)) return true;
            return false;
        };

        const matchesAllTags: SearchFunction = (entry) => selectedTags.every((e) => entry.facultyTags.includes(e));

        dispatch(
            setVisibleEntries(
                Object.keys(allEntries).filter((id) => {
                    const entry = allEntries[id];
                    return matchesText(entry) && matchesAllTags(entry);
                }),
            ),
        );
    }, [allEntries, dispatch, searchTerm, selectedTags]);

    useEffect(() => {
        doSearch();
    }, [doSearch, selectedTags]);

    const handleAddTag = useCallback(
        (tag: EntryFacultyTags) => {
            setSelectedTags([...selectedTags, tag]);
        },
        [selectedTags],
    );

    const handleRemoveTag = useCallback(
        (tag: EntryFacultyTags) => {
            const newTags = [...selectedTags];
            newTags.splice(newTags.indexOf(tag), 1);
            setSelectedTags(newTags);
        },
        [selectedTags],
    );

    return (
        <Paper elevation={2} square>
            <Stack direction="column" sx={{ ml: `0.5rem`, mr: `0.5rem` }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <div style={{ width: `max(300px, 40%)` }}>
                        <InputUnstyled
                            autoComplete="off"
                            id="searchInput"
                            value={searchTerm}
                            placeholder="Search for a Discord Server..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === `Enter`) doSearch();
                            }}
                        />
                    </div>
                    <LightTooltip title={<Typography>Search</Typography>}>
                        <span>
                            <IconButton
                                disabled={!searchTerm.length}
                                onClick={doSearch}
                                sx={{ color: searchTerm.length > 0 ? `#b9bbbe` : `#656565` }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </span>
                    </LightTooltip>
                    <LightTooltip
                        placement="right"
                        style={{ color: `#b9bbbe` }}
                        title={<Typography>{fullView ? `Hide Tags` : `Show Tags`}</Typography>}
                    >
                        <IconButton onClick={() => setFullView(!fullView)}>
                            {fullView ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </LightTooltip>
                </Stack>
                <Collapse in={fullView}>
                    <TagSelector
                        selectedTags={selectedTags}
                        handleAdd={handleAddTag}
                        handleRemove={handleRemoveTag}
                        gridProps={{ sx: { width: `max(300px, 40%)`, pb: 1, pl: `0.3em` } }}
                    />
                </Collapse>
            </Stack>
        </Paper>
    );
};

export default SearchBar;
