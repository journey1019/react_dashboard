import BasicNavbar from "../../components/navbar/BasicNavbar";
import "./home.scss";


const Home = () => {
  return (
      <>
      <div className="home">
        <BasicNavbar />
        <div className="homeContainer">
          <h1>NMS Main Home Page</h1>
            <div className="login">
                <h1></h1>
            </div>
        </div>
      </div>
      </>
  );
};
export default Home;