import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SeLogin from "./pages/seLogin/SeLogin";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Dashboard from "./pages/dashboard/Dashboard";
import MapPage from "./pages/mapPage/MapPage";
import TablePage from "./pages/tablePage/TablePage"
import SamplePage from "./pages/samplePage/SamplePage";
import BefoNms from "./pages/befoNms/BefoNms";
import Ais from "./pages/ais/Ais";
import Diagnostic from "./pages/diag/Diagnostic";
import Support from "./pages/support/Support";

import {Routes, Route} from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import "./App.css";
import React, { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";

import Orbcomm from "./pages/navbar/orbcomm/Orbcomm";
import Hwajin from "./pages/navbar/hwajin/Hwajin";
import Trawler from "./pages/navbar/Trawler/Trawler";
import Fishing from "./pages/navbar/fishihng/Fishing";
import Hyungmang from "./pages/navbar/hyungmang/Hyungmang";
import Sand from "./pages/navbar/sand/Sand";
import Jea from "./pages/navbar/jea/Jea";
import Tac from "./pages/navbar/tac/Tac";
import Register from "./components/register/Register";

import SnackbarProvider from 'react-simple-snackbar';
import SnackBar from "my-react-snackbar";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function App() {

  // Dark Mode
  const { darkMode } = useContext(DarkModeContext);

  const [open, setOpen] = useState(false);

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

                    <Route path="orbcomm" element={<Orbcomm/>}/>
                    <Route path="hwajin" element={<Hwajin/>}/>
                    <Route path="trawler" element={<Trawler/>}/>
                    <Route path="fishing" element={<Fishing/>}/>
                    <Route path="hyungmang" element={<Hyungmang/>}/>
                    <Route path="sand" element={<Sand/>}/>
                    <Route path="jea" element={<Jea/>}/>
                    <Route path="tac" element={<Tac/>}/>

                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="table" element={<TablePage/>}/>

                    {/* Login */}
                    <Route path="register" element={<Register/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="/login/seLogin" element={<SeLogin/>}/>

                    {/* /users/new */}
                    <Route path="users">
                      <Route index element={<List/>}/>
                      <Route path=":userId" element={<Single/>}/>
                      <Route
                          path="new"
                          element={<New inputs={userInputs} title="Add New User"/>}
                      />
                    </Route>
                    <Route path="sample" element={<SamplePage/>}/>
                    <Route path="map" element={<MapPage/>}/>
                    <Route path="before" element={<BefoNms />}/>
                    <Route path="ais" element={<Ais />}/>
                    <Route path="diagnostic" element={<Diagnostic />} />

                    <Route path="products">
                      <Route index element={<List/>}/>
                      <Route path=":productId" element={<Single/>}/>
                      <Route
                          path="new"
                          element={<New inputs={productInputs} title="Add New Product"/>}
                      />
                    </Route>
                    <Route path="support" element={<Support />} />
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
