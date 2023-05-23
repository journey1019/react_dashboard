// 통과안됨_ 정상_ 수정필요
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import "./dashboard.scss";
import BasicNavbar from "../../components/navbar/BasicNavbar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
//import History from "../../components/history/History";
//import TableChart from "../../components/tablechart/TableChart";
//import MapChart from "../../components/map/MapChart";
//import BasicMap from "../../components/map/BasicMap";
import Container from '@mui/material/Container';
import MuiNavbar from "../../components/navbar/MuiNavbar";
import Navbar2 from "../../components/navbar/Navbar2";

import BasicMap from "../../components/map/OpenstreetMap";
import OpenSteetMap from "../../components/map/OpenstreetMap";



const Dashboard = () => {
    const[feed, setFeed] = useState([]);

    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[selectDevice, setSelectDevice] = useState();

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        warning:0,
        danger:0,
        dead:0,
    });

    const [clickCount, setClickCount] = useState({});

    // Map - locationData(DeviceId, latitude, logitude)
    function MapChange(data) {
        console.log(data);
        //if (data == null || data.length != 0) {
        setNmsCurrent(data);
        //setFeed(data);
        //}
    }
    // location
    function MapClick(deviceId) {
        console.log(deviceId);
        setSelectDevice(deviceId);
    }

    function WidgetCount(info) {
        console.log(info) //{danger: 30, warning: 2, running: 253}
        setDiffStatus(info)
    }

    /*function WidgetCount(info) {
        console.log(info);
            setDiffStatus(info);
    }*/
    /*function WidgetClick(deviceId) {
        console.log(deviceId);
    }*/

    return (
        <>
            <div className="dashboard">
                <div className = "navbar">
                    <Navbar />
                </div>
                <div className="contain">
                    <Container maxWidth="xl">
                        <div className="dashboardContainer">
                            <div className="widgets">
                                <Widget data="running" diffStatus={diffStatus} />
                                <Widget data="warning" diffStatus={diffStatus} />
                                <Widget data="danger" diffStatus={diffStatus} />
                                <Widget data="dead" diffStatus={diffStatus} />
                            </div>
                            <div className="map">
                                {/*<BasicMap feed={feed}/>*/}
                                <OpenSteetMap feed={feed} nmsCurrent={nmsCurrent} selectDevice={selectDevice} />
                            </div>
                            <div className="table">
                                <Table MapChange={MapChange} MapClick={MapClick} WidgetCount={WidgetCount} />
                            </div>
                            {/*<div className="history">
                            <History />
                        </div>*/}
                            <div className="tableChart">
                                {/*<TableChart />*/}
                            </div>
                            <div className="charts">
                                {/*<Featured />
                            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />*/}
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    );
};
export default Dashboard;