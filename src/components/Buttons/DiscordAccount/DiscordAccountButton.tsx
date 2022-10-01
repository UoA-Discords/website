import { ListItemButton, Stack, Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { LoginResponse } from '../../../hooks/useSiteLogin';
import UserIcon from '../../UserIcon';
import ManageAccountPage from './ManageAccountPage';

const DiscordAccountButton = ({ loginResponse }: { loginResponse: LoginResponse }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
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
            <ListItemButton sx={{ borderRadius: `0 0 0 1rem` }} onClick={() => setIsOpen(!isOpen)}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <UserIcon user={loginResponse.userData} />
                    <Collapse in={isHovered} orientation="horizontal" sx={{ whiteSpace: `nowrap` }}>
                        {loginResponse.userData.username}
                        <Typography variant="body1" color="gray" sx={{ whiteSpace: `nowrap` }}>
                            Manage Account
                        </Typography>
                    </Collapse>
                </Stack>
            </ListItemButton>
            {isOpen && <ManageAccountPage />}
        </div>
    );
};

export default DiscordAccountButton;
