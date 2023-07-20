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
import { Grid, Button, darken } from "@mui/material";

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
                    <Container maxWidth="false">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Today's Status</span><br />
                                        <span className="widgetContext">status according to message reception time</span>
                                    </div>

                                    <div className="widgetContain">
                                        <Widgets className="widget" type="running" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="caution" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="warning" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="faulty" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Today's Status</span><br />
                                        <span className="widgetContext">status according to message reception time</span>
                                    </div>

                                    <div className="widgetContain">
                                        <Widgets className="widget" type="running" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="caution" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="warning" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                        <Widgets className="widget" type="faulty" diffStatus={diffStatus} StatusClick={StatusClick} statusClickValue={statusClickValue}/>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>



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
                    </Container>
                </div>
            </div>
        </>
    );
};
export default Dashboard;