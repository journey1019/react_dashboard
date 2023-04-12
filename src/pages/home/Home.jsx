import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import GridData from "../../components/grid/GridData";
import Map from "../../components/map/Map";

const Home = () => {
  return (
      <>
      <div className="home">
        <Navbar />
        <div className="homeContainer">
          <div className="widgets">
            <Widget type="user" />
            <Widget type="order" />
            <Widget type="earning" />
            <Widget type="balance" />
          </div>
          <div className="charts">
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="map">
            <Map />
          </div>
          <div className="gridTable">
            <GridData />
          </div>
        </div>
      </div>
      </>
  );
};
export default Home;