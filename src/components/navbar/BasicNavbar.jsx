import "./basicnavbar.scss";
//import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

import React, { useState } from "react";

import MenuIcon from '@mui/icons-material/Menu';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from "../sidebar/SidbarData";
// X Icon
import { IconContext } from 'react-icons';

// react-bootstrap, bootstrap
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { AppBar, Box, Divider, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/ORBCOMM_Logo.png";

const BasicNavbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  const [ sidebar, setSidebar ] = useState(false);
  const showSidebar = () => setSidebar(!sidebar)


  const [ mobileOpen, setMobileOpen ] = useState(false)

  const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };

  const drawer = (
      <Box onClick = { handleDrawerToggle } sx = {{textAlign: "center" }}>
        <Typography color={"gray"} wariant="h6" component="div" sx={{flexGrow:1}}>
          <NavLink to={"/"} style={{ textDecoration: "none" }}> KOREA ORBCOMM </NavLink>
        </Typography>

        <Divider />

        <ul className="mobile-navigation">
          <li>
            <NavLink activeClassName="active" to={"/"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to={"/user"}>User</NavLink>
          </li>
        </ul>

      </Box>
  )


  return (
      <>
        <Box>
          <AppBar component={"nav"} sx={{ bgcolor: "gray"}}>
            <Toolbar>
              <IconButton color="white" aria-label="open drawer" edge="start" sx={{mr:2, display:{sm:'none'}, }} onClick={handleDrawerToggle}>

                <Link to='#' className = "menu-bars">
                  <MenuIcon onClick={handleDrawerToggle} />
                </Link>

              </IconButton>

              <Typography color={"gray"} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img src={Logo} alt="logo" height={"70"} width="250" />
                <Link to="/" style={{ textDecoration: "none" }}>
                  KOREA ORBCOMM
                </Link>
              </Typography>

              <Box sx={{display: {xs:"none", sm:"white"} }}>
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
                  display: {xs: "gray", sm: "none"},
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

export default BasicNavbar;