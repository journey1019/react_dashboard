/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import './device.scss';
import DeviceInput from "./component/deviceInput/DeviceInput";
import DeviceInfo from "./component/deviceInfo/DeviceInfo";
import DeviceDiagnostic from "./component/deviceDiagnostic/DeviceDiagnostic";
import DeviceHistory from "./component/deviceHistory/DeviceHistory";
import DeviceHistoryChart from "./component/deviceHistoryChart/DeviceHistoryChart";
import DeviceHistoryMap from "./component/deviceHistoryMap/DeviceHistoryMap";

import DeviceMissingLine from "./component/devicemissingLine/DeviceMissingLine";

// DeviceHistory 전달
import HistorySnapShot from "./component/deviceHistory/api/NmsHistorySnapShot.json";
import HistorySnapShotVhc from "./component/deviceHistory/api/NmsHistorySnapShotVhc.json";

/* MUI */
import {Grid, Box, TextField, Button, Typography} from "@mui/material";

/* Module */
import ReturnRequest from "../modules/ReturnRequest";
import UseDidMountEffect from "../modules/UseDidMountEffect";
import deviceDiagnostic from "./component/deviceDiagnostic/DeviceDiagnostic";

/***
 * @Author : jhlee
 * @date : 2024-02-27
 * @file : 단말의 누적 데이터나 세부 데이터를 확인하고 싶은 경우
 * @property: {
 *     tableSelectDeviceId: deviceId or ''
 *         -> Table 에서 선택한 Row 의 deviceId
 * }
 * @Desc : {
 *  각 장비 정보를 볼 수 있는 Device Component
 *  Main Page의 Table 각 Row Action 클릭 시 DrawerDevice Page Component 에 종속
 *  or Device Page 에 종속
 *
 ***API 를 호출하여 데이터 삽입한 모든 useState({})는 렌더링으로 인해 값이 있는지 없는지 판별해주는 것이 필수임
 * }
 */
const Device = (props) => {
    console.log(props)


    /** Variable _ Props */
    // Table(by Main) 에서 선택한 props.deviceId
    const tableSelectDeviceId = props.deviceId || null;

    // Session Storage 에 저장된 NMS Current 값 가져옴
    // All Device 와 Select Device 정보 비교(추후) & DeviceInput(Option-Search&Select) & DeviceInfo
    const storedData = sessionStorage.getItem('nmsCurrent');
    const sessionNmsCurrent = JSON.parse(storedData);


    /** URL */
    // Input & Info
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    // Info
    const deviceStatusHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/getStatusHistory";
    const eventHistoryAlarmUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
    // Diagnostic
    const deviceDiagnosticUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    // Hisotry Date
    const nmsHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/historyData";



    // 호출한 API 를 useState({}) 에 저장
    const [nmsCurrent, setNmsCurrent] = useState([]); // 현재 Session 에 저장한 NMS Current 로 대체
    // Device -> History (API _ /nms/historyData)
    // 전체 누적 데이터 _ 선택한 단말기와 비교하기 위함
    const [nmsHistory, setNmsHistory] = useState([]);
    // Device -> HistoryChart
    // 선택한 단말기 하나에 대한 누적 데이터
    // || History 에서 가공한 데이터 중 선택한 단밀기에 해당하는 누적 데이터
    const [nmsOneHistory, setNmsOneHistory] = useState([]);

    // Device -> Diagnostic (API _ /nms/Diagnostic~)
    // 전체 Diagnostic 데이터 _ 선택한 단말기와 비교하기 위함
    const [getDiagnostic, setGetDiagnostic] = useState([]);
    // Device -> Diagnostic
    // 선택한 단말기 하나에 대한 Diagnostic 의 누적 데이터
    const [oneDiagnostic, setOneDiagnostic] = useState({});


    // Device Status History
    const [statusHistory, setStatusHistory] = useState([]);
    // Device Event History
    const [eventHistoryAlarm, setEventHistoryAlarm] = useState([]);

    // Device One Diagnostic Data
    const [deviceDiagnostic, setDeviceDiagnostic] = useState([]);
    const [oneDeviceDiagnostic, setOneDeviceDiagnostic] = useState([]);
    const [oneDeviceDiagnosticTime, setOneDeviceDiagnosticTime] = useState([]);






    // 1) DeviceInput(DeviceId(=Table Click Row), StartDate, EndDate) 대입
    // Device 를 구성하는 모든 Component 에 전달
    const [inputDeviceId, setInputDeviceId] = useState('');
    const [inputStartDate, setInputStartDate] = useState('');
    const [inputEndDate, setInputEndDate] = useState('');

    /* Inheritance */
    // 1) Input -> ALL
    // 사용자가 설정한 Input Value 를 모든 Component 에 전달
    function InputSelectDevice(deviceId, startDate, endDate) {
        setInputDeviceId(deviceId);
        setInputStartDate(startDate);
        setInputEndDate(endDate);
    }

    // 2) History -> HistoryChart
    // History 에서 가공한 데이터 중 선택한 단밀기에 해당하는 누적 데이터
    function NmsOneHistory(periodData) {
        setNmsOneHistory(periodData);
        //console.log('oneHistory 불러오기!!')
    }



    /* API 호출 _ Module(ReturnRequest) */
    UseDidMountEffect(() => {

        /* Params */
        // Input & Info
        const currentDataParams = {detailMessage: true};
        // History Table
        const nmsHistoryParams = {deviceId: inputDeviceId, startDate: inputStartDate, endData: inputEndDate, detailMessage: true};
        // Info - Status Alarm & Event Alarm
        const deviceStatusHistoryParams = {deviceId: inputDeviceId, startDate : inputStartDate, endDate: inputEndDate};
        const eventHistoryAlarmParams = {startDate: inputStartDate, endDate: inputEndDate, deviceId: inputDeviceId, desc: true};
        // Diagnostic
        const deviceDiagnosticParams = {startDate: '2024-02-04T00', endDate: '2024-03-04T00', keyType: '2'};
        const oneDeviceDiagnosticParams = {startDate: '2024-02-04T00', endDate: '2024-03-04T00', keyType: '2', deviceId : inputDeviceId};
        const oneDeviceDiagnosticTimeParams = {startDate: '2024-02-04T00', endDate: '2024-03-04T00', keyType: '1', deviceId : inputDeviceId};
        console.log(inputDeviceId)


        /*if(inputDeviceId != null) {
            deviceDiagnosticParams['deviceId'] = inputDeviceId;
        }*/

        console.log(nmsHistoryParams)

        // /nms/currentData
        ReturnRequest(currentDataUrls, currentDataParams).then(result=>{if(result!=null){setNmsCurrent(result);}});

        // /nms/diagnosticDetailList
        // deviceDianosticParams 에 DeviceId 가 없으면 돌아가지 않도록
        // getDiagnostic & oneDiagnostic -> 따로 만들기(추후)
        /*ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(
            result=>{
                if(result!=null){
                    console.log(result)

                    if(inputDeviceId != null) {
                        /!* 모든 단말기 배열 *!/
                        result.map(function(device) {
                            console.log(inputDeviceId)
                            console.log(device.deviceId == inputDeviceId ? "yes" : "no")

                            if(device.deviceId == inputDeviceId) {
                                console.log(device)
                                setOneDiagnostic(device);

                                /!* 각 단말기 객체 *!/
                                console.log(device)
                                console.log(device.deviceId)
                            }
                        })
                    }
                    else {
                        setGetDiagnostic(result);
                    }
                }
                else{
                    setOneDiagnostic({});
                }
            });*/
        //ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(allDiag=>{if(allDiag!=null){setGetDiagnostic(allDiag);}});


        // 조회한 단말의 Status 변경 이력이 없을 수 있음 ->
        ReturnRequest(deviceStatusHistoryUrl, deviceStatusHistoryParams).then(status=>{if(status!=null){setStatusHistory(status);}});
        console.log(deviceStatusHistoryParams);

        // DeviceInfo - EventAlarm
        ReturnRequest(eventHistoryAlarmUrl, eventHistoryAlarmParams).then(alarm=>{if(alarm!=null){setEventHistoryAlarm(alarm);}});
        console.log(eventHistoryAlarm);

        // DeviceDiagnostic - about one select Device
        ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(diagList=>{if(diagList!=null){setDeviceDiagnostic(diagList);}});
        ReturnRequest(deviceDiagnosticUrl, oneDeviceDiagnosticParams).then(diagList=>{if(diagList!=null){setOneDeviceDiagnostic(diagList);}});
        ReturnRequest(deviceDiagnosticUrl, oneDeviceDiagnosticTimeParams).then(diagList=>{if(diagList!=null){setOneDeviceDiagnosticTime(diagList);}});

    }, [inputDeviceId, inputStartDate, inputEndDate])

    console.log(inputDeviceId)





    
    /*console.log(inputDeviceId)
    console.log(inputStartDate)
    console.log(inputEndDate)
    console.log(getDiagnostic)*/
    console.log(deviceDiagnostic)
    console.log(statusHistory)
    console.log('Device Page 불러왔어~~~~~~@@@@@@@@@@')






    useEffect(() => {
        console.log(oneDiagnostic)
    }, [oneDiagnostic])


    console.log(tableSelectDeviceId)
    console.log(inputDeviceId)


    /*console.log(oneDiagnostic);
    console.log(getDiagnostic);
    console.log(nmsHistory);
    console.log(nmsOneHistory);

    console.log(nmsCurrent)

    console.log(inputDeviceId)
    console.log(inputStartDate)
    console.log(inputEndDate)*/
    console.log(getDiagnostic)
    console.log(oneDiagnostic)
    console.log(statusHistory)
    console.log(deviceDiagnostic)

    return(
        <>
            <Grid container spacing={1}>

                <Grid item xs={12}>
                    <DeviceInput tableSelectDeviceId={tableSelectDeviceId} sessionNmsCurrent={sessionNmsCurrent} InputSelectDevice={InputSelectDevice}/>
                    <br/>
                </Grid>

                {/*<Grid item xs={12}>
                    <DeviceMissingLine />
                    <br/>
                </Grid>*/}

                <Grid item xs={12}>
                    <DeviceInfo inputDeviceId={inputDeviceId} sessionNmsCurrent={sessionNmsCurrent} statusHistory={statusHistory} eventHistoryAlarm={eventHistoryAlarm}/>
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <Box className="deviceConstruct">
                        <Box className="deviceConstruct_top">
                            <Typography variant="h5" >Diagnostic</Typography>
                        </Box>
                        <hr/>
                        <Box className="deviceConstruct_body">
                            <DeviceDiagnostic getDiagnostic={getDiagnostic} oneDiagnostic={oneDiagnostic} oneDeviceDiagnosticTime={oneDeviceDiagnosticTime} inputDeviceId={inputDeviceId} deviceDiagnostic={deviceDiagnostic} oneDeviceDiagnostic={oneDeviceDiagnostic}/>
                        </Box>
                    </Box>
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <Box className="deviceConstruct">
                        <Box className="deviceConstruct_top">
                            <Typography variant="h5" >Map</Typography>
                        </Box>
                        <hr/>
                        <Box className="deviceConstruct_body">
                            <DeviceHistoryMap nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId} />
                        </Box>
                    </Box>
                    <br/><br/>
                </Grid>

                {/*<Grid item xs={12}>
                    <DeviceHistory nmsHistory={nmsHistory} HistorySnapShot={HistorySnapShot} HistorySnapShotVhc={HistorySnapShotVhc} NmsOneHistory={NmsOneHistory} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>*/}

                {/*<Grid item xs={12}>
                    <DeviceHistoryChart nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>*/}

            </Grid>
        </>
    )
}

export default Device;