import React from "react";
import { Grid, Box, Container, Button, styled, darken } from "@mui/material";
import Navbar from "../nav/Navbar";
import CssBaseline from "@mui/material/CssBaseline";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Support = () => {
    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, p: 2, backgroundColor: 'white', textAlign:'center', justifyContent: 'center', alignContent : 'center' }}> {/*#E1E2E7*/}
                    <DrawerHeader />
                    <ul>Tel : 02-3444-7311</ul>
                    <ul>문의 : jhlee@orbcomm.co.kr</ul>
                </Box>
            </Box>
        </>
    );
}

export default Support;