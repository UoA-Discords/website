import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Link as StyledLink, SxProps, Theme } from '@mui/material';

/** A link to a page on the same site. */
const InternalLink = ({
    href,
    children,
    style,
    underline,
}: {
    href: string;
    children: ReactNode;
    style?: SxProps<Theme>;
    underline?: `none` | `hover` | `always`;
}) => {
    return (
        <StyledLink className="internalLink link" component="span" underline={underline ?? `hover`} sx={{ ...style }}>
            <Link
                to={href}
                style={{ color: `inherit`, textDecoration: `inherit` }}
                onClick={
                    href.includes(`#`)
                        ? () => {
                              document
                                  .getElementById(new URL(`${window.location.origin}/${href}`).hash.slice(1))
                                  ?.scrollIntoView({ behavior: `smooth` });
                          }
                        : undefined
                }
            >
                {children}
            </Link>
        </StyledLink>
    );
};

export default InternalLink;
