import { Stepper, Step, StepLabel, StepContent, Typography } from '@mui/material';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';

// tooltips
import InfoCardTooltip from '../../Tooltips/InfoCardTooltip';
import TimestampTooltip from '../../Tooltips/TimestampTooltip';

// icons
import InviteCreatedIcon from '@mui/icons-material/Link';
import SubmittedIcon from '@mui/icons-material/AddBox';
import ApprovedIcon from '@mui/icons-material/Check';

/**
 * Lists event of an entry, such as:
 *
 * - Invite code created.
 * - Submitted to site.
 * - Approved/denied/whatever it's latest state is.
 *
 * Will not show invite creation data if the user is the same as the one who submitted it to the site.
 */
const ServerTimeline = ({ entry }: { entry: FullEntry<Exclude<EntryStates, EntryStates.Pending>> }) => {
    return (
        <Stepper orientation="vertical">
            {entry.inviteCreatedBy !== null && entry.inviteCreatedBy.id !== entry.createdBy.id && (
                <Step completed active>
                    <StepLabel icon={<InviteCreatedIcon />}>
                        <Typography>
                            Invite by{` `}
                            <InfoCardTooltip tooltipProps={{ placement: `left` }} user={entry.inviteCreatedBy} />
                        </Typography>
                    </StepLabel>
                </Step>
            )}
            <Step completed active>
                <StepLabel icon={<SubmittedIcon />}>
                    <Typography>
                        Submitted by{` `}
                        <InfoCardTooltip user={entry.createdBy} tooltipProps={{ placement: `left` }} />
                        {` `}
                        <TimestampTooltip timestamp={entry.createdAt} theme="light" />
                    </Typography>
                </StepLabel>
            </Step>
            <Step completed active>
                <StepLabel icon={<ApprovedIcon />}>
                    <Typography>
                        {EntryStates[entry.state]}
                        {` `}
                        {entry.stateActionDoneBy !== null ? (
                            <>
                                by{` `}
                                <InfoCardTooltip tooltipProps={{ placement: `left` }} user={entry.stateActionDoneBy} />
                            </>
                        ) : (
                            <span style={{ color: `#90CAF9` }}>automatically{` `}</span>
                        )}
                        {` `}
                        <TimestampTooltip timestamp={entry.stateActionDoneAt} from={entry.createdAt} theme="light" />
                    </Typography>
                </StepLabel>
                {entry.stateActionReason !== null && (
                    <StepContent>
                        <Typography color="gray">With reason: {entry.stateActionReason}</Typography>
                    </StepContent>
                )}
            </Step>
        </Stepper>
    );
};

export default ServerTimeline;
