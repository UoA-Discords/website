import React, { ReactNode, useMemo, useState } from 'react';
import { Link, SxProps, Theme } from '@mui/material';
import ExitingSiteModal from '../Modals/ExitingSite';

/** URL's with hostnames equal to any of these are exempt from showing a warning when clicked on. */
const whitelistedSites = new Set([`discord.com`, `localhost`]);

/** A link to a page on a different site. */
const ExternalLink = ({
    href,
    children,
    style,
    underline,
    target,
    skipMask,
}: {
    href: string;
    children: ReactNode;
    style?: SxProps<Theme>;
    underline?: `none` | `hover` | `always`;
    target?: React.HTMLAttributeAnchorTarget;
    skipMask?: boolean;
}) => {
    const [modalOpen, setModalOpen] = useState(false);

    const isWhitelisted = useMemo(() => whitelistedSites.has(new URL(href).hostname), [href]);

    return (
        <>
            <Link
                onClick={(e) => {
                    if (!isWhitelisted && !skipMask) {
                        e.preventDefault();
                        setModalOpen(true);
                    }
                }}
                className="externalLink link"
                href={href}
                underline={underline ?? `hover`}
                sx={{ ...style }}
                rel="noreferrer"
                target={target ?? `_blank`}
            >
                {children}
            </Link>
            <ExitingSiteModal open={modalOpen} handleClose={() => setModalOpen(false)} href={href} />
        </>
    );
};

export default ExternalLink;
