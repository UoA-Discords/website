import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreateIcon from '@mui/icons-material/Create';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import { ReactNode } from 'react';
import Nacho from '../images/Nacho.png';
import { UserPermissions } from '../types/User/UserPermissions';

export const badgeIconMap: Record<UserPermissions, { label: string; title: string; icon: ReactNode }> = {
    [UserPermissions.Favourite]: {
        icon: <StarIcon htmlColor="gold"></StarIcon>,
        label: 'Favouriter',
        title: 'Can favourite/unfavourite a server',
    },
    [UserPermissions.Feature]: {
        icon: <AutoAwesomeIcon htmlColor="gold" />,
        label: 'Featurer',
        title: 'Can feature/unfeature servers',
    },
    [UserPermissions.MakeApplications]: {
        icon: <CreateIcon color="success" />,
        label: 'Uploader',
        title: 'Can submit 1 server at a time',
    },
    [UserPermissions.MakeLotsOfApplications]: {
        icon: <CreateIcon color="secondary" />,
        label: 'Verified Uploader',
        title: 'Can submit up to 10 servers at a time',
    },
    [UserPermissions.ManageServers]: {
        icon: <GavelIcon color="info" />,
        label: 'Auditor',
        title: 'Can edit server tags and visbility',
    },
    [UserPermissions.ManageUsers]: {
        icon: <SecurityIcon color="warning" />,
        label: 'Admin',
        title: 'Can edit user permissions',
    },
    [UserPermissions.Owner]: {
        icon: <img src={Nacho} width={24} height={24} alt="sussus amongus" />,
        label: 'Owner',
        title: 'Owns the site',
    },
};
