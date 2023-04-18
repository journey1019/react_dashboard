import "./dashboard.scss";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Grid from "../../components/grid/Grid";
import History from "../../components/history/History";
import TableChart from "../../components/tablechart/TableChart";
import MapChart from "../../components/map/MapChart";

const Dashboard = () => {
    return (
        <>
            <div className="dashboard">
                <Navbar />
                <div className="dashboardContainer">
                    <div className="widgets">
                        <Widget type="user" />
                        <Widget type="order" />
                        <Widget type="earning" />
                        <Widget type="balance" />
                    </div>
                    <div className="map">
                        <MapChart />
                    </div>
                    <div className="gridTable">
                        <Grid />
                    </div>
                    <div className="gridTable">
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