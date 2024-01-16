import "./detail.scss";
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Component */
import DetailInput from "./detailInput/DetailInput";
import DetailInfo from "./detailInfo/DetailInfo";
import DetailEventTime from "./detailEventTime/DetailEventTime";
import DetailHistory from "./detailHistory/DetailHistory";
import DetailHistoryChart from "./detailHistoryChart/DetailHistoryChart"

import History from "../TableComponents/History/History";
import DetailAlarmHistory from "./detailAlarmHistory/DetailAlarmHistory";
import DetailSatellite from "./detailSatellite/DetailSatellite";

/* -- MUI -- */
import MaterialReactTable from 'material-react-table';
import {styled, useTheme} from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from "@mui/material/Drawer";
import Container from '@mui/material/Container';
import { Grid, Button, darken } from "@mui/material";
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
import Alarm from "../../components/navbar/alarm/Alarm";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import {DarkModeContext} from "../../context/darkModeContext";
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Settings from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import PersonAdd from '@mui/icons-material/PersonAdd';
import DiagDevice from "../../components/table/diag/DiagDevice";


import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import StatusPercent from "../statusPercent/StatusPercent";



const Detail = (props) => {
    const deviceId = props.deviceId;

    /*const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');*/
    const [date, setDate] = useState([]);

    function InputDate(date){
        setDate(date);
    }





    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DetailInput deviceId={deviceId} InputDate={InputDate}/>
                    <br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailInfo deviceId={deviceId} date={date}/>
                    <br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailEventTime deviceId={deviceId} date={date}/>
                </Grid>
                <Grid item xs={12}>
                    <DetailSatellite deviceId={deviceId} date={date}/>
                    <br/><br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailHistory deviceId={deviceId} date={date}/>
                    <br/><br/>
                </Grid>
                <Grid item xs={12}>
                    <DetailHistoryChart deviceId={deviceId} date={date}/>
                    <br/><br/>
                </Grid>
            </Grid>
        </>
    )
}

export default Detail;