/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./deviceInfo.scss";
import StatusAlarm from "./alarmType/StatusAlarm";
import StatusHistoryPie from "./alarmType/StatusHistoryPie";
import RealTimeAlarm from "./alarmType/RealTimeAlarm";
import EventTimeAlarm from "./alarmType/EventTimeAlarm";
import DeviceHistoryMap from "../deviceHistoryMap/DeviceHistoryMap";

/* MUI */
import {Grid, Typography, Box, Tooltip, Avatar, Stack, Alert, AlertTitle} from "@mui/material";


/***
 * @Author : jhlee
 * @date : 2024-02-29
 * @file : {
 *  Device 의 기본 정보를 보여주는 Device Info Component
 *  Device Alarm Type - StatusAlarm | EventTimeAlarm | RealTimeAlarm
 *  Device Input Value 와 Session 에서 보여줄 단말을 매칭
 * }
 * @property : {
 *  inputDeviceId : string
 *  sessionNmsCurrent: Array
 *  statusHistory : Array
 * }
 * @desc : {
 *  matchingObject : 한 단말기에 대한 NMS Data(obj) || null
 *  1. inputDeviceId 가 있을 경우 ->) Session 에 저장된 All NMS Data 의 deviceId 와 inputDeviceId 을 매칭시킨 NMS Data(obj)
 *  2. inputDeviceId 가 없을 경우 ->) 단말을 선택하지 않았을 때 기존 컴포넌트 틀은 남겨놔야 하기 때문에 null 값으로 지정
 *
 * }
 * @todo : {
 *    1) Device Tag
 *    2) AlarmBox _ width 자동조절
 * }
 */
const DeviceInfo = (props) => {
    const { inputDeviceId, sessionNmsCurrent, deviceInfoData, deviceRecentData, statusHistory, eventHistoryAlarm, nmsOneHistory, ...otherProps } = props;
    console.log('Props : ', props);

    /*if(deviceRecentData && deviceRecentData.ioJson.satCnr){
        console.log(deviceRecentData.ioJson.satCnr)
    }
    else{
        console.log(deviceRecentData)
    }*/

    /*console.log(deviceRecentData)
    const [satCnr, setSatCnr] = useState('');

    useEffect(() => {
        // 배열인 경우
        if (Array.isArray(deviceRecentData)) {
            setSatCnr('');
        } else {
            setSatCnr(deviceRecentData.ioJson && deviceRecentData.ioJson.hasOwnProperty('satCnr')
                ? deviceRecentData.ioJson.satCnr
                : '');
        }
    }, [deviceRecentData]);

    console.log(satCnr);*/

    /*const satCnr = deviceRecentData.ioJson.satCnr && deviceRecentData.ioJson.satCnr != undefined
        ? deviceRecentData.ioJson.satCnr
        : '';
    console.log(satCnr)*/



    /**
     * @desc: {
     *     if) inputDeviceID 있는 경우 : Table 에서 선택한 Row 가 있거나, Input Value 로 DeviceId 를 선택한 경우
     *     ? (유) matching == Session 에서 매칭한 DeviceId 의 Object 저장
     *     : (무) null
     * }
     * */
    const matchingObject = inputDeviceId && sessionNmsCurrent
        ? sessionNmsCurrent.find(obj => obj.deviceId === inputDeviceId) || ''
        : '';
    console.log('Session 에서 불러온 Matching 된 한 단말의 nms 정보 : ', matchingObject)

    /** 첫 번째 글자를 대문자로 변환하는 함수 - Status */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /** 초 -> '시간 분 초' 로 변환하는 함수 - ParseDiff */
    /*function formatTime(seconds) {
        let hours = parseInt(seconds/3600);
        let minutes = parseInt((seconds%3600)/60);
        let remainingSeconds = seconds%60;
        return { hours, minutes, seconds: remainingSeconds };
    }
    // 시간, 분, 초로 변환
    const { hours, minutes, seconds } = formatTime(matchingObject.parseDiff);*/
    //console.log(`${hours}시간 ${minutes}분 ${seconds}초`);

    // 마지막 데이터 수집 시간 > 데이터 수집 주기 - 조건부여
    /*const isDiffGreaterThanPeriod = matchingObject.parseDiff > matchingObject.maxPeriod;
    console.log(isDiffGreaterThanPeriod);*/



    /** 분 -> '시간, 분, 초' 로 변환하는 함수 */
    function convertMinutesToTime(minutes) {
        const totalSeconds = minutes * 60;

        const hours = Math.floor(totalSeconds / 3600);
        const remainingSeconds = totalSeconds % 3600;
        const minutesResult = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        return {
            hours: hours,
            minutes: minutesResult,
            seconds: seconds
        };
    }
    /*const parseDiff = 60;
    const timeObjectParseDiff = convertMinutesToTime(parseDiff);
    console.log(timeObjectParseDiff)
    console.log(`${timeObjectParseDiff.hours} 시간, ${timeObjectParseDiff.minutes} 분, ${timeObjectParseDiff.seconds} 초`);*/


    /** HH시간 : mm분 형태 변환 함수 */
    const formattedTime = (timeObject) => {
        return `${timeObject.hours}시간 : ${timeObject.minutes}분`;
    }





    // Info Box
    const InfoBox = ({ title, value, status, statusDesc, satCnr, satCnrAvr, dataCycle, dataCycleAvr }) => (
        <Box className="description" >
            <div className="descriptionName">{title}</div>
            <hr/>
            <div className="descriptionContain">
                {/* value 가 존재할 때만 <div>~</div> 렌더링 | value 가 null or undefined 이면 렌더링 X*/}
                {value && <div>{value}</div>}
                {status && <div className={`infoStatus ${status}`}>{capitalize(status)}</div>}
                {statusDesc && <div>{statusDesc}</div>}

                {/*{(satCnr != undefined || satCnr != null)
                    ? {satCnr} : <div>X</div>
                }*/}
                {dataCycle != undefined && dataCycleAvr != undefined &&
                    <div>{`${formattedTime(convertMinutesToTime(dataCycle))} / ${formattedTime(convertMinutesToTime(dataCycleAvr))}`}</div>
                }

                {/*{parseDiff !== undefined && maxPeriod !== undefined &&
                    (<div>
                        <span style={{ color: isDiffGreaterThanPeriod ? 'red' : 'inherit'}}>
                            {`${hours}시간 ${minutes}분 ${seconds}초`}
                        </span>
                        /
                        {maxPeriod}
                    </div>)
                }
                {recentDataCycle!=undefined && avrDataCycle!=undefined &&
                    (<div>
                        {`${dataCollectCycleHours} 시간, ${dataCollectCycleMinutes} 분, ${dataCollectCycleSeconds} 초` / `${avrDataCollecteCycleObj.hours} 시간, ${avrDataCollecteCycleObj.minutes} 분, ${avrDataCollecteCycleObj.seconds} 초`}
                        {`${dataCollectCycleHours} 시간, ${dataCollectCycleMinutes} 분, ${dataCollectCycleSeconds} 초` / `${dataCollectCycleAvrHours} 시간, ${dataCollectCycleAvrMinutes} 분, ${dataCollectCycleAvrSeconds} 초`}
                    </div>)
                }*/}
            </div>
        </Box>
    );


    /** History Alarm Data Form */
    const AlarmBox = ({title, container}) => (
        <Box className="alertInfo">
            <Box className="alertInfoTitle">
                {title}
            </Box>
            <hr/>
            <Box className="alertInfoContain">
                {container}
            </Box>
        </Box>
    )

    /**
     * @desc: {
     *    1) Status 가 변화하여 누적 데이터가 있을 수도
     *    1-1) 누적 데이터가 있다면 데이터 가공 (a. RUNNING->Running / b. 2024-02-22T18:05:00.101->"2024-02-22T18:05:00)
     *    2) Status 가 변하지 않아, 누적 데이터가 없을 수도
     *    2-1) 데이터가 없다고 표시
     *    3) Input Value 조회 조건에 맞지 않아, 데이터는 존재해도 해당 기간 내 없을 수도
     * }
     * */
    /** @type [ {deviceId: string, eventDate: string: eventType: string, snapIndex: int, status: string} ] */
    let updatedStatusHistory = [];

    /** statusHistory -> updatedStatusHistory :  eventDate & status return Value 수정*/
    if (statusHistory && statusHistory.length > 0) {
        updatedStatusHistory = statusHistory.map(item => ({
            ...item,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
            eventDate: new Date(item.eventDate).toISOString().slice(0, 19).replace('T', ' ')
        }));
    } else {
        console.log('해당 단말기에는 statusHistory 가 없어용')
        updatedStatusHistory = '';
    }
    console.log(statusHistory)
    console.log(updatedStatusHistory)


    return(
        <Grid className="deviceInfo_construct" container spacing={0}>
            {/* Image Icon */}
            <Box className="deviceInfo_group">
                <Tooltip title="Account settings" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Avatar sx={{ width: 100, height: 100, fontSize: '30px', color: '#394251', backgroundColor: '#FAFBFC', fontWeight: 'bold', borderStyle: 'solid', borderColor: '#F3F3F3', borderWidth: '5px'}}>
                        {/* 가장 첫 번째 글자 || 현재처럼 이미지 Icon 으로*/}
                    </Avatar>
                    {/* Comment */}
                </Tooltip>
            </Box>

            {/* 소속 */}
            <Box className="deviceInfo_group">
                <div className="deviceGroup_title">
                    {matchingObject.deviceId}
                </div>
                <div className="deviceGroup_subTitle">
                    {matchingObject.crpNm} _ {matchingObject.vhcleNm}
                </div>
            </Box>

            {/* 현재 기본 데이터 */}
            <Box className="deviceInfo_profile">
                <Box className="basicInfoBox">
                    <InfoBox title="상태" status={matchingObject.status} />
                    <InfoBox title="상태 설명" value={matchingObject.statusDesc} />
                    {/*<InfoBox title="마지막 데이터 수집 주기 / 평균 데이터 수집 주기" parseDiff={matchingObject.parseDiff} maxPeriod={matchingObject.maxPeriod} />*/}

                    {/* 위성신호레벨/잡음비 */}
                    {/*<InfoBox title="위성신호레벨/잡음비" satCnr={satCnr} />*/}
                    {/* 데이터 수집 주기 (최근) - 2건 비교 / 데이터 수집 주기 (평균) - 10건 비교 */}
                    <InfoBox title="데이터 수집 주기 (최근) / 데이터 수집 주기 (평균)" dataCycle={deviceInfoData.dataCollectCycle} dataCycleAvr={deviceInfoData.dataCollectCycleAvr}/>
                    {/*<InfoBox title="마지막 데이터 수집 주기" parseDiff={matchingObject.parseDiff} />*/}
                </Box>
            </Box>
            <br/>

            {/* Alarm Box */}
            <Box className="deviceInfo_alarms" >
                <AlarmBox title="Status Change History" container={<StatusAlarm updatedStatusHistory={updatedStatusHistory} statusHistory={statusHistory}/>} />
                {/*<AlarmBox title="Alarm Navigation" container={<RealTimeAlarm />} />*/}
                {/*<AlarmBox title="Network Status Ratio" container={<StatusHistoryPie updatedStatusHistory={updatedStatusHistory} statusHistory={statusHistory}/>} />*/}
                <AlarmBox title="Event Time Line" container={<EventTimeAlarm eventHistoryAlarm={eventHistoryAlarm} />} />
                <AlarmBox title="Map" container={<DeviceHistoryMap nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId} deviceInfoData={deviceInfoData}/>} />
            </Box>
        </Grid>
    )
}

export default DeviceInfo;