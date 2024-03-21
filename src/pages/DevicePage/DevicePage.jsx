/* React */
import React from "react";

/* Import */
import Navbar from "../nav/Navbar";
import Device from "../../components/device/Device";

/* MUI */
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Box, Container, Button, styled, darken } from "@mui/material";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import {Link} from "react-router-dom";
import IconButton from "@mui/material/IconButton";


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DevicePage = () => {

    return(
        <>
            {/*<IconButton size="large" component={Link} to={'/devicePage'} aria-label="Go To DevicePage" color="error" onClick={()=> navigate('/devicePage')}>
                <DevicesRoundedIcon />
            </IconButton>*/}
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                    <DrawerHeader />
                    <Device />
                </Box>
            </Box>
        </>
    )
}

export default DevicePage;