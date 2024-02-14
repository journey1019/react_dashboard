/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./diagnosticGraph.scss";
import OperationRatio from "./graph/OperationRatio";
import SatSignalLevel from "./graph/SatSignalLevel";

/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';
import Widget from "../Widget/Widget";

/***
 * @Author : jhlee
 * @date : 2024-02-13
 * @Desc : {
 *  Main 화면에서 볼 수 있는 Diagnostic Chart Components
 *  1. 가동률 | 2. 위성신호 레벨 | 3. 위성연결시간/위성끊김횟수 | 4. 단말 작동 시간
 *  해당 컴포넌트에서 모든 데이터 가공 후 각 컴포넌트에게 필요한 데이터만 내려주기
 *  각 단말기 별 데이터를 나눠 각 컴포넌트에 넘겨줄땐 단말기의 데이터 형태가 똑같으니, 그 형태를 넘겨줘야 겠다고 생각함
 *  해당 코드는 추후 DevicePage에서 도움되지 않을까 생각함
 *  Component 새로 만들어서 각 단말기로 나누는 게 아니라 반복문을 돌면서 각 필요한 값을 구하는 형식으로 다시 해보기
 * }
 */
const DiagnosticGraph = (props) => {
    console.log(props)


    // Main Component 에서 받은 diagnosticList(props) 값이 있을 경우 실행
    if(props.diagnosticList.length > 0) {
        console.log(props.diagnosticList);

        // props 로 내려받은 문자열이 아닌, 날짜로 정확히 인식하기 위해 new 생성자 활용
        const startDate = new Date(props.startDate);
        const endDate = new Date(props.endDate);
        // Main 에서 설정한 startDate 와 endDate 를 기준으로 모든 날짜 배열
        // 시각화에서 날짜 범위에 따른 모든 단말의 데이터 상태를 파악하기 위함 (위성신호레벨)
        const dateArray = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];
            dateArray.push(formattedDate);
        }

        // 위성신호
        const satCnrObjects = [];

        // 가동률
        const resultObject = {};

        /*props.diagnosticList.map(function(diagnosticList){
            console.log(diagnosticList);

            diagnosticList['data'].map(function(dataList){
                // dataList 에서 단말 Id 가 같은 것 끼리 묶어, 각 단말기 마다
                dataList["deviceId"] = diagnosticList.deviceId;

                console.log(dataList);
            })
        })*/

        // 각 Device 별로 반복
        props.diagnosticList.forEach(deviceData => {
            console.log(deviceData.deviceId);
            console.log(deviceData.data);

            console.log(deviceData);
            /* 위성신호레벨 */
            const deviceName = deviceData.deviceId;
            const eventDates = deviceData.data.map(entry => entry.eventDate);
            const satCnrs = deviceData.data.map(entry => entry.satCnr);

            // satCnrObject 에 deviceId, eventDate, satCnr 값 추가
            const satCnrObject = {
                deviceName: deviceName,
                eventDates: eventDates,
                satCnrs: satCnrs
            };
            // SatSignalLevel 에 전달할 위성신호 값
            satCnrObjects.push(satCnrObject);


            /* 위성 접속률 & 단말 가동률 */
            const { deviceId, dataCount, data } = deviceData;

            // 각 data 의 satOnTime 과 st6100On, satCnr 을 합산
            const totalSatOnTime = data.reduce((total, item) => total + item.satOnTime, 0);
            const totalSt6100OnTime = data.reduce((total, item) => total + item.st6100On, 0);
            const totalSatCnr = data.reduce((total, item) => total + item.satCnr, 0);

            // 합산된 satOnTime 과 st6100OnTime 을 계산된 백분율로 변환하여 저장
            const satOnTimePercentage = ((totalSatOnTime / (dataCount * 1440)) * 100).toFixed(2);
            const st6100OnTimePercentage = ((totalSt6100OnTime / (dataCount * 1440)) * 100).toFixed(2);
            // 합산된 satCnr 을 평균으로 변환하여 저장
            const satCnrAvr = (totalSatCnr / dataCount).toFixed(2);


            // 각 단말에 해당하는 가동률 백분율
            resultObject[deviceId] = {
                deviceId, dataCount, satOnTimePercentage, st6100OnTimePercentage, satCnrAvr
            }
        });
        console.log(resultObject); // 가동률
        console.log(satCnrObjects); // 신호레벨

        // 단계 1. 단말 기준으로 데이터 그룹화
        const groupedData = {};
        satCnrObjects.forEach(({deviceName, eventDates, satCnrs}) => {
            if(!groupedData[deviceName]) {
                groupedData[deviceName] = {eventDates, satCnrs: {}};
            } else {
                groupedData[deviceName].eventDates = Array.from(
                    new Set([...groupedData[deviceName].eventDates, ...eventDates])
                );
            }
        })
        console.log(groupedData)



        // DiagnosticGraph 에서 모든 데이터 가공 후 각 컴포넌트에게 데이터만 전달
        return(
            <Grid container spacing={1} className="diagnostic_graph">

                {/* 1. 위성 접속률 & 단말 가동률 */}
                <Grid item xs={6}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Box className="construct_top">
                            <Typography variant="h5" >Operation Ratio</Typography>
                        </Box>
                        <Box className="construct_component" >
                            <OperationRatio resultObject={resultObject}/>
                        </Box>
                    </Box>
                </Grid>

                {/* 2. 위성신호레벨 */}
                <Grid item xs={6}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Box className="construct_top">
                            <Typography variant="h5" >Satellite signal level</Typography>
                        </Box>
                        <Box className="construct_component" >
                            <SatSignalLevel satCnrObjects={satCnrObjects} dateArray={dateArray}/>
                        </Box>
                    </Box>
                </Grid>

                {/* 3. 위성 작동 시간 */}
                <Grid item xs={6}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Box className="construct_top">
                            <Typography variant="h5" >Satellite Operation Time</Typography>
                        </Box>
                        <Box className="construct_component" >

                        </Box>
                    </Box>
                </Grid>

                {/* 4. 단말기 작동 시간 */}
                <Grid item xs={6}>
                    <Box className="construct" sx={{height: '100%'}}>
                        <Box className="construct_top">
                            <Typography variant="h5" >Device Operation Time</Typography>
                        </Box>
                        <Box className="construct_component" >

                        </Box>
                    </Box>
                </Grid>
            </Grid>
        )
    }

    // Main Component 에서 받은 diagnosticList(props) 값이 없을 경우
    else{
        console.log('Main 에서 받아오는 diagnosticList 배열(props)이 비어있습니다.');

        return(
            <>
                <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                    <LinearProgress color="secondary" />
                </Stack>
            </>
        )
    }
};

export default DiagnosticGraph;