/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./diagnosticGraph.scss";
import WidgetRatio from "./widget/WidgetRatio";

/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';


/***
 * @Author : jhlee
 * @date : 2024-02-13
 * @Desc : {
 * Diagnostic.jsx 복사
 * 현재 기준 데이터(가장 최신 데이터 _ 어제)
 * 평균 데이터(30일) 기준을 설정하고 기준에
 * }
 */
const DiagnosticWidget = (props) => {
    console.log(props)
    // props 로 받아온 값에 periodDiagnosticList 가 있는 경우
    if((props.periodDiagnosticList !== null && props.periodDiagnosticList !== undefined) ){
        // props 로 내려받은 문자열이 아닌, 날짜로 정확히 인식하기 위해 new 생성자 활용
        const startDate = new Date(props.startDate);
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

            const diagIoValue = props.periodDiagnosticList.ioValue;
            //console.log(diagIoValue)

            // 최종 결과를 저장할 객체 초기화
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

                    Object.keys(avgValues).forEach(key => {
                        // 평균 = 각 날짜에 대한 속성 값들을 더한 값 / 해당 날짜의 객체 수
                        avgValues[key] /= entries.length;

                        // 정수는 유지, 실수는 소수점 둘째 자리까지만 유지
                        avgValues[key] = Number.isInteger(avgValues[key]) ? avgValues[key] : parseFloat(avgValues[key].toFixed(2));
                    });
                    finalResultValue[date] = avgValues;
                }
            })
            console.log(finalResultValue);

            return(
                <>
                    <Grid container spacing={1} className="diagnostic_graph">

                        {/* 1. 위성 접속률 & 단말 가동률 */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >Operation of Ratio</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    <WidgetRatio finalResultValue={finalResultValue}/>
                                </Box>
                            </Box>
                        </Grid>

                        {/* 2. 위성신호레벨/잡음비(평균) */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성신호레벨/잡음비(평균)</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    위성신호레벨/잡음비
                                </Box>
                            </Box>
                        </Grid>

                        {/* 3. 위성연결시간 */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성연결시간</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    위성연결시간
                                </Box>
                            </Box>
                        </Grid>

                        {/* 4. 위성끊김횟수 */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >위성끊김횟수</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    위성끊김횟수
                                </Box>
                            </Box>
                        </Grid>

                        {/* 5. 단말가동시간 */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >단말가동시간</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    단말가동시간
                                </Box>
                            </Box>
                        </Grid>

                        {/* 6. 단말Reset횟수 */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top">
                                    <Typography variant="h5" >단말Reset횟수</Typography>
                                </Box>
                                <Box className="construct_component" >
                                    단말Reset횟수
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>

                </>
            )
        }
        // periodDiagnosticList 안에 값이 없을 때
        else if(Array.isArray(props.periodDiagnosticList) && props.periodDiagnosticList.length === 0){
            console.log('props 로 받아온 periodDiagnosticList 안에 데이터가 없습니다.')
            console.log(props.periodDiagnosticList);

            return(
                <>
                    <Box className="dataNullConstruct">
                        최근 30일간 조회된 데이터가 없습니다.
                    </Box>
                </>
            )
        }
        else{
            console.log('값이 다른 형태');
            console.log(props.periodDiagnosticList);
        }
    }
    else{
        console.log('Main 에서 props 로 받아온 값이 없음');

        return(
            <>
                <Box className="dataErrorConstruct">
                    데이터가 출력되지 않습니다.
                    관리자에게 문의하세요.
                </Box>
            </>
        )
    }
}
export default DiagnosticWidget;