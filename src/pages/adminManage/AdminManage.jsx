import './AdminManage.scss';
import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../nav/Navbar";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {styled} from "@mui/material/styles";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
const AdminManage = () => {
    return(
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                    <DrawerHeader />
                    <Container maxWidth="false">
                        Admin Management Page!!
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default AdminManage;