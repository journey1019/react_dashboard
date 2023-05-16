import BasicNavbar from "../../components/navbar/BasicNavbar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import React, { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';



const Home = () => {
    const [startDate, setStartDate] = useState(null);

    return (
      <>
      <div className="home">
          <Navbar />
          <div className="homeContainer">
              <h1>NMS Hompage</h1>
          </div>
      </div>
      </>
  );
};
export default Home;

