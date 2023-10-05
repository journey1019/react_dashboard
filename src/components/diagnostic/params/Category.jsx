import "./category.scss";
import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import {Box, Stack, Button, Input} from "@mui/material";

import DefaultParam from './defaultParam/DefaultParam';
import DiagnosticParam from './diagnosticParam/DiagnosticParam';
import IoParam from './ioParam/IoParam';

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

import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

// Select Input
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";


import {Line, Pie} from 'react-chartjs-2';
import faker from 'faker';

import Container from '@mui/material/Container';
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import Timeline from "@mui/lab/Timeline";



import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


const Category = () => {

    const to = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const today = to.replace(/-/g,''); // YYYYMMDD

    /* ===== Input ==================== */
    const [deviceId, setDeviceId] = useState('01803120SKY3F6D'); //01680675SKY33EC 01803120SKY3F6D
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
    
    /* ===== API _ Data Set ==================== */
    // 전체 데이터 출력 _ getDiagnosticParam
    const [getDiagnostic, setGetDiagnostic] = useState([]);

    // defaultParam
    const [defaultParam, setDefaultParam] = useState([]);
    // diagnosticParam
    const [diagnosticParam, setDiagnosticParam] = useState([]);
    // ioParam
    const [ioParam, setIoParam] = useState([]);

    /* ===== Variable ==================== */
    const [dailyData, setDailyData] = useState(0);

    const [keyCount, setKeyCount] = useState([]);

    const [resetReason, setResetReason] = useState([]);
    const [resetReasonName, setResetReasonName] = useState([]);

    const [satCount, setSatCount] = useState([]);
    const [satTime, setSatTime] = useState([]);

    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){
                    console.log(result)

                    let defaultList = [] ; //DefaultParamList
                    let diagnosticList = []; //DiagnosticParamList
                    let ioList = []; //IoParamList

                    /* ===== Get Diagnostic DataSet ==========*/
                    setDailyData(result.defaultParam.dailyData);

                    setKeyCount(result.defaultParam.keyCount);


                    if(result.defaultParam.resetReason != '<empty>') {
                        setResetReasonName(Object.keys(result.defaultParam.resetReason)); // ResetReason Name Array

                        let resetList = [];

                        result.defaultParam.resetReason['hardwareResetReason'].map(function(hardware){
                            resetList.push(hardware)
                        })
                        result.defaultParam.resetReason['lastResetReason'].map(function(last){
                            resetList.push(last)
                        })
                        result.defaultParam.resetReason['softwareResetReason'].map(function(software){
                            resetList.push(software)
                        })
                        setResetReason(resetList)
                        result.defaultParam['resetReasons'] = resetReason
                    }
                    else return null;
                    console.log(resetReasonName)


                    setSatCount(result.defaultParam.sat.satCount);
                    setSatTime(result.defaultParam.sat.satTime);





                    /* ===== Get Diagnostic DataSet ========== */
                    defaultList.push(result.defaultParam); // 이거 필요한가?
                    setDefaultParam(defaultList);

                    diagnosticList.push(result.diagnosticParam);
                    setDiagnosticParam(diagnosticList);

                    ioList.push(result.ioParam);
                    setIoParam(ioList);

                    setGetDiagnostic(result); // Param All Data
                }else{
                }
            });
        return () => {
            clearTimeout(diagnosticParam);
        }
    }, [deviceId, setDate, timeZone]);

    useEffect(() => {
    }, [getDiagnostic])

    console.log(getDiagnostic);
    console.log(defaultParam);
    console.log(diagnosticParam);
    console.log(ioParam)


    async function returnData(TimeLineList) {
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

    ///console.log(defaultParam1.sat.satTime);
    /*function TimeLineList({TimeLineList}){
        return(
            <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    {TimeLineList.key}
                    2023-09-13T20:25:47
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{TimeLineList.value}
                    <div className="timelineComponent" >
                        <div className="left">
                            <span>st6100On: 60</span>
                            <span>satOnTime: 60</span>
                            <span>satCnr: 44.21</span>

                            <span>satCutOffCount: 0</span>
                            <span>powerOnCount: 0</span>
                        </div>
                    </div>
                </TimelineContent>
            </TimelineItem>
        )
    }*/

    /* -------------- Daily Data -- */
    function KeyCount({keyCountList}) {
        return (
            <div className="keyCount">
                <div className="keyCount_Key">
                    {keyCountList.key}
                </div>
                <hr/>
                <span className="keyCount_Value">
                    {keyCountList.value}
                </span>
            </div>
        )
    }

    /* -------------- Daily Data -- */
    function ResetReason({resetReasonList}) {
        return(
            <div className="resetReasonList">
                <div className="resetReasonName">
                    ResetReasonName
                </div>
                <hr />
                <div className="resetReasonName_List">
                    <div className="resetReasonList_Key">
                        {resetReasonList.key}
                    </div>
                    <div className="resetReasonList_Value">
                        {resetReasonList.value}
                    </div>
                </div>
            </div>
        )
    }


    /* -------------- PieChart Option -- */
    const pieOptions = {
        responsive: true,
        plugin: {
            legend: {
                display: true,
                position: "right",
            },
            title: {
                display: true,
                test: 'Satellite type according to time'
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            }
        }
    };
    const label = satCount.map(row=>row.key);
    const dataCount = satCount.map(counting=>counting.value);

    const data = {
        maintainAspectRatio: false,
        responsive: false,
        labels: label,
        datasets: [
            {
                data: dataCount,
                backgroundColor: ['#ad302c', '#F2E8C6', '#E25E3E', '#7A9D54', '#4F709C'],//라벨별 컬러설
                hoverBackgroundColor: ['#77211e', '#DAD4B5', '#C63D2F', '#557A46', '#2B2A4C'],
            }
        ]
    };


    return(
        <>
            <div className="category">
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <div className="defaultParam">
                            <div className="dailyData">
                                <span className="arrayTitle">Daily Data</span>
                                <span className="dailyDataCount">{dailyData}</span>
                            </div><hr />

                            <div className="keyCountArray">
                                {keyCount.map((keyCountList) => (
                                    <KeyCount keyCountList={keyCountList} key={keyCountList.key} sx={{display: 'flex', borderStyleBorder: 'solid', borderWidth: '3px', borderColor: 'black'}}/>
                                ))}
                            </div>
                        </div><br />
                    </Grid>

                    <Grid item xs={5}>
                        <div className="defaultParam">
                            <div className="resetReason">
                                <span className="arrayTitle">Reset Reason</span>
                                <hr/>

                                <div className="resetReasonArray">
                                    {resetReason.map((resetReasonList) => (
                                        <ResetReason resetReasonList={resetReasonList} key={resetReasonList.key} sx={{display: 'flex', borderStyleBorder: 'solid', borderWidth: '3px', borderColor: 'black'}}/>
                                    ))}
                                </div>
                            </div>
                        </div><br />
                    </Grid>
                    
                    <Grid item xs={2}>
                        <div className="defaultParam">
                            <div className="inputContainer">
                                
                                <span>Set Date</span>
                                <Box
                                    sx={{maxWidth: '100%'}}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                            <DatePicker size="small" fullWidth label="Date" showDaysOutsideCurrentMonth/>
                                            {/*<DatePicker format="YYYYMMDD" label="Date" showDaysOutsideCurrentMonth value={setDate} onChange={(newValue) => setDate(newValue)}/>
                                        <DatePicker format="YYYYMMDD" label="Date" showDaysOutsideCurrentMonth date={date} onChange={(newValue) => setDate(newValue)}/>*/}

                                        </DemoContainer>
                                        {/*<StaticDatePicker
                                        defaultValue={dayjs('20230913')}
                                        slotProps={{
                                            actionBar: {
                                                actions: ['today'],
                                            },
                                        }}
                                    />*/}
                                    </LocalizationProvider><br/>
                                </Box>

                                <span>Device Id</span><br/>
                                <Box
                                    sx={{maxWidth: '100%'}}
                                >
                                    <TextField
                                        id="outlined-search"
                                        label="Device ID"
                                        type="search"
                                        fullWidth
                                        size="small"
                                    />
                                </Box>

                                <span>Time Zone</span><br/>
                                <Box
                                    sx={{maxWidth: '100%'}}
                                >
                                    <FormControl variant="outlined" sx={{minWidth: 120}}>
                                        <InputLabel id="demo-simple-select-label">Time Zone</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            fullWidth
                                            value={timeZone}
                                            label="TimeZone"
                                            size="small"
                                            onChange={handleCountryChange}
                                        >
                                            <MenuItem value={10}>UTC</MenuItem>
                                            <MenuItem value={20}>KST</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <br/><br/>
                            </div>
                        </div>
                    </Grid>

                        <div className="defaultParam">
                            <span className="arrayTitle">Satellite</span>
                            <hr />
                            <div className="sat">
                                <div className="pieChart-container" style={{
                                    width: '100%',
                                    height: '200px',
                                    display: 'flex',
                                }}>
                                    <Pie
                                        data={data}
                                        options={pieOptions}
                                    />
                                </div>
                            </div>
                        </div>

                        <DiagnosticParam diagnosticParam={diagnosticParam} />
                        <IoParam ioParam={ioParam} />


                    {/*<Grid item xs={10}>
                        <DiagnosticParam diagnosticParam={diagnosticParam} /><br/>
                        <DefaultParam defaultParam={defaultParam} />
                    </Grid>
                    <Grid item xs={2}>
                        <Item>Input</Item>
                        <div className="inputValues">
                            <span>Set Date</span>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                    <DatePicker label="Date" showDaysOutsideCurrentMonth/>
                                    <DatePicker format="YYYYMMDD" label="Date" showDaysOutsideCurrentMonth value={setDate} onChange={(newValue) => setDate(newValue)}/>
                                    <DatePicker format="YYYYMMDD" label="Date" showDaysOutsideCurrentMonth date={date} onChange={(newValue) => setDate(newValue)}/>

                                </DemoContainer>
                                <StaticDatePicker
                                    defaultValue={dayjs('20230913')}
                                    slotProps={{
                                        actionBar: {
                                            actions: ['today'],
                                        },
                                    }}
                                />
                            </LocalizationProvider><br/>

                            <span>Device Id</span><br/>
                            <TextField
                                id="outlined-search"
                                label="Device ID"
                                type="search"
                                sx={{width: '200px'}}
                            /><br/><br/>

                            <span>Time Zone</span><br/>
                            <FormControl variant="outlined" sx={{minWidth: 120}}>
                                <InputLabel id="demo-simple-select-label">Time Zone</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    sx={{width: '200px'}}
                                    value={timeZone}
                                    label="TimeZone"
                                    onChange={handleCountryChange}
                                >
                                    <MenuItem value={10}>UTC</MenuItem>
                                    <MenuItem value={20}>KST</MenuItem>
                                </Select>
                            </FormControl><br/><br/>

                            <Button variant="contained" size="small">Search</Button>
                        </div><br/>
                        <div className="inputValues">
                            <div className="timeLine_Component">
                                <Timeline
                                    sx={{
                                        [`& .${timelineOppositeContentClasses.root}`]: {
                                            flex: 0.2,
                                        },
                                    }}
                                >
                                    {defaultParam.map((satTimeLine) => (
                                        <TimeLineList key={satTimeLine.key} TimeLineList={TimeLineList}>
                                        </TimeLineList>
                                    ))}
                                </Timeline>
                            </div>
                        </div>
                    </Grid>*/}
                </Grid>
            </div>
        </>
    )
}

export default Category;