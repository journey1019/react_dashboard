/* React */
import React, { useEffect, useRef, useState } from 'react';

/* Import */
import Main from "../../components/main/Main";
import Navbar from "../nav/Navbar";

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



const MainPage = () => {

    console.log('메인페이지 불렀어~~~~메인페이지 불렀어~~~~메인페이지 불렀어~~~~')

    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 3, backgroundColor: '#F8F8F8' }}> {/*#E1E2E7*/}
                    <DrawerHeader />
                    {/*<Grid container spacing={1} sx={{backgroundColor:'white'}}>
                        Breadcrumbs도 component화 해서 매 페이지마다 적용
                    </Grid>*/}
                    <Main />
                </Box>
            </Box>
        </>
    )
}

export default MainPage;