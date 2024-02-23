/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import "./main.scss";
import Widget from "./component/Widget/Widget";
import StatusPie from "./component/StatusPercent/StatuePie";
import StatusPercent from "./component/StatusPercent/StatusPercent";
import Table from "./component/Table/Table";
import Map from "./component/Map/Map";
import Diagnostic from "./component/diagnostic/Diagnostic";
import DiagnosticWidget from "./component/diagnostic/DiagnosticWidget";
import DiagnosticGraph from "./component/diagnostic/DiagnosticGraph";
import DiagnosticChart from "./component/diagnostic/DiagnosticChart";
import FaultyClass from "./component/faultyClass/FaultyClass";

/* Module */
import ReturnRequest from "../modules/ReturnRequest";
import useDidMountEffect from "../modules/UseDidMountEffect";

/* MUI */
import { Grid, Box, Typography, Divider, Container, Button, ButtonGroup, darken } from "@mui/material";



/***
 * @Author : jhlee
 * @date : 2024-02-27
 * @Desc : {
 *  접속 시 맨 처음 화면을 구성하는 Main Component
 *  Main Page에 종속
 * }
 */

const Main = () => {

    /* URL */
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const historyDataUrls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    const diagnosticListUrls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    const periodDiagnosticListUrls = "https://iotgwy.commtrace.com/restApi/nms/getPeriodDiagnostic";

    //const urls = "http://testvms.commtrace.com:29455/restApi/nms/getPeriodDiagnostic";

    /* Param */
    // Diagnostic - 31 Days (대략 한달간 데이터)
    const now = new Date();
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -30)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // 시각화에서 날짜 범위에 따른 모든 단말의 데이터 상태를 파악하기 위함 (DiagData -> Chart)
    const dateArray = []; // ['2024-01-01', ..., '2024-02-01']
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0]+ 'T00:00';
        dateArray.push(formattedDate);
    }

    const currentDataParams = {detailMessage: true};
    const historyDataParams = {detailMessage: true};
    // 한달간 데이터(임의: 2024-01-06 ~ 2024-02-06)
    const diagnosticListParams = {startDate: startDate + 'T00', endDate: endDate + 'T23', keyType: 2}
    const periodDiagnosticListParams = {startDate: startDate + 'T00', endDate: endDate + 'T23', keyType: 2}
    //const periodDiagnosticListParams = {startDate: '2024-01-26T00', endDate: '2024-01-18T23', keyType: 2}


    console.log(startDate)
    console.log(endDate)
    console.log(periodDiagnosticListParams)
    /* Variable */
    const [nmsCurrent, setNmsCurrent] = useState([]);
    const [nmsHistory, setNmsHistory] = useState([]);
    const [diagnosticList, setDiagnosticList] = useState([]);
    const [periodDiagnosticList, setPeriodDiagnosticList] = useState([]);

    const [refreshTime, setRefreshTime] = useState(0);


    /* Props */
    // 1) Table -> Widget
    // 네트워크 상태 기준 구분한 단말기 전체 리스트
    const [statusNmsCurrent, setStatusNmsCurrent] = useState({
        date: '',
        runningList: [],
        cautionList: [],
        warningList: [],
        faultyList: [],
    });
    // 2) Widget -> Table
    // 네트워크 카운트 버튼 클릭시, 상태(type) 값
    const [statusClickValue, setStatusClickValue] = useState("");
    // 3) Table -> Map
    // NMS 모든 정보
    const [mapNmsCurrent, setMapNmsCurrent] = useState([]);
    // 3) Table -> Map
    // Table Row 선택시, DeviceId 전달 - Map Marker Changed (location)
    const [selectDevice, setSelectDevice] = useState();



    /* Inheritance */
    // 1) Table -> Widget
    // 네트워크 상태 기준으로 세분화한 단말기 리스트 전달
    function WidgetStatusLists(status) {
        setStatusNmsCurrent(status);
    }

    // 2) Widget -> Table
    // 네트워크 클릭 타입값 전달 (Table Column Value)
    function StatusClick(click) {
        setStatusClickValue(click);
    }

    // 3) Table -> Map
    // NMS 모든 정보 전달
    function MapLists(map) {
        setMapNmsCurrent(map);
    }
    // 3) Table -> Map
    // Table에서 선택한 DeviceId를 map에서 전달하고, 맵 안에서 위치값으로 마커의 이동을 측정함
    function MapClick(deviceId){
        setSelectDevice(deviceId);
    }



    /* API 호출 _ Module(ReturnRequest) */
    useEffect(() => {
        ReturnRequest(currentDataUrls, currentDataParams).then(
            result=>{if(result!=null){setNmsCurrent(result);}});
        //clearTimeout(nmsCurrent);
        //ReturnRequest(historyDataUrls, historyDataParams).then(result=>{if(result!=null){setNmsHistory(result)}})
        ReturnRequest(diagnosticListUrls, diagnosticListParams).then(allDiag=>{if(allDiag!=null){setDiagnosticList(allDiag);}});
        ReturnRequest(periodDiagnosticListUrls, periodDiagnosticListParams).then(periodDiag=>{if(periodDiag!=null){setPeriodDiagnosticList(periodDiag);}});
    }, [])

    console.log(nmsCurrent);
    console.log(diagnosticList);
    console.log(periodDiagnosticList); // 7번 로직 돌다가 가장 마지막에 데이터 생성 :[]

    // Diagnostic Button 그룹 항목
    const daysSelectButtons = [
        <Button variant="contained" size="small" color="error" sx={{color:'white'}} disabled>7 Days</Button>,
        <Button variant="contained" size="small" color="error" sx={{color:'white'}} disabled>30 Days</Button>
    ]


    /*const finalResultValue = {};
    useEffect(() => {
        // periodDiagnosticList 가 있는 경우
        if((periodDiagnosticList !== null && periodDiagnosticList !== undefined) ){
            // periodDiagnosticList 가 객체이고, 그 객체의 키 개수가 1 이상인지 확인
            if(periodDiagnosticList && typeof(periodDiagnosticList) === 'object' && Object.keys(periodDiagnosticList).length > 0) {
                // Diagnostic Data 가공
                // (Main 에서 하는 이유는 컴포넌트 구조 때문)
                const diagIoValue = periodDiagnosticList.ioValue;
                // 최종 결과를 저장할 객체 초기화

                // dateArray 와 diagIoValue 객체 매칭
                // dateArray 에 있는 날짜를 기준으로 finalResultValue 에 추가 또는 null 값 할당
                dateArray.forEach(date => {
                    // 해당 날짜가 존재하지 않는 경우 각 속성 값에 null 값 생성
                    if(!diagIoValue[date]) {
                        finalResultValue[date] = {
                            powerOnCount: null,
                            satCnr: null,
                            satCutOffCount: null,
                            satOnTime: null,
                            st6100On: null,
                        };
                    }
                    // 해당 날짜에 데이터가 있는 경우 계산
                    else{
                        // 해당 날짜의 데이터 (= 수집된 단말기 목록)
                        const entries = diagIoValue[date];
                        // 각 날짜에 대해 각 단말기의 속성 값 더하기
                        const avgValues = entries.reduce((avg, entry) => {
                            Object.keys(entry).forEach(key => {
                                if (key !== 'deviceId') {
                                    avg[key] = (avg[key] || 0) + entry[key];
                                }
                            });
                            return avg;
                        }, {});
                        console.log(avgValues);

                        Object.keys(avgValues).forEach(key => {
                            // 평균 = 각 날짜에 대한 속성 값들을 더한 값 / 해당 날짜의 객체 수
                            avgValues[key] /= entries.length;

                            // 정수는 유지, 실수는 소수점 둘째 자리까지만 유지
                            avgValues[key] = Number.isInteger(avgValues[key]) ? avgValues[key] : parseFloat(avgValues[key].toFixed(2));
                        });
                        finalResultValue[date] = avgValues;
                    }
                })
            }
        }
    }, [periodDiagnosticList])*/





    return(
        <>
            <Grid container spacing={1}>

                {/* 네트워크 상태 */}
                <Grid item xs={9}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5" >Network Status</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Depending on the time the data was collected (Based on 'ParsingTimeGap')</Typography>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component" >
                            <Widget statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Box className="construct_top_items" sx={{display: 'flex', justifyContent:'end', alignItems: 'center', textAlign: 'center'}}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#394251', paddingRight: '8px'}}>Total number of device : </Typography>
                            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', color: '#394251'}}>306</Typography>
                        </Box>
                        <Box className="construct_component" sx={{height: 'auto'}}>
                            <StatusPie statusNmsCurrent={statusNmsCurrent} />
                        </Box>
                    </Box>
                </Grid>

                {/* 장애 단말기 판별 */}
                {/*<Grid item xs={12}>
                    <Box className="construct">
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5" >Satellite Summary</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>위성 가동률 || 위성연결 작동시간 || 위성신호</Typography>
                            </Box>
                            <Box className="construct_top_items">
                                <Button variant="contained" size="large" color="error">Reset</Button>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component">
                            <FaultyClass />
                        </Box>
                    </Box>
                </Grid>*/}

                {/* Diagnostic Chart */}
                <Grid item xs={9}>
                    <Box className="construct">
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5">Diagnostic Chart</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Data for the last 30 days</Typography>
                            </Box>
                            <Box className="construct_top_items" sx={{flexDirection: 'column', alignItems: 'center', '& > *': {m: 1,},}}>
                                <ButtonGroup size="small" aria-label="Small button group">{daysSelectButtons}</ButtonGroup>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component">
                            {/*<DiagnosticGraph diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>*/}
                            <DiagnosticChart periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                            {/*<Diagnostic periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>*/}
                        </Box>
                    </Box>
                </Grid>
                {/* Diagnostic Widget */}
                <Grid item xs={3}>
                    <Box className="construct_component">
                        <DiagnosticWidget periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                    </Box>
                </Grid>

                {/* 네크워크 상태 시각화 */}
                {/*<Grid item xs={3}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Typography variant="h5" >Network Status Chart</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Pie Chart</Typography>
                        <hr/><br/>
                        <Box className="construct_component" sx={{height: '100%'}}>
                            <StatusPercent statusNmsCurrent={statusNmsCurrent} />
                        </Box>
                    </Box>
                </Grid>*/}

                {/*<Grid item xs={4.5}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Device Summary</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Send Data Error | DB Error | Reset Reason Error | Protocol Error | Battery aging etc..</Typography>
                        <hr/>
                        <Box className="construct_component">
                            Device FaultyClass
                        </Box>
                    </Box>
                </Grid>*/}

                {/* Satellite Chart && Map*/}
                {/*<Grid item xs={12}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Diagnostic Chart</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>위성 가동률 | 위성신호 | 위성연결 | 단말기 작동 시간</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            <Diagnostic />
                        </Box>
                    </Box>
                </Grid>*/}


                <Grid item xs={9}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Typography variant="h5" >Map</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Device location information</Typography>
                        <hr/>
                        <Box className="construct_component" sx={{height: '100%'}}>
                            <Map mapNmsCurrent={mapNmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>

                {/* Table */}
                <Grid item xs={12}>
                    <Box className="construct">
                        <Typography variant="h5" >Table</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>All Current Data</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            <Table nmsCurrent={nmsCurrent} WidgetStatusLists={WidgetStatusLists} statusClickValue={statusClickValue} MapLists={MapLists} MapClick={MapClick}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </>
    )
}

export default Main;