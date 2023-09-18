import "./category.scss";
import * as React from "react";
import {useEffect, useState, useMemo} from "react";
import {Box, Stack, Button, Input} from "@mui/material";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
    const [setDate, setSetDate] = useState('20230913'); //today
    const [timeZone, setTimeZone] = useState('KST');

    const handleStartChange = (e) => {
        setSetDate(e.target.value);
    };
    const handleCountryChange = (event) => {
        setTimeZone(event.target.value);
    }

    // getDiagnosticParam
    const [getDiagnostic, setGetDiagnostic] = useState([]);

    // Diagnostic _ hour Array
    const [diagDailyObj, setDiagDailyObj] = useState([]);
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
    }, [deviceId, setSetDate, timeZone]);

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

    /*------------------------------------------------------------------*/
    // Grid Item Styling
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    /*------------------------------------------------------------------*/

    function DiagDailyObj({dailyObjList}) {
        /*for(let key of Object.keys(dailyObjList)) {
            console.log(key);
        }
        for(let value of Object.values(dailyObjList)) {
            console.log(value);
        }*/
        return(
            <div className="point">
                <div className="dailyParamValue">
                    <span className="topKey">
                        Event Date
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.eventDate}
                    </span>
                </div>
                <div className="dailyParamValue">
                    <span className="topKey">
                        ST6100 경과시간
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.st6100On}
                    </span>
                </div>
                <div className="dailyParamValue">
                    <span className="topKey">
                        위성 연결시간
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.satOnTime}
                    </span>
                </div>
                <div className="dailyParamValue">
                    <span className="topKey">
                        위성 신호레벨
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.satCnr}
                    </span>
                </div>
                <div className="dailyParamValue">
                    <span className="topKey">
                        위성 끊김
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.satCutOffCount}
                    </span>
                </div>
                <div className="dailyParamValue">
                    <span className="topKey">
                        데이터 전송
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.sendDataCount}
                    </span>
                </div>
                <div className="dailyParamValue">
                    <span className="topKey">
                        배터리 충전
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {dailyObjList.batChargeTime}
                    </span>
                </div><div className="dailyParamValue">
                    <span className="topKey">
                        전원 On
                    </span>
                <hr/>
                <span className="bottomValue">
                        {dailyObjList.powerOnCount}
                    </span>
            </div>
            </div>
        )
    }
    /*function DiagDailyObj({dailyObjList}) {
        {Object.entries(dailyObjList).map(([key, value]) => {
            return(
                <div className="point" key={key}>
                    <div className="dailyParamValue">
                    <span className="topKey">
                        {key}
                    </span>
                        <hr/>
                        <span className="bottomValue">
                        {value}
                    </span>
                    </div>
                </div>
            )
        })}
    }*/


    /*function DiagDailyObj({dailyObjList}) {
        const dailyKey = Object.keys(dailyObjList);
        const dailyValue = Object.values(dailyObjList);
        return(
            <div className="point">
                <div className="dailyParamValue">
                    <span className="topKey">
                        {Object.keys(dailyObjList)}
                    </span>
                    <hr/>
                    <span className="bottomValue">
                        {Object.values(dailyObjList)}
                    </span>
                </div>
            </div>
        )
    }*/

    /*function DiagDailyObj({dailyObjList}) {
        for(let i in dailyObjList) {
            
        }
        return(
            <div className="point">
                <div className="dailyParamValue">
                <span className="topKey">
                    {key}
                </span>
                    <hr/>
                    <span className="bottomValue">
                    {value}
                </span>
                </div>
            </div>
        )
    }*/


    // Time Zone _ Country
    function diagnosticParam() {
        return(
            <div className="dailyParamValue">
                <div className="topKey">
                    Event Date
                </div><hr/>
                <div className="bottomValue">
                    3
                </div>
            </div>
        )
    }



    /* ------------------- Diagnostic_Hour -------------------------------*/
    /* -------------- Diagnostic_Hour Tab -- */
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }



    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => { //Tabs
        setValue(newValue);
    };

    const handleChangeIndex = (index) => { //Tabs Items
        setValue(index);
    };

    /* -------------- Diagnostic_Hour Tab -- */
    const options = {
        responsive: true,
        interactions: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            tooltip: {
                enable: true,
                mode: 'index',
                position: 'nearest',
                intersect: false,
                usePointStyle: true,
            },
            legend: {
                position: 'left',
                labels: {
                    usePointStyle : true, // Legend_PointStyle
                }
            }
        },
        scales: {
            y:{
                type: 'linear',
                display: true,
                position: 'left',
                gridLines: {
                    color: 'rgba(166, 201, 226, 1)',
                    lineWidth: 1
                }
            },
        },
    };

    const labels = diagHourArr.map(x => x.eventDate);

    const data = {
        labels,
        datasets: [
            {
                label: 'ST6100 경과시간',
                data: diagHourArr.map(x => x.st6100On),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                filler: true,
                pointStyle: 'circle',
                pointRadius: 5, // 기본 Point 반지름
                pointHoverRadius: 10, // Point 선택 시 반지금
                borderWidth: 2, // 기본 선 두께
            },
            {
                label: '위성 연결시간',
                data: diagHourArr.map(x => x.satOnTime),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                filler: true,
                pointStyle: 'triangle',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: '위성 신호레벨',
                data: diagHourArr.map(x => x.satCnr),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                filler: false,
                pointStyle: 'rectRounded',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: '위성 끊김 횟수',
                data: diagHourArr.map(x => x.satCutOffCount),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                filler: false,
                pointStyle: 'rectRot',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: '전원 ON 횟수',
                data: diagHourArr.map(x => x.powerOnCount),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                filler: false,
                pointStyle: 'star',
                pointRadius: 5,
                pointHoverRadius: 10,
                borderWidth: 2,
            },
        ]
    }



    /* -------------- Diagnostic_Hour Table Columns -- */
    const columns = useMemo(
        () => [
            {
                header: 'Event Date',
                accessorKey: 'eventDate',
            },
            {
                header: 'ST6100 가동 후 경과시간',
                accessorKey: 'st6100On',
            },
            {
                header: '위성 연결시간',
                accessorKey: 'satOnTime',
            },
            {
                header: '위성 신호레벨',
                accessorKey: 'satCnr',
            },
            {
                header: '위성 끊김 횟수',
                accessorKey: 'satCutOffCount',
            },
            {
                header: '전원 ON 횟수',
                accessorKey: 'powerOnCount',
            },
        ]
    )



    return(
        <>
            <div className="category">
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        {/*<Item>Data</Item>*/}
                        {/*--------------- Diagnostic ---------------*/}
                        {/* Daily Part */}
                        <div className="diagnosticParams">
                            <span className="arrayTitle">Daily</span>
                            {diagDailyObj.map((dailyObjList) => (
                                <DiagDailyObj dailyObjList={dailyObjList} key={dailyObjList.eventDate}/>
                            ))}

                            {/*{diagnosticParam()}*/}
                        </div>
                        <br/><br/>
                        {/* Hour Tab Part */}
                        <div className="diagnosticParams">
                            <span className="arrayTitle">Hour</span>
                            <br/>
                            <Box sx={{ width: '500px', boxShadow: 3, marginTop:'5px' }}>
                                <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', width: '100%'}}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        indicatorColor="secondary"
                                        textColor="secondary" //inherit
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                    >
                                        <Tab label="Chart" {...a11yProps(0)} />
                                        <Tab label="Table" {...a11yProps(1)} />

                                    </Tabs>
                                </AppBar>
                            </Box>

                            <Box sx={{ backgroundColor: 'background.paper', width: '100%', boxShadow: 3 }}>
                                <SwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={value}
                                    onChangeIndex={handleChangeIndex}
                                >
                                    {/* Chart */}
                                    <TabPanel value={value} index={0} dir={theme.direction}>
                                        <div className="chart-container" style={{ justifyContent: 'space-between', textAlign:'center', alignItems:'center', position: 'relative', width: '1000px', height:'500px'}}>
                                            <Line options={options} data={data} />
                                        </div>
                                    </TabPanel>
                                    
                                    {/* Table */}
                                    <TabPanel value={value} index={1} dir={theme.direction}>
                                        <MaterialReactTable
                                            title="NMS Current Table"
                                            columns={columns}
                                            data={diagHourArr} />
                                    </TabPanel>
                                </SwipeableViews>
                            </Box>
                        </div>
                    </Grid>

                    <Grid item xs={2}>
                        {/*<Item>Input</Item>*/}
                        <div className="inputValues">
                            <span>Set Date</span>
                            <LocalizationProvider dateAdapter={AdapterDayjs} style={{padding: '0px'}}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Date"/>
                                </DemoContainer>
                            </LocalizationProvider>
                            <br />
                            <span>Device Id</span>
                            <br />
                            <TextField
                                id="outlined-search"
                                label="Device ID"
                                type="search"
                            />
                            <br /><br />
                            <span>Time Zone</span>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-standard"
                                value={timeZone}
                                label="TimeZone"
                                onChange={handleCountryChange}
                            >
                                <MenuItem value={10}>UTC</MenuItem>
                                <MenuItem value={20}>KST</MenuItem>
                            </Select>
                            <br/><br />
                            <Button variant="contained" size="small">Search</Button>
                        </div>
                    </Grid>
                </Grid>

                {/*--------------- Diagnostic _ Hour Tab Part ----------------*/}
                {/*<Box sx={{ width: '500px', boxShadow: 3 }}>
                    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', width: '100%'}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="secondary" //inherit
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />

                        </Tabs>
                    </AppBar>
                </Box>
                <Box sx={{ backgroundColor: 'background.paper', width: '100%', boxShadow: 3 }}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            Table
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            Chart
                        </TabPanel>
                    </SwipeableViews>
                </Box>*/}
            {/*<div className="widget" style={{backgroundColor: 'white'}}>
                <div className="left">
                    <span className="title">{data.title}</span>
                    <span className="counter">
                        3
                    </span>
                    <span className="link">{data.link}</span>
                </div>
                <div className="right">
                    <div className="percentage positive">
                        100%
                    </div>
                    {data.icon}
                </div>
            </div><br/>*/}
                {/*<div className="inquiry">
                    <div className="inquiry date">
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{padding: '0px'}}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className="inquiry input">
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                    </div>
                    <div className="inquiry btn">
                        <Button variant="contained" size="small">Search</Button>
                    </div>
                </div>
                <div className="statusInfo">
                    <div className="table">
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableColumnResizing
                            enableGrouping
                            enableStickyHeader
                            enableStickyFooter
                            initialState={{
                                density: 'compact',
                                expanded: true, //expand all groups by default
                                grouping: ['state'], //an array of columns to group by by default (can be multiple)
                                pagination: { pageIndex: 0, pageSize: 20 },
                                sorting: [{ id: 'state', desc: false }], //sort by state by default
                            }}
                            muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                            muiTableContainerProps={{ sx: { maxHeight: 700 } }}
                        />
                    </div>
                </div>*/}
            </div>
        </>
    )
}

export default Category;