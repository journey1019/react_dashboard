import "./detail.scss";
import React, {useState, useEffect, useContext, useMemo} from "react";
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
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import StatusPercent from "../statusPercent/StatusPercent";



const Detail = () => {


    return(
        <>
            <div className="input">
                <Grid item sm={5.5}>
                    <div className="searchDevice">
                        <SearchIcon />
                    </div>
                </Grid>
                <Grid item sm={5.5}>
                    <div className="searchDate">
                        {/*<span style={{fontSize:'15px', color: 'darkgray'}}>|</span>*/}
                        <CalendarTodayIcon/>
                    </div>
                </Grid>
                <Grid item sm={1}>
                    <Button variant="contained" color="error" size="large" sx={{ textAlign: 'center', alignItems: 'center'}}>Search</Button>
                </Grid>
            </div><br/><br/>

            <Box className="deviceInfo">
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', padding: '30px 30px 10px 30px', width: 1 }}>
                    <Tooltip title="Account settings" sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Avatar sx={{ width: 100, height: 100, fontSize: '30px', color: '#394251', backgroundColor: '#FAFBFC', fontWeight: 'bold', borderStyle: 'solid', borderColor: '#F3F3F3', borderWidth: '5px'}}>영</Avatar>

                        {/*<Paper sx={{ display: 'flex', justifyItems: 'center', flexWrap: 'wrap', listStyles: 'none', p: 0.5, m: 0 }} component="ul">
                                        {chipData.map((data) => {
                                            let icon;

                                            if (data.label === 'React') {
                                                icon = <TagFacesIcon />;
                                            }

                                            return (
                                                <ListItem key={data.key}>
                                                    <Chip
                                                        icon={icon}
                                                        label={data.label}
                                                        onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </Paper>*/}
                    </Tooltip>
                </Box>

                <Box sx={{display: 'flex', width: 1}}>
                    <div className="deviceIdText">
                        <div className="deviceIdTitle">
                            01680675SKY33EC
                        </div>
                        <div className="deviceIdSubTitle">
                            영산강 홍수통제소 _ 01680675SKY33EC
                        </div>
                    </div>
                </Box>

                <Box sx={{display: 'flex', width: 1}}>
                    <Box className="basicInfo">
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                등록일자(설치일자)
                            </div><hr/>
                            <div className="descriptionContain">
                                YYYY-MM-DDTHH:MM:SS
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                상태
                            </div><hr/>
                            <div className="descriptionContain">
                                Warning
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                위성신호레벨
                            </div><hr/>
                            <div className="descriptionContain">
                                43.6
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                평균신호레벨
                            </div><hr/>
                            <div className="descriptionContain">
                                43.8
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                데이터 수집 주기
                            </div><hr/>
                            <div className="descriptionContain">
                                5분
                            </div>
                        </Box>
                        <Box className="description" sx={{ fontSize: '15px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="descriptionName">
                                마지막 데이터 수집 시간
                            </div><hr/>
                            <div className="descriptionContain">
                                10분
                            </div>
                        </Box>
                    </Box>
                </Box><br/>

                <Box sx={{display: 'flex', width: 1}}>
                    <Grid item sm={6} sx={{pr: 3}}>
                        <div className="alertInfo">
                            <div className="alertInfoTitle">
                                Alert Table || Alarm 처럼 리스트
                            </div><hr/>
                            <div className="alertInfoContain">
                                Issue Table
                            </div>
                        </div>
                    </Grid >
                    <Grid item sm={6} sx={{pr: 3}}>
                        <div className="alertInfo">
                            <div className="alertInfoTitle">
                                Alarm Navigation
                            </div><hr/>
                            <div className="alertInfoContain">
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="error">
                                        <AlertTitle>Error</AlertTitle>
                                        This is an error alert — <strong>check it out!</strong>
                                    </Alert>
                                    <Alert severity="warning">
                                        <AlertTitle>Warning</AlertTitle>
                                        This is a warning alert — <strong>check it out!</strong>
                                    </Alert>
                                    <Alert severity="info">
                                        <AlertTitle>Info</AlertTitle>
                                        This is an info alert — <strong>check it out!</strong>
                                    </Alert>
                                    <Alert severity="success">
                                        <AlertTitle>Success</AlertTitle>
                                        This is a success alert — <strong>check it out!</strong>
                                    </Alert>
                                </Stack>
                            </div>
                        </div>
                    </Grid>
                </Box>
            </Box><br/><br/>


            <div className="deviceInfo">
                <Grid item sm={12}>
                    <div className="deviceIdText">
                        <div className="deviceIdTitle">
                            Event Time Line
                        </div>
                        <div className="deviceIdSubTitle">
                            Event Time Line Contain
                        </div><hr/>
                        <div className="deviceIdSubTitle">
                            <DetailAlarmHistory />
                        </div>
                    </div>
                </Grid>
            </div><br/><br/>


            <div className="deviceInfo">
                <Grid item sm={12} >
                    <div className="deviceIdText">
                        <div className="deviceIdTitle">
                            Satellite
                        </div><hr/>
                        <div className="deviceIdSubTitle">
                            <DetailSatellite />
                        </div>
                    </div>
                </Grid>
            </div><br/><br/>

            <div className="deviceInfo">
                <div className="deviceIdText" >
                    <div className="deviceIdTitle">
                        History Table
                    </div><hr/>
                    {/*<div className="historyTable" style={{ display: 'block', width: '90vw'}}>
                        <History />
                    </div>*/}
                </div>
            </div><br/><br/>

            <div className="deviceInfo">
                <Grid item sm={12}>
                    <div className="deviceIdText">
                        <div className="deviceIdTitle">
                            History Chart
                        </div><hr/>
                        <div className="historyChart">
                            {/*<History width={1200}/>*/}
                        </div>
                    </div>
                </Grid>
                {/*<History />*/}
            </div><br/><br/>
        </>
    )
}

export default Detail;