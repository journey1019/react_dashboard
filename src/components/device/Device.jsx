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

// DeviceHistory 전달
import HistorySnapShot from "./component/deviceHistory/api/NmsHistorySnapShot.json";
import HistorySnapShotVhc from "./component/deviceHistory/api/NmsHistorySnapShotVhc.json";

/* MUI */
import {Grid, TextField, Button} from "@mui/material";

/* Module */
import ReturnRequest from "../modules/ReturnRequest";


const Device = (props) => {
    console.log(props)

    // Table 에서 Action(row)를 클릭하는 경우
    // (Main(Com) ->) Device(Com) -> DeviceInput(Com)
    const tableSelectDeviceId = props.deviceId || null;
    console.log(tableSelectDeviceId);

    /* Session Storage에 NMSCurrent 가져와서 다시 배열로 불러오기 */
    // Device.jsx -> DeviceInput & DeviceInfo
    const storedData = sessionStorage.getItem('nmsCurrent');
    const sessionNmsCurrent = JSON.parse(storedData);


    /* DeviceInput.jsx 에서 DeviceID, StartDate, EndDate 선택한 값들 (= Table Click Row) */
    // DeviceInput.jsx -> Device.jsx -> All Device Component에게 전달
    const [inputDeviceId, setInputDeviceId] = useState("");
    const [inputStartDate, setInputStartDate] = useState('');
    const [inputEndDate, setInputEndDate] = useState('');

    // DeviceInuput.jsx 에서 deviceId, startDate, endDate 가 바뀔 때마다 모든 컴포넌트에게 전달
    function InputSelectDevice(deviceId, startDate, endDate) {
        setInputDeviceId(deviceId);
        setInputStartDate(startDate);
        setInputEndDate(endDate);
    }


    /* DeviceHistory.jsx 에서 가공한 */
    // Device.jsx -> DeviceHistory.jsx(가공) -> Device.jsx(oneHistory) -> DeviceHistoryMap & DeviceHistoryChart
    // NMS One History Data
    const [nmsOneHistory, setNmsOneHistory] = useState([]);
    function NmsOneHistory(periodData) {
        setNmsOneHistory(periodData);
        console.log('oneHistory 불러오기!!')
    }
    
    
    
    const[keyType, setKeyType] = '2';


    /* API 조회 */
    // NmsCurrent API 조회
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const currentDataParams = {detailMessage: true};
    
    const [nmsCurrent, setNmsCurrent] = useState([]);

    // Dianostic API 조회
    const deviceDiagnosticUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    const deviceDiagnosticParams = {startDate: '2024010100', endDate: '2024120500', keyType: '2', deviceId: inputDeviceId};
    
    // Diagnostic
    const [getDiagnostic, setGetDiagnostic] = useState([]);
    // DeviceDiagnostic
    const [getOneDiagnostic, setGetOneDiagnostic] = useState({});
    
    // History API 조회
    const nmsHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    const nmsHistoryParams = {deviceId: '01680675SKY33EC', startDate: '2023-12-01T00', endData: '2023-12-05T00', detailMessage: true};

    const [nmsHistory, setNmsHistory] = useState([]);

    

    /* DeviceNmsHistory */
    // API 원본 History Data
    




    
    console.log(inputDeviceId)
    console.log(inputStartDate)
    console.log(inputEndDate)
    console.log(getDiagnostic)


    useEffect(() => {
        ReturnRequest(currentDataUrls, currentDataParams).then(result=>{if(result!=null){setNmsCurrent(result);}});
        ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams).then(
            result=>{
                if(result!=null){
                    console.log(result)
                    /* 모든 단말기 배열 */
                    result.map(function(device) {
                        /* 각 단말기 객체 */
                        setGetOneDiagnostic(device);
                        console.log(device)
                    })

                    setGetDiagnostic(result)
                }
            });
        ReturnRequest(nmsHistoryUrl, nmsHistoryParams).then(result=>{if(result!=null){setNmsHistory(result)}})
    }, [props.deviceId, inputStartDate, inputEndDate, keyType]);



    






    console.log(getOneDiagnostic);
    console.log(getDiagnostic);
    console.log(nmsHistory);
    console.log(nmsOneHistory);

    console.log(nmsCurrent)

    console.log(inputDeviceId)
    console.log(inputStartDate)
    console.log(inputEndDate)


    return(
        <>
            <Grid container spacing={1}>

                <Grid item xs={12}>
                    <DeviceInput tableSelectDeviceId={tableSelectDeviceId} sessionNmsCurrent={sessionNmsCurrent} InputSelectDevice={InputSelectDevice}/>
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceInfo inputDeviceId={inputDeviceId} sessionNmsCurrent={sessionNmsCurrent}/>
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceDiagnostic getOneDiagnostic={getOneDiagnostic} inputDeviceId={inputDeviceId}/>
                    <br/><br/>
                </Grid>

                <Grid item xs={6}>
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