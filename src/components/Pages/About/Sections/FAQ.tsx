import { Link, Paper, Tooltip, Typography } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { makeDiscordLoginLink } from '../../../../helpers/makeDiscordLoginLink';
import { getSettings } from '../../../../redux/slices/main';
import { ForceHashLink } from '../../../Footer';

import discordLoginFAQ from '../../../../images/DiscordLoginFAQ.png';

const Question = ({ children }: { children: ReactNode }) => {
    return (
        <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
            {children}
        </Typography>
    );
};

const Answer = ({ children }: { children: ReactNode }) => {
    return <Typography sx={{ ml: 1, pb: 1 }}>{children}</Typography>;
};

const FAQ = () => {
    const [, setOAuthState] = useCookies<`oauth_state`, { oauth_state?: string }>([`oauth_state`]);
    const { discordClientId, redirectURI } = useSelector(getSettings);

    const handleClick = useCallback(() => {
        const { link, state } = makeDiscordLoginLink(discordClientId, redirectURI);
        setOAuthState(`oauth_state`, state, { sameSite: `strict` });
        window.open(link, `_self`);
    }, [discordClientId, redirectURI, setOAuthState]);

    return (
        <Paper sx={{ m: 1, p: 1 }} elevation={12}>
            <Question>Can I put a server on here?</Question>
            <Answer>
                Of course! To do this make sure you are{` `}
                <Link sx={{ cursor: `pointer` }} onClick={handleClick}>
                    logged in
                </Link>
                , click on your profile icon in the top-right, and press the "Add Server" button.
                <br />
                The server does have to be UoA-related though, you can't just add any random server.
            </Answer>
            <Question>How does the Discord login work?</Question>
            <Answer>
                We use the recommended{` `}
                <Link
                    href="https://discord.com/developers/docs/topics/oauth2"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Discord OAuth2 process
                </Link>
                {` `}
                for UoA Discords. The only data we receive is your username, avatar, and banner. You can even{` `}
                <Tooltip title={<img src={discordLoginFAQ} alt="Discord login screen." height="300" />}>
                    <Link>verify this yourself</Link>
                </Tooltip>
                {` `}when logging in.
            </Answer>
            <Question>Can I opt-out my server from this website?</Question>
            <Answer>
                Yes, please{` `}
                <Link component="span">
                    <ForceHashLink to="/about" hash="contact" style={{ color: `inherit` }}>
                        contact us
                    </ForceHashLink>
                </Link>
                {` `}
                to do so.
            </Answer>
            <Question>Why isn't the server I added showing on the website?</Question>
            <Answer>
                Our server application process involves a moderator verifying a submission before it is shown on our
                main page, so if you recently submitted the server you may be waiting on review.
                <br />
                Your submission may have also been rejected, you can view this by clicking on your profile icon, and
                then the "My Applications" button.
            </Answer>
            <Question>Are you owned by University of Auckland?</Question>
            <Answer>Nope, this website is entirely unofficial.</Answer>
        </Paper>
    );
};

export default FAQ;
