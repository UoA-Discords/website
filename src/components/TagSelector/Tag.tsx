import { Chip } from '@mui/material';
import { EntryFacultyTags } from '../../shared/Types/Entries';
import { tagToString } from './TagSelector';

const Tag = ({
    tag,
    isSelected,
    handleClick,
}: {
    tag: EntryFacultyTags;
    isSelected?: boolean;
    handleClick?: VoidFunction;
}) => {
    return (
        <Chip
            label={tagToString(tag)}
            variant="filled"
            color={isSelected ? `primary` : `default`}
            style={{
                backgroundColor: isSelected ? `#7289da` : `#40444b`,
                color: isSelected ? `#fff` : `#bdbec2`,
            }}
            clickable={handleClick !== undefined}
            onClick={handleClick}
            sx={{ borderRadius: 0.5 }}
        />
    );
};

export default Tag;
