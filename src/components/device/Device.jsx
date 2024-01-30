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
import {Grid} from "@mui/material";
import ReturnRequest from "../modules/ReturnRequest";


const Device = (props) => {
    console.log(props)

    const tableSelectDeviceId = props.deviceId || null;
    console.log(tableSelectDeviceId);

    /* Session Storage에 NMSCurrent 가져와서 다시 배열로 불러오기 */
    const storedData = sessionStorage.getItem('nmsCurrent');
    const sessionNmsCurrent = JSON.parse(storedData);
    console.log(sessionNmsCurrent);
    useEffect(() => {

    }, [])




    // Date(Period)
    const now = new Date();
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    //console.log(startDate); // 2023-12-23
    //console.log(startDate); // 2024-01-02

    const[keyType, setKeyType] = '2';


    /* API 조회 */
    // NmsCurrent API 조회
    /* URL & Param */
    const currentDataUrls = "https://iotgwy.commtrace.com/restApi/nms/currentData";
    const currentDataParams = {detailMessage: true};
    const [nmsCurrent, setNmsCurrent] = useState([]);

    // Dianostic API 조회
    const deviceDiagnosticUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    const deviceDiagnosticParams = {startDate: '2023110100', endDate: '2023110500', keyType: '2'};
    // History API 조회
    const nmsHistoryUrl = "https://iotgwy.commtrace.com/restApi/nms/historyData";
    const nmsHistoryParams = {deviceId: '01680675SKY33EC', startDate: '2023-12-01T00', endData: '2023-12-05T00', detailMessage: true};

    // 모든 단말기 정보 데이터
    // 어차피 Main Page에서는 다르게 보여줄거니가 코드 같이 쓰지 않는 이상 없애도 될듯

    /* DeviceDiagnostic */
    const [getDiagnostic, setGetDiagnostic] = useState([]);
    const [getOneDiagnostic, setGetOneDiagnostic] = useState({});

    /* DeviceNmsHistory */
    // API 원본 History Data
    const [nmsHistory, setNmsHistory] = useState([]);




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
    }, [props.deviceId, startDate, endDate, keyType]);



    /* History -> History Chart */
    // NMS One History Data
    const [nmsOneHistory, setNmsOneHistory] = useState([]);
    function NmsOneHistory(periodData) {
        setNmsOneHistory(periodData);
        console.log('oneHistory 불러오기!!')
    }



    console.log(getOneDiagnostic);
    console.log(nmsHistory);
    console.log(nmsOneHistory);

    console.log(nmsCurrent)





    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DeviceInput tableSelectDeviceId={tableSelectDeviceId} sessionNmsCurrent={sessionNmsCurrent}/>
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceInfo />
                    <br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceDiagnostic getOneDiagnostic={getOneDiagnostic} />
                    <br/><br/>
                </Grid>

                <Grid item xs={6}>
                    <DeviceHistoryMap nmsOneHistory={nmsOneHistory}/>
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistory nmsHistory={nmsHistory} HistorySnapShot={HistorySnapShot} HistorySnapShotVhc={HistorySnapShotVhc} NmsOneHistory={NmsOneHistory}/>
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistoryChart nmsOneHistory={nmsOneHistory}/>
                    <br/><br/>
                </Grid>

                {/*<Grid item xs={12}>
                    
                    <br/><br/>
                </Grid>*/}
            </Grid>
        </>
    )
}

export default Device;