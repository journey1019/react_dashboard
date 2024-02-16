/* React */
import React, { useState, useEffect } from "react";

/* Import */
import "./deviceDiagnostic.scss";
import ReturnRequest from "../../../modules/ReturnRequest";

import DiagnosticChartRatio from "./deviceDiagnosticChart/DiagnosticChartRatio";
import DiagnosticChartSatSignal from "./deviceDiagnosticChart/DiagnosticChartSatSignal";
import DiagnosticChartSatTime from "./deviceDiagnosticChart/DiagnosticChartSatTime";
import DiagnosticChartDvTime from "./deviceDiagnosticChart/DiagnosticChartDvTime";

/* MUI */
import {Grid, Box, Typography, Stack, LinearProgress} from "@mui/material";
import SatelliteOperationRate from "./diagnostic/satelliteRate/SatelliteOperationRate";
import SatelliteMultiChart from "./diagnostic/satelliteChart/SatelliteMultiChart";
import Chart from "react-apexcharts";

/* ApexChart */
import ReactApexChart from "react-apexcharts";

const DeviceDiagnostic = (props) => {
    console.log(props)

    /* 변수선언 */
    // 하루시간(분)기준
    const timeOfOnDay = '1440';
    // 위성 접속률
    const[satOnPercent, setSatOnPercent] = useState('');
    // 단말기 가동률
    const[pwrOnPercent, setPwrOnPercent] = useState('');

    /* Line Chart Options(data) */
    const [st6100OnList, setSt6100OnList] = useState([]);
    const [satOnTimeList, setSatOnTimeList] = useState([]);
    const [satSignalList, setSatSignalList] = useState([]);
    const [eventDateList, setEventDateList] = useState([]);

    const eventDateArray1 = [];

    // 데이터가 없는 경우
    const [isLoading, setIsLoading] = useState(true);

    console.log(props.getDiagnostic)
    console.log(Object.keys(props.oneDiagnostic).length)

    if(Object.keys(props.getDiagnostic).length > 0) {

        // EventDate 배열
        const eventDateArray = [];

        // 단말의 위성연결시간 배열
        const satOnTimeArray = [];
        // 단말 가동시간 배열
        const st6100OnArray = [];
        // 위성 신호레벨 배열
        const satCnrArray = [];
        // 위성 끊김 횟수 배열
        const satCutOffCountArray = [];
        // 데이터 전송 횟수
        const sendDataCountArray = [];
        // 전원 On 횟수
        const powerOnCountArray = [];

        props.getDiagnostic.forEach(deviceData => {
            console.log(deviceData)

            // EventDate Array
            const eventDateObj  = {eventDates: deviceData.data.map(entry => entry.eventDate)};

            const satOnTimeObj = {satOnTimes: deviceData.data.map(entry => entry.satOntime)};
            const st6100OnObj = {st6100On: deviceData.data.map(entry => entry.st6100On)};
            const satCnrObj = {satCnr: deviceData.data.map(entry => entry.satCnr)};
            const satCutOffCountObj = {satCurOffCount: deviceData.data.map(entry => entry.satCurOffCount)};
            const sendDataCountObj = {sendDataCount: deviceData.data.map(entry => entry.sendDataCount)};
            const powerOnCountObj = {powerOnCount: deviceData.data.map(entry => entry.powerOnCount)};

            eventDateArray1.push(deviceData.data.map(entry => entry.eventDate))
            eventDateArray.push(eventDateObj);
            st6100OnArray.push(st6100OnObj);
            satCnrArray.push(satCnrObj);
            satCutOffCountArray.push(satCutOffCountObj);
            sendDataCountArray.push(sendDataCountObj);
            powerOnCountArray.push(powerOnCountObj);
        })
        console.log(eventDateArray1);
        console.log(eventDateArray);
        console.log(st6100OnArray);
        console.log(eventDateArray);
        console.log(eventDateArray);
        console.log(eventDateArray);




        /*useEffect(() => {
            // 선택된 단말기에게 Diagnostic Data 가 있는지 판별
            const oneDiagnostic = Object.keys(props.oneDiagnostic).length === 0;

            if(oneDiagnostic) {
                console.log('선택된 단말기에게 Diagnostic Data 가 없음')
            }
            else{
                props.oneDiagnostic.data.map(function(dataList){
                    //console.log(dataList)

                    /!* Radial Chart *!/
                    // Sat On Time 배열
                    satOnList.push(dataList.satOnTime);
                    // Pwr On Time 배열
                    pwrOnList.push(dataList.st6100On);
                    // Sat Signal 배열
                    satSignList.push(dataList.satCnr);
                    // 날짜 배열
                    DateList.push(dataList.eventDate);

                    /!* Line Chart Option _ X 축 *!/
                    // props.oneDiagnostic.data.map(x=>x.~)
                    setSt6100OnList(satOnList);
                    setSatOnTimeList(pwrOnList);
                    setSatSignalList(satSignList);
                    setEventDateList(DateList);
                })

                // SatOnTimeSum = Sat On Time 배열 요소의 합계
                let satOnListSum = satOnList.reduce((acc, currentValue) => acc+currentValue,0);
                // PwrOnTimeSum = Pwr On Time 배열 요소의 합계
                let pwrOnListSum = pwrOnList.reduce((acc, currentValue) => acc+currentValue,0);

                props.oneDiagnostic['satOnPercent'] = satOnListSum/(satOnList.length*timeOfOnDay)*100;
                props.oneDiagnostic['pwrOnPercent'] = pwrOnListSum/(pwrOnList.length*timeOfOnDay)*100;


                // 위성 가동률
                setSatOnPercent(satOnListSum/(satOnList.length*timeOfOnDay)*100);
                // 단말기 가동률
                setPwrOnPercent(pwrOnListSum/(pwrOnList.length*timeOfOnDay)*100);
            }
        }, [props.oneDiagnostic])*/


        // 위성신호 평균 구하기
        const chartSeries = [
            {
                name: 'Level Average',
                data: satSignalList,
            },
        ];
        const averageValue = (chartSeries[0].data.reduce((sum, value) => sum + value, 0) / chartSeries[0].data.length).toFixed(2);


        return(
            <>
                <Grid container spacing={0} className="deviceDiagnosticConstruct">
                    {/* 그래프 */}
                    <Grid itme xs={8} sx={{ display: 'flex', paddingRight: '4px' }}>

                        <Grid container spacing={2}>
                            {/* 가동률 */}
                            <Grid item md={6}>
                                <Box className="deviceConstruct" sx={{height: '100%'}}>
                                    <Box className="deviceConstruct_top">
                                        <Typography variant="h5" >Operation Ratio</Typography>
                                    </Box>
                                    <Box className="deviceConstruct_body">
                                        <DiagnosticChartRatio pwrOnPercent={pwrOnPercent} satOnPercent={satOnPercent} />
                                    </Box>
                                </Box>
                            </Grid>

                            {/* 위성신호 레벨 */}
                            <Grid item md={6}>
                                <Box className="deviceConstruct">
                                    <Box className="deviceConstruct_top">
                                        <Typography variant="h5" >Satellite Signal Level</Typography>
                                    </Box>
                                    <Box className="deviceConstruct_body">
                                        <DiagnosticChartSatSignal satSignalList={satSignalList} eventDateList={eventDateList} averageValue={averageValue}/>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* 위성신호 레벨 */}
                            <Grid item md={6}>
                                <Box className="deviceConstruct">
                                    <Box className="deviceConstruct_top">
                                        <Typography variant="h5" >Satellite Connection time</Typography>
                                    </Box>
                                    <Box className="deviceConstruct_body">
                                        <DiagnosticChartSatTime satOnTimeList={satOnTimeList} eventDateList={eventDateList}/>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* 단말기 작동시간 */}
                            <Grid item md={6}>
                                <Box className="deviceConstruct" >
                                    <Box className="deviceConstruct_top">
                                        <Typography variant="h5" >Device Operation Time</Typography>
                                    </Box>
                                    <Box className="deviceConstruct_body">
                                        <DiagnosticChartDvTime st6100OnList={st6100OnList} eventDateList={eventDateList}/>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* 테이블 위젯 */}
                    <Grid itme xs={4} sx={{ display: 'block', paddingLeft: '4px' }}>

                        <Grid container spacing={2}>

                            {/* 위성 끊김 횟수 */}
                            <Grid item xs={12} >
                                <Box className="deviceConstruct">


                                </Box>
                            </Grid>

                            {/* 단말기 전원 On/Off 횟수 */}
                            <Grid item xs={12} >
                                <Box className="deviceConstruct">

                                </Box>
                            </Grid>

                            {/* 데이터 전송 횟수 */}
                            <Grid item xs={12} >
                                <Box className="deviceConstruct">

                                </Box>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
                {/*<Grid className="input" container spacing={0}>

                <Box className="device_diagnostic_construct" sx={{display: 'block', w: 1, p: 2}}>
                    <div className="device_diagnostic_construct_title">
                        Diagnostic
                    </div>
                    <hr/>
                    <div className="device_diagnostic_construct_contained" style={{width: '100%'}}>
                        <Grid item xs={12} sx={{display: 'flex'}}>
                            <Grid item md={6} sx={{p:2}}>
                                <ReactApexChart options={radialChartState} series={radialPercent} type="radialBar" />
                            </Grid>
                            <Grid item md={6}>
                                 단말기 작동시간
                                <Chart options={st6100OnOptions} series={st6100OnOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{display: 'flex'}}>
                            <Grid item md={6}>
                                 위성신호 레벨
                                <Chart options={satCnrOptions} series={satCnrOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                            </Grid>
                            <Grid item md={6}>
                                 위성연결 작동시간
                                <Chart options={satOnTimeOptions} series={satOnTimeOptions.series} type="line" style={{width: '100%', alignItems: 'center', justifyItems: 'center'}} />
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Grid>*/}
            </>
        )
    }
    // 데이터가 없는 경우
    else{
        /* 굳이 시간을 줄 필요가 없긴 함 (추후 지울 예정)*/
        // 시간이 지난 후에 로딩 상태 변경
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        console.log('Device 에서 받아오는 OneDiagnostic 배열(props)이 비어있습니다.');




        return(
            <>
                {isLoading ? (
                    <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress color="secondary" />
                    </Stack>
                ) : (
                    <Box className="dataNullConstruct">
                        {/* 로딩이 완료된 후에 표시될 내용을 추가 */}
                        조회된 데이터가 없음
                    </Box>
                )}
            </>
        )
    }
}

export default DeviceDiagnostic;