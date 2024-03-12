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
import DeviceNmsHistory from "./component/deviceNmsHistory/DeviceNmsHistory";

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
 * @author : jhlee
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

    /** URL */
    // Info
    const deviceInfoUrl = "https://iotgwy.commtrace.com/restApi/common/deviceInfo";
    const deviceInfoSatCnrUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnostic";
    const deviceStatusHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/getStatusHistory";
    const eventHistoryAlarmUrl = "https://iotgwy.commtrace.com/restApi/nms/alarmHistory";
    // Diagnostic
    const deviceDiagnosticUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    // Hisotry Date
    const nmsHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    // Device Recent Data
    const deviceRecentUrl = "https://iotgwy.commtrace.com/restApi/nms/deviceDetail";



    /** Variant */
    // Table.jsx(Main.jsx) 에서 선택한 deviceId
    const tableSelectDeviceId = props.deviceId || null;

    // 세션에 저장된 NMS Current 가져옴
    // 전체 단말 정보 중 선택 단말 정보 활용
    // DeviceInput(Option-Search&Select) & DeviceInfo & DeviceMap(현재 위치)
    const storedData = sessionStorage.getItem('nmsCurrent');
    const sessionNmsCurrent = JSON.parse(storedData);

    const userInfo = sessionStorage.getItem('userInfo');
    const sessionUserInfo = JSON.parse(userInfo);

    console.log(storedData)
    console.log(sessionNmsCurrent)
    console.log(userInfo)
    console.log(sessionUserInfo)

    /** API - useState 저장 */

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
    const [oneDeviceDiagnosticTime, setOneDeviceDiagnosticTime] = useState([]); // 시간별 위성 잡음비 차트

    // Device -> History (API _ /nms/historyData)
    // 전체 누적 데이터 _ 선택한 단말기와 비교하기 위함
    const [nmsHistory, setNmsHistory] = useState([]);

    // Device -> Info
    const [deviceInfoData, setDeviceInfoData] = useState({}); // DeviceInfo 데이터 수집주기
    // Diagnostic Data 없는 데이터 기준 추출
    // Diagnostic Data 있는 데이터는 또 다른 곳으로 가져와야 함 -> 사용 X
    const [deviceInfoSatCnr, setDeviceInfoSatCnr] = useState([]); // DeviceInfo 위성신호레벨

    // Device Recent Data
    const [deviceRecentData, setDeviceRecentData] = useState([]);



    // 1) DeviceInput(DeviceId(=Table Click Row), StartDate, EndDate) 대입
    // Device 를 구성하는 모든 Component 에 전달
    const [inputDeviceId, setInputDeviceId] = useState('');
    const [inputStartDate, setInputStartDate] = useState('');
    const [inputEndDate, setInputEndDate] = useState('');


    /* Inheritance */
    // 1) DeviceInput.jsx -> All Device Component
    // 사용자가 설정한 Input Value 를 모든 Component 에 전달
    function InputSelectDevice(deviceId, formattedStartDate, formattedEndDate) {
        setInputDeviceId(deviceId);
        setInputStartDate(formattedStartDate);
        setInputEndDate(formattedEndDate);
    }

    // 2) History -> HistoryChart
    // History 에서 가공한 데이터 중 선택한 단밀기에 해당하는 누적 데이터
    function NmsOneHistory(periodData) {
        setNmsOneHistory(periodData);
        //console.log('oneHistory 불러오기!!')
    }

    /*console.log(inputDeviceId)
    console.log(inputStartDate) //2024-02-07T04:10:46
    console.log(inputEndDate) //2024-03-08T04:10:46*/


    /* API 호출 _ Module(ReturnRequest) */
    UseDidMountEffect(() => {

        /* Params */
        // Info - Status Alarm & Event Alarm
        const deviceInfoParams = {deviceId: inputDeviceId};
        const deviceInfoSatCnrParams = {deviceIn: inputDeviceId, setDate: inputEndDate.substr(0, 10)} // YYYY-MM-DD
        const deviceStatusHistoryParams = {deviceId: inputDeviceId, startDate : inputStartDate, endDate: inputEndDate};
        const eventHistoryAlarmParams = {startDate: inputStartDate, endDate: inputEndDate, deviceId: inputDeviceId, desc: true};
        // Diagnostic
        const deviceDiagnosticParams = {startDate: inputStartDate.substr(0, 13), endDate: inputEndDate.substr(0, 13), keyType: '2'};
        const oneDeviceDiagnosticParams = {startDate: inputStartDate.substr(0, 13), endDate: inputEndDate.substr(0, 13), keyType: '2', deviceId : inputDeviceId};
        const oneDeviceDiagnosticTimeParams = {startDate: inputStartDate.substr(0, 13), endDate: inputEndDate.substr(0, 13), keyType: '1', deviceId : inputDeviceId};
        // History Table
        const nmsHistoryParams = {deviceId: inputDeviceId, startDate: inputStartDate, endData: inputEndDate, detailMessage: true};
        // Device Recent Data
        const deviceRecentParams = {deviceId: inputDeviceId};



        /*if(inputDeviceId != null) {
            deviceDiagnosticParams['deviceId'] = inputDeviceId;
        }*/


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
        ReturnRequest(deviceStatusHistoryUrl, deviceStatusHistoryParams).then(status=>{
            //console.log(status)
            if(status!=null){
                setStatusHistory(status);
            }
        });
        //console.log(deviceStatusHistoryParams);

        // DeviceInfo - Info
        ReturnRequest(deviceInfoUrl, deviceInfoParams).then(info=>{if(info!=null){setDeviceInfoData(info);}});
        ReturnRequest(deviceInfoSatCnrUrl, deviceInfoSatCnrParams).then(infoDiag=>{if(infoDiag!=null){setDeviceInfoSatCnr(infoDiag);}});
        // DeviceInfo - EventAlarm
        ReturnRequest(eventHistoryAlarmUrl, eventHistoryAlarmParams).then(alarm=>{if(alarm!=null){setEventHistoryAlarm(alarm);}});
        //console.log(eventHistoryAlarm);

        // DeviceDiagnostic - about one select Device
        ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(diagList=>{if(diagList!=null){setDeviceDiagnostic(diagList);}});
        ReturnRequest(deviceDiagnosticUrl, oneDeviceDiagnosticParams).then(diagList=>{if(diagList!=null){setOneDeviceDiagnostic(diagList);}});
        ReturnRequest(deviceDiagnosticUrl, oneDeviceDiagnosticTimeParams).then(diagList=>{if(diagList!=null){setOneDeviceDiagnosticTime(diagList);}});

        // NMS History Data
        ReturnRequest(nmsHistoryUrl, nmsHistoryParams).then(historyData=>{if(historyData!=null){setNmsHistory(historyData);}});

        ReturnRequest(deviceRecentUrl, deviceRecentParams).then(detail=>{if(detail!=null){setDeviceRecentData(detail);}});

    }, [inputDeviceId, inputStartDate, inputEndDate])

    return(
        <>
            <Grid container spacing={1} sx={{ backgroundColor: '#FAFBFC' }}>

                <Grid item xs={12}>
                    <DeviceInput tableSelectDeviceId={tableSelectDeviceId} sessionNmsCurrent={sessionNmsCurrent} InputSelectDevice={InputSelectDevice}/>
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceInfo inputDeviceId={inputDeviceId} sessionNmsCurrent={sessionNmsCurrent} deviceInfoData={deviceInfoData} deviceRecentData={deviceRecentData} statusHistory={statusHistory} eventHistoryAlarm={eventHistoryAlarm}/>
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
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <Box className="deviceConstruct">
                        <Box className="deviceConstruct_top">
                            <Typography variant="h5" >Map</Typography>
                        </Box>
                        <hr/>
                        <Box className="deviceConstruct_body">
                            <DeviceHistoryMap nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId} deviceInfoData={deviceInfoData}/>
                        </Box>
                    </Box>
                    <br/>
                </Grid>

                {/*<Grid item xs={12}>
                    <DeviceHistory nmsHistory={nmsHistory} HistorySnapShot={HistorySnapShot} HistorySnapShotVhc={HistorySnapShotVhc} NmsOneHistory={NmsOneHistory} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>*/}

                <Grid item xs={12}>
                    <Box className="deviceConstruct">
                        <Typography variant="h5" >History Table</Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{color: 'gray'}}>{nmsHistory && nmsHistory.accessId && nmsHistory.vhcleNm ? `[${nmsHistory.accessId}] - [${nmsHistory.vhcleNm}]` : 'No Data'} </Typography>
                        <hr/>
                        <Box className="deviceConstruct_body">
                            <DeviceNmsHistory nmsHistory={nmsHistory} />
                        </Box>
                    </Box>
                    <br/>
                </Grid>

                {/*<Grid item xs={12}>
                    <DeviceHistoryChart nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>*/}

            </Grid>
        </>
    )
}

export default Device;