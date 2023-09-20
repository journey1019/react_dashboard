import "./category.scss";
import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import {Box, Stack, Button, Input} from "@mui/material";

import DiagnosticParam from './diagnosticParam/DiagnosticParam';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import TextField from '@mui/material/TextField';
import MaterialReactTable from 'material-react-table';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";

import {styled, useTheme} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";

import dayjs, { Dayjs } from 'dayjs';

// Select Input
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import faker from 'faker';

import Container from '@mui/material/Container';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Category = () => {

    const to = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const today = to.replace(/-/g,''); // YYYYMMDD

    const [deviceId, setDeviceId] = useState('01680675SKY33EC');
    const [setDate, setSetDate] = useState('20230913'); //today 20230913
    /*const [date, setDate] = useState<Dayjs | null>(dayjs('20230913'));
    const [values, setValues] = React.useState<Dayjs | null>(dayjs('2022-04-17'));*/

    const [timeZone, setTimeZone] = useState('KST');

    const handleStartChange = (e) => {
        setDate(e.target.value);
    };
    const handleCountryChange = (event) => {
        setTimeZone(event.target.value);
    }

    // 전체 데이터 출력 _ getDiagnosticParam
    const [getDiagnostic, setGetDiagnostic] = useState([]);

    // Diagnostic _ daily Object
    const [diagDailyObj, setDiagDailyObj] = useState([]);
    // Diagnostic _ hour Array
    const [diagHourArr, setDiagHourArr] = useState([]);


    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){
                    // DiagnosticParam
                    let diagnosticList = []; //DiagnosticParamList
                    let hourArrayList = []; //DiagnosticParamList _ Hour Array
                    let dailyObjList = [];

                    console.log(result);

                    /* --------------------- Diagnostic -----------------------*/
                    // DiagnosticParam_daily_Object
                    console.log(result.diagnosticParam);

                    console.log(result.diagnosticParam.daily)
                    console.log(result.diagnosticParam.daily.satOnTime)


                    // DiagnosticParam_hour_Arrays
                    result.diagnosticParam['hour'].map(function(hourArray){
                        console.log(hourArray);


                        // push해서 List Array에 값 넣어주기
                        hourArrayList.push(hourArray);
                    })
                    diagnosticList.push(result.diagnosticParam); // diagnosticParam 전체 데이터
                    dailyObjList.push(result.diagnosticParam.daily);

                    console.log(dailyObjList);

                    console.log(diagnosticList);

                    setDiagDailyObj(dailyObjList); //Diagnostic_daily
                    //setDiagDailyObj(result.diagnosticParam.daily); //Diagnostic_daily
                    setDiagHourArr(hourArrayList); //Diagnostic_hour
                    setGetDiagnostic(diagnosticList); //Diagnostic
                }else{
                }
            });
        return () => {
            clearTimeout(getDiagnostic);
        }
    }, [deviceId, setDate, timeZone]);

    useEffect(() => {
    }, [getDiagnostic, diagDailyObj, diagHourArr]);

    console.log(diagDailyObj); // dailyObject

    console.log(diagHourArr); // hourList _ (nmsCurrent)

    console.log(getDiagnostic);

    async function returnData() {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnostic";
        const params = {deviceId:(deviceId), setDate:(setDate), timeZone: (timeZone)};

        const headers = {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept":"application/json",
            "Authorization": "Bearer "+token,
        };

        let returnVal = null;

        try {
            await axios({
                method:"get",
                url:urls,
                headers:headers,
                params:params,
                responseType:"json"
            })
                .then(response => {
                    // 성공 시, returnVal로 데이터 input
                    returnVal = response.data.response;
                })
                .then(err=>{
                    return null;
                });
            return returnVal;

        } catch {
            return null;
        }
    }


    return(
        <>
            <div className="category">
                {/*<Grid container spacing={1}>
                    <Grid item xs={9}>
                        <DiagnosticParam getDiagnostic={getDiagnostic} diagDailyObj={diagDailyObj}/>
                    </Grid>
                    <Grid item xs={3}>

                    </Grid>
                </Grid>*/}
                <DiagnosticParam getDiagnostic={getDiagnostic} diagDailyObj={diagDailyObj}/>

            </div>
        </>
    )
}

export default Category;