import { Chip, Grid, GridProps } from '@mui/material';
import { EntryFacultyTags } from '../../shared/Types/Entries';

const AllTags: EntryFacultyTags[] = [
    EntryFacultyTags.Arts,
    EntryFacultyTags.Business,
    EntryFacultyTags.Club,
    EntryFacultyTags.ComputerScience,
    EntryFacultyTags.CreativeArts,
    EntryFacultyTags.Education,
    EntryFacultyTags.Engineering,
    EntryFacultyTags.HealthAndMedicine,
    EntryFacultyTags.Law,
    EntryFacultyTags.Research,
    EntryFacultyTags.Science,
    EntryFacultyTags.Statistics,
];

interface TagSelectorProps {
    selectedTags: EntryFacultyTags[];
    gridProps?: GridProps;
    handleAdd: (tag: EntryFacultyTags) => void;
    handleRemove: (tag: EntryFacultyTags) => void;
}

export function tagToString(tag: EntryFacultyTags): string {
    const input = EntryFacultyTags[tag]!;
    let output = input.charAt(0);

    for (let i = 1, len = input.length; i < len; i++) {
        const charCode = input.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            output += ` `;
        }
        output += input.charAt(i);
    }

    return output.replaceAll(`And`, `&`);
}

const TagSelector = ({ gridProps, selectedTags, handleAdd, handleRemove }: TagSelectorProps) => {
    return (
        <Grid container spacing={1} {...gridProps}>
            {AllTags.map((e) => {
                const selected = selectedTags.includes(e);

                return (
                    <Grid item key={e}>
                        <Chip
                            label={tagToString(e)}
                            variant="outlined"
                            color={selected ? `primary` : `default`}
                            clickable
                            onClick={() => (selected ? handleRemove(e) : handleAdd(e))}
                            sx={{ borderRadius: 0.5 }}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default TagSelector;
