import "./main.scss";
import React, { useState, useEffect, useContext } from "react";

/* Component Import */
import Navbar from "../nav/Navbar";
import TableChart from "../../components/tableChart/TableChart";
import Table from "../../components/table/Table";

import Widgets from "../../components/widget/Widgets";
import Widget from "../../components/widgets/Widget";
import BeforeTable from "../../components/beforeTable/BeforeTable";

import OpenStreetMap from "../../components/map/OpenstreetMap";
import Container from '@mui/material/Container';

import { Grid, Button, darken } from "@mui/material";
import * as AiIcons from 'react-icons/ai';

import { IconContext } from 'react-icons';

import MenuIcon from '@mui/icons-material/Menu';

/* -- MUI -- */
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const Main = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const [feed] = useState([]);
    const [nmsCurrent, setNmsCurrent] = useState([]);
    const[selectDevice, setSelectDevice] = useState();
    const [deviceStatus, setDeviceStatus] = useState({
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    });
    const [befoDeviceStatus, setBefoDeviceStatus] = useState ({
        pastRunningDv: [],
        pastCautionDv: [],
        pastWarningDv: [],
        pastFaultyDv: [],
    });
    const [statusClickValue, setStatusClickValue] = useState("");
    const [optionClickValue, setOptionClickValue] = useState("");
    function MapChange(data) { // Table
        setNmsCurrent(data); // Map
    }
    function MapClick(deviceId) {
        setSelectDevice(deviceId); // deviceId
    }
    function WidgetCount(info) {
        setDeviceStatus(info) //{danger: 30, warning: 2, running: 253}
    }
    function BefoWidgetCount(befo) {
        setBefoDeviceStatus(befo)
    }
    function StatusClick(status) {
        setStatusClickValue(status); //running
    }
    function OptionClick(option) {
        setOptionClickValue(option);
    }



    return(
        <>
            <div className="mainPage">
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Navbar/>
                    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#FAFBFC'}}>
                        <DrawerHeader />

                        <Box className="component" sx={{width: '93vw'}}>
                            <Box sx={{pb:1}}>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Status</Typography>
                                <Typography sx={{color: "#B0B7C3"}}>Today's Status Info</Typography>
                            </Box>
                        </Box>

                        {/*<Box className="component" >
                            <Box sx={{pb:1}}>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Status</Typography>
                                <Typography sx={{color: "#B0B7C3"}}>Today's Status Info</Typography>
                            </Box>
                            <Box className="widgetContain" sx={{display: 'flex'}}>
                                <Box>네트워크 도넛차트</Box>
                                <Widget deviceStatus={deviceStatus} />
                                <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                            </Box>
                        </Box><br/>

                        <Box className="component" style={{width: '93vw'}}>
                            <Box sx={{pb:1}}>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Network</Typography>
                                <Typography sx={{color: "#B0B7C3"}}>Today's Table Data</Typography>
                            </Box>
                            <Box>
                                <Table MapChange={MapChange} MapClick={MapClick} WidgetCount={WidgetCount} statusClickValue={statusClickValue} optionClickValue={optionClickValue}/>
                            </Box>
                        </Box><br/>

                        <Box className="component" style={{width: '93vw'}}>
                            <Box sx={{pb:1}}>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Table</Typography>
                                <Typography sx={{color: "#B0B7C3"}}>Today's Table Data</Typography>
                            </Box>
                            <Box>

                            </Box>
                        </Box><br/>*/}

                        {/*<Box component="widgets">

                                <div className="widgetText">
                                    <span className="widgetTitle">Today's Status</span><br />
                                    <span className="widgetContext">status according to message reception time</span>
                                </div>

                                <div className="widgetContain" style={{display: "flex"}}>
                                    <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                    <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                    <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                    <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                </div>
                            </Box>*/}
                        {/*<Typography paragraph>
                                ㅇㅇ
                            </Typography>*/}
                    </Box>
                </Box>
            </div>
        </>
    )
}

export default Main;