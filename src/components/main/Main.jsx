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

/* Icon */
import DateRangeIcon from '@mui/icons-material/DateRange'; // StartDate
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from "dayjs"; // EndDate

/***
 * @Author : jhlee
 * @date : 2024-02-17
 * @Desc : {
 *  접속 시 맨 처음 화면을 구성하는 Main Component
 *  Main Page에 종속
 * }
 */

const Main = () => {
    const sessionNmsCurrent = JSON.parse(sessionStorage.getItem('nmsCurrent'));

    /* URL */
    // Table
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const historyDataUrls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    // Diagnostic
    const diagnosticListUrls = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    const periodDiagnosticListUrls = "https://iotgwy.commtrace.com/restApi/nms/getPeriodDiagnostic";
    // Table - Ping
    //const remoteCommandGetUrls = "https://iotgwy.commtrace.com/restApi/send/getSendStatus";
    //const remoteCommandSendUrls = "https://iotgwy.commtrace.com/restApi/send/sendMessage";
    //const urls = "http://testvms.commtrace.com:29455/restApi/nms/getPeriodDiagnostic";


    /** Variant */
    const [startDate, setStartDate] = useState(dayjs().subtract(30, 'days'));
    //const [endDate, setEndDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().subtract(1, 'days'));

    // startDate부터 endDate까지의 날짜 배열 생성
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        dateArray.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
    }


    const [nmsCurrent, setNmsCurrent] = useState([]);
    const [nmsHistory, setNmsHistory] = useState([]);
    const [diagnosticList, setDiagnosticList] = useState([]);
    const [periodDiagnosticList, setPeriodDiagnosticList] = useState([]);

    const [refreshTime, setRefreshTime] = useState(0);




    /** Params */
    // Table
    const currentDataParams = {detailMessage: true};
    const historyDataParams = {detailMessage: true};
    // Diagnostic
    const diagnosticListParams = {startDate: startDate.format('YYYY-MM-DDTHH'), endDate: endDate.format('YYYY-MM-DDTHH'), keyType: 2}
    const periodDiagnosticListParams = {startDate: startDate.format('YYYY-MM-DDTHH'), endDate: endDate.format('YYYY-MM-DDTHH'), keyType: 2}
    //const periodDiagnosticListParams = {startDate: '2024-01-26T00', endDate: '2024-01-18T23', keyType: 2}


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
    /** Status 기준으로 세분화된 NmsCurrent 데이터 리스트 전달하는 함수 */
    function WidgetStatusLists(status) {
        setStatusNmsCurrent(status);
    }

    // 2) Widget -> Table
    // 네트워크 클릭 타입값 전달 (Table Column Value)
    /**Widget 에서 선택한 Status Value 를 다른 컴포넌트로 전달하는 함수*/
    function StatusClick(click) {
        setStatusClickValue(click);
    }

    // 3) Table -> Map
    // NMS 모든 정보 전달
    /** Table 에 있는 NMSCurrnet 전체 데이터를 전달해주기 위한 함수 */
    function MapLists(map) {
        setMapNmsCurrent(map);
    }
    // 3) Table -> Map
    // Table에서 선택한 DeviceId를 map에서 전달하고, 맵 안에서 위치값으로 마커의 이동을 측정함
    /** Table 에서 선택한 단말의 정보를 Map 에서 보여주기 위한 함수 */
    function MapClick(deviceId){
        setSelectDevice(deviceId);
    }

    /*useEffect(() => {
        // 초기 호출
        fetchData();

        // 1분마다 호출
        const intervalId = setInterval(fetchData, 60000);

        // 컴포넌트가 언마운트되면 clearInterval 호출
        return () => clearInterval(intervalId);
    }, [])
    const fetchData = async () => {
        try{
            const result = await ReturnRequest(currentDataUrls, currentDataParams);
            if(result !== null) {
                setNmsCurrent(result);
            }
        } catch (error){
            console.log('Error fetching NMS Current Data', error)
        }
    }*/

    /** API 호출 _ Module(Return Request) */
    useEffect(() => {
        //clearTimeout(nmsCurrent);
        //ReturnRequest(historyDataUrls, historyDataParams).then(result=>{if(result!=null){setNmsHistory(result)}})
        ReturnRequest(currentDataUrls, currentDataParams).then(result=>{if(result!=null){setNmsCurrent(result);}});
        ReturnRequest(diagnosticListUrls, diagnosticListParams).then(allDiag=>{if(allDiag!=null){setDiagnosticList(allDiag);}});
        ReturnRequest(periodDiagnosticListUrls, periodDiagnosticListParams).then(periodDiag=>{if(periodDiag!=null){setPeriodDiagnosticList(periodDiag);}});
    }, [])


    // Diagnostic Button 그룹 항목
    const daysSelectButtons = [
        <Button variant="contained" size="small" color="error" sx={{color:'white'}} disabled>7 Days</Button>,
        <Button variant="contained" size="small" color="error" sx={{color:'white'}} disabled>30 Days</Button>
    ]


    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={9} sx={{display: 'flex', flex: 1 }}>
                    <Box className="construct" sx={{ flex: 1 }}>
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5" >Network Status</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Depending on the time the data was collected (Based on 'ParsingTimeGap')</Typography>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component" sx={{pb: 0.7}}>
                            <Widget statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', flex: 1 }}>

                    {/* StatusPie*/}
                    <Box className="construct" sx={{ flex: 1 }}>
                        <Box className="construct_top_items" sx={{display: 'flex', justifyContent:'end', alignItems: 'center', textAlign: 'center'}}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#394251', paddingRight: '8px'}}>Total number of device : </Typography>
                            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', color: '#394251'}}>{sessionNmsCurrent? sessionNmsCurrent.length: ''}</Typography>
                        </Box>
                        <Box className="construct_component" sx={{height: 'auto'}}>
                            <StatusPie statusNmsCurrent={statusNmsCurrent} />
                        </Box>
                    </Box>
                </Grid>
                <br/>

                <Grid item xs={12} sx={{display: 'flex'}}>
                    <Box className="construct">
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5">Diagnostic Chart</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Data for the last 30 days</Typography>
                            </Box>
                            <Box className="construct_top_items" sx={{display: 'flex', alignItems: 'center', '& > *': {m: 1,},}}>
                                <Box className="construct_top_items_dates">
                                    <DateRangeIcon />
                                    <Typography variant="body1">{startDate.toString()}  ~</Typography>
                                    <CalendarMonthIcon />
                                    <Typography variant="body1">{endDate.toString()}</Typography>
                                </Box>
                                <ButtonGroup size="small" aria-label="Small button group">{daysSelectButtons}</ButtonGroup>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component" sx={{pt: 1.5, pb: 1, backgroundColor: 'white'}}>
                            <Diagnostic periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                        </Box>
                    </Box>
                </Grid><br/>



                {/*<Grid item xs={9} sx={{display: 'flex', flex: 1 }}>
                    <Box className="construct" >
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5">Diagnostic Chart</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Data for the last 30 days</Typography>
                            </Box>
                            <Box className="construct_top_items" sx={{flexDirection: 'column', alignItems: 'center', '& > *': {m: 1,},}}>
                                <ButtonGroup size="small" aria-label="Small button group">
                                    {daysSelectButtons.map((button, index) => (
                                        <React.Fragment key={index}>{button}</React.Fragment>
                                    ))}
                                </ButtonGroup>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component" sx={{pt: 1, pb: 1}}>
                             기존 - <DiagnosticGraph diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                            <DiagnosticChart periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                            <br/>
                            <Grid item xs={12}>
                                <Box className="construct" >
                                    <Typography variant="h5" >Map</Typography>
                                    <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Device location information</Typography>
                                    <hr/><br/>
                                    <Box className="construct_component" sx={{height: '100%'}}>
                                        <Map mapNmsCurrent={mapNmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue}/>
                                    </Box>
                                </Box>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} sx={{display: 'flex', flex: 1 }}>
                    <Box className="construct_component" >
                        <DiagnosticWidget periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                    </Box>
                </Grid>*/}

                <Grid item xs={12}>
                    <Box className="construct" >
                        <Typography variant="h5" >Map</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Device location information</Typography>
                        <hr/><br/>
                        <Box className="construct_component" sx={{height: '100%'}}>
                            <Map mapNmsCurrent={mapNmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>

                {/*<Grid item xs={9} sx={{display: 'flex', flex: 1 }}>
                    <Box className="construct" sx={{ flex: 1 }}>
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5" >Network Status</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Depending on the time the data was collected (Based on 'ParsingTimeGap')</Typography>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component" sx={{pb: 0.7}}>
                            <Widget statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', flex: 1 }}>

                     StatusPie
                    <Box className="construct" sx={{ flex: 1 }}>
                        <Box className="construct_top_items" sx={{display: 'flex', justifyContent:'end', alignItems: 'center', textAlign: 'center'}}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#394251', paddingRight: '8px'}}>Total number of device : </Typography>
                            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', color: '#394251'}}>306</Typography>
                        </Box>
                        <Box className="construct_component" sx={{height: 'auto'}}>
                            <StatusPie statusNmsCurrent={statusNmsCurrent} />
                        </Box>
                    </Box>
                </Grid>
                <br/>
                <Grid item xs={9} sx={{display: 'flex', flex: 1 }}>
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
                        <Box className="construct_component" sx={{pt: 1, pb: 1}}>
                            <DiagnosticGraph diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                            <DiagnosticChart periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                            <Diagnostic periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} sx={{display: 'flex', flex: 1 }}>
                    <Box className="construct_component" >
                        <DiagnosticWidget periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                    </Box>
                </Grid>*/}



                {/*<Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column' }}>

                    
                    <Box className="construct" sx={{ flex: 1 }}>
                        <Box className="construct_top">
                            <Box className="construct_top_titles">
                                <Typography variant="h5" >Network Status</Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Depending on the time the data was collected (Based on 'ParsingTimeGap')</Typography>
                            </Box>
                        </Box>
                        <hr/>
                        <Box className="construct_component" sx={{pb: 0.7}}>
                            <Widget statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                    <br/>

                    
                    <Box className="construct" sx={{ flex: 1 }}>
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
                        <Box className="construct_component" sx={{pt: 1, pb: 1}}>
                            <DiagnosticChart periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                            
                        </Box>
                    </Box>
                    <br/>

                </Grid>


                <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>

                    
                    <Box className="construct" sx={{ flex: 1 }}>
                        <Box className="construct_top_items" sx={{display: 'flex', justifyContent:'end', alignItems: 'center', textAlign: 'center'}}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#394251', paddingRight: '8px'}}>Total number of device : </Typography>
                            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', color: '#394251'}}>306</Typography>
                        </Box>
                        <Box className="construct_component" sx={{height: 'auto'}}>
                            <StatusPie statusNmsCurrent={statusNmsCurrent} />
                        </Box>
                    </Box>
                    <br/>

                    
                    <Box className="construct_component" sx={{ flex: 1 }}>
                        <DiagnosticWidget periodDiagnosticList={periodDiagnosticList} diagnosticList={diagnosticList} startDate={startDate} endDate={endDate}/>
                    </Box>
                    <br/>

                </Grid>*/}

                {/* Map */}
                {/*<Grid item xs={12}>
                    <Box className="construct" >
                        <Typography variant="h5" >Map</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Device location information</Typography>
                        <hr/><br/>
                        <Box className="construct_component" sx={{height: '100%'}}>
                            <Map mapNmsCurrent={mapNmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>*/}

                {/* Table */}
                <Grid item xs={12}>
                    <Box className="construct">
                        <Typography variant="h5" >Mobile Originated Messages</Typography>
                        {/*<Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>All Current Data</Typography>*/}
                        <hr/><br/>
                        <Box className="construct_component" >
                            <Table nmsCurrent={nmsCurrent} WidgetStatusLists={WidgetStatusLists} statusClickValue={statusClickValue} MapLists={MapLists} MapClick={MapClick} startDate={startDate} endDate={endDate}/>
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





            </Grid>

        </>
    )
}

export default Main;