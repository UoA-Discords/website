import { InputUnstyled } from '@mui/base';
import { Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';
import LightTooltip from '../Tooltips/LightTooltip';
import TagSelector from '../TagSelector';
import { EntryFacultyTags } from '../../shared/Types/Entries';

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

    const handleFilteringByTag = useCallback(
        (entry: string): boolean => {
            if (selectedTags.length === 0) return true;
            const approvedEntry = allEntries[entry]!;
            return approvedEntry.facultyTags.some((tag) => selectedTags.includes(tag));
        },
        [selectedTags, allEntries],
    );

    useEffect(() => {
        if (selectedTags.length === 0) {
            handleTextSearch();
        } else {
            dispatch(setVisibleEntries(Object.keys(allEntries).filter(handleFilteringByTag)));
        }
        // It complains about missing the visibleEntries dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTags, allEntries, dispatch, handleFilteringByTag]);

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

    const handleTextSearch = useCallback(() => {
        const finalSearchTerm = searchTerm.trim().toLowerCase();
        const filteredEntries =
            finalSearchTerm.length === 0
                ? Object.keys(allEntries)
                : Object.keys(allEntries).filter((e) => {
                      const entry = allEntries[e]!;
                      if (entry.guildData.name.toLowerCase().includes(finalSearchTerm)) return true;
                      if (entry.inviteCode.toLowerCase().includes(finalSearchTerm)) return true;
                      return false;
                  });

        if (selectedTags.length === 0) {
            dispatch(setVisibleEntries(filteredEntries));
        } else {
            dispatch(setVisibleEntries(filteredEntries.filter(handleFilteringByTag)));
        }
    }, [searchTerm, allEntries, selectedTags.length, dispatch, handleFilteringByTag]);

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
                                if (e.key === `Enter`) handleTextSearch();
                            }}
                        />
                    </div>
                    <LightTooltip title={<Typography>Search</Typography>}>
                        <span>
                            <IconButton
                                disabled={!searchTerm.length}
                                onClick={handleTextSearch}
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
