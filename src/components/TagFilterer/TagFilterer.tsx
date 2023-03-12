import { Button, Container, Paper, Stack, Switch, Typography } from '@mui/material';
import { FC, useCallback, useMemo, useState } from 'react';
import { ServerTagSelector } from '../../components/ServerTagSelector';
import { ServerTagSearchOptions } from '../../types/Server/ServerTagSearchOptions';
import { ServerTags } from '../../types/Server/ServerTags';

export interface TagFiltererProps {
    onApply: (searchInfo: ServerTagSearchOptions) => void;
    onUnapply: () => void;
}

export const TagFilterer: FC<TagFiltererProps> = ({ onApply, onUnapply }) => {
    const [filterTags, setFilterTags] = useState<ServerTags>(0);
    const [tagJoinType, setTagJoinType] = useState<ServerTagSearchOptions['type']>('and');

    const [applied, setApplied] = useState(false);
    const [appliedWith, setAppliedWith] = useState<ServerTagSearchOptions>();

    const dirty = useMemo(
        () => appliedWith === undefined || appliedWith.tags !== filterTags || appliedWith.type !== tagJoinType,
        [appliedWith, filterTags, tagJoinType],
    );

    const submittable = useMemo(() => filterTags > 0, [filterTags]);

    const handleTagsChange = useCallback((newTags: ServerTags) => {
        setFilterTags(newTags);
    }, []);

    const handleApply = useCallback(() => {
        setApplied(true);
        setAppliedWith({ tags: filterTags, type: tagJoinType });
        onApply({ tags: filterTags, type: tagJoinType });
    }, [filterTags, onApply, tagJoinType]);

    const handleUnapply = useCallback(() => {
        setApplied(false);
        setAppliedWith(undefined);
        setFilterTags(0);
        setTagJoinType('and');
        onUnapply();
    }, [onUnapply]);

    const handleReset = useCallback(() => {
        setFilterTags(appliedWith?.tags ?? 0);
        setTagJoinType(appliedWith?.type ?? 'and');
    }, [appliedWith?.tags, appliedWith?.type]);

    return (
        <Container maxWidth="md">
            <Paper elevation={2} square sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Select tags to filter:
                </Typography>
                <ServerTagSelector tags={filterTags} onTagsChange={handleTagsChange} fromAll />

                <Stack
                    direction="row"
                    gap={1}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 1 }}
                    flexWrap="wrap"
                >
                    <Stack direction="row" alignItems="center">
                        <Typography>Require any</Typography>
                        <Switch
                            checked={tagJoinType === 'and'}
                            onChange={(e) => setTagJoinType(e.target.checked ? 'and' : 'or')}
                        />
                        <Typography>Require all</Typography>
                    </Stack>

                    <Stack direction="row" gap={1}>
                        <Button
                            disabled={!submittable || !dirty}
                            onClick={handleApply}
                            variant="outlined"
                            color="success"
                        >
                            Apply
                        </Button>

                        <Button
                            disabled={appliedWith === undefined || !dirty}
                            onClick={handleReset}
                            variant="outlined"
                            color="warning"
                        >
                            Reset
                        </Button>

                        <Button disabled={!applied} onClick={handleUnapply} variant="outlined" color="error">
                            Clear
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
};
