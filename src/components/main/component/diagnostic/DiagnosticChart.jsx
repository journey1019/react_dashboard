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
 *  각 컴포넌트에게 넘겨줄 데이터를 단말기 별 X, 반복문에서 미리 날짜별 매칭시켜서(단말기 기준 -> 날짜 기준)
 * }
 */
const DiagnosticChart = (props) => {
    console.log(props)


    if(props.diagnosticList.length > 0) {
        console.log(props.diagnosticList)

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
        console.log(dateArray);


        props.diagnosticList.forEach(deviceData => {
            const deviceName = deviceData.deviceId;
            const deviceCount = deviceData.dataCount;
            const deviceArray = deviceData.data;

            // 각 날짜에 대해 반복하며 해당하는 eventData 찾기
            dateArray.forEach(targetDate => {
                console.log(targetDate)
                const foundObject = deviceArray.find(obj => obj.eventDate === targetDate);

                console.log(foundObject);

                if (foundObject) {
                    console.log(`장치 ${deviceName}, 날짜 ${targetDate}에 대한 객체 찾음:`, foundObject);
                } else {
                    console.log(`장치 ${deviceName}, 날짜 ${targetDate}에 대한 객체를 찾을 수 없음`);
                }
            });
        })



        /*props.diagnosticList.map(function(diagnosticList){
            // 각 단말기 별
            console.log(diagnosticList);

            diagnosticList['data'].map(function(dataList){
                // dataList 에서 단말 Id 가 같은 것 끼리 묶어, 각 단말기 마다
                dataList["deviceId"] = diagnosticList.deviceId;

//                console.log(Object.keys(dataList).find((key) => dataList[key] === '2024-01-30'))

                console.log(dataList);
            })
        })*/


        return(
            <>
                <Grid container spacing={1} className="diagnostic_graph">

                    {/* 1. 위성 접속률 & 단말 가동률 */}
                    <Grid item xs={6}>
                        <Box className="construct" sx={{height: '100%'}}>
                            <Box className="construct_top">
                                <Typography variant="h5" >Operation Ratio</Typography>
                            </Box>
                            <Box className="construct_component" >

                            </Box>
                        </Box>
                    </Grid>

                </Grid>
            </>
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
}
export default DiagnosticChart;