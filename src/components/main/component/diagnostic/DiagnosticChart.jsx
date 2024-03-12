/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./diagnosticGraph.scss";
import OnTimeLineChart from "./chart/OnTimeLineChart";
import SatLevelNCutChart from "./chart/SatLevelNCutChart";

/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';


/**
 * @author jhlee
 * @date 2024-02-23
 * @param props
 * @file : Diagnostic Data 를 수집하는 단말 기반의 시각화 컴포넌트
 * @define
 * startDate : TODAY -  31일 전
 * endDate : TODAY {YYYY-MM-DDT00:00}
 * dateArray : 주어진 startDate 와 endDate 사이의 날짜를 배열로 생성
 * diagIoValue : props 로 받아온 Diagnostic Data
 * finalResultValue : diagIoValue 에서 수집되지 않은 날짜에 null 값 부여

 * @description
 * 메인화면 Diagnostic Chart 반환
 *  - 호출 위치 : src/component/main/Main.jsx
 *  - 31일 간 수집한 Diagnostic 데이터를 활용한 차트 표출
 * Component
 *  - 호출 위치 : src/component/main/component/diagnostic/chart/OnTimeLineChart.jsx
 *  - 1. 위성연결시간 & 단말가동시간 (평균)
 *  - 호출 위치 : src/component/main/component/diagnostic/chart/SatLevelNCutChart.jsx
 *  - 2. 위성신호레벨/잡음비(평균) & 위성끊김횟수 & 전원Reset횟수 (합계)

 * @todo : {
 *     1) 기간 사용자 설정 버튼
 *     2) 메인화면의 Components 기능 상호 연결
 * }
 */
const DiagnosticChart = (props) => {

    // props 에 periodDiagnosticList 가 있는 경우
    if((props.periodDiagnosticList !== null && props.periodDiagnosticList !== undefined) ){
        // periodDiagnosticList 요소가 무조건 있음
        //console.log('값이 있는 경우');


        const startDate = new Date(props.startDate); // props 로 내려받은 문자열이 아닌, 날짜로 정확하게 인식하기 위해 new 생성자 활용
        const endDate = new Date(props.endDate);
        // Main 에서 설정한 startDate 와 endDate 를 기준으로 모든 날짜 배열
        // 시각화에서 날짜 범위에 따른 모든 단말의 데이터 상태를 파악하기 위함 (위성신호레벨)
        const dateArray = []; // ['2024-01-01', ..., '2024-02-01']
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0]+ 'T00:00';
            dateArray.push(formattedDate);
        }

        // periodDiagnosticList 안에 값이 있을 때
        // periodDiagnosticList 가 객체이고, 그 객체의 키 개수가 1 이상인지 확인
        if(props.periodDiagnosticList && typeof(props.periodDiagnosticList) === 'object' && Object.keys(props.periodDiagnosticList).length > 0) {
            console.log(props.periodDiagnosticList);

            /** @type { {'YYYY-MM-DDT00:00' : [{ deviceId: string, period: int, powerOnCount: int, satCnr: float, satCutOffCount: int, st6100On: int, vhcleNm: string }] } } */
            const diagIoValue = props.periodDiagnosticList.ioValue;
            //console.log(diagIoValue)

            // 최종 결과를 저장할 객체 초기화
            // 날짜기준 - 각 속성의 합의 평균값
            const finalResultValue = {};

            // dateArray에 있는 날짜를 기준으로 diagReceivedValue에 추가 또는 null 값 할당

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
                // 해당 날짜 데이터가 있는 경우 계산
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

                    // satCutOffCount 속성은 합계와 평균을 따로 계산
                    /*avgValues['satCutOffCountSum'] = entries.reduce((sum, entry) => sum + entry['satCutOffCount'], 0);
                    avgValues['satCutOffCountAvg'] = avgValues['satCutOffCountSum'] / entries.length;*/

                    // 각 속성에 대해 평균을 구하고 최종 finalResultValue 결과에 할당
                    Object.keys(avgValues).forEach(key => {
                        // 평균 = 각 날짜에 대한 속성 값들을 더한 값 / 해당 날짜의 객체 수
                        avgValues[key] /= entries.length;

                        // 정수는 유지, 실수는 소수점 둘째 자리까지만 유지
                        avgValues[key] = Number.isInteger(avgValues[key]) ? avgValues[key] : parseFloat(avgValues[key].toFixed(2));
                    });
                    // satCutOffCount 와 powerOnCount 속성은 합계와 평균을 따로 계산 (횟수)
                    avgValues['satCutOffCountSum'] = entries.reduce((sum, entry) => sum + entry['satCutOffCount'], 0);
                    avgValues['powerOnCountSum'] = entries.reduce((sum, entry) => sum + entry['powerOnCount'], 0);

                    finalResultValue[date] = avgValues;
                }
            })
            //console.log(finalResultValue);


            /*/!* Chart 구성요소 *!/
            // 전체 기간 데이터 배열
            const periodDateArray = Object.keys(finalResultValue);

            // 각 항목 배열 초기화
            const powerOnCountArray = [];
            const satCnrArray = [];
            const satCutOffCountArray = [];
            const satOnTimeArray = [];
            const st6100OnArray = [];

            // 각 날짜에 대해 데이터 추출하여 배열에 추가
            periodDateArray.forEach(date => {
                const entries = finalResultValue[date];

                powerOnCountArray.push(entries.powerOnCount);
                satCnrArray.push(entries.satCnr);
                satCutOffCountArray.push(entries.satCutOffCount);
                satOnTimeArray.push(entries.satOnTime);
                st6100OnArray.push(entries.st6100On);
            });

            // 각 항목의 배열
            console.log(periodDateArray);
            console.log(powerOnCountArray);
            console.log(satCnrArray);
            console.log(satCutOffCountArray);
            console.log(satOnTimeArray);
            console.log(st6100OnArray);*/





            return(
                <>
                    {/*<Grid container spacing={1} className="diagnostic_graph">

                         1. 위성연결시간 & 단말가동시간
                        <Grid item xs={12} sx={{height: '100%'}}>
                            <Box className="construct" sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성연결시간(평균) & 단말가동시간(평균)</Typography>
                                </Box>
                                <Box className="construct_component" sx={{ flex: 1 }}>
                                    <OnTimeLineChart finalResultValue={finalResultValue}/>
                                </Box>
                            </Box>
                        </Grid>

                         2. 위성신호레벨/잡음비(평균) & 위성끊김횟수
                        <Grid item xs={12} sx={{height: '100%'}}>
                            <Box className="construct" sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성신호레벨/잡음비(평균) & 위성끊김횟수 & 전원Reset횟수 _ (전체합계)</Typography>
                                </Box>
                                <Box className="construct_component" sx={{ flex: 1 }}>
                                    <SatLevelNCutChart finalResultValue={finalResultValue} />
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>*/}

                    <Grid container spacing={0} className="diagnostic_graph">

                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                            <Box className="construct" sx={{ w: 1, height: '100%', mb: 2}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성연결시간(평균) & 단말가동시간(평균)</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    <OnTimeLineChart finalResultValue={finalResultValue}/>
                                </Box>
                            </Box>
                            <br/>

                            <Box className="construct" sx={{ w: 1, height: '100%', alignSelf: 'flex-end' }}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성신호레벨/잡음비(평균) & 위성끊김횟수 & 전원Reset횟수 _ (전체합계)</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    <SatLevelNCutChart finalResultValue={finalResultValue} />
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>

                </>
            )
        }
        // periodDiagnosticList 안에 값이 없을 때
        else if(Array.isArray(props.periodDiagnosticList) && props.periodDiagnosticList.length === 0){
            //console.log('props 로 받아온 periodDiagnosticList 안에 데이터가 없습니다.')
            //console.log(props.periodDiagnosticList);

            return(
                <>
                    {/*<Box className="dataNullConstruct">
                        최근 30일간 조회된 데이터가 없습니다.
                    </Box>*/}
                    {/* 값이 무조건 있으니까 없는 경우는 무시하고, 값이 뜨지 않는 순간을 로딩바를 띄워줌*/}
                    <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress color="secondary" />
                    </Stack>
                </>
            )
        }
        else{
            //console.log('값이 다른 형태');
            //console.log(props.periodDiagnosticList);
        }
    }
    else{
        //console.log('Main 에서 props 로 받아온 값이 없음');

        return(
            <>
                <Box className="dataErrorConstruct">
                    데이터가 출력되지 않습니다.
                    관리자에게 문의하세요.
                </Box>
            </>
        )
    }


    /*if(props.diagnosticList.length > 0) {
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



        /!*props.diagnosticList.map(function(diagnosticList){
            // 각 단말기 별
            console.log(diagnosticList);

            diagnosticList['data'].map(function(dataList){
                // dataList 에서 단말 Id 가 같은 것 끼리 묶어, 각 단말기 마다
                dataList["deviceId"] = diagnosticList.deviceId;

//                console.log(Object.keys(dataList).find((key) => dataList[key] === '2024-01-30'))

                console.log(dataList);
            })
        })*!/


        return(
            <>
                <Grid container spacing={1} className="diagnostic_graph">

                    {/!* 1. 위성 접속률 & 단말 가동률 *!/}
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
    }*/
}
export default DiagnosticChart;