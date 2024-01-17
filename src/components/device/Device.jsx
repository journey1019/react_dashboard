/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import './device.scss';
import DeviceInput from "./component/deviceInput/DeviceInput";
import DeviceInfo from "./component/deviceInfo/DeviceInfo";
import DeviceDiagnostic from "./component/deviceDiagnostic/DeviceDiagnostic";
import DeviceHistory from "./component/deviceHistory/DeviceHistory";
import DeviceHistoryChart from "./component/deviceHistoryChart/DeviceHistoryChart";

/* MUI */
import {Grid} from "@mui/material";
import ReturnRequest from "../modules/ReturnRequest";


const Device = () => {

    /* Input Value */
    // DeviceId
    const [deviceId, setDeviceId] = useState('');

    // Date(Period)
    const now = new Date();
    const[startDate, setStartDate] = useState(new Date(now.setDate(now.getDate() -10)).toISOString().split('T')[0]); // 10일 전
    const[endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    console.log(startDate); // 2023-12-23
    console.log(startDate); // 2024-01-02

    const[keyType, setKeyType] = '2';


    /* Dianostic API 조회 */
    const deviceDiagnosticUrl = "https://iotgwy.commtrace.com/restApi/nms/getDiagnosticDetailList";
    const deviceDiagnosticParams = {startDate: '2023110100', endDate: '2023111000', keyType: '2'};

    // 모든 단말기 정보 데이터
    // 어차피 Main Page에서는 다르게 보여줄거니가 코드 같이 쓰지 않는 이상 없애도 될듯
    const [getDiagnostic, setGetDiagnostic] = useState([]);
    const [getOneDiagnostic, setGetOneDiagnostic] = useState({});

    /*useEffect(() => {
        ReturnRequest(deviceDiagnosticUrl, deviceDiagnosticParams, null).then(result=>{if(result!=null){setGetDiagnostic(result)}})
    }, [startDate, endDate, keyType])*/
    useEffect(() => {
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
            })
    }, [startDate, endDate, keyType]);

    console.log(getDiagnostic);
    console.log(getOneDiagnostic);

    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DeviceInput />
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

                <Grid item xs={12}>
                    <DeviceHistory />
                    <br/><br/>
                </Grid>

                <Grid item xs={12}>
                    <DeviceHistoryChart />
                    <br/><br/>
                </Grid>
            </Grid>
        </>
    )
}

export default Device;