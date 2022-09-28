import { Typography, IconButton } from '@mui/material';
import LightTooltip from '../Tooltips/LightTooltip';
import LinkIcon from '@mui/icons-material/Link';

const MakeSectionLinkButton = ({ to }: { to: string }) => {
    return (
        <LightTooltip placement="right" title={<Typography>Make a link to this section.</Typography>}>
            <IconButton sx={{ ml: 1 }} onClick={() => window.history.replaceState(null, ``, `#${to}`)}>
                <LinkIcon sx={{ color: `gray` }} />
            </IconButton>
        </LightTooltip>
    );
};

export default MakeSectionLinkButton;
