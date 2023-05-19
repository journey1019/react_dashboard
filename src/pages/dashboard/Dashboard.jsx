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
import BasicMap from "../../components/map/BasicMap";
import Container from '@mui/material/Container';
import MuiNavbar from "../../components/navbar/MuiNavbar";
import Navbar2 from "../../components/navbar/Navbar2";



const Dashboard = () => {
    const[feed, setFeed] = useState([]);

    function MapChange(data) {
        console.log(data);
        //if (data == null || data.length != 0) {
            setFeed(data);
        //}
    }
    function MapClick(deviceId) {
        console.log(deviceId);
    }

    /*const[diffStatus, setDiffStatus] = useState([]);

    function WidgetChange(widget) {
        console.log(widget);
        setDiffStatus(widget);
    }*/


    return (
        <>
            <div className="dashboard">
                <Navbar />
                <Container maxWidth="xl">
                    <div className="dashboardContainer">
                        <div className="widgets">
                            <Widget type="run" />
                            <Widget type="standby" />
                            <Widget type="shutdown" />
                            <Widget type="offline" />
                        </div>
                        <div className="map">
                            {/*<BasicMap feed={feed}/>*/}
                        </div>
                        <div className="table">
                            <Table MapChange={MapChange} MapClick={MapClick}/>
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
        </>
    );
};
export default Dashboard;