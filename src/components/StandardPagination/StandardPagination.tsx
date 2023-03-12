import { Pagination, useMediaQuery, useTheme } from '@mui/material';
import { FC, useCallback, useMemo } from 'react';
import { PaginationParams } from '../../types/Page';

export interface StandardPaginationProps extends PaginationParams {
    totalItemCount: number | undefined;
    onChange: (newPage: number) => void;
}

export const StandardPagination: FC<StandardPaginationProps> = (props) => {
    const { page, perPage, totalItemCount, onChange } = props;

    const pageCount = useMemo(() => Math.ceil((totalItemCount ?? 0) / perPage), [perPage, totalItemCount]);

    const theme = useTheme();

    const small = useMediaQuery(theme.breakpoints.down('sm'));

    const size = useMemo<'small' | 'medium' | 'large'>(() => (small ? 'small' : 'large'), [small]);

    // MUI pagination displays pages using a 1-based index
    const displayedPage = useMemo(() => page + 1, [page]);

    const handleChange = useCallback(
        (_event: React.ChangeEvent<unknown>, newPage: number) => {
            // MUI pagination does pagination using a 1-based index, so we need to correct for this
            onChange(newPage - 1);
        },
        [onChange],
    );

    return (
        <Pagination
            variant="outlined"
            shape="rounded"
            size={size}
            count={pageCount}
            page={displayedPage}
            onChange={handleChange}
        />
    );
};
