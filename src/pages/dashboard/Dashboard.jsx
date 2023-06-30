import React, { useState } from 'react';
import "./dashboard.scss";
import Navbar from "../../components/navbar/Navbar";
import Widgets from "../../components/widget/Widgets";
//import Featured from "../../components/featured/Featured";
//import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
//import TableChart from "../../components/tablechart/TableChart";
//import MapChart from "../../components/map/MapChart";
import Container from '@mui/material/Container';
import OpenSteetMap from "../../components/map/OpenstreetMap";


const Dashboard = () => {
    const[feed] = useState([]);

    const[nmsCurrent, setNmsCurrent] = useState([]);

    const[selectDevice, setSelectDevice] = useState();

    const [diffStatus, setDiffStatus ] = useState({
        running:0,
        caution:0,
        warning:0,
        faulty:0,
    });

    const [statusClickValue, setStatusClickValue] = useState(""); // running

    function MapChange(data) { // Table
        setNmsCurrent(data); // Map
    }
    // location
    function MapClick(deviceId) {
        setSelectDevice(deviceId); // deviceId
    }

    function WidgetCount(info) {
        setDiffStatus(info) //{danger: 30, warning: 2, running: 253}
    }

    // Status Button 클릭시 Filter에 따른 테이블 변화
    function StatusClick(status) {
        setStatusClickValue(status); //running
    }

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
                                <Widgets type="running" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets type="caution" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets type="warning" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                <Widgets type="faulty" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            </div>
                            <div className="map">
                                {/*<BasicMap feed={feed}/>*/}
                                <OpenSteetMap feed={feed} nmsCurrent={nmsCurrent} selectDevice={selectDevice} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                            </div>
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