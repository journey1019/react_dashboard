import "./sand.scss"
import BasicNavbar from "../../../components/navbar/BasicNavbar";
import Widget from "../../../components/widget/Widget";
import BasicMap from "../../../components/map/BasicMap";
import Table from "../../../components/table/Table";
import History from "../../../components/history/History";
import TableChart from "../../../components/tablechart/TableChart";
import Featured from "../../../components/featured/Featured";
import Chart from "../../../components/chart/Chart";

const Sand = () => {
    return(
        <>
            <div className="dashboard">
                <BasicNavbar />
                <div className="dashboardContainer">
                    <div className="widgets">
                        <Widget type="user" />
                        <Widget type="order" />
                        <Widget type="earning" />
                        <Widget type="balance" />
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
    )
}
export default Sand;