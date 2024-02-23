/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./diagnosticWidget.scss";
import AnimatedGaugeChart from "./widget/AnimatedGaugeChart";
import ConditionsToggle from "./widget/ConditionsToggle";

import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';


/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';
import {filter} from "lodash/collection";
import {zipObject} from "lodash/array";


/**
 * @Author : jhlee
 * @date : 2024-02-21
 * @Desc : {
 * Main 화면에서 Diagnostic Widgets
 * Main 화면에서 받아온 Diagnostic Data 를 가공하여 각 Widget 에게 필요한 데이터를 전달해주는 컴포넌트
 * 1. 접속률 & 가동률 | 2. 위성신호/잡음비 | 3. 위성연결시간 | 4. 위성끊김횟수 | 5. 단말가동시간 | 6. 단말Reset횟수
 */

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 * @apiName diagnosticList
 * @apiDescription 단말별 DiagnosticList Array Data 출력
 * @apiSuccessExample Successful operation:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *          "deviceId": "deviceId",
 *          "dataCount": 1,
 *          "data": [
 *              {
 *              "eventDate":'YYYY-MM-DD',
 *              "st6100On": 1440,
 *              "satInfo": 'IOERB19',
 *              "satCutOffCount": 0,
 *              "satOnTime": 1440,
 *              "satCnr": 40.1,
 *              "powerOnCount": 1,
 *              "cnrMap": {...}
 *              }
 *          ]
 *      }
 *     ]
 */

const DiagnosticWidget = (props) => {
    console.log(props)

    // 전체 총 장비 개수를 알기위함
    let totalDvCount;
    // 30일간 수집한 단말기에서 Diagnostic Data 를 가지지 않은 단말 존재 ->
    // 30일간 수집한 장비 중 Diagnostic Data 를 가지고 있어, 각 시각화 및 위젯에 포함된 장비 개수
    if(props.diagnosticList.length != 0) {
        totalDvCount = props.diagnosticList.length;
    }
    else{
        console.log('30일간 Diagnostic Data 를 수집한 단말기가 존재하지 않습니다.')
    }

    console.log(totalDvCount);

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

            // 각 날짜에 대한 각 속성의 최종 평균 결과를 저장할 객체 초기화
            const finalResultValue = {};

            // 날짜 Key 제거한 모든 객체를 모은 배열 [{}, {}, {}, ...]
            const removeDateKey = [];

            // 날짜 객체를 구분하지 않은 모든 속성의 최소, 최대 객체 값
            // 최소 항목, 최대 항목
            let minEntries = {};
            let maxEntries = {};

            // 각 평균 값
            let avgEntries = {};


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
                    console.log('전 entries : ', entries);

                    // 각 날짜에 대해 각 단말기의 속성 값 더하기
                    const avgValues = entries.reduce((avg, entry) => {
                        Object.keys(entry).forEach(key => {
                            if (key !== 'deviceId') {
                                avg[key] = (avg[key] || 0) + entry[key];
                            }
                        });
                        return avg;
                    }, {});

                    console.log('후 entries : ', entries);
                    Object.keys(avgValues).forEach(key => {
                        console.log('avgValues : ', avgValues)

                        // 평균 = 각 날짜에 대한 속성 값들을 더한 값 / 해당 날짜의 객체 수
                        avgValues[key] /= entries.length;
                        console.log('나눈 후 avgValues : ', avgValues);

                        // 정수는 유지, 실수는 소수점 둘째 자리까지만 유지
                        avgValues[key] = Number.isInteger(avgValues[key]) ? avgValues[key] : parseFloat(avgValues[key].toFixed(2));
                    });
                    finalResultValue[date] = avgValues;
                    console.log('후 entries : ',finalResultValue[date])
                    console.log('후 entries : ',finalResultValue)




                    // 최대 최소를 구하기 위함
                    // 날짜 Key 각 속성 객체에 합치고, 한 배열 안에 모든 객체 집어넣기
                    diagIoValue[date].map(function (obj) {
                        obj['date'] = date

                        removeDateKey.push(obj);
                    });
                    // 날짜 키 값을 넣은 모든 객체 배열 (날짜 구분 X)
                    console.log(removeDateKey);


                    // 비교할 속성들을 정의
                    const attributesToCompare = ['powerOnCount', 'satCnr', 'satCutOffCount', 'satOnTime', 'st6100On', 'powerOnCountValue', 'satCnrValue', 'satCutOffCountValue', 'satOnTimeValue', 'st6100OnValue'];

                    // 각 속성에 대해 최소값과 최대값 찾기
                    attributesToCompare.forEach(attribute => {
                        // 초기값 설정
                        let minValue = Number.POSITIVE_INFINITY;
                        let maxValue = Number.NEGATIVE_INFINITY;

                        // 주어진 객체 배열(removeDateKey)을 순회하면서 최소값과 최대값 찾기
                        removeDateKey.forEach(entry => {
                            const value = entry[attribute];

                            // 최소값 갱신
                            if (value < minValue) {
                                minValue = value;
                                minEntries[attribute] = [entry];
                                minEntries[`${attribute}Value`] = value;
                            } else if (value === minValue) {
                                // 최소값과 같은 경우 배열에 추가
                                minEntries[attribute].push(entry);
                            }

                            // 최대값 갱신
                            if (value > maxValue) {
                                maxValue = value;
                                maxEntries[attribute] = [entry];
                                maxEntries[`${attribute}Value`] = value;
                            } else if (value === maxValue) {
                                // 최대값과 같은 경우 배열에 추가
                                maxEntries[attribute].push(entry);
                            }
                        });
                    });

                    // 모든 속성값을 비교하여 최소, 최대 값 및 객체를 구한 값
                    console.log("minEntries:", minEntries);
                    console.log("maxEntries:", maxEntries);


                    // 각 속성에 대한 평균값
                    /*removeDateKey.forEach(entry => {
                        console.log(entry);
                        avgEntries['satOnTimeAvg'] = entry.map((key) => key.satOnTime);
                        avgEntries['st6100OnAvg'] = entry.map((key) => key.st6100On);
                        avgEntries['powerOnCountAvg'] = entry.map((key) => key.powerOnCount);
                    })*/
                }
            })

            console.log(finalResultValue); // 모든 속성값을 더해 평균을 구한 값
            console.log(yesterDate); // Gauge Chart 를 위한 어제 날짜{string}


            avgEntries['satOnTimeArr'] = Object.values(finalResultValue).map((key) => key.satOnTime);
            avgEntries['satCutOffCountArr'] = Object.values(finalResultValue).map((key) => key.satCutOffCount);
            avgEntries['st6100OnArr'] = Object.values(finalResultValue).map((key) => key.st6100On);
            avgEntries['powerOnCountArr'] = Object.values(finalResultValue).map((key) => key.powerOnCount);

            avgEntries['satOnTimeAvg'] = parseFloat((avgEntries.satOnTimeArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            avgEntries['satCutOffCountAvg'] = parseFloat((avgEntries.satCutOffCountArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            avgEntries['st6100OnAvg'] = parseFloat((avgEntries.st6100OnArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            avgEntries['powerOnCountAvg'] = parseFloat((avgEntries.powerOnCountArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));


            console.log(avgEntries); // 30일 간 각 속성에 대한 평균값

            let totalSt6100On = 0;
            let totalSatOnTime = 0;
            let totalSatCutOffCount = 0;
            let totalSatCnr = 0;
            let totalPowerOnCount = 0;

            // 위성신호레벨이 기준치 보다 높을 때, totalSatCnr Array 에 추가
            const standardSatCnrValue = 28;
            let totalSatCnrArr = [];

            // satOnTime 접속률 & st6100On 가동률
            Object.keys(finalResultValue).forEach((date) => {
                const data = finalResultValue[date];

                // Circular Gauge Chart
                if(data.st6100On !== null) {
                    totalSt6100On += data.st6100On;
                }
                if(data.satOnTime !== null) {
                    totalSatOnTime += data.satOnTime;
                }

                // Condition Widget
                if(data.satCnr != null && data.satCnr >= standardSatCnrValue) {
                    totalSatCnrArr.push(data);
                }

            });

            // 오늘 날짜 제외한 30일 (오늘은 Diagnostic Data 가 없기 때문에 제외)
            const totalDateCount = Object.keys(finalResultValue).length-1; // 30
            console.log(totalDateCount)

            const averageSt6100On = ((totalSt6100On / (totalDateCount * 1440)) * 100).toFixed(2);
            const averageSatOnTime = ((totalSatOnTime / (totalDateCount * 1440)) * 100).toFixed(2);


            // 위성신호레벨 이상치 배열
            console.log(totalSatCnrArr);
            // 위성신호레벨 이상치 개수 // 이건 아님 -> 단말기에 대한 정상/비정상 을 알 수 없음. 일자별로 통계냈기 때문에
            console.log(totalSatCnrArr.length);

            // 위성 접속률
            //console.log(averageSatOnTime);
            // 단말 가동률
            //console.log(averageSt6100On);


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

            // 위성 접속률 (어제 단말 평균)
            //console.log(yesterSatOnTime)
            // 단말 가동률 (어제 단말 평균)
            //console.log(yesterSt6100On)


            // 각 단말기 별 속성을 30일로 나눈 평균
            const widgetsResult = {};
            props.diagnosticList.forEach(device => {
                const deviceId = device.deviceId;
                console.log(device)

                // satCnr 계산
                const totalSatCnr = device.data.reduce((sum, entry) => sum + entry.satCnr, 0);
                const averageSatCnr = parseFloat((totalSatCnr / 30).toFixed(2));

                // satOnTime 계산
                const totalSatOnTime = device.data.reduce((sum, entry) => sum + entry.satOnTime, 0);
                const averageSatOnTime = parseFloat((totalSatOnTime / 30).toFixed(2)); // 평균
                const percentSatOnTime = parseFloat(((totalSatOnTime / (30 * 1440))*100).toFixed(2)); // 백분율

                // satCutOffCount 계산
                const totalSatCutOffCount = device.data.reduce((sum, entry) => sum + entry.satCutOffCount, 0);
                const averageSatCutOffCount = parseFloat((totalSatCutOffCount / 30).toFixed(2));
                //const percentSatCutOffCount = parseFloat(((totalSatCutOffCount / (30 * 1440))*100).toFixed(2));

                // st6100On 계산
                const totalSt6100On = device.data.reduce((sum, entry) => sum + entry.st6100On, 0);
                const averageSt6100On = parseFloat((totalSt6100On / 30).toFixed(2));
                const percentSt6100On = parseFloat(((totalSt6100On / (30 * 1440))*100).toFixed(2));

                // powerOnCount 계산
                const totalPowerOnCount = device.data.reduce((sum, entry) => sum + entry.powerOnCount, 0);
                const averagePowerOnCount = parseFloat((totalPowerOnCount / 30).toFixed(2));
                //const percentSatCutOffCount = parseFloat(((totalSatCutOffCount / (30 * 1440))*100).toFixed(2));

                widgetsResult[deviceId] = {
                    averageSatCnr,
                    averageSatOnTime,
                    percentSatOnTime,
                    averageSatCutOffCount,
                    averageSt6100On,
                    percentSt6100On,
                    averagePowerOnCount,
                };
            });
            console.log(widgetsResult); // 각 단말기 별 30일(한달) 평균으로 나눈 속성들
            console.log(Object.entries(widgetsResult));


            const filterSatCnr = {};
            const filterSatOnTime = {};
            const filterSatCutOffCount = {};
            const filterSt6100On = {};
            const filterPowerOnCount = {};

            Object.entries(widgetsResult).forEach(([deviceId, values]) => {
                console.log(values)
                const { averageSatCnr } = values;

                console.log(values.averageSatCnr)
                console.log(averageSatCnr)
                console.log({averageSatCnr})


                // satCnr
                if (values.averageSatCnr > standardSatCnrValue) { // 28(test) -> standardSatCnrValue
                    filterSatCnr[deviceId] = values;
                }
                // satOnTime
                if (values.averageSatOnTime > avgEntries.satOnTimeAvg) {
                    filterSatOnTime[deviceId] = values;
                }
                // satCutOffCount
                if (values.averageSatCutOffCount > avgEntries.satCutOffCountAvg) {
                    filterSatCutOffCount[deviceId] = values;
                }
                // st6100On
                if (values.averageSt6100On > avgEntries.st6100OnAvg) {
                    filterSt6100On[deviceId] = values;
                }
                // powerOnCount
                if (values.averagePowerOnCount > avgEntries.powerOnCountAvg) {
                    filterPowerOnCount[deviceId] = values;
                }
            });
            // 기준치 이상인 단말기 목록
            console.log(filterSatCnr); // 위성접속률 & 단말가동률 정상 단말 객체
            console.log(filterSatOnTime); // 위성접속률 & 단말가동률 정상 단말 객체
            console.log(filterSatCutOffCount); // 위성접속률 & 단말가동률 정상 단말 객체
            console.log(filterSt6100On); // 위성접속률 & 단말가동률 정상 단말 객체
            console.log(filterPowerOnCount); // 위성접속률 & 단말가동률 정상 단말 객체

            // SatCnr 기준치 이상 - 정상 단말 개수
            //console.log(Object.keys(filterSatCnr).length); // 기준치 정상 단말 개수
            const normalSatCnrCount = Object.keys(filterSatCnr).length;
            // SatCnr 기준치 이하 - 이상 단말 개수
            //console.log(totalDvCount - Object.keys(filterSatCnr).length)
            const abnormalSatCnrCount = totalDvCount - Object.keys(filterSatCnr).length;
            // satCnr 기준값인 standardSatCnrValue 임계 비율 초과(퍼센트)
            //console.log((Object.keys(filterSatCnr).length / totalDvCount) * 100);
            const satCnrExceedThresholdPercent = (Object.keys(filterSatCnr).length / totalDvCount) * 100;


            // SatOnTime 기준치 이상
            const normalSatOnTime = Object.keys(filterSatOnTime).length; // 정상단말 개수
            const abnormalSatOnTime = totalDvCount - Object.keys(filterSatOnTime).length; // 비정상 단말 개수
            const satOnTimeExceedThresholdPercent = (Object.keys(filterSatOnTime).length / totalDvCount) * 100;

            // SatCutOffCount 기준치 이상
            const normalSatCutOffCount = Object.keys(filterSatCutOffCount).length; // 정상단말 개수
            const abnormalSatCutOffCount = totalDvCount - Object.keys(filterSatCutOffCount).length; // 비정상 단말 개수
            const satCutOffCountExceedThresholdPercent = (Object.keys(filterSatCutOffCount).length / totalDvCount) * 100;

            // St6100On 기준치 이상
            const normalSt6100On = Object.keys(filterSt6100On).length; // 정상단말 개수
            const abnormalSt6100On = totalDvCount - Object.keys(filterSt6100On).length; // 비정상 단말 개수
            const st6100OnExceedThresholdPercent = (Object.keys(filterSt6100On).length / totalDvCount) * 100;

            // PowerOnCount 기준치 이상
            const normalPowerOnCount = Object.keys(filterPowerOnCount).length; // 정상단말 개수
            const abnormalPowerOnCount = totalDvCount - Object.keys(filterPowerOnCount).length; // 비정상 단말 개수
            const powerOnCountExceedThresholdPercent = (Object.keys(filterPowerOnCount).length / totalDvCount) * 100;






            // 위성연결시간으로 따졌을 때
            // 여러 단말, 30일 간 데이터 중 위성연결 시간이 가장 높은 시간 : 1440 (여러 단말일 수 있고, 항상 1440 일 수 있음)
            // 여러 단말, 30일 간 데이터 중 위성연결 시간이 가장 낮은 시간 : 984 (여러 단말 중 한 단말일테고, 평균 분포를 조정한 주 단말기를 찾을 수 있음)
            // 평균 :
            // 평균 값을 구하는 게 크게 의미가 있나..

            console.log("minEntries:", minEntries);
            console.log("maxEntries:", maxEntries);

            /* 각 Widget 에게 전달할 최소, 최대 값들 */
            /*let minPowerOnCount = 0;

            minEntries['powerOnCount'].forEach(datas=> {
                console.log(datas);
                console.log(datas.powerOnCount);
                minPowerOnCount = datas.powerOnCount;
            })
            console.log(minPowerOnCount);*/

            return(
                <>
                    <Grid container spacing={1} className="diagnosticWidget">

                        {/* 1. 위성 접속률 & 단말 가동률 */}
                        <Grid item xs={12}>
                            <Box className="diagnosticWidget_construct" sx={{height: '100%'}}>
                                <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center', textAlign: 'end'}}>
                                    <Box sx={{ display: 'block', p: 0 }}>
                                        <Typography variant="h6" gutterBottom sx={{ p:0, color: '#394251', paddingRight: '8px', marginBottom: 0}}>Total number of device : </Typography>
                                        <Typography variant="h8" gutterBottom sx={{ p:0, color: '#394251', paddingRight: '15px', marginBottom: 0}}>(w. Diagnostic Data)</Typography>
                                    </Box>
                                    <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', color: '#394251'}}>{totalDvCount}</Typography>
                                </Box>
                                <Box className="diagnosticWidget_construct_component_gaugeChart" >
                                    <AnimatedGaugeChart label="위성 접속률" monthValue={averageSatOnTime} edgePathColor="#FF89A0" edgeTrailColor="#FFE9ED" edgeBackgroundColor="#FFE9ED" insidePathColor="#DC143C" insideTrailColor="#FFD1DA" insideBackgroundColor="#FFD1DA" yesterValue={yesterSatOnTime}/>
                                    <AnimatedGaugeChart label="단말 가동률" monthValue={averageSt6100On} edgePathColor="#7C8FB2" edgeTrailColor="#CFE5FB" edgeBackgroundColor="#CFE5FB" insidePathColor="#54627B" insideTrailColor="#98B7D6" insideBackgroundColor="#98B7D6" yesterValue={yesterSt6100On}/>
                                </Box>
                            </Box>
                        </Grid>

                        {/* 2. 위성신호레벨/잡음비(평균) */}
                        <ConditionsToggle title="위성신호레벨 / 잡음비" color="#FF666B" percentage={satCnrExceedThresholdPercent} maxTitle="기준치 정상 단말 개수" minTitle="기준치 이하 단말 개수" max={normalSatCnrCount} min={abnormalSatCnrCount} averageTitle="기준치 위성신호레벨/잡음비" average={standardSatCnrValue} unit="dB"/>

                        {/* 3. 위성연결시간 */}
                        <ConditionsToggle title="위성 연결 시간" color="#FDDC66" percentage={satOnTimeExceedThresholdPercent} maxTitle="최대 시간" minTitle="최소 시간" min={minEntries.satOnTimeValue} max={maxEntries.satOnTimeValue} averageTitle="평균" average={avgEntries.satOnTimeAvg} unit="시간"/>

                        {/* 4. 위성끊김횟수 */}
                        <ConditionsToggle title="위성 끊김 횟수" color="#E89EFB" percentage={satCutOffCountExceedThresholdPercent} maxTitle="최대 횟수" minTitle="최소 횟수" min={minEntries.satCutOffCountValue} max={maxEntries.satCutOffCountValue} averageTitle="평균" average={avgEntries.satCutOffCountAvg} unit="개" />

                        {/* 5. 단말가동시간 */}
                        <ConditionsToggle title="단말 가동 시간" color="#98B7D6" percentage={st6100OnExceedThresholdPercent} maxTitle="최대 시간" minTitle="최소 시간" min={minEntries.st6100OnValue} max={maxEntries.st6100OnValue} averageTitle="평균" average={avgEntries.st6100OnAvg} unit="시간"/>

                        {/* 6. 단말Reset횟수 */}
                        <ConditionsToggle title="단말 Reset 횟수" color="#B4B0FF" percentage={powerOnCountExceedThresholdPercent} maxTitle="최대 횟수" minTitle="최소 횟수" min={minEntries.powerOnCountValue} max={maxEntries.powerOnCountValue} averageTitle="평균" average={avgEntries.powerOnCountAvg} unit="개"/>

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