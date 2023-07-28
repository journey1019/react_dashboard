import React, { useState, useEffect } from 'react';
import "./dashboard.scss";
import Navbar from "../../components/navbar/Navbar";
import Widgets from "../../components/widget/Widgets";
//import Featured from "../../components/featured/Featured";
//import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
//import TableChart from "../../components/tablechart/TableChart";
//import MapChart from "../../components/map/MapChart";
import BeforeTable from "../../components/beforeTable/BeforeTable";
import OpenSteetMap from "../../components/map/OpenstreetMap";

import Container from '@mui/material/Container';
import { Grid, Button, darken } from "@mui/material";

import { withSnackbar, useSnackbar } from 'react-simple-snackbar';


import SnackBar from 'my-react-snackbar';

const Dashboard = () => {
    const[feed] = useState([]);

    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[selectDevice, setSelectDevice] = useState();

    // Present Status Device Info
    const [deviceStatus, setDeviceStatus] = useState({
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    });

    const [statusClickValue, setStatusClickValue] = useState(""); // running

    // Past Status Device Info
    const [befoDeviceStatus, setBefoDeviceStatus] = useState ({
        pastRunningDv: [],
        pastCautionDv: [],
        pastWarningDv: [],
        pastFaultyDv: [],
    });

    function MapChange(data) { // Table
        setNmsCurrent(data); // Map
    }
    // location
    function MapClick(deviceId) {
        setSelectDevice(deviceId); // deviceId
    }

    function WidgetCount(info) {
        setDeviceStatus(info) //{danger: 30, warning: 2, running: 253}
    }

    function BefoWidgetCount(befo) {
        setBefoDeviceStatus(befo)
    }

    // Status Button 클릭시 Filter에 따른 테이블 변화
    function StatusClick(status) {
        setStatusClickValue(status); //running
    }


    const [openSnackbar, closeSnackbar] = useSnackbar()
    // diffStatus _ 각 object 값이 10(*1,2,3,...)을 넘기면 Alert 한번
    function handleOpenSnackbar() {
        openSnackbar('faulty 값이'+ '60' +'을 초과하였습니다.');
        /*if(diffStatus > 10) {
        }*/
    }

    const [open, setOpen] = useState(false);

    /* ---------------- Status Yesterday Remember ----------------*/
    //console.log(diffStatus);
    // diffStatus를 저장 후 바뀔 때 마다 localStorage에 저장(시간 기준x -> useEffect로 바꼈을 때를 기준으로 설정)

    // localStorage에 diffStatus 저장함
    /*useEffect(() => {
        localStorage.setItem('dataKey', JSON.stringify(diffStatus));
    }, [diffStatus]);*/


    // 만료시간과 함께 데이터를 저장
    function setItemWithExpireTime(keyName, keyValue, tts) {
        // localStorage에 저장할 객체
        const yeDayStatus = {
            value : keyValue,
            expire : Date.now() + tts
        }
        // 객체를 JSON 문자열로 변환
        const yeDayStatusString = JSON.stringify(yeDayStatus);

        // setItem
        window.localStorage.setItem(keyName, yeDayStatusString);
    }

    // 만료 시간을 체크하며 데이터 읽기
    function getItemWithExpireTime(keyName) {
        // localStorage 값 읽기 (문자열)
        const yeDayStatusString = window.localStorage.getItem(keyName);

        // null 체크
        if(!yeDayStatusString) {
            return null;
        }

        // 문자열을 객체로 변환
        const yeDayStatus = JSON.parse(yeDayStatusString);

        // 현재 시간과 localStorage의 expire 시간 비교
        if(Date.now() > yeDayStatus.expire) {
            // 만료시간이 지난 item 삭제
            window.localStorage.removeItem(keyName);

            // null 리턴
            return null;
        }

        // 만료기간이 남아있는 경우, value 값 리턴
        return yeDayStatus.value;
    }

    /*const SnackAlert = wrapComponent(function({ createSnackbar }) {
        function showSnackbar() {
            createSnackbar({
                message: 'Hello Snackbar!',
                dismissable: true,
                pauseOnHover: true,
                progressBar: false,
                sticky: true,
                theme: 'warning',
                timeout: 3000
            })
        }
    })*/
    /*useEffect(() => {
        function SnackShow() {
            if((diffStatus.faulty/10) == 0) {
                console.log('faulty의 개수가' + diffStatus.faulty + '가 되었습니다.')
            }
        }
        return SnackShow();
    }, [diffStatus])

    console.log(diffStatus);

    if((diffStatus.faulty/10) == 0) {
        console.log('faulty의 개수가' + diffStatus.faulty + '가 되었습니다.')
    }*/
    /*if(diffStatus.faulty>=70) {
        console.log(diffStatus.faulty);
    }
    function snackShow() {
        if(diffStatus.faulty >= 7 )
    }

    function SnackShow() {
        if((Math.ceil(diffStatus.faulty/10) * 10) == 0){

        }
    }
    function SnackShow() {
        if(diffStatus.faulty){

        }
    }*/

    return (
        <>
            <div className="dashboard">
                <div className = "navbar">
                    <Navbar />
                </div>

                <div className="contain">
                    <Container maxWidth="false">
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Today's Status</span><br />
                                        <span className="widgetContext">status according to message reception time</span>
                                    </div>

                                    <div className="widgetContain">
                                        <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="caution" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="warning" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="faulty" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={4}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Problematic Device</span><br />
                                        <span className="widgetContext">Devices that require inspection</span>
                                    </div>

                                    <div className="widgetContain">
                                        <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="caution" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        {/*<Widgets className="widget" type="warning" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="faulty" StatusClick={StatusClick} statusClickValue={statusClickValue}/>*/}
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        {/*<div className="widgets">
                            <div className="widgetText">
                                <span className="widgetTitle">Today's Status</span><br />
                                <span className="widgetContext">status according to message reception time</span>
                            </div>

                            <div className="widgetContain">
                                <Widgets className="widget" type="running" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets className="widget" type="caution" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets className="widget" type="warning" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets className="widget" type="faulty" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            </div>
                        </div>
                        <div className="widgets">
                            <div className="widgetText">
                                <span className="widgetTitle">Today's Status</span><br />
                                <span className="widgetContext">status according to message reception time</span>
                            </div>


                            <div className="widgetContain">
                                <Widgets className="widget" type="running" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets className="widget" type="caution" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets className="widget" type="warning" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets className="widget" type="faulty" StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            </div>
                        </div>*/}


                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <div className="befoNmsChart">
                                    <BeforeTable deviceStatus={deviceStatus} BefoWidgetCount={BefoWidgetCount}/>
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <div className="map">
                                    {/*<BasicMap feed={feed}/>*/}
                                    <OpenSteetMap feed={feed} nmsCurrent={nmsCurrent} selectDevice={selectDevice} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                </div>
                            </Grid>
                        </Grid>

                        <div className="table">
                            <Table MapChange={MapChange} MapClick={MapClick} WidgetCount={WidgetCount} statusClickValue={statusClickValue}/>
                        </div>
                        {/*<div className="history">
                            <History />
                        </div>*/}
                        <div className="tableChart">
                            {/*<TableChart />*/}
                        </div>
                        <div className="charts">
                            {/*<Featurtled />
                            <Chart tie="Last 6 Months (Revenue)" aspect={2 / 1} />*/}
                        </div>

                        <Button onClick={() => openSnackbar('This is the content of the Snackbar')}>
                            Click me to open the Snackbar!
                        </Button>
                        <Button onClick={closeSnackbar}>
                            Click me to close the Snackbar programmatically!
                        </Button>


                    </Container>
                </div>
            </div>
        </>
    );
};
export default Dashboard;