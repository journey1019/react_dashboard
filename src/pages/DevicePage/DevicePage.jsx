/* React */
import React from "react";

/* Import */
import Navbar from "../nav/Navbar";
import Device from "../../components/device/Device";

/* MUI */
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Box, Container, Button, styled, darken } from "@mui/material";


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DevicePage = () => {
    console.log('메인 페이지야~~~~!!!!!!!!!!!!!!!!!!!!!!!')

    return(
        <>
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