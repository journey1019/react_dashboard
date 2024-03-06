/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./deviceInfo.scss";
import StatusAlarm from "./alarmType/StatusAlarm";
import StatusHistoryPie from "./alarmType/StatusHistoryPie";
import RealTimeAlarm from "./alarmType/RealTimeAlarm";
import EventTimeAlarm from "./alarmType/EventTimeAlarm";

/* Module */
import UseDidMountEffect from "../../../modules/UseDidMountEffect";

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
// Device.jsx 의 자식 컴포넌트
// InputDeviceId & SessionNmsCurrent 상속받아서 단말기 기본정보 Show
const DeviceInfo = (props) => {
    const { inputDeviceId, sessionNmsCurrent, statusHistory, eventHistoryAlarm, ...otherProps } = props;

    /**
     * @desc : {
     *     사용자가 Table 에서 Row 를 Click 하거나, 직접 Select 에서 선택한다면 해당 단말을 Session 에 저장된 device 에 매칭시켜 Obj 저장할 수 있음
     *     But, 사용자가 선택하지 않고 DevicePage 에만 접속한 경우 선택된 단말이 없지만, 해당 틀은 유지해야되기에 null 값으로 지정함
     * }
     * */
    const matchingObject = inputDeviceId && sessionNmsCurrent
        ? sessionNmsCurrent.find(obj => obj.deviceId === inputDeviceId) || ''
        : '';

    // 첫 번째 글자를 대문자로 변환하는 함수 - Status
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 초 -> '시간 분 초' 로 변환하는 함수 - ParseDiff
    function formatTime(seconds) {
        let hours = parseInt(seconds/3600);
        let minutes = parseInt((seconds%3600)/60);
        let remainingSeconds = seconds%60;
        return { hours, minutes, seconds: remainingSeconds };
    }
    // 시간, 분, 초로 변환
    const { hours, minutes, seconds } = formatTime(matchingObject.parseDiff);
    //console.log(`${hours}시간 ${minutes}분 ${seconds}초`);

    // 마지막 데이터 수집 시간 > 데이터 수집 주기 - 조건부여
    const isDiffGreaterThanPeriod = matchingObject.parseDiff > matchingObject.maxPeriod;

    // Info Box
    const InfoBox = ({ title, value, status, statusDesc, parseDiff, maxPeriod }) => (
        <Box className="description" >
            <div className="descriptionName">{title}</div>
            <hr/>
            <div className="descriptionContain">
                {/* value 가 존재할 때만 <div>~</div> 렌더링 | value 가 null or undefined 이면 렌더링 X*/}
                {value && <div>{value}</div>}
                {status && <div className={`infoStatus ${status}`}>{capitalize(status)}</div>}
                {statusDesc && <div>{statusDesc}</div>}
                {parseDiff !== undefined && maxPeriod !== undefined &&
                    (<div>
                        <span style={{ color: isDiffGreaterThanPeriod ? 'red' : 'inherit'}}>
                            {`${hours}시간 ${minutes}분 ${seconds}초`}
                        </span>
                        /
                        {maxPeriod}
                    </div>)
                }
            </div>
        </Box>
    );

    // History Alarm Data Form
    const AlarmBox = ({title, container}) => (
        <Box className="alertInfo">
            <Box className="alertInfoTitle">
                {title}
            </Box>
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
     * }
     * StatusAlarm.jsx & StatusHistoryPie 에 전달
     * 중복되니까
     * */
    let updatedStatusHistory = [];

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
        <Grid className="input" container spacing={0}>
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
            <Box className="deviceInfo_profile" sx={{display: 'flex', width: 1}}>
                <Box className="basicInfoBox">
                    <InfoBox title="상태" status={matchingObject.status} />
                    <InfoBox title="상태 설명" value={matchingObject.statusDesc} />
                    <InfoBox title="위성신호레벨 / 평균신호레벨" value="43.6 / 43.8" />
                    <InfoBox title="마지막 데이터 수집 주기 / 평균 데이터 수집 주기" parseDiff={matchingObject.parseDiff} maxPeriod={matchingObject.maxPeriod} />
                    {/*<InfoBox title="마지막 데이터 수집 주기" parseDiff={matchingObject.parseDiff} />*/}
                </Box>
            </Box>
            <br/>

            {/* Alarm Box */}
            <Box className="deviceInfo_alarms" >
                <AlarmBox title="Status Change History" container={<StatusAlarm updatedStatusHistory={updatedStatusHistory} statusHistory={statusHistory}/>} />
                {/*<AlarmBox title="Alarm Navigation" container={<RealTimeAlarm />} />*/}
                <AlarmBox title="Network Status Ratio" container={<StatusHistoryPie statusHistory={statusHistory}/>} />
                <AlarmBox title="Event Time Line" container={<EventTimeAlarm eventHistoryAlarm={eventHistoryAlarm} />} />
            </Box>
        </Grid>
    )
}

export default DeviceInfo;