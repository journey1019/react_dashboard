import "./dashboard.scss";
import BasicNavbar from "../../components/navbar/BasicNavbar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import History from "../../components/history/History";
import TableChart from "../../components/tablechart/TableChart";
//import MapChart from "../../components/map/MapChart";
import BasicMap from "../../components/map/BasicMap";

const Dashboard = () => {
    return (
        <>
            <div className="dashboard">
                <BasicNavbar />
                <div className="dashboardContainer">
                    <div className="widgets">
                        <Widget type="run" />
                        <Widget type="standby" />
                        <Widget type="shutdown" />
                        <Widget type="offline" />
                    </div>
                    <div className="map">
                        <BasicMap />
                    </div>
                    <div className="table">
                        <Table />
                    </div>
                    <div className="history">
                        <History />
                    </div>
                    <div className="tableChart">
                        <TableChart />
                    </div>
                    <div className="charts">
                        <Featured />
                        <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Dashboard;