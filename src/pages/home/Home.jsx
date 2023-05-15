import BasicNavbar from "../../components/navbar/BasicNavbar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import TextField from '@mui/material/TextField';
import Header from "../../components/navbar/Header";

const Home = () => {
  return (
      <>
      <div className="home">
          <Navbar />
          <div className="homeContainer">
              <h1>NMS Main Home Page</h1>
          </div>
      </div>
      </>
  );
};
export default Home;