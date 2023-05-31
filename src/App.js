import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Dashboard from "./pages/dashboard/Dashboard";
import MapPage from "./pages/mapPage/MapPage";
import TablePage from "./pages/tablePage/TablePage"
import SamplePage from "./pages/samplePage/SamplePage";
import {Routes, Route, Link} from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import "./App.css";
import React, { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";

import Orbcomm from "./pages/navbar/orbcomm/Orbcomm";
import Hwajin from "./pages/navbar/hwajin/Hwajin";
import Trawler from "./pages/navbar/Trawler/Trawler";
import Fishing from "./pages/navbar/fishihng/Fishing";
import Hyungmang from "./pages/navbar/hyungmang/Hyungmang";
import Sand from "./pages/navbar/sand/Sand";
import Jea from "./pages/navbar/jea/Jea";
import Tac from "./pages/navbar/tac/Tac";


function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
      <div className={darkMode ? "app dark" : "app"}>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />

            <Route path="orbcomm" element={<Orbcomm />} />
            <Route path="hwajin" element={<Hwajin />} />
            <Route path="trawler" element={<Trawler />} />
            <Route path="fishing" element={<Fishing />} />
            <Route path="hyungmang" element={<Hyungmang />} />
            <Route path="sand" element={<Sand />} />
            <Route path="jea" element={<Jea />} />
            <Route path="tac" element={<Tac />} />


            <Route path="dashboard" element={<Dashboard />} />
            <Route path="table" element={<TablePage />} />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
              <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="sample" element={<SamplePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="products">
              <Route index element={<List />} />
              <Route path=":productId" element={<Single />} />
              <Route
                  path="new"
                  element={<New inputs={productInputs} title="Add New Product" />}
              />
            </Route>
          </Route>
        </Routes>
      </div>
  );
}

export default App;
