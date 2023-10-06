import "./category.scss";
import * as React from "react";
import {useEffect, useState, useMemo, useRef} from "react";
import {Box, Stack, Button, Input, darken} from "@mui/material";

import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



import DefaultParam from './defaultParam/DefaultParam';
import DiagnosticParam from './diagnosticParam/DiagnosticParam';
import IoParam from './ioParam/IoParam';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

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
//zimport Select from '@mui/material/Select';
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
    /* ===== Input ==================== */
    // DeviceID
    const [deviceId, setDeviceId] = useState('01803120SKY3F6D'); //01680675SKY33EC 01803120SKY3F6D
    const onChangeDeviceId = (e) => {
        setDeviceId(e.target.value);
    }
    const onResetDeviceId = () => {
        setDeviceId('');
    }

    // StartDate
    const [startDate, setStartDate] = useState(new Date());
    function dateFormat() { // startDate 값 변환
        let month = startDate.getMonth()+1; // getMonth()의 반환 값이 0~11이기 때문에 (+1)
        let day = startDate.getDate();

        month = month>=10 ? month : '0' + month;
        day = day>=10 ? day : '0' + day;
        return startDate.getFullYear().toString() + month.toString() + day.toString();
    }

    // TimeZone
    const timezoneOptions = [
        { value: "KST", label: "KST" },
        { value: "UTC", label: "UTC" },
    ];
    const [timezoneSelectValue, setTimezoneSelectValue] = useState('KST');
    const timezoneSelectInputRef = useRef(null);
    const onClearTimezoneSelect = () => {
        if(timezoneSelectInputRef.current) {
            timezoneSelectInputRef.current.clearValue();
        }
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


                    console.log(result.defaultParam)
                    console.log(result.defaultParam.resetReason)
                    /*if(result.defaultParam['resetReasons'] != resetReason) {
                        console.log('abcabc')
                    }*/
                    if(result.defaultParam.resetReason != '') {
                        //setResetReasonName(Object.keys(result.defaultParam.resetReason)); // ResetReason Name Array

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
                        //result.defaultParam['resetReasons'] = resetReason
                    }
                    else return null;
                    result.defaultParam['resetReasons'] = resetReason
                    console.log(resetReasonName)


                    result.defaultParam.sat.satCount.map(function(type){
                        console.log(type)
                        if(type.key === 'APACRB11'){
                            type.backgroundColor = '#ad302c';
                            type.hoverBackgroundColor = '#77211e';
                        }
                        else if(type.key === 'MEASRB19'){
                            type.backgroundColor = '#F2E8C6';
                            type.hoverBackgroundColor = '#DAD4B5';
                        }
                        else if(type.key === 'IOERB19'){
                            type.backgroundColor = '#E25E3E';
                            type.hoverBackgroundColor = '#CD5C08';
                        }
                        else {
                            type.backgroundColor = '#7A9D54';
                            type.hoverBackgroundColor = '#557A46';
                        }
                    })


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
    }, [deviceId, startDate, timezoneSelectValue]);

    useEffect(() => {
    }, [getDiagnostic])

    console.log(getDiagnostic);
    console.log(defaultParam);
    console.log(diagnosticParam);
    console.log(ioParam)



    console.log(startDate)

    async function returnData(TimeLineList) {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
        const urls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnostic";
        const params = {deviceId:(deviceId), setDate:(dateFormat(startDate)), timeZone: (timezoneSelectValue)};

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
            <>
                <div className="resetReasonList">
                    <div className="resetReasonName">
                        ReasonName
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
            </>
        )
    }


    /* -------------- PieChart Option -- */
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    usePointStyle: true,
                }
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
    const pieLabel = satCount.map(satType=>satType.key);
    const pieDataCount = satCount.map(satCount=>satCount.value);
    const pieBackColor = satCount.map(satBackColor=>satBackColor.backgroundColor);

    const data = {
        maintainAspectRatio: false,
        responsive: false,
        labels: pieLabel,
        datasets: [
            {
                data: pieDataCount,
                backgroundColor: pieBackColor,
                /*backgroundColor: ['#ad302c', '#F2E8C6', '#E25E3E', '#7A9D54', '#4F709C'],//라벨별 컬러설
                hoverBackgroundColor: ['#77211e', '#DAD4B5', '#CD5C08', '#557A46', '#2B2A4C'],*/
            }
        ]
    };
    /* -------------- Table Option -- */
    const tableColumns = useMemo(
        () => [
            {
                header: 'Date',
                accessorKey: 'key',
                size: 150,
            },
            {
                header: 'Satellite',
                accessorKey: 'value',
                size: 100,
                Cell: ({ cell }) => {
                    return (
                        <div className={`cellWithSatellite ${cell.getValue(cell)}`}>
                            {cell.getValue(cell)}
                        </div>
                    );
                },
            }
        ],
        [],
    );



    


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
                                <span className="input_Title">Set Date</span><br/>
                                <DatePicker
                                    className="myDatePicker"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    isClearable
                                />


                                <span className="input_Title">Device Id</span><br/>
                                <Box sx={{maxWidth: '100%'}}>
                                    <TextField
                                        id="outlined-search"
                                        type="search"
                                        fullWidth
                                        size="small"
                                        onChange={onChangeDeviceId}
                                        value={deviceId}
                                    />
                                </Box>

                                <span className="input_Title">Time Zone</span><br/>
                                <Select
                                    ref={timezoneSelectInputRef}
                                    onChange={(e) => {
                                        if(e) {
                                            setTimezoneSelectValue(e.value);
                                        } else {
                                            setTimezoneSelectValue('');
                                        }
                                    }}
                                    options={timezoneOptions}
                                    placeholder="KST/UTC"
                                />
                                {/*<Button onClick={() => {
                                    onClearTimezoneSelect()
                                    onResetDeviceId()
                                }}>
                                    초기화
                                </Button>*/}
                            </div>
                        </div>
                    </Grid>

                    <div className="defaultParam" style={{ marginLeft: '8px'}}>
                        <span className="arrayTitle">Satellite</span>
                        <hr />
                        <div className="sat">
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <div className="pieChart-Container">
                                        <div className="pie-area" style={{
                                            width: '100%',
                                            height: '330px',
                                            display: 'flex',
                                            margin: '0 auto',
                                        }}>
                                            <Pie
                                                data={data}
                                                options={pieOptions}
                                            />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={5}>
                                    <div className="SatTable-Container">

                                        <MaterialReactTable
                                            title="NMS Current Table"
                                            columns={tableColumns}
                                            data={satTime}

                                            initialState = {{
                                                density: 'comfortable',
                                                expanded: true,
                                                pagination: { pageIndex: 0, pageSize: 5, },
                                            }}

                                            // 줄바꿈 Theme
                                            muiTablePaperProps = {{
                                                elevation: 0,
                                                sx: {
                                                    borderRadius: '0',
                                                    border: '1px dashed #e0e0e0',
                                                },
                                            }}
                                            // Table Theme
                                            muiTableBodyProps={{
                                                sx: (theme) => ({
                                                    '& tr:nth-of-type(odd)': {
                                                        backgroundColor: darken(theme.palette.background.default, 0.1),
                                                    },
                                                }),
                                            }}
                                        />
                                    </div>
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                    <DiagnosticParam diagnosticParam={diagnosticParam} />
                    <IoParam ioParam={ioParam} />
                </Grid>
            </div>
        </>
    )
}

export default Category;