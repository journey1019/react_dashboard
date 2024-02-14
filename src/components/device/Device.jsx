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
import {Grid, TextField, Button} from "@mui/material";

/* Module */
import ReturnRequest from "../modules/ReturnRequest";
import UseDidMountEffect from "../modules/UseDidMountEffect";
import deviceDiagnostic from "./component/deviceDiagnostic/DeviceDiagnostic";

/***
 * @Author : jhlee
 * @date : 2024-02-27
 * @Desc : {
 *  각 장비 정보를 볼 수 있는 Device Component
 *  Main Page의 Table 각 Row Action 클릭 시 DrawerDevice Page Component 에 종속
 *  or Device Page 에 종속
 * }
 */
const Device = (props) => {

    /* URL */
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const deviceDiagnosticUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    const nmsHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/historyData";


    /* Param */
    // 대략 한달간 데이터
    const now = new Date();
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -30)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);


    const[keyType, setKeyType] = '2';
    const currentDataParams = {detailMessage: true};
    const historyDataParams = {detailMessage: true};
    const deviceDiagnosticParams = {startDate: startDate + 'T00', endDate: endDate + 'T23', keyType: '2'};


    /* Variable */
    // 각 Component에게 전달한 props 변수
    const [nmsCurrent, setNmsCurrent] = useState([]);
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


    /* Variable _ Props */
    // Table 에서 선택한 Row 의 DeviceId 를 props 로 전달받음
    const tableSelectDeviceId = props.deviceId || null;

    // Session Storage 에 저장된 NMS Current 값 가져옴
    // All Device 와 Select Device 정보 비교(추후) & DeviceInput(Option-Search&Select) & DeviceInfo
    const storedData = sessionStorage.getItem('nmsCurrent');
    const sessionNmsCurrent = JSON.parse(storedData);

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



    UseDidMountEffect(() => {
    }, [inputDeviceId, inputStartDate, inputEndDate])


    /* API 호출 _ Module(ReturnRequest) */
    useEffect(() => {
        if(inputDeviceId != null) {
            deviceDiagnosticParams['deviceId'] = inputDeviceId;
        }

        /* Params */
        const nmsHistoryParams = {deviceId: inputDeviceId, startDate: inputStartDate, endData: inputEndDate, detailMessage: true};


        console.log(nmsHistoryParams)

        // /nms/currentData
        ReturnRequest(currentDataUrls, currentDataParams).then(result=>{if(result!=null){setNmsCurrent(result);}});

        // /nms/diagnosticDetailList
        // deviceDianosticParams 에 DeviceId 가 없으면 돌아가지 않도록
        // getDiagnostic & oneDiagnostic -> 따로 만들기(추후)
        ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(
            result=>{
                if(result!=null){
                    console.log(result)

                    if(inputDeviceId != null) {
                        /* 모든 단말기 배열 */
                        result.map(function(device) {
                            console.log(inputDeviceId)
                            console.log(device.deviceId == inputDeviceId ? "yes" : "no")

                            if(device.deviceId == inputDeviceId) {
                                console.log(device)
                                setOneDiagnostic(device);

                                /* 각 단말기 객체 */
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
            });

        console.log(nmsHistoryParams)
        ReturnRequest(nmsHistoryUrl, nmsHistoryParams).then(result=>{

            if(result!=null){
                console.log(result)
                setNmsHistory(result)
            }
        })

        console.log()
    }, [inputDeviceId, inputStartDate, inputEndDate]);











    
    /*console.log(inputDeviceId)
    console.log(inputStartDate)
    console.log(inputEndDate)
    console.log(getDiagnostic)*/
    console.log('Device Page 불러왔어~~~~~~@@@@@@@@@@')



    /*UseDidMountEffect(() => {
        ReturnRequest(currentDataUrls, currentDataParams).then(result=>{if(result!=null){setNmsCurrent(result);}});
        ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(
            result=>{
                if(result!=null){
                    console.log(result)
                    /!* 모든 단말기 배열 *!/
                    result.map(function(device) {
                        /!* 각 단말기 객체 *!/
                        setOneDiagnostic(device);
                        //console.log(device)
                    })

                    setGetDiagnostic(result)
                }
            });
        ReturnRequest(nmsHistoryUrl, nmsHistoryParams).then(result=>{if(result!=null){setNmsHistory(result)}})

        console.log(getDiagnostic)
        console.log(oneDiagnostic)
    }, [tableSelectDeviceId, inputDeviceId, inputStartDate, inputEndDate]);*/





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
                    <DeviceInfo inputDeviceId={inputDeviceId} sessionNmsCurrent={sessionNmsCurrent}/>
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceDiagnostic oneDiagnostic={oneDiagnostic} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistoryMap nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId} />
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistory nmsHistory={nmsHistory} HistorySnapShot={HistorySnapShot} HistorySnapShotVhc={HistorySnapShotVhc} NmsOneHistory={NmsOneHistory} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistoryChart nmsOneHistory={nmsOneHistory} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>

            </Grid>
        </>
    )
}

export default Device;