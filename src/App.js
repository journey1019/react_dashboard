import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SeLogin from "./pages/seLogin/SeLogin";
import Main from "./pages/main/Main";
/*import MainNavbar from "./pages/main/MainNavbar";*/
import Dashboard from "./pages/dashboard/Dashboard";
import MapPage from "./pages/mapPage/MapPage";
import BefoNms from "./pages/befoNms/BefoNms";
import Ais from "./pages/ais/Ais";
import GES from "./pages/ges/GES";
import Satellite from "./pages/satellite/Satellite";
import Diagnostic from "./pages/diag/Diagnostic";
import Support from "./pages/support/Support";
import AdminManage from "./pages/adminManage/AdminManage";


import DetailDevice from './pages/detailDevice/DetailDevice';
import Detail from "./components/detail/Detail";

import {Routes, Route} from "react-router-dom";

import "./style/dark.scss";
import "./App.css";
import React, { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";

import Register from "./components/register/Register";

import SnackbarProvider from 'react-simple-snackbar';
import SnackBar from "my-react-snackbar";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ExamplePage from "./pages/examplePage/ExamplePage"
import MainPage from "./pages/MainPage/MainPage";

function App() {

  // Dark Mode
  const { darkMode } = useContext(DarkModeContext);

  /* localStorage 로 쿠키 저장 하고 있으면 로그인 되어있는 상태로 */

  //session이 없을 시, login
  if(sessionStorage.getItem("userInfo") == null) {
    return <Login />
  }
  //session에 저장값이 있을 때
  else {
    const sessionInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // UNIX timestamp (long형태)
    const currentDate = Date.now(); // - KST_string
    const expireDate = new Date(sessionInfo.authExpired+"+00:00");
    //console.log(currentDate>expireDate);

    //만료시간 지났을 때
    if(currentDate > expireDate){
      return <Login />
    }else{

      return (
          <SnackbarProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className={darkMode ? "app dark" : "app"}>

                {/*<ToastContainer theme='colored'></ToastContainer>*/}
                <Routes>
                  <Route path="/">
                    <Route index element={<Home/>}/>

                    <Route path="home" element={<Home/>}/>



                    {/* Page _ 큰 페이지 단위 */}
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="main" element={<Main/>}/>
                    <Route path="diagnostic" element={<Diagnostic/>}/>
                    <Route path="managed" element={<AdminManage/>}/>




                    {/* Login */}
                    <Route path="register" element={<Register/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="/login/seLogin" element={<SeLogin/>}/>


                    {/* SideBar */}
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="main" element={<Main/>}/>

                    <Route path="device" element={<DetailDevice/>}/>
                    <Route path="diagnostic" element={<Diagnostic/>}/>
                    <Route path="before" element={<BefoNms />}/>
                    <Route path="ais" element={<Ais />}/>
                    <Route path="ges" element={<GES />} />
                    <Route path="satellite" element={<Satellite />} />
                    <Route path="support" element={<Support />} />
                    <Route path="admin" element={<AdminManage />} />

                    {/* /device/deviceId */}
                    <Route path="device">
                      <Route index element={<DetailDevice />} />
                      <Route path=":deviceId" element={<Detail />} />
                    </Route>
                    <Route path="map" element={<MapPage/>}/>
                    <Route path="diagnostic" element={<Diagnostic />} />

                    <Route path="example" element={<ExamplePage />}/>
                    <Route path="mainPage" element={<MainPage />}/>


                  </Route>
                </Routes>
              </div>
            </LocalizationProvider>
          </ SnackbarProvider>
      );
    }
  }
}

export default App;
