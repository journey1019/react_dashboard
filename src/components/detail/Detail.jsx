import "./detail.scss";
import React, {useState, useEffect, useContext, useMemo} from "react";


/* -- MUI -- */
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
import MaterialReactTable from 'material-react-table';
import DiagDevice from "../../components/table/diag/DiagDevice";
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const Detail = () => {

    // Chip
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Angular' },
        { key: 1, label: 'jQuery' },
        { key: 2, label: 'Polymer' },
        { key: 3, label: 'React' },
        { key: 4, label: 'Vue.js' },
    ]);
    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };



    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
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
                    </div>
                </Grid>
            </Grid><br/><br/>

            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <div className="deviceInfo">
                        <Grid item sm={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', padding: '30px' }}>
                                <Tooltip title="Account settings" sx={{ display: 'flex', flexDirection: 'row' }}>

                                    <Avatar sx={{ width: 100, height: 100, fontSize: '30px', color: 'black', backgroundColor: '#FAFBFC', borderStyle: 'solid', borderColor: '#F3F3F3'}}>영</Avatar>

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
                            <Box>
                                <div className="deviceIdText">
                                    <div className="deviceIdTitle">
                                        0123456789
                                    </div>
                                    <div className="deviceIdSubTitle">
                                        영산강 홍수통제소 _ 0123456789
                                    </div>
                                </div>
                            </Box>
                            <Box>
                                Device ID 및 소개
                            </Box>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default Detail;