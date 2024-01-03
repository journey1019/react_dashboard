import Navbar from "../nav/Navbar";
import "./home.scss";
import React, { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import CssBaseline from "@mui/material/CssBaseline";
import {styled} from "@mui/material/styles";
import { Grid, Button, Box } from "@mui/material";
import Container from '@mui/material/Container';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Home = () => {

    return (
      <>
          <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                  <DrawerHeader />
                  <Container maxWidth="false">
                      <Grid container spacing={1}>
                          <Grid item xs={12}>
                              <h1>Korea ORBCOMM NMS Hompage</h1>
                          </Grid>
                      </Grid>
                  </Container>
              </Box>
          </Box>
      </>
  );
};
export default Home;

