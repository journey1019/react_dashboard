/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./diagnosticGraph.scss";
import AnimatedGaugeChart from "./widget/AnimatedGaugeChart";
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';


/***
 * @Author : jhlee
 * @date : 2024-02-19
 * @Desc : {
 * Main 화면에서 Diagnostic Widgets
 * 1. 접속률 & 가동률 | 2. 위성신호/잡음비 | 3. 위성연결시간 | 4. 위성끊김횟수 | 5. 단말가동시간 | 6. 단말Reset횟수
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

        // 현재 날짜에서 1을 뺌 (어제 날짜로 설정) : 어제 기준 Diagnostic 데이터를 구하기 위함
        endDate.setDate(endDate.getDate() -1);

        // 어제 날짜를 'YYYY-MM-DDT00:00' 형식으로 포맷팅
        const yesterDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T00:00`;

        // periodDiagnosticList 안에 값이 있을 때
        // periodDiagnosticList 가 객체이고, 그 객체의 키 개수가 1 이상인지 확인
        if(props.periodDiagnosticList && typeof(props.periodDiagnosticList) === 'object' && Object.keys(props.periodDiagnosticList).length > 0) {
            console.log(props.periodDiagnosticList);

            const diagIoValue = props.periodDiagnosticList.ioValue;
            console.log(diagIoValue)

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
            console.log(yesterDate);

            let totalSt6100On = 0;
            let totalSatOnTime = 0;

            // satOnTime 접속률 & st6100On 가동률
            Object.keys(finalResultValue).forEach((date) => {
                const data = finalResultValue[date];

                if(data.st6100On !== null) {
                    totalSt6100On += data.st6100On;
                }
                if(data.satOnTime !== null) {
                    totalSatOnTime += data.satOnTime;
                }
            });

            // 오늘 날짜 제외한 30일 (오늘은 Diagnostic Data 가 없기 때문에 제외)
            const totalCount = Object.keys(finalResultValue).length-1; // 30

            const averageSt6100On = ((totalSt6100On / (totalCount * 1440)) * 100).toFixed(2);
            const averageSatOnTime = ((totalSatOnTime / (totalCount * 1440)) * 100).toFixed(2);

            // 위성 접속률
            console.log(averageSatOnTime);
            // 단말 가동률
            console.log(averageSt6100On);


            let yesterSt6100On = 0;
            let yesterSatOnTime = 0;

            // 어제 기준 위성접속률 & 단말가동률
            const yesterData = finalResultValue[yesterDate];
            if(yesterData) {
                // 해당 날짜에 대한 데이터가 존재할 경우
                console.log(yesterData);
                console.log(yesterData.st6100On);
                console.log(yesterData.satOnTime);
                yesterSatOnTime = (yesterData.satOnTime / 1440 * 100).toFixed(2);
                yesterSt6100On = (yesterData.st6100On / 1440 * 100).toFixed(2);
            }

            console.log(yesterSatOnTime)
            console.log(yesterSt6100On)


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
                                    <Box sx={{ w: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <AnimatedGaugeChart label="위성 접속률" monthValue={averageSatOnTime} edgePathColor="#FF89A0" edgeTrailColor="#FFE9ED" edgeBackgroundColor="#FFE9ED" insidePathColor="#DC143C" insideTrailColor="#FFD1DA" insideBackgroundColor="#FFD1DA" yesterValue={yesterSatOnTime}/>
                                        <AnimatedGaugeChart label="단말 가동률" monthValue={averageSt6100On} edgePathColor="#7C8FB2" edgeTrailColor="#CFE5FB" edgeBackgroundColor="#CFE5FB" insidePathColor="#54627B" insideTrailColor="#98B7D6" insideBackgroundColor="#98B7D6" yesterValue={yesterSt6100On}/>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        {/* 2. 위성신호레벨/잡음비(평균) */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top" sx={{justifyContent:'space-between'}}>
                                    <Typography variant="h5" >위성신호레벨/잡음비</Typography>
                                    <Box className="deviceWidget_icon" sx={{backgroundColor: '#FF666B'}}> 80 %{/*<WarningOutlinedIcon/> */}</Box>
                                    {/*<Box className="deviceWidget_icon" sx={{backgroundColor:'#FF666B'}}> 80 % </Box>*/}
                                </Box><hr/>
                                <Box className="construct_component">
                                    <Box sx={{display: 'block'}}>
                                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                            <Typography variant="h8">기준치 정상 단말 개수</Typography>
                                            <Typography variant="h8">80 대</Typography>
                                        </Box>
                                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                            <Typography variant="h8">기준치 이하 단말 개수</Typography>
                                            <Typography variant="h8">20 대</Typography>
                                        </Box>
                                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                            <Typography variant="h8">기준치 위성신호레벨/잡음비</Typography>
                                            <Typography variant="h8">39 dB</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        {/*<Grid item xs={12}>
                            <Box className="diagnosticConstructure" >
                                <Box className="diagnosticConstruct_top" sx={{justifyContent:'space-between', backgroundColor: '#FF666B', p: 2, m:0}}>
                                    <Typography variant="h5" >위성신호레벨/잡음비</Typography>
                                </Box><hr/>
                                <Box className="diagnosticConstruct_component" >
                                    위성신호레벨/잡음비
                                </Box>
                            </Box>
                        </Grid>*/}

                        {/* 3. 위성연결시간 */}
                        <Grid item xs={12}>
                            <Box className="construct" sx={{height: '100%'}}>
                                <Box className="construct_top" >
                                    <Typography variant="h5" >위성연결시간</Typography>
                                    <Box className="deviceWidget_icon" sx={{backgroundColor: '#FDDC66'}}> 80 %</Box>
                                </Box><hr/>
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
                                    <Box className="deviceWidget_icon" sx={{backgroundColor: '#E89EFB'}}> 80 %</Box>
                                </Box><hr/>
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
                                    <Box className="deviceWidget_icon" sx={{backgroundColor: '#98B7D6'}}> 80 %</Box>
                                </Box><hr/>
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
                                    <Box className="deviceWidget_icon" sx={{backgroundColor: '#B4B0FF'}}> 80 %</Box>
                                </Box><hr/>
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