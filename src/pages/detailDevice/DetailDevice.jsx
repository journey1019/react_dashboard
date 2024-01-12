/* React */
import React, {useState, useEffect, useContext, useMemo} from "react";

/* Import */
import "./detailDevice.scss";
import Navbar from "../nav/Navbar";
import Detail from "../../components/detail/Detail";
import History from "../../components/TableComponents/History/History";

/* MUI */
import Box from '@mui/material/Box';
import {styled} from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Grid, Button, darken } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DetailDevice = () => {



    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 3, width: 1 }}>
                    <DrawerHeader />
                    {/*<Box sx={{ width: '98vw', p:5, pt: 10}}>
                        <Detail />
                    </Box>*/}
                    <Container maxWidth="false" sx={{ width: '95vw', pl: 0, pr: 0, m: 0}}>
                        <Detail />
                        {/*<Box sx={{width: '90vw', p: 1}}>
                            <Detail />
                        </Box>*/}
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default DetailDevice;