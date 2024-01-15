/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import './device.scss';
import DeviceInput from "./component/deviceInput/DeviceInput";
import DeviceInfo from "./component/deviceInfo/DeviceInfo";
import DeviceSatellite from "./component/deviceSatellite/DeviceSatellite";
import DeviceHistory from "./component/deviceHistory/DeviceHistory";
import DeviceHistoryChart from "./component/deviceHistoryChart/DeviceHistoryChart";

/* MUI */
import {Grid} from "@mui/material";


const Device = () => {

    /* Input Value */
    // DeviceId
    const [deviceId, setDeviceId] = useState('');

    // Date(Period)
    const now = new Date();
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    console.log(startDate); // 2023-12-23
    console.log(startDate); // 2024-01-02


    useEffect(() => {
        //ReturnRequest
    }, [])




    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DeviceInput />
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceInfo />
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceSatellite />
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistory />
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistoryChart />
                    <br/><br/>
                </Grid>
            </Grid>
        </>
    )
}

export default Device;