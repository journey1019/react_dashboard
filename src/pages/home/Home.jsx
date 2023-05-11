import BasicNavbar from "../../components/navbar/BasicNavbar";
import "./home.scss";
import TextField from '@mui/material/TextField';
import Header from "../../components/navbar/Header";

const Home = () => {
  return (
      <>
      <div className="home">
          <BasicNavbar />
          <div className="homeContainer">
          <h1>NMS Main Home Page</h1>
            <div className="login">
                <TextField id="outlined-basic" label="Outlined" variant="outlined"  />
            </div>
        </div>
      </div>
      </>
  );
};
export default Home;