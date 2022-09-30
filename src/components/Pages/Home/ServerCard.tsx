import { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, Grow, Stack, Typography } from '@mui/material';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';
import FacultyTag from '../../TagSelector/FacultyTag';
import GuildIcon from '../../GuildIcon';
import SelectedServerModal from '../../Modals/SelectedServer';
import LikeButton from '../../Buttons/LikeButton';
import './ServerCard.css';

const ServerCard = ({
    server,
    index,
}: {
    server: FullEntry<EntryStates.Approved | EntryStates.Featured>;
    index: number;
}) => {
    const [shouldFadeIn, setShouldFadeIn] = useState(false);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShouldFadeIn(true), index * 40);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <Grow in={shouldFadeIn}>
            <div className={server.state === EntryStates.Featured ? `featuredServerCard` : undefined}>
                {server.state === EntryStates.Featured && (
                    <>
                        <span className="orbiter orbiter1" />
                        <span className="orbiter orbiter2" />
                        <span className="orbiter orbiter3" />
                        <span className="orbiter orbiter4" />
                    </>
                )}
                <Card
                    sx={{
                        position: `relative`,
                        zIndex: 1,
                        height: `100%`,
                    }}
                >
                    <CardActionArea
                        disableRipple
                        sx={{ display: `flex`, justifyContent: `flex-start`, height: `100%` }}
                        onClick={() => setOpen(true)}
                    >
                        <GuildIcon server={server} />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h5">{server.guildData.name}</Typography>
                            <Typography color="text.secondary">
                                {server.memberCountHistory.at(-1)?.[1] ?? `?`} Members (
                                {server.memberCountHistory.at(-1)?.[0] ?? `?`} Online)
                            </Typography>
                            <Stack direction="row" gap={1} mt={0.5}>
                                {server.facultyTags.map((tag, i) => (
                                    <FacultyTag tag={tag} key={i} />
                                ))}
                            </Stack>
                        </CardContent>
                        <LikeButton
                            entryId={server.id}
                            entryLikes={server.likes}
                            sx={{ position: `absolute`, right: 0, bottom: 0 }}
                        />
                    </CardActionArea>
                    <SelectedServerModal entry={server} open={open} onClose={() => setOpen(false)} />
                </Card>
            </div>
        </Grow>
    );
};

export default ServerCard;
