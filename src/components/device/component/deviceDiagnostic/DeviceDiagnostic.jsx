/* React */
import React, { useState, useEffect } from "react";

/* Import */
import "./deviceDiagnostic.scss";
import SingleCircularProgress from "./chart/SingleCircularProgress";
// 시간별 위성신호레벨 그래프
import SatCnrTimeStandard from "./chart/SatCnrTimeStandard";
//import OnTimeLineChart from "./chart/OnTimeLineChart";

/* Module _ (src/component/modules/chart) */
import OnTimeLineChart from "../../../modules/chart/OnTimeLineChart";
import SignLevelSatCutResetChart from "../../../modules/chart/SignLevelSatCutResetChart";
import ConditionsToggle from "./widget/ConditionsToggle";

/* MUI */
import { Box, Grid, Typography } from "@mui/material";



const DeviceDiagnostic = (props) => {
    const { inputDeviceId, inputStartDate, inputEndDate, deviceDiagnostic, oneDeviceDiagnostic, oneDeviceDiagnosticTime, ...otherProps } = props;
    //console.log(deviceDiagnostic); // 전체 단말
    //console.log(oneDeviceDiagnostic); // 선택한 단말의 type 이 2인 경우 (Day)
    //console.log(oneDeviceDiagnosticTime); // 선택한 단말의 type 이 1인 경우 (Time)

    // SatCnr 을 type='시간(1)' 으로 나타내기 위한 배열
    let completeForCnrMapData = [];

    // 선택한 단말이 Diagnostic Data 를 가지고 있는 경우
    if(oneDeviceDiagnostic.length > 0) {
        //console.log(oneDeviceDiagnostic);

        // 임시 Date Array
        const startDate = new Date(inputStartDate);  // 시작 날짜 설정
        const endDate = new Date(inputEndDate);    // 종료 날짜 설정
        const dateArray = [];
        // 시작 날짜부터 종료 날짜까지의 날짜를 생성하고 배열에 추가 (모든 날짜 데이터를 배열에 추가함)
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            dateArray.push(date.toISOString().slice(0, 10));  // 'YYYY-MM-DD' 형식으로 배열에 추가
        }
        //console.log(dateArray)

        // OneDeviceDiagnostic 객체에 없는 날짜 객체 추가
        const includeMissingDates = oneDeviceDiagnostic.map(deviceData => {
            const newData = dateArray.map(date => {
                const existingData = deviceData.data.find(item => item.eventDate === date);
                if (existingData) {
                    return existingData;
                } else {
                    const newEvent = { eventDate: date };
                    Object.keys(deviceData.data[0]).forEach(key => {
                        if (key !== 'eventDate') {
                            newEvent[key] = null;
                        }
                    });
                    return newEvent;
                }
            });

            return {
                ...deviceData,
                data: newData,
            };
        });
        // 데이터가 없는 날짜까지 모두 포한한 총 31일치 데이터
        //console.log(includeMissingDates);


        /** Diagnostic Line Chart 파라미터 전달인자 **/
        const eventDate = includeMissingDates[0].data.map(date => date.eventDate);

        // 위성연결시간 & 단말가동시간
        const satOnTime = includeMissingDates[0].data.map(sat => sat.satOnTime);
        const st6100On = includeMissingDates[0].data.map(dv => dv.st6100On);
        // 위성신호레벨 & 위성끊김횟수 & 전원ResetCount
        const satCnr = includeMissingDates[0].data.map(cnr=>cnr.satCnr);
        const satCutOffCount = includeMissingDates[0].data.map(cut=>cut.satCutOffCount);
        const powerOnCount = includeMissingDates[0].data.map(reset=>reset.powerOnCount);


        /** Diagnostic Operation of Ratio 파라미터 전달인자 **/
        // satOnTime, st6100On 총합 계산
        const totalSatOnTime = includeMissingDates[0].data.reduce((sum, item) => sum + item.satOnTime, 0);
        const totalSt6100On = includeMissingDates[0].data.reduce((sum, item) => sum + item.st6100On, 0);
        // 위성가동률 & 단말가동률
        const resultSatOnTime = parseFloat(((totalSatOnTime / (includeMissingDates[0].dataCount * 1440)) * 100).toFixed(2));
        const resultSt6100On = parseFloat(((totalSt6100On / (includeMissingDates[0].dataCount * 1440)) * 100).toFixed(2));

        //console.log('Result for satOnTime:', resultSatOnTime);
        //console.log('Result for st6100On:', resultSt6100On);


        /** 각 위젯별 항목 */
        // 최소값
        const minValueSatOnTime = Math.min(...satOnTime);
        const minValueSt6100On = Math.min(...st6100On);
        const minValueSatCnr = Math.min(...satCnr);
        const minValueSatCutOffCount = Math.min(...satCutOffCount);
        const minValuePowerOnCount = Math.min(...powerOnCount);
        // 최대값
        const maxValueSatOnTime = Math.max(...satOnTime);
        const maxValueSt6100On = Math.max(...st6100On);
        const maxValueSatCnr = Math.max(...satCnr);
        const maxValueSatCutOffCount = Math.max(...satCutOffCount);
        const maxValuePowerOnCount = Math.max(...powerOnCount);
        // 평균값
        const avgValueSatCnr = (satCnr.reduce((acc, value) => acc + (value || 0), 0) / satCnr.length).toFixed(2);
        const avgValueSatOnTime = (satOnTime.reduce((acc, value) => acc + (value || 0), 0) / satOnTime.length).toFixed(2);
        const avgValueSatCutOffCount = (satCutOffCount.reduce((acc, value) => acc + (value || 0), 0) / satCutOffCount.length).toFixed(2);
        const avgValueSt6100On = (st6100On.reduce((acc, value) => acc + (value || 0), 0) / st6100On.length).toFixed(2);
        const avgValuePowerOnCount = (powerOnCount.reduce((acc, value) => acc + (value || 0), 0) / powerOnCount.length).toFixed(2);



        //console.log(oneDeviceDiagnosticTime)
        /* 위성신호레벨 차트를 위한 API 데이터 가공 */
        if(oneDeviceDiagnosticTime.length > 0) {
            // 정렬되지 않은 모든 데이터를 중복하는 날짜별로 시간데이터 묶기
            // { key: 'YYYY-MM-DD', value : [{...}, {...}, ..., {...}] }
            const sameDateGroupTime  = oneDeviceDiagnosticTime[0].data.reduce((acc, item) => {
                const dateKey = item.eventDate.slice(0, 10);

                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(item);

                return acc;
            }, {});
            //console.log('[sameDateGroupTime _ 같은 날짜끼리 모음] : ', sameDateGroupTime);


            /**
             * @desc : dateArray 와 비교하여 (데이터가 수집되지 않은) 날짜가 없는 key 생성
             ** 1. 날짜 key 가 없는 key 값 추가
             ** 2. 시간별 24개 데이터가 없는 객체 추가
             * */
            const dataNotCollectedDate = {}; // 기간 내 모든 날짜 및 시간 데이터 리턴 및 생성
            
            dateArray.forEach(date => {
                // 날짜 key 없는 경우
                if(!sameDateGroupTime[date]) {
                    // key 날짜 추가 & 시간별 데이터 각 요소에 null 할당
                    dataNotCollectedDate[date] = Array.from({length: 24}, (_, index) => {
                        const hour = index.toString().padStart(2, '0');
                        return {
                            eventDate: `${[date]}T${hour}`,
                            satCnr: null,
                            satOnTime: null,
                            st6100On: null,
                            cnrMap: {
                                0: null,
                                1: null,
                                2: null,
                                3: null
                            }
                        }
                    });
                }
                // 날짜 key 있는 경우
                else{
                    // key 날짜 있지만, 24개의 모든 시간 데이터가 없는 경우
                    if(sameDateGroupTime[date].length != 24) {

                        // 24번 반복하면서 새로운 객체 생성
                        dataNotCollectedDate[date] = Array.from({ length: 24 }, (_, index) => {
                            const hour = index.toString().padStart(2, '0'); // 자리수, 맨앞

                            // 날짜 배열에서 시간에 해당하는 객체
                            const existingItem = sameDateGroupTime[date].find(item => item.eventDate === `${[date]}T${hour}`)

                            // 시간 데이터가 있는 경우 그대로 기존 데이터 리턴
                            // 시간 데이터가 없는 경우 새로운 객체 생성해서 삽입
                            if (existingItem) {
                                return existingItem;
                            } else {
                                return {
                                    eventDate: `${[date]}T${hour}`,
                                    satCnr: null,
                                    satOnTime: null,
                                    st6100On: null,
                                    cnrMap: {
                                        0: null,
                                        1: null,
                                        2: null,
                                        3: null
                                    },
                                    powerOnCount: null,
                                    satCutOffCount: null,
                                    satInfo: null,

                                };
                            }
                        })
                    }
                    // key 날짜와 24개의 모든 시간 데이터가 있는 경우
                    else{
                        dataNotCollectedDate[date] = sameDateGroupTime[date];
                    }
                }
            })
            //console.log('[dataNotCollectedDate _ 날짜별 데이터 모두 채우고 객체 형식 동일화] : ', dataNotCollectedDate); // key 날짜에 해당하는

            // 날짜 key 로 구분되었던 데이터를 하나의 배열로 평탄화
            const againCollectedTimeData = Object.values(dataNotCollectedDate).flat();
            //console.log('[againCollectedTimeData _ 모든 가공 데이터 합침] : ', againCollectedTimeData)

            // Date - ISO 형식 맞추기
            completeForCnrMapData = againCollectedTimeData.map(item => {
                const [date, time] = item.eventDate.split('T');

                const newEventDate = `${date}T${time}:00:00Z`;
                return {
                    ...item,
                    eventDate: newEventDate,
                };
            });
            //console.log('[completeForCnrMapData _ 가공 완료 및 ISO] : ', completeForCnrMapData)
            //completeForCnrMapData = againCollectedTimeData;

            // 각 객체의 cnrMap을 'YYYY-MM-DD HH:mm' 형태로 변환 (00분/15분/30분/45분)
            /*const transformedData = againCollectedTimeData.map(({ eventDate, cnrMap }) => {
                const transformedCnrMap = Object.fromEntries(
                    Object.entries(cnrMap).map(([key, value]) => {
                        // key를 'YYYY-MM-DD HH:mm' 형태로 변환
                        const minute = key * 15;
                        const formattedKey = `${eventDate}:${String(minute % 60).padStart(2, '0')}`;

                        return [formattedKey, value];
                    })
                );

                return { eventDate, cnrMap: transformedCnrMap };
            });

            console.log(transformedData);

            // eventDate 추출
            console.log(transformedData.map(event=>event.eventDate));

            // cnrMap 추출
            let cnrMapArray = [];
            transformedData.map(function(time) {
                //console.log(time);
                //console.log(time.cnrMap);
                cnrMapArray.push(time.cnrMap)
                /!*console.log(time.cnrMap);

                time.cnrMap.map(function(min){
                    console.log(min)
                })*!/
            })
            console.log(cnrMapArray)

            completeForCnrMapData = transformedData.map(cnr => cnr.cnrMap);*/

            //console.log(Object.values(dataNotCollectedDate));
            //console.log(completeForCnrMapData);

            // 2. 날짜 키 값에 대한 value 가 24가 아닌 것 찾기
            //const invalidDates = Object.keys(sameDateGroupTime).filter(dateKey => sameDateGroupTime[dateKey].length !== 24);
        }
        //console.log(completeForCnrMapData);
        //console.log(completeForCnrMapData.map(cnr=>cnr.satCnr));
        //console.log(completeForCnrMapData.map(date=>date.eventDate));


        const cnrMapSatCnr = completeForCnrMapData.map(cnr=>cnr.satCnr);
        const cnrMapEventDate = completeForCnrMapData.map(date=>date.eventDate);


        /*const modifiedChartDate = completeForCnrMapData.map(dataPoint => ({
            ...dataPoint,
            eventDate: `${dataPoint.x}:00:00`,
        }));*/
        // 새로운 객체를 만들 때 eventDate 키가 있는 경우에만 수정
        const modifiedChartDate = completeForCnrMapData.map(dataPoint => {
            // x 키가 있는지 확인하고 값을 수정
            if (dataPoint.eventDate) {
                return {
                    ...dataPoint,
                    eventDate: `${dataPoint.eventDate}:00:00`,
                };
            }
            // x 키가 없는 경우 그대로 반환
            return dataPoint;
        });
        //console.log(modifiedChartDate)






        return(
            <>
                <Grid container spacing={1} className="device_diagnostic_construct">

                    {/* Left */}
                    <Grid item xs={8.5} sx={{flex: 1, height:'100%', width: '100%'}}>
                        <br/>
                        {/* 위성연결시간 & 단말가동시간 */}
                        <Box className="device_diagnostic_construct_component">
                            <Box className="device_diagnostic_construct_component_title">
                                <Typography variant="h5">위성연결시간 & 단말가동시간</Typography>
                            </Box>
                            <Box className="device_diagnostic_construct_component_body">
                                <OnTimeLineChart data1={satOnTime} data2={st6100On} data3={null} xaxis={eventDate}/>
                                {/*<OnTimeLineChart data1={satOnTime} data2={st6100On} data3={null} xaxis={eventDate}/> // Module OnTimeLineChart*/}
                                {/*<OnTimeLineChart data1={satOnTime} data2={st6100On} xaxis={eventDate}/>*/}
                            </Box>
                        </Box>
                        <br/>
                        {/* 위성신호레벨 & 위성끊김횟수 & 전원Reset */}
                        <Box className="device_diagnostic_construct_component">
                            <Box className="device_diagnostic_construct_component_title">
                                <Typography variant="h5">위성신호레벨/잡음비 & 위성끊김횟수 & 전원Reset횟수</Typography>
                            </Box>
                            <Box className="device_diagnostic_construct_component_body">
                                <SignLevelSatCutResetChart data1={satCnr} data2={satCutOffCount} data3={powerOnCount} data4={null} xaxis={eventDate}/>
                            </Box>
                            <Box className="device_diagnostic_construct_component_body">
                                <SatCnrTimeStandard cnrMapSatCnr={cnrMapSatCnr} cnrMapEventDate={cnrMapEventDate} completeForCnrMapData={completeForCnrMapData}/>
                            </Box>
                        </Box>

                    </Grid>

                    {/* Right */}
                    <Grid item xs={3.5} sx={{flex: 1}}>
                        <br/>
                        {/* 위성가동률 & 단말가동률*/}
                        <Box className="device_diagnostic_construct_component" >
                            <Box className="device_diagnostic_construct_component_title">
                                <Typography variant="h5">위성접속률 & 단말가동률</Typography>
                            </Box>
                            <Box className="device_diagnostic_construct_component_body" sx={{display: 'flex'}}>
                                <SingleCircularProgress title='위성접속률' value={resultSatOnTime} pathColor='#DC143C' trailColor='#FFD1DA' backgroundColor='#FFD1DA'/>
                                <SingleCircularProgress title='단말가동률' value={resultSt6100On} pathColor='#54627B' trailColor='#98B7D6' backgroundColor='#98B7D6'/>
                            </Box>
                        </Box>
                        <br/>

                        {/* 위젯들 */}
                        <ConditionsToggle title="위성신호레벨 / 잡음비" color="#FF666B" percentage="" maxTitle="최대 위성신호/잡음비" max={maxValueSatCnr} unit="dB" minTitle="최소 위성신호/잡음비" min={minValueSatCnr} averageTitle="평균 위성신호/잡음비" average={avgValueSatCnr} />
                        <br/>
                        <ConditionsToggle title="위성 연결 시간" color="#FDDC66" percentage="" maxTitle="최대 시간" max={maxValueSatOnTime} unit="분" minTitle="최소 시간" min={minValueSatOnTime} averageTitle="평균" average={avgValueSatOnTime} />
                        <br/>
                        <ConditionsToggle title="위성 끊김 횟수" color="#E89EFB" percentage="" maxTitle="최대 횟수" max={maxValueSatCutOffCount} unit="번" minTitle="최소 횟수" min={minValueSatCutOffCount} averageTitle="평균 횟수" average={avgValueSatCutOffCount} />
                        <br/>
                        <ConditionsToggle title="단말 가동 시간" color="#98B7D6" percentage="" maxTitle="최대 시간" max={maxValueSt6100On} unit="분" minTitle="최소 시간" min={minValueSt6100On} averageTitle="평균 시간" average={avgValueSt6100On} />
                        <br/>
                        <ConditionsToggle title="단말 Reset 횟수" color="#B4B0FF" percentage="" maxTitle="최대 횟수" max={maxValuePowerOnCount} unit="번" minTitle="최소 횟수" min={minValuePowerOnCount} averageTitle="평균 횟수" average={avgValuePowerOnCount} />

                    </Grid>
                    
                </Grid>
            </>
        )
    }
    // 선택한 단말이 Diagnostic Data 를 가지지 않는 경우
    else {
        //console.log('선택한 단말은 Diagnostic Data 가 없습니다.');

        return(
            <>
                해당 단말은 조회한 기간 내 Diagnostic Data 를 가지고 있지 않습니다.
            </>
        )
    }
}

export default DeviceDiagnostic;