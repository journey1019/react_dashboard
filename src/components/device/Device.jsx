/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import './device.scss';
import DetailInput from "../detail/detailInput/DetailInput";
import DetailInfo from "../detail/detailInfo/DetailInfo";
import DetailEventTime from "../detail/detailEventTime/DetailEventTime";
import DetailSatellite from "../detail/detailSatellite/DetailSatellite";
import DetailHistory from "../detail/detailHistory/DetailHistory";
import DetailHistoryChart from "../detail/detailHistoryChart/DetailHistoryChart";

/* MUI */
import {Grid} from "@mui/material";

const Device = () => {
    //const deviceId = '';

    const [date, setDate] = useState('');

    /*function InputDate(){
        setDate();
    }*/


    return(
        <>
            <Grid container spacing={1}>
                {/*<Grid item xs={12}>
                    <DetailInput deviceId={deviceId} InputDate={InputDate}/>
                    <br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailInfo deviceId={deviceId} date={date}/>
                    <br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailEventTime deviceId={deviceId} date={date}/>
                </Grid>
                <Grid item xs={12}>
                    <DetailSatellite deviceId={deviceId} date={date}/>
                    <br/><br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailHistory deviceId={deviceId} date={date}/>
                    <br/><br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailHistoryChart deviceId={deviceId} date={date}/>
                    <br/><br/>
                </Grid>*/}
            </Grid>
        </>
    )
}

export default Device;