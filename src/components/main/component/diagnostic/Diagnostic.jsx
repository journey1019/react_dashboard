/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./diagnostic.scss";
import OnTimeLineChart from '../../../modules/chart/OnTimeLineChart';
import SignLevelSatCutResetChart from "../../../modules/chart/SignLevelSatCutResetChart";
import SearchByDate from "./search/SearchByDate";

/* Chart */
import ReactApexChart from 'react-apexcharts';

/* MUI */
import {Stack, LinearProgress, Grid, Box, Typography} from '@mui/material';
import AnimatedGaugeChart from "./widget/AnimatedGaugeChart";
import ConditionsToggle from "./widget/ConditionsToggle";
import dayjs from "dayjs";


/***
 * @date : 2024-03-14
 * @file: 최근 30일간 데이터를 추출하여 Diag Data 가 수집된 단말들의 일자별 각 요소의 평균 및 합계를 그래프로 보여줌
 * @constructor : {
 *     1) 위성연결시간(평균)&단말가동시간(평균) - Line Chart
 *     2) 위성신호레벨/잡음비(평균)&위성끊김횟수(합계)&전원Reset횟수(합계) - Line&Bar Chart
 *     3) 위성접속률&단말가동률 - Circular Progressbar
 *     4) 토글 위젯 - 신호레벨/잡음비 & 위성연결시간 & 위성끊김횟수 & 단말가동시간 & 단말Reset횟수
 * }
 * @desc: {
 *     1) periodDiagnosticList : {receivedValue: {…}, ioValue: {…}, cnrValue: {…}} - 날짜별
 *       1-1) receivedValue: { 'YYYY-MM-DDTHH:mm': [{deviceId: string, vhcleNm: string, eventDate: 'YYYY-MM-DDTHH:mm:ss', receivedDate: 'YYYY-MM-DDTHH:mm:ss', messageDate: 'YYYY-MM-DDTHH:mm:ss', mainKey: string, subKey: string, satInfo: string}, {…}]}
 *       1-2) ioValue: { 'YYYY-MM-DDTHH:mm': [{deviceId: string, vhcleNm: string, date: 'YYYY-MM-DDTHH:mm:ss', period: int, satCnr: double, satOnTime: int, satCutOffCount: int, st6100On: int, powerOnCount: int, batChargeTime: int, sendDataCount: int}, {…}]}
 *       1-3) cnrValue: { 'YYYY-MM-DDTHH:mm': [{deviceId: string, vhcleNm: string, date: 'YYYY-MM-DDTHH:mm:ss', cnr: double}, {…}]}
 *     2) diagnosticList : [{deviceId: '', dataCount: 0, dataList: [{…}, {…}]}, {…}] - 단말별
 *       1-1) 0: {eventDate: 'YYYY-MM-DD', satCnr: double, satInfo: string. satOnTime: int, satCutOffCount: int, cnrMap: {0: int, 1: int, …, 23: int}, st6100On: int, powerOnCount: int, batChargeTime: int, sendDataCount: int}
 * }
 */
const Diagnostic = (props) => {
    const { periodDiagnosticList, diagnosticList, startDate, endDate } = props;

    /** @desc: StartDate - EndDate 사이 모든 날짜 배열 - 시각화에서 날짜 범위에 따른 모든 단말의 데이터 상태를 파악하기 위함 (위성신호레벨)*/
    const dateArray = []; // ['2024-01-01', ..., '2024-02-01']
    // Date 는 내려받은 props 가 아닌, 날짜로 정확히 인식하기 위해 new 생성자 활용
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0]+ 'T00:00';
        dateArray.push(formattedDate);
    }






    // props 로 periodDiagnosticList 를 받아온 경우
    if((props !== null && props !== undefined)){

        // periodDiagnosticList 안에 값이 있을 때 && 객체 && 객체의 키 개수가 1 이상인지 확인
        if(periodDiagnosticList && typeof(periodDiagnosticList) === 'object' && Object.keys(periodDiagnosticList).length > 0) {

            // 단말 데이터가 수집된 날짜 객체 (가공 X) - 원본
            const diagIoValue = periodDiagnosticList.ioValue;

            // 날짜 별 각 요소 평균 - 최종 결과를 저장할 객체 초기화
            const finalResultValue = {};

            // dateArray 와 diagIoValue 의 수집된 날짜 Key 매칭
            // dateArray 에 있는 날짜 기준, diagIoValue 에 추가 N 요소에 대한 null 값 할당
            dateArray.forEach(date => {
                // 날짜가 존재하지 않는 경우
                if(!diagIoValue[date]) {
                    finalResultValue[date] = { // 새로운 날짜 추가 & 각 속성 값에 null 값 생성
                        powerOnCount: null,
                        satCnr: null,
                        satCutOffCount: null,
                        satOnTime: null,
                        st6100On: null,
                        devices: [],
                        vhcleNms: [],
                    };
                }
                // 단말 데이터가 수집돼서 날짜가 있는 경우
                else{
                    // 날짜별 수집된 데이터
                    const entries = diagIoValue[date];
                    //console.log(entries)
                    /** @type {date: 'YYYY-MM-DDTHH:mm:ss', deviceId: string, vhcleNm: string, period: int, st6100On: int, satOnTime: int, satCnr: double, satCutOffCount: int, powerOnCount: 0, } */
                    // 각 날짜에 대해 각 단말기의 속성
                    const { avgValues, deviceList, vhcleList, eventDate } = entries.reduce((avg, entry) => {
                        Object.keys(entry).forEach(key => {
                            if (key === 'deviceId') {
                                avg.deviceList.push(entry.deviceId);
                            } else if (key === 'vhcleNm') {
                                avg.vhcleList.push(entry.vhcleNm);
                            } else if (key === 'date') {
                                avg.eventDate = entry.date;
                            } else {
                                avg.avgValues[key] = (avg.avgValues[key] || 0) + entry[key];
                            }
                        });
                        return avg;
                    }, { avgValues: {}, deviceList: [], vhcleList: [], eventDate: '' });
                    avgValues["devices"] = deviceList;
                    avgValues["vhcleList"] = vhcleList;
                    avgValues["eventDate"] = eventDate;
                    Object.keys(avgValues).forEach(key => {
                        if (!isNaN(avgValues[key])) {
                            // 평균값
                            avgValues[key] /= entries.length;

                            // 소수점 첫째자리
                            avgValues[key] = avgValues[key] % 1 !== 0 ? parseFloat(avgValues[key].toFixed(1)) : avgValues[key];
                        }
                    });
                    avgValues['satCutOffCountSum'] = entries.reduce((sum, entry) => sum + entry['satCutOffCount'], 0);
                    avgValues['powerOnCountSum'] = entries.reduce((sum, entry) => sum + entry['powerOnCount'], 0);

                    //console.log(avgValues)

                    finalResultValue[date] = avgValues;
                }
            })

            /** @desc: 모든 dateArray의 각 날짜에 대한 요소들의 평균값들 - 각 날짜에 수집된 데이터들을 더해 수집된단말 개수로 나눔 */
            /** @type { {'YYYY-MM-DDT00:00': { date: NaN(eventDate), period: 2, powerOnCount: float, powerOnCountSum: int, satOnTime: double, st6100On: double, vhcleNm: NaN } } } */
            console.log(finalResultValue);


            /** @desc LineChart Argument */
            // xaxis
            const newPeriodDataArray = dateArray.map(date => date + ':00Z');
            // yaxis
            const satOnTimeArray = [];
            const st6100OnArray = [];
            const satCnrArray = [];
            const satCutOffCountArray = [];
            const satCutOffCountSumArray = [];
            const powerOnCountArray = [];
            const powerOnCountSumArray = [];
            const collectDeviceCountArray = [];

            // Chart Component 에 인자값으로 할당할 배열에 날짜별 각 속성값을 PUSH
            Object.keys(finalResultValue).forEach(date => {
                const entries = finalResultValue[date];

                // Line Chart 인자 배열
                satOnTimeArray.push(entries.satOnTime);
                st6100OnArray.push(entries.st6100On);
                satCnrArray.push(entries.satCnr);
                satCutOffCountArray.push(entries.satCutOffCountSum);
                satCutOffCountSumArray.push(entries.satCutOffCountSum);
                powerOnCountArray.push(entries.powerOnCountSum);
                powerOnCountSumArray.push(entries.powerOnCountSum);
                collectDeviceCountArray.push(entries.devices.length);
            });

            // undefined 제거
            // 0으로 치부하면 안됨. 아예 데이터가 들어오지 않은 것과 데이터가 0으로 들어온 건 다르니까. 데이터가 들어와도 0 데이터가 들어옴 undefined 가 아님
            const filteredSatCutOffCountSumArray = satCutOffCountSumArray.filter(value => value !== undefined); // 데이터가 없는 건 제거
            //const filteredSatCutOffCountSumArray = satCutOffCountSumArray.map(value => value === undefined ? 0 : value); // 데이터가 없는 건 0으로
            const filteredPowerOnCountSumArray = powerOnCountSumArray.filter(value => value !== undefined);




            /** @desc Progess Bar Chart */
            let totalDvCount;
            if(diagnosticList.length != 0) {
                totalDvCount = diagnosticList.length;
            }

            const percentageYesterDaySatOnTime = '';
            const percentageYesterDaySt6100On = '';
            const percentageMonthSatOnTime = '';
            const percentageMonthSt6100On = '';



            //console.log(diagnosticList);
            //console.log(diagnosticList.data);

            /** @desc: 각 '단말별' 수집한 데이터 개수로 평균 */
            const deviceElementValues = {};
            diagnosticList.forEach(device => {
                //console.log(device)
                const deviceId = device.deviceId;
                //console.log(device.data);
                device.data.forEach(entry => {
                    //console.log(entry.satCutOffCount)
                })

                // 한 단말의 위성연결시간 ( 무조건 30일치가 아닌, 단말기마다 각자 수집된 데이터 개수로 평균 구함 )
                const totalSatOnTime = device.data.reduce((sum, entry) => sum + entry.satOnTime, 0);
                const averageSatOnTime = parseFloat((totalSatOnTime / device.dataCount).toFixed(1));
                const percentageSatOnTime = parseFloat(((totalSatOnTime / (device.dataCount * 1440)) * 100).toFixed(1));

                // 한 단말의 단말가동시간
                const totalSt6100On = device.data.reduce((sum, entry) => sum + entry.st6100On, 0);
                const averageSt6100On = parseFloat((totalSt6100On / device.dataCount).toFixed(1));
                const percentageSt6100On = parseFloat(((totalSt6100On / (device.dataCount * 1440)) * 100).toFixed(1));


                deviceElementValues[deviceId] = {
                    'monthSatOnTimePercentage' : percentageSatOnTime,
                    'monthSt6100OnPercentage' : percentageSt6100On,
                };

            });
            /** @desc: {deviceId: {percentageSatOnTime: double, percentageSt6100On: double}, ...} */
            //console.log(deviceElementValues);


            let totalSatOnTime = 0;
            let totalSt6100On = 0;
            // 각 단말기의 백분율 요소를 더한 전체 단말기 백분율 요소 구하기
            /*Object.values(deviceElementValues).forEach(device => {
                totalSatOnTime += device.percentageSatOnTime;
                totalSt6100On += device.percentageSt6100On;
            });*/

            /*const allDeviceSatPercentage = totalSatOnTime / Object.keys(deviceElementValues).length;
            const allDeviceDvPercentage = totalSt6100On / Object.keys(deviceElementValues).length;
            console.log(totalSatOnTime)
            console.log(totalSt6100On)

            console.log(allDeviceSatPercentage)
            console.log(allDeviceDvPercentage)*/


            /** @desc Widget Toggle */
            // 날짜의 배열 안에 있는 객체들을 하나의 객체로 풀어냄
            const removeDateKey = Object.values(diagIoValue).flat();
            // 날짜 객체를 구분하지 않은 모든 속성의 최소, 최대 객체 값
            // 최소 항목, 최대 항목
            let minEntries = {};
            let maxEntries = {};
            // 각 평균 값
            let avgEntries = {};

            // 비교할 속성 정의
            const attributesToCompare = ['powerOnCount', 'satCnr', 'satCutOffCount', 'satOnTime', 'st6100On', 'powerOnCountValue', 'satCnrValue', 'satCutOffCountValue', 'satOnTimeValue', 'st6100OnValue'];
            attributesToCompare.forEach(attribute => {
                // 초기값 설정
                let minValue = Number.POSITIVE_INFINITY;
                let maxValue = Number.NEGATIVE_INFINITY;

                // Widget Toggle 최소, 최대값
                removeDateKey.forEach(entry => {
                    //console.log(entry)
                    //console.log(entry[attribute])
                    //console.log(entry);
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
                })
            })

            
            
            /* 여기서는 다 가져온거 */
            avgEntries['satOnTimeArr'] = Object.values(finalResultValue).map((key) => key.satOnTime);
            avgEntries['satCutOffCountArr'] = Object.values(finalResultValue).map((key) => key.satCutOffCount);
            avgEntries['st6100OnArr'] = Object.values(finalResultValue).map((key) => key.st6100On);
            avgEntries['powerOnCountArr'] = Object.values(finalResultValue).map((key) => key.powerOnCount);

            avgEntries['satOnTimeAvg'] = parseFloat((avgEntries.satOnTimeArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            avgEntries['satCutOffCountAvg'] = parseFloat((avgEntries.satCutOffCountArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            avgEntries['st6100OnAvg'] = parseFloat((avgEntries.st6100OnArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            // 30일 중 Reset 이 한번이라도 발생하면 1, 안일어나면 0 -> 일어난 날을 모두 더해서 30일로 나눔( = 30일 간 리셋이 한 번이라도 일어난 횟수를 알 수 있음)
            avgEntries['powerOnCountAvg'] = parseFloat((avgEntries.powerOnCountArr.reduce((sum, entry) => sum + entry, 0) / 30).toFixed(2));
            let totalSatCutOffCount = 0;
            let totalSatCnr = 0;
            let totalPowerOnCount = 0;

            // 위성신호레벨이 기준치 보다 높을 때, totalSatCnr Array 에 추가
            const standardSatCnrValue = 39;
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
            const yesterDate = dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD[T]00:00');

            const averageSt6100On = ((totalSt6100On / (totalDateCount * 1440)) * 100).toFixed(2);
            const averageSatOnTime = ((totalSatOnTime / (totalDateCount * 1440)) * 100).toFixed(2);

            let yesterSt6100On = 0;
            let yesterSatOnTime = 0;

            // 어제 기준 위성접속률 & 단말가동률
            const yesterData = finalResultValue[yesterDate];
            if(yesterData) {
                // 해당 날짜에 대한 데이터가 존재할 경우
                //console.log(yesterData);
                //console.log(yesterData.st6100On);
                //console.log(yesterData.satOnTime);
                yesterSatOnTime = (yesterData.satOnTime / 1440 * 100).toFixed(2);
                yesterSt6100On = (yesterData.st6100On / 1440 * 100).toFixed(2);
            }
            const widgetsResult = {};
            props.diagnosticList.forEach(device => {
                //console.log(device)
                const deviceId = device.deviceId;
                //console.log(device)

                // satCnr 계산
                const totalSatCnr = device.data.reduce((sum, entry) => sum + entry.satCnr, 0);
                const averageSatCnr = parseFloat((totalSatCnr / device.dataCount).toFixed(1));

                // satOnTime 계산
                const totalSatOnTime = device.data.reduce((sum, entry) => sum + entry.satOnTime, 0);
                //console.log(totalSatOnTime)
                const averageSatOnTime = parseFloat((totalSatOnTime / device.dataCount).toFixed(1)); // 평균
                const percentSatOnTime = parseFloat(((totalSatOnTime / (device.dataCount * 1440))*100).toFixed(1)); // 백분율
                //(percentSatOnTime)
                // satCutOffCount 계산
                const totalSatCutOffCount = device.data.reduce((sum, entry) => sum + entry.satCutOffCount, 0);
                const averageSatCutOffCount = parseFloat((totalSatCutOffCount / device.dataCount).toFixed(1));
                //const percentSatCutOffCount = parseFloat(((totalSatCutOffCount / (30 * 1440))*100).toFixed(2));

                // st6100On 계산
                const totalSt6100On = device.data.reduce((sum, entry) => sum + entry.st6100On, 0);
                const averageSt6100On = parseFloat((totalSt6100On / device.dataCount).toFixed(1));
                const percentSt6100On = parseFloat(((totalSt6100On / (device.dataCount * 1440))*100).toFixed(1));

                // powerOnCount 계산
                const totalPowerOnCount = device.data.reduce((sum, entry) => sum + entry.powerOnCount, 0);
                const averagePowerOnCount = parseFloat((totalPowerOnCount / device.dataCount).toFixed(1));
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
            const filterSatCnr = {};
            const filterSatOnTime = {};
            const filterSatCutOffCount = {};
            const filterSt6100On = {};
            const filterPowerOnCount = {};

            Object.entries(widgetsResult).forEach(([deviceId, values]) => {
                //console.log(values)
                const { averageSatCnr } = values;

                //console.log(values.averageSatCnr)
                //console.log(averageSatCnr)
                //console.log({averageSatCnr})


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


            return(
                <>
                    <Grid container spacing={1} className="diagnostic">
                        {/* Main Line Chart */}
                        <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'white', p:1}}>

                            {/* 1. 위성연결시간 & 단말가동시간 */}
                            <Box className="diagnostic_construct" >
                                <Box className="diagnostic_construct_top">
                                    <Typography variant="h5" >위성연결시간 & 단말가동시간</Typography>
                                </Box>
                                <Box className="diagnostic_construct_component" >
                                    {/*<OnTimeLineChart finalResultValue={finalResultValue}/>*/}
                                    <OnTimeLineChart data1={satOnTimeArray} data2={st6100OnArray} data3={collectDeviceCountArray} xaxis={newPeriodDataArray}/>
                                    <br/>
                                    <Box className="diagnostic_construct_component">
                                        <SearchByDate />
                                    </Box>
                                </Box>
                            </Box>

                            <br/>

                            {/* 2. 위성신호레벨/잡음비(평균) & 위성끊김횟수 */}
                            <Box className="diagnostic_construct">
                                <Box className="diagnostic_construct_top">
                                    <Typography variant="h5" >위성신호레벨/잡음비(평균) & 위성끊김횟수</Typography>
                                </Box>
                                <Box className="diagnostic_construct_component">
                                    <SignLevelSatCutResetChart data1={satCnrArray} data2={satCutOffCountArray} data3={powerOnCountArray} data4={collectDeviceCountArray} xaxis={newPeriodDataArray}/>
                                    <br/>
                                    <Box className="diagnostic_construct_component">
                                        <SearchByDate />
                                    </Box>
                                </Box>
                            </Box>

                        </Grid>
                        {/* Widget - Progressbar & Toggle */}
                        <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'white', p:1}}>

                            {/* 1. 위성 접속률 & 단말 가동률 */}
                            <Box className="diagnostic_construct_widget">
                                <Box className="diagnostic_construct_widget_component" sx={{height: '100%'}}>
                                    <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center', textAlign: 'end'}}>
                                        <Box sx={{ display: 'block', p: 0 }}>
                                            <Typography variant="h6" gutterBottom sx={{ p:0, color: '#394251', paddingRight: '8px', marginBottom: 0}}>Total number of device : </Typography>
                                            <Typography variant="h8" gutterBottom sx={{ p:0, color: '#394251', paddingRight: '15px', marginBottom: 0}}>(w. Diagnostic Data)</Typography>
                                        </Box>
                                        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', color: '#394251'}}>{totalDvCount}</Typography>
                                    </Box>
                                    <hr/>
                                    <Box className="diagnostic_construct_widget_gaugeCharts">
                                        <AnimatedGaugeChart label="위성 가동률" monthValue={averageSatOnTime} edgePathColor="#FF89A0" edgeTrailColor="#FFE9ED" edgeBackgroundColor="#FFE9ED" insidePathColor="#DC143C" insideTrailColor="#FFD1DA" insideBackgroundColor="#FFD1DA" yesterValue={yesterSatOnTime}/>
                                        <AnimatedGaugeChart label="단말 가동률" monthValue={averageSt6100On} edgePathColor="#7C8FB2" edgeTrailColor="#CFE5FB" edgeBackgroundColor="#CFE5FB" insidePathColor="#54627B" insideTrailColor="#98B7D6" insideBackgroundColor="#98B7D6" yesterValue={yesterSt6100On}/>
                                    </Box>
                                </Box>
                            </Box><br/>

                            {/* 2. Toggle Widgets */}
                            {/* 2. 위성신호레벨/잡음비(평균) */}
                            <ConditionsToggle title="위성신호레벨 / 잡음비" color="#FF666B" percentage={satCnrExceedThresholdPercent} maxTitle="기준치 정상 단말 개수" minTitle="기준치 이하 단말 개수" max={normalSatCnrCount} min={abnormalSatCnrCount} averageTitle="기준치 위성신호레벨/잡음비" average={standardSatCnrValue} unit="개" averageUnit="dB"/><br/>

                            {/* 3. 위성연결시간 */}
                            <ConditionsToggle title="위성 연결 시간" color="#FDDC66" percentage={satOnTimeExceedThresholdPercent} maxTitle="최대 시간" minTitle="최소 시간" min={minEntries.satOnTimeValue} max={maxEntries.satOnTimeValue} averageTitle="평균" average={avgEntries.satOnTimeAvg} unit="시간" averageUnit="시간"/><br/>

                            {/* 4. 위성끊김횟수 */}
                            <ConditionsToggle title="위성 끊김 횟수" color="#E89EFB" percentage={satCutOffCountExceedThresholdPercent} maxTitle="최대 횟수" minTitle="최소 횟수" min={Math.min(...filteredSatCutOffCountSumArray)} max={Math.max(...filteredSatCutOffCountSumArray)} averageTitle="평균" average={avgEntries.satCutOffCountAvg} unit="번" averageUnit="번"/><br/>

                            {/* 5. 단말가동시간 */}
                            <ConditionsToggle title="단말 가동 시간" color="#98B7D6" percentage={st6100OnExceedThresholdPercent} maxTitle="최대 시간" minTitle="최소 시간" min={minEntries.st6100OnValue} max={maxEntries.st6100OnValue} averageTitle="평균" average={avgEntries.st6100OnAvg} unit="시간" averageUnit="시간"/><br/>

                            {/* 6. 단말Reset횟수 */}
                            <ConditionsToggle title="단말 Reset 횟수" color="#B4B0FF" percentage={powerOnCountExceedThresholdPercent} maxTitle="최대 횟수" minTitle="최소 횟수" min={Math.min(...filteredPowerOnCountSumArray)} max={Math.max(...filteredPowerOnCountSumArray)} averageTitle="평균" average={avgEntries.powerOnCountAvg} unit="번" averageUnit="번"/><br/>

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
                    <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress color="secondary" />
                    </Stack>
                </>
            )
        }
        else{
            //console.log('값이 다른 형태');
            //console.log(props.periodDiagnosticList);
            return(
                <>
                    <p>데이터가 존재하지 않습니다. 관리자에게 문의하시길 바랍니다.</p>
                </>
            )
        }
    }
    // props 로 periodDiagnosticList 를 받아오지 못한 경우
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
export default Diagnostic;