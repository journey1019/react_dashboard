import Main from "../../components/main/Main";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../nav/Navbar";
import React from "react";

import { Grid, Box, Container, Button, styled, darken } from "@mui/material";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const MainPage = () => {
    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                    <DrawerHeader />
                    <Main />
                </Box>
            </Box>
        </>
    )
}

export default MainPage;