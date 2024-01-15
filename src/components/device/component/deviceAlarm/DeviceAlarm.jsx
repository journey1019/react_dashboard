import {Alert, AlertTitle, Box, Grid, Stack} from "@mui/material";
import React from "react";
import DetailAlarmHistory from "../../../detail/detailAlarmHistory/DetailAlarmHistory";

/* Import */
import StatusAlarm from "./alarmType/StatusAlarm";
import RealTimeAlarm from "./alarmType/RealTimeAlarm";
import EventTimeAlarm from "./alarmType/EventTimeAlarm";


const DeviceAlarm = () => {

    return(
        <>
            <Box sx={{display: 'flex', width: 1}}>
                <Grid item sm={4} sx={{pr: 3}}>
                    <div className="alertInfo">
                        <div className="alertInfoTitle">
                            Alert Table || Alarm 처럼 리스트
                        </div><hr/>
                        <div className="alertInfoContain">
                            <StatusAlarm />
                        </div>
                    </div>
                </Grid >

                <Grid item sm={4} sx={{pr: 3}}>
                    <div className="alertInfo">
                        <div className="alertInfoTitle">
                            Alarm Navigation
                        </div><hr/>
                        <div className="alertInfoContain">
                            <RealTimeAlarm />
                        </div>
                    </div>
                </Grid>

                <Grid item sm={4} sx={{pr: 3}}>
                    <div className="alertInfo">
                        <div className="alertInfoTitle">
                            Event Time Line
                        </div><hr/>
                        <div className="alertInfoContain">
                            <EventTimeAlarm />
                        </div>
                    </div>
                </Grid >
            </Box>
        </>
    )
}

export default DeviceAlarm;