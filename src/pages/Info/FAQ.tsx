import React, { ReactNode, useContext, useState } from 'react';
import { Collapse, Grid, Link, Paper, Typography } from '@mui/material';
import { ExternalLink } from '../../components/Links';
import { SettingsContext, UserSessionContext } from '../../contexts';

import DiscordLoginFAQ from '../../images/DiscordLoginFAQ.png';

const Section: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Paper elevation={2} square sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
    </Paper>
);

const Question: React.FC<{ children: ReactNode }> = ({ children }) => <Typography variant="h6">{children}</Typography>;

const Answer: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Typography color="text.secondary">{children}</Typography>
);

export const FAQ: React.FC = () => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { sessionData } = useContext(SettingsContext);

    const [hasExpandedDiscordLoginScreen, setHasExpandedDiscordLoginScreen] = useState(false);

    return (
        <Grid container spacing={1} alignItems="flex-start">
            <Grid item container sm={12} md={6} spacing={1}>
                <Grid item xs={12}>
                    <Section>
                        <Question>Can I put a server on here?</Question>
                        <Answer>
                            Of course!{' '}
                            {loggedInUser === null ? (
                                <>
                                    You'll need to be{' '}
                                    <ExternalLink href={sessionData.oAuthLink} title="Login with Discord">
                                        <Link underline="hover" component="span">
                                            logged in
                                        </Link>
                                    </ExternalLink>{' '}
                                    first however. Before doing so, make sure the server you have in mind follows our
                                    criteria.
                                </>
                            ) : (
                                <>
                                    Simply click your profile icon at the top right of the page, from there you'll see
                                    an 'add server' button.
                                </>
                            )}
                        </Answer>
                    </Section>
                </Grid>
                <Grid item xs={12}>
                    <Section>
                        <Question>How do I get my server featured?</Question>
                        <Answer>Not by asking, that's for sure 😉</Answer>
                    </Section>
                </Grid>
                <Grid item xs={12}>
                    <Section>
                        <Question>How does the Discord login work?</Question>
                        <Answer>
                            We use the recommended{' '}
                            <ExternalLink
                                href="https://discord.com/developers/docs/topics/oauth2"
                                title="Discord OAuth documentation"
                            >
                                <Link component="span" underline="hover">
                                    Discord OAuth2 process
                                </Link>
                            </ExternalLink>
                            . The only data we receive is your ID, username, discriminator, and avatar. You can even
                            verify this yourself by looking at the permissions requested in the{' '}
                            <Link
                                component="span"
                                underline="hover"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setHasExpandedDiscordLoginScreen(!hasExpandedDiscordLoginScreen)}
                            >
                                Discord login screen
                            </Link>{' '}
                            (click to {hasExpandedDiscordLoginScreen ? 'close' : 'open'} preview) and our{' '}
                            <ExternalLink
                                href="https://github.com/UoA-Discords/server-registry-api/blob/main/src/types/User/User.ts"
                                title="Relevant source code"
                            >
                                <Link component="span" underline="hover">
                                    source code
                                </Link>
                            </ExternalLink>
                            .
                        </Answer>
                        <Collapse in={hasExpandedDiscordLoginScreen}>
                            <img src={DiscordLoginFAQ} alt="Discord login screen" style={{ width: '100%' }} />
                        </Collapse>
                    </Section>
                </Grid>
                <Grid item xs={12}>
                    <Section>
                        <Question>What tech stack do you use?</Question>
                        <Answer>
                            Our website is built in Typescript, using React.JS and Material UI.
                            <br />
                            <br />
                            Our server registry API is built in Typescript, using Express and MongoDB.
                            <br />
                            <br />
                            We use GitHub actions for CI and CD, with the website being hosted via Cloudflare Pages and
                            the server being locally hosted.
                        </Answer>
                    </Section>
                </Grid>
            </Grid>
            <Grid item container sm={12} md={6} spacing={1}>
                <Grid item xs={12}>
                    <Section>
                        <Question>What is the criteria for a server to be on the site?</Question>
                        <Answer>
                            The <b>server</b> should:
                            <br />
                            - Be UoA related, exceptions can be made.
                            <br />
                            - Have at least 80 members.
                            <br />
                            - Not have an inappropriate name or icon.
                            <br />
                            <br />
                            The <b>invite</b> to the server should:
                            <br />
                            - Be a permanent invite.
                            <br />- Have an inviter (AKA no vanity URLs).
                        </Answer>
                    </Section>
                </Grid>
                <Grid item xs={12}>
                    <Section>
                        <Question>Can I opt-out/remove my server from this website?</Question>
                        <Answer>Yes, please contact us to get started.</Answer>
                    </Section>
                </Grid>
                <Grid item xs={12}>
                    <Section>
                        <Question>Are you owned by the University of Auckland?</Question>
                        <Answer>Nope, this website is entirely unofficial.</Answer>
                    </Section>
                </Grid>
            </Grid>
        </Grid>
    );
};