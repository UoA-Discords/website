import { ServerTags } from '../types/Server/ServerTags';

export const serverTagMap: Record<
    ServerTags,
    {
        displayName: string;
        description: string;
    }
> = {
    [ServerTags.Arts]: {
        displayName: 'Arts',
        description: 'Humanities, social sciences, languages, and indigenous studies.',
    },
    [ServerTags.Business]: {
        displayName: 'Business',
        description: 'Topics that are forward-focused and relevant to the commercial world.',
    },
    [ServerTags.Club]: {
        displayName: 'Club',
        description: 'The main focus of this server is a club (e.g. UoA Esports).',
    },
    [ServerTags.ComputerScience]: {
        displayName: 'Computer Science',
        description: 'Since CompSci students are terminally online, they can have their own tag :)',
    },
    [ServerTags.CreativeArts]: {
        displayName: 'Creative Arts',
        description: 'Creativity, research, teaching and practice.',
    },
    [ServerTags.Education]: {
        displayName: 'Education',
        description: 'Education and social services.',
    },
    [ServerTags.Engineering]: {
        displayName: 'Engineering',
        description: 'Improving the quality of life in national and global communities.',
    },
    [ServerTags.Law]: {
        displayName: 'Law',
        description: 'Law',
    },
    [ServerTags.HealthAndMedicine]: {
        displayName: 'Health and Medicine',
        description: 'Health and Medicine',
    },
    [ServerTags.Research]: {
        displayName: 'Research',
        description: 'Cross-disciplinary research.',
    },
    [ServerTags.Science]: {
        displayName: 'Science',
        description: 'Science',
    },
    [ServerTags.Statistics]: {
        displayName: 'Statistics',
        description: 'Statistics',
    },
    [ServerTags.Partnered]: {
        displayName: 'Partnered',
        description: 'Partnered with the UoA Discords organization.',
    },
};
