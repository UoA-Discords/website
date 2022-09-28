import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import StyledLink from '@mui/material/Link';

/** A link to a page on the same site. */
const InternalLink = ({
    href,
    children,
    style,
    underline,
}: {
    href: string;
    children: ReactNode;
    style?: React.CSSProperties;
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
