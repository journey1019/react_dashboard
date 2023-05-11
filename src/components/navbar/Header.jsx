import "./headerStyles.scss";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";


// X Icon
import { IconContext } from 'react-icons';


/////////////////////////////////////////////////////////////////
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';

import Logo from "../../assets/ORBCOMM_Logo.png";

import { NavLink } from "react-router-dom";

import FastFoodIcon from "@mui/icons-material/Fastfood";
import { Link } from 'react-router-dom'







const Header = () => {
  const { dispatch } = useContext(DarkModeContext);

  //const [ sidebar, setSidebar ] = useState(false);

  //const showSidebar = () => setSidebar(!sidebar)

  const [mobileOpen, setMobileOpen] = useState(false)
  // handle menu click
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // menu drawer
  const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography color={"goldenrod"} variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <img src={Logo} alt="logo" height={"70"} width="200" />
        </Typography>
        <Divider />
        <ul classNam="mobile-navigation">
          <li>
            <NavLink activeClassName="active" to={"/"}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={"/menu"}>Menu</NavLink>
          </li>
          <li>
            <NavLink to={"/about"}>About</NavLink>
          </li>
          <li>
            <NavLink to={"/contact"}>Contact</NavLink>
          </li>
        </ul>

      </Box>
  )

  return (
      <>
        <Box>
          <AppBar component={"nav"} sx={{ bgcolor: "black"}}>
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{mr:2, display:{sm:'none'}, }} onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Typography color={"goldenrod"} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img srt={Logo} alt="logo" height={"70"} width="250" />
                <Link to="/" style={{ textDecoration: "none" }}>
                  KOREA ORBCOMM
                </Link>
              </Typography>

              <Box sx={{display: {xs:"none", sm:"block"} }}>
                <ul className="navigation-menu">
                  <li>
                    <NavLink activateClassName="active" to={"/"}>Home</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/dashboard"}>Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/user"}>User</NavLink>
                  </li>
                </ul>

              </Box>
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              sx={{
                display: {xs: "block", sm: "none"},
                "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                  width: "240px",
                  },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Box>
            <Toolbar />
          </Box>
        </Box>
      </>
  );
};

export default Header;