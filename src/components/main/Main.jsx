/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import "./main.scss";
import Table from "./component/Table/Table";

/* Module */
import ReturnRequest from "../modules/ReturnRequest";
import useDidMountEffect from "../modules/UseDidMountEffect";

/* MUI */
import { Grid, Box, Typography, Divider, Container, Button, darken } from "@mui/material";



const Main = () => {
    /* URL & Param */
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const currentDataParams = {detailMessage: true};

    const historyDataUrls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    const historyDataParams = {detailMessage: true};

    const [nmsCurrent, setNmsCurrent] = useState([]);
    const [nmsHistory, setNmsHistory] = useState([]);


    const [refreshTime, setRefreshTime] = useState(0);

    /*function Hi() {
        console.log('hello World')
    }
    const startInterval = (seconds, Hi) => {
        Hi();
        return setInterval(Hi, seconds);
    };

    startInterval(60000, Hi)*/

    /*function refresh() {
        console.log('1초에한번')
        setRefreshTime(refreshTime + 1);
        if (refreshTime > 100) {
            setRefreshTime(0);
        }
    }

    console.log('Test')
    const setIntervals = (seconds, callback) => {
        console.log('hihi')
        callback();
        return setInterval(callback, seconds * 1000);
    }
    setIntervals(60000, refresh)*/

    /*function AxiosCall() {
        ReturnRequest(currentDataUrls, currentDataParams).then(
            result=>{
                if(result!=null){
                    setNmsCurrent(result)
                }
            });
    }*/

    useEffect(() => {

        ReturnRequest(currentDataUrls, currentDataParams).then(
            result=>{
                if(result!=null){
                    setNmsCurrent(result)
                }});

        //clearTimeout(nmsCurrent);
        //ReturnRequest(historyDataUrls, historyDataParams).then(result=>{if(result!=null){setNmsHistory(result)}})
    }, [])

    console.log(nmsCurrent);
    console.log(nmsHistory);


    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Table</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Current All Data</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            <Table nmsCurrent={nmsCurrent}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>

                </Grid>
            </Grid>

        </>
    )
}

export default Main;