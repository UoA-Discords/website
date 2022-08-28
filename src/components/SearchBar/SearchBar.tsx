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
import { getAllEntries, getVisibleEntries, setVisibleEntries } from '../../redux/slices/entryManager';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = () => {
    const dispatch = useDispatch();
    const allEntries = useSelector(getAllEntries);
    const visibleEntries = useSelector(getVisibleEntries);

    const [fullView, setFullView] = useState(false);

    const [searchTerm, setSearchTerm] = useState(``);

    const [selectedTags, setSelectedTags] = useState<EntryFacultyTags[]>([]);

    const debouncedSelectedTags = useDebounce(selectedTags, 300);

    useEffect(() => {
        if (debouncedSelectedTags.length === 0) {
            handleTextSearch();
        } else {
            dispatch(setVisibleEntries(visibleEntries.filter(handleFilteringByTag)));
        }
        // It complains about missing the visibleEntries dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSelectedTags, allEntries, dispatch]);

    const handleFilteringByTag = useCallback(
        (entry: string): boolean => {
            if (debouncedSelectedTags.length === 0) return true;
            const approvedEntry = allEntries[entry];
            return approvedEntry.facultyTags.some((tag) => debouncedSelectedTags.includes(tag));
        },
        [debouncedSelectedTags, allEntries],
    );

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

        if (debouncedSelectedTags.length === 0) {
            dispatch(setVisibleEntries(filteredEntries));
        } else {
            dispatch(setVisibleEntries(filteredEntries.filter(handleFilteringByTag)));
        }
    }, [searchTerm, allEntries, debouncedSelectedTags.length, dispatch, handleFilteringByTag]);

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
                            <IconButton disabled={!searchTerm.length} onClick={handleTextSearch}>
                                <SearchIcon />
                            </IconButton>
                        </span>
                    </LightTooltip>
                    <LightTooltip
                        placement="right"
                        title={<Typography>{fullView ? `Less Options` : `More Options`}</Typography>}
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
