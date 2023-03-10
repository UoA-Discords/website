import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Fade, Grid, IconButton, ListItemButton, Paper, Stack, Typography } from '@mui/material';
import { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../../Page.styled';
import { ExternalLinkStyled, InternalLinkStyled } from '../../components/Links';
import { SettingsContext } from '../../contexts';
import { LocationDataContext } from '../../contexts/LocationData';
import { FAQ } from './FAQ';

interface SectionProps {
    title: string;
    forcedId?: string;
    focussedId: string;
    onLink: (id: string) => void;
    children: ReactNode;
}

const Section: FC<SectionProps> = (props) => {
    const { title, forcedId, focussedId, onLink, children } = props;

    const [isHovered, setIsHovered] = useState(false);

    const sectionId = useMemo(() => forcedId ?? title.toLowerCase().replaceAll(/\s/g, '_'), [title, forcedId]);

    const isFocussed = useMemo(() => focussedId === `#${sectionId}`, [focussedId, sectionId]);

    return (
        <Paper elevation={12} sx={{ p: 2, m: 1 }}>
            <div
                onMouseOver={() => isHovered || setIsHovered(true)}
                onMouseLeave={() => !isHovered || setIsHovered(false)}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        id={sectionId}
                        sx={{ backgroundColor: isFocussed ? 'rgba(255, 255, 0, 0.5)' : undefined }}
                    >
                        {title}
                    </Typography>
                    <Fade in={isHovered}>
                        <IconButton
                            size="small"
                            onClick={() => onLink(sectionId)}
                            title={isFocussed ? 'Remove link to this section' : 'Create a link to this section'}
                        >
                            {isFocussed ? <LinkOffIcon color="disabled" /> : <LinkIcon color="disabled" />}
                        </IconButton>
                    </Fade>
                </Stack>
                {children}
            </div>
        </Paper>
    );
};

export const InfoPage: FC = () => {
    const { setLocationData } = useContext(LocationDataContext);
    const { settings } = useContext(SettingsContext);

    const [focussedId, setFocussedId] = useState(window.location.hash);

    const [text] = useState(() => {
        const randomChance = 1 + Math.floor(Math.random() * 100); // 1 to 100 (inclusive)
        if (randomChance <= 5) return 'Among Us ඞ'; // 5% chance
        return 'About Us';
    });

    const onLink = useCallback(
        (id: string) => {
            if (focussedId === `#${id}`) {
                setFocussedId('');
                window.history.pushState('', document.title, window.location.pathname + window.location.search);
                return;
            }

            setFocussedId(`#${id}`);
            window.history.replaceState(null, '', `#${id}`);
        },
        [focussedId],
    );

    const smoothScrollToId = useCallback((idWithHash: string) => {
        document.querySelector(idWithHash)?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        setLocationData('Site Information', [{ to: '/info', text: 'Info' }]);
    }, [setLocationData]);

    useEffect(() => {
        if (window.location.hash === '') return;
        smoothScrollToId(window.location.hash);
    }, [smoothScrollToId]);

    return (
        <Page sx={{ alignItems: 'stretch' }}>
            <Grid container>
                {['About Us', 'FAQ', 'Site Policy', 'Contact'].map((e) => (
                    <Grid item xs={3} key={e}>
                        <ListItemButton
                            onClick={(a) => {
                                a.preventDefault();
                                smoothScrollToId('#' + e.toLowerCase().replaceAll(/\s/g, '_'));
                            }}
                        >
                            <Typography variant="h6" width="100%" textAlign="center">
                                {e}
                            </Typography>
                        </ListItemButton>
                    </Grid>
                ))}
            </Grid>

            <Section title={text} forcedId="about_us" focussedId={focussedId} onLink={onLink}>
                <Typography>
                    UoA Discords is a project to make Discord servers for the University of Auckland more accessible. By
                    grouping and categorizing all these servers in one place, students can find, share, and promote
                    their communities with ease.
                    <br />
                    <br />
                    The UoA Discords project consists of 2 primary services: our{' '}
                    <InternalLinkStyled to="/">website</InternalLinkStyled> which interfaces our API, and our{' '}
                    <ExternalLinkStyled href={settings.serverUrl} title="Our server registry API endpoint">
                        server registry API
                    </ExternalLinkStyled>{' '}
                    which actually does the storing, searching, and general management of the Discord servers.
                    <br />
                    All of our services are{' '}
                    <ExternalLinkStyled
                        href="https://github.com/orgs/UoA-Discords/repositories"
                        title="Our GitHub repositories"
                    >
                        entirely open source
                    </ExternalLinkStyled>
                    .
                </Typography>
            </Section>

            <Section title="FAQ" focussedId={focussedId} onLink={onLink}>
                <FAQ onLink={onLink} />
            </Section>

            <Section title="Site Policy" focussedId={focussedId} onLink={onLink}>
                <Typography>
                    Please behave responsibly while using our services by following the Discord{' '}
                    <ExternalLinkStyled href="https://discord.com/guidelines" title="Discord community guidelines">
                        community guidelines
                    </ExternalLinkStyled>
                    . Exploiting or otherwise abusing our services may lead to your IP being ratelimited, having
                    functionality reduced, or being outright banned. These actions may be taken at our own discretion.
                </Typography>
            </Section>

            <Section title="Contact" focussedId={focussedId} onLink={onLink}>
                <Typography component="div">
                    Our primary point of contact is through our{' '}
                    <ExternalLinkStyled href="https://discord.gg/XmdRWSCy2U" title="Our Discord server">
                        Discord server
                    </ExternalLinkStyled>
                    . We encourage you to do so if you have:
                    <ul>
                        <li>A bug or vulnerability to report.</li>
                        <li>Feedback to give.</li>
                        <li>Suggestions to make.</li>
                        <li>Services to offer, we're always looking to expand our team!</li>
                    </ul>
                    Additionally you can email{' '}
                    <ExternalLinkStyled href="mailto:support@uoa-discords.com" title="Our support email address">
                        support@uoa-discord.com
                    </ExternalLinkStyled>{' '}
                    and{' '}
                    <ExternalLinkStyled href="mailto:devs@uoa-discords.com" title="Our developer email address">
                        devs@uoa-discord.com
                    </ExternalLinkStyled>
                    .<br />
                    We also have a{' '}
                    <ExternalLinkStyled href="https://www.reddit.com/user/UoA-Discords-Team" title="Our Reddit account">
                        Reddit account
                    </ExternalLinkStyled>{' '}
                    and{' '}
                    <ExternalLinkStyled href="https://github.com/UoA-Discords" title="Our GitHub organization">
                        GitHub organization
                    </ExternalLinkStyled>
                    .
                </Typography>
            </Section>
        </Page>
    );
};
