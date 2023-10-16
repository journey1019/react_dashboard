import "./category.scss";
import * as React from "react";
import {useEffect, useState, useMemo, useRef} from "react";
import axios from "axios";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DiagnosticParam from './diagnosticParam/DiagnosticParam';
import IoParam from './ioParam/IoParam';
/* ===== MUI UI Tool ===============*/
import {Box, Stack, Button, Input, darken} from "@mui/material";
import TextField from '@mui/material/TextField';
import MaterialReactTable from 'material-react-table';
import Grid from '@mui/material/Grid';
/* ===== MUI _ LineChart 파악 ===============*/
import {Line, Pie} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


const Category = () => {
    /* ===== Input ==================== */
    const [deviceId, setDeviceId] = useState('01680675SKY33EC'); //01680675SKY33EC 01803120SKY3F6D
    const onChangeDeviceId = (e) => {
        setDeviceId(e.target.value);
    }
    const onResetDeviceId = () => { // Remove
        setDeviceId('');
    }

    const [startDate, setStartDate] = useState(new Date());
    function dateFormat() { // startDate 값 변환
        let month = startDate.getMonth()+1; // getMonth()의 반환 값이 0~11이기 때문에 (+1)
        let day = startDate.getDate();

        month = month>=10 ? month : '0' + month;
        day = day>=10 ? day : '0' + day;
        return startDate.getFullYear().toString() + month.toString() + day.toString();
    }

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

    const [defaultParam, setDefaultParam] = useState([]);
    const [diagnosticParam, setDiagnosticParam] = useState([]);
    const [ioParam, setIoParam] = useState([]);
    /* ===== Variable ==================== */
    const [dailyData, setDailyData] = useState(0);
    const [keyCount, setKeyCount] = useState([]);

    const [resetReason, setResetReason] = useState([]);

    const [satCount, setSatCount] = useState([]);
    const [satTime, setSatTime] = useState([]);

    useEffect(() => {
        const data = returnData().then(
            result=>{
                if(result!=null){
                    let diagnosticList = [];
                    let ioList = [];

                    /* ===== Default Param Pull ==================== */
                    /* ===== DailyData ===== */
                    if(result.defaultParam.dailyData != ''){
                        setDailyData(result.defaultParam.dailyData);
                    } else setDailyData(0);

                    /* ===== KeyCount ===== */
                    if(result.defaultParam.keyCount != '') {
                        setKeyCount(result.defaultParam.keyCount);
                    } else setKeyCount([]);

                    /* ===== ResetReason - newResetReason ===== */
                    if(result.defaultParam.resetReason !== undefined) {
                        let resetReasonList = [];

                        if(typeof result.defaultParam.resetReason['lastResetReason'] != 'undefined'){
                            result.defaultParam.resetReason['lastResetReason'].map(function(last){
                                last.resetReasonName = 'LastResetReason';
                                resetReasonList.push(last);
                            })
                        }
                        if(typeof result.defaultParam.resetReason['hardwareResetReason'] != 'undefined') {
                            result.defaultParam.resetReason['hardwareResetReason'].map(function (hardware) {
                                hardware.resetReasonName = 'HardwareResetReason';
                                resetReasonList.push(hardware);
                            })
                        }
                        if(typeof result.defaultParam.resetReason['softwareResetReason'] != 'undefined') {
                            result.defaultParam.resetReason['softwareResetReason'].map(function (software) {
                                software.resetReasonName = 'SoftwareResetReason';
                                resetReasonList.push(software);
                            })
                        }
                        setResetReason(resetReasonList)
                    } else setResetReason([])

                    /* ===== Sat Count _ Color 지정을 위한 Object 속성 추가 ===== */
                    result.defaultParam.sat.satCount.map(function(type){
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

                    /* ===== Sat Time _ Line Chart의 Value 지정을 위한 Object 속성 추가 ===== */
                    result.defaultParam.sat.satTime.map(function(type) {
                        if(type.value === 'APACRB11') {
                            type.id = 1;
                        }
                        else if(type.value === 'MEASRB19') {
                            type.id = 2;
                        }
                        else if(type.value === 'IOERB19') {
                            type.id = 3;
                        }
                    })
                    setSatTime(result.defaultParam.sat.satTime);

                    /* ===== Get Diagnostic DataSet ========== */
                    diagnosticList.push(result.diagnosticParam);
                    setDiagnosticParam(diagnosticList); // Props.DiagnosticParam

                    ioList.push(result.ioParam);
                    setIoParam(ioList); // Props.IoParam

                    setGetDiagnostic(result); // Param All Data
                } else if(result === undefined) { // Input Value에 따라 result 값이 undefined인 경우
                    setDailyData('Not collected');
                    setKeyCount([]);
                    setResetReason([]);
                    setSatCount([]);
                    setSatTime([]);
                    setDiagnosticParam([]);
                    setIoParam([]);
                    setGetDiagnostic([]);
                }
                else{
                }
            });
        return () => {
            clearTimeout(getDiagnostic);
        }
    }, [deviceId, startDate, timezoneSelectValue]);

    useEffect(() => {
    }, [getDiagnostic, diagnosticParam, ioParam, dailyData, keyCount, resetReason, satCount, satTime])


    async function returnData() {
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

    /* ===== Param Data : IoParam || DiagnosticParam ========== */
    function ParamData({ioParam, diagnosticParam}) {
        if(typeof getDiagnostic.ioParam != "undefined"){
             return <IoParam ioParam={ioParam} />
        }
        else if(typeof getDiagnostic.diagnosticParam != "undefined"){
            return <DiagnosticParam diagnosticParam={diagnosticParam} />
        }
        if(typeof getDiagnostic.ioParam != "undefined" && typeof getDiagnostic.diagnosticParam != "undefined"){
            return (
                <>
                    <DiagnosticParam diagnosticParam={diagnosticParam} />
                    <IoParam ioParam={ioParam} />
                </>
            )
        }
        else {
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

    /* -------------- Daily Data ----- */
    function KeyCount({keyCountList}) {
        if(keyCountList != null) {
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
        else return null;
    }

    /* -------------- Daily Data ----- */
    function ResetReason({resetReasonList}) {
        if(resetReasonList != null) {
            return(
                <>
                    <div className="resetReasonList">
                        <div className="resetReasonName">
                            {resetReasonList.resetReasonName}
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
        else return null;
    }

    /* ========== Style ======================================== */
    /* -------------- PieChart Option ----- */
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
                text: 'Satellite Type',
                font: {
                    size: '15px',
                    weight: 'bold'
                }
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
    const piehoverBackColor = satCount.map(satHoverBackColor=>satHoverBackColor.hoverBackgroundColor)

    const pieData = {
        maintainAspectRatio: false,
        responsive: false,
        labels: pieLabel,
        datasets: [
            {
                data: pieDataCount,
                backgroundColor: pieBackColor,
                hoverBackgroundColor: piehoverBackColor,
            }
        ]
    };
    /* -------------- Table Option ----- */
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
    /* -------------- LineChart Option ----- */
    const lineOptions = {
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
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                }
            },
            title: {
                display: true,
                text: 'Satellite Type',
                font: {
                    size: '15px',
                    weight: 'bold'
                }
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                gridLines: {
                    color: 'rgba(166, 201, 226, 1)',
                    lineWidth: 1
                }
            }
        }
    };
    const lineLabels = satTime.map(x => x.key);
    const lineData = {
        lineLabels,
        datasets: [
            {
                label: 'IOERB19',
                data: satTime.map(x => x.id),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                filler: true,
                pointStyle: 'circle',
                pointRadius: 5, // 기본 Point 반지름
                pointHoverRadius: 10, // Point 선택 시 반지금
                borderWidth: 2, // 기본 선 두께
            },
            {
                label: 'IOERB19',
                data: satTime.map(x => x.value),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                filler: true,
                pointStyle: 'circle',
                pointRadius: 5, // 기본 Point 반지름
                pointHoverRadius: 10, // Point 선택 시 반지금
                borderWidth: 2, // 기본 선 두께
            }
        ]
    }
    /* ================================================================= */
    return(
        <>
            <div className="category">
                <Grid container spacing={1}>
                    <Grid item xs={4}>
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

                    <Grid item xs={6}>
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
                                                data={pieData}
                                                options={pieOptions}
                                            />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={9}>
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
                                {/*<Grid item xs={4.5}>
                                    <div className="LineChart-Container">
                                        <Line options={lineOptions} data={lineData} />
                                    </div>
                                </Grid>*/}
                            </Grid>

                        </div>
                    </div><br />
                    <ParamData ioParam={ioParam} diagnosticParam={diagnosticParam} />
                </Grid>
            </div>
        </>
    )
}

export default Category;