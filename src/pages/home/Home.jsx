import BasicNavbar from "../../components/navbar/BasicNavbar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import TextField from '@mui/material/TextField';
import Header from "../../components/navbar/Header";
import DatePicker from "react-datepicker";
import React, { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';



const Home = () => {
    const [startDate, setStartDate] = useState(null);

    return (
      <>
      <div className="home">
          <Navbar />
          <div className="homeContainer">
              <h1>NMS Main Home Page</h1>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
          </div>
      </div>
      </>
  );
};
export default Home;

