/* React */
import React from "react";

/* Import */
import StatusAlarmList from "./config/statusAlarm.json";
import "./alarmType.scss";

/* MUI */
import { Box, Grid, MenuItem, List, ListItem } from '@mui/material';

const StatusAlarm = () => {

    console.log(StatusAlarmList);
    function StatusAlarm({alarmList}) {
        return(
            <Grid container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Grid item xs={4} className={`alarmListStatus ${alarmList.status}`}>
                    {alarmList.status}
                </Grid>
                <Grid item xs={4} className="alarmListDate">
                    {alarmList.date}
                </Grid>
                <Grid item xs={4} className="alarmListDesc">
                    {alarmList.desc}
                </Grid>
            </Grid>
        )
    }

    return(
        <>
            <Box className="StatusAlarm" sx={{width: 1, maxHeight: 309, overflow: 'auto'}}>
                <Grid className="StatusAlarmTop" sx={{ display: 'flex', justifyContent: 'space-between', p:0.5 }}>
                    <Grid item xs={4}>Status</Grid>
                    <Grid item xs={4}>Date</Grid>
                    <Grid item xs={4}>Description</Grid>
                </Grid><hr/>
                <List sx={{width: '100%', overflow: 'auto', bgColor: 'background.paper' }}
                      component="nav" aria-label="mailbox folders" className="listContainer"
                >
                    {StatusAlarmList.map((alarmList) => (
                        <Box className="contained" sx={{ p: 0.5 }}>
                            <ListItem sx={{padding: '0px', margin: '0px'}} key={alarmList.date} disableGutters>
                                <StatusAlarm alarmList={alarmList} key={alarmList.date} />
                            </ListItem>
                        </Box>
                    ))}
                </List>

            </Box>
        </>
    )
}
export default StatusAlarm;