import { Grid, GridProps, Box } from '@mui/material';
import { EntryFacultyTags } from '../../shared/Types/Entries';
import FacultyTag from './FacultyTag';

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
        <Box sx={{ width: 1, pb: 1 }}>
            <Grid container spacing={1} {...gridProps}>
                {AllTags.map((e) => {
                    const isSelected = selectedTags.includes(e);

                    return (
                        <Grid item key={e}>
                            <FacultyTag
                                tag={e}
                                isSelected={isSelected}
                                handleClick={() => (isSelected ? handleRemove(e) : handleAdd(e))}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default TagSelector;
