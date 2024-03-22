/* React */
import React, { useEffect, useRef, useState } from 'react';

import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Box, Container, Button, styled, darken } from "@mui/material";
import Navbar from "../nav/Navbar";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Ais = () => {
    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, p: 2, backgroundColor: '#F8F8F8' }}> {/*#E1E2E7*/}
                    <DrawerHeader />
                    <iframe src="http://testvms.commtrace.com:12003/index.do?userId=orbcomm&userPwd=orbcomm" width="100%" height="1000px"></iframe>
                </Box>
            </Box>
        </>
    );
}

export default Ais;