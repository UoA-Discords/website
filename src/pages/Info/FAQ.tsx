import { Button, Collapse, Grid, Link, Paper, Typography } from '@mui/material';
import { FC, ReactNode, useContext, useState } from 'react';
import { ExternalLinkStyled, InternalLinkStyled } from '../../components/Links';
import { ServerUploader } from '../../components/ServerUploader/ServerUploader';
import { SettingsContext, UserSessionContext } from '../../contexts';
import { useCanUpload } from '../../hooks/useCanUpload';
import DiscordLoginFAQ from '../../images/DiscordLoginFAQ.png';

const Section: FC<{ children: ReactNode }> = ({ children }) => (
    <Paper elevation={2} square sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
    </Paper>
);

const Question: FC<{ children: ReactNode }> = ({ children }) => (
    <Typography variant="h6" width="100%">
        {children}
    </Typography>
);

const Answer: FC<{ children: ReactNode }> = ({ children }) => (
    <Typography color="text.secondary" width="100%">
        {children}
    </Typography>
);

export const FAQ: FC<{ onLink: (id: string) => void }> = ({ onLink }) => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { sessionData } = useContext(SettingsContext);

    const canUpload = useCanUpload();

    const [hasExpandedDiscordLoginScreen, setHasExpandedDiscordLoginScreen] = useState(false);
    const [isServerUploaderOpen, setIsServerUploaderOpen] = useState(false);

    return (
        <Grid container spacing={1} alignItems="flex-start">
            <Grid item container sm={12} md={6} spacing={1}>
                <Grid item xs={12}>
                    <Section>
                        <Question>Can I put a server on here?</Question>
                        <Answer>
                            {loggedInUser === null ? (
                                <>
                                    Of course! You'll need to be{' '}
                                    <ExternalLinkStyled href={sessionData.oAuthLink} title="Login with Discord">
                                        logged in
                                    </ExternalLinkStyled>{' '}
                                    first however. Before doing so, make sure the server you have in mind follows our
                                    criteria.
                                </>
                            ) : canUpload ? (
                                <>
                                    Of course! You can do this from your{' '}
                                    <InternalLinkStyled to={`/users/${loggedInUser.user._id}`}>
                                        profile page
                                    </InternalLinkStyled>
                                    , or right here by clicking on the button:{' '}
                                    <ServerUploader
                                        onClose={() => setIsServerUploaderOpen(false)}
                                        open={isServerUploaderOpen}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        sx={{ textTransform: 'none' }}
                                        onClick={() => setIsServerUploaderOpen(true)}
                                    >
                                        Upload Server
                                    </Button>
                                </>
                            ) : (
                                <>
                                    Normally you can, however it seems you don't have permission to upload servers to
                                    our site. This is most likely due to you abusing our services, but you can{' '}
                                    <Link
                                        component="span"
                                        underline="hover"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                                            onLink('contact');
                                        }}
                                    >
                                        contact us
                                    </Link>{' '}
                                    if you believe this is a mistake.
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
                            <ExternalLinkStyled
                                href="https://discord.com/developers/docs/topics/oauth2"
                                title="Discord OAuth documentation"
                            >
                                Discord OAuth2 process
                            </ExternalLinkStyled>
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
                            <ExternalLinkStyled
                                href="https://github.com/UoA-Discords/server-registry-api/blob/main/src/types/User/User.ts"
                                title="Relevant source code"
                            >
                                source code
                            </ExternalLinkStyled>
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
                            Our website is built in{' '}
                            <ExternalLinkStyled href="https://www.typescriptlang.org/" title="Typescript official site">
                                Typescript
                            </ExternalLinkStyled>
                            , using{' '}
                            <ExternalLinkStyled href="https://reactjs.org/" title="React official site">
                                React
                            </ExternalLinkStyled>{' '}
                            and{' '}
                            <ExternalLinkStyled href="https://mui.com/" title="Material UI official site">
                                Material UI
                            </ExternalLinkStyled>
                            .
                            <br />
                            <br />
                            Our server registry API is built in{' '}
                            <ExternalLinkStyled href="https://www.typescriptlang.org/" title="Typescript official site">
                                Typescript
                            </ExternalLinkStyled>
                            , using{' '}
                            <ExternalLinkStyled href="https://expressjs.com/" title="Express official site">
                                Express
                            </ExternalLinkStyled>{' '}
                            and{' '}
                            <ExternalLinkStyled href="https://www.mongodb.com/" title="MongoDB official site">
                                MongoDB
                            </ExternalLinkStyled>
                            .
                            <br />
                            <br />
                            We use{' '}
                            <ExternalLinkStyled
                                href="https://github.com/features/actions"
                                title="Github actions information page"
                            >
                                Github actions
                            </ExternalLinkStyled>{' '}
                            for CI and CD, with the website being hosted via{' '}
                            <ExternalLinkStyled
                                href="https://pages.cloudflare.com/"
                                title="Cloudflare Pages official site"
                            >
                                Cloudflare Pages
                            </ExternalLinkStyled>{' '}
                            and the server being locally hosted.
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
                        <Answer>
                            Yes, please{' '}
                            <Link
                                component="span"
                                underline="hover"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                                    onLink('contact');
                                }}
                            >
                                contact us
                            </Link>{' '}
                            to get started.
                        </Answer>
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
