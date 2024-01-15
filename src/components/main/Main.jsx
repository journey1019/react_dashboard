/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import "./main.scss";
import Widget from "./component/Widget/Widget";
import StatusPercent from "./component/StatusPercent/StatusPercent";
import Table from "./component/Table/Table";
import Map from "./component/Map/Map";

/* Module */
import ReturnRequest from "../modules/ReturnRequest";
import useDidMountEffect from "../modules/UseDidMountEffect";

/* MUI */
import { Grid, Box, Typography, Divider, Container, Button, darken } from "@mui/material";


const Main = () => {
    /* URL & Param */
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const currentDataParams = {detailMessage: true};

    //const historyDataUrls = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    //const historyDataParams = {detailMessage: true};

    const [nmsCurrent, setNmsCurrent] = useState([]);
    //const [nmsHistory, setNmsHistory] = useState([]);

    /* Table -> Widget */
    // 네트워크 상태 기준으로 세분화한 단말기 리스트
    const [statusNmsCurrent, setStatusNmsCurrent] = useState({
        date: '',
        runningList: [],
        cautionList: [],
        warningList: [],
        faultyList: [],
    });
    // 네트워크 상태 기준으로 세분화한 단말기 리스트 전달
    function WidgetStatusLists(status) {
        setStatusNmsCurrent(status);
    }

    /* Widget -> Table*/
    // 네트워크 카운트 버튼 클릭시, 상태(type)값
    const [statusClickValue, setStatusClickValue] = useState("");
    // 네트워크 클릭 타입값 전달 (Table Column Value)
    function StatusClick(click) {
        setStatusClickValue(click);
    }

    /* Table -> Map */
    // 모든 정보
    const [mapNmsCurrent, setMapNmsCurrent] = useState([]);
    // Table Row 선택시, DeviceId 전달 - Map Marker Changed (location)
    const [selectDevice, setSelectDevice] = useState();
    function MapLists(map) {
        setMapNmsCurrent(map);
    }

    function MapClick(deviceId){
        setSelectDevice(deviceId);
    }




    const [refreshTime, setRefreshTime] = useState(0);

    /* Module(ReturnRequest) _ API 호출*/
    useEffect(() => {

        ReturnRequest(currentDataUrls, currentDataParams).then(
            result=>{if(result!=null){setNmsCurrent(result);}});
        //clearTimeout(nmsCurrent);
        //ReturnRequest(historyDataUrls, historyDataParams).then(result=>{if(result!=null){setNmsHistory(result)}})
    }, [])

    console.log(nmsCurrent);




    return(
        <>
            <Grid container spacing={1}>

                {/* 네트워크 상태 */}
                <Grid item xs={12}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Network Status</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Depending on the time the data was collected (Based on 'ParsingTimeGap')</Typography>
                        <hr/><br/>
                        <Box className="construct_component" sx={{ display: 'flex'}}>
                            <Widget type="running" statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            <Widget type="caution" statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            <Widget type="warning" statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            <Widget type="faulty" statusNmsCurrent={statusNmsCurrent} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>

                {/* 네크워크 상태 시각화 */}
                <Grid item xs={3}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Network Status Chart</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Pie Chart</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            <StatusPercent statusNmsCurrent={statusNmsCurrent} />
                        </Box>
                    </Box>
                </Grid>

                {/* 장애 단말기 판별 */}
                <Grid item xs={9}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Fault Classification</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Reset Error | Collection Error(위성, 서버, DB, ..) | Signal Error(위성, 서버) | Send Error | Protocol Error, 배터리 노후화 등..</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            에러 항목 판별
                        </Box>
                    </Box>
                </Grid>

                {/* Satellite Chart */}
                <Grid item xs={12}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Satellite Chart</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>위성 가동률 | 위성신호 | 위성연결 | 단말기 작동 시간</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            전체 위성 데이터 차트
                        </Box>
                    </Box>
                </Grid>

                {/* Table && Map */}
                <Grid item xs={6}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Table</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>All Current Data</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            <Table nmsCurrent={nmsCurrent} WidgetStatusLists={WidgetStatusLists} statusClickValue={statusClickValue} MapLists={MapLists} MapClick={MapClick}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box className="construct">
                        <Typography variant="h4" gutterBottom>Map</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>Device location information</Typography>
                        <hr/><br/>
                        <Box className="construct_component">
                            <Map mapNmsCurrent={mapNmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </>
    )
}

export default Main;