import { useEffect, useRef, useMemo, useState } from 'react';
import { Typography, Stack, Paper, Divider, Grid } from '@mui/material';
import DarkTooltip from '../../Tooltips/DarkTooltip';
import { useEntryStats } from '../../../hooks/useEntryStats';
import { getAveragePortionOnline } from '../../../helpers/statHelpers/getAveragePortionOnline';
import { getAverageChangeInMemberCount } from '../../../helpers/statHelpers/getAverageChangeInMemberCount';
import CloseTooltip from '../../Tooltips/CloseTooltip';
import './ServerGraph.css';

const ServerGraph = ({ historyData }: { historyData: [online: number, total: number][] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const allEntryStats = useEntryStats();

    const highestPossibleValue = useMemo(() => Math.max(...historyData.flat()), [historyData]);
    const lowestPossibleValue = useMemo(() => Math.min(...historyData.flat()), [historyData]);

    const thisEntryStats = useMemo(() => {
        const averagePortionOnline = getAveragePortionOnline(historyData);
        const averageChangeInMemberCount = getAverageChangeInMemberCount(historyData);

        const averagePortionOnlineRank = allEntryStats.getRanking(`averagePortionOnline`, averagePortionOnline);
        const averageChangeInMemberCountRank = allEntryStats.getRanking(
            `averageChangeInMemberCount`,
            averageChangeInMemberCount,
        );

        const netChangeInMemberCount = historyData.at(-1)![1] - historyData[0][1];
        const netChangeInMemberCountRank = allEntryStats.getRanking(`netChangeInMemberCount`, netChangeInMemberCount);

        const totalMemberCount = historyData.at(-1)![1];
        const totalMemberCountRank = allEntryStats.getRanking(`totalMemberCount`, totalMemberCount);

        return {
            averagePortionOnline,
            averagePortionOnlineRank,
            averageChangeInMemberCount,
            averageChangeInMemberCountRank,
            netChangeInMemberCount,
            netChangeInMemberCountRank,
            totalMemberCount,
            totalMemberCountRank,
        };
    }, [allEntryStats, historyData]);

    const [finalY, setFinalY] = useState(150);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) return;

        const ctx = canvas.getContext(`2d`);
        if (ctx === null) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.setLineDash([]);
        ctx.strokeStyle = `gray`;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const dataRange = highestPossibleValue - lowestPossibleValue;
        const calculateY = (v: number) => (1 - (v - lowestPossibleValue) / dataRange) * canvas.height;

        const stepX = canvas.width / (historyData.length - 1);

        // total
        let lastX = 0;
        let lastY = calculateY(historyData[0][1]);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineWidth = 2;

        for (let i = 1; i < historyData.length; i++) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);

            const dTotal = historyData[i][1] - historyData[i - 1][1];

            lastX = stepX * i;
            lastY = calculateY(historyData[i][1]);

            ctx.lineTo(lastX, lastY);

            ctx.strokeStyle = dTotal >= 0 ? `green` : `red`;
            ctx.stroke();
        }

        setFinalY(lastY);

        // online
        ctx.beginPath();
        ctx.moveTo(0, calculateY(historyData[0][0]));

        for (let i = 1; i < historyData.length; i++) {
            ctx.lineTo(stepX * i, calculateY(historyData[i][0]));
        }

        ctx.setLineDash([5]);
        ctx.strokeStyle = `gray`;
        ctx.stroke();
    }, [highestPossibleValue, historyData, lowestPossibleValue]);

    return (
        <Paper sx={{ p: 2 }}>
            <Stack direction="column" alignItems="center">
                <Typography textAlign="center" sx={{ mb: 1 }}>
                    Member Count (Last {historyData.length} Days){` `}
                </Typography>
                <DarkTooltip
                    sx={{ pb: 1 }}
                    components={{ Tooltip: Paper }}
                    title={
                        <Paper sx={{ p: 1 }}>
                            <div style={{ display: `flex`, alignItems: `center`, width: `100%` }}>
                                <span style={{ height: `10px`, width: `40px`, backgroundColor: `red` }} />
                                <span style={{ height: `10px`, width: `40px`, backgroundColor: `green` }} />
                                <Typography sx={{ ml: 1, textAlign: `right`, width: `100%` }}>
                                    <span style={{ fontWeight: `bold` }}>Total</span> Member Count
                                </Typography>
                            </div>
                            <div style={{ display: `flex`, alignItems: `center`, width: `100%` }}>
                                <span style={{ height: `10px`, width: `20px`, backgroundColor: `gray` }} />
                                <span style={{ height: `10px`, width: `10px` }} />
                                <span style={{ height: `10px`, width: `20px`, backgroundColor: `gray` }} />
                                <span style={{ height: `10px`, width: `10px` }} />
                                <span style={{ height: `10px`, width: `20px`, backgroundColor: `gray` }} />
                                <Typography sx={{ ml: 1, textAlign: `right`, width: `100%` }}>
                                    <span style={{ fontWeight: `bold` }}>Online</span> Member Count
                                </Typography>
                            </div>
                        </Paper>
                    }
                    placement="top"
                >
                    <div style={{ display: `flex`, flexFlow: `row nowrap`, color: `gray`, position: `relative` }}>
                        <span
                            style={{
                                position: `absolute`,
                                textAlign: `right`,
                                transform: `translateX(-100%)`,
                                marginTop: `-0.4em`,
                                paddingRight: `0.1em`,
                            }}
                        >
                            {highestPossibleValue}
                        </span>
                        <span
                            style={{
                                position: `absolute`,
                                textAlign: `right`,
                                bottom: 0,
                                transform: `translateX(-100%)`,
                                marginBottom: `-0.4em`,
                                paddingRight: `0.1em`,
                            }}
                        >
                            {lowestPossibleValue}
                        </span>
                        <canvas ref={canvasRef} />
                        <span
                            style={{
                                position: `absolute`,
                                right: 0,
                                top: `clamp(0.4em, ${finalY}px, calc(100% - 0.4em))`,
                                transform: `translate(100%, -50%)`,
                                paddingLeft: `0.1em`,
                            }}
                        >
                            {historyData.at(-1)![1]}
                        </span>
                    </div>
                </DarkTooltip>
                <Divider flexItem sx={{ m: 1 }} />
                <Grid container>
                    <Grid item xs={6} sx={{ textAlign: `left` }}>
                        <Typography>Net change in member count</Typography>
                    </Grid>
                    <Grid item xs={2} lg={1}>
                        <span
                            style={{
                                fontWeight: `bold`,
                                color: thisEntryStats.netChangeInMemberCount >= 0 ? `lightgreen` : `lightcoral`,
                            }}
                        >
                            {thisEntryStats.netChangeInMemberCount}
                        </span>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <CloseTooltip
                            title={
                                <Typography>Across {allEntryStats.netChangeInMemberCount.length} Servers</Typography>
                            }
                        >
                            <span
                                className={`rankText ${
                                    thisEntryStats.netChangeInMemberCountRank.rank > 50 ? `bad` : ``
                                }`}
                            >
                                ({thisEntryStats.netChangeInMemberCountRank.rankAsString})
                            </span>
                        </CloseTooltip>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: `left` }}>
                        <Typography>Average change in member count</Typography>
                    </Grid>
                    <Grid item xs={2} lg={1}>
                        <span
                            style={{
                                fontWeight: `bold`,
                                color: thisEntryStats.averageChangeInMemberCount >= 0 ? `lightgreen` : `lightcoral`,
                            }}
                        >
                            {Math.round(thisEntryStats.averageChangeInMemberCount)}
                        </span>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <CloseTooltip
                            title={
                                <Typography>
                                    Across {allEntryStats.averageChangeInMemberCount.length} Servers
                                </Typography>
                            }
                        >
                            <span
                                className={`rankText ${
                                    thisEntryStats.averageChangeInMemberCountRank.rank > 50 ? `bad` : ``
                                }`}
                            >
                                ({thisEntryStats.averageChangeInMemberCountRank.rankAsString})
                            </span>
                        </CloseTooltip>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: `left` }}>
                        <Typography>Average % members online</Typography>
                    </Grid>
                    <Grid item xs={2} lg={1}>
                        <span style={{ fontWeight: `bold` }}>
                            {Math.round(100 * thisEntryStats.averagePortionOnline)}%
                        </span>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <CloseTooltip
                            title={<Typography>Across {allEntryStats.averagePortionOnline.length} Servers</Typography>}
                        >
                            <span
                                className={`rankText ${thisEntryStats.averagePortionOnlineRank.rank > 50 ? `bad` : ``}`}
                            >
                                ({thisEntryStats.averagePortionOnlineRank.rankAsString})
                            </span>
                        </CloseTooltip>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: `left` }}>
                        <Typography>Total members</Typography>
                    </Grid>
                    <Grid item xs={2} lg={1}>
                        <span style={{ fontWeight: `bold` }}>{thisEntryStats.totalMemberCount}</span>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <CloseTooltip
                            title={<Typography>Across {allEntryStats.totalMemberCount.length} Servers</Typography>}
                        >
                            <span className={`rankText ${thisEntryStats.totalMemberCountRank.rank > 50 ? `bad` : ``}`}>
                                ({thisEntryStats.totalMemberCountRank.rankAsString})
                            </span>
                        </CloseTooltip>
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
};

export default ServerGraph;
