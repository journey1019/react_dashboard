import "./detailDevice.scss";
import React, {useState, useEffect, useContext, useMemo} from "react";
import Navbar from "../nav/Navbar";
import Detail from "../../components/detail/Detail";
import History from "../../components/TableComponents/History/History";

/* MUI */
import Box from '@mui/material/Box';
import {styled} from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Grid, Button, darken } from "@mui/material";

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
                <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                    <DrawerHeader />
                    <Container maxWidth="false">
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Detail />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default DetailDevice;