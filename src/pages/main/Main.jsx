import "./main.scss";
import React, {useState, useEffect, useContext, useMemo} from "react";

import Logo from "../../assets/KO_logo.png";
import SmallLogo from "../../assets/SmallLogo.png";

/* Component Import */
import Navbar from "../nav/Navbar";
import Widgets from "../../components/widget/Widgets";
import StatusPercent from "../../components/statusPercent/StatusPercent";
import Diagnostic from "../../components/diagnostic/Diagnostic";

import TableChart from "../../components/tableChart/TableChart";
import Table from "../../components/table/Table";


import BeforeTable from "../../components/beforeTable/BeforeTable";

import OpenStreetMap from "../../components/map/OpenstreetMap";
import Container from '@mui/material/Container';

import { Grid, Button, darken } from "@mui/material";
import * as AiIcons from 'react-icons/ai';

import { IconContext } from 'react-icons';

import MenuIcon from '@mui/icons-material/Menu';

/* -- MUI -- */
import {styled, useTheme} from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import {Link} from "react-router-dom";
import Timer from "../nav/timer/Timer";
import Alarm from "../../components/navbar/alarm/Alarm";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import {SidebarData} from "../nav/side/Sidebar";
import {DarkModeContext} from "../../context/darkModeContext";
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Settings from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import PersonAdd from '@mui/icons-material/PersonAdd';
import MaterialReactTable from 'material-react-table';
import DiagDevice from "../../components/table/diag/DiagDevice";



const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const Main = () => {
    const[feed] = useState([]);

    // nmsCurrent Device Info
    const[nmsCurrent, setNmsCurrent] = useState([]);

    // Table Row Click(device Select)
    const[selectDevice, setSelectDevice] = useState();

    // Present Status Device Info
    const [deviceStatus, setDeviceStatus] = useState({
        preRunningDv:[],
        preCautionDv:[],
        preWarningDv:[],
        preFaultyDv:[],
    });

    // Past Status Device Info
    const [befoDeviceStatus, setBefoDeviceStatus] = useState ({
        pastRunningDv: [],
        pastCautionDv: [],
        pastWarningDv: [],
        pastFaultyDv: [],
    });

    // Status Count Button Click Value -> running/caution/warning/faulty
    const [statusClickValue, setStatusClickValue] = useState("");

    const [optionClickValue, setOptionClickValue] = useState("");

    function MapChange(data) { // Table
        setNmsCurrent(data); // Map
    }

    // Table Row(device) Click, Map Marker changed (location)
    function MapClick(deviceId) {
        setSelectDevice(deviceId); // deviceId
    }

    // Present Status Count
    function WidgetCount(info) {
        setDeviceStatus(info) //{danger: 30, warning: 2, running: 253}
    }

    // Past Status Count
    function BefoWidgetCount(befo) {
        setBefoDeviceStatus(befo)
    }

    // Status Button 클릭시 Filter에 따른 테이블 변화
    function StatusClick(status) {
        setStatusClickValue(status); //running
    }

    function OptionClick(option) {
        setOptionClickValue(option);
    }

    const columns = useMemo(
        () => [
            {
                header: 'Manage Crp Nm',
                accessorKey: 'manageCrpNm',
                size: 150,
            },
            {
                header: 'Crp Nm',
                accessorKey: 'crpNm',
                enableColumnFilterModes: false,
            },
            {
                header: 'Device ID',
                accessorKey: 'deviceId',
                enableGrouping: false, //do not let this column be grouped
                enableColumnFilterModes: false,
            },
            {
                header: 'Vhcle Nm',
                accessorKey: 'vhcleNm',
                size: 100,
                enableColumnFilterModes: false,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                size: 100,
            },
            {
                header: 'Status Desc',
                accessorKey: 'statusDesc',
                size: 210,
            },
        ],
        [],
    );


    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                    <DrawerHeader />
                    <Container maxWidth="false">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                        enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                        imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                        Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                        Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                        nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                        leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                        feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                        consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                        sapien faucibus et molestie ac.
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Today's Status</span><br/>
                                        <span className="widgetContext">Status according to message reception time</span>
                                    </div>
                                    <div className="widgetContain">
                                        <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                        <Widgets className="widget" type="caution" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                        <Widgets className="widget" type="warning" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                        <Widgets className="widget" type="faulty" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                    </div>
                                </div>
                            </Grid>
                            {/*<Grid item xs={3}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Status Percentage</span><br/>
                                    </div>
                                    <div className="widgetContain">
                                        <StatusPercent deviceStatus={deviceStatus}/>
                                    </div>
                                </div>
                            </Grid>*/}
                        </Grid><br/><br/>

                        {/*<Grid container spacing={1}>
                            <Grid item xs={4}>
                                <div className="component_box">
                                    <BeforeTable deviceStatus={deviceStatus} BefoWidgetCount={BefoWidgetCount}/>
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <div className="component_box">
                                    <OpenStreetMap feed={feed} nmsCurrent={nmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue}/>
                                </div>
                            </Grid>
                        </Grid><br/>*/}

                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Status Percentage</span><br/>
                                    </div>
                                    <div className="widgetContain">
                                        <StatusPercent deviceStatus={deviceStatus} />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={9}>
                                <div className="widgets">
                                    <Diagnostic />
                                </div>
                            </Grid>
                        </Grid><br/><br/>


                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Table</span><br/>
                                        <span className="widgetContext">Current All Data</span>
                                    </div>
                                    <div className="table">
                                        <Table MapChange={MapChange} MapClick={MapClick} WidgetCount={WidgetCount} statusClickValue={statusClickValue} optionClickValue={optionClickValue}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="widgets">
                                    <div className="widgetText">
                                        <span className="widgetTitle">Map</span><br/>
                                        <span className="widgetContext">Network Status Markers</span>
                                    </div>
                                    <div className="map">
                                        <OpenStreetMap feed={feed} nmsCurrent={nmsCurrent} selectDevice={selectDevice} statusClickValue={statusClickValue} />
                                    </div>
                                </div>

                            </Grid>
                        </Grid><br/>


                        {/*<Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                            enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                            imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                            Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                            Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                            nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                            leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                            feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                            sapien faucibus et molestie ac.
                        </Typography>
                        <Typography paragraph>
                            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                            eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                            neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                            tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                            sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                            tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                            tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                            eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                            posuere sollicitudin aliquam ultrices sagittis orci a.
                        </Typography>*/}

                        {/*<div className="widgets">
                            <div className="widgetText">
                                <span className="widgetTitle">Today's Status</span><br />
                                <span className="widgetContext">status according to message reception time</span>
                            </div>
                            <div className="widgetContain">
                                <Widgets className="widget" type="running" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                <Widgets className="widget" type="caution" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick} />
                                <Widgets className="widget" type="warning" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                                <Widgets className="widget" type="faulty" deviceStatus={deviceStatus} befoDeviceStatus={befoDeviceStatus} StatusClick={StatusClick} statusClickValue={statusClickValue} OptionClick={OptionClick}/>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>

                        <div className="table">
                            <Table MapChange={MapChange} MapClick={MapClick} WidgetCount={WidgetCount} statusClickValue={statusClickValue} optionClickValue={optionClickValue}/>
                        </div>*/}
                        {/*<Typography paragraph>
                        </Typography>*/}
                        {/*<Grid container spacing={1}>
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>*/}
                    </Container>

                </Box>
            </Box>
        </>
    )
}

export default Main;