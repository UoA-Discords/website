import { ListItemButton, Stack, Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfilePicture } from '../../helpers/getProfilePicture';
import { LoginResponse } from '../../hooks/useSiteLogin';

const DiscordAccountButton = ({ loginResponse }: { loginResponse: LoginResponse }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { src, alt } = getProfilePicture(loginResponse.userData);

    return (
        <Link to="/me" style={{ color: `white` }}>
            <div
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="noSelect"
                style={{
                    position: `absolute`,
                    top: 0,
                    right: 0,
                }}
            >
                <ListItemButton sx={{ borderRadius: `0 0 0 1rem` }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <img src={src} alt={alt} className="discordProfilePicture" height="64" width="64" />
                        <Collapse in={isHovered} orientation="horizontal" sx={{ whiteSpace: `nowrap` }}>
                            {loginResponse.userData.username}
                            <Typography variant="body1" color="gray" sx={{ whiteSpace: `nowrap` }}>
                                View Profile
                            </Typography>
                        </Collapse>
                    </Stack>
                </ListItemButton>
            </div>
        </Link>
    );
};

export default DiscordAccountButton;
